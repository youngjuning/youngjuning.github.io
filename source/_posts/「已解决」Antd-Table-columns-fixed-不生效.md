---
title: 「已解决」Antd Table columns fixed 不生效
date: 2023-03-31 11:24:13
description: 一般 antd Table columns 比较多的时候，我们会使用 fixed 属性来固定列，但是在使用的时候发现，fixed 属性不生效，这是为什么呢？
categories:
  - [issues, antd]
  - [前端, React]
tags:
  - antd
  - table
  - fixed
  - react
  - issues
  - columns
---

<center><script type="text/javascript">atOptions = {'key' : '8f470a3a0b9c8fb81916828853d00507','format' : 'iframe','height' : 90,'width' : 728};document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://harassinganticipation.com/8f470a3a0b9c8fb81916828853d00507/invoke.js"></scr' + 'ipt>');</script></center>

一般 antd Table columns 比较多的时候，我们会使用 fixed 属性来固定列，但是在使用的时候发现，fixed 属性不生效，这是为什么呢？

如下，我们使用了 fixed 属性，但是并没有生效。

```tsx
const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    fixed: 'left',
    key: 'name',
  },
  {
    title: '住址',
    dataIndex: 'address',
    ellipsis: true,
    key: 'address',
  },
  {
    title: '住址',
    dataIndex: 'address',
    width: '100',
    key: 'address',
  },
  {
    title: '住址',
    dataIndex: 'address',
    width: '100',
    key: 'address',
  },
  {
    title: '住址',
    dataIndex: 'address',
    width: '100',
    key: 'address',
  },
  {
    title: '住址',
    dataIndex: 'address',
    width: '100',
    key: 'address',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    fixed: 'right'
  },
];

<Table dataSource={dataSource} columns={columns} />;
```

代码里有两处使用了 fixed 属性，一处是在第一列，一处是在最后一列，但是并没有生效。原因是有配置项设置了 `ellipsis` 和 `width`，这两个属性删除后，就可以表现正常了。
