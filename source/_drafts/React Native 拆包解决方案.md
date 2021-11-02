---
title: React Native 拆包解决方案
date: 2020-02-15 16:56:19
categories:
  - [移动开发, React Native]
tags:
  - metro
---

一个RN应用中可能包含许多不同的业务，这些不同的业务很可能是不同部门开发的，这样一个库中就有许许多多的重复的RN代码和第三方库代码。

所以一般做法都是将重复的RN代码和第三方库打包成一个基础包，然后各个业务在基础包的基础上进行开发，这样做的好处是可以降低对内存的占用，减少加载时间，减少热更新时流量带宽等，在优化方面起到了非常大的作用。

<!--more-->

## 拆包方案选择

目前，最好的RN分包方案还是facebook官方提供的[metro bundle](https://facebook.github.io/metro/docs/en/getting-started)，此方案是fb在0.50版本引入的，并随着RN版本的迭代不断完善。也即是说，只要你使用的是0.50以上的RN版本，就可以使用metro bundle进行差分包进行热更新。

我们选择 react-native-multibundler 作为我们的拆包方案，它基于react native的metro bundler的配置化开发来处理分包，支持iOS和Android，metro bundler为官方打包的工具，使用官方分包方法更灵活稳定，比网上的一些方法更实用可靠。

下图是我们的目标架构：

<img src="https://i.loli.net/2019/10/12/AYqMTmdfp5jRlEi.png" style="zoom: 50%;" />

## metro bundle

```shell
react-native bundle
\ --platform android
\ --dev false
\ --entry-file platformDep.js
\ --bundle-output ./android/app/src/main/assets/platform.android.bundle
\ --assets-dest android/app/src/main/res/
\ --config /{你的绝对路径}/platform57.config.js
```

- `--platform [string]`：ios 或 android（默认ios）
- `--dev [boolean]`：打正式包请设置为false（默认true）
- `--entry-file <path>` ：打包入口文件，绝对路径、相对路径都可以
- s`--bundle-output [string]：bundle包存放的位置
- `--assets-dest [string]` ：存放静态资源的文件夹
- `--config [string]`：CLI 配置文件的路径，根据基础包业务包的不同，添加 `--config <path/to/config>` 参数对相应入口文件打包。

## 参考链接

- [React Native 拆包及实践「iOS&Android」](https://juejin.im/post/5cee0095f265da1b6d4006ec)
- [React Native 分包哪家强？看这文就够了！](https://www.zhuanzhi.ai/document/70cdd36e33264f337529e3a18c27215c)
- [ctripcorp/CRN](https://github.com/ctripcorp/CRN)：偏向于性能优化，拆包这块不够详细
- [react-native-multibundler](https://github.com/smallnew/react-native-multibundler)：react native可视化bundle拆包,支持debug,支持官方的0.57~0.60版本,使用官方的metro拆包,适用于Android、iOS
- [一种强大、可靠的React Native拆包以及热更新方案，基于CodePush，Metro](https://juejin.im/post/5d906e19f265da5b9c3cf2ea)
