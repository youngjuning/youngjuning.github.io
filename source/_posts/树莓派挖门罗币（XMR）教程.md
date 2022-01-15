---
title: 树莓派挖门罗币（XMR）教程
date: 2022-01-14 15:19:34
cover: https://cdn.jsdelivr.net/gh/youngjuning/images/202201141706560.png
categories:
  - 区块链
tags:
  - 树莓派
  - Monero
  - XMR
  - 挖矿
---

## 超频

### 修改配置

将 SD 卡使用读卡器接入电脑，打开 windows 下可见分区 Boot，打开 `config.txt`

![](https://s2.loli.net/2022/01/16/7aKoCeuMYphESnk.png)

```txt
arm_freq=1400
over_voltage=4
```

- `arm_freq=1400` 表示将 CPU 频率调节至 1400MHz(1.4GHz),假如你想调至 1.3G，将 1400 改为 1300 即可。
- `over_voltage=4` 为增加电压，范围：0~6；初始电压 1.2V，每增加 1 提高 0.025V

如果你还想超频 GPU，在末尾加上：

```txt
gpu_freq=450
```

默认 GPU 频率为 400MHz。

### 稳定性测试

打开终端，输入：

```sh
$ sudo apt-get install sysbench
```

然后输入：

```sh
$ sysbench --num-threads=4 --test=cpu --cpu-max-prime=20000 run
```

来运行测试

打开一个新的终端，输入：

```sh
$ sudo cat /sys/devices/system/cpu/cpu2/cpufreq/cpuinfo_cur_freq
```

如果返回 `1400000`，则超频成功。

## 安装编译工具

```sh
$ sudo apt-get install git build-essential cmake libuv1-dev libssl-dev libhwloc-dev
```

## 获取源码

```sh
$ git clone https://github.com/xmrig/xmrig.git
```

## 构建程序

```
$ mkdir xmrig/build
$ cd xmrig/build
$ cmake ..
$ make -j4
```

## 选择矿池

- 2miners: https://2miners.com/zh/xmr-mining-pool
- minexmr: https://minexmr.com/
- nanopool: https://xmr.nanopool.org/
- SupportXMR：https://supportxmr.com/#/home

## 注册门罗币钱包

- [币安](https://www.binance.com/zh-CN/my/wallet/account/main/deposit/crypto/XMR)
- [欧易](https://www.okex.com/balance/recharge/xmr)

## 运行程序

要运行 Monero 矿机，只需运行：

```sh
$ ./xmrig -o xmr.2miners.com:2222 -u 87gCYA9EemtThn9NBxgvXKbXiggT1r4T5Pezq8myvAaHep2hsVnk5veABZKhi4PcAuAJ4pA5nqg6wEhfNhGxDcQJ87Ugt5G -k --coin monero --proxy=127.0.0.1:1090
```

## 开机自启动

假设，`xmrig` 可执行文件位于 `/home/pi/xmrig/build/` 中，并且您有一个正确的 `config.json` 文件。

1. 在终端运行“chmod +x /home/pi/xmrig/build/xmrig”
2. 在终端运行“touch /home/pi/xmrig.log”
3. 在终端运行“sudo nano /lib/systemd/system /xmrig.service"
4. 粘贴以下配置

```
[Unit]
Description=PiMiner
After=multi-user.target

[Service]
Type=idle
ExecStart=/usr/bin/ds64-run /home/pi/xmrig/build/xmrig -c -B --log-file="/home/pi/xmrig.log"

[Install]
WantedBy=multi-user.target
```

6. 在终端运行 `sudo systemctl daemon-reload`
7. 在终端运行 `sudo systemctl enable xmrig`
8. 重启 pi (`sudo reboot now`) 或在终端运行 `sudo systemctl start xmrig`

## 参考

- [How to mine Monero and compile XMRig on a Raspberry Pi 4! CPU Mining in 2021!](https://blockforums.org/topic/1257-how-to-mine-monero-and-compile-xmrig-on-a-raspberry-pi-4-cpu-mining-in-2021/)
- [Xmrig on Raspberrypi OS 32-bit](https://forums.raspberrypi.com/viewtopic.php?t=305983)
- [讲讲如何用树莓派挖矿以及其可行性？](http://www.ethospool.com/kuaixun/282917.html)
- [门罗币挖矿：关于如何开采门罗币的完整指南](https://cn.bitdegree.org/crypto/jiao-cheng/menluobi-wakuang)

## 树莓派写真

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202201141600885.png)

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202201141702527.png)

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202201141706560.png)

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202201141746792.png)
