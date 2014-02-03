# webaudiox.gamesounds.js

It aims at making 
[Web Audio Api](http://www.w3.org/TR/webaudio/) easy to use for gamedevs.

**TODO** What does it provides ?

## Basic Usage

First, we init ```gameSounds```. 

```
var gameSounds	= new WebAudiox.GameSounds()
```

Then we create

```
gameSounds.createSound().load('mysound.ogg', function(sound){
	sound.play()
})
```

```
var sound	= gameSounds.createSound().fromJsfx(lib)
var utterance	= sound.play({
	loop	: true,	// to make the sound loop, 
	volume	: 0.2,	// set the volume for this utterance
	position: new THREE.Vector3(1,0,0),	// set position of the sound from a THREE.Vector3
						// it is possible to use THREE.Object3D too
	follow	: object3d	// it will follow
})
```

## WebAudiox.GameSounds

Instanciate the object itself

```
var gameSounds	= new WebAudiox.GameSounds()
```

It will keep the WebAudio API context, 
It has a line out to the speakers which implement the current best practice according to ["Developing Game Audio with the Web Audio API"](http://www.html5rocks.com/en/tutorials/webaudio/games/) article on [HTML5Rock](http://www.html5rocks.com). 
It will expose the following properties:

* ```.lineOut``` is a [WebAudiox.LineOut](https://github.com/jeromeetienne/webaudiox#webaudioxlineoutjs). It has a master volume, a mute that you can toggle. It will automatically mute the sound if the page is not visible.
* ```.context``` is a [AudioContext](http://www.w3.org/TR/webaudio/#AudioContext-section) from Web Audio API.

### gameSounds.update(delta)

It updates the gameSounds. 
```delta``` is the number of seconds since the last update.
It is needed to update ```gameSounds```. It is used to update 3d listener. 
It is used to update all registered ```WebAudiox.GameSound``` too.

### gameSounds.createSound(options)

This will create a sound.
```options``` is the default utterance option.
This is a simple alias for 

```
function createSound(options){
		return new WebAudiox.GameSound(this, options)
}
```

### gameSounds.listenerAt(position)

This is a sounds localisation function.
It will place the audio listener at ```position```. 
If it is a ```THREE.Vector3```, it will directly use this position.
If it is a ```THREE.Object3d```, it will use the position of this object.

### gameSounds.listenerFollow(object3d)

This is a sounds localisation function.
The listener will start follow this ```THREE.Object3D```

### gameSounds.listenerStopFollow()

the listener will stop following the object3d.


## WebAudiox.GameSound(gamesounds, options)

The arguments of the constructor are :

* ```gameSounds``` is a ```WebAudiox.GameSounds``` instance.
* ```options``` is the utterance options. This is optional.

### gamesound.load(url, onLoad, onError)

This load a sounds from an ```url```.
Once the sound is loaded, ```onLoad(gameSound)``` is notified.
If an error occurs during the load, ```onLoad()``` is notified.
It exposes ```gameSound.loaded``` Boolean. if it is true, the sound
is loaded, false otherwise.
It exposes ```gameSound.buffer```. It is the loaded buffer once it is loaded,
or null otherwise.

### gamesound.play(options)

It will play a utterance of this sound.
What is a utterance, this is a instance of a played sound.
Everytime you play a gamesound, it is handled by an independant utterance.
This you can controls them independantly.
e.g. You can have various volume how strong is an impact,
You can play sound at various fixed locations, or following different 3d objects.

Here are all the options you can set

* ```options.loop```: set the ```.loop``` parameter in the ```SourceBuffer```
* ```options.position```: receives a three.js position. It may be ```THREE.Object3D``` 
or directly a ```THREE.Vector3```.
The utterance will be played at this position
It will create a ```PannerNode``` if needed, and update it according to the 3d object
position.
* ```options.follow```: receives a ```THREE.Object3D``` as arguments. This 3d object
will be followed by the utterance.
It will create a ```PannerNode``` if needed, and update it according to the 3d object
position. Additionnaly It exposes ```utterance.stopFollow()``` to stop following a 3d object.
* ```options.volume``` controls the volume of this utterance. it will create a ```utterance.gainNode```. If you wish, you can access ```.gainNode``` directly change the gain during the utterance.

### gamesound.update(delta)
It updates the sound. 
It is currently needed only if you use 3d localisation for this sounds.
```delta``` is the number of seconds since the last iteration of the rendering loop.

### gamesound.register(label)

Register this sound into the bank of ```gameSounds``` with this ```label```.
Every label is unique into a ```gameSounds```.
```gamesound.unregister()``` unregisters the sound from gameSounds bank.
This will cause this sound to be automatically updated by ```gameSounds```.

## Dependancies
```webaudiox.gamesounds.js``` is included in ```webaudiox.js``` build. 
It you wish not to use this build.
This file depends on 
[webaudiox.lineout.js](https://github.com/jeromeetienne/webaudiox#webaudioxlineoutjs),
[webaudiox.loadbuffer.js](https://github.com/jeromeetienne/webaudiox#webaudioxloadbufferjs)
and
[webaudiox.three.js](https://github.com/jeromeetienne/webaudiox#webaudioxthreejs) if
you want to use the sound localisation.

