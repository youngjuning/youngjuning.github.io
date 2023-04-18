---
title: react-native-create-library 中文文档
description: react-native-create-library 使你可以使用一个命令创建 React Native 原生库的工具
date: 2023-03-08 16:53:10
categories:
  - [洛竹翻译计划]
  - [前端, React Native]
tags:
  - React Native
  - React Native 原生库
---

<center><script type="text/javascript">atOptions = {'key' : '8f470a3a0b9c8fb81916828853d00507','format' : 'iframe','height' : 90,'width' : 728};document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://harassinganticipation.com/8f470a3a0b9c8fb81916828853d00507/invoke.js"></scr' + 'ipt>');</script></center>

react-native-create-library 使你可以使用一个命令创建 React Native 原生库的工具

### 一、你为什么需要这个？

如果您要为 React Native 创建原生模块，则需要为要支持的每个平台提供一些原生代码，然后和一些 JavaScript 代码绑定在一起。自己设置可能非常耗时。

这就是这个工具的用武之地。它创建了一个包含所有当前最佳实践的样板。为什么不用 `react-native new-library`？不幸的是，该命令不会创建一个最新的库，需要一个已经初始化的 React Native 项目，并且只设置 iOS 方面的东西。

> 警告：这仅创建没有视图组件的原生模块。

### 二、安装

```bash
$ npm install -g react-native-create-library
```

这个命令将会创建一个 `MyFancyLibrary` 文件夹，现在可以执行 `yarn install` 来为你新创建的 `Library` 安装依赖。

### 三、命令

> `react-native-create-library [options] <name>`

**选项：**

- `-h`、`--help`: 输入有用的信息
- `-V`、`--version`: 输出版本号
- `-p`、`--prefix <prefix>`: 库的前缀（默认：`RN`）
- `--module-prefix <modulePrefix>`: 库的模块前缀（npm）（默认`react-native`）
- `--package-identifier <packageIdentifier>`: (Android only!) The package name for the Android module (Default: `com.reactlibrary`)
- `--namespace <namespace>`: (Windows only!) The namespace for the Windows module(Default: The name as PascalCase)
- `--platforms <platforms>`: 支持的平台（用逗号隔开，默认：`ios,android,windows`）
- `--github-account <github_account>`: 托管库的 github 账号（默认：`github_account`）
- `--author-name <name>`: 作者的名字（默认：`Your Name`）
- `--author-name <email>`: 作者的邮箱（默认：`yourname@email.com`）
- `--license <license>`: The license type of this library (Default: `Apache-2.0`)
- `--generate-example <shouldGenerate>`: 会生成一个 RN 例子并且 `link` 刚生成的库（默认：`false`）

### 四、程序化使用

```js
const createLibrary = require('react-native-create-library')

createLibrary({
  name: 'MyFancyLibrary',
}).then(() => {
  console.log('Oh yay! My library has been created!')
})
```

#### 选项

```js
{
  name: String, /* The name of the library (Default: Library) */
  prefix: String, /* The prefix for the library (Default: RN) */
  modulePrefix: String, /* The module prefix for the library (Default: react-native) */
  platforms: Array, /* Platforms the library will be created for. (Default: ['ios', 'android', 'windows']) */
  packageIdentifier: String, /* (Android only!) The package name for the Android module (Default: com.reactlibrary) */
  namespace: String, /* (Windows only!) The namespace for the Windows module (Default: The package identifier as PascalCase, which is `Com.Reactlibrary`) */
  githubAccount: String, /* The github account where the library is hosted (Default: `github_account`) */
  authorName: String, /* The author's name (Default: `Your Name`) */
  authorEmail: String, /* The author's email (Default: `yourname@email.com`) */
  license: String, /* The license type of this library (Default: `Apache-2.0`) */
  generateExample: Boolean, /* Will generate a RN example project and link the new library to it (Default: `false`) */
}
```
