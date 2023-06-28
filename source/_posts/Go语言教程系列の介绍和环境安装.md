---
title: Go 语言教程系列の介绍和环境安装
date: 2023-03-19 15:01:00
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1679280067130.png
swiper_index: 6
description: 这是我们 Golang 教程系列中的第一篇教程。本教程介绍了 Go，并讨论了选择 Go 而不是其他编程语言的原因。我们还将学习如何在 Mac OS，Windows 和 Linux 中安装 Go。
categories:
  - [Golang, Go 语言系列教程]
  - [紫升翻译计划]
tags:
  - Golang
  - Go 语言教程
  - Go 语言教程系列
  - Go 安装教程
  - swiper
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>


这是我们 Golang 教程系列中的第一篇教程。本教程介绍了 Go，并讨论了选择 Go 而不是其他编程语言的原因。我们还将学习如何在 Mac OS，Windows 和 Linux 中安装 Go。

## 介绍

Go 也被称为 Golang，是 Google 开发的一种开源、编译和静态类型的编程语言。Go 创作背后的关键人物是 Rob Pike，Ken Thompson 和Robert Griesemer。Go 于 2009 年 11 月公开发布。

Go 是一种通用的编程语言，语法简单并具有强大的标准库作为后盾。Go 大放异彩的关键领域之一是创建高可用性和可伸缩性的 Web 应用程序。Go 还可以用于创建命令行应用程序、桌面应用程序甚至移动应用程序。

## Go 的优势

当大量其他语言（例如 python，ruby，nodejs ...）可以实现相同需求时，为什么选择 Go 作为服务器端编程语言。

这里是我选择 Go 时发现的一些优点。

### 简单的语法

语法简单明了，并且该语言不会因不必要的功能而显得臃肿。这使得编写可读性和可维护性的代码变得容易。

### 易于编写并发程序

并发是语言的固有部分。直接的影响是编写多线程程序变得简直小菜一碟。这是通过 Goroutines 和管道实现的，我们将在接下来的教程中对其进行讨论。

### 编译语言

Go是一种编译语言。源代码被编译为本地二进制文件。 解释语言（例如，nodejs 中使用的 JavaScript 和 Python）缺少此功能。

### 快速编译

Go编译器非常神奇，并且从一开始就被设计为快速的。

### 静态链接

Go 编译器支持静态链接。整个 Go 项目可以静态链接到一个大型的二进制文件中，并且可以轻松部署在云服务器中，而不必担心依赖关系。

### Go 工具链

工具在 Go 中值得特别提及。Go 附带了功能强大的工具，可以帮助开发人员编写更好的代码。常用的工具有：

- `gofmt`：`gofmt` 是用于自动格式化 go 源代码的。它使用制表符进行缩进，并使用空格进行对齐。
- `vet`：`vet` 分析 go 源代码并报告可能的可疑代码。vet 报告的所有内容都不是真正的问题，但具有捕获编译器未报告的错误的能力，例如使用 `Printf` 时格式说明符不正确。
- `golint`：golint 用于识别代码中的样式问题。

### 垃圾回收

Go 使用垃圾回收，因此内存管理几乎会自动执行，开发人员无需担心内存管理问题。 这也有助于轻松地编写并发程序。

### 简单语言规范

语言规范非常简单。 整个规范只有一个页面，你甚至可以使用它来编写自己的编译器 :)

### 开源

最后但并非最不重要的一点是，Go 是一个开源项目。 你可以参与 Go 项目并为该项目做出贡献。

## 使用 Go 构建的热门产品

以下是一些使用 Go 构建的流行产品。

- Google 使用 Go 开发了 Kubernetes using。
- Docker, 世界上最著名的容器平台是使用 Go 开发的
- Dropbox 已将其性能敏感组件从 Python 迁移到 Go。
- Infoblox 的 下一代网络产品是使用 Go 开发的。

## 安装

Go 可以安装在 Mac，Windows 和 Linux 这三个平台上。你可以从https://golang.org/dl/ 下载对应平台的二进制文件。

### Mac OS

从 https://golang.org/dl/ 下载 Mac OS 安装程序。双击开始安装。按照提示进行操作，这会将 Golang 安装在 `/usr/local/go` 中，并且还将文件夹 `/usr/local/go/bin` 添加到 `PATH` 环境变量中。

### Windows

从 https://golang.org/dl/ 下载 MSI 安装程序。双击开始安装，然后按照提示进行操作。 这会将Go安装在位置 `c:\Go`，还将目录 `c:\Go\bin` 添加到你的路径环境变量中。

### Linux

从 https://golang.org/dl/ 下载 tar 文件并将其解压缩到 `/usr/local`。

将 `/usr/local/go/bin` 添加到 `PATH` 环境变量中。这将在 Linux 中安装 Go。

## 验证安装

要验证 Go 安装是否成功，请在终端中键入命令 `go version`，它将输出已安装的 Go 版本。这是我终端的输出。

```sh
$ go version
go version go1.16 darwin/amd64
```

在编写本教程时，1.16 是 Go 的最新版本。这证明 Go 已成功安装。在下一个教程中，我们将在 Go 中编写第一个 Hello World 程序 :)

请提供你宝贵的反馈和意见。谢谢阅读。

> 原文地址 [Part 1: Introduction and Installation](https://golangbot.com/golang-tutorial-part-1-introduction-and-installation/)
> 原文作者：[Naveen Ramanathan](https://golangbot.com/about/)
> 译文出自：[紫升翻译计划](https://youngjuning.js.org/categories/%E6%B4%9B%E7%AB%B9%E7%BF%BB%E8%AF%91%E8%AE%A1%E5%88%92/)
