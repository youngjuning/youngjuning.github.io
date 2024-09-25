---
title: Mac(M2) 正确安装 picgo 姿势
description: 本文介绍了 Mac(M2) 正确安装 picgo 姿势
date: 2024-01-01
categories:
  - Mac
tags:
  - picgo
---

## 安装方式

```sh
brew install picgo --cask
```

## 问题1: 安装后打开 picgo 报错：xxx 已损坏，无法打开。您应该将它移到废纸篓

终端输入：

```sh
sudo xattr -r -d com.apple.quarantine 你的APP路径
```

APP 路径的获取方法：

打开 “访达”（Finder）进入 “应用程序” 目录，找到该软件图标，将图标拖到终端窗口，最终的命令类似

```sh
sudo xattr -r -d com.apple.quarantine '/Applications/PicGo.app'
```

## 问题2: 无法从剪贴板上传

现象：配置好 cos 之后，可以正常从本地推动到主窗口上传，但在剪贴板上的“等待上传” 则点击无效。

![](https://cdn.jsdelivr.net/gh/youngjuning/images@main/202310302151692.png)

排查方式：打开 picgo 的日志文件， 在**主窗口 -> PicGo设置 -> 设置日志文件（点击设置） -> 日志文件（点击打开）**，如果其中的报错是如下格式，可以检查一下对应目录 `picgo-clipboard-images` 是否存在，不存在手动创建一个：

```sh
Error: ENOENT: no such file or directory, open '/Users/zizhu/Library/Application Support/picgo/picgo-clipboard-images/202306272131465.png.3840258425'
```
