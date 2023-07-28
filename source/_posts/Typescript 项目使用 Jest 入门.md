---
title: Typescript 项目使用 Jest 入门
date: 2023-07-28 20:00:00
categories:
  - [前端, 单元测试]
tags:
  - typescript
  - nodejs
  - jest
description: ' 本文介绍了如何在 Typescript 项目中初始化 Jest 并正确配置'
cover: https://s2.loli.net/2023/07/28/yn6xFzcPVOZjIDh.png
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

## 安装 jest

```sh
$ yarn add jest -D
```

然后，将下列配置内容添加到您的 `package.json`：

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

## 安装 ts-jest

ts-jest 是一个支持 sourcemap 的 TypeScript 预处理器，让你使用 TypeScript 编写 Jest 测试项目

```sh
$ yarn add --dev ts-jest
```

## 创建配置文件

执行 `jest --init` 回答几个简单的问题之后会生成一个 `jest.config.ts` 文件，然后在这个文件中添加 `preset: 'ts-jest'` 配置。

## 安装 ts-node

如果配置文件是 `jest.config.ts`，那就需要安装 ts-node 支持它：

```sh
$ yarn add ts-node -D
```

## 安装 @types/jest

如果使用 typescript 写测试用例，那就需要安装 @types/jest：

```sh
$ yarn add @types/jest -D
```

## 踩坑

### Error: Jest: 'ts-node' is required for the TypeScript configuration files. Make sure it is installed

在全局执行 `jest`，会报错，意思是解析 typescript 配置文件需要安装 ts-node，

```sh
# 全局
$ npm install ts-node -g
```