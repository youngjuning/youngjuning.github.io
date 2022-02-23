---
title: 初探 Nest.js
date: 2020-03-02 04:05:36
categories:
  - [Node.js]
tags:
  - Nest.js
  - server
---

![](https://i.loli.net/2020/03/02/GwX6NzRqa85bLhT.png)

<!--more-->

## Nest.js 是什么？

​	Nest 是一个用于构建高效，可扩展的 [Node.js](http://nodejs.cn/) 服务器端应用程序的框架。它使用渐进式 JavaScript，内置并完全支持 [TypeScript](https://www.tslang.cn/)（但仍然允许开发人员使用纯 JavaScript 编写代码）并结合了 `OOP`（面向对象编程），`FP`（函数式编程）和` FRP`（函数式响应编程）的元素。

​	在底层，Nest使用强大的 HTTP Server 框架，如 Express（默认）和 Fastify。Nest 在这些框架之上提供了一定程度的抽象，同时也将其 API 直接暴露给开发人员。这样可以轻松使用每个平台的无数第三方模块。

## Nest.js 解决了什么问题？

​	近年来，感谢 Node.js，JavaScript 已成为前端和后端应用程序的网络“通用语言”。这产生了令人敬畏的项目，如 [Angular](https://angular.cn/)，React 和 Vue，它们提高了开发人员的工作效率，并能够构建快速，可测试和可扩展的前端应用程序。然而，虽然 Node（和服务器端 JavaScript ）存在大量优秀的库，帮助器和工具，但它们都没有有效地解决主要问题 - 架构。

​	Nest 提供了一个开箱即用的应用程序架构，允许开发人员和团队创建高度可测试，可扩展，松散耦合且易于维护的应用程序。

## 流行趋势

### npm下载量

<img src="https://i.loli.net/2020/03/02/yFtbpaICvz9mlEJ.png" style="zoom:60%;" />

### star趋势

<img src="https://i.loli.net/2020/03/02/eC8Nitx2Y4QcKwL.png" style="zoom:60%;" />

## 建立新项目

```shell
$ npm i -g @nestjs/cli
$ nest new MyNest
```

<img src="https://i.loli.net/2020/03/02/vyuW5OdrCiSHNPe.png" style="zoom: 67%;" />

## 核心文件

将创建 `project` 目录， 安装node模块和一些其他样板文件，并将创建一个 `src` 目录，目录中包含几个核心文件。

```
src
├── app.controller.ts // 带有单个路由的基本控制器示例。
├── app.module.ts // 应用程序的根模块。
└── main.ts // 应用程序入口文件。它使用 NestFactory 用来创建 Nest 应用实例。
```

`main.ts` 包含一个异步函数，它负责**引导**我们的应用程序：

```js
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  await app.listen(3000);
}
bootstrap();
```

要创建一个 Nest 应用程序，我们使用了 `NestFactory` 核心类。`NestFactory` 暴露了一些静态方法用于创建应用实例。`create()` 方法返回一个实现 `INestApplication` 接口的对象，并提供一组可用的方法。在上面的 `main.ts` 示例中，我们只是启动了 HTTP 服务器，它允许应用程序等待入站 HTTP 请求。

## 运行应用程序

安装过程完成后，您可以在系统命令提示符下运行以下命令，以启动应用程序监听入站 HTTP 请求：

```shell
$ npm run start
```

此命令在 `src` 目录中的 `main.ts` 文件中定义的端口上启动 HTTP 服务器。在应用程序运行时, 打开浏览器并访问 `http://localhost:3000/`。 你应该看到 `Hello world!` 信息。
