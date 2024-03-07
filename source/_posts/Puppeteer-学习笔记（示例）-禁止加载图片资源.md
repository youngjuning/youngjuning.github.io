---
title: 'Puppeteer 学习笔记（示例）: 禁止加载图片资源'
description: '在 Puppeteer 中，如果你想禁止加载图片，可以通过拦截请求并阻止图片资源类型的请求来实现。这可以通过使用 page.setRequestInterception(true) 来启用请求拦截，然后在 request 事件监听器中检查请求类型，如果是图片，则调用 request.abort() 方法。'
date: 2024-03-07 17:29:02
categories:
  - 全栈开发
tags:
  - Puppeteer
  - JavaScript
---

## 拦截所有图片资源

在 Puppeteer 中，如果你想禁止加载图片，可以通过拦截请求并阻止图片资源类型的请求来实现。这可以通过使用 `page.setRequestInterception(true)` 来启用请求拦截，然后在 `request` 事件监听器中检查请求类型，如果是图片，则调用 `request.abort()` 方法。

以下是一个示例代码，展示了如何在 Puppeteer 中禁止加载图片：

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 启用请求拦截
  await page.setRequestInterception(true);

  // 添加请求拦截器
  page.on('request', request => {
    // 如果请求的资源类型是图片，则阻止该请求
    if (request.resourceType() === 'image') {
      request.abort();
    } else {
      request.continue();
    }
  });

  // 导航到页面
  await page.goto('https://example.com');

  // 其他操作...

  await browser.close();
})();
```

在这段代码中，我们首先通过 `setRequestInterception(true)` 启用了请求拦截。然后，我们监听 `request` 事件，并检查每个请求的资源类型。如果资源类型是 `image`，我们就调用 `request.abort()` 来阻止这个请求。对于其他类型的请求，我们调用 `request.continue()` 来允许请求继续。

这种方法可以有效减少页面加载时间和带宽使用，特别是在你不需要处理图片数据时。

## 拦截指定域名的图片资源

在 Puppeteer 中，如果你想禁止加载来自特定域名的图片，你可以在启用请求拦截后，检查请求的 URL，并根据域名决定是否要阻止该请求。以下是一个示例代码，展示了如何根据域名禁止加载图片：

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 启用请求拦截
  await page.setRequestInterception(true);

  // 添加请求拦截器
  page.on('request', request => {
    // 获取请求的 URL
    const url = request.url();
    // 解析 URL 以获取域名
    const hostname = new URL(url).hostname;

    // 检查请求是否为图片以及域名是否为特定域名
    if (request.resourceType() === 'image' && hostname === 'example.com') {
      // 阻止来自特定域名的图片请求
      request.abort();
    } else {
      // 允许其他请求
      request.continue();
    }
  });

  // 导航到页面
  await page.goto('https://example.com');

  // 其他操作...

  await browser.close();
})();
```

在这个例子中，我们首先通过 `setRequestInterception(true)` 启用了请求拦截。然后，我们监听 `request` 事件，对于每个请求，我们获取它的 URL 并解析出域名。如果请求的资源类型是 `image` 并且域名与我们指定的域名匹配，我们就调用 `request.abort()` 来阻止这个请求。对于其他类型的请求或来自其他域名的请求，我们调用 `request.continue()` 来允许请求继续。

请确保将 `'example.com'` 替换为你想要阻止图片加载的特定域名。这种方法可以帮助你减少不必要的网络流量，特别是当你只想屏蔽来自某些域名的图片时。
