/**
 * @namespace
 */
var WebAudiox	= WebAudiox	|| {}


//////////////////////////////////////////////////////////////////////////////////
//		WebAudiox.GameSounds
//////////////////////////////////////////////////////////////////////////////////

/**
 * a specific helpers for gamedevs to make WebAudio API easy to use for their case
 */
WebAudiox.GameSounds	= function(){
	// create WebAudio API context
	var context	= new AudioContext()
	this.context	= context

	// Create lineOut
	var lineOut	= new WebAudiox.LineOut(context)
	this.lineOut	= lineOut
	
	var clips	= {}
	this.clips	= clips
	
	/**
	 * show if the Web Audio API is detected or not
	 * 
	 * @type {boolean}
	 */
	this.webAudioDetected	= AudioContext ? true : false

	//////////////////////////////////////////////////////////////////////////////////
	//		update loop							//
	//////////////////////////////////////////////////////////////////////////////////

	/**
	 * the update function
	 * 
	 * @param  {Number} delta seconds since the last iteration
	 */
	this.update	= function(delta){
		// update each clips
		Object.keys(clips).forEach(function(label){
			var sound	= clips[label]
			sound.update(delta)
		})
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		create Sound							//
	//////////////////////////////////////////////////////////////////////////////////
			
	/**
	 * create a sound from this context
	 * @param  {Object} options the default option for this sound, optional
	 * @return {WebAudiox.GameSound}	the created sound
	 */
	this.createClip	= function(options){
		return new WebAudiox.GameSoundClip(this, options)
	}
}


//////////////////////////////////////////////////////////////////////////////////
//		WebAudiox.GameSoundListener
//////////////////////////////////////////////////////////////////////////////////


WebAudiox.GameSoundListener	= function(gameSounds){
	var context		= gameSounds.context
	this.listenerUpdater	= null
	//////////////////////////////////////////////////////////////////////////////////
	//		update loop							//
	//////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * the update function
	 * 
	 * @param  {Number} delta seconds since the last iteration
	 */
	this.update	= function(delta){
		if( this.listenerUpdater ){
			this.listenerUpdater.update(delta)
		}
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		handle .at
	//////////////////////////////////////////////////////////////////////////////////
	/**
	 * Set the listener position
	 * @param  {THREE.Vector3|THREE.Object3D} position the position to copy
	 * @return {WebAudiox.GameSounds} the object itself for linked API
	 */
	this.at	= function(position){
		if( position instanceof THREE.Vector3 ){
			WebAudiox.ListenerSetPosition(context, position)	
		}else if( position instanceof THREE.Object3D ){
			WebAudiox.ListenerSetObject3D(context, position)	
		}else	console.assert(false)
		return this
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		handle .follow/.unFollow					//
	//////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Make the listener follow a three.js THREE.Object3D
	 * 
	 * @param  {THREE.Object3D} object3d the object to follow
	 * @return {WebAudiox.GameSounds} the object itself for linked API
	 */
	this.startFollow= function(object3d){
		// put a ListenerObject3DUpdater
		this.listenerUpdater	= new WebAudiox.ListenerObject3DUpdater(context, object3d)
		return this
	}
	
	/**
	 * Make the listener Stop Following the object 
	 * @return {WebAudiox.GameSounds} the object itself for linked API
	 */
	this.stopFollow	= function(){
		context.listener.setVelocity(0,0,0);
		this.listenerUpdater	= null	
		return this
	}
}

//////////////////////////////////////////////////////////////////////////////////
//		WebAudiox.GameSoundClip
//////////////////////////////////////////////////////////////////////////////////

/**
 * a sound from WebAudiox.GameSounds
 * @param {WebAudiox.GameSounds} gameSounds     
 * @param {Object} defaultOptions the default play options
 */
WebAudiox.GameSoundClip	= function(gameSounds, defaultOptions){
	this.gameSounds		= gameSounds	|| console.assert(false)
	this.defaultOptions	= defaultOptions|| {}

	//////////////////////////////////////////////////////////////////////////////////
	//		register/unregister in gameSound				//
	//////////////////////////////////////////////////////////////////////////////////
		
	this.label	= null;	
	this.register	= function(label){
		console.assert(gameSounds.clips[label] === undefined, 'label already defined')
		gameSounds.clips[label]	= this
		return this;
	}
	this.unregister	= function(){
		if( this.label === null )	return;
		delete gameSounds.clips[label]
		return this;
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		update loop							//
	//////////////////////////////////////////////////////////////////////////////////
	
	var updateFcts	= []
	this.update	= function(delta){
		updateFcts.forEach(function(updateFct){
			updateFct(delta)
		})
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		load url							//
	//////////////////////////////////////////////////////////////////////////////////
	
	this.load	= function(url, onLoad, onError){
		this.loaded	= false
		this.buffer	= null
		WebAudiox.loadBuffer(gameSounds.context, url, function(decodedBuffer){
			this.loaded	= true
			this.buffer	= decodedBuffer;
			onLoad	&& onLoad(this)
		}.bind(this), onError)
		return this
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		createSource
	//////////////////////////////////////////////////////////////////////////////////	

	this.createSource	= function(opts){
		opts		= opts	|| {}
		var dfl		= this.defaultOptions
		var options	= {
			at	: opts.at !== undefined		? opts.at 	: dfl.at,
			follow	: opts.follow !== undefined	? opts.follow	: dfl.follow,
			volume	: opts.volume !== undefined 	? opts.volume	: dfl.volume,
			loop	: opts.loop !== undefined	? opts.loop	: dfl.loop,
		}
		var gameSource	= new WebAudiox.GameSoundSource(this, opts)
		return gameSource;
	}
	this.play	= function(opts){
		return this.createSource(opts).play()
	}
}


//////////////////////////////////////////////////////////////////////////////////
//		WebAudiox.GameSoundSource
//////////////////////////////////////////////////////////////////////////////////

WebAudiox.GameSoundSource = function(gameSound, options) {
	options		= options	|| {}
	var utterance	= this
	var gameSounds	= gameSound.gameSounds
	var context	= gameSounds.context
	var destination	= gameSounds.lineOut.destination;

	// honor .at: vector3
	if( options.at !== undefined ){
		// init AudioPannerNode if needed
		if( utterance.pannerNode === undefined ){
			var panner	= context.createPanner()
			panner.connect(destination)
			utterance.pannerNode	= panner
			destination		= panner				
		}
		// set the value
		if( options.at instanceof THREE.Vector3 ){
			WebAudiox.PannerSetPosition(panner, options.at)			
		}else if( options.at instanceof THREE.Object3D ){
			WebAudiox.PannerSetObject3D(panner, options.at.position)			
		}else	console.assert(false, 'invalid type for .at')
	}

	// honor .follow: mesh
	if( options.follow !== undefined ){
		// init AudioPannerNode if needed
		if( utterance.pannerNode === undefined ){
			var panner	= context.createPanner()
			panner.connect(destination)
			utterance.pannerNode	= panner
			destination		= panner				
		}
		// put a PannerObject3DUpdater
		var pannerUpdater	= new WebAudiox.PannerObject3DUpdater(panner, options.follow)
		utterance.pannerUpdater	= pannerUpdater
		utterance.stopFollow	= function(){
			updateFcts.splice(updateFcts.indexOf(updatePannerUpdater), 1)
			delete	utterance.pannerUpdater
		}
		function updatePannerUpdater(delta, now){
			pannerUpdater.update(delta, now)
		}			
		updateFcts.push(updatePannerUpdater)
	}

	// honor .volume = 0.3
	if( options.volume !== undefined ){
		var gain	= context.createGain();
		gain.gain.value	= options.volume
		gain.connect(destination)
		destination	= gain			
		utterance.gainNode	= gain
	}

	// init AudioBufferSourceNode
	var source	= context.createBufferSource()
	source.buffer	= gameSound.buffer
	source.connect(destination)
	destination	= source

	if( options.loop !== undefined )	source.loop	= options.loop
	utterance.sourceNode	= source

	// start the sound now
	utterance.play	= function(delay){
		delay	= delay !== undefined ? delay : 0		
		source.start(delay)
		return this
	}

	utterance.stop		= function(delay){
		delay	= delay !== undefined ? delay : 0		
		source.stop(delay)
		// TODO What if the sound is never stopped ? 
		// - the list of function will grow in the loop
		// - do a setTimeout with a estimation of duration ?
		if( this.stopFollow )	this.stopFollow()
		return this
	}
};
