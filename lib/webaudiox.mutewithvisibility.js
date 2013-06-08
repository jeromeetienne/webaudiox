var WebAudiox	= WebAudiox	|| {}

/**
 * mute a gainNode when the page isnt visible
 * @param  {Node} gainNode the gainNode to mute/unmute
 */
WebAudiox.muteWithVisibility	= function(gainNode){
	// shim to handle browser vendor
	var eventStr	= (document.hidden !== undefined	? 'visibilitychange'	:
		(document.mozHidden	!== undefined		? 'mozvisibilitychange'	:
		(document.msHidden	!== undefined		? 'msvisibilitychange'	:
		(document.webkitHidden	!== undefined		? 'webkitvisibilitychange' :
		console.assert(false, "Page Visibility API unsupported")
	))));
	var documentStr	= (document.hidden !== undefined ? 'hidden' :
		(document.mozHidden	!== undefined ? 'mozHidden' :
		(document.msHidden	!== undefined ? 'msHidden' :
		(document.webkitHidden	!== undefined ? 'webkitHidden' :
		console.assert(false, "Page Visibility API unsupported")
	))));
	// event handler for visibilitychange event
	var callback	= function(){
		var isHidden	= document[documentStr] ? true : false
		gainNode.gain.value	= isHidden ? 0 : 1
	}.bind(this)
	// bind the event itself
	document.addEventListener(eventStr, callback, false)
	// destructor
	this.destroy	= function(){
		document.removeEventListener(eventStr, callback, false)
	}
}
