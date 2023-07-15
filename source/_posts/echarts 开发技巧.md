---
title: Echarts 开发技巧
description: 这里记录了一些实用的 Echarts 开发技巧
date: 2020-06-05 14:05:24
categories:
  - 前端
tags:
  - echarts
  - 可视化
  - 开发技巧
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

## 柱状图颜色渐变

```js
import echarts from 'echarts'
...
series: [
  {
    type: 'bar',
    // 图形样式
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#178ffc' },
        { offset: 1, color: '#ffffff' },
      ]),
    },
    emphasis: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {offset: 0, color: '#178ffc'},
        {offset: 1, color: '#ffffff'}
      ])
    }
  },
],
```

## 横坐标值显示不全（自动隐藏）

echarts中，横轴数据如果非常多，会自动隐藏一部分数据，我们可以通过属性 `interval` 来进行调整。

```js
xAxis: {
  type: 'category',
  data: labels,
  axisLabel: {
    interval: 0,
  },
},
```
