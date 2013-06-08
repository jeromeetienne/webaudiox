var WebAudiox	= WebAudiox	|| {}

//////////////////////////////////////////////////////////////////////////////////
//		init webAudiox							//
//////////////////////////////////////////////////////////////////////////////////
WebAudiox.Contextx	= function(){
	var _this	= this
	// init context
	var AudioContext	= window.AudioContext || window.webkitAudioContext;
	var context	= new AudioContext()
	this.context	= context
	
	// init masterOut
	var masterOut	= context.destination

	// masterOut to support muteWithVisibility
	var visibilityGain	= context.createGain()
	visibilityGain.connect(masterOut)			
	muteWithVisibility(visibilityGain)
	masterOut	= visibilityGain

	// masterOut to support webAudiox.toggleMute() and webAudiox.isMuted
	var muteGain	= context.createGain()
	muteGain.connect(masterOut)
	masterOut	= muteGain
	this.isMuted	= false
	this.toggeMute= function(){
		this.isMuted		= this.isMuted ? false : true;
		muteGain.gain.value	= this.isMuted ? 0 : 1;
	}.bind(this)

	//  to support webAudiox.volume
	var volumeNode	= context.createGain()
	volumeNode.connect( masterOut )	
	masterOut	= volumeNode
	Object.defineProperty(this, 'volume', {
		get : function(){
			return volumeNode.gain.value; 
		},
                set : function(value){

                	volumeNode.gain.value	= value;
		}
	});

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	this.masterOut	= masterOut;
	this.loadBuffer	= loadBuffer
	this.onLoadFcts	= []
	return;	

	//////////////////////////////////////////////////////////////////////////////////
	//		loadBuffer Helper						//
	//////////////////////////////////////////////////////////////////////////////////
	/**
	 * Helper to load a buffer
	 * @param  {String} url     the url of the sound to load
	 * @param  {Function} onLoad  callback to notify when the buffer is loaded and decoded
	 * @param  {Function} onError callback to notify when an error occured
	 */
	function loadBuffer(url, onLoad, onError){
		var request	= new XMLHttpRequest()
		request.open('GET', url, true)
		request.responseType	= 'arraybuffer'
		request.onload	= function(){
			context.decodeAudioData(request.response, function(buffer){
				// notify the callback
				onLoad && onLoad(buffer)
				// to support webAudiox.onLoadFcts	if needed				
				_this.onLoadFcts.forEach(function(onLoadFct){
					onLoadFct()
				})
			}, function(){
				onError && onError()
			})
		}
		request.send()
	}	
	
	//////////////////////////////////////////////////////////////////////////////////
	//		muteWithVisibility helper					//
	//////////////////////////////////////////////////////////////////////////////////
	/**
	 * mute a gainNode when the page isnt visible
	 * @param  {Node} gainNode the gainNode to mute/unmute
	 */
	function muteWithVisibility(gainNode){
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
}
