---
title: Typora 基于 PicGo-Core 实现粘贴上传图片
description: 本文介绍了如何用 Typora 基于 PicGo-Core 实现粘贴上传图片
date: 2020-04-10 17:57:41
categories:
  - 工具
tags:
  - typora
  - markdown
  - 图床
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

## 下载 PicGo-Core

```sh
$ npm install picgo -g
# or
$ yarn global add picgo
```

## 获取路径

- node安装路径（`which node`）：`/usr/local/bin/node`
- picgo安装路径（`which picgo`）：`/usr/local/bin/picgo`

### Imgae Upldoad Setting

> 打开 Typora -> 偏好设置 -> 图像：

上传服务选择“Custom Command”，自定义命令格式是 “[your node path] [your picgo-core path] upload”，比如我的是 `/usr/local/bin/node /usr/local/bin/picgo upload `

![紫竹](https://i.loli.net/2020/04/10/aCFG5ZW2xuR6qls.png)

## 配置 sm.ms api token

picgo 的默认配置文件为`~/.picgo/config.json`。其中`~`为用户目录。不同系统的用户目录不太一样。

linux 和 macOS 均为`~/.picgo/config.json`。

windows 则为`C:\Users\你的用户名/.picgo\config.json`。

配置文件需要至少有如下的配置项：

```json
{
  "picBed": {
    "uploader": "smms", // 代表当前的默认上传图床为 SM.MS,
    "smms": {
      "token": "" // 从https://sm.ms/home/apitoken获取的token
    }
  },
  "picgoPlugins": {} // 为插件预留
}
```

## 验证

点击**验证图片上传选项** 按钮

![image-20200410180446932](https://i.loli.net/2020/04/10/LYNhz8rACdORjP7.png)

## 参考链接

- [Picgo-Core](https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html#%E9%BB%98%E8%AE%A4%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)
- [Typora Upload Image](https://support.typora.io/Upload-Image/)
