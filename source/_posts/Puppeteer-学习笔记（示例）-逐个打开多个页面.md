---
title: 'Puppeteer 学习笔记（示例）: 逐个打开页面并滑动到底部'
description: '在 Puppeteer 中，你可以使用 `browser.newPage()` 方法来打开多个页面（也称为标签页或 tabs）'
date: 2024-03-07 10:35:27
categories:
  - 全栈开发
tags:
  - Puppeteer
  - 学习笔记
---

在 Puppeteer 中，你可以使用 `browser.newPage()` 方法来打开多个页面（也称为标签页或 tabs）。以下是一个基本的示例，展示了如何使用 Puppeteer 打开多个页面并逐个访问不同的 URL：

```javascript
const puppeteer = require('puppeteer');

(async () => {
  // 启动浏览器
  const browser = await puppeteer.launch();

  // 定义要访问的 URL 列表
  const urls = ['https://example.com', 'https://example.org', 'https://example.net'];

  // 遍历 URL 列表，为每个 URL 打开一个新页面
  for (const url of urls) {
    // 创建一个新页面
    const page = await browser.newPage();

    // 导航到指定的 URL
    await page.goto(url);

    // 在这里可以执行其他页面操作，例如截图、提取页面内容等
    // 例如：await page.screenshot({ path: `screenshot-${url}.png` });

    // 关闭页面
    await page.close();
  }

  // 所有页面访问完毕后关闭浏览器
  await browser.close();
})();
```

这个脚本首先启动了一个新的浏览器实例，然后遍历一个包含 URL 的数组，为每个 URL 创建一个新页面，并导航到相应的地址。在每个页面上，你可以执行所需的操作，比如截图、页面内容分析等。完成操作后，脚本会关闭当前页面，并在处理完所有页面后关闭浏览器实例。

请注意，这个脚本是按顺序打开和处理每个页面的。如果你想同时打开多个页面，你可以创建所有页面的 Promise，然后使用 `Promise.all()` 来等待所有页面操作完成。但是，这样做可能会对计算机的性能造成较大压力，尤其是当打开的页面数量较多时。
