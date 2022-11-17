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
