---
title: 静态博客管理器 qexo 搭建指南
description: 'Qexo 是一个美观、强大的在线静态博客管理器'
date: 2023-07-16 19:06:44
categories:
  - 站点运营
tags:
  - hexo
  - vuepress
  - qexo
---

## 部署

你可以通过 Vercel 提供的免费数据库。但请注意这是个 Beta 功能

{% btn https://vercel.com/new/clone?repository-url=https://github.com/am-abudu/Qexo, 一键部署 %}

首次部署会报错, 请无视并进行接下来的步骤

### 申请 Vercel 数据库

进入 [Vercel Storage](https://vercel.com/dashboard/stores) 界面 然后点击右上角的 Create Database 并选择 Postgres 创建免费 PostgreSQL 数据库, 在 Connect 页面获取数据库连接信息。请注意在地区选择的位置选择与你上一步项目对应的地区（通常为 Washington, D.C., USA (East) - iad1）。

### 绑定项目

在左侧边栏选择 Projects 点击 Connect Project 连接到你第一步创建的项目

### 部署

回到你的项目页面，在 Deployments 点击 Redeploy 开始部署, 若没有 Error 信息即可打开域名进入初始化引导

## 初始化

部署成功后，打开域名进入初始化引导：

![初始化 qexo](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1689507026731.png)

### 博客配置

![博客配置](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1689507164192.png)

- 服务商：github/gitlab/本地
- 使用配置：Hexo/Hugo/Valaxy/Vuepress/Vitepress
- Github 密钥：于 [Github 设置](https://github.com/settings/tokens) 生成的 Token (建议使用 Classical) 需要 Repo & Workflow 下的权限 不建议给出所有权限
- Github 仓库
- 项目分支
- 博客路径

### Vercel 配置

![Vercel 配置](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1689507547316.png)

- Vercel 密钥：您的 Vercel 账户密钥 在 [此处](https://vercel.com/account/tokens) 生成
- 项目ID：您 Qexo 部署所在项目的 ID 位于 Project Settings -> General -> Project ID

## 图床设置

点击后台右上角设置按钮，进入设置页

![设置页面](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1689508911802.png)

滑动到图床设置部分：

![图床设置](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1689508861897.png)

- 图床类型: 远程 API
- API 地址: https://sm.ms/api/v2/upload
- POST 参数名: `smfile`
- JSON 路径: `data.url`
- 自定义请求头: `{"Authorization": "sm.ms 密钥"}`

> sm.ms 密钥在 https://smms.app/home/apitoken 生成
