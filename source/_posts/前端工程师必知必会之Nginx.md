---
title: 前端项目管理工具实践
date: 2020-04-27 13:26:48
categories:
  - [项目管理]
tags:
  - ubuntu
---

![](https://i.loli.net/2020/03/28/4l3JmCqEgAYWPfO.jpg)

<!--more-->

## Nginx

### 安装 Nginx

```shell
$ sudo apt-get install nginx
```

Ubuntu安装之后的文件结构大致为：

- 所有的配置文件都在 `/etc/nginx` 下，并且每个虚拟主机已经安排在了 `/etc/nginx/sites-available` 下
- 程序文件在 `/usr/sbin/nginx`
- 日志放在了 `/var/log/nginx` 中
- 并已经在 `/etc/init.d/` 下创建了启动脚本 nginx
- 默认的虚拟主机的目录设置在了 `/var/www/nginx-default ` (有的版本 默认的虚拟主机的目录设置在了 `/var/www`, 请参考 `/etc/nginx/sites-available` 里的配置)

### 启动 Nginx 服务

```shell
$ systemctl start nginx.service
```

然后就可以访问了，http://localhost/ ， 一切正常！如果不能访问，先不要继续，看看是什么原因，解决之后再继续。 启动时候若显示端口`80`被占用： `Starting nginx: [emerg]: bind() to 0.0.0.0:80 failed (98: Address already in use) `修改文件：`/etc/nginx/sites-available/default`,去掉 `listen` 前面的 `#` 号 , `#` 号在该文件里是注释的意思 , 并且把 `listen` 后面的 `80` 端口号改为自己的端口，访问是需要添加端口号。

（安装完后如出现403错误，那可能是nginx配置文件里的网站路径不正确）

### 管理虚拟主机

```shell
$ cp /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default.conf
$ rm -rf /etc/nginx/sites-enabled/default
$ systemctl restart nginx.service
```

## OpenProject 开源项目管理系统

> - openproject中文网: http://www.openproject.org.cn/
> - GitHub: https://github.com/opf/openproject

OpenProject 是一个基于 Ruby on Rails的在线项目管理系统。遵守GPL开源协议，OpenProject 拥有完善的文档，API，及丰富的功能，可以为项目团队提供整个项目生命周期的支持，OpenProject 功能包括： 工作跟踪，项目时间线，团队维基，论坛。通过插件可以支持：协同项目计划，进度报告，任务管理，时间和成本报告，Scrum流程支持等。
