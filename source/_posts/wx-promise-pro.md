---
title: wx-promise-pro
date: 2020-02-18 21:57:59
description: wx-promise-pro 是一个 强大、优雅的小程序异步库🚀 小程序 promise 插件
categories:
  - [前端, 微信小程序]
tags:
  - 微信小程序
  - 微信小程序异步库
  - 微信小程序promise
  - 微信小程序async/await
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

✨强大、优雅的小程序异步库🚀 小程序promise

[![NPM](https://user-gold-cdn.xitu.io/2020/2/18/1705883821e962d8?w=297&h=45&f=png&s=3701)](https://nodei.co/npm/wx-promise-pro/)

## 优势

- 方便集成：一处引用，处处使用
- 把微信小程序所有异步 API promise 化并挂在到`wx.pro` 对象下
- 支持 ES2018 `finally` 特性
- 支持 TypeScript 开发

## 安装

```bash
$ npm i wx-promise-pro
# or
$ yarn add wx-promise-pro
```

## 初始化

```js
import { promisifyAll, promisify } from 'wx-promise-pro'
// promisify all wx‘s api
promisifyAll()
// promisify single api
promisify(wx.getSystemInfo)().then(console.log)
```

## 支持所有的微信小程序异步API

使用 `promisifyAll` 开发者无需关心兼容与否，只要是 `wx` 支持的 api，`wx.pro` 全部支持。

**示例代码：**

```js
// 演示 wxPromise 的能力
wx.pro.showLoading({
  title: '加载中',
  mask: true
})
wx.pro.request({
  url: 'https://cnodejs.org/api/v1/topics',
  data: {},
  method: 'GET',
  header: {'content-type': 'application/json'}
}).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
}).finally(() => {
  wx.hideLoading()
})
```

## Contributors

This project exists thanks to all the people who contribute. <!--[[Contribute](CONTRIBUTING.md)].-->
<a href="https://github.com/youngjuning/wx-promise-pro/graphs/contributors"><img src="https://user-gold-cdn.xitu.io/2020/2/18/17058837fd8af7c9?w=890&h=74&f=svg&s=150945" /></a>

## GitHub源码：https://github.com/youngjuning/wx-promise-pro
