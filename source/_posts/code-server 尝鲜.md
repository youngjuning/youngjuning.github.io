---
title: 基于 code-server 实现 WebIDE 的探索
date: 2022-03-19 18:00:00
description: WebIDE 是基于 H5 支持多语言的在线集成开发环境。相较于传统的本地 IDE，WebIDE 是开箱即用的，你不用配置 git 环境、node 环境、react 环境甚至 React Native 环境。
cover: https://s2.loli.net/2022/03/28/gcfxtdC7vX3pHQe.png
categories:
  - 前端
tags:
  - vscode
  - ide
  - code-sever
  - webide
  - nodejs
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>


## WebIDE 概述

### WebIDE 介绍

WebIDE 是基于 H5 支持多语言的在线集成开发环境。相较于传统的本地 IDE，WebIDE 是开箱即用的，你不用配置 git 环境、node 环境、react 环境甚至 React Native 环境。

### WebIDE 发展与现状

- 基于 [CodeMirror](https://codemirror.net/) 和 [Ace](https://ace.c9.io/) 实现编辑器部分，其余部分自己实现
- 以 [CodeSandbox](https://codesandbox.io/) 为代表的的在线代码编辑器服务，私有部署较麻烦
- [Gitlab ide](https://gitlab.com/youngjuning/react)：集成在 Gitlab 中的 IDE
- [Github ide](https://github.com/facebook/react/)：基于 vscode 实现的与 github 结合的 IDE，限制是命令行使用有限制，
- [Cloud Studio](https://codingcorp.cloudstudio.net/ws/qmbngm)：可以理解为国产 CodeSandbox，以前是基于 Ace 做的，现在也改成了基于 vscode，自定义功能通过 vscode 的插件体系来做

通过比对市场上常见的 WebIDE 产品，我们能发现趋势都趋于统一了，就是依托 vscode 强大的能力来实现的，扩展能力也是基于 vscode 来实现。

### WebIDE 通用架构

![紫升](https://s2.loli.net/2022/03/23/UfjaX4QpTmg5MKu.png)

### WebIDE 的优势

- 在具有一致开发环境的任何设备上编写代码
- 使用云服务器加速测试、编译、下载等来节省旅途中的笔记本电量
- 所有密集型任务都在您的服务器上运行，节省笔记本内存

### 工程化意义

- 安全性：服务部署在内网，完全不用担心安全问题，且插件服务也可以内网部署。
- 规范性：通过定制编辑器，我们可以规范开发阶段的流程与环境
- 提效性：通过实时预览技术，可以实现开发阶段通过 mock 数据即可预览面板。另外由于是针对 OS 业务定制，所以开发套件都是定制好的，开发只需要关心代码
- 平台化：可以和内部任何平台打通交互，比如一键打包、一键发布

## 基于 code-server 搭建 WebIDE 平台

code-server 是一个免费的基于浏览器的 IDE，它是基于 vscode 封装的跨平台 IDE。

### 部署

#### 安装 nodejs

**安装源**

```sh
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
```

**安装 nodejs**

```sh
sudo apt-get install -y nodejs
```

**更新 npm**

```sh
sudo npm install -g npm
```

#### 安装 code-server

```sh
curl -fsSL https://code-server.dev/install.sh | sh
```

执行下面的命令以支持 systemd 方式启动并开始开机自启动：

```sh
sudo systemctl enable --now code-server@$USER
```

之后如果修改了配置文件，就可以使用 `sudo systemctl restart code-server@$USER` 重启服务。

或者你不需要后台服务，你可以执行下面的命令：

```sh
code-server
```

#### nginx 反向代理

安装 nginx：

```sh
sudo apt update
sudo apt install -y nginx
```

```sh
server {
    listen 80;
    listen [::]:80;
    server_name mydomain.com;

    location / {
      proxy_pass http://localhost:8080/;
      proxy_set_header Host $host;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection upgrade;
      proxy_set_header Accept-Encoding gzip;
    }
}
```

## 扩展阅读

- [要实现一个Web IDE 需要哪些前端技术？](https://www.zhihu.com/question/41050429)
- [WebIDE 使用指南 - 阿里云](https://developer.aliyun.com/article/646273)
- [网络IDE - GitLab](https://docs.gitlab.com/ee/user/project/web_ide/)
- [What is CodeSandbox](https://www.youtube.com/watch?v=lfYo4mfOyM8)
- [如何在团队快速落地 WebIDE](https://juejin.cn/post/7008428269317914661)
- [Ubuntu 安装最新版本 Node.js](https://learnku.com/articles/42581)
- [腾讯云登录Root用户](https://www.jianshu.com/p/648c48f146c6)
- [写给前端的Linux实战教程](https://youngjuning.js.org/21bdf0b4bd15/)
