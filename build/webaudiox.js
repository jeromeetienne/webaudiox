var WebAudiox	= WebAudiox	|| {}

WebAudiox.AbsoluteNormalizer	= function(){
	var maxThreshold	= -Infinity;
	var minThreshold	= +Infinity;
	this.update	= function(value){
		// TODO make be good to smooth those values over time, thus it would forget
		// it would be the adaptative
		// and this one being absolute
		if( value < minThreshold ) minThreshold	= value
		if( value > maxThreshold ) maxThreshold = value
		// to avoid division by zero
		if( maxThreshold === minThreshold )	return value;
		// compute normalized value
		var normalized	= (value - minThreshold) / (maxThreshold-minThreshold);
		// return the just built normalized value between [0, 1]
		return normalized;
	}
}


var WebAudiox	= WebAudiox	|| {}

// TODO to rewrite with a simple weight average on a history array
// - simple and no magic involved

WebAudiox.AdaptativeNormalizer	= function(factorForMin, factorForMax){
	var minThreshold	= 0;
	var maxThreshold	= 1;
	this.update	= function(value){
		// smooth adapatation
		var smoothOut	= 0.01
		var smoothIn	= 0.01
		if( value < minThreshold )	minThreshold += (value-minThreshold)*smoothOut
		else				minThreshold += (value-minThreshold)*smoothIn
		if( value > maxThreshold )	maxThreshold += (value-maxThreshold)*smoothOut
		else				maxThreshold += (value-maxThreshold)*smoothIn
		// ensure bound are respected
		if( value < minThreshold ) value = minThreshold
		if( value > maxThreshold ) value = maxThreshold
		// to avoid division by zero
		if( maxThreshold === minThreshold )	return value;
		// compute normalized value
console.log(minThreshold.toFixed(10),maxThreshold.toFixed(10))
		var normalized	= (value - minThreshold) / (maxThreshold-minThreshold);
		// return the just built normalized value between [0, 1]
		return normalized;
	}
}

// @namespace defined WebAudiox name space
var WebAudiox	= WebAudiox	|| {}

/**
 * do a average on a ByteFrequencyData from an analyser node
 * @param  {[type]} analyser the analyser node
 * @param  {Number} width    how many elements of the array will be considered
 * @param  {Number} offset   the index of the element to consider
 * @return {Number}          the ByteFrequency average
 */
WebAudiox.analyserAverage	= function(analyser, width, offset){
	// handle paramerter
	width		= width !== undefined ? width	: analyser.frequencyBinCount;
	offset		= offset !== undefined ? offset	: 0;
	// inint variable
	var freqByte	= new Uint8Array(analyser.frequencyBinCount);
	// get the frequency data
	analyser.getByteFrequencyData(freqByte);
	// compute the sum
	var sum	= 0;
	for(var i = offset; i < offset+width; i++){
		sum	+= freqByte[i];
	}
	// complute the amplitude
	var amplitude	= sum / (width*256-1);
	// return ampliture
	return amplitude;
}
var WebAudiox	= WebAudiox	|| {}

/**
 * Generate a binaural sounds
 * http://htmlpreview.github.io/?https://github.com/ichabodcole/BinauralBeatJS/blob/master/examples/index.html
 * http://en.wikipedia.org/wiki/Binaural_beats
 * 
 * @param {Number} pitch    the frequency of the pitch (e.g. 440hz)
 * @param {Number} beatRate the beat rate of the binaural sound (e.g. around 2-10hz)
 * @param {Number} gain     the gain applied on the result
 */
WebAudiox.BinauralSource	= function(pitch, beatRate, gain){
	pitch	= pitch !== undefined ? pitch : 440
	beatRate= beatRate !== undefined ? beatRate : 5
	gain	= gain !== undefined ? gain : 1

	var gainNode	= context.createGain()
	this.output	= gainNode
	var destination	= gainNode
	
	var compressor	= context.createDynamicsCompressor();
	compressor.connect(destination)
	destination	= compressor

	var channelMerge= context.createChannelMerger()
	channelMerge.connect(destination)
	destination	= channelMerge
	
	var leftOscil	= context.createOscillator()
	leftOscil.connect(destination)

	var rightOscil	= context.createOscillator()
	rightOscil.connect(destination)
	
	var updateNodes	= function(){
		gainNode.gain.value		= gain
		leftOscil.frequency.value	= pitch - beatRate/2
		rightOscil.frequency.value	= pitch + beatRate/2	
	}
	// do the initial update
	updateNodes();

	this.getGain	= function(){
		return gain
	}
	this.setGain	= function(value){
		gain	= value
		updateNodes();		
	}
	this.getPitch	= function(){
		return pitch
	}
	this.setPitch	= function(value){
		pitch	= value
		updateNodes();		
	}
	this.getBeatRate= function(){
		return beatRate
	}
	this.setBeatRate= function(value){
		beatRate	= value
		updateNodes();		
	}
	/**
	 * start the source
	 */
	this.start	= function(delay){
		delay	= delay !== undefined ? delay : 0
		leftOscil.start(delay)
		rightOscil.start(delay)
	}
	/** 
	 * stop the source
	 */
	this.stop	= function(delay){
		delay	= delay !== undefined ? delay : 0
		leftOscil.stop(delay)
		rightOscil.stop(delay)
	}
}
var WebAudiox	= WebAudiox	|| {}

