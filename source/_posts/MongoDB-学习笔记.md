---
title: MongoDB 学习笔记
date: 2022-04-12 16:55:53
cover:
categories:
  - 全栈开发
tags:
  - MongoDB
---

# MongoDB 介绍

一个面向文档对象的数据库。

# 管理 MongoDB

## 安装 MongoDB

首先确保你的包是最新的：

```shell
sudo apt update && sudo apt upgrade -y
```

然后安装 MongoDB：

```shell
sudo apt install mongodb
```

检查 mongodb 服务的状态：

```shell
sudo systemctl status mongodb
```

![](https://s2.loli.net/2022/04/13/YX7SqhNajgwHuZv.png)

可以看到，服务正常启动了。

## 管理 MongoDB

### 服务状态管理

MongoDB 目前是一个 `systemd` 服务，因此我们使用 `systemctl` 来检查和修改它的状态，使用以下命令：

- 查看运行状态：`sudo systemctl status mongodb`
- 停止服务状态：`sudo systemctl stop mongodb`
- 启动服务状态：`sudo systemctl start mongodb`
- 重启服务状态：`sudo systemctl restart mongodb`
- 启用开机自启动：`sudo systemctl enable mongodb`
- 禁用开机自启动：`sudo systemctl disable mongodb`

### 配置管理

- 查看配置文件：`sudo nano /etc/mongodb.conf`

### 日志管理

- 查看日志：`sudo journalctl -u mongodb`
- 查看错误日志：`sudo journalctl -u mongodb --no-pager -n 100 -f | grep -i error`
- 查看警告日志：`sudo journalctl -u mongodb --no-pager -n 100 -f | grep -i warning`
- 查看提示日志：`sudo journalctl -u mongodb --no-pager -n 100 -f | grep -i notice`

### 卸载 MongoDB

```shell
$ sudo systemctl stop mongodb
$ sudo apt purge mongodb
$ sudo apt autoremove
```

## 远程管理 MongoDB

默认无法远程访问 MongoDB，我们需要先在服务器安全组中开放 `27017` 端口，然后再进行配置：

```shell
$ sudo /etc/mongodb.conf
```

修改  `bind_ip = 0.0.0.0` 为 `bind_ip = 0.0.0.0`，然后重启服务：

```shell
$ sudo systemctl restart mongodb
```

安装 [Studio 3T for Free](https://studio3t.com/free)，然后连接：

![](https://s2.loli.net/2022/04/13/tUBEgnVpSAc715F.png)

## 安全管理

默认我们不需要认证即可连接 MongoDB，这是很危险的，我们需要设置一个管理员用户来认证：

```shell
mongo
> use admin
> db.createUser({user:"admin", pwd:"123456", roles:[{role:"userAdminAnyDatabase", db:"admin"}]})
```

然后配置 MongoDB 的安全策略：

```shell
$ sudo nano /etc/mongodb.conf
```

将 `security.authorization = enabled` 写入文件，然后重启服务：

```shell
sudo systemctl restart mongodb
```

在 Studio 3T 中配置用户名密码即可，需要注意的是 Authentication DB 需要填写对应的。

![](https://s2.loli.net/2022/04/13/fLhd9t1sZ8KTaRA.png)

# 参考链接

- [如何在 Ubuntu 上安装 MongoDB](https://zhuanlan.zhihu.com/p/76349679)
