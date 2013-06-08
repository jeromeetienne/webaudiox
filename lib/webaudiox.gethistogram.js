var WebAudiox	= WebAudiox	|| {}


WebAudiox.getByteFrequencyHistogram	= function(analyser, nBar){
	// get the data
	// var data	= new Float32Array(analyser.frequencyBinCount);
	// var scale	= 1.0;
	// analyser.getFloatFrequencyData(data);

	// get the data
	// var data	= new Uint8Array(analyser.fftSize);
	// var scale	= 256;
	// analyser.getByteTimeDomainData(data);

	// get the data
	var data	= new Uint8Array(analyser.frequencyBinCount);
	var scale	= 256;
	analyser.getByteFrequencyData(data);


	// 
	var barW	= Math.floor(data.length / nBar);
	var nBar	= Math.floor(data.length / barW);
	var arr		= []
	for(var x = 0, arrIdx = 0; x < data.length; arrIdx++){
		var sum	= 0;
		for(var i = 0; i < barW; i++, x++){
			sum += data[x]/scale;
		}
		var average	= sum/barW;
		arr[arrIdx]	= average;
	}
	return arr;
}
