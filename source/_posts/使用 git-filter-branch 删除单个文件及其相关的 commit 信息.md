---
title: 使用 git-filter-branch 删除单个文件及其相关的 commit 信息
date: 2020-11-15 19:55
description: 对于程序员来说，公司就像是工地，代码就是我们的钢筋水泥。那在工地什么最重要呢？没错就是安全生产。本文要讨论的是开发中的合规安全。
categories:
  - 工具
tags:
  - git
  - git-filter-repo
  - git-filter-branch
  - git-filter
---

<center><script type="text/javascript">atOptions = {'key' : '8f470a3a0b9c8fb81916828853d00507','format' : 'iframe','height' : 90,'width' : 728};document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://harassinganticipation.com/8f470a3a0b9c8fb81916828853d00507/invoke.js"></scr' + 'ipt>');</script></center>

## 前言

对于程序员来说，公司就像是工地，代码就是我们的钢筋水泥。那在工地什么最重要呢？没错就是安全生产。本文要讨论的是开发中的合规安全。GitHub 作为当代开源社区的基础设施，不仅是个人开发者在上面维护项目，很多企业也会将内部优秀项目选择开源反馈社区和扩大社区影响力。然后，就出现了公司拖欠工资，员工怒将内部代码开源、员工将敏感信息上传。有些信息虽然看起来不怎么重要，但是如果被不怀好意的黑客盯上，就没有一篇雪花是干净的。

那如果安全隐患已经存在，我们该如何补救呢？答案是使用 git-filter 能力对 git 记录进行合并、删除等操作。git-filter-repo 正是这类工具的集大成者。下面就让我们一起学习下这款强大的 git log 操作工具吧。

## git-filter-branch

git 自带的有一个 git-filter-branch 工具，我第一次使用是为了删除单个文件及其相关的 commit 记录。命令如下：

```sh
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch CHANGELOG.md' --prune-empty --tag-name-filter cat -- --all
```

执行后，会收到如下的警告：

```sh
WARNING: git-filter-branch has a glut of gotchas generating mangled history
         rewrites.  Hit Ctrl-C before proceeding to abort, then use an
         alternative filtering tool such as 'git filter-repo'
         (https://github.com/newren/git-filter-repo/) instead.  See the
         filter-branch manual page for more details; to squelch this warning,
         set FILTER_BRANCH_SQUELCH_WARNING=1.
```

翻译过来如下：

```sh
警告：翻译过来如下：git-filter-branch有大量的问题，会产生错误的历史记录重写。
        在继续进行之前按 Ctrl-C 中止，然后用一个替代的过滤工具，
        如 https://github.com/newren/git-filter-repo/ 来代替。
        参见 filter-branch 手册页了解更多细节。
        要消除这个警告。请设置 FILTER_BRANCH_SQUELCH_WARNING=1。
```

- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [Github: 单独删除某个文件的所有历史记录](https://blog.csdn.net/q258523454/article/details/83899911)
- [WARNING: git-filter-branch has a glut of gotchas generating mangled history rewrites](https://serverfault.com/questions/1018302/warning-git-filter-branch-has-a-glut-of-gotchas-generating-mangled-history-rewr)
- [使用 git-filter-repo 清理 git 历史记录](https://nyakku.moe/posts/2020/06/12/use-git-filter-repo-clean-git-history.html)
- [使用git filter-repo清理git commit历史中的大文件](https://www.vicw.com/groups/code_monkey/topics/362)
