---
title: ALPH ETH 双挖指南
date: 2022-01-30 18:43:27
cover: https://s2.loli.net/2022/01/30/wYA7vOMxEJFHBp9.png
categories:
  - 区块链
tags:
  - ALPH
  - Alephium
hide: true
---

## Alephium 是什么？

Alephium 是第一个在比特币核心技术、工作证明和 [UTXO](https://en.wikipedia.org/wiki/Unspent_transaction_output) 上进行扩展和改进的实时 Layer 1 区块链。它提供了一个高性能、安全的 DeFi 和 dApps 平台，并提高了能源效率。

从其技术设计到其界面，Alephium 的创建旨在解决当今去中心化应用程序遇到的可访问性、可扩展性和安全性挑战。

## 矿池

> 统计时间：北京时间 2022 年 1 月 30 日

| 矿池                                              | 费率   | 最低起付 | 付款频率   | 出块  |
| ------------------------------------------------- | ------ | -------- | ---------- | ----- |
| [HeroMiners](https://alephium.herominers.com/)    | 0%     | 1 א      | 每 1 小时  | 116278  |
| [Metapool](https://metapool.tech/)                | 0.75% | 1 א      | 每 1 小时  | 91860 |
| [Devgent pool](https://pool.devgent.net/mining)   | 1%     | 1 א      | 自有钱包   | 81764 |
| [WoolyPooly](https://woolypooly.com/zh/coin/alph) | 1.9%   | 1 א      | 达到起付额 | 73552 |

## 交易所

目前只有 [gate.io](https://www.gate.io/cn/myaccount/deposit/ALPH) 支持了 ALPH 代币。

## ETH + Alephium 双挖

[T-rex 0.25.2](https://github.com/trexminer/T-Rex/releases/tag/0.25.2) 开始支持了 ETH+ALPH 双挖（默认 ETH 68% / ALPH 32%）。实测 3060ti lhr 可以 ETH 可以达到 45 MH/s，ALPH 算力可以达到 400 MH/s。

### 脚本

```bash
t-rex.exe -a ethash --lhr-algo blake3 -o stratum+ssl://asia-eth.2miners.com:12020 -u nano_131cbg1qzxc6hye1iqd1duocmoxdjwthr1bmksnbfqcf8cq5hu8tf7krwp69 -p x -w luozhu001 --url2 stratum+tcp://hk.alephium.herominers.com:1199 --user2 19MiefHwqpTq5sgKkpQpA88XNubMiTeN4iQnmvhi4JNxA --pass2 x --proxy 127.0.0.1:1090
pause
```

### 超频

我用的是旺财矿工的超频设置工具，如果你也用旺财矿工可以参考我的配置，其中显存设置为 1300 和 1800 那两张卡是因为卡体质问题，分别对应三风扇技嘉和两风扇华硕。

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202202081359496.png)

## 收益对比

![](https://s2.loli.net/2022/02/08/rxcSawMsAQBbmpk.png)

## 相关链接

- [Alephium Explorer](https://explorer.alephium.org/)
- [gate.io](https://www.gate.io/cn/myaccount/deposit/ALPH)
- [3060tilhr hashrate](https://www.hashrate.no/3060tilhr)
- [coinmarketcap](https://coinmarketcap.com/zh/currencies/alephium/)
