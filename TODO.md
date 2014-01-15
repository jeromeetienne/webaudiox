## webaudiox.analyser2volume.js

```
var analyser2volume	= new WebAudiox.Analyser2Volume(analyser, smoothFactor)
var rawVolume		= analyser2volume.rawValue()
var smoothedVolume	= analyser2volume.smoothedValue()
```

To compute raw volume directly, you may use the following function too

```
var rawVolume	= WebAudiox.Analyser2Volume.compute(analyser, width, offset)
```

## webaudiox.analyser2canvas.js

* helper to display an analyser node in a canvas.
  * it depends on other modules
* pick something similar to felix turner.








