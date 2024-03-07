---
title: 在 JavaScript 中实现一个延迟函数
description: '在 JavaScript 中实现一个延迟函数（通常称为 delay 或 sleep 函数）非常简单，你可以使用 Promise 和 setTimeout 函数来实现。'
date: 2024-03-07 17:27:07
categories:
  - [前端, JavaScript]
tags:
  - Promise
  - setTimeout
---

在 JavaScript 中实现一个延迟函数（通常称为 `delay` 或 `sleep` 函数）非常简单，你可以使用 Promise 和 `setTimeout` 函数来实现。以下是一个 `delay` 函数的示例：

```javascript
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

// 使用方法
async function run() {
  console.log('Delay start');
  await delay(2000); // 延迟 2000 毫秒（2秒）
  console.log('Delay end');
}

run();
```

在这个例子中，`delay` 函数接收一个时间参数（以毫秒为单位），然后返回一个 Promise。这个 Promise 将在指定的时间后通过 `setTimeout` 函数解决。在 `run` 函数中，我们使用 `await` 关键字等待 `delay` 函数，这样代码的执行就会在这里暂停指定的时间。

你可以根据需要调用 `delay` 函数来在任何地方添加延迟。这在模拟网络请求、动画等场景中非常有用。
