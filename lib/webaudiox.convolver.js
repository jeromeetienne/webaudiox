// @namespace defined WebAudiox name space
var WebAudiox	= WebAudiox	|| {}

/**
 * Helper to create a Convolver
 * @param  {AudioContext} context  the webaudio api context
 * @param  {String} url     the url of the impulse file to load
 * @return {[type]} the just built convolver
 */
WebAudiox.Convolver	= function(context, url){
	// Create Convolver
	var convolver = context.createConvolver();
	WebAudiox.loadBuffer(context, url, function(buffer) {	
			convolver.buffer = buffer;
	});
	return convolver;
};
