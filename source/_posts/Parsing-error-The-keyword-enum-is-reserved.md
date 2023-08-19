---
title: "「已解决」Parsing error: The keyword 'enum' is reserved"
date: 2023-03-14 12:10:32
description: "本文介绍了如何解决 Eslint 警告 Parsing error: The keyword 'enum' is reserved"
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678767745973.png
categories:
  - [前端, TypeScript]
  - [前端, EsLint]
tags:
  - TypeScript
  - React
  - Eslint
  - airbnb
  - enum
---

## 问题

我正在使用 TypeScript 和 React 进行开发。这个项目是通过 CRA 生成的，并且我在 `.eslintrc.json` 中使用了 react-app 的配置。然而，我决定使用 `eslint-config-airbnb`，因此我添加了它并更改了我的 `.eslintrc.json` 文件。

```json
{
  "extends": [
    "airbnb",
  ]
}
```

但是，我当我定义一个 `enum` 时，Eslint 抛出了 `Parsing error: The keyword enum is reserved` 的错误。

```ts
`Parsing error: The keyword 'enum' is reserved eslint`
```

## 解决方案

当你使用 `eslint-config-airbnb` 时，你需要安装 `@typescript-eslint/parser` 和 `@typescript-eslint/eslint-plugin`。

```sh
yarn add @typescript-eslint/parser -D
```

然后，你需要在 `.eslintrc.json` 中添加以下内容：

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ]
}
```

此外你可能还需要安装 `eslint-plugin-import`、`eslint-plugin-react`、`eslint-plugin-jsx-a11y`

```sh
yarn add eslint-plugin-import eslint-plugin-react eslint-plugin-jsx-a11y -D
```

然后，你需要在 `.eslintrc.json` 中添加以下内容：

```json
{
  "plugins": [
    "react",
    "jsx-a11y"
  ]
}
```

## 推荐方案

直接使用 [eslint-config-airbnb-typescript](https://www.npmjs.com/package/eslint-config-airbnb-typescript) 快速配置。
