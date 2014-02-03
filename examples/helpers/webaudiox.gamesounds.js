/**
 * @namespace
 */
var WebAudiox	= WebAudiox	|| {}

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
	
	var bank	= []
	this.bank	= bank
	
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
		if( this.listenerUpdater ){
			this.listenerUpdater.update(delta)
		}
		// update each bank
		Object.keys(bank).forEach(function(label){
			var sound	= bank[label]
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
	this.createSound	= function(options){
		return new WebAudiox.GameSound(this, options)
	}
	

	//////////////////////////////////////////////////////////////////////////////////
	//		handle .listenerAt						//
	//////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Set the listener position
	 * @param  {THREE.Vector3|THREE.Object3D} position the position to copy
	 * @return {WebAudiox.GameSounds} the object itself for linked API
	 */
	this.listenerAt	= function(position){
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
	this.listenerFollow	= function(object3d){
		// put a ListenerObject3DUpdater
		var listenerUpdater	= new WebAudiox.ListenerObject3DUpdater(context, object3d)
		this.listenerUpdater	= listenerUpdater
		return this
	}
	
	/**
	 * Make the listener Stop Following the object 
	 * @return {WebAudiox.GameSounds} the object itself for linked API
	 */
	this.listenerStopFollow	= function(){
		context.listener.setVelocity(0,0,0);
		this.listenerUpdater	= null	
		return this
	}
}

//////////////////////////////////////////////////////////////////////////////////
//		WebAudiox.GameSound						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * a sound from WebAudiox.GameSounds
 * @param {WebAudiox.GameSounds} gameSounds     
 * @param {Object} defaultOptions the default play options
 */
WebAudiox.GameSound	= function(gameSounds, defaultOptions){
	this.gameSounds		= gameSounds	|| console.assert(false)
	this.defaultOptions	= defaultOptions|| {}

	//////////////////////////////////////////////////////////////////////////////////
	//		register/unregister in gameSound				//
	//////////////////////////////////////////////////////////////////////////////////
		
	this.label	= null;	
	this.register	= function(label){
		console.assert(gameSounds.bank[label] === undefined, 'label already defined')
		gameSounds.bank[label]	= this
		return this;
	}
	this.unregister	= function(){
		if( this.label === null )	return;
		delete gameSounds.bank[label]
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
	//		play								//
	//////////////////////////////////////////////////////////////////////////////////
	
// TODO change play in createUtterance

	this.play	= function(options){
		options		= options || this.defaultOptions

		var utterance	= {}
		var context	= gameSounds.context
		var destination	= gameSounds.lineOut.destination;

		// honor .position: vector3
		if( options.position !== undefined ){
			// init AudioPannerNode if needed
			if( utterance.pannerNode === undefined ){
				var panner	= context.createPanner()
				panner.connect(destination)
				utterance.pannerNode	= panner
				destination		= panner				
			}
			// set the value
			if( options.position instanceof THREE.Vector3 ){
				WebAudiox.PannerSetPosition(panner, options.position)			
			}else if( options.position instanceof THREE.Object3D ){
				WebAudiox.PannerSetObject3D(panner, options.position)			
			}else	console.assert(false, 'invalid type for .position')
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
			var pannerUpdater	= new WebAudiox.PannerObject3DUpdater(panner, mesh)
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
		source.buffer	= this.buffer
		source.connect(destination)
		destination	= source

		if( options.loop !== undefined )	source.loop	= options.loop

		// start the sound now
		source.start(0)

		utterance.sourceNode	= source
		utterance.stop		= function(delay){
			source.stop(delay)
			if( this.stopFollow )	this.stopFollow()
		}
		
		return utterance
	}
}
