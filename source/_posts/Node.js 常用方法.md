---
title: Node.js 常用方法
date: 2021-11-08 17:16:05
categories:
  - 前端
tags:
  - Node.js
---

## fs

> 推荐使用 fs-extra

- `fs.readFileSync(path).toString()`: 把文件读成字符串
- `fs.readFileSync(path, 'utf-8')`: 本文件读成字符串

## child_process

> 推荐使用 execa
