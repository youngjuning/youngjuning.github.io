---
title: Typora Mac 版本激活
description: ''
cover: 'https://cdn.jsdelivr.net/gh/youngjuning/images@main/1743757036182.png'
date: 2025-04-04 16:56:53
categories:
  - 工具
tags:
  - Typora
  - 激活
---

1、首先去官网选择 Mac 版本下载安装 [typora](https://www.typoraio.cn/)

2、然后打开 Typora 包内容找到

`/Applications/Typora.app/Contents/Resources/TypeMark/`

3、编辑器打开上面文件夹，这里我拉到 `vscode` 找到 `page-dist/static/js/LicenseIndex.xxx.chunk.js`如下图

![图 1](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1743758579051.png)

4、输入 `hasActivated="true"==e.hasActivated` 进行搜索，将它改为 `hasActivated="true"=="true"`

5、重新打开 Typora 看到成功激活！！！

![](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1743757036182.png)
