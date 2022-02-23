---
title: 使用 wml 进行模块调试
date: 2020-07-10 16:15:07
categories:
	- [前端开发,教程]
tags:
	- vant
	- 微精通
---

![](https://i.loli.net/2020/07/10/U9HfpMmCqe3ZV25.jpg)

前端模块开发已经成为了开发标准。模块开发带来的一大便利就是让我们可以跨页面甚至跨应用复用代码。当我们跨应用复用模块时，就需要借助 npm 把模块发布出去供各个系统调用。今天介绍的 wml 是一个进行模块调试的利器。

<!--more-->

## wml 是什么

wml 侦听某个文件夹中的更改（使用[Watchman](https://facebook.github.io/watchman/)），然后将更改的文件复制到另一个文件夹中。

wml 是一个 CLI 工具，其工作方式与ln -s非常相似。首先，使用 `wml add` 命令设置链接，然后运行wml服务（`wml start`）开始监听。仅此而已！

## 为什么使用 wml

让我们面对现实吧，有时符号链接还不够。Github中有超过 [1万个](https://github.com/search?utf8=%E2%9C%93&q=support+for+symlinks&type=Issues) 关于 **"support for symlinks"**。

到目前为止，我遇到的两个例子是: React Native 的包管理器[缺失对 symlinks 的支持](https://github.com/facebook/react-native/issues/637) 和Webpack的 [inability to find linked modules dependencies](http://webpack.github.io/docs/troubleshooting.html#npm-linked-modules-doesn-t-find-their-dependencies)。很多人的办法就是直接修改 **node_modules** 下的文件夹，但是这会造成很多问题：

1. 当同时有两个项目依赖你的模块时，就搞砸了
2. 当不小心执行了 `npm install`，就又搞砸了
3. 总之就是感觉这样不对

wml 使用 Facebook 的超快 Watchman 来监视源文件夹中的更改，并将它们（并且仅复制）复制到目标文件夹中。

## 安装 watchman

- [watchmamn Installation](https://facebook.github.io/watchman/docs/install)
- [How to install Watchman on Windows (win10)?](https://stackoverflow.com/questions/38451764/how-to-install-watchman-on-windows-win10)

windows 下为了让 `wml start` 能够工作需要执行以下命令：

```sh
# npmGlobalPrefix 可以通过 `npm prefix -g` 获取
$ watchman watch ${npmGlobalPrefix}\node_modules\wml\src
# 一定要重启电脑让配置生效！
```

## 安装

```sh
$ npm install -g wml
```

### wml 命令

- `wml add|a <src> <dest>`: 添加链接
- `wml start|s`: 开启 wml
- `wml list|ls`: 显示所有的链接
- `wml rm <linkId>`: 删除一个链接，传递 `all` 可以删除所有链接
- `wml enable|e`: 启用一个链接，传递 `all` 一键启用所有链接
- `wml disable|d`: 禁用一个链接，传递 `all` 一键禁用所有链接
- `watchman watch-del-all`: 修改 `.watchmanconfig` 之后需要清空 watchman 缓存

## 最佳实践

### npm scripts

这是我的习惯，写脚本能提高工作效率：

```json
{
  "scripts": {
    "dev": "wml start",
    // yarn wml:add <dest>
    "wml:add": "wml add ./",
    // 修改 `.watchmanconfig` 之后需要清空 watchman 缓存
    "wml:clean":"watchman watch-del-all",
  },
}
```

### demo 在模块中

你可能为了演示你的模块，而把演示项目放在模块项目中，这也很常见的。我们需要做一下配置：

1、修改 package.json

```json
{
  "name": "zhiliao",
  "scripts": {
    "dev": "wml start",
    "wml:add": "wml add ./ ./Example/node_modules/zhiliao/",
    // 修改 `.watchmanconfig` 之后需要清空 watchman 缓存
    "wml:clean":"watchman watch-del-all",
  },
}
```

2、配置 .watchmanconfig 文件把 Example 文件夹忽略掉

```json
{
  "ignore_dirs": [
    ".git",
    "node_modules",
    "yarn-error.log",
    "yarn.lock",
    "README.md",
    "Example"
  ]
}
```

## 联系作者

> 本文首发于个人博客：https://youngjuning.js.org/

## Contacts

|                           作者微信                           |                           赞赏作者                           |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="https://i.loli.net/2020/02/22/q2tLiGYvhIxm3Fl.jpg" width="200px"/> | <img src="https://i.loli.net/2020/02/23/q56X1eYZuITQpsj.png" width="200px"/> |
