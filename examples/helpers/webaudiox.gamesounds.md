webaudiox.gamesounds.js
=======================

It aims at making webaudio api easy to use for gamedevs.
It depends on 
[webaudiox.lineout.js](https://github.com/jeromeetienne/webaudiox#webaudioxlineoutjs),
[webaudiox.loadbuffer.js](https://github.com/jeromeetienne/webaudiox#webaudioxloadbufferjs)
and
[webaudiox.three.js](https://github.com/jeromeetienne/webaudiox#webaudioxthreejs) if
you want to use the sound localisation.


```
var gameSounds	= new WebAudiox.GameSounds()
gameSounds.lineOut.volume	= 0.2
```

* ```.lineOut``` is a [WebAudiox.LineOut](https://github.com/jeromeetienne/webaudiox#webaudioxlineoutjs)
* ```.context``` is a AudioContext from Web Audio API


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

* ```utterance.stopFollow()``` to stop follow the object3d

* ```utterance.pannerNode``` to have direct access to the panner node

### options.follow

```.follow``` options receives a ```THREE.Object3D``` as arguments. This 3d object
will be followed by the utterance.
It will create a ```PannerNode``` if needed, and update it according to the 3d object
position.

Additionnaly It exposes ```utterance.stopFollow()``` to stop following a 3d object.

### options.volume
If ````options.volume``` is set, it will create a ```utterance.gainNode``` for it. 
If you wish, you can access ```.gainNode``` directly change the gain during the utterance.

