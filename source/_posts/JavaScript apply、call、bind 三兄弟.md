---
title: JavaScript apply、call、bind 三兄弟
date: 2020-02-09 16:07:05
categories:
  - [前端, JavaScript]
tags:
  - JavaScript
  - apply
  - call
  - bind
---

这三个函数的存在意义是什么？答案是**改变函数执行时的上下文**，再具体一点就是改变函数运行时的 `this` 指向。

## 在特定的作用域中调用函数

`apply()` 和 `call()` 方法的用途都是在特定的作用域中调用函数。

### apply

> `apply` 方法接收两个参数：一个是在其中运行函数的作用域，另一个是参数数组。其中，第二个参数可以是 Array 的实例，也可以是 `arguments` 对象。

```js
function sum(num1, num2) {
  return num1 + num2
}
function callSum1(num1, num2) {
  return sum.apply(this, arguments) // 传入 arguments 对象
}
function callSum2(num1, num2) {
  return sum.apply(this, [num1, num2]) // 传入参数
}
console.log(callSum1(10, 10))
console.log(callSum2(10, 10))
```

## call

> `call()` 方法与 `apply()` 方法的作用相同，它们区别仅在于接受参数的方式不同。对于 `call()` 方法而言，第一个参数是 `this` 值没有变化，变化的是其余参数都直接传递给函数。

```js
function sum(num1, num2) {
  return num1 + num2
}
function callSum(num1, num2) {
  return sum.call(this, num1, num2)
}
console.log(callSum(10, 10))
```

> 不传递参数的情况下，使用 `call()` 方法语义跟明确

## 创建一个改变了上下文的函数

`call()` 和 `apply()` 方法改变了函数的 `this` 上下文之后便立即执行该函数，而 `bind()` 方法会创建一个函数的实例并返回，其 `this` 值会被绑定到传递给 `bind()` 函数的值。

```js
var color = 'red'
var o = {
  color: 'blue',
  sayColor: function() {
    console.log(this.color) // 这个 this 的值是 o
    setTimeout(
      function() {
        console.log(this.color) // 默认的值是 this 的值是 window
      }.bind(this),
      1000,
    )
  },
}

console.log(o.sayColor()) // blue

function sayColor() {
  alert(this.color)
}

var objectSayColor = sayColor.bind(o)
console.log(objectSayColor()) // blue
```
