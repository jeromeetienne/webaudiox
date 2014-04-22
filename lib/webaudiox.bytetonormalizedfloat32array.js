var WebAudiox	= WebAudiox	|| {}


/**
 * source is integers from 0 to 255,  destination is float from 0 to 1 non included
 * source and destination may not have the same length.
 * 
 * @param {Array} srcArray       the source array
 * @param {Array} dstArray       the destination array
 * @param {Number|undefined} dstArrayLength the length of the destination array. If not provided
 *                               dstArray.length value is used.
 */
WebAudiox.ByteToNormalizedFloat32Array	= function(srcArray, dstArray, dstArrayLength){
	dstArrayLength	= dstArrayLength !== undefined ? dstArrayLength : dstArray.length
	var ratio	= srcArray.length / dstArrayLength
	for(var i = 0; i < dstArray.length; i++){
		var first	= Math.round((i+0) * ratio)
		var last	= Math.round((i+1) * ratio)
		last		= Math.min(srcArray.length-1, last)
		for(var j = first, sum = 0; j <= last; j++){
			sum	+= srcArray[j]/256;
		}
		dstArray[i]	= sum/(last-first+1);
	}
}
