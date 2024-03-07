---
title: 'Puppeteer 学习笔记（示例）: 打开多个页面并依次切换tab'
description: '在 Puppeteer 中，"tab"通常指的是浏览器窗口中的页面（Page）。如果你想同时打开多个页面（即多个tab），然后依次在它们之间切换，你可以按照以下步骤进行。'
date: 2024-03-07 17:25:16
categories:
  - 全栈开发
tags:
  - Puppeteer
  - 爬虫
  - Node
---

在 Puppeteer 中，"tab"通常指的是浏览器窗口中的页面（Page）。如果你想同时打开多个页面（即多个tab），然后依次在它们之间切换，你可以按照以下步骤进行：

1. 创建多个页面对象。
2. 同时打开所有页面。
3. 依次切换到每个页面并执行操作。

以下是一个示例代码，展示了如何同时打开多个页面，并在它们都加载完成后依次切换和操作：

```javascript
const puppeteer = require('puppeteer');

(async () => {
  // 启动浏览器
  const browser = await puppeteer.launch({ headless: false }); // 设置为非无头模式以便看到浏览器标签切换

  // 定义要访问的 URL 列表
  const urls = ['https://example.com', 'https://example.org', 'https://example.net'];

  // 同时创建并打开所有页面
  const pages = await Promise.all(urls.map(async (url) => {
    const page = await browser.newPage();
    await page.goto(url);
    return page;
  }));

  // 依次切换到每个页面并执行操作
  for (const page of pages) {
    // 将焦点切换到当前页面
    await page.bringToFront();

    // 在这里可以执行页面操作，例如截图、提取页面内容等
    // 示例：打印当前页面的 URL
    console.log(await page.url());

    // 你可以在这里加入随机停留时间
    const randomDelay = Math.floor(Math.random() * (180000 - 60000 + 1)) + 60000;
    await page.waitForTimeout(randomDelay);

    // 执行完操作后，可以选择关闭当前页面或保持打开状态
    // await page.close();
  }

  // 如果你没有关闭每个页面，可以在这里关闭浏览器
  // await browser.close();
})();
```

在这个脚本中：

- `browser.newPage()` 用于创建新页面。
- `page.goto(url)` 用于导航到指定的 URL。
- `page.bringToFront()` 用于将当前页面切换到前台，这样你就可以模拟用户在不同的标签页之间切换。

请注意，如果你不关闭每个页面，那么在脚本的最后你应该关闭浏览器，以释放资源。如果你关闭了每个页面，那么关闭浏览器的步骤可以省略，因为当最后一个页面关闭时，Puppeteer 通常会自动关闭浏览器。

此外，由于这个脚本是在非无头模式下运行的（`headless: false`），你可以看到浏览器窗口和标签页的切换。如果你不需要看到浏览器界面，可以将其设置为无头模式（`headless: true`），这通常会稍微提高性能。
