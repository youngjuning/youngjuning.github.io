---
title: 'Puppeteer 学习笔记（一）: 入门'
description: 'Puppeteer 是一个 Node 库，它提供了一个高级 API 来通过 DevTools 协议控制 Chromium 或 Chrome。Puppeteer 默认以 headless 模式运行，但是可以通过修改配置文件运行“有头”模式。'
date: 2024-03-07 10:19:57
categories: 全栈开发
tags:
  - puppeteer
  - nodejs
  - 前端
---

## Puppeteer 是什么？

Puppeteer 是一个 Node 库，它提供了一个高级 API 来通过 DevTools 协议控制 Chromium 或 Chrome。Puppeteer 默认以 headless 模式运行，但是可以通过修改配置文件运行“有头”模式。

## Puppeteer 能做什么?

你可以在浏览器中手动执行的绝大多数操作都可以使用 Puppeteer 来完成！ 下面是一些示例：

- 生成页面 PDF。
- 抓取 SPA（单页应用）并生成预渲染内容（即“SSR”（服务器端渲染））。
- 自动提交表单，进行 UI 测试，键盘输入等。
- 创建一个时时更新的自动化测试环境。 使用最新的 JavaScript 和浏览器功能直接在最新版本的Chrome中执行测试。
- 捕获网站的 timeline trace，用来帮助分析性能问题。
- 测试浏览器扩展。

## 如何安装 puppeteer？

```bash
npm install puppeteer
```

## 使用 puppeteer

Puppeteer 使用起来和其他测试框架类似。你需要创建一个 Browser 实例，打开页面，然后使用 Puppeteer 的 API。

Example - 跳转到 https://example.com 并保存截图至 example.png:

```js
// example.js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.otemeta.com');
  await page.screenshot({path: 'otemeta.png'});

  await browser.close();
})();
```

在命令行中执行：

```js
node example.js
```

## 默认设置

### 使用有头模式

```js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.otemeta.com');

  await browser.close();
})();
```

### 默认视口

```js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1280,
      height: 720
    }
  });
  const page = await browser.newPage();
  await page.goto('https://www.otemeta.com');

  await browser.close();
})();
```

### 在导航期间忽略 HTTPS 错误.

```js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: false,
    defaultViewport: {
      width: 1280,
      height: 720
    }
  });
  const page = await browser.newPage();
  await page.goto('https://www.otemeta.com');

  await browser.close();
})();
```

## Browser 实例

### 常用方法

- `browser.newPage()`：返回一个新的 Page 对象。Page 在一个默认的浏览器上下文中被创建。
- `browser.close()`：关闭 Chromium 及其所有页面(如果页面被打开的话)。
- `browser.pages()`：返回一个包含所有打开的页面的数组。

## Page 实例

### page.goto(url[, options])

导航到相应地址. 地址应该带有 http 协议, 比如 `https://`。options：

- timeout：跳转等待时间，单位是毫秒, 默认是30秒, 传 0 表示无限等待。可以通过 `page.setDefaultNavigationTimeout(timeout)` 方法修改默认值
- waitUntil：满足什么条件认为页面跳转完成，默认是 load 事件触发时。指定事件数组，那么所有事件触发后才认为是跳转完成。事件包括：
  - load - 页面的load事件触发时
  - domcontentloaded - 页面的 DOMContentLoaded 事件触发时
  - networkidle0 - 不再有网络连接时触发（至少500毫秒后）
  - networkidle2 - 只有2个网络连接时触发（至少500毫秒后）

### 常用方法

- `page.$(selector)`：此方法在页面内执行 `document.querySelector`。如果没有元素匹配指定选择器，返回值是 `null`。
- `page.$$(selector)`：此方法在页面内执行 `document.querySelectorAll`。如果没有元素匹配指定选择器，返回值是 `[]`。
- `page.close([options])`：关闭页面
- `page.evaluate(pageFunction[, ...args])`： 在页面实例上下文中执行方法
- `page.setCookie(...cookies)`：设置 cookie
- `page.setViewport(viewport)`：如果是一个浏览器多个页面的情况，每个页面都可以有单独的 viewport

## 示例

### 创建一个 PDF。

文件为 `hn.js`

```js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.otemeta.com', { waitUntil: 'networkidle2' });
  await page.pdf({path: 'hn.pdf', format: 'A4'});

  await browser.close();
})();
```

### 在页面中执行脚本

```js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.otemeta.com');

  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });

  console.log('Dimensions:', dimensions);

  await browser.close();
})();
```

## puppeteer FAQ

### puppeteer 和 puppeteer-core 的区别

当你安装 `puppeteer` 时，它会下载最新版本的 Chromium（~170MB Mac，~282MB Linux，~280MB Win），以保证可以使用 API。 如果想要跳过下载，请阅读环境变量。

自 1.7.0 版本以来，我们都会发布一个 `puppeteer-core` 包，这个包默认不会下载 Chromium。

`puppeteer-core` 是一个的轻量级的 Puppeteer 版本，用于启动现有浏览器安装或连接到远程安装。

### puppeteer.launch 和 puppeteer.connect 的区别

puppeteer 提供了两种方式来启动浏览器：`puppeteer.launch` 和 `puppeteer.connect`。

1. `puppeteer.launch`: 这个方法会启动一个全新的浏览器实例，每次调用 `puppeteer.launch` 都会启动一个新的浏览器进程。这种方式适合于需要独立的、干净的浏览器环境的场景，比如进行网页截图、自动化测试等。

2. `puppeteer.connect`: 这个方法允许连接到一个已经存在的浏览器实例。这种方式适合于需要在已有浏览器实例上进行操作的场景，比如远程调试、复用已有的浏览器环境等。

因此，`puppeteer.launch` 用于启动新的浏览器实例，而 `puppeteer.connect` 用于连接到已有的浏览器实例。根据具体的需求和场景，选择合适的方法来启动或连接浏览器。
