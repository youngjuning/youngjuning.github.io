---
categories:
  - [issues, github]
date: '2023-07-18T11:20:35.047326+08:00'
description: 经常使用 Github 的开发在执行 git push 时经常会遇到 Failed to connect to github.com port 443 问题，今天紫升就来介绍下如何完美解决这个问...
tags:
  - github
  - github 加载
  - github release
  - github cdn
title: 「已解决」Failed to connect to github.com port 443
---

经常使用 Github 的开发在执行 `git push` 时经常会遇到 `Failed to connect to github.com port 443` 问题，今天紫升就来介绍下如何完美解决这个问题。

- https://sites.ipaddress.com/github.com
- https://sites.ipaddress.com/assets-cdn.github.com
- https://sites.ipaddress.com/github.global.ssl.fastly.net
- https://sites.ipaddress.com/github.dev
- https://sites.ipaddress.com/githubusercontent.com

然后找到 A Records 依次记下 ip。

最后打开电脑的hosts文件，把下列的东东写在最后，然后保存即可：

```txt
140.82.113.4    github.com
185.199.108.153 assets-cdn.github.com
151.101.1.194  github.global.ssl.fastly.net
52.224.38.193 github.dev
185.199.108.133 githubusercontent.com
```
