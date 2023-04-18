---
title: JavaScript 函数节流与函数防抖
description: 在前端开发中有一部分的用户行为会频繁地触发事件执行，而对于 DOM 操作、资源加载等耗费性能的处理，很可能导致界面卡顿，甚至浏览器的崩溃，JavaScript 函数节流与函数防抖就是为了解决类似需求应运而生的。
cover: https://cdn.jsdelivr.net/gh/youngjuning/images/202109241207550.png
date: 2020-02-13 20:33:46
categories:
  - [前端, JavaScript]
tags:
  - JavaScript 函数防抖
  - JavaScript 函数节流
  - JavaScript throttle
  - JavaScript debounce
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>


在前端开发中有一部分的用户行为会频繁地触发事件执行，而对于 DOM 操作、资源加载等耗费性能的处理，很可能导致界面卡顿，甚至浏览器的崩溃，函数节流（`throttle`）和函数防抖（`debounce`）就是为了解决类似需求应运而生的。

## 函数节流

函数节流就是预定一个函数只有在大于等于执行周期时才执行，周期内调用不执行。好像水滴攒到一定重量才会落下一样。场景：窗口调整（resize）、页面滚动（scroll）、抢购疯狂点击（mousedown）。

```js
function throttle (fn, wait = 0) {
  let lastTime = 0
  return function () {
    let now = Date.now()
    if(now - lastTime >= wait) {
      // 这里并不需要考虑执行环境，所以调用 apply() 时第一个参数是 null，之所以使用 apply 传递参数，是因为第二个参数可以是 arguments 对象
      fn.apply(null, arguments)
      lastTime = now
    }
  }
}

function boom() {
  console.log("boom")
}

setInterval(throttle(boom,2000), 1000) // 一个周期内触发了两次定时器，但是一个周期内只会执行一次 boom 方法。
```

## 函数防抖

函数防抖就是在函数需要频繁触发情况时，只有足够空闲的时间，才执行一次。好像公交司机会等人都上车后才出站一样。场景：实时搜索（keyup）、拖拽（mousemove）

```js
function debounce(fn, wait = 0) {
  return function() {
    clearTimeout(fn.tId)
    fn.tId = setTimeout(function() {
      fn.apply(this, arguments)
    }.bind(this), wait) // 使用 bind 来确保函数执行环境的正确性，否则就是 global 了
  }
}
document.getElementById("debounce").onclick = debounce(boom, 300)
// 单位时间内无论操作多少次，都会合并成一次操作，并在最后一次操作后延迟 300 毫秒执行
```
