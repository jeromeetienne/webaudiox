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

var WebAudiox	= WebAudiox	|| {}


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

//////////////////////////////////////////////////////////////////////////////////
//		init webAudiox							//
//////////////////////////////////////////////////////////////////////////////////
WebAudiox.Contextx	= function(){
	var _this	= this
	// init context
	var AudioContext	= window.AudioContext || window.webkitAudioContext;
	var context	= new AudioContext()
	this.context	= context
	
	// init masterOut
	var masterOut	= context.destination

	// masterOut to support muteWithVisibility
	var visibilityGain	= context.createGain()
	visibilityGain.connect(masterOut)			
	muteWithVisibility(visibilityGain)
	masterOut	= visibilityGain

	// masterOut to support webAudiox.toggleMute() and webAudiox.isMuted
	var muteGain	= context.createGain()
	muteGain.connect(masterOut)
	masterOut	= muteGain
	this.isMuted	= false
	this.toggeMute= function(){
		this.isMuted		= this.isMuted ? false : true;
		muteGain.gain.value	= this.isMuted ? 0 : 1;
	}.bind(this)

	//  to support webAudiox.volume
	var volumeNode	= context.createGain()
	volumeNode.connect( masterOut )	
	masterOut	= volumeNode
	Object.defineProperty(this, 'volume', {
		get : function(){
			return volumeNode.gain.value; 
		},
                set : function(value){

                	volumeNode.gain.value	= value;
		}
	});

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	this.masterOut	= masterOut;
	this.loadBuffer	= loadBuffer
	this.onLoadFcts	= []
	return;	

	//////////////////////////////////////////////////////////////////////////////////
	//		loadBuffer Helper						//
	//////////////////////////////////////////////////////////////////////////////////
	/**
	 * Helper to load a buffer
	 * @param  {String} url     the url of the sound to load
	 * @param  {Function} onLoad  callback to notify when the buffer is loaded and decoded
	 * @param  {Function} onError callback to notify when an error occured
	 */
	function loadBuffer(url, onLoad, onError){
		console.warn('obsolete function')
		var request	= new XMLHttpRequest()
		request.open('GET', url, true)
		request.responseType	= 'arraybuffer'
		request.onload	= function(){
			context.decodeAudioData(request.response, function(buffer){
				// notify the callback
				onLoad && onLoad(buffer)
				// to support webAudiox.onLoadFcts	if needed				
				_this.onLoadFcts.forEach(function(onLoadFct){
					onLoadFct()
				})
			}, function(){
				onError && onError()
			})
		}
		request.send()
	}	
	
	//////////////////////////////////////////////////////////////////////////////////
	//		muteWithVisibility helper					//
	//////////////////////////////////////////////////////////////////////////////////
	/**
	 * mute a gainNode when the page isnt visible
	 * @param  {Node} gainNode the gainNode to mute/unmute
	 */
	function muteWithVisibility(gainNode){
		console.warn('obsolete function')
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
	this.toggeMute= function(){
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
console.log('isHidden', isHidden, 'gain.value', gainNode.gain.value)
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
			WebAudiox.loadBuffer.onLoad && WebAudiox.loadBuffer.onLoad(context, url)
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
 * global onLoad callback
 */
WebAudiox.loadBuffer.onLoad	= null

/**
 * counter of the inProgress
 * @type {Number}
 */
WebAudiox.loadBuffer.inProgressCount	= 0



/**
 * shim to get AudioContext
 */
window.AudioContext	= window.AudioContext || window.webkitAudioContext;
var WebAudiox	= WebAudiox	|| {}

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

