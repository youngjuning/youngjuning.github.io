---
title: 基于 lerna 的多包 JavaScript 项目搭建维护
date: 2023-03-08 18:26:27
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678271257803.png
description: 将大型代码仓库分割成多个独立版本化的 软件包（package）对于代码共享来说非常有用。但是，如果某些更改 跨越了多个代码仓库的话将变得很麻烦并且难以跟踪，并且，跨越多个代码仓库的测试将迅速变得非常复杂。
categories:
  - 前端
tags:
  - JavaScript
  - lerna
  - yarn
  - npm
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>


将大型代码仓库分割成多个独立版本化的 软件包（package）对于代码共享来说非常有用。但是，如果某些更改 跨越了多个代码仓库的话将变得很麻烦并且难以跟踪，并且，跨越多个代码仓库的测试将迅速变得非常复杂。

为了解决这些（以及许多其它）问题，某些项目会将 代码仓库分割成多个软件包（package），并将每个软件包存放到独立的代码仓库中。但是，例如 Babel、 React、Angular、Ember、Meteor、Jest 等项目以及许多其他项目则是在 一个代码仓库中包含了多个软件包（package）并进行开发。

Lerna 是一种工具，针对 使用 git 和 npm 管理多软件包代码仓库的工作流程进行优化。

## 开始

### 全局安装 lerna

```sh
$ npm install lerna -g
```

### 初始化 lerna 项目

```sh
$ lerna init --independent
```

你的代码仓库目前应该是如下结构：

```
lerna-repo/
  packages/
  package.json
  lerna.json
```

## 创建 package

```sh
$ lerna create module-1
$ lerna create module-2
```

## yarn workspaces & Lerna Hoisting

使用 [yarn workspaces](https://yarnpkg.com/lang/zh-Hans/docs/workspaces/) 结合 Lerna `useWorkspaces` 可以实现 [Lerna Hoisting](https://github.com/lerna/lerna/blob/main/doc/hoist.md)。这并不是多此一举，这可以让你在统一的地方（根目录）管理依赖，这即节省时间又节省空间。

配置 lerna.json:

```json
{
  ...
  "npmClient": "yarn",
  "useWorkspaces": true
}
```

顶级 package.json 必须包含一个 workspaces 数组:

```json
{
  "private": true,
  ...
  "workspaces": ["packages/*"]
}
```

## npm registry

### 搭建 verdaccio

> verdaccio 是一个开源轻量的 npm 私服

全局安装：

```sh
$ npm install verdaccio -g
```

配置 `~/.config/verdaccio/config.yaml` uplinks:

```yml
---
# a list of other known repositories we can talk to
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
  taobao:
    url: https://registry.npm.taobao.org/
```

### 设置开机自启动

0、run `sudo npm i -g pm2`

1、run `pm2 start verdaccio` & `pm2 startup`

outputs:

```sh
[PM2] Init System found: launchd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/usr/local/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup launchd -u luozhu --hp /Users/luozhu
```

2、run `sudo env PATH=$PATH:/usr/local/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup launchd -u luozhu --hp /Users/luozhu`

outputs:

```sh
[PM2] Freeze a process list on reboot via:
$ pm2 save

[PM2] Remove init script via:
$ pm2 unstartup launchd
```

### 修改 lerna publishConfig

```json
// lerna.json
{
  "ignoreChanges": [
    "ignored-file",
    "**/__tests__/**",
    "**/*.md"
  ],
  "command": {
    "publish": {
      "registry": "http://localhost:4873"
    },
    "version": {
      "conventionalCommits": true,
      "message": "chore(release): publish"
    }
  }
}
```

> 注意：如果子包是带 `scope` 的，需要为子包设置 `publishConfig.access`

## commitlint & commitizen

> 请参考我之前的文章 [一文搞定规范化 Git Commit](https://juejin.im/post/6877462747631026190)

## 开发流程

### install

```sh
$ yarn install
```

### package 依赖

给指定 package 安装依赖：

```sh
# 或者（推荐）
$ lerna add lodash packages/module-1
# 或者
$ lerna add lodash --scope=module-1
# 或者
$ lerna add lodash **/module-1
# 或者
$ yarn workspace module-1 add lodash
```

给所有 package 安装依赖：

```sh
$ lerna add lodash
```

### workspace 之间的依赖

```sh
$ lerna add module-2 --scope module-1
# 或者
$ lerna add module-2 packages/module-1
```

### 共用的工具依赖

```sh
$ yarn add -WD typescript
```

## lerna.json

- version: 当前仓库的版本，Independent mode 请设置为 `independent`
- npmClient: 指定运行命令的客户端程序（默认是 npm）
- ignoreChanges: 一个不包含在 `lerna changed/publish` 的 glob 数组。使用这个去阻止发布不必要的更新，比如修复 `README.md`
- command
  - publish
    - registry：设置自定义的 npm 代理（比如使用 verdaccio 搭建的私服）
    - conventionalCommits：`lerna version` 会自动决定 version bump 和生成 CHANGELOG 文件
    - message：一个 publish 时的自定义 commit 信息。详情请查看[@lerna/version](https://github.com/lerna/lerna/blob/main/commands/version#--message-msg)

## npm scripts

```json
{
  "scripts": {
    "release:beta": "lerna publish --canary --pre-dist-tag=beta --preid=beta --yes",
    "release:rc": "lerna publish prerelease --pre-dist-tag=rc --preid=rc",
    "release:next": "lerna publish prerelease --pre-dist-tag=next --preid=next",
    "release:preminor": "lerna publish preminor --pre-dist-tag=next --preid=next",
    "release:premajor": "lerna publish premajor --pre-dist-tag=next --preid=next",
    "release": "lerna publish",
    "release:minor": "lerna publish minor",
    "release:major": "lerna publish major",
    "commit": "git cz"
  }
}
```

> 本文首发于「[紫竹的官方网站](https://youngjuning.js.org/)」，同步于公众号「[紫竹早茶馆](https://cdn.jsdelivr.net/gh/youngjuning/images/20210418112129.jpeg)」和「[掘金专栏](https://juejin.cn/user/325111174662855)」。
