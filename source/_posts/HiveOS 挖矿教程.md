---
title: HiveOS 挖矿教程
date: 2022-01-02 17:59:47
cover: https://cdn.jsdelivr.net/gh/youngjuning/images/202201051827160.png
categories:
  -  区块链
tags:
  - 以太坊
  - 挖矿
  - HiveOS
hide: true
---

## 注册

访问 [Hive OS](https://hiveos.farm?ref=1281801) 注册页面，进行注册。

## 下载 Hiveon OS 镜像

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/820c8deff62649a4acc265c35ec678eb~tplv-k3u1fbpfcp-watermark.image)

## 工具下载

### 下载系统烧录软件

现在大家通常使用 Etcher 来烧录软件，包括树莓派系统安装也是推荐的 [Etcher](https://www.balena.io/etcher/)。这是一款同时支持 Windows、Linux 和 macOS 的烧录工具。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec9f83f50a4e4ae382fed807d23e30f3~tplv-k3u1fbpfcp-watermark.image)

### 下载 NTFS 挂载工具

默认地，在 MacOS 下 NTFS 格式是只读的，我们需要下载 [Mounty for NTFS](https://mounty.app/)：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ef09de5d0d14c62bceddb4077f640e4~tplv-k3u1fbpfcp-watermark.image)

## 烧录系统

准备一个 16G 以上的优盘或者固态硬盘。然后打开系统烧录软件，选择镜像和挂载的优盘开始烧录即可。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7fe6dd226794e39972b4f6a6cb9ad6c~tplv-k3u1fbpfcp-watermark.image)

SSD 更可靠，更推荐使用。如果您想延长 U 盘的使用寿命，请在安装后运行 `logs-off`。

## 创建矿场

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/460c3dac64dc46f58fb8b9abaeaa4775~tplv-k3u1fbpfcp-watermark.image)

如果是付费用户可以选择开启 `Hiveon Pool Charging` 选项，具体怎么选，请参考 [Billing in Hive OS: Important Updates from 06/12/2020](https://medium.com/hiveon/hiveon-pool-important-updates-cd4f1be00f0a)。

## 添加钱包

使用小狐狸、TP 钱包或者币安钱包生成一个以太坊地址：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef4237818225416697e4851f3f05edba~tplv-k3u1fbpfcp-watermark.image)

## 创建矿机

选择右边的 GPU 矿机：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1a86ce3441a4b729b60e9195bc75e34~tplv-k3u1fbpfcp-watermark.image)
