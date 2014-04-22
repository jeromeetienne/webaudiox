// @namespace defined WebAudiox namespace
var WebAudiox	= WebAudiox	|| {}

/**
 * display an analyser node in a canvas
 * * See http://www.airtightinteractive.com/2013/10/making-audio-reactive-visuals/
 * 
 * @param  {AnalyserNode} analyser     the analyser node
 * @param  {Number}	  smoothFactor the smooth factor for smoothed volume
 */
WebAudiox.AnalyserBeatDetector	= function(analyser, onBeat){
	// arguments default values
	this.holdTime		= 0.33
	this.decayRate		= 0.97
	this.minVolume		= 0.2
	this.frequencyBinCount	= 100

	var holdingTime	= 0
	var threshold	= this.minVolume
	this.update	= function(delta){
		var rawVolume	= WebAudiox.AnalyserBeatDetector.compute(analyser, this.frequencyBinCount)
		if( holdingTime > 0 ){
			holdingTime	-= delta
			holdingTime	= Math.max(holdingTime, 0)
		}else if( rawVolume > threshold ){
			onBeat()
			holdingTime	= this.holdTime;
			threshold	= rawVolume * 1.1;
			threshold	= Math.max(threshold, this.minVolume);	
		}else{
			threshold	*= this.decayRate;
			threshold	= Math.max(threshold, this.minVolume);	
		}
	}
}

/**
 * do a average on a ByteFrequencyData from an analyser node
 * @param  {AnalyserNode} analyser the analyser node
 * @param  {Number} width    how many elements of the array will be considered
 * @param  {Number} offset   the index of the element to consider
 * @return {Number}          the ByteFrequency average
 */
WebAudiox.AnalyserBeatDetector.compute	= function(analyser, width, offset){
	// handle paramerter
	width		= width  !== undefined ? width	: analyser.frequencyBinCount;
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


