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
	onLoad		= onLoad	|| function(buffer){}
	onError		= onError	|| function(){}
        if( url instanceof Blob ){
		var request	= new FileReader();
        } else {
		var request	= new XMLHttpRequest()
		request.open('GET', url, true)
		request.responseType	= 'arraybuffer'
        }
	// counter inProgress request
	WebAudiox.loadBuffer.inProgressCount++
	request.onload	= function(){
		// Check XMLHttpRequest.status or FileReader.error parameter
		if( request.status < 400 || (!request.status && !request.error) ){
			context.decodeAudioData(request.response, function(buffer){
				// counter inProgress request
				WebAudiox.loadBuffer.inProgressCount--
				// notify the callback
				onLoad(buffer)
				// notify
				WebAudiox.loadBuffer.onLoad(context, url, buffer)
			}, function(){
				// counter inProgress request
				WebAudiox.loadBuffer.inProgressCount--
				// notify the callback
				onError()
			})
		} else {
			// counter inProgress request
			WebAudiox.loadBuffer.inProgressCount--
			// notify the callback
			onError()
		}
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