WebAudiox.ByteToNormalizedFloat32Array	= function(srcArray, dstArray){
	var ratio	= srcArray.length / dstArray.length
	for(var i = 0; i < dstArray.length; i++){
		var first	= Math.round((i+0) * ratio)
		var last	= Math.round((i+1) * ratio)
		last		= Math.min(srcArray.length-1, last)
		for(var j = first, sum = 0; j <= last; j++){
			sum	+= srcArray[j]/256;
		}
		dstArray[i]	= sum/(last-first+1);
	}
}
var WebAudiox	= WebAudiox	|| {}

/**
 * generate buffer with jsfx.js 
 * @param  {AudioContext} context the WebAudio API context
 * @param  {Array} lib     parameter for jsfx
 * @return {[type]}         the just built buffer
 */
WebAudiox.getBufferFromJsfx	= function(context, lib){
	var params	= jsfxlib.arrayToParams(lib);
	var data	= jsfx.generate(params);
	var buffer	= context.createBuffer(1, data.length, 44100);
	var fArray	= buffer.getChannelData(0);
	for(var i = 0; i < fArray.length; i++){
		fArray[i]	= data[i];
	}
	return buffer;
}
/**
 * @namespace definition of WebAudiox
 * @type {object}
 */
var WebAudiox	= WebAudiox	|| {}

/**
 * definition of a lineOut
 * @constructor
 * @param  {AudioContext} context WebAudio API context
 */
WebAudiox.LineOut	= function(context){
	// init this.destination
	this.destination= context.destination

	// this.destination to support muteWithVisibility
	var visibilityGain	= context.createGain()
	visibilityGain.connect(this.destination)			
	muteWithVisibility(visibilityGain)
	this.destination= visibilityGain

	// this.destination to support webAudiox.toggleMute() and webAudiox.isMuted
	var muteGain	= context.createGain()
	muteGain.connect(this.destination)
	this.destination= muteGain
	this.isMuted	= false
	this.toggleMute = function(){
		this.isMuted		= this.isMuted ? false : true;
		muteGain.gain.value	= this.isMuted ? 0 : 1;
	}.bind(this)

	//  to support webAudiox.volume
	var volumeNode	= context.createGain()
	volumeNode.connect( this.destination )	
	this.destination= volumeNode
	Object.defineProperty(this, 'volume', {
		get : function(){
			return volumeNode.gain.value; 
		},
                set : function(value){
                	volumeNode.gain.value	= value;
		}
	});

	return;	

	//////////////////////////////////////////////////////////////////////////////////
	//		muteWithVisibility helper					//
	//////////////////////////////////////////////////////////////////////////////////
	/**
	 * mute a gainNode when the page isnt visible
	 * @param  {Node} gainNode the gainNode to mute/unmute
	 */
	function muteWithVisibility(gainNode){
		// shim to handle browser vendor
		var eventStr	= (document.hidden !== undefined	? 'visibilitychange'	:
			(document.mozHidden	!== undefined		? 'mozvisibilitychange'	:
			(document.msHidden	!== undefined		? 'msvisibilitychange'	:
			(document.webkitHidden	!== undefined		? 'webkitvisibilitychange' :
			console.assert(false, "Page Visibility API unsupported")
		))));
		var documentStr	= (document.hidden !== undefined ? 'hidden' :
			(document.mozHidden	!== undefined ? 'mozHidden' :
			(document.msHidden	!== undefined ? 'msHidden' :
			(document.webkitHidden	!== undefined ? 'webkitHidden' :
			console.assert(false, "Page Visibility API unsupported")
		))));
		// event handler for visibilitychange event
		var callback	= function(){
			var isHidden	= document[documentStr] ? true : false
			gainNode.gain.value	= isHidden ? 0 : 1
		}.bind(this)
		// bind the event itself
		document.addEventListener(eventStr, callback, false)
		// destructor
		this.destroy	= function(){
			document.removeEventListener(eventStr, callback, false)
		}
	}
}
var WebAudiox	= WebAudiox	|| {}

/**
 * Helper to load a buffer
 * 
 * @param  {AudioContext} context the WebAudio API context
 * @param  {String} url     the url of the sound to load
 * @param  {Function} onLoad  callback to notify when the buffer is loaded and decoded
 * @param  {Function} onError callback to notify when an error occured
 */
