---
title: 从零使用 Go 语言构建 CLI 项目
description: 项目基于流行的 Go CLI 框架 Cobra 项目开发，基本按预期实现了需求和设计目标，为之后进一步完善开发者生态找到了抓手，为形成开发闭环添加了重要一环（皮一下）。
date: 2023-04-19 17:46:01
categories:
  - Golang
tags:
  - Golang
  - CLI
  - Cobra
  - Go
---

## 项目简介

[tuya-panel-cli](https://github.com/tuya/tuya-panel-cli) 是一款基于 Go 语言的服务于涂鸦智能面板开发者的开发工具。

主要功能是基于 [tuya-panel-demo](https://github.com/tuya/tuya-panel-demo) 仓库初始化一个面板项目、打包开发完成的项目以及工具后台自动检查更新。

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7eeb936770f44767ba14ce60a170737b~tplv-k3u1fbpfcp-zoom-1.image" style="zoom: 33%;" />

项目基于流行的 Go CLI 框架 Cobra 项目开发，基本按预期实现了需求和设计目标，为之后进一步完善开发者生态找到了抓手，为形成开发闭环添加了重要一环（皮一下）。

我在该项目中负责需求承接、技术选型（后边会介绍）、方案设计、方案落地以及项目交付整个流程的工作。当然这并没什么可吹嘘的，如您所见也并不是什么复杂的项目。我之所以很想复盘，是因为这个项目是由我从 0 到 1 再到 1.1 完全把控的一个项目。

## 项目背景

涂鸦智能是一家全球化物联网 AI + IOT 领军企业，紫升所在的 [IoTOS](https://www.tuya.com/cn/product/product-development/IoTOS-Development) 部门主要是赋能开发者使用涂鸦 IoTOS, 自主选择不同芯片进行智能产品开发。

随着公司内部和公司外部开发者不断增多，维护两套开发工具已不再适应趋势。为了更好地服务广大开发者。我们需要搭建统一的开发者平台。开发者工具（CLI）无疑是很好的开端。

## 技术选型

在真正开始开发前，紫升分别对 Node、Deno 和 Go 的方案进行了调研。之所以没有直接使用 Node 进行开发，一是因为 Boss 要求源代码不开放，二是因为我们的开发者很多是搞嵌入式的。为了最大程度方便开发者（无需安装运行环境）我们们需要一个可以将 CLI 打包成二进制的方案。

### **Node**

众所周知，Node 开发的 CLI 是需要通过 NPM 安装的，开发者需要在本地事先安装 Node 环境。这一点作为前端开发者可能习以为常，但是对于非前端开发人员或非程序员，运行你的脚本需要额外配置环境就会显得很突兀。

那 Node 有没有二进制打包方案呢？

答案是肯定的，紫升在调研中发现了[oclif](https://github.com/oclif/oclif) 和 [pkg](https://github.com/vercel/pkg)，两者都可以将开发好的程序进行跨平台打包。区别在于 pkg 只是一个简单地将程序打包成二进制可执行文件的工具，而 oclif 是一个完善的支持插件系统的 CLI 框架。

目前为止，oclif 看起来就是我们想要的，但是很遗憾，它由于将 Node 环境打包进安装程序造成安装包过大以及直接暴露源代码落选了（pkg 则是由于太过简陋的功能直接 pass）。

### Deno

紫升是一个 Deno 爱好者，[Deno从入门到跑路 | 🏆 技术专题第一期征文](https://juejin.cn/post/6854573220432248839) 证明了我写过 Hello World。由于语法和 API 上都很接近 Node，所以成为了第二个考虑的方案。

Deno 在 1.7.0 加入了对 Windows 平台的编译支持后，完整支持了跨平台编译。[seve](https://github.com/youngjuning/seve) 是我写的一个简单的 CLI Demo。

没有选择 Deno 的原因生态不够完善需要自己造的轮子有点多。比如没有成熟的跨平台编译、Flag 解析、问卷插件、彩色文字、loading、进度条插件。至于类似于 Node 的 Commander 和 cac 的 CLI 框架就更没有了。seve 就是我挖的一个大坑，本意是打造一款 Deno 版的 Commander，在接触 cac 之后改了主意。

### Go

紫升也是一个 Go 的爱好者，同样的 [极速入门Go并爬取掘金专栏 | 🏆 技术专题第二期](https://juejin.cn/post/6860522117423857678) 证明我写过 Hello World。之所以最后才考虑 Go，是因为作为前端开发者，Node 和 Deno 给我的心理压力很小或者几乎没有，而 Go 对我来说是既熟悉又陌生。如果不是前两者都无法符合要求，恐怕我是不会选择 Go 的。

**跨平台编译**

Go 本身就支持编译命令，下面便是使用 go 自带 `build` 命令编写的打包脚本：

```shell
#!/bin/bash
name="tuya-panel-cli"
# Windows
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o ${name}.exe main.go
# Linux
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ${name} main.go
# MacOS
CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -o ${name} main.go
```

你可能会觉得以上脚本很繁琐，Go 也有第三方的编译插件可以使用，比如 [gox](https://github.com/mitchellh/gox) 和 [xgo](https://github.com/karalabe/xgo)。

**CLI 框架**

[urfave](https://github.com/urfave/cli) 比较简单易上手，如果是小型的或者单命令的程序推荐选择，我选择的是 [cobra](https://github.com/spf13/cobra)。调研 Cobra 的过程中，顺手整理翻译了[Cobra 中文文档](https://juejin.cn/post/6924541628031959047)，有需要的掘友可以直接白嫖。我们看下 Cobra 的特性：

- 简单的基于子命令的 CLIs：`app server`、`app fetch` 等；

- 完全兼容 [POSIX（可移植操作系统接口）](https://zh.wikipedia.org/wiki/可移植操作系统接口) 的标志（包括短版和长版）

- 嵌套子命令

- 全局、局部和级联的标志

- 使用 `cobra init appname` 和 `cobra add cmdname` 轻松生成应用程序和命令

- 智能提示（`app srver` ...did you mean `app server`）

- 自动生成命令和标志的帮助

- 自动识别 `-h`、`--help` 等帮助标识

- 自动为你的应用程序生成的 bash 自动完成

- 自动为你的应用程序生成 man 手册

- 命令别名，以便你可以更改内容而不会破坏它们

- 定义自己的帮助，用法等的灵活性。

- 可选与 [viper](https://github.com/spf13/viper) 紧密集成，可用于 [12factor](https://12factor.net/zh_cn/) 应用程序

> 从特性便可以看出来 Cobra 既可以为我们提供丰富的特性，又可以让我们的方案落地。

## 实践过程

实践过程中遇到的问题，以及解决方式？
最后达成了什么效果，或者什么样的优化和提升？

技术选型之后就是落地实践，项目框架搭建掘友可直接阅读前文提到的中文文档，这里不再赘述。下面我将按照 tuya-panel-cli 实现的命令分别讲述实践过程。

### init 初始化模板

> 需求：[tuya-panel-demo](https://github.com/tuya/tuya-panel-demo) 项目包含了所有的模板，我们需要实现提示用户选择对应模板并初始化到当前目录

1、发布模板：[GitHub CI](https://github.com/tuya/tuya-panel-demo/blob/master/.github/workflows/release.yml) 监听到有新的 git tag 被 push 到仓库，则将所有模板打包并发布一个草稿版的 release，管理员手动编写发行说明后正式发布 release。这个过程和 Deno 本身的版本管理是一致的。关于这部分内容可以阅读[叮，一份 Deno GitHub Action 源码解析请查收](https://juejin.cn/post/6926899307735957511)。

2、选择模板：第一个思路是维护一个 `txt` 文件，通过 http 获取内容，这有点蠢，每次有新的模板或删除模板都需要手动维护；第二个思路是通过爬虫爬取 `https://github.com/tuya/tuya-panel-demo/releases/latest` 并取出模板列表。我用的爬虫插件是 [colly](github.com/gocolly/colly)，选择提示插件是 [promptui](github.com/manifoldco/promptui)。

3、下载模板：我是使用 `net/http` 手撸了一个文件下载函数，然后使用 [archiver](github.com/mholt/archiver) 对压缩包解压到缓存目录，最后使用 [copy](github.com/otiai10/copy) 复制到当前目录。

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee160384538a4fba8882ccf08bed0cb0~tplv-k3u1fbpfcp-zoom-1.image)

### upgrade 升级命令

[向 Deno 学习优秀的脚本管理](https://juejin.cn/post/6924465443704930318) 讲述了如何管理我们的程序，[基于 Go 实现 Deno upgrade](https://juejin.cn/post/6925201316264443918) 讲述了如何站在巨人的肩膀上实现了自己的 upgrade 命令。这里简要概述一下。

1、借鉴 Deno 的脚本管理方式，我们通过 github release 管理版本（Go 语言的插件管理也是这个套路）

2、阅读 Deno upgrade 命令源码并用 Go 实现（由此接触并喜欢上了 Rust）

3、在模仿的基础上实现了后台检查更新的功能

4、封装了 [go-release](https://github.com/youngjuning/go-release) 插件并开源。

### package 打包

这个命令是从内部项目迁移出来的，学到一个知识是文件顶部加 `// +build windows` 代表 windows 平台编译使用，`// +build linux darwin` 代表 linux 和 mac 下编译使用。

### homebrew

为了进一步方便 Homebrew 用户，紫升将 tuya-panel-cli 发布到了 [youngjuning/homebrew-tap](https://github.com/youngjuning/homebrew-tap)，具体的内容请参考当时我写的文章[不会吧？不会吧！还有人不会发 Homebrew 包？](https://juejin.cn/post/6922347045692899336)

## 总结思考

- 技术选型要实际写 demo，看上去合适的不一定真的合适
- 技术选型要考虑时间、生态，作为职业程序员不应该畏惧舒适区以外的世界
- 项目能够如期交付，一方面是 cobra 这个框架的强大和易用，二是由于先前储备的 Go 基础知识。不过这也没什么值得夸耀的，用到的语法都足够简单。
- 项目发布后，进行了文档的补充和提示的优化。暂未发现使用上的问题。
- 暂未和 viper 联动，后续有需求可以加上。
- 未来需要系统的学习 Go 语言，以便更好地优化项目。

> 最最重要的一点感悟是，一点要及时记录自己的学习和工作情况，就像记账一样。
