---
title: single-spa 原理解析（内部分享）
date: 2021-11-21 17:00:00
categories:
  - 前端
tags:
  - 微前端
---

## single-spa 是什么？

Single-spa 是一个将多个单页面应用聚合为一个整体应用的 JavaScript 微前端框架。 使用 single-spa 进行前端架构设计可以带来很多好处，例如:

- 在同一页面上使用多个前端框架而不用刷新页面 (React, AngularJS, Angular, Ember, 你正在使用的框架)
- 独立部署每一个单页面应用
- 新功能使用新框架，旧的单页应用不用重写可以共存
- 改善初始加载时间，延迟加载代码

single-spa 可以说是微前端的鼻祖了，市面上纷杂的解决方案多少都受到了它的影响，以下两款流行的生产级框架则更是基于 single-spa 开发的。

- [qiankun](https://qiankun.umijs.org/zh/guide)：蚂蚁金服出品的易用的微前端框架。
- [Isomorphic Layout Composer（ILC）](https://github.com/namecheap/ilc)：一个将微前端组成部分支持 SSR 的完整的解决方案。

## single-spa 架构

single-spa 借鉴了组件生命周期的思想，它为应用设置了针对路由的生命周期。当应用匹配路由/处于激活状态时，应用会把自身的内容挂载到页面上；反之则卸载。典型的 single-spa 由 html 页面、应用注册脚本、应用脚本自身构成。应用注册内容包含：

- appName：应用名
- loadingFunction：加载应用程序的代码。
- activityFunction 函数：确定应用程序何时处于活动状态/非活动状态。
- customProps：自定义 props，可以不填

single-spa 又约定应用脚本包含以下生命周期：

- `load`：当应用匹配路由时就会加载脚本（非函数，只是一种状态）
- `bootstrap`：引导函数（对接 html，应用内容首次挂载到页面前调用）
- `mount`：挂载函数
- `unmount`：卸载函数（须移除事件绑定等内容）
- `unload`：非必要（unload 之后会重新启动 bootstrap 流程；借助 unload 可实现热更新）。

生命周期函数获得参数包含 name（应用名）、singleSpa（实例）、mountParcel（手动挂载函数）、customProps（自定义信息），生命周期函数必须返回 Promise 或其本身为 async 函数，`bootstrap`、mount、unmount 生命周期函数不可缺省，生命周期函数可以指定多个，它们会构成异步调用链，逐个调用。简要流程图如下：

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202111221452146.png)

## 示例

源码参考：[youngjuning/simple-single-spa-webpack-example](https://github.com/youngjuning/simple-single-spa-webpack-example)

### 1.创建一个 html 文件

```html
<html>
<body>
    <script src="single-spa-config.js"></script>
</body>
</html>
```

### 2.创建一个 single-spa-config。

```js
import * as singleSpa from 'single-spa';

/* loading 是一个返回 promise 的函数，用于 加载/解析 应用代码。
 * 它的目的是为延迟加载提供便利 —— single-spa 只有在需要时才会下载应用程序的代码。
 * 在这个示例中，在 webpack 中支持 import ()并返回 Promise，但是 single-spa 可以使用任何返回 Promise 的加载函数。
 */
singleSpa.registerApplication('app-1', () =>
  import ('../app1/app1.js'), pathPrefix('/app1'));
singleSpa.registerApplication('app-2', () =>
  import ('../app2/app2.js'), pathPrefix('/app2'));

singleSpa.start();

/* Single-spa 配置顶级路由，以确定哪个应用程序对于指定 url 是活动的。
 * 你可以以任何你喜欢的方式实现此路由。
 * 一种有用的约定是在 url 前面加上活动应用程序的名称，以使顶层路由保持简单。
 */
function pathPrefix(prefix) {
  return function(location) {
    return location.pathname.startsWith(`${prefix}`);
  }
}
```

### 3.创建一个应用程序。

```js
import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import Root from './root.component.tsx';

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  domElementGetter,
});

export function bootstrap(props) {
  return reactLifecycles.bootstrap(props);
}

export function mount(props) {
  return reactLifecycles.mount(props);
}

export function unmount(props) {
  return reactLifecycles.unmount(props);
}

function domElementGetter() {
  // 确保这里有一个 div 供渲染用
  let el = document.getElementById('app1');
  if (!el) {
    el = document.createElement('div');
    el.id = 'app1';
    document.body.appendChild(el);
  }

  return el;
}
```

## 源码解析

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202111221420019.png)

其中 avigation、lifecycles、applications 这三个文件夹即可，是整个源码的核心。

### 核心方法分析

绿底白字则是 single-spa 的三个核心方法 [registerApplication](http://tny.im/T5UaE)、[reroute](http://tny.im/tsub) 和 [start](http://tny.im/9CvCH)，脑图描述了这三个方法具体做了什么：

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202111221417558.png)

### 初始化加载流程

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202111221423159.png)

### 应用启动和挂载流程

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202111221423521.png)

## 经验

1. 加载操作一般都是异步的，比如加载插件、加载应用。所以原则上只要会使用 Promise，我们就能很快模仿一个自己的微前端架构出来。
2. 本次分享没有涉及微前端的另个一个重要概念沙箱，有机会单独分享。
3. 技术发展都是有迹可循的，搞清发展脉络对于理解应用一个技术也很有帮助。

## 参考

- [微前端框架single-spa源码解析、项目实战、手写简版single-spa](https://juejin.cn/post/6941402712890638367)
- [微前端框架 之 single-spa 从入门到精通](https://juejin.cn/post/6862661545592111111#heading-43)
- [single-spa 实现前端微服务](https://zhuanlan.zhihu.com/p/107059106)
