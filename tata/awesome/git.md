---
title: Git
---

## 教程

- [猴子都能懂的 GIT 入门](https://backlog.com/git-tutorial/cn/)
- [Git 简易指南](https://www.bootcss.com/p/git-guide/)

## tag 标签

### push tag

```sh
git push --follow-tags
```

```sh
git push --tags
```

```sh
git push origin v0.0.1
```

## merge 合并

### 合并上游仓库分支

> 可以参考 [Github 进行 fork 后如何与原仓库同步：重新 fork 很省事，但不如反复练习版本合并](https://github.com/selfteaching/the-craft-of-selfteaching/issues/67)

1. 添加上游仓库：`git remote add upstream https://github.com/tuya/tuya-panel-sdk.git`
2. 检查是否成功：`git remote -v`
3. 将本地的更改提交了
4. 抓取上游仓库：`git fetch upstream`
5. 切换到 `main` 或 `master` 分支
6. 合并上游的主分支：`git merge upstream/main`

## git rebase

- [彻底搞懂 Git-Rebase](http://jartto.wang/2018/12/11/git-rebase/)
