---
abbrlink: ''
categories: []
cover: ''
date: '2023-07-07T13:39:05.142677+08:00'
description: ''
excerpt:    
tags: []
title: Mac 切换 github 账号
updated: 2023-7-7T13:39:47.10+8:0
---
> github提交的账户信息包括两部分 ：`git commit` 时日志中记录的用户名和邮箱信息、`git push`提交到远程时的账号密码验证信息。必须两者同时切换才能实现完美的切换账号的目的

## 删除钥匙串

打开"钥匙串访问“。在右上方搜索 git，找到所有 github 相关的账号信息。按删除键，删除所有名称为 github.com 的条目。放心，这个不会影响 Chrome 浏览器保存的用户名和密码。
