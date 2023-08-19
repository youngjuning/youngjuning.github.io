---
title: Antd Descriptions 组件隐藏 label 的冒号
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678952807676.png
description: 本文介绍了如何隐藏 antd Descriptions 组件 label 后面的冒号。
date: 2023-03-16 15:41:41
categories:
  - [issues, antd]
  - [前端, React]
tags:
  - antd
  - descriptions
  - antd descriptions
  - 前端开发
  - Descriptions
---

## 问题

在使用 antd 的 Descriptions 组件时，发现 label 后面总是有一个冒号，如下图所示：

![antd descriptions label](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678952578255.png)

代码如下：

```tsx
<Descriptions title='类型统计' layout="vertical" column={4}>
  <Descriptions.Item label="点类型统计">73</Descriptions.Item>
  <Descriptions.Item label="边类型统计">29</Descriptions.Item>
</Descriptions>
```

正常来说是没问题的，但是 UI 看着不顺眼，走查的时候要求去掉，但是发现没有相关属性可以配置。

## 解决方案

直接改 antd 的 css 样式来隐藏即可：

```less
:global {
  .ant-descriptions-item-label::after {
    content: ''
  }
}
```

## 扩展

### 自定义 label 和 content 的 padding

同样是因为 UI 走查看不顺眼，要求把 label 和 content 的 padding 值改为 4px，可以通过修改 antd 的样式来实现：

```less
.ant-descriptions-row > th, .ant-descriptions-row > td {
  padding-bottom: 4px;
}
```
