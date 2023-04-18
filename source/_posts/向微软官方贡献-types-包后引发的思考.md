---
title: 向微软官方贡献 @types 包后引发的思考
description: 在前端社区中，TypeScript 差不多是老生常谈的主题了。这不仅反映了 TypeScript 的流行度，也反映了它的学习上手成本。今天我们不来探讨 TypeScript 本身。而是记录一下我艰难地发布一个 @types包的历程。
date: 2023-03-26 23:17:29
categories:
  - [前端, TypeScript]
tags:
  - TypeScript
  - types
  - DefinitelyTyped
  - dts-gen
  - dtslint
  - tuya-panel-kit
  - 微软
---

<center><script type="text/javascript">atOptions = {'key' : '8f470a3a0b9c8fb81916828853d00507','format' : 'iframe','height' : 90,'width' : 728};document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://harassinganticipation.com/8f470a3a0b9c8fb81916828853d00507/invoke.js"></scr' + 'ipt>');</script></center>

在前端社区中，TypeScript 差不多是老生常谈的主题了。这不仅反映了 TypeScript 的流行度，也反映了它的学习上手成本。今天我们不来探讨 TypeScript 本身。而是记录一下我艰难地发布一个 [@types](https://www.npmjs.com/package/@types/tuya-panel-kit) 包的历程。

## a year ago

<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4aeb4e02f1640069b7e763ea0b5be40~tplv-k3u1fbpfcp-watermark.image" height="400px"/>

上图是我在掘金的第一篇文章 [优雅地使用 TypeScript 开发 React Native 应用](https://juejin.cn/post/6844903843155689486) 中的一条素质问答。问题就是有些库不是 TS 写的，也没提供类型声明该怎么办。从图中可见我当时的解决方法都是不可复用且不利他的。但这就是我这一年来处理该问题的常规手段。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04f411da146740aab8f620337a592850~tplv-k3u1fbpfcp-watermark.image)

## DefinitelyTyped

像是 Node 有 NPM，Java 有 Maven，TypeScript 也有它的另一半，那就是号称 GitHub review 数量之最的 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) 项目。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d503ee17f0ab45068a0d50a4d6f6034a~tplv-k3u1fbpfcp-watermark.image)

在 TypeScript 大规模应用之前，社区已经有超过 90% 的顶级 JavaScript 库，或基于 Flow 编写的库（React系）。如果没有 DefinitelyTyped 项目，这些库想要提供类型支持，无疑只有完全重构代码。这既不现实也没必要。

> 鉴于 DefinitelyTyped 的作用，我们说 DefinitelyTyped 让 TypeScript 再次伟大也不为过。

DefinitelyTyped 目前是由微软官方维护的开源项目，参与的方式和 Homebrew 差不多，都是基于 GitHub 的工作流:

1. fork [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) 到自己的账号下
2. 添加自己的包并编写类型声明
3. 提交 PR
4. 官方 review 并合并发布到 NPM

## 艰辛的贡献历程

1、检查是否已存在同名的包：

```sh
npm info @types/tuya-panel-kit
```

2、安装 dts-gen：

```sh
npm install -g dts-gen
```

3、生成新包

```sh
dts-gen --dt --name tuya-panel-kit --template module
```

4、格式化代码

```sh
npm run prettier -- --write types/tuya-panel-kit/**/*.ts
```

这一步务必要执行，因为 DefinitelyTyped 十分严格，格式不对过不了 CI。过不了 CI，就只配和机器人对话：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/140adf442a17460aa845aef8e4b8ac18~tplv-k3u1fbpfcp-watermark.image)

5、dtslint

```sh
yarn lint tuya-panel-kit
```

这一步是最让人头大的一步，Definitely 的规则可谓严苛，真就对的起它的 SLOGAN：

> The repository for high quality TypeScript type definitions

我梳理了一下成功路上的绊脚石：

1、 [Cannot find module 'csstype' when npm run lint package-name](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/24788)

这是一个流程 BUG，如果你的包依赖了 react，你需要执行 `cd types/react && npm install` 和 `cd ~/.dts/typescript-installs/3.2/ && npm install`

2、如果你的包依赖了别的外部库，需要添加到 [microsoft/DefinitelyTyped-tools](https://github.com/microsoft/DefinitelyTyped-tools/pull/165/files) 项目中，否则 CI 不给过。

3、你的类型声明可能有很多不符合 dtslint 的标准，我看到有的包是在 `tslint.json` 中配置禁用掉部分规则，但是我做了尝试后被人工拒绝了。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fafa598fac2e4015ab496cc15fd94496~tplv-k3u1fbpfcp-watermark.image)

然后我尝试在顶部加入 `// tslint:disable:max-line-length` 禁用规则，在说明原因后通过了 Review。就在发稿时，最新 PR 却因为一个禁用规则，被要求修改：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21a0b43a6f464c47a1b94a5fc7ed619f~tplv-k3u1fbpfcp-watermark.image)

## 规范的重要性

刚开始时，这种严苛漫长的 review 流程着实让我头大。但在提过 4 个 PR 都被合并后，我发现 review 的人关心的是你为什么要这么写，是不是有什么不得已的苦衷，是否符合高质量的要求。

在参与 DefinitelyTyped 的协作中，我越来越发现规范的重要。如此体量的项目，如果没有严格有效的规范约束，势必会被开发者抛弃。那我们来看看 DefinitelyTyped 中是如何约束的：

1. [dtslint](https://github.com/microsoft/dtslint) ：微软专门写的用来检验类型声明文件的工具。正是因为它，我做了大量优化工作。
2. 机器人🤖（dt-mergebot、dt-review-bot、typescript-bot-watchdog）：在你的代码通过所有规范之前，都是这些机器人在和你交互。大家感兴趣的话，之后我会单独出一篇解析的文章
3. 尽职尽责的维护：虽然有时 review 速度明显很慢（可能因为国外疫情）。但是这些维护者真的是尽职尽责的 review 你的代码。机器再厉害也只是一个减少工作量的工具。我们应该致敬的还是这些为社区默默奉献的人。
