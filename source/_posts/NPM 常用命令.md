---
title: NPM 常用命令
date: 2022-11-17 12:02:58
categories:
  - 前端
tags:
  - npm
  - 命令
---

## 全局

- `npm root --location=global`：查看全局包安装路径
  > Mac 下默认的全局路径是：`/usr/local/lib/node_modules`
  > Ubuntu 下默认的全局路径是: `/usr/lib/node_modules`
- `npm ls --location=global`：查看全局包列表
  - `npm ls --location=global --depth 0`：仅查看一级包
  - `npm ls --location=global --depth 0 | grep packageName`：查看一级包并搜索相关包

## owner

管理已经发布的包的所有权

- `npm owner add <user> [<@scope>/]<pkg>`：给某个包添加用户
- `npm owner rm <user> [<@scope>/]<pkg>`：删除某个包的某个用户
- `npm owner ls [<@scope>/]<pkg>`：列出某个包的所有用户

## 将指定版本设置为指定标签

```sh
$ npm dist-tag add @youngjuning/playground@1.0.3 latest|alpha|beta
```

## 展示 dist-tag

```sh
$ npm dist-tag ls @youngjuning/playground
```

## 废弃某个版本

```sh
$ npm deprecate @youngjuning/playground@1.0.3 "垃圾"
```

## package.json 字段解释

```json
{
  "name": "wx-promise-pro",
  "version": "3.2.2",
  "description": "强大的、优雅的小程序 Promise 库",
  "main": "dist/wx-promise-pro.js",
  "types": "index.d.ts",
  "scripts": {
    "build": "rollup -c",
    "postversion": "yarn build && git push --tags && git push && npm publish"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/youngjuning/wx-promise-pro.git"
  },
  "keywords": [
    "promise",
    "es6",
    "then",
    "catch",
    "finally",
    "小程序",
    "weapp",
    "miniapp",
    "weixin"
  ],
  "author": {
    "name": "紫升",
    "email": "youngjuning@aliyun.com",
    "url": "https://youngjuning.cn"
  },
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/youngjuning/wx-promise-pro/issues"
  },
  "homepage": "https://github.com/youngjuning/wx-promise-pro#readme",
  "devDependencies": {
    "@babel/core": "^7.8.7",
    "@babel/preset-env": "^7.8.7",
    "rollup": "^1.28.0",
    "rollup-plugin-babel": "^4.3.3",
    "rollup-plugin-commonjs": "^10.1.0",
    "rollup-plugin-json": "^4.0.0",
    "rollup-plugin-node-resolve": "^5.2.0",
    "rollup-plugin-terser": "^5.1.3"
  }
}
```
