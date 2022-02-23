---
title: JavaScript复杂数据处理
date: 2020-06-11 09:29:52
tags:
---

![5df83eaacc524168.jpg](https://i.loli.net/2020/07/03/8Klm6nzZgGTbWVY.jpg)

<!--more-->

## 根据一个数组过滤另一个数组

- Array.prototype.includes
- Array.prototype.forEach

```js
//筛选数组：[{id:2},{id:3}]
let ids = [2, 3];
let arr = [{
    id: 1
  },
  {
    id: 2
  },
  {
    id: 3
  }
];
let newArr = [];

arr.forEach(item => {
  if (ids.includes(item.id)) {
    newArr.push(item);
  };
})
console.log(newArr); //输出：[{id:2},{id:3}]
```

|                           作者微信                           |                           知识星球                           |                           赞赏作者                           |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="https://i.loli.net/2020/02/22/q2tLiGYvhIxm3Fl.jpg" width="200px"/> | <img src="https://i.loli.net/2020/02/22/AQzLmDPopb1ufsG.png" width="200px"/> | <img src="https://i.loli.net/2020/02/23/q56X1eYZuITQpsj.png" width="200px"/> |