WebAudiox.loadBuffer	= function(context, url, onLoad, onError){
	var request	= new XMLHttpRequest()
	request.open('GET', url, true)
	request.responseType	= 'arraybuffer'
	// counter inProgress request
	WebAudiox.loadBuffer.inProgressCount++
	request.onload	= function(){
		context.decodeAudioData(request.response, function(buffer){
			// counter inProgress request
			WebAudiox.loadBuffer.inProgressCount--
			// notify the callback
			onLoad && onLoad(buffer)
			// notify
			WebAudiox.loadBuffer.onLoad(context, url, buffer)
		}, function(){
			// notify the callback
			onError && onError()
			// counter inProgress request
			WebAudiox.loadBuffer.inProgressCount--
		})
	}
	request.send()
}

/**
 * global onLoad callback. it is notified everytime .loadBuffer() load something
 * @param  {AudioContext} context the WebAudio API context
 * @param  {String} url     the url of the sound to load
 * @param {[type]} buffer the just loaded buffer
 */
WebAudiox.loadBuffer.onLoad	= function(context, url, buffer){}

/**
 * counter of all the .loadBuffer in progress. usefull to know is all your sounds
 * as been loaded
 * @type {Number}
 */
WebAudiox.loadBuffer.inProgressCount	= 0



/**
 * shim to get AudioContext
 */
window.AudioContext	= window.AudioContext || window.webkitAudioContext;
// @namespace
var WebAudiox	= WebAudiox	|| {}

/**
 * update webaudio context listener with three.Object3D position
 * 
 * @constructor
 * @param  {AudioContext} context  the webaudio api context
 * @param  {THREE.Object3D} object3d the object for the listenre
 */
WebAudiox.ListenerObject3DUpdater	= function(context, object3d){	
	var prevPosition= null
	this.update	= function(delta, now){
		// ensure object3d.matrixWorld is up to date
		object3d.updateMatrixWorld()
		// get matrixWorld
		var matrixWorld	= object3d.matrixWorld
		////////////////////////////////////////////////////////////////////////
		// set position
		var position	= new THREE.Vector3().getPositionFromMatrix(matrixWorld)
		context.listener.setPosition(position.x, position.y, position.z)

		////////////////////////////////////////////////////////////////////////
		// set orientation
		var mOrientation= matrixWorld.clone();
		// zero the translation
		mOrientation.setPosition({x : 0, y: 0, z: 0});
		// Compute Front vector: Multiply the 0,0,1 vector by the world matrix and normalize the result.
		var vFront= new THREE.Vector3(0,0,1);
		vFront.applyMatrix4(mOrientation)
		vFront.normalize();
		// Compute UP vector: Multiply the 0,-1,0 vector by the world matrix and normalize the result.
		var vUp= new THREE.Vector3(0,-1, 0);
		vUp.applyMatrix4(mOrientation)
		vUp.normalize();
		// Set panner orientation
		context.listener.setOrientation(vFront.x, vFront.y, vFront.z, vUp.x, vUp.y, vUp.z);

		////////////////////////////////////////////////////////////////////////
		// set velocity
		if( prevPosition === null ){
			prevPosition	= new THREE.Vector3().getPositionFromMatrix(matrixWorld);
		}else{
			var position	= new THREE.Vector3().getPositionFromMatrix(matrixWorld);
			var velocity	= position.clone().sub(prevPosition).divideScalar(delta);
			prevPosition.copy(position)
			context.listener.setVelocity(velocity.x, velocity.y, velocity.z);
		}
	}
}

/**
 * update panner position based on a object3d position
 * 
 * @constructor
 * @param  {[type]} panner   the panner node to update
 * @param  {THREE.Object3D} object3d the object from which we take the position
 */
WebAudiox.PannerObject3DUpdater	= function(panner, object3d){
	var prevPosition= null
	this.update	= function(delta, now){
		// ensure object3d.matrixWorld is up to date
		object3d.updateMatrixWorld()
		// get matrixWorld
		var matrixWorld	= object3d.matrixWorld
		
		////////////////////////////////////////////////////////////////////////
		// set position
		var position	= new THREE.Vector3().getPositionFromMatrix(matrixWorld)
		panner.setPosition(position.x, position.y, position.z)

		////////////////////////////////////////////////////////////////////////
		// set orientation
		var vOrientation= new THREE.Vector3(0,0,1);
		var mOrientation= matrixWorld.clone();
		// zero the translation
		mOrientation.setPosition({x : 0, y: 0, z: 0});
		// Multiply the 0,0,1 vector by the world matrix and normalize the result.
		vOrientation.applyMatrix4(mOrientation)
		vOrientation.normalize();
		// Set panner orientation
		panner.setOrientation(vOrientation.x, vOrientation.y, vOrientation.z);
		
		////////////////////////////////////////////////////////////////////////
		// set velocity
		if( prevPosition === null ){
			prevPosition	= new THREE.Vector3().getPositionFromMatrix(matrixWorld);
		}else{
			var position	= new THREE.Vector3().getPositionFromMatrix(matrixWorld);
			var velocity	= position.clone().sub(prevPosition).divideScalar(delta);
			prevPosition.copy( position )
			panner.setVelocity(velocity.x, velocity.y, velocity.z);
		}
	}
}

