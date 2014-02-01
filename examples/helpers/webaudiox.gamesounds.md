webaudiox.gamesounds.js
=======================

It aims at making webaudio api easy to use for gamedevs.



```
var gameSounds	= new WebAudiox.GameSounds()
gameSounds.lineOut.volume	= 0.2
```


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

* ```utterance.pannerNode``` to have direct access to the panner node.
* ```utterance.gainNode``` to have direct access to gain node. If you 
dynamically change the gain during the utterance.

