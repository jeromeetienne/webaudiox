## 8 bit procedural sound generation with Web Audio API

Last week we started talking about 
[webaudiox](http://jeromeetienne.github.io/webaudiox).
In this 
[first post](http://blog.jetienne.com/blog/2014/02/18/webaudiox-a-dry-library-for-webaudio-api/),
we talked about the project and started explains the helpers ```webaudiox.shim.js```
and ```webaudiox.loadbuffer.js```.
This week we gonna focus on ```webaudiox.jsfx.js```.

This helper is provide you an easy way to use 
[jsfx.js](http://www.egonelbre.com/js/jsfx/)
with your Web Audio API games.

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
It shows a basic usage of this helper

#### How To Use It ? 

Let's see how to use it. First you create a 
[Audio Context](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#AudioContext-section) like this.

```
var context	= new AudioContext()
```

now you get the famous ```lib``` parameter from 
[jsfx](https://github.com/egonelbre/jsfx). You can generate some on its 
[demo page](http://www.egonelbre.com/js/jsfx/).
From ```lib```, you will generate a
[Audio Buffer](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#AudioBuffer)
.

```javascript
var lib		= ["square",0.0000,0.4000,0.0000,0.3200,0.0000,0.2780,20.0000,496.0000,2400.0000,0.4640,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0235,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000]
var buffer	= WebAudiox.getBufferFromJsfx(context, lib)
```

Now we are all ready to play a sound! So let's do that.

```javascript
var source	= context.createBufferSource()
source.buffer	= buffer
source.connect(context.destination)
source.start(0)
```