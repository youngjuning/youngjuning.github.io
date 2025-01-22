---
title: JavaScript 数据结构
date: 2025-01-21 23:57:59
description: 探索 JavaScript 数据结构的奥秘，掌握数组、链表、树等多种结构，为高效编程与算法实现筑牢根基。
categories:
  - [数据结构]
tags:
  - JavaScript
  - 算法
---

## 数组

- 跟其他编程语言一样，JS 数组也是一组有序的数据，但跟其他语言不同的是，数组中的每个槽位可以存储任意类型的数组。
- JS 数组的动态大小的，会随着数据添加而自动增长。

### 创建数组

```js
// 方法一：使用 Array 构造函数
let arr = new Array();

// 方法二：使用数组字面量
let arr = [];

// 方法三：使用 Array.of() 方法
let arr = Array.of(1, 2, 3); // [1, 2, 3]

// 方法四：使用 Array.from() 方法
let arr = Array.from("Matt"); // ["M", "a", "t", "t"]
```

### 初始化数组

```js
// 方法一：使用 Array 构造函数创建长度为 10 的数组，并填充 1
let arr = new Array(10).fill(1);

// 方法二：使用数组字面量
let arr = []
for (var i = 0; i < 10; i++) {
  // 在末尾追加元素，时间复杂度 O(1)
  arr.push(i);
}
```
