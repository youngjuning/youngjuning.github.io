---
title: Xcode 11 配置 LaunchImage
date: 2020-02-21 13:19:26
categories:
  - [移动开发, ios]
tags:
  - LaunchImage
  - 启动图
---

![image.png](https://i.loli.net/2020/03/01/NF3TuSW7Pn8irGs.png)

<!--more-->

如果有设计师资源，请 ui 同学提供以下尺寸的图片

- 640x960
- 640x1136
- 750x1334
- 828x1792
- 1125x2436
- 1242x2436

如果你没有设计师资源，可以使用 [图标工厂](https://icon.wuruihong.com/) 自行生成

1、添加 LaunchImage

![](https://i.loli.net/2019/09/16/SpIYPmE7MHTzw6o.png)

2、将准备好的图片拖到下图红框的区域

![](https://i.loli.net/2019/09/16/bBO1u4PAaWLdMqV.png)

3、你在 `buildSetting` 中搜索 `launch`,可看到 `Asset Catalog Launch Image Set Name` 你只要把对应的`LaunchImage` 名称设置上去就好了:

![](https://i.loli.net/2020/02/21/dXqnrGc2sWK4aVP.png)

4、清空 Launch Screen File

![](https://i.loli.net/2020/02/21/oyFKjUY1RZwtf45.png)

5、最后别忘了把 `Info.list` 的 `UILaunchStoryboardName` 删除:

```xml
<key>UILaunchStoryboardName</key>
<string>LaunchScreen</string>
```
