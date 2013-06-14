webaudiox.js
============
it is a webaudio api ala vendor.js.
no libs only snippets for you to copy, and fine tune to your own needs.

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
* webaudiox.contextx.js seems weird and obsolete
  * maybe webaudiox.boilerplate.js ? seems more like a boilerplate
    * no! kill it
  * it is .lineout.js + loadbuffer.js + mutewithvisibility.js
  * mutewithvisibility.js is in contextx.js too! duplicate 
    * kill mutewithvisibility.js

* DONE put in its own repo
* done fix the naming issue
  * one WebAudioX.ContextX
  * one WebAudioX.AbsoluteNormalizer
* done port all the three.js localisation
  * webaudiox.three.js
  * put a panner
  * put some dopler



## Notes
* QF-MichaelK: jetienne: http://www.youtube.com/watch?v=Nwuwg_tkHVA it's the rainbow one in the middle...
* QF-MichaelK: http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
* http://chromium.googlecode.com/svn/trunk/samples/audio/samples.html
* [2:14pm] QF-MichaelK: here's one I guess http://airtightinteractive.com/demos/js/reactive/

* done QF-MichaelK: this is neat too http://www.bram.us/2012/03/21/spectrogram-canvas-based-musical-spectrum-analysis/
