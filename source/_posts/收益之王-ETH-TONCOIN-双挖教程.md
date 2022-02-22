---
title: 收益之王 ETH+TONCOIN 双挖教程
date: 2022-02-22 13:52:22
categories:
  - 区块链
tags:
  - 矿池
  - Mining Pool
  - 以太坊
  - ETH
  - TONCOIN
hide: true
---

## 收益对比

### 3060tilhr

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202202221354897.png)

### 3080ti

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202202221356618.png)

## 准备钱包

TONCOIN 挖矿和其他币种不太一样的是不能直接使用交易所的钱包地址挖，必须使用 TONCOIN [官网推荐的钱包](https://ton.org/wallets) 注册地址。我推荐使用 Tonkeeper App，因为转到交易所比较方便。

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202202221446485.png)

## 矿池配置

推荐使用 [tonwhales](https://tonwhales.com/mining) 矿池，因为它是 0 费率的。开始挖矿之前必须先在电报机器人 [@WhalesPoolBot](https://t.me/WhalesPoolBot) 中注册钱包地址才行。

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202202221526915.png)

##  Windows

### 下载内核

目前，支持 ETH+TONCOIN 双挖最好的是 [lolMiner](https://github.com/Lolliedieb/lolMiner-releases/releases/tag/1.46)，下载 windows 版本压缩包。

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202202221358050.png)

下载解压后，可以看到 `dual_mine_eth_ton_` 开头的几个文件，他们就是双挖 ETH+TON 的文件，由于我们使用的是 [tonwhales](https://tonwhales.com/mining) 矿池，所以我们需要使用 `dual_mine_eth_ton_tonwales.bat` 文件。

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202202221400825.png)

### 配置内核

修改 ETH 矿池和钱包地址、修改 TON 的钱包地址，然后就可以开始挖矿了。

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202202221529979.png)

## hiveos

hiveos 比较简单，按照如下配置一个飞行表就可以。

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202202221533190.png)
