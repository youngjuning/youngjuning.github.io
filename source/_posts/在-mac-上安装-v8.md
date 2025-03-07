---
title: 在 mac 上安装 v8
description: 'Installing V8 on a Mac'
cover: 'https://cdn.jsdelivr.net/gh/youngjuning/images@main/1741301791290.png'
date: 2025-03-07 06:54:41
categories:
  - [浏览器]
tags:
  - v8
  - mac
  - 安装
---

## 准备

> 不要使用 `brew install v8`，因为可用命令是不完整的。

### 预备条件

- 安装 Xcode (Avaliable on the Mac App Store)
- 安装 Xcode Command Line Tools (Preferences > Downloads)
- 安装 [depot_tools](https://www.chromium.org/developers/how-tos/install-depot-tools)
  - `cd ~ && git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git`
  - `nano ~/.zshrc`
  - 添加 `export PATH=~/depot_tools:"$PATH"`
  - `source ~/.zshrc`
- 从你想要安装 V8 的目录中，运行 `gclient`。

### Build V8

- `fetch v8`
- `cd ~/v8`
- `gclient sync`

Intel Macs:

- `tools/dev/v8gen.py x64.optdebug`
- `ninja -C out.gn/x64.optdebug`

ARM(M1) Macs:

- `tools/dev/v8gen.py arm64.optdebug`
- `ninja -C out/arm64.optdebug`

我建议你将这些添加到你的 `.zshrc` 文件中。

- `sudo nano ~/.zshrc`
- 添加 `alias d8=~/v8/out/arm64.optdebug/d8`
- 添加 `alias tick-processor=~/v8/tools/mac-tick-processor`
- 添加 `export D8_PATH="~/v8/out/arm64.optdebug"`
- `source ~/.zshrc`

## d8 shell examples

Note: many of these examples have become outdated as `v8` continues to evolve. Hoping to update them in the near future, but for now please be aware that some may not work as expected or may reference optimizations/deoptimizations that no longer happen.

### Print optimization stats

Create `test.js` with the following code:

```js
function test( obj ) {
  return obj.prop + obj.prop;
}

var a = { prop: 'a' }, i = 0;

while ( i++ < 10000 ) {
  test( a );
}
```

Run `$ d8 --trace-opt-verbose test.js`

You should see that the `test` function was optimized by V8, along with an explanation of why. "ICs" stands for [inline caches](http://en.wikipedia.org/wiki/Inline_caching) -- and are one of the ways that V8 performs optimizations. Generally speaking, the more "ICs with typeinfo" the better.


Now modify `test.js` to include the following code:

```js
function test( obj ) {
  return obj.prop + obj.prop;
}

var a = { prop: 'a' }, b = { prop: [] }, i = 0;

while ( i++ < 10000 ) {
  test( Math.random() > 0.5 ? a : b );
}

```

Run `$ d8 --trace-opt-verbose test.js`

So, you'll see that this time, the `test` function was never actually optimized. And the reason for that is because it's being passed objects with different [hidden classes](http://blog.twokul.io/hidden-classes-in-javascript-and-inline-caching/). Try changing the value of `prop` in `a` to an integer and run it again. You should see that the function was able to be optimized.

### Print deoptimization stats

Modify the contents of `test.js`:

```js
function test( obj ) {
  return obj.prop + obj.prop;
}

var a = { prop: 'a' }, b = { prop: [] }, i = 0;

while ( i++ < 10000 ) {
  test( i !== 8000 ? a : b );
}
```

Run `$ d8 --trace-opt --trace-deopt test.js`

You should see that the optimized code for the `test` function was thrown out. What happened here was that V8 kept seeing `test` being passed an object that looked like `{prop: <String>}`. But on the 8000th round of the while loop, we gave it something different. So V8 had to throw away the optimized code, because its initial assumptions were wrong.

### Profiling

Modify `test.js`:

```js
function factorial( n ) {
  return n === 1 ? n : n * factorial( --n );
}

var i = 0;

while ( i++ < 1e7 ) {
  factorial( 10 );
}
```

Run `$ time d8 --prof test.js` (Generates `v8.log`)

Run `$ tick-processor` (Reads `v8.log` and `cat`s the parsed output)

This'll show you where the program was spending most of its time, by function. Most of it should be under `LazyCompile: *factorial test.js:1:19`. The asterisk before the function name means that it was optimized.

Make a note of the execution time that was logged to the terminal. Now try modifying the code to this dumb, contrived example:

```js
function factorial( n ) {
  return equal( n, 1 ) ? n : multiply( n, factorial( --n ) );
}

function multiply( x, y ) {
  return x * y;
}

function equal( a, b ) {
  return a === b;
}

var i = 0;

while ( i++ < 1e7 ) {
  factorial( 10 );
}

```

Run `$ time d8 --prof test.js`

Run `$ tick-processor`

Roughly the same execution time as the last function, which seems like it should have been faster. You'll also notice that the `multiply` and `equal` functions are nowhere on the list. Weird, right?

Run `$ d8 --trace-inlining test.js`

Okay. So, we can see that the optimizing compiler was smart here and completely eliminated the overhead of calling both of those functions by inlining them into the optimized code for `factorial`.

The optimized code for both versions ends up being basically identical (which you can check, if you know how to read assembly, by running `d8 --print-opt-code test.js`).

### Tracing Garbage Collection

Modify `test.js`

```js
function strToArray( str ) {
  var i = 0,
    len = str.length,
    arr = new Uint16Array( str.length );
  for ( ; i < len; ++i ) {
    arr[ i ] = str.charCodeAt( i );
  }
  return arr;
}

var i = 0, str = 'V8 is the collest';

while ( i++ < 1e5 ) {
  strToArray( str );
}
```

Run `$ d8 --trace-gc test.js`

You'll see a bunch of `Scavenge... [allocation failure]`.

Basically, V8's GC heap has different "spaces". Most objects are allocated in the "new space". It's super cheap to allocate here, but it's also pretty small (usually somewhere between 1 and 8 MB). Once that space gets filled up, the GC does a "scavenge".

Scavenging is the fast part of V8 garbage collection. Usually somewhere between 1 and 5ms from what I've seen -- so it might not necessarily cause a noticeable GC pause.

**Scavenges can only be kicked off by allocations**. If the "new space" never gets filled up, the GC never needs to reclaim space by scavenging.

Modify `test.js`:

```js
function strToArray( str, bufferView ) {
  var i = 0,
    len = str.length;
  for ( ; i < len; ++i ) {
    bufferView[ i ] = str.charCodeAt( i );
  }
  return bufferView;
}

var i = 0,
  str = 'V8 is the coolest',
  buffer = new ArrayBuffer( str.length * 2 ),
  bufferView = new Uint16Array( buffer );

while ( i++ < 1e5 ) {
  strToArray( str, bufferView );
}
```

Here, we use a preallocated `ArrayBuffer` and an associated `ArrayBufferView` (in this case a `Uint16Array`) in order to avoid reallocating a new object every time we run `strToArray()`. The result is that we're hardly allocating anything.

Run `$ d8 --trace-gc test.js`

Nothing. We never filled up the "new space", so we never had to scavenge.

One more thing to try in `test.js`:

```js
function strToArray( str ) {
  var i = 0,
    len = str.length,
    arr = new Uint16Array( str.length );
  for ( ; i < len; ++i ) {
    arr[ i ] = str.charCodeAt( i );
  }
  return arr;
}

var i = 0, str = 'V8 is the coolest', arr = [];

while ( i++ < 1e6 ) {
  strToArray( str );
  if ( i % 100000 === 0 ) {
    // save a long-term reference to a random, huge object
    arr.push( new Uint16Array( 100000000 ) );
    // release references about 5% of the time
    Math.random() > 0.95 && ( arr.length = 0 );
  }
}
```

Run `$ d8 --trace-gc test.js`

Lots of scavenges, which is expected since we're no longer using a preallocated buffer. But there should also be a bunch of `Mark-sweep` lines.

Mark-sweep is the "full" GC. It gets run when the "old space" heap reaches a certain size, and it tends to take a lot longer than a scavenge. If you look at the logs, you'll probably see `Scavenge` at around ~1.5ms and `Mark-sweep` closer to 25 or 30ms.

Since the frame budget in a web app is about 16ms, you're pretty much guaranteed to drop at least 1 frame every time Mark-sweep runs.

## Random stuff

### `$ d8 --help` logs all available d8 flags

There's a ton there, but you can usually find what you're looking for with something like `d8 --help | grep memory` or whatever.

### `$ d8 --allow-natives-syntax file.js`

This actually lets you call V8 internal methods from within your JS file, like this:

```js
function factorial( n ) {
  return n === 1 ? n : factorial( --n );
}

var i = 0;

while ( i++ < 1e8 ) {
  factorial( 10 );
  // run a full Mark-sweep pass every 10MM iterations
  i % 1e7 === 0 && %CollectGarbage( null );
}
```

...and run `$ d8 --allow-natives-syntax --trace-gc test.js`

Native functions are prefixed with the `%` symbol. A (somewhat incomplete) list of native functions are listed [here](https://github.com/Nathanaela/v8-Natives/blob/master/lib/v8-native-calls.js).

### Logging

d8 doesn't have a `console` object (or a `window` object, for that matter). But you can log to the terminal using `print()`.

### Comparing Hidden Classes

This is probably my favorite one. I actually *just* found it.

So in V8, there's this concept of ["hidden classes"](http://www.html5rocks.com/en/tutorials/speed/v8/) (Good explanation a couple paragraphs in). You should read that article – but basically, hidden classes are how V8 (SpiderMonkey and JavaScript Core use similar techniques, too) determine whether or not two objects have the same "shape".

All things considered, you always want to pass objects of the same hidden class as arguments to functions.

Anyway, you can actually *compare* the hidden classes of two objects:

```
function Class( val ) {
  this.prop = val;
}

var a = new Class('foo');
var b = new Class('bar');

print( %HaveSameMap( a, b ) );

b.prop2 = 'baz';

print( %HaveSameMap( a, b ) );
```

Run `$ d8 --allow-natives-syntax test.js`

You should see `true`, then `false`. By adding `b.prop2 = 'baz'`, we modified its structure and created a new hidden class.

### Node.js

A lot of these flags (but not all of them) work with Node, too. `--trace-opt`, `--prof`, `--allow-natives-syntax` are all supported.

That can be helpful if you want to test something that relies on another library, since you can use Node's `require()`.

A list of supported V8 flags can be accessed with `node --v8-options`.

### Links

[Performance Tips for JavaScript in V8](http://www.html5rocks.com/en/tutorials/speed/v8/) (Good basic intro to Hidden Classes)

[Use forensics and detective work to solve JavaScript performance mysteries](http://www.html5rocks.com/en/tutorials/performance/mystery/)

[Breaking the JavaScript Speed Limit with V8](https://www.youtube.com/watch?v=UJPdhx5zTaw)

[V8 - A Tale of Two Compilers](http://wingolog.org/archives/2011/07/05/v8-a-tale-of-two-compilers) (Good explanation of Inline Caches)

------

Anyway, this is all still pretty new to me, and there's a lot I haven't figured out yet. But the stuff I've found so far is pretty cool, so I wanted to write something up and share it.

Oh, and I'm sure there's stuff in here that I'm wrong about, because I'm honestly a little out of my depth here. Feedback is appreciated.

> 使用 Demo 请参考 [d8-shell-examples](https://gist.github.com/kevincennis/0cd2138c78a07412ef21#d8-shell-examples)
