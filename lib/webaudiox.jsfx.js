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
