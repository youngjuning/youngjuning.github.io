---
title: WebIDE 调研与实践
date: 2022-03-19 18:00:00
---

# WebIDE 概述

## WebIDE 介绍

WebIDE 是基于 H5 支持多语言的在线集成开发环境。相较于传统的本地 IDE，WebIDE 是开箱即用的，你不用配置 git 环境、node 环境、react 环境甚至 React Native 环境

## WebIDE 发展与现状

- Gitlab ide
- Github ide
- CodeSandbox
- Cloud Studio：可以理解为国产 CodeSandbox

## WebIDE 通用架构

编辑器 + 插件商店 + 代码管理 + Server

# 基于 code-server 搭建 WebIDE 平台 @洛竹


code-server 是一个免费的基于浏览器的 IDE，它是基于 vscode 封装的跨平台 IDE。

## 部署

### 安装 nodejs

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

### 安装 code-server

```sh
curl -fsSL https://code-server.dev/install.sh | sh
```

执行下面的命令以支持 systemd 方式启动并开始开机自启动：

```sh
sudo systemctl enable --now code-server@$USER
```

或者你不需要后台服务，你可以执行下面的命令：

```sh
code-server
```

### nginx 反向代理

# 基于 monaco-editor 实现 WebIDE @锐文

# 基于 Theia 搭建 WebIDE 平台 @利民

# 横向比较、展望、建议、思考

## 参考

- [要实现一个Web IDE 需要哪些前端技术？](https://www.zhihu.com/question/41050429)
- [WebIDE 使用指南 - 阿里云](https://developer.aliyun.com/article/646273)
- [网络IDE - GitLab](https://docs.gitlab.com/ee/user/project/web_ide/)
- [What is CodeSandbox](https://www.youtube.com/watch?v=lfYo4mfOyM8)
- [如何在团队快速落地 WebIDE](https://juejin.cn/post/7008428269317914661)
