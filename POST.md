# WebAudioX 

[webaudiox.js](https://github.com/jeromeetienne/webaudiox)
is a bunch of helpers for 
[WebAudio API](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html).
I wrote them a while back. Now i would like to make a series of posts about it to share it. This post is the first :)
I plan to publish one post per week explaining WebAudiox the marvels you can do with WebAudio API. 
I hope we will enjoy ourself in the process :)

We will start by a short intro of the library, 
followed by 2 basic helpers, 
[webaudiox.shim.js](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.shim.js) to handle vendor prefix for you
[webaudiox.loadbuffer.js](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.loadbuffer.js) to load and decode sounds.

[webaudiox.js](https://github.com/jeromeetienne/webaudiox)
isn't a library per se.
You can use any of those helpers independantly.
This makes it very light to include these in your own code.
There is a ```webaudiox.js``` which bundle them though.
This is provided for convenience.
It is just the concatenation of all the helpers.

**TODO** insert screencast here

## Let's get Started

Here is a simple example which  load a sound and play it.
It initializes the AudioContext, downloads a sound with ```WebAudiox.loadBuffer()``` and play it with ```.start(0)```

```
// create WebAudio API context
var context	= new AudioContext()

// load a sound and play it immediatly
WebAudiox.loadBuffer(context, 'sound.wav', function(buffer){
		// init AudioBufferSourceNode
		var source	= context.createBufferSource();
		source.buffer	= buffer
		source.connect(context.destination)
		
		// start the sound now
		source.start(0);
});
```

## How To Install It ?

You can download the build with a usual ```<script>```. 
The easiest is to get 
[webaudiox.js](https://raw.github.com/jeromeetienne/webaudiox/master/build/webaudiox.js)
in ```/build``` directory.

```
 <script src='webaudiox.js'></script>
```

[bower](http://bower.io/) is supported if you want. Just use

```
bower install webaudiox
```

# First Helpers



## webaudiox.shim.js

This helper does a [shim](http://en.wikipedia.org/wiki/Shim_\(computing\)) which handle 
the vendor prefix, so you don't have to. Typically it contains code like 

```
window.AudioContext	= window.AudioContext || window.webkitAudioContext;
```

#### Show Don't Tell

* [webaudiox.shim.js](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.shim.js)
the source itself.
* [examples/jsfx.html](http://jeromeetienne.github.io/webaudiox/examples/jsfx.html)
\[[view source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/jsfx.html)\] :
It shows a basic usage of this helper.

## webaudiox.loadbuffer.js

This helper loads sound. 
It is a function which load the sound from an ```url``` and decode it.

#### Show Don't Tell

* [webaudiox.loadbuffer.js](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.loadbuffer.js)
the source itself.
* [examples/lineout.html](http://jeromeetienne.github.io/webaudiox/examples/lineout.html)
\[[view source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/lineout.html)\] :
It shows a basic usage of this helper.
**TODO this link is broken**

#### Usage

```
WebAudiox.loadBuffer(context, url, function(buffer){
	// notified when the url has been downloaded and the sound decoded.
}, function(){
	// notified if an error occurs
});
```

#### Scheduling Download

In real-life cases, like game, you want to be sure all your sounds
are ready to play before the user start playing.
So here is way to schedule your sound downloads simply.
There is global onLoad callback ```WebAudiox.loadBuffer.onLoad```
This function is notified everytime .loadBuffer() load something.
you can overload it to fit your need.
here for an 
[usage example](https://github.com/jeromeetienne/webaudiox/blob/master/lib/soundsbank.html).

```
// context is the webaudio API context
// url is where to download the sound
// buffer is the just loaded buffer
WebAudiox.loadBuffer.onLoad = function(context, url, buffer){
	// put your own stuff here	
	// ... 
}
```

Additionally there is ```WebAudiox.loadBuffer.inProgressCount```.
it is counter of all the .loadBuffer in progress. 
it useful to know is all your sounds as been loaded.

## Conclusion