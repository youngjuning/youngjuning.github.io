---
title: Hexo × Github 免费搭建联盟营销独立站
date: 2023-03-29 19:05:04
description: 最流行的独立站建站平台是 Shopify，但是 Shopify 的价格是 29 美元/月起，对于刚刚起步的小站来说，这个价格还是有点高的。本文将介绍如何使用 Hexo 和 GitHub 搭建一个免费的联盟营销独立站。
categories:
  - 跨境电商
tags:
  - 跨境电商
  - 独立站
  - 免费
  - Hexo
  - 静态站点
  - GitHub
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

随着亚马逊、虾皮、速卖通等平台电商进入红海，门槛越来越高、内卷越来越严重，跨境电商独立站成为了一种新的选择。最流行的独立站建站平台是 Shopify，但是 Shopify 的价格是 29 美元/月起，对于刚刚起步的小站来说，这个价格还是有点高的。本文将介绍如何使用 Hexo 和 GitHub 搭建一个免费的联盟营销独立站。

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

# 环境准备

1. NodeJS: https://nodejs.org/zh-cn/download
2. Git: https://git-scm.com/downloads
3. GitHub: https://github.com

# Hexo 搭建

## 创建 Hexo 站点

> 请替换 hyonline 为你自己的

```sh
npm install hexo-cli -g
hexo init hyonline
cd blog
yarn install
yarn server
```

按照提示打开 `http://localhost:4000`，如果看到 Hexo 的默认页面，说明安装成功。

![Hexo 本地预览](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680158474181.png)


## 推送到 GitHub

1、创建 GitHub 仓库

![创建 GitHub 仓库](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680158386923.png)

2、推送到 GitHub

```sh
git init
git add .
git commit -m "First Commit"
git remote add origin https://github.com/hyonline-store/hyonline-store.github.io.git
git branch -M main
git push -u origin main
```

## 自动部署

1、设置 Workflow permissions 为 Read and write permissions

![Workflow permissions](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680162995972.png)

2、添加 `.github/workflows` 目录，创建 `gh-pages.yml` 文件，内容如下：

```yml
name: github pages
on:
  push:
    branches:
      - main # default branch
jobs:
  deploy:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v2
      - uses: c-hive/gha-yarn-cache@v2
      - run: yarn install
      - run: yarn build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

3、 部署成功后，设置 Pages

![设置 GitHub Pages](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680163086920.png)

等待 GitHub Action 执行完成，就可以通过 `https://hyonline-store.github.io` 访问了。

# 域名解析

## DNS 解析

1、添加 A 记录（Godaddy 为例）

![添加 A 记录](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680169974154.png)

2、添加 CNAME 记录（Godaddy 为例）

![添加 CNAME 记录](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680170058837.png)

3、GitHub Pages 解析

![GitHub Pages 解析](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680170403897.png)

4、Hexo CNAME 设置

```diff
name: github pages
on:
  push:
    branches:
      - main # default branch
jobs:
  deploy:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v2
      - uses: c-hive/gha-yarn-cache@v2
      - run: yarn install
      - run: yarn build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
+         cname: you.hyonline.store
```
