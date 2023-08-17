---
title: 忽略 incompatible engine node error
date: 2023-08-16 21:53:00
categories:
  - [前端, NodeJs]
tags:
  - incompatible
  - node
  - engine
description: 本文介绍了如何忽略不兼容的 node engine 错误
---

大家都知道 npm 包可以通过在 `package.json` 指定 engines 来限制使用的运行时环境，比如我最近开发公司项目时遇到某个项目指定了 node 版本过低：

```json
{
  "engines": {
    "node": ">7 <=9"
  }
}
```

由于历史原因我们无法移除这个包，所以需要忽略由其引起报错：

```bash
yarn install --ignore-engines
```

或者：

```bash
yarn config set ignore-engines true
```