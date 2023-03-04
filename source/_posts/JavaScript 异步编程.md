---
title: JavaScript 异步编程
date: 2020-01-30 17:15:25
cover: https://cdn.jsdelivr.net/gh/youngjuning/images/202109241209534.png
categories:
  - 前端
tags:
  - JavaScript
---

围绕异步编程领域，现代软件设计正在加速旋转，就为了让程序在一个时间内做更多的事情。当你使用更新更强大的 API 时，你会发现在更多的情况下，使用异步编程是唯一的途径。以前写异步代码很困难，现在也需要你来适应，但是已经变容易了很多。

## 回调函数（Callback）

回调函数是异步操作最基本的方法。以下代码就是一个回调函数的例子：

```js
ajax(url, () => {
  // 处理逻辑
})
```

但是回调函数有一个致命的弱点，就是容易写出回调地狱（Callback hell）。假设多个请求存在依赖性，你可能就会写出如下代码：

```js
ajax(url, () => {
  // 处理逻辑
  ajax(url1, () => {
    // 处理逻辑
    ajax(url2, () => {
      // 处理逻辑
    })
  })
})
```

回调函数的优点是简单、容易理解和实现，缺点是不利于代码的阅读和维护，各个部分之间高度耦合，使得程序结构混乱、流程难以追踪（尤其是多个回调函数嵌套的情况），而且每个任务只能指定一个回调函数。此外它不能使用 try catch 捕获错误，不能直接 return。

## Promise

### Promise 状态

- pending: 初始状态，既不是成功，也不是失败状态。
- fulfilled: 意味着操作成功完成。
- rejected: 意味着操作失败。
- Settled: Promise 要么被完成，要么被拒绝。Promise 一旦达成，它的状态就不再改变。

### 基本用法

ES6 规定，Promise 对象是一个构造函数，用来生成 Promise 实例。

```js
const promise = new Promise((resolve, reject) => {
  // ... some code
  if (/* 异步操作成功 */){
    resolve(value)
  } else {
    reject(error)
  }
})
```

### 短路特性

- `Promise.all()`: 如果参数中 promise 有一个失败（rejected），此实例回调失败（reject）
- `Promise.race()`: 如果参数中某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝。

### Promise.all 于 Array.prototype.map

```js
const urls = ['http://example.com/first.txt', 'http://example.com/second.txt']

const promises = urls.map(url => downloadText(url))

Promise.all(promises).then(arr => {
  console.log(arr)
})
```

### Promise.allSettled()

`Promise.allSettled` 这一特性是由 Jason Williams，Robert Pamely 和 Mathias Bynens 提出。

它返回一个 Array 的 Promise，其元素具有以下类型特征：

```ts
type SettlementObject<T> = FulfillmentObject<T> | RejectionObject

interface FulfillmentObject<T> {
  status: 'fulfilled'
  value: T
}

interface RejectionObject {
  status: 'rejected'
  reason: any
}
```
