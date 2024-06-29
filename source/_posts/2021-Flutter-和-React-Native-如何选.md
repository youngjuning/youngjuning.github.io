---
title: 2021 Flutter 和 React Native 如何选
description: 从 Flutter 诞生之日起，React Native 就一直被拿来与之作比较，从谷歌超过 700 万的相关搜索结果中可以一瞥这场跨端王位之争的激烈程度。本文不像我翻译的标题一样在捧一踩一，而是较客观地对两者进行评价并给出实际需求中如何抉择。
date: 2021-04-19 17:50:36
categories:
  - [前端, React Native]
  - [前端, Flutter]
tags:
  - Flutter
  - React Native
  - 跨端
  - 跨平台
---

> 原文链接：https://www.thedroidsonroids.com/blog/flutter-vs-react-native-what-to-choose-in-2021
> 原作者：the droids on roids
> 校对：[Alex](https://juejin.cn/user/606586150596360)

## 译者序

从 Flutter 诞生之日起，React Native 就一直被拿来与之作比较，从谷歌超过 700 万的相关搜索结果中可以一瞥这场跨端王位之争的激烈程度。本文不像我翻译的标题一样在捧一踩一，而是较客观地对两者进行评价并给出实际需求中如何抉择。

## 前言

你想更迅速地开发一款移动应用吗？你想通过跨平台技术减少开发成本吗？你还在为不知道选择哪一种技术焦虑吗？

本文正是解决你的焦虑的，我们比较了跨端方案的佼佼者：Flutter 和 React Native，并从 App 所有者的角度出发帮助你判断哪一款框架更适合你的 App 的需求。

## 为什么我们写这篇文章

跨平台解决方案越来越受欢迎。Flutter 和 React Native 是两个行业领先的参与者，但是在 [Droids On Roids](https://www.thedroidsonroids.com/about-us)，在为合作伙伴构建商业应用时，我们会根据具体需求来选择最合适的方案：可能是原生、Flutter 或者 React Native。

尽管如此，企业主总是希望知道几个关键问题的答案:

- 哪一个框架最适合我的项目？
- 哪一种方案可以让我的应用以最快的速度面市？
- 能保证我的 App 稳定且有很好地用户体验吗？
- 如果 [完美设计](https://www.thedroidsonroids.com/services/product-design-ux-and-ui-for-mobile-and-web-app) 是我的第一原则我该原则哪一种解决方案？

**我们写这篇文章是为了总结与合作伙伴分享的答案，以便你也可以从中受益。**

我们希望这篇文章能帮助你在为你的 App 选择跨端方案时做出明智且合理的决策。

### 作者介绍

深度对比这两种技术，需要对 Flutter 和 React Native 都有一定水平和经验的大佬才能胜任。

因此，我们要求两名 Droids On Roids 开发人员来执行此任务：

- Bartosz – Web 和 React Native 开发者
- Damian – iOS 和 Flutter 开发者 (**[Roadmap for Flutter Developers in 2021](https://github.com/DroidsOnRoids/flutter-roadmap)** 的作者—欢迎 PR)

这两位大佬日常工作便是使用 Flutter 和 React Native 来为客户构建商业 App。因此，他们的分享不仅包括理论，还包括多年的开发经验。

我们还针对社区中的热门文章验证了我们的理解，并参考了这些资源来解答问题。 你可以在本文的末尾找到完整的参考文献列表。

## Flutter vs React Native: 概览

|                      | Flutter                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | React Native                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 简介                 | Flutter 是一个由谷歌开发的开源移动应用软件开发工具包，用于为 Android、iOS、Windows、Mac、Linux、Google Fuchsia 开发应用。                                                                                                                                                                                                                                                                                                                                                                                                                                                       | React Native 基于 React.js，目的是让开发者可以利用 JavaScript 和 React.js 的声明式编程模式开发出在多平台上运作的程式                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 正式发布             | 2018 年 12 月，Google I/O 大会                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 2015 年 3 月，F8 大会                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 厂商                 | 谷歌                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 脸书                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 是否免费开源         | 是                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 是                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 编程语言             | Dart                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | JavaScript                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 人气                 | [Github](https://github.com/flutter/flutter) 11.5 万 Star (2021 年 3 月)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | [Github](https://github.com/facebook/react-native) 9.3 万 Star (2021 年 3 月)                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 热加载（Hot Reload） | 是                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 是                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 原生性能             | 优秀                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 优秀                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| UI                   | Flutter 应用程序在最新的操作系统上看起来与旧版本一样好。由于它们只有一个代码库，因此这些应用在 [iOS](https://www.thedroidsonroids.com/services/ios-mobile-app-development) 和 [Android](https：//www.thedroidsonroids) 上的外观和行为类似，但是由于 Material Design 和 Cupertino widgets 的帮助，他们还可以模仿平台本身的设计。这是怎么做到的呢？Flutter 包含两组符合特定设计语言的 Widgets：Material Design Widgets 实现了同名 Google 的设计语言；Cupertino widgets 模拟了苹果公司 iOS 的设计。这意味着你的 Flutter 应用在每个平台上的外观和行为都将自然地模仿它们的原生组件。 | 应用组件看起来和原生组件一样（比如，一个 Button 在 iOS 设备上看起来和 iOS 原生 Button 一样，Android 设备上也是如此）。React Native 在后台使用了原生组件这一事实印证了这一点，在任何操作系统 UI 更新之后，你的应用程序组件也将相应地立即升级。也就是说，这可能会破坏应用的用户界面，但这种情况很少发生。如果你希望你的应用在各个平台上看起来几乎相同，在较旧版本的操作系统下也相同（正如 Flutter 实现的那样），你需要使用第三方组件库（比如 [react-native-paper](https://reactnativepaper.com/)）。它们将使你能够使用 Material Design 组件代替原生组件。 |
| 一码多端             | 最近 Flutter 2 正式版发布了，作为 Flutter 的重大升级，使用 Flutter 2 开发者可以用相同的代码，把使用 Flutter 开发的应用发布到五个操作系统：`iOS`，`Android`，`Windows`，`macOS` 和 `Linux`； 以及运行到 `Chrome` 、 `Firefox`， `Safari` 或 `Edge`等浏览器的 Web 版本上，Flutter 甚至还可以嵌入到车机、电视和智能家电中。                                                                                                                                                                                                                                                        | iOS、Android — 但是有第三方库可以让你使用一套代码构建 iOS、Android、web 和 Windows10 应用。你还可以在移动端、桌面端和 Web 应用中提取共享代码到单独的存储库； 将其视为一个单独的项目； 然后以与另一个依赖项相同的方式注入它。这使开发人员可以专注于为特定平台编写代码，而不必考虑与另一个依赖项的兼容性。                                                                                                                                                                                                                                                |
| 知名案例             | 阿里巴巴的闲鱼、Hamilton Musical 的 Hamilton App、Google Ads App                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Instagram, Facebook, Facebook Ads, Skype, Tesla                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 开发周期             | 通常比原生开发要快得多。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 可能与 Flutter 的开发速度一样快。但是 React Native 使用桥接和原生组件，因此可能需要对每个平台进行单独的优化-基于 widget 的 Flutter 则没有这个问题。 它可能会使使用 React Native 进行 App 开发周期更长                                                                                                                                                                                                                                                                                                                                                   |
| 竞争优势             | 得益于丰富的 widgets 让 Flutter 开发的界面很漂亮；快速增长的社区和知名度；Flutter 团队的精心提供的出色文档（这使得使用 Flutter 进行开发变得容易）;改进 Flutter for Web，为一码多端的跨平台开发提供了潜力；难以缩短开发周期                                                                                                                                                                                                                                                                                                                                                      | 稳定性（已面市 5 年以上）；许多使用 React Native 的成功案例以及著名的市场参与者；成熟、庞大的社区；易于学习的技术；大量的教程和库，使你可以快速轻松地进行开发；可以轻松地在 Web 应用程序和桌面应用程序之间重用代码。                                                                                                                                                                                                                                                                                                                                    |
| 什么时候不是好的选择 | 如果你的应用程序需要支持 3D Touch（目前，Flutter 不支持 3D，但在 Flutter 团队的长期路线图中有此功能）应用程序的设计是特定于平台的；你的应用需要与操作系统进行多次交互或需要稀有的鲜为人知的原生库；你需要一个简约的 UI，但需要大量使用手机硬件（例如，播放音乐或仅拍照的应用程序）；你想要创建一个即时应用程序（小型应用程序），那么最好选择原生应用程序开发。有关这些情况的更多信息，请点击 [此处>>](https://www.thedroidsonroids.com/blog/flutter-in-mobile-app-development-pros-and-cons-for-app-owners#notgoodchoice)                                                       | 如果你的应用程序需要在后台处理不太常见的任务或超特定任务（例如计算）；你需要通过蓝牙进行自定义通信（使用 React Native 实施可能会很棘手）； 如果你想要同时开发 iOS 和 Android 应用并且掌握 JavaScript 那么你可以选择 React Native，但是如果你只想开发 Android 应用，则最好让原生团队去构建。如果符合以上的则更适合选择原生应用                                                                                                                                                                                                                           |

## 介绍 Flutter 和 React Native

首先，让我们介绍 Flutter 和 React Native 的基本（但必不可少的）细节。

### Flutter 是什么？

Flutter 是一个可移植的 UI 工具包。 换句话说，这是一个全面的应用软件开发套件（SDK），其中包含 widgets 和工具。

### Flutter 应用场景

**Flutter 为跨平台开发赋能。**

它为开发人员提供了一种简便的方法来为移动应用（iOS、Android）、[Web](https://flutter.cn/web) 和桌面端构建和部署具有视觉吸引力的原生编译的应用程序：一套代码运行在多端，即所谓的一次编写处处运行。

**请注意:**

- **在使用 Flutter 开发桌面应用程序时，API 仍处于开发阶段**。Google 正在努力扩展 Flutter，以支持桌面端作为目标环境，从而允许开发人员使用该技术创建 macOS，Windows 和 Linux 应用程序。

  > Flutter 2 已经全平台 SDK 稳定，详情查看 [Flutter 2.0 发布 | 针对 Web，移动端和桌面端构建的下一代 Flutter](https://juejin.cn/post/6935520179262586917)

- Flutter for Web 是 Flutter 的代码兼容实现，允许您将用 Dart 编写的现有 Flutter 代码编译为可嵌入到浏览器中并部署到任何 Web 服务器的客户端。 您可以使用 Flutter 的所有功能，并且不需要浏览器插件

关于 Flutter 的更多信息：

- 免费且开源
- 它基于 [Dart](https://dart.cn/)——一种快速的，面向对象的编程语言。
  Dart 相对较新，并且易于学习-特别是对于经验丰富的熟悉 Java 和 C# 的开发人员
- 该架构基于非常流行的反应式编程（它遵循与 React 相同的风格）
- 它提供了自己的控件，这些控件是从自己的高性能渲染引擎中提取的，这些控件快速，有吸引力且可自定义
- 多亏了控件的使用经验，Flutter 应用程序的外观和感觉都很棒（尽管你仍然可以创建自己的 [自定义应用程序设计](https://www.thedroidsonroids.com/services/product-design-ux-and-ui-for-mobile-and-web-app)，使用遵循特定平台准则的易于使用的 UI 组件）

### 谁创建了 Flutter 项目

一个来自 **Google** 的团队创建了 Flutter 项目。

但是作为一个开源项目，Google 和 Flutter 社区都在为 Flutter 的开发贡献力量。

### Flutter 有多成熟？

Flutter 简明历史：

- **2018 年 2 月，世界移动通信大会 – Flutter 发布了第一个 beta 版本**
- 2018 年 4 月，Google I/O 大会 – Flutter beta 2 发布
- 2018 年 5 月，Google I/O – Flutter beta 3 发布
  - Flutter 进入 **GitHub Top 100**
- 2018 年 6 月 – Flutter Preview 1 发布
- 2018 年 9 月 – Flutter Preview 2 发布
- 2018 年 11 月 - Dart 2.1 发布
- 2018 年 12 月，Google I/O – Flutter 1.0 发布
  - 自 2018 年 12 月以来，Flutter 被认为是稳定且可投入生产的技术里程碑
- 2019 年 2 月，移动世界大会– Flutter 1.2 发布
- 2019 年 5 月，世界移动通信大会
  - Flutter 1.5 发布
  - [Flutter for Web](https://flutter.dev/web) 预览版发布
  - Dart 2.3 发布
- 2019 年 7 月, [Flutter 1.7 发布](https://medium.com/flutter/announcing-flutter-1-7-9cab4f34eacf)
- 2019 年九月, [Flutter 1.9 发布](https://medium.com/flutterpub/whats-new-in-flutter-1-9-26b3c518dd0)

如你所见，Google 以快速的步伐从 Flutter beta 版本过渡到 Flutter 1.0 稳定版。

更妙的是，自 Flutter 1.0 发布以来，Flutter 团队并没有因此而感到骄傲。他们积极致力于使工具包更强大，更灵活，并优先考虑增强稳定性、性能和质量。

此外，Flutter 1.5 包含数百项响应开发人员反馈的更改。

Flutter 现在是 GitHub 上排名前 20 位的活跃仓库之一（截至 2019 年 12 月 11 日排名第 16 位），这证明了开发人员社区正在使用它，并继续为其改进做出贡献。

总而言之，Flutter 仍然是一个新兴的技术。

但是，考虑到 Flutter 不断改进的步伐以及它的爆炸性普及，我们可以充满信心地说，它随着年龄的增长已经非常稳定和成熟。Fluter 2.0 发布之后更是如此。

从发展速度来看，我们预计 Flutter for Web 也将在 12 个月内稳定下来。（截止发稿已经稳定了）

### 哪些流行的应用在使用 Flutter？

- 阿里巴巴的闲鱼 App – 阿里巴巴是全球最大的电子商务公司之一
- Hamilton App – 百老汇音乐剧的官方应用程序
- Google Ads app
- Reflectly
- 京东金融 App – 奶茶妹妹老公的公司
- Topline app by Abbey Road Studios

### React Native 是什么?

React Native 是使用 JavaScript 的开源移动应用程序框架。

### React Native 应用场景?

React Native 适用于以下场景：

- **跨平台开发**
- 使用 JavaScript 开发移动应用
- 一套代码开发 Android 和 iOS 应用
- 使用和 React 相同的设计

**请注意：**

- 使用 React Native **创建的应用程序不是移动 Web 应用程序**。 React Native 使用与常规 iOS 和 Android 应用相同的基本 UI 构建块：这意味着，你不需要使用 Java、Kotlin 或者 Swift 构建应用，而是使用 JavaScript 和 React 将相同的代码放在一起。
- React Native 使用类似于 Flutter 中的控件的组件进行开发。

要使用 React Native 开发**Web 和桌面应用程序**，最好使用外部库。

### 谁创建了 React Native 项目?

**Facebook** 创建了 React Native

### React Native 成熟度?

React Native 简明历史:

- 2013 年夏季，Facebook 黑客马拉松 – React Native 作为 Facebook 内部项目开始
- 2015 年 1 月，React.js 会议– React Native 1 发布
- 2015 年 3 月，F8 大会 – React Native 正式启动
  - Facebook 宣布 React Native 为 “开放使用并在 Github 上可用”

综上所述，可以肯定有两件事：React Native 比 Flutte r 年长，并且拥有更大的社区。 更不用说 Facebook 团队有足够的时间稳定 API 并专注于解决所有潜在问题：

- [Lean Core ](https://github.com/react-native-community/discussions-and-proposals/issues/6)– 通过将可选组件/功能移动到单独的存储库中来减小应用程序的大小（以在需要时添加到应用程序中）
- [TurboModules](https://github.com/react-native-community/discussions-and-proposals/issues/40) – 用于改进原生模块的处理
- [React Native Fabric](https://github.com/react-native-community/discussions-and-proposals/issues/4) – 重构 UI 层

### 哪些流行的应用在使用 React Native?

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe8a0e49580c488e96dedfa7b6cf484c~tplv-k3u1fbpfcp-zoom-1.image)

如果你想查看其他使用 React Native 制作的应用示例，请查看 [official React Native showcase](https://facebook.github.io/react-native/showcase.html).

## Flutter – 优势和劣势

在本节中，我们简要讨论 Flutter 的主要优缺点。

如果您想了解更多信息，请查看 [这篇文章](https://www.thedroidsonroids.com/blog/flutter-in-mobile-app-development-pros-and-cons-for-app-owners) Flutter 对应用程序所有者的利弊。

### ✅ Flutter 的优势

#### 1. 热重载 = 快速开发

从开发人员的角度来看，Flutter 提供了更多动态的，更快的应用程序开发。 这是 Flutter 最为人称道的事情之一，每一家顶级移动应用开发公司都对此表示赞赏

开发人员可以即时更改代码库，并立即将其反映在应用程序中。 这就是所谓的 [热重载](https://flutter.cn/docs/development/tools/hot-reload) 功能，响应更改通常是秒级甚至毫秒级。

该功能可帮助团队立即添加功能，修复错误并尝试新的想法。 另外，在开发人员与设计人员的协作中，**热加载非常方便**。

#### 2. 一次编写, 多处运行

使用 Flutter，开发人员仅可以为两个应用程序编写一个代码库——覆盖 iOS 和 Android 平台。

Flutter 具有平台无关性，因为它具有自己的 widgets 和设计，这意味着你可以在两个平台上拥有完全相同的应用程序（如果你希望区分自己的应用程序，这同样容易实现）。

Google 目前正在开发 Flutter for Web，您可以将其作为预览版进行查看。 一旦上线，单个代码库将覆盖 Android，iOS 和 Web 平台。

#### 3. 最多减少 50％ 的测试

假设你在两个平台上都有相同的应用程序，则质量保证流程会更快更少的测试。

我们编写的自动化测试大约减少 50％，因为我们可以创建相同的测试以在两个平台上运行，从而减少了对 QA 团队的需求。

也就是说，你仍然必须在与原生编程类似的级别上运行手动测试，因为你的质量检查专家必须手动检查每个平台上的两个应用程序。

#### 4. 更快的应用

**Flutter 应用程序运行流畅，快速滚动时不会卡顿。** 为什么？

Flutter 使用 [Skia 图形库](https://skia.org/)。 因此，每次视图更改时，UI 都会重新绘制。

大部分工作在 GPU 上完成； 这就是 Flutter UI 流畅且可提供 60fps（每秒帧数）的原因。

但是在开发过程中必须小心，以免重绘视图中数据未更改的那些元素。

重绘整个视图而不是仅重绘那些已更改的元素会影响应用程序的性能和速度，尤其是在需要经常重载视图的情况下，例如在秒表应用程序中。

#### 5. 用户会喜欢的设计

Flutter 不依赖原生系统组件。 相反，Flutter 拥有自己的一组自定义 widgets，这些 widgets 由框架的图形引擎呈现和管理。 用户将看到与典型的原生应用程序不同的 UI 组件，但这不一定是不利的。

Flutter 应用程序具有特别友好的用户界面：Flutter 与 React Native 相比具有至关重要的优势，源于对视觉细节的超级专注。 Flutter 的创建是为了使你可以轻松创建自己的窗口 widgets，或简单地自定义现有窗口 widgets。

随意浏览 [核心 Widget 目录](https://flutter.cn/widgets/); 或者，单击链接以查看 [Material Design widgets](https://flutter.cn/docs/development/ui/widgets/material) 和 [Cupertino widgets](https://flutter.cn/docs/development/ui/widgets/cupertino) 的示例。

#### 6. 一样的 UI, 甚至在旧机型上

甚至新的应用在旧的 iOS 或 Android 系统上看起来也一样，因此你不必担心支持旧的设备。

|                          Android 5.1.1                          |                                                    Android 8.1.0                                                     |
| :-------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: |
| ![紫升](https://media.giphy.com/media/8mdR9KZHBVue6J8ItN/giphy.gif) | ![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53ae3b6533ea4548bd447cbb59feaa72~tplv-k3u1fbpfcp-zoom-1.image) |

#### 7. 完美适用于 MVP

如果你需要为应用程序构建 MVP（Minimum Viable Product，最小可行产品）（例如，作为潜在投资者的展示），则 Flutter 是理想的选择，尤其是在时间短的情况下。 另请阅读：

- [How to Build a Minimum Viable Product – MVP Guide for App Owners](https://www.thedroidsonroids.com/blog/how-to-build-minimum-viable-product-mvp-business-plan)
- [App development cost in 2021](https://www.thedroidsonroids.com/blog/mobile-app-development-cost-in-2021)

查看 [Flutter Gallery 应用程序](https://play.google.com/store/apps/details?id=io.flutter.demo.gallery)，其中包含 Flutter 的核心功能，小部件和小插图的演示。

|                     Flutter Galary                     |                                                    Flutter Galary                                                    |                     Flutter Galary                     |
| :----------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------: |
| ![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7dc504630daa48f99d68f68a33d40ea0~tplv-k3u1fbpfcp-zoom-1.image) | ![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c80f1894916144fdb8a3cdbd15131ed9~tplv-k3u1fbpfcp-zoom-1.image) | ![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b2171b61cee4213bed667635194a633~tplv-k3u1fbpfcp-zoom-1.image) |

### 🔻 Flutter 的劣势

#### 1. 开发者社区的规模

大多数人会告诉你：React Native 相对 Flutter 的一个关键优势是其更加成熟，经验更丰富的开发者社区。
此外，就编程语言而言，至少在目前，Dart 还没有像 JavaScript 那样得到广泛使用。

实际上，要想以 “哥哥” 相称，Flutter 有很多工作要做，这是可以理解的。
社区需要时间来教育其受众并获得更多的经验，这对于任何新的年轻的工具都是必经之路。

但是，我们并不认为这是一个明显的劣势。
同样值得注意的是，Flutter 社区正在成倍增长。

另外，开发套件包也是令人兴奋的。

**请注意：**

- [Stack Overflow Trends](https://insights.stackoverflow.com/trends?tags=flutter) 标签趋势表明开发人员对 Flutter 的兴趣大大增加

- 在 Udemy 上，有 50 多门 [Flutter 课程](https://www.udemy.com/topic/google-flutter/)（约 213,000 个课程的参与者）

  还有 35 项 [Dart 课程](https://www.udemy.com/topic/dart-programming-language/)（约有 187,500 门课程的参与者（2019 年 6 月 25 日））

  [React Native](https://www.udemy.com/topic/react-native/) 的数字大致相同——共有 597,000 门课程的 287,000 名学生

- Flutter 有 11.5 万 Github stars；React Native 有 9.3 万

**综上所述，Flutter 目前确实有一个较小的，经验不足的社区，而 Dart 比 JavaScript 更具优势。**

**尽管如此，目前的趋势表明，Flutter 将在这方面赶上竞争对手。**

#### 2. 库和支持 - 令人印象深刻，但仍然没有像原生开发一样丰富

Google 对 Flutter 的支持令人印象深刻，但 Flutter 还是一个相当新的事物。
这意味着你无法始终在现有库中找到所需的功能，因此开发人员可能需要自己构建自定义功能，这需要时间。

#### 3. 持续集成支持

在撰写本文时，Flutter 缺少对 Travis 或 Jenkins 等 CI 平台的支持。
因此，要实现自动构建，测试和部署，你的开发人员需要使用和维护自定义脚本，
例如 [这个](https://github.com/yjbanov/flutter_travis_sample/blob/master/.travis.yml)。

值得注意的是：

- Flutter Live 2018 宣布了适用于 Flutter 应用程序的新 CI/CD 系统——[Codemagic](https://codemagic.io/start/)
- 2019 年 1 月，[Bitrise 发布了功能齐全的 Flutter CI](https://blog.bitrise.io/flutter-ci-on-bitrise-v1)

#### 4. 平台风险

即使 Flutter 是开源的，但如果 Google 决定取消对该项目的支持，那将是一场灾难。

也就是说，自 Google 团队发布 Flutter 的 Beta 版以来，它一直在加大对 Flutter 的支持，
正如 Flutter 在 19 届 Google IO 期间的杰出作用以及最近的 Flutter Live 活动所表明的那样。

很难想像没有 Google 的 Flutter 会走向何方。

#### 5. 应用大小

用 Flutter 编写的应用程序比原生应用程序大。
请查看文章 [比较 APK 大小](https://android.jlelse.eu/comparing-apk-sizes-a0eb37bb36f)。
但是，Flutter 团队正在研究 [减小应用程序的大小](https://github.com/flutter/flutter/issues/16833#issuecomment-410103493)。

## React Native – 优势和劣势

### ✅ React Native 优势

#### 1. 热刷新 = 快速开发

本质上与 Flutter 具有相同的功能。

热重载允许开发人员将新代码直接注入正在运行的应用程序中，从而加快了开发过程。
因此，开发人员可以立即看到更改，而无需重建应用程序。

热重装还保留了应用程序的状态，避免了在完全重装期间丢失它的风险（在基于状态的框架中是一项重要优势）—— 加快了移动应用程序的开发过程。

为了改善热重载的开发人员体验，React Native 团队在 0.61 版本中包括一项称为快速刷新的新功能，
该功能将实时重载和热重载相结合。
与以前的版本相比，它对错别字和错误的处理更具弹性。
您可以在 [此处](https://facebook.github.io/react-native/blog/2019/09/18/version-0.61#fast-refresh) 阅读更多有关快速刷新的信息。

#### 2. 一处编写, 处处运行

- 与 Flutter 完全相同：编写单个代码库为 2 个应用程序提供动力 —— 涵盖 Android 和 iOS 平台。

  更好的是，JavaScript 通过与 [Web 应用程序](https://www.thedroidsonroids.com/services/web-app-development)
  共享代码来编写跨平台应用程序时，你也可以一臂之力。这是通过创建可编译为目标平台的抽象组件来完成的。

参见下面的示例库，这些库可让你在 iOS 和 Android 以外的平台（包括 Web 和桌面应用程序）上同时创建代码：

- [React Native for Web](https://github.com/necolas/react-native-web) – 支持 Android，iOS 和 Web（Twitter 使用它来创建 Twitter Lite）
- [ReactXp](https://github.com/microsoft/reactxp) – 由 Skype 团队开发，以支持 Android，iOS 和 Web；另外，可在 Windows 10（UWP）上使用
- [react-native-windows](https://github.com/microsoft/react-native-windows) – 由 Microsoft 团队开发，支持 Windows 10 支持的所有设备（PC，平板电脑，2 合 1 电脑），Xbox，混合现实设备等）

**顺便一提**

Bartosz（我们的 React Native 开发人员）对事物的看法与大多数事物有所不同，因此更喜欢使用替代方法。

如果将 Web 桌面应用程序，移动 Web 应用程序和原生应用程序进行比较，则可以假定它们共享相同的业务逻辑，但它们可能需要满足不同用户需求的特定 UI。

所以，为什么不呢？

1. 将共享代码提取到单独的存储库中；
2. 将其视为一个单独的项目；
3. 是否以与其他依赖项相同的方式注入代码？

通过这种方式，开发人员可以专注于将应用程序编写到实际平台上，而不必考虑跨平台兼容性。

观看 [Ben Ellerby 的演示文稿](https://www.youtube.com/watch?v=IA_M2ESWoXw) 了解该方法，如果你喜欢在平台上创建抽象的想法，请查看 [Radek Pietruszewski 的演示文稿](https://www.youtube.com/watch?v=ryMvNklnDjU)。

#### 3. 它使用广泛流行的语言 —— JavaScript

React Native 使用 JavaScript：许多开发人员都熟悉的一种编程语言（而 Dart 仍然不那么广为人知或使用）。而且，如果你是喜欢静态类型的编程语言的开发人员，则甚至可以使用 [TypeScript](https://www.typescriptlang.org/) —— 一个 JavaScript 超集。

#### 4. 开发人员的选择自由

React Native 使开发人员可以构建跨平台应用程序。不做更多事情。

优点是 React Native 允许开发人员精确地决定他们要使用什么解决方案； 两者都是根据项目的要求以及开发人员的偏好进行的。

假设，如果开发人员需要决定如何处理全局状态（如何存储和管理应用程序中许多组件中使用的数据），请选择路由器库，或者在 JavaScript 和 TypeScript 之间进行选择——他们可以决定是否使用自定义 UI 库，或者自己编写。

#### 5. 相对成熟度

官方的 React Native 版本是 5 年前发布的，因此 Facebook 团队有足够的时间来稳定 API，以及专注于解决问题和解决问题。

现在，他们正在努力进行一些令人兴奋的改进——例如减小应用程序的大小。

#### 6. 一个活跃而广阔的社区

React Native 有一个庞大的开发者社区。不仅如此，还有 **无数的教程，库和 UI 框架**，它们使学习该技术变得容易，并且可以快速，轻松地进行开发。

而且，如果你比较专注于收集有关特定技术的文章，工具和材料的存储库，则 React Native 的位置要比 Xamarin，Flutter 或 Ionic 更好（来源：[Awesome-Flutter](https://github.com/Solido/awesome-flutter)，[Awesome-ReactNative](https://github.com/jondot/awesome-react-native)，[Awesome-Ionic](https://github.com/Alexintosh/Awesome-Ionic)，[Awesome-Xamarin](https://github.com/XamSome/awesome-xamarin)。

而且，React Native 是 **“ React 家族” ** 的一部分。

- 还值得引起你注意还有 [Expo](https://expo.io/) —— 一种简化了对原生 API 的访问的 React 构造框架，该框架具有针对典型移动功能（例如，推送通知）的现成解决方案。
- 值得一提的第二个库是 [AWS Amplify](https://aws-amplify.github.io/)：该解决方案通过涵盖身份验证，存储，推送通知和分析来简化与 AWS 功能的集成。

#### 7. 易于学习

我们列表中的这一优势是针对 React 开发人员的。
**如果您具有 Web 开发背景并且已经使用了流行的 React 解决方案，则可以轻松使用 React Native** ，
而无需学习新的库。 您可以使用相同的库，工具和模式。

#### 8. 最多减少 50％ 的测试

设你在两个平台上都有相同的应用程序，则质量保证流程会更快更少的测试。

我们编写的自动化测试大约减少 50％，因为我们可以创建相同的测试以在两个平台上运行，从而减少了对 QA 团队的需求。

也就是说，你仍然必须在与原生编程类似的级别上运行手动测试，因为你的质量检查专家必须手动检查每个平台上的两个应用程序。

### 🔻 React Native 劣势

##### 1. 只是接近原生而已

和其他跨平台解决方案一样，不管是性能还是用户体验都只是接近原生而已。

但是，与 Flutter 相比，使用 React Native 更容易获得自然的感觉。 如果你希望 Flutter 应用程序具有原生组件，则需要进行其他工作。

#### 2. 开箱即用的组件少

**React Native 开箱只支持基础组件** (许多都是针对特定平台开箱即用，例如按钮，加载指示器或滑块).

外部存储库包含许多其他 React Native 组件。 开发人员可以在项目中使用它们，但这需要额外的精力和时间。

另一方面，Flutter 旨在支持开箱即用的 Material Design，因此该框架支持更多的 widget 来节省开发者时间。
使用 Flutter 的开发人员可以使用易于定制且跨平台一致的预制窗口 widget 来创建大多数视图。

#### 3. 开发人员的选择自由

既是诅咒又是祝福。

开发人员创建新项目后，他们需要确定要使用哪个导航包以及哪个全局状态管理。

了解每个解决方案的细微差别，最终决定要用于项目的最佳解决方案，可能需要花费大量时间。

#### 4. 很多被遗弃的包

React Native 拥有大量的库。不幸的是，它们太多要么质量低下，要么完全被遗弃。

Dan Abramov 建议检查存储库中的问题数量和提交频率，以防止使用废弃的程序包。

更多信息请查看 [summary of his discussion of “What do you dislike about React Native?”](https://github.com/react-native-community/discussions-and-proposals/issues/104)

#### 5. 脆弱的用户界面

React Native 在后台使用原生组件这一事实应该使你充满信心，**每次 OS UI 更新后，你的应用程序组件也将立即升级**。

也就是说 **这可能会破坏应用的用户界面，但这种情况很少发生。**

更糟糕的是，如果更新会导致 Native Components API 发生某些更改，则更新会变得更加危险。 好消息是这种事件很少发生。

而就 Flutter 而言（由于框架自行重新创建原生组件的方式），应用程序 UI 更加稳定。

#### 6. 应用尺寸大于原生

用 React Native 编写的应用程序必须能够运行 Javascript 代码（JavaScript 虚拟机）。
Android 默认情况下不具有此功能，这意味着应用程序需要包含一个支持 JavaScript 代码的库，从而导致应用程序比其原生 Android 同类产品更大。

使用 React Native 制作的 [iOS 应用](https://www.thedroidsonroids.com/services/ios-mobile-app-development) 并没有这个问题，但是它们通常比原生的更大。 好消息是正如我们之前提到的，React Native 团队正在 [减小应用程序的大小](https://github.com/react-native-community/discussions-and-proposals/issues/6)。

阅读有关 [2021 年为应用程序所有者进行 React Native 开发的利弊](https://www.thedroidsonroids.com/blog/react-native-pros-and-cons)
的更多信息。

## 预测未来：Flutter＆React Native

**越来越多的公司被 Flutter 所吸引。** 毕竟，随着 Google 不断完善其工具，我们正在见证 Flutter SDK 的每月改进。 **另外，社区始终是乐于助人和热情的**。 而且，我们可以期待 Flutter 很快将使我们不仅可以创建移动应用程序，还可以创建用于 Web 和桌面的应用程序。

鉴于像阿里巴巴这样的领先公司已经在使用 Flutter，它的未来看起来很有希望。

至于 **React Native**，不错，Facebook 当前正在致力于 **该技术的大规模重新架构**。

团队正在尽最大努力改善对 React Native 用户和更广泛社区的支持。
有了这个，社区现在可以通过使用 [专用 GitHub 存储库](https://github.com/react-native-community/discussions-and-proposals/issues/) 关注进度。

此类体系结构改进的实际结果是：

- [Hermes](https://engineering.fb.com/android/hermes/) ：针对移动应用程序优化的开源 JavaScript 引擎，可缩短交互时间，并降低应用程序大小和内存利用率

- 0.60 版本中的重大更改（https://facebook.github.io/react-native/blog/2019/07/03/version-60） - 默认情况下，使用最受欢迎的依赖项管理器 CocoaPods 可以更轻松地管理 iOS 依赖项， - 你可以将 React Native 迁移到 AndroidX， - 你可以在精益核心流程中提取可选功能。

**创建一个开放的环境来讨论 React Native 是重要的一步。** 这既是不断改进的标志，又是该技术光明前景的信号。

由于 React Native 在市场上具有如此稳定的地位并处于持续发展的轨道上，我们不太可能很快看到该工具包被遗弃。 阅读有关 React Native 的 [长期愿景](https://facebook.github.io/react-native/blog/2018/11/01/oss-roadmap)。

尽管如此，Flutter 还是 React Native 的强大竞争对手。

另请阅读：[外包软件开发 - 应用程序所有者的收益和风险](https://www.thedroidsonroids.com/blog/benefits-outsourcing-software-development)
