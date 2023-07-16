---
categories:
- 工具
cover: ''
date: '2023-07-07T13:39:05.142677+08:00'
description: 本文详细讲述了如何在 Mac 环境下 切换 github 账号
tags:
- mac
- github
title: Mac 切换 github 账号
---
github 提交的账户信息包括两部分 ：`git commit` 时日志中记录的用户名和邮箱信息、`git push`提交到远程时的账号密码验证信息。必须两者同时切换才能实现完美的切换账号的目的

## 删除钥匙串

打开"钥匙串访问“。在右上方搜索 git，找到所有 github 相关的账号信息。按删除键，删除所有名称为 github.com 的条目。放心，这个不会影响 Chrome 浏览器保存的用户名和密码。

## 执行命令

```bash
cp ~/.gitconfig ~/.gitconfig_a
cp ~/.gitconfig ~/.gitconfig_b
```

在 `gitconfig\_a` 和 `gitconfig\_b` 两个文件中分别填写提交日志的用户信息。

## 切换账号

需要用 `user\_a` 的时候：

```bash
cp ~/.gitconfig_a ~/.gitconfig
```

然后执行 `git push` 输入 `a` 的登录信息即可以提交。

## zsh 设置alias

在 `~/.zshrc` 添加别名

```bash
alias cg="cat ~/.gitconfig"
alias cga="cp ~/.gitconfig_a ~/.gitconfig"
alias cgb="cp ~/.gitconfig_b ~/.gitconfig"
```

然后保存后执行 `source ~/.zshrc` 使之生效。

以后每次想切换时即可先用 `cg` 命令查询当前账户，根据情况执行 `cga` 或 `cgb` 切换账户。
