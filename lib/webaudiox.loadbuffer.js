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



