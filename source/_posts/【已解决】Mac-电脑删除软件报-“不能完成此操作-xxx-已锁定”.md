---
title: 「已解决」Mac 电脑删除软件报 “不能完成此操作,xxx 已锁定”
date: 2023-03-16 23:15:12
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678980508682.png
description: 很多公司的内网 VPN 软件都是需要管理员权限才能安装的，但是有时候我们需要卸载这些软件，但是卸载的时候会报错，不能完成此操作，xxx 已锁定，这个时候我们就需要使用终端来卸载这些软件了。
categories:
  - Mac
tags:
  - Mac
  - VPN
  - 卸载软件
  - 终端
  - 苹果电脑
---

公司用的 VPN 在前一段时间强制给电脑添加了全屏水印，但是我的个人电脑为了随时支持，也安装了内网 VPN，这个水印是不能去掉的，所以我就想着卸载这个软件，但是卸载的时候就报错了，不能完成此操作，xxx 已锁定，这个时候我们就需要使用终端来卸载这些软件了。

![不能完成此操作,xxx 已锁定](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678980050589.png)

# 第一步

> 注意：请替换 xxx 为要删除的 app

```sh
/bin/ls -dleO@ /Applications/xxx.app
```

# 第二步

> 注意：请替换 xxx 为要删除的 app

```sh
sudo /usr/bin/chflags -R noschg /Applications/xxx.app
```

这两行命令执行完后，发现 logo 上的小锁消失了，于是开开心心的单击右键，移除，解决。

# 第三步

卸载了之后，这流氓软件还是会存在一个杀不死的 xxxAgent 进程，真是醉了。脑残的安全部门，不能给个一键卸载的选项吗？

参考 [mac 解决kill无法强制杀死后台程序的问题](https://www.jianshu.com/p/68014c7e5210)，直接删除文件夹，恼人的水印就没有了。

```sh
sudo rm -rf /opt/.yunshu/
```
