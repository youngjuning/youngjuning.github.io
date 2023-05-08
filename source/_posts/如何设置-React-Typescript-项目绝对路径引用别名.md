---
title: 如何设置 React Typescript 项目绝对路径引用别名
description: 本文讲解了如何设置 React Typescript 项目绝对路径引用别名
date: 2023-05-08 18:18:10
categories:
  - [前端, React]
tags:
  - TypeScript
  - React
  - compilerOptions
---

本文讲解了如何设置 React Typescript 项目绝对路径引用别名

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

## craco

1、安装修改 CRA 配置的包：

```bash
$ yarn add @craco/craco
```

2、在项目根目录中创建 craco 的配置文件：`craco.config.js`，并在配置文件中配置路径别名

```js
const path = require('path')
module.exports = {
  webpack: {
    alias: {
      // 约定：使用 @ 表示 src 文件所在路径
      '@': path.resolve(__dirname, 'src'),
      // 约定：使用 @scss 表示 样式 文件所在路径
      '@scss': path.resolve(__dirname, 'src', 'assets', 'styles')
    },
  },
}
```

3、修改 package.json 中的脚本命令

```json
{
  // 将 start/build/test 三个命令修改为 craco 方式
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "eject": "react-scripts eject"
  }
}
```

## Typescript

1、创建 path.tsconfig.json 配置文件

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

2、在 `tsconfig.json` 中导入该配置文件，让配置生效

```json
{
  // 导入配置文件
  "extends": "./path.tsconfig.json",
}
```

配置完这一步，vscode 也会有目录提示了

## Eslint

配置 `@typescript-eslint/parser` 并在 `parserOptions` 中指定 `project` 选项，以便在 Eslint 中使用 TypeScript 的类型检查。

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'], // Specify it only for TypeScript files
  },
}
```
