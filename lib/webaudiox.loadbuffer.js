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
	request.onload	= function(){
		context.decodeAudioData(request.response, function(buffer){
			// notify the callback
			onLoad && onLoad(buffer)
		}, function(){
			onError && onError()
		})
	}
	request.send()
}	