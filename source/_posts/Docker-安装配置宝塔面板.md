---
title: Docker 安装配置宝塔面板
description: 宝塔 Linux 面板是提升运维效率的服务器管理软件，支持一键 LAMP/LNMP/集群/监控/网站/FTP/数据库/JAVA 等 100 多项服务器管理功能。
date: 2023-04-18 17:19:26
categories:
  - 运维
tags:
  - Docker
  - 宝塔
  - Linux
  - LAMP
  - LNMP
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

## 宝塔面板是什么？

宝塔 Linux 面板是提升运维效率的服务器管理软件，支持一键 LAMP/LNMP/集群/监控/网站/FTP/数据库/JAVA 等 100 多项服务器管理功能。有 30 个人的专业团队研发及维护，经过 200 多个版本的迭代，功能全，少出错且足够安全，已获得全球百万用户认可安装。运维要高效，装宝塔。

![](https://www.bt.cn/Public/images/linux_pc_free.png)

## 为什么使用 Docker 安装？

1. 环境隔离，一个主机可以部署多套服务
2. 宝塔对主机控制度较高，依赖关系复杂，而 Docker 可以保证宝塔服务不影响到宿主机其他服务。
3. 由于和宿主机环境隔离，不容易被木马工具。
4. 宝塔面板的兼容性顺序为 `Centos7.x > Debian10 > Ubuntu 20.04 > Centos8.x > Ubuntu 18.04 > 其它系统`，而用户的主机五花八门，为了获取最佳的兼容性，使用 Docker 部署是不二选择。
5. Docker 管理成本低，方便迁移。
6. 可随时管理容器，无需重置服务器。

## Docker 安装

推荐使用脚本安装：

```sh
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh --mirror Aliyun
```

安装成功后，会自动启动 Docker 服务。用户可以使用 `systemctl is-enabled docker` 来确认 Docker 服务是否是开机自启动。如果不是请使用 `systemctl enable docker` 设置自启动。

**代理加速**

执行 `nano /etc/docker/daemon.json` 中写入如下内容：

```json
{
  "registry-mirrors": [
    "https://registry.docker-cn.com",
    "https://mirror.baidubce.com",
    "https://hub-mirror.c.163.com"
  ]
}
```

## 开端口教程，不开不能用

> 宝塔需要的端口：8888、888、20、21、80、443

- 腾讯云：https://www.bt.cn/bbs/thread-1229-1-1.html
- 阿里云：https://www.bt.cn/bbs/thread-2897-1-1.html
- 华为云：https://www.bt.cn/bbs/thread-3923-1-1.html
- 京东云：https://docs.jdcloud.com/cn/virtual-machines/configurate-inbound-rules

## 安装宝塔镜像

```sh
curl -fsSL https://youngjuning.js.org/shell/baota/install.sh | sh
```

- `/www/wwwroot` 挂载在宿主机的 `~/wwwroot` 目录
- `/www` 挂载在 `baota_www` volume，即 `/var/lib/docker/volumes/baota_www/`

> 上面的脚本是为了我为了方便管理，等价于 `docker run -tid --name baota --net=host --privileged=true --shm-size=1g --restart always -v baota_www:/www -v ~/wwwroot:/www/wwwroot pch18/baota`

### 登录方式

- 登陆地址：`http://{{面板ip地址}}:8888`
- 初始账号：`username`
- 初始密码：`password`

### 宝塔面板命令行

**进入容器：**

```sh
docker exec -it baota bash
```

**执行 `bt` 进行交互式操作：**

```sh
[root@bebc0d8e35b1 wwwroot]# bt
===============宝塔面板命令行==================
(1) 重启面板服务           (8) 改面板端口
(2) 停止面板服务           (9) 清除面板缓存
(3) 启动面板服务           (10) 清除登录限制
(4) 重载面板服务           (11) 取消入口限制
(5) 修改面板密码           (12) 取消域名绑定限制
(6) 修改面板用户名         (13) 取消IP访问限制
(7) 强制修改MySQL密码      (14) 查看面板默认信息
(22) 显示面板错误日志      (15) 清理系统垃圾
(23) 关闭BasicAuth认证     (16) 修复面板(检查错误并更新面板文件到最新版)
(24) 关闭谷歌认证          (17) 设置日志切割是否压缩
(25) 设置是否保存文件历史副本  (18) 设置是否自动备份面板
(0) 取消
===============================================
```

## 进阶配置

1. 登录面板后，请立即修改面板用户和面板密码，并建议修改面板端口和安全入口。
2. 更新的话，可以使用面板提供的功能进行修复。

## 备份宝塔面板

### 备份容器

如果我们迁移的话，不需要再重复上面的安装配置步骤，直接使用我提供的脚本：

```sh
curl -fsSL https://youngjuning.js.org/shell/baota/backup.sh | sh
```

压缩包 `baota.tar` 将备份到当前目录，上传到新的服务器之后载入容器：

```sh
docker load -i baota.tar
```

恢复容器：

```sh
curl -fsSL https://youngjuning.js.org/shell/baota/restore.sh | sh
```

## 已知问题

1. 部分机器初始化环境可能某些端口被占用，比如 80 端口被占用，使用 `netstat -lnp|grep 80` 查看进程 PID，然后使用 `kill -9 XXXX` 结束该进程 (xxxx 为进程的相关 pid)。
2. 如果事先安装了 nginx，请先卸载，完全卸载请执行 `curl -fsSL https://youngjuning.js.org/shell/nginx/uninstall.sh | sh`
