---
title: React Native 调试最佳实践
description: 在每一个开发者的职业生涯中最重要的是知道如何处理这些失误。作为一个 React Native 开发者，我经常想要写出没有 BUG 的代码，但是当出现问题时，我需要确保我能够追踪并解决问题。
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1681901066692.png
date: 2023-04-19 18:43:42
categories:
  - [前端, React Native]
tags:
  - React Native
  - 调试
  - 调试工具
  - 调试技巧
  - Reactotron
  - Flipper
  - React Native Debugger
  - React Native Debug
  - React Native Debugging
---

人非圣贤孰能无过。

这句话还（更确切地说：尤其是...）适用于软件开发者。

这就是为什么在每一个开发者的职业生涯中最重要的是知道如何处理这些失误。作为一个 React Native 开发者，我经常想要写出没有 BUG 的代码，但是当出现问题时，我需要确保我能够追踪并解决问题。

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b361ca265e1d478faf33e97edd22b1e2~tplv-k3u1fbpfcp-zoom-1.image)

在这篇文章中，我想讨论一些日常用于移动应用程序开发的工具和技术。我希望你可以发现一些对你的项目有帮助的东西。

## 静态检测，类型检查和格式化

## 静态检测

Linting 是执行程序的过程，用于分析潜在的语法程序错误。JavaScript 中最著名的 Linting 插件有：

- ESLint - JavaScript 类型检查和格式化工具
- Google's Closure Compiler – 一个 JavaScript 优化器，可以更快速，更简洁地重写代码并检查本机 JavaScript 函数的使用。
- JSLint – JavaScript 语法检查器和验证器

现在 ESLint 处于一统江湖的地位，也是 TypeScript 官方的 Linting 插件。

## 类型检查

我使用 TypeScript（TS）或者 Flow 来做 类型检查。两者最主要的区别是前者是编程语言，而 Flow 是类型检查器。在我看来，TS 是更优的选择，因为大量类似于自动导入、自我证明和使用下一代 JavaScript 的能力。

> 原文中说 TS 是编程语言，我不完全赞同。毕竟官方的定位也只是 JavaScript 的超集。

## 格式化代码

程序员大部分时间都在阅读代码，因此重点不是更快地阅读代码，而是快速理解代码。

为了做到快读理解代码，我们需要最有效的视觉表示。这就是为什么我们需要很好地格式化代码。

比较一下下面的代码片段：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3f4cfbcf58a4726af1eb510386dc12a~tplv-k3u1fbpfcp-zoom-1.image)

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec3a96ee27354026a8013168bbb9b053~tplv-k3u1fbpfcp-zoom-1.image)

我建议大家使用 Prettier 格式化代码 - 它很容易集成和配置。你也可以通过 `eslint-config-prettier` 和 `eslint-plugin-prettier` 这两个插件和 ESLint 配合使用。

## 如何调试 React Native 应用

React Native 具有开发人员友好的环境，会告诉我们我们在警告或错误方面做错了什么：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b33a0defc7b47c8b7de95526dd76514~tplv-k3u1fbpfcp-zoom-1.image)

## 内置调试模式

首先，您可以使用浏览器的内置调试模式（例如 Chrome 或 Safari）调试应用程序。

在 Chrome 中使用，你需要安装 `react-devtools`：

```sh
npm install -g react-devtools
```

在开发模式下，您可以打开开发人员菜单并从那里开始调试您的应用程序。只需激活 `debug` 选项：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/682b8dec24284e48a01f6647eb1b333b~tplv-k3u1fbpfcp-zoom-1.image)

它将打开带有 `http://localhost8081/debugger-ui` 路径的 Chrome 浏览器标签。

在您的 Chrome 浏览器中，您应该看到以下屏幕：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a119459876cc44d7a6a7388114b92aa3~tplv-k3u1fbpfcp-zoom-1.image)

您也可以在 Safari 中调试应用的 iOS 版本，而不必启用 `Debug JS Remotely`。

怎么做？在 Safari 浏览器中，只需打开：

**Preferences → Advanced → Select "Show Develop menu in menu bar**

并选择 App 的 JSContext:

**Develop → Simulator → JSContext**

Safari 的 Web 检查器应打开，并应显示一个 `Console` 和一个 `Debugger`。每次重新加载应用程序时（使用实时 `live reload`、`fast refresh` 或通过手动重新加载），一个新的 JSContext 将被创建。只需选择 `Automatically Show Web Inspectors for JSContexts`，就可以避免手动选择最新的 JSContext。

## Reactotron

如果您习惯将 Redux 用于 React Native 或 ReactJS 的状态管理，[Reactotron](https://infinite.red/reactotron) 是调试状态的绝佳工具：

- 查看应用状态
- 显示 API 请求和响应
- 执行快速的性能压测
- 订阅应用的部分状态
- 显示类似于 `console.log` 的消息
- 使用 `source-mapped` 堆栈跟踪（包括 saga 堆栈跟踪）跟踪全局错误！
- dispatch actions like a government-run mind control experiment
- 使用 Redux 或 mobx-state-tree 热交换您应用的状态
- 追踪你的 saga
- 在 React Native 中显示图像浮层
- 在 React Native 中跟踪您的异步存储

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e43cd0a09634d70891b33ae4b563a4a~tplv-k3u1fbpfcp-zoom-1.image)

## React Native Debugger

[react-native-debugger](https://github.com/jhen0409/react-native-debugger) 这是一个桌面应用程序，具有许多可调试应用程序的功能。至于应该提到的最重要的优点：

- 它基于官方的 Remote Debugger 并提供更多功能。
- 它包括来自 react-devtools-core 的 React Inspector。
- 它包括 Redux DevTools，并使用 redux-devtools-extension 制作了相同的 API。

> 注意: 如果你使用了 0.62 版本以上的 React Native，请使用 React Native Debugger v0.11

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be725c70791d4971b5a4eaefb43ad740~tplv-k3u1fbpfcp-zoom-1.image)

## Native Logs

根据[官方](https://reactnative.dev/docs/debugging#accessing-console-logs)的 React Native 文档，您可以轻松记录两种平台的报告：

```sh
$ npx react-native log-ios
$ npx react-native log-android
```

如果您需要进一步研究，可以使用特定于平台的 IDE（例如 [XCode](https://developer.apple.com/xcode/) 或 [Android Studio](https://developer.android.com/studio)）来分析应用程序的本机代码并解决问题。

## Flipper

[Flipper](https://fbflipper.com/) 是用于调试 iOS、Android 和 React Native 应用程序的下一代平台。这是一个桌面应用程序，可让您灵活地检查、可视化和控制应用程序开发调试。这里很酷的功能是您可以通过扩展来更新 Flipper 的功能，例如：

- https://github.com/jk-gan/redux-flipper
- https://github.com/blankapp/flipper-plugin-reduxinspector

如果您想集成 Redux 日志支持。

Flipper 支持 React Native Debugger 所有的功能，但是它也增加了很多。查看[官方文档](https://www.flippercloud.io/docs)，以确保并可能创建自己的插件并支持社区。

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14f985e6f5da4c238c751d873772cc7c~tplv-k3u1fbpfcp-zoom-1.image)

> 本文翻译自 [How To Debug React Native Apps Like A Pro? (Tools And Best Practices)](https://www.ideamotive.co/blog/how-to-debug-your-react-native-apps-like-a-pro)
