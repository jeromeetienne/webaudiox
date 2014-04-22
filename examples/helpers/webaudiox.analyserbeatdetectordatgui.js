// @namespace defined WebAudiox namespace
var WebAudiox	= WebAudiox	|| {}


WebAudiox.addAnalyserBeatDetectorDatGui	= function(beatDetector, datGui){
	datGui		= datGui || new dat.GUI()
	
	var folder	= datGui.addFolder('Beat Detector');
	folder.add(beatDetector, 'holdTime'		, 0.0, 4)
	folder.add(beatDetector, 'decayRate'		, 0.1, 1.0)
	folder.add(beatDetector, 'minVolume'		, 0.0, 1.0)
	folder.add(beatDetector, 'frequencyBinCount'	, 1, 1024).step(1)
	folder.open();
}