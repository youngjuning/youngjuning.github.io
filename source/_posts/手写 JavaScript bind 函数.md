---
title: 手写 JavaScript bind 函数
description: bind 是在 ES5 加入的语法，具体如何使用 MDN 都有。但有一点需要额外注意一下：bind 会返回一个新的函数。也就是说：它会修改 this 的指向，并返回新的函数体。
date: 2020-02-19 15:28:58
categories:
  - [前端, JavaScript]
tags:
  - 手写代码
  - JavaScript
  - Function.prototype.bind
  - bind
  - this
  - apply
  - call
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>


`bind` 是在 ES5 加入的语法，具体如何使用 MDN 都有。但有一点需要额外注意一下：`bind` 会返回一个新的函数。也就是说：它会修改 `this` 的指向，并返回新的函数体。

## 实现思路

1. 改变 `this` 指向: 需要使用 `apply` 或 `call`
2. 返回新的函数体: 函数作为值返回

## 实现

使用闭包保存 this 指针、上下文和参数，并将上下文和参数使用 apply 改变 this 指向。

```js
Function.prototype.bind1 = function(context) {
  var that = this
  return function() {
    that.apply(context, arguments)
  }
}
```

使用方式和原生 `bind()` 一样：

```js
var person = { name:"杨俊宁" }
function sayHi(name) {
  console.log(this, name)
}
var pSay = sayHi.bind1(person)
```
