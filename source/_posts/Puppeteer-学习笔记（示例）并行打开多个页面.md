---
title: 'Puppeteer 学习笔记（示例）: 并行打开多个页面'
description: '要使用 Puppeteer 并行打开多个页面，你可以使用 `Promise.all()` 来同时处理多个页面。这样，你可以在同一个浏览器实例中并行打开多个标签页。'
date: 2024-03-07 10:44:16
categories:
  - 全栈开发
tags:
  - Puppeteer
  - 学习笔记
---

要使用 Puppeteer 并行打开多个页面，你可以使用 `Promise.all()` 来同时处理多个页面。这样，你可以在同一个浏览器实例中并行打开多个标签页。下面是一个示例代码，展示了如何实现这一点：

```javascript
const puppeteer = require('puppeteer');

(async () => {
  // 启动浏览器
  const browser = await puppeteer.launch();

  // 定义要访问的 URL 列表
  const urls = ['https://example.com', 'https://example.org', 'https://example.net'];

  // 使用 map() 方法将每个 URL 映射到打开页面的 Promise
  const pagePromises = urls.map(async (url) => {
    // 创建一个新页面
    const page = await browser.newPage();

    // 导航到指定的 URL
    await page.goto(url);

    // 在这里可以执行其他页面操作，例如截图、提取页面内容等
    // 例如：await page.screenshot({ path: `screenshot-${url}.png` });

    // 关闭页面
    await page.close();
  });

  // 使用 Promise.all() 等待所有页面的 Promise 完成
  await Promise.all(pagePromises);

  // 所有页面处理完毕后关闭浏览器
  await browser.close();
})();
```

在这个脚本中，`urls.map()` 会为每个 URL 创建一个新的 Promise，这些 Promise 会开始执行页面的打开和操作过程。`Promise.all()` 会等待所有这些 Promise 完成，这意味着所有页面的操作都是并行执行的。

请注意，虽然这种方法可以提高效率，但是如果同时打开的页面太多，可能会消耗大量的系统资源，导致性能下降。因此，如果要处理大量页面，可能需要实现一种队列或者限制并发数量的机制。
