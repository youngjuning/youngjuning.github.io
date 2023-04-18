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

<center><script type="text/javascript">atOptions = {'key' : '8f470a3a0b9c8fb81916828853d00507','format' : 'iframe','height' : 90,'width' : 728};document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://harassinganticipation.com/8f470a3a0b9c8fb81916828853d00507/invoke.js"></scr' + 'ipt>');</script></center>

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
