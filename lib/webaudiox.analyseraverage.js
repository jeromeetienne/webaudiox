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
