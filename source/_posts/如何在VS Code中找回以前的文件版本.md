---
title: 如何在 VS Code 中找回以前的文件版本
date: 2023-04-08 20:08:19
description: 你是否遇到过这样的情况：你修改了本地代码文件，但需要恢复到之前保存的未提交到 Git 存储库中的版本？
categories:
  - [前端, VS Code]
tags:
  - VS Code
  - Git
  - 时间线
  - 找回文件版本
  - 撤销修改
  - 撤销保存
  - 撤销提交
  - Local History
---

<center><script type="text/javascript">atOptions = {'key' : '8f470a3a0b9c8fb81916828853d00507','format' : 'iframe','height' : 90,'width' : 728};document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://harassinganticipation.com/8f470a3a0b9c8fb81916828853d00507/invoke.js"></scr' + 'ipt>');</script></center>

## 前言

你是否遇到过这样的情况：你修改了本地代码文件，但需要恢复到之前保存的未提交到 Git 存储库中的版本？

如果你是 Visual Studio Code 的用户，那么你很幸运，因为我将向你展示如何做到这一点...

{% image https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680956041180.png, width=100px, height=100px %}

## 步骤

在探索 VS Code 中众多的菜单选项和面板时，我最近偶然发现了一个鲜为人知的功能，叫做“时间线”（timeline），它可以显示给定文件的运行历史。

你可以在 VS Code 中打开一个给定的文件，在“资源管理器”菜单底部注意到一个名为“时间线”的面板，它显示给定文件的运行版本历史。它将你的本地文件保存历史（未提交更改）和 Git 存储库提交整合在一个地方。这是一个非常方便但鲜为人知的 VS Code 功能。

![vscode 资源管理器时间线面板](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680957163086.png)

点击时间轴面板中的条目，将显示所做修改的不同对比。

![vscode 资源管理器时间线面板](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680957154278.png)

需要注意的是，本地文件的保存历史只有在你用 VS Code 编辑文件时才会被跟踪。因此，如果你在 VS Code 之外编辑文件，你将不会看到任何文件的版本历史。

## Local History

VS Code 内置的时间线功能有一个局限：它只能显示你当前打开的文件的历史，如果你的文件丢失（比如由于 git pull 导致的丢失）那就没有办法找回了。

为了解决这个问题，我发现了一个名为 Local History 的 VS Code 扩展，它可以让你在 VS Code 中查看本地文件的历史版本。

## 结语

Visual Studio Code 有时会让你觉得像糖果店里的孩子......有这么多的闪光灯和旋钮要转，有时会让人有点不知所措。我经常觉得我几乎没有触及它广泛的功能集的表面。说到这里，我希望你能从这篇文章中了解到一些关于 Visual Studio Code 的新知识。

如果你有任何其他 VS Code 的技巧想分享。欢迎在下面的评论中发表，以帮助其他开发者。

祝编码愉快!
