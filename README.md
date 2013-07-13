webaudiox.js
============
webaudiox.js is a bunch of helpers for 
[WebAudio API](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html)
each of them can be use independantly.



webaudiox.js is a

```webaudiox-bundle.js``` is just the concatenation of all the helpers.


## how to use it 

## API 

## webaudiox.jsfx.js

[jsfx.js](https://github.com/egonelbre/jsfx) 
is a library to generate procedural sound, very 8-bit kindof sound.
See [jsfx demo page](http://www.egonelbre.com/js/jsfx/) for details on this fun library
by [@egonelbre](https://twitter.com/egonelbre/).
It is usefull because you can generate lots of different sound easily without downloading
anything.
Here is a usage example

```
// create the audio context 
var context	= new AudioContext()
// parameter for jsfx.js - http://www.egonelbre.com/js/jsfx/
var lib		= ["square",0.0000,0.4000,0.0000,0.3200,0.0000,0.2780,20.0000,496.0000,2400.0000,0.4640,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0235,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000]
var buffer	= WebAudiox.getBufferFromJsfx(context, lib)
```

You can see the
[file on github](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.jsfx.js).
You can watch an usage 
[example live](https://jeromeetienne.github.io/webaudiox//examples/jsfx.html)
and check its 
[source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/jsfx.html).

## webaudiox.loadbuffer.js

It is helper to load sound. 
it is a function which load the sound from an ```url``` and decode it.

```javascript
WebAudiox.loadBuffer(context, url, function(buffer){
	// notified when the url has been downloaded and the sound decoded.
}, function(){
	// notified if an error occurs
});
```

You can see the 
[file on github](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.loadbuffer.js).
You can watch an usage 
[example live](https://jeromeetienne.github.io/webaudiox//examples/lineout.html)
and check its 
[source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/lineout.html).


### download management

There is global onLoad callback ```WebAudiox.loadBuffer.onLoad```
This functiont is notified everytime .loadBuffer() load something.
you can overload it to fit your need.

```javascript
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
it usefull to know is all your sounds as been loaded.


## Sound localisation with three.js

This is useful lf you have a three.js scene and would like to play spacial sound in it.

### listener localisation

First lets localise the listener. most of the time it will be the the viewer camera.
So you create a ```ListenerObject3DUpdater``` for that 

```javascript
// context is your WebAudio context
// object3d is the object which represent the listener
var listenerUpdater = new WebAudiox.ListenerObject3DUpdater(context, object3d)
```

then you call ```.update()``` everytime you update the position of your ```object3d```
listener

```javascript
// delta is the time between the last update in seconds
// now is the absolute time in seconds
listenerUpdater.update(delta, now)
```

### sound localisation

Now lets localise a sound source.
A sound source is localised only if it has a panner node.

So you create a ```PannerObject3DUpdater``` for that 

```javascript
// panner is the panner node from WebAudio API
// object3d is the object which represent the sound source in space
var pannerUpdater = new WebAudiox.PannerObject3DUpdater(panner, object3d)
```

then you call ```.update()``` everytime you update the position of your ```object3d```
listener

```javascript
// delta is the time between the last update in seconds
// now is the absolute time in seconds
listenerUpdater.update(delta, now)
```


## examples

here are the various examples: 

* how to get a track from sound cloud: [here](http://jeromeetienne.github.io/webaudiox/examples/soundcloud-test.html)
* how to got a sound localized on a three.js object: [here](http://jeromeetienne.github.io/webaudiox/examples/threejs.html)
  * an experimentation using ```PannerNode``` [here](http://jeromeetienne.github.io/webaudiox/examples/threejs-panner.html)
* how to load and play a sound only with the API: [here](http://jeromeetienne.github.io/webaudiox/examples/raw.html)
* how to generate a sound using jsfx: [here](http://jeromeetienne.github.io/webaudiox/examples/jsfx.html)
* how to display a frequency spectrum: [here](http://jeromeetienne.github.io/webaudiox/examples/frequencyspectrum.html)
* how to use it with beatdetektor.js: [here](http://jeromeetienne.github.io/webaudiox/examples/beatdetektorjs.html)
* how to use it with webaudiox.lineout.js ? [here](http://jeromeetienne.github.io/webaudiox/examples/lineout.html)
  * this is a typical boilerplate for a line out.
  * it has a ```lineOut.volume``` property for tuning the master volume
  * it has a ```lineOut.toggleMute()``` function to mute/unmute the output
  * it has a *muteIfHidden* feature. So when your webpage page get hidden, the sound is muted
* a possible way to handle soundback: [here](http://jeromeetienne.github.io/webaudiox/examples/soundsbank.html)
* a way to detect pulse using an ```analyzerNode``` : [here](http://jeromeetienne.github.io/webaudiox/examples/analyseraverage.html)

## TODO
* port examples from webaudio.js


## Notes
* QF-MichaelK: jetienne: http://www.youtube.com/watch?v=Nwuwg_tkHVA it's the rainbow one in the middle...
* QF-MichaelK: http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
* http://chromium.googlecode.com/svn/trunk/samples/audio/samples.html
* [2:14pm] QF-MichaelK: here's one I guess http://airtightinteractive.com/demos/js/reactive/
* done QF-MichaelK: this is neat too http://www.bram.us/2012/03/21/spectrogram-canvas-based-musical-spectrum-analysis/
