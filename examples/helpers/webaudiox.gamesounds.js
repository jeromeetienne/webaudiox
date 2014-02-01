var WebAudiox	= WebAudiox	|| {}

/**
 * ## how to implement 3d in this
 * * GameSounds.update(delta)

 * * GameSounds.follow(camera)
 * * sound.follow(object3d).play()
 * * sound.lookAt(vector3).play()
 * * sound.at(vector3).play()
 * * sound.velocity(vector3).play()
 */

/**
 * attempts to a more structure sound banks
 */
WebAudiox.GameSounds	= function(){
	// create WebAudio API context
	var context	= new AudioContext()
	this.context	= context

	// Create lineOut
	var lineOut	= new WebAudiox.LineOut(context)
	this.lineOut	= lineOut
	
	/**
	 * show if the Web Audio API is detected or not
	 * @type {boolean}
	 */
	this.webAudioDetected	= AudioContext ? true : false
	

	//////////////////////////////////////////////////////////////////////////////////
	//		library API							//
	//////////////////////////////////////////////////////////////////////////////////
	
	var sounds	= {}
	this.sounds	= sounds
	
	this.labels	= function(){
		return Object.keys(sounds)
	}	
	this.has	= function(label){
		return sounds[label] !== undefined
	}
	this.get	= function(label){
		console.assert(sounds[label] !== undefined)
		return sounds[label]
	}
	this.add	= function(label, url, playFn, onLoad, onError){
		console.assert(sounds[label] === undefined)
		sounds[label]	= new WebAudiox.GameSound(this, url, playFn, onLoad, onError)
		return sounds[label]
	}
	this.remove	= function(label){
		delete sounds[label]
	}
	this.play	= function(label){
if( sounds[label] === undefined )	return
		console.assert(sounds[label] !== undefined)
		return sounds[label].play()
	}
}

WebAudiox.GameSound	= function(gameSounds, url, playFn, onLoad, onError){
	this.gameSounds	= gameSounds
	// handle default arguments
	playFn		= playFn || function(sound, context, destination){
		var source	= context.createBufferSource()
		source.buffer	= sound.buffer
		source.connect(destination)
		source.start(0)
		return source						
	}
	// load the sound
	this.buffer= null
	WebAudiox.loadBuffer(gameSounds.context, url, function(decodedBuffer){
		this.buffer	= decodedBuffer;
		onLoad	&& onLoad()
	}.bind(this), onError)
	
	this.isReady	= function(){
		return this.buffer !== null
	}

	this.play	= function(){
		// if not yet loaded, do nothing
		if( this.buffer === null )	return;
		var context	= gameSounds.context
		var destination	= gameSounds.lineOut.destination
		return playFn(this, context, destination)
	}
	
	// - volume
	// - set static position/orientation 
	// - set dynamic position/orientation/velocity
	//   - unhook with onended
	
	// possible three.js api
	// sound.at(position).play(3)
	// sound.follow(object3d).play(3)
	
	// this.play	= function(object3d, intensity){
		// * make it follow object3d
		//   * so this mean there is a update function 
		//   * (maybe there is already that in three.js event)
		//   * this mean it has to be unfollowed when the sound is over
		//   * how to know if a sound is over ? event ? setTimerout based on duration ?
		//   * how to get duration ?
		// * set a special intensity for this play
		// * pass parameter generically in GameSounds
		// * 
	// }
}