---
title: 使用Docker安装配置Jenkins
date: 2020-05-08 18:16:43
categories:
  - [运维,Jenkins]
tags:
  - android
---

Docker 安装配置请参考我的另一篇文章: https://juejin.im/post/5e839f2851882573ab44f1b4#heading-11

## 安装Jenkins

```shell
$ docker run -d \
	 -u root \
	 -p 8080:8080 -p 50000:50000 \
	 -v jenkins_home:/var/jenkins_home \
	 -e PLUGINS_FORCE_UPGRADE=true \
	 -e TRY_UPGRADE_IF_NO_MARKER=true \
	 -e JAVA_OPTS=-Duser.timezone=Asia/Shanghai \
	 --name jenkins \
	 --restart always \
	 jenkins/jenkins
```

需要更多定制参数你可以参考 [https://github.com/jenkinsci/docker](https://github.com/jenkinsci/docker)

## Nginx 反向代理

我没有域名，所以我的配置是基于端口的，你可以查看[官方文档](https://github.com/jenkinsci/docker/blob/master/README.md) 获取更多方案：

```nginx
server {
	listen 8882;
	server_name _;

	location / {
		proxy_set_header        Host $host:$server_port;
		proxy_set_header        X-Real-IP $remote_addr;
		proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header        X-Forwarded-Proto $scheme;

		# Fix the "It appears that your reverse proxy set up is broken" error.
		proxy_pass          http://127.0.0.1:8080;
		proxy_read_timeout  90;

		# Required for new HTTP-based CLI
		proxy_http_version 1.1;
		proxy_request_buffering off;
	}
}
```

## 初始化jenkins

1、执行`cat /var/lib/docker/volumes/jenkins_home/_data/secrets/initialAdminPassword`，获取**管理员密码**

2、启动完jenkins后通过浏览器输入地址`http://部署jenkins主机IP:端口`

<img src="https://i.loli.net/2020/04/10/YtRrWTZVQc7Mma3.png" style="zoom:75%;" />

3、选择安装插件方式，这里我是默认第一个：

<img src="https://i.loli.net/2020/04/10/IBlrbMFusXmdeA5.png" style="zoom:75%;" />

4、进入插件安装界面，连网等待插件安装：

<img src="https://i.loli.net/2020/04/10/gimNZtUID5YjK9f.png" style="zoom:75%;" />

5、安装完插件后，进入创建管理员界面：

<img src="https://i.loli.net/2020/04/10/SxvtAW3McBCqTEX.png" style="zoom:75%;" />

## 基于角色的认证策略

1. 请确保在 **系统管理** -> **插件管理** 中安装了**Role-based Authorization Strategy**  插件！！

2. 在 **系统管理** -> **安全** -> **全局安全设置** 中的 **授权策略** 配置项中选择 **Role-Based Strategy**

   ![](https://i.loli.net/2020/05/09/FiR59LEtqwCbDIh.png)

3. 然后就可以在 `Manage and Assign Roles` 中管理角色

## 全局工具配置

### JDK

> 自动安装请先到Oracle注册账号

![](https://i.loli.net/2020/05/09/jbzQ15qthxmTu9Z.png)

### Git

> 需要先执行 `apt install git` 安装git，然后通过 `which git` 查看 git 安装位置！

![](https://i.loli.net/2020/05/09/lLSYIN5FARQ38uH.png)

### NodeJS

> 需要先需要安装 [NodeJS Plugin](https://plugins.jenkins.io/nodejs) 插件

![](https://i.loli.net/2020/05/09/B9R7pgIXd5OSCbq.png)

## Android 打包环境

### 安装 android-sdk、sdkmagager

```shell
$ apt update | apt install android-sdk
$ apt install snapd
$ snap install androidsdk
```

### 复制android-sdk到 jenkins volume

```shell
$ cp -R /usr/lib/android-sdk/ /var/lib/docker/volume/jenkins_home/_data/
```

android-sdk 的安装位置可以通过 `adb --version` 查看：

<img src="https://user-gold-cdn.xitu.io/2020/5/9/171f7fae7cf4ff7a?w=864&h=230&f=png&s=176444" alt="" style="zoom: 75%;" />

### 设置环境变量

将下面的的配置加入到 `~/.bash_profile` 或 `~/.zshrc` 中，并执行 `srouce ~/.bash_profile` 或 `srouce ~/.zshrc`：

```
export ANDROID_HOME=/var/lib/docker/volumes/jenkins_home/_data/android-sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator
```

### accepted licences

> 如果不授权会报错： Failed to install the following Android SDK packages as some licences have not been accepted.

```shell
$ yes | sdkmanager --sdk_root=${ANDROID_HOME} --licenses
```

> 如果不指定 `--sdk_root=${ANDROID_HOME}` 会报错：[SDKmanager : Warning: Could not create setting. java.lang.IllegalArgumentException](https://stackoverflow.com/questions/60730615/sdkmanager-warning-could-not-create-setting-java-lang-illegalargumentexcepti)

### 设置 Jenkins ANDROID_HOME

进入 **系统管理** -> **系统配置** -> **全局属性** 新增环境变量 `ANDROID_HOME`：

![](https://i.loli.net/2020/05/09/jWANFZh8xCD1Sgm.png)

## GitHub Plugin

这个插件的作用是集成 GitHub 到 Jenkins

### 获取 GitHub 的 Personal access token

> **GitHub 主页** -> **Settings** -> **Developer settings** -> **Personal access tokens**

![](https://i.loli.net/2020/05/09/qTLBC359Z2rNday.png)

### 添加Github服务器

> **系统管理** -> **系统设置** -> **GitHub** -> **添加Github服务器**

这里的名称随便填，API URL 填写 `https://api.github.com/`：

![](https://i.loli.net/2020/05/09/1FLEfTHhpexyXQW.png)

凭证类型选 `Secret text`：

![](https://i.loli.net/2020/05/09/3Oypr4xniKZamG9.png)

在凭据选上刚刚你添加的，勾上管理 Hook，点击“连接测试”，成功之后如下所示：

![](https://i.loli.net/2020/05/09/pBWKZMfq5IkGvyz.png)

### 配置 GitHub 的 webhook 地址

webhook 是通知 Jenkins 时的请求地址，用来填写到 GitHub 上，这样 GitHub 就能通过该地址通知到 Jenkins

假设Jenkins所在服务器的地址是：192.168.0.1，端口为8080，那么webhook地址就是 `http://192.168.0.1:8080/github-webhook/`

![image-20200509175614040](https://i.loli.net/2020/05/09/dU7AeiX13mWHqTp.png)

在 Payload URL 位置填入 webhook 地址，再点击底部的 Add webhook 按钮，这样就完成 webhook 配置了，今后当前工程有代码提交，GitHub 就会向此 webhook 地址发请求，通知 Jenkins 构建：

![](https://i.loli.net/2020/05/09/BqoXjUQsile3K7A.png)

### 任务配置

- 构造触发器选择：GitHub hook trigger for GITScm polling

  ![](https://i.loli.net/2020/05/09/EF5DYKJHgOPayxA.png)

- 构建环境和绑定

  如下图所示，勾选 Use secret text(s) or file(s)，下面的”凭据”选择我们之前配置过的凭证

  ![](https://i.loli.net/2020/05/09/2noTEULmhAzd7Dg.png)

## 常见问题

### 修改默认时区为上海时区

在 **系统管理** -> **脚本命令行** 里运行 `System.setProperty('org.apache.commons.jelly.tags.fmt.timeZone', 'Asia/Shanghai')`

## 联系作者

|                           作者微信                           |                           知识星球                           |                           赞赏作者                           |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="https://user-gold-cdn.xitu.io/2020/2/24/17074acbb24c7412?w=200&h=200&f=jpeg&s=17183" style="width:200px"/> | <img src="https://user-gold-cdn.xitu.io/2020/2/24/17074acbb26af8e1?w=200&h=200&f=png&s=39093" style="width:200px"/> | <img src="https://user-gold-cdn.xitu.io/2020/2/24/17074acbb338c643?w=698&h=700&f=png&s=315492" style="width:200px"/> |