---
title: 「已解决」Error "Waiting for a runner to pick up this job" using GitHub Actions
description: 当我使用 GitHub Actions 时，有一个漫长的等待，它显示 "Waiting for a runner to pick up this job"，但是这个配置已经成功运行了很多次，我不知道为什么会出现这个问题。
date: 2023-04-05 23:36:05
categories:
  - [issues, GitHub]
tags:
  - GitHub
  - GitHub Actions
  - GitHub Actions Error
  - ci/cd
---

<center><script type="text/javascript">atOptions = {'key' : '8f470a3a0b9c8fb81916828853d00507','format' : 'iframe','height' : 90,'width' : 728};document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://harassinganticipation.com/8f470a3a0b9c8fb81916828853d00507/invoke.js"></scr' + 'ipt>');</script></center>

当我使用 GitHub Actions 时，有一个漫长的等待，它显示 "Waiting for a runner to pick up this job"，但是这个配置已经成功运行了很多次，我不知道为什么会出现这个问题。

runner 是由 `runs-on` 指定的，所以我尝试将 `runs-on` 的版本从 18 升到了 22，问题解决了。但是我想如果我不想总是升级 runner 的版本，我应该怎么做？我们可以像给 docker 指定 os 一样指定：

```yml
runs-on: ubuntu-latest
```
