var WebAudiox	= WebAudiox	|| {}

/**
 * Generate a binaural sounds
 * http://htmlpreview.github.io/?https://github.com/ichabodcole/BinauralBeatJS/blob/master/examples/index.html
 * http://en.wikipedia.org/wiki/Binaural_beats
 * 
 * @param {Number} pitch    the frequency of the pitch (e.g. 440hz)
 * @param {Number} beatRate the beat rate of the binaural sound (e.g. around 2-10hz)
 * @param {Number} gain     the gain applied on the result
 */
WebAudiox.BinauralSource	= function(pitch, beatRate, gain){
	pitch	= pitch !== undefined ? pitch : 440
	beatRate= beatRate !== undefined ? beatRate : 5
	gain	= gain !== undefined ? gain : 1

	var gainNode	= context.createGain()
	this.output	= gainNode
	var destination	= gainNode
	
	var compressor	= context.createDynamicsCompressor();
	compressor.connect(destination)
	destination	= compressor

	var channelMerge= context.createChannelMerger()
	channelMerge.connect(destination)
	destination	= channelMerge
	
	var leftOscil	= context.createOscillator()
	leftOscil.connect(destination)

	var rightOscil	= context.createOscillator()
	rightOscil.connect(destination)
	
	var updateNodes	= function(){
		gainNode.gain.value		= gain
		leftOscil.frequency.value	= pitch - beatRate/2
		rightOscil.frequency.value	= pitch + beatRate/2	
	}
	// do the initial update
	updateNodes();

	this.getGain	= function(){
		return gain
	}
	this.setGain	= function(value){
		gain	= value
		updateNodes();		
	}
	this.getPitch	= function(){
		return pitch
	}
	this.setPitch	= function(value){
		pitch	= value
		updateNodes();		
	}
	this.getBeatRate= function(){
		return beatRate
	}
	this.setBeatRate= function(value){
		beatRate	= value
		updateNodes();		
	}
	/**
	 * start the source
	 */
	this.start	= function(delay){
		delay	= delay !== undefined ? delay : 0
		leftOscil.start(delay)
		rightOscil.start(delay)
	}
	/** 
	 * stop the source
	 */
	this.stop	= function(delay){
		delay	= delay !== undefined ? delay : 0
		leftOscil.stop(delay)
		rightOscil.stop(delay)
	}
}
