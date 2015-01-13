[webaudiox.js](https://github.com/jeromeetienne/webaudiox)
is a bunch of helpers for
[WebAudio API](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html).
It isn't a library per se.
You can use any of those helpers independantly.
This makes it very light to include these in your own code.
There is a ```webaudiox.js``` which bundle them though.
This is provided for convenience.
It is just the concatenation of all the helpers.

## Usage

Here is a boilerplate, a good example to start with.
It initializes the AudioContext, the lineOut and downloads a sound.

```html
<script src='webaudiox.js'></script>
<script>
    // create WebAudio API context
    var context = new AudioContext()

    // Create lineOut
    var lineOut = new WebAudiox.LineOut(context)

    // load a sound and play it immediatly
    WebAudiox.loadBuffer(context, 'sound.wav', function(buffer){
        // init AudioBufferSourceNode
        var source  = context.createBufferSource();
        source.buffer   = buffer
        source.connect(lineOut.destination)

        // start the sound now
        source.start(0);
    });
</script>
```

## Installation

Download the helpers with a usual ```<script>```.
the easiest is to get
[webaudiox.js](https://raw.github.com/jeromeetienne/webaudiox/master/build/webaudiox.js)
in ```/build``` directory.

```html
<script src='webaudiox.js'></script>
```

[bower](http://bower.io/) is supported if it fit your needs. just use
```bower install webaudiox```

## Requirements

No real requirements: there are no external dependancies.
Well WebAudio API must be available obviously :)
Currently Chrome, Firefox, iOS and Opera support it.

## Contributings

Feel free to send pull requests. i love little helpers which are useful :)

## ChangeLogs
*  v1.0.1 bower support
  * you can try with ```bower install webaudiox```
*  v1.0.0 initial release

## Plugins
* [webaudiox.ConvolverHelper](https://github.com/erichlof/webaudiox.ConvolverHelper)
is a plugin by @erichlof .
It provides a simple mean to use convolvers, thus you can simulate being thru an old
telephone, in a hall, or in a tunnel.

# API for Each Helpers

Here is all the helpers provided and their respective API. the source contains a jsdoc
which is authoritative.

## webaudiox.analyser2canvas.js

This helper displays a visualisation of the played sound in real time.
It uses the 
[AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode)
from
[Web Audio API](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html).
The visualisation is composed of 3 parts: 
a FFT histogram, a waveform, and a volume. 
It is useful to debug or simply to display sounds on screen.
It has been widely inspired by this 
[post](http://www.airtightinteractive.com/2013/10/making-audio-reactive-visuals/)
by the excelent 
[@felixturner](https://twitter.com/felixturner), be sure to check it out.

#### Show Don't Tell
* [webaudiox.analyser2canvas.js](https://github.com/jeromeetienne/webaudiox/blob/master/lib/examples/webaudiox.analyser2canvas.js)
the source itself.
* [examples/analyser2canvas.html](http://jeromeetienne.github.io/webaudiox/examples/analyser2canvas.html)
\[[view source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/analyser2canvas.html)\] :
It shows a basic usage of this helper

#### Usage

First you create the object

```
var analyser2canvas = new WebAudiox.Analyser2Canvas(analyser, canvas);
```

Then every time you want to draw on the canvas, just do

```
analyser2canvas.update()
```

## webaudiox.analyser2volume.js

This helper makes an average on a ```ByteFrequencyData``` from an 
[AnalyserNode](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#AnalyserNode).
Clear ? I guess not.
Ok ok audio vocabulary may appear criptic :)
Let's rephrase in layman term.
In brief, it makes an [fft](http://en.wikipedia.org/wiki/Fast_Fourier_transform)
to extract the frequency of the sound, all that in real time.
It is often used to detect pulse in some frequency range.
like detecting pulse in the low frequencies can be a easy beat detector.

#### Show Don't Tell

* [webaudiox.analyser2volume.js](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.analyser2volume.js)
the source itself.
* [examples/analyser2volume.html](http://jeromeetienne.github.io/webaudiox/examples/analyser2volume.html)
\[[view source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/analyser2volume.html)\] :
It shows a basic usage of this helper

#### Usage

```javascript
// create the object
var analyser2Volume = new WebAudiox.Analyser2Volume(analyser)
var rawVolume       = analyser2Volume.rawValue()
var smoothedVolume  = analyser2Volume.smoothedValue()
```

It is possible to directly compute the raw volume.

```javascript
var rawVolume   = new WebAudiox.Analyser2Volume.compute(analyser, width, offset);
// rawVolume is a Number of the computed average
```

width is optional and default to ```analyser.frequencyBinCount```.
offset is optional and default to 0.

## webaudiox.bytetonormalizedfloat32array.js

This helper converts a
[byteArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays)
to a normalized
[Float32Array](https://developer.mozilla.org/en-US/docs/Web/API/Float32Array).
The destination array is normalized because
its values are garanted to be between 0 and 1.
This function is designed to works even if the destination array
length is different from the source array's length.
This is mainly aimed at convering and normalizing input when you are playing
with frequency spectrum or other aspects of
[AnalyserNode](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#AnalyserNode).

#### Show Don't Tell
* [webaudiox.bytetonormalizedfloat32array.js](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.bytetonormalizedfloat32array.js)
the source itself.
* [examples/analyser2canvas.html](http://jeromeetienne.github.io/webaudiox/examples/analyser2canvas.html)
\[[view source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/analyser2canvas.html)\] :
It shows a usage of this helper thru
[webaudiox.analyser2canvas.js](https://github.com/jeromeetienne/webaudiox/blob/master/lib/examples/webaudiox.analyser2canvas.js)

#### Usage

Here is a basic usage. Note that dstArray must be reallocated.

```javascript
WebAudiox.ByteToNormalizedFloat32Array(srcArray, dstArray);
```

Here is a usage where it is used to normalize an histogram, before displaying it for
examples.

```javascript
// bytesFreq is from a analyser.getByteFrequencyData(bytesFreq)
// histogram is destination array, e.g. new Float32Array(10)
WebAudiox.ByteToNormalizedFloat32Array(bytesFreq, histogram)
```

## webaudiox.lineout.js

This helper provides a main line out with the *good practices*
from
["Developing Game Audio with the Web Audio API"](http://www.html5rocks.com/en/tutorials/webaudio/games/)
on
[html5rocks](http://www.html5rocks.com/).
So it provides
a clipping detection and
a dynamic compressor to reduce clipping to improve sound quality.

Additionaly it provides some tools useful in real-life cases.
Such as the ability for the user to mute the sound.
Its is useful when the user is at the office or any place where it isn't
polite to have a loud computer :)
Another thing, there is a *muteIfHidden* feature. so if the browser tab is hidden,
the sound is mute using
[PageVisibility API](http://www.w3.org/TR/page-visibility/).
and obviously ability to tune the volume globally for all sounds.

#### Show Don't Tell

* [webaudiox.lineout.js](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.lineout.js)
the source itself.
* [examples/lineout.html](http://jeromeetienne.github.io/webaudiox/examples/lineout.html)
\[[view source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/lineout.html)\] :
It shows a basic usage of this helper.
**TODO: this link is broken**

Now let's see it's API

#### create a lineOut

```javascript
var lineOut = new WebAudiox.LineOut(context)
```

#### to set the volume/gain

```javascript
lineOut.volume  = 0.8;
```

#### To connect a sound to your lineOut

use ```lineOut.destination``` as you would use ```context.destination```.

```javascript
source.connect(lineOut.destination)
```

#### test if currently muted by user

```javascript
if( lineOut.isMuted === true ){
    console.log('sound has been muted by user')
}
```

#### toggle mute status

typically when the user click on the mute button, you want to toggle the mute status.

```javascript
lineOut.toggeMute()
```

## webaudiox.shim.js

This helper does a [shim](http://en.wikipedia.org/wiki/Shim_\(computing\)) which handle
the vendor prefix, so you don't have to. Typically it contains code like


```javascript
window.AudioContext = window.AudioContext || window.webkitAudioContext;
```

#### Show Don't Tell

* [webaudiox.shim.js](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.shim.js)
the source itself.
* [examples/jsfx.html](http://jeromeetienne.github.io/webaudiox/examples/jsfx.html)
\[[view source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/jsfx.html)\] :
It shows a basic usage of this helper.

## webaudiox.jsfx.js

[jsfx.js](https://github.com/egonelbre/jsfx)
is a library to generate procedural sound, very 8-bit kindof sound.
See [jsfx demo page](http://www.egonelbre.com/js/jsfx/) for details on this fun library
by [@egonelbre](https://twitter.com/egonelbre/).
It is usefull because you can generate lots of different sound easily without downloading
anything.

#### Show Don't Tell

* [webaudiox.jsfx.js](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.jsfx.js)
the source itself.
* [examples/jsfx.html](http://jeromeetienne.github.io/webaudiox/examples/jsfx.html)
\[[view source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/jsfx.html)\] :
It shows several sounds generated by this extension.
* [examples/jsfx-basic.html](http://jeromeetienne.github.io/webaudiox/examples/jsfx-basic.html)
\[[view source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/jsfx-basic.html)\] :
It shows a basic usage of this helper

#### Usage

Let's see how to use it. First you create a
[Audio Context](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#AudioContext-section) like this.

```
var context = new AudioContext()
```

now you get the famous ```lib``` parameter from
[jsfx](https://github.com/egonelbre/jsfx). You can generate some on its
[demo page](http://www.egonelbre.com/js/jsfx/).
From ```lib```, you will generate a
[Audio Buffer](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#AudioBuffer)
.

```javascript
var lib     = ["square",0.0000,0.4000,0.0000,0.3200,0.0000,0.2780,20.0000,496.0000,2400.0000,0.4640,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0235,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000]
var buffer  = WebAudiox.getBufferFromJsfx(context, lib)
```

Now we are all ready to play a sound! So let's do that.

```javascript
var source  = context.createBufferSource()
source.buffer   = buffer
source.connect(context.destination)
source.start(0)
```

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

```javascript
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
it useful to know is all your sounds as been loaded.


#### OfflineAudioContext for fast decoding

With the normal AudioContext decoding e.g. an mp3 file takes just 
as long as the mp3 file lasts. So if your mp3 file's duration is 
1.5 minutes then your decompression (or analyzation, etc.) takes 
1.5 minutes, which might be unbearable for your app.
OfflineAudioContext allows faster than realtime decompression,
for example:

```javascript
var AudioContext = window.AudioContext || window.webkitAudioContext;
var OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
this._context = new AudioContext();
this._loaderContext = new OfflineAudioContext(2, 1024, 44100); //22050 to 96000, CD = 44100
```

See the [W3C docs for OfflineAudioContext](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#OfflineAudioContext-section)

# webaudiox.three.js

This is useful lf you have a three.js scene and would like to play spacial sound in it.
When a sound is played in 3d space, there are 2 actors:
the listener which hears the sound
and
the sound source which emits the sound.
Each of them must be localised in 3d space.

In practice when you use it with three.js
you need to constantly update the position of the
listener and all the sound sources. First in your init, you instance the updater objects.
Then at each iteration of your rendering loop, you update all the positions.


### Show Don't Tell

* [webaudiox.three.js](https://github.com/jeromeetienne/webaudiox/blob/master/lib/webaudiox.three.js)
the source itself.
* [examples/threejs.html](http://jeromeetienne.github.io/webaudiox/examples/threejs.html)
\[[view source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/threejs.html)\] :
It shows a basic usage of this helper.
* [examples/threejs-panner.html](http://jeromeetienne.github.io/webaudiox/examples/threejs-panner.html)
\[[view source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/threejs-panner.html)\] :
It shows a basic usage of this helper.

### Usage

Here is the API details.

#### listener localisation

First let's localise the listener. most of the time it will be the the viewer camera.
So you create a ```ListenerObject3DUpdater``` for that

```javascript
// context is your WebAudio context
// object3d is the object which represent the listener
var listenerUpdater = new WebAudiox.ListenerObject3DUpdater(context, object3d)
```

then you call ```.update()``` everytime you update the position of your ```object3d```
listener.

```javascript
// delta is the time between the last update in seconds
// now is the absolute time in seconds
listenerUpdater.update(delta, now)
```

### sound source localisation

Now let's localise a sound source.
A sound source is localised only if it has a
[panner node](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#PannerNode).

### if you want a sound to follow a Object3D

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
pannerUpdater.update(delta, now)
```

### if you want a sound to be played at a given position

```
var panner  = context.createPanner()
var position    = new THREE.Vector3(1,0,0)
WebAudiox.PannerSetPosition(panner, position)
```

#### if you want a sound to be played from a THREE.Object3D

```
var panner  = context.createPanner()
var object3d    = new THREE.Object3D
WebAudiox.PannerSetObject3D(panner, object3d)
```

# webaudiox.gamesounds.js

It aims at making
[Web Audio Api](http://www.w3.org/TR/webaudio/) easy to use for gamedevs.
It aims to provide easy-to-use API for the common cases seen by gamedevs.
Yet, by exposing its internals, it conserves the flexibility to fit your own needs.

### Show Don't Tell

* [webaudiox.gamesounds.js](https://github.com/jeromeetienne/webaudiox/blob/master/examples/helpers/webaudiox.gamesounds.js)
the source itself.
* [examples/gamesounds.html](http://jeromeetienne.github.io/webaudiox/examples/gamesounds.html)
\[[view source](https://github.com/jeromeetienne/webaudiox/blob/master/examples/gamesounds.html)\] :
It shows a simple usages of gamesounds

## Basic Usage

First, we init ```gameSounds```.

```
var sounds  = new WebAudiox.GameSounds()
```

Then we create a sound and load it from a url.

```
sounds.createClip().load('mysound.ogg', function(soundClip){
    // here the sound is loaded
})
```

We are all ready to play a sound. So let's do it.

```
soundClip.play();
```

This will create a **source**, i.e. an source of our soundclip, a playing version of our sound. Each source is independant. Thus you got the flexibility to change its parameters during the playing of it. e.g. change its location, its volume, whatever you want.

## WebAudiox.GameSounds

First thing is to instanciate the object itself. 
It will keep the WebAudio API context.

```
var gameSounds  = new WebAudiox.GameSounds()
```

It has a line out to the speakers which implement the current best practice according to ["Developing Game Audio with the Web Audio API"](http://www.html5rocks.com/en/tutorials/webaudio/games/) article on [HTML5Rock](http://www.html5rocks.com).
It will expose the following properties:

* ```.lineOut``` is a [WebAudiox.LineOut](https://github.com/jeromeetienne/webaudiox#webaudioxlineoutjs). It has a master volume, a mute that you can toggle. It will automatically mute the sound if the page is not visible.
* ```.context``` is a [AudioContext](http://www.w3.org/TR/webaudio/#AudioContext-section) from Web Audio API.

### gameSounds.update(delta)

It updates the gameSounds.
```delta``` is the number of seconds since the last update.
It is needed to update ```gameSounds```. It is used to update 3d listener.
It is used to update all registered ```WebAudiox.GameSound``` too.

### gameSounds.createClip(options)

This will create a sound.
```options``` is the default options for THREEx.GameSource.
This is a simple alias for

```
function createClip(options){
        return new WebAudiox.GameSoundClip(this, options)
}
```

## WebAudiox.GameSoundListener
It is used for sound localisation. It is setting the position of the listener.
First you create the object like this

```
var soundListener   = new WebAudiox.GameSoundListener(gameSounds)
```

Then you periodically update it like that

```
soundListener.update(delta)
```

### soundListener.at(position)

This is a sounds localisation function.
It will place the audio listener at ```position```.
If it is a ```THREE.Vector3```, it will directly use this position.
If it is a ```THREE.Object3d```, it will use the position of this object.

### gameListener.startFollow(object3d)

This is a sounds localisation function.
The listener will start follow this ```THREE.Object3D```

### gameListener.stopFollow()

the listener will stop following the object3d.


## WebAudiox.GameSoundClip(gamesounds, options)

The arguments of the constructor are :

* ```gameSounds``` is a ```WebAudiox.GameSounds``` instance.
* ```options``` is the THREEx.GameSoundSource options. This is optional.

### soundClip.load(url, onLoad, onError)

This load a sounds from an ```url```.
Once the sound is loaded, ```onLoad(gameSound)``` is notified.
If an error occurs during the load, ```onLoad()``` is notified.
It exposes ```gameSound.loaded``` Boolean. if it is true, the sound
is loaded, false otherwise.
It exposes ```gameSound.buffer```. It is the loaded buffer once it is loaded,
or null otherwise.

### soundClip.update(delta)
It updates the sound.
It is currently needed only if you use 3d localisation for this sounds.
```delta``` is the number of seconds since the last iteration of the rendering loop.

### soundClip.register(label)

Register this sound into the bank of ```gameSounds``` with this ```label```.
Every label is unique into a ```gameSounds```.
```soundClip.unregister()``` unregisters the sound from gameSounds bank.
This will cause this sound to be automatically updated by ```gameSounds```.

### soundClip.createSource(options)

This will create a ```THREEx.GameSoundSource``` using this options

### soundClip.play(options)

This will create a ```THREEx.GameSoundSource``` using this options and
then call ```.play()``` on this soundSource


## WebAudiox.GameSoundSource(soundClip, options)

It will one source for this soundclip. It will be played only once.
Everytime you play a gamesound, it is handled by an independant source.
This you can controls them independantly.
e.g. You can have various volume how strong is an impact,
You can play sound at various fixed locations, or following different 3d objects.

Here are all the options you can set

* ```options.volume``` controls the volume of this utterance. it will create a ```utterance.gainNode```. If you wish, you can access ```.gainNode``` directly change the gain during the utterance.
* ```options.at```: receives a three.js position. It may be ```THREE.Object3D```
or directly a ```THREE.Vector3```.
The utterance will be played at this position
It will create a ```PannerNode``` if needed, and update it according to the 3d object
position.
* ```options.follow```: receives a ```THREE.Object3D``` as arguments. This 3d object
will be followed by the utterance.
It will create a ```PannerNode``` if needed, and update it according to the 3d object
position. Additionnaly It exposes ```utterance.stopFollow()``` to stop following a 3d object.
* ```options.loop```: set the ```.loop``` parameter in the ```SourceBuffer```

### soundSource.play(delay)

It will start play the sound in delay millisecond, default to 0-ms

### soundSource.stop(delay)
It will stop playing the sound in delay millisecond, default to 0-ms.

## Dependancies
```webaudiox.gamesounds.js``` is included in ```webaudiox.js``` build.
It you wish not to use this build.
This file depends on
[webaudiox.lineout.js](https://github.com/jeromeetienne/webaudiox#webaudioxlineoutjs),
[webaudiox.loadbuffer.js](https://github.com/jeromeetienne/webaudiox#webaudioxloadbufferjs)
and
[webaudiox.three.js](https://github.com/jeromeetienne/webaudiox#webaudioxthreejs) if
you want to use the sound localisation.


# Other Examples

here are the various examples:

* a possible way to handle soundback: [here](http://jeromeetienne.github.io/webaudiox/examples/soundsbank.html)
* how to load and play a sound only with the API: [here](http://jeromeetienne.github.io/webaudiox/examples/raw.html)
* how to use it with beatdetektor.js: [here](http://jeromeetienne.github.io/webaudiox/examples/beatdetektorjs.html)


# TODO
* http://webaudiodemos.appspot.com/
* http://webaudioapi.com/
* port examples from webaudio.js
* QF-MichaelK: jetienne: http://www.youtube.com/watch?v=Nwuwg_tkHVA it's the rainbow one in the middle...
* QF-MichaelK: http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
* http://chromium.googlecode.com/svn/trunk/samples/audio/samples.html
* [2:14pm] QF-MichaelK: here's one I guess http://airtightinteractive.com/demos/js/reactive/
* done QF-MichaelK: this is neat too http://www.bram.us/2012/03/21/spectrogram-canvas-based-musical-spectrum-analysis/
