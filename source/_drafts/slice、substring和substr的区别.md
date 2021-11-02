---
title: 'slice、substring和substr的区别'
date: 2020-02-09 21:14:53
categories:
  - [前端开发, JavaScript]
---

| 方法                    | 参数                                                         | 返回值                                 |
| ----------------------- | ------------------------------------------------------------ | -------------------------------------- |
| `slice(start,end)`      | `start`(必需)-起始位置<br />`end`(可选)-结束位置，若未指定，则默认到末尾所有元素 | 返回 `[start,end]`之间的元素           |
| `substring(start, end)` | `start`(必需)-起始位置<br />`end`(必需)-结束位置，若未指定，则默认到末尾所有元素 | 返回 `[start, end]` 之间的元素         |
| `substr(start)`         | `start`(必需)-起始位置<br />`length`(可选)-所截取的元素的个数，若未指定，则默认到末尾 | 返回 `[start, start+length]`之间的元素 |

<!--more-->

> 当传递的参数都为正数时，`substring` 没有区别，当参数为负数时，三个函数的行为不尽相同。

- `slice`: 将传入的福参数与字符串长度想加；
- `substring`: 把所有的负值置为0；
- `substr`: 将负的第一个参数与字符串长度相加，负的第二个参数置为0。

**参数为正数的例子**

```js
var str = 'hello world';
console.log(str.slice(3)); // lo world
console.log(str.substring(3));// lo world
console.log(str.substr(3));// lo world

console.log(str.slice(3, 7)); // lo w
console.log(str.substring(3, 7)); // lo w
console.log(str.substr(3, 7));//lo worl
```

**参数为负数**

```js
var str = 'hello world';
console.log(str.slice(-3)); // rld
console.log(str.substring(-3));// hello world
console.log(str.substr(-3));// rld

console.log(str.slice(3, -4)); // lo w
console.log(str.substring(3, -4)); // hel
console.log(str.substr(3, -4));// ""(空字符串)
```
