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

## 树莓派写真

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202201141600885.png)

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202201141702527.png)

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202201141706560.png)

![](https://cdn.jsdelivr.net/gh/youngjuning/images/202201141746792.png)
