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

# 数组

- 跟其他编程语言一样，JS 数组也是一组有序的数据，但跟其他语言不同的是，数组中的每个槽位可以存储任意类型的数组。
- JS 数组的动态大小的，会随着数据添加而自动增长。

## 创建数组

### 使用 Array 构造函数

创建一个空数组：

```js
// 创建一个空数组
const arr = new Array();
console.log(arr); // []
```

创建一个指定长度的数组，元素为 `undefined`：

```js
// 创建一个长度为 5 的数组，元素为 undefined
const arr = new Array(5);
console.log(arr); // [undefined, undefined, undefined, undefined, undefined]
```

创建并初始化数组：

```js
// 创建一个包含 [1, 2, 3] 的数组
const arr = new Array(1, 2, 3);
console.log(arr); // [1, 2, 3]
```

### 使用数组字面量

创建一个空数组：

```js
const arr = []; // 创建一个空数组
console.log(arr); // []
```

直接定义数组元素：

```js
// 创建一个包含 [1, 2, 3] 的数组
const arr = [1, 2, 3];
console.log(arr); // [1, 2, 3]
```

### 使用 `Array.from` 方法

从类数组对象或可迭代对象创建数组：

```js
// 创建一个包含 [1, 2, 3] 的数组
let arr = Array.from({ length: 3 }, (_, i) => i + 1);
```

从字符串转换为数组：

```js
// 创建一个包含 ['h', 'e', 'l', 'l', 'o'] 的数组
let arr = Array.from("hello");
```

### 使用 `Array.of` 方法

根据参数创建数组：

```js
// 创建一个包含 [1, 2, 3] 的数组
let arr = Array.of(1, 2, 3);
```

### 使用 `Array.fill` 方法

创建并填充数组：

```js
// 创建一个长度为 5 的数组，元素全为 0。时间复杂度为 O(N)
let arr = new Array(5).fill(0);
```

## 插入元素

### 在末尾插入元素

```js
const arr = [1, 2, 3];
// 在末尾插入元素 4。时间复杂度为 O(1)
arr.push(4);
console.log(arr) // [1, 2, 3, 4]
```

### 在开头插入元素

```js
const arr = [1, 2, 3];
// 在开头插入元素 0。时间复杂度为 O(N)
arr.unshift(0);
console.log(arr); // [0, 1, 2, 3]
```

### 在中间插入元素

`splice()` 方法可以在数组的任意位置插入元素。它接受三个参数：

- 起始索引
- 要删除的元素的数量（如果不需要删除元素，设置为 `0`）
- 要插入的元素（可以是一个或多个）

```js
const arr = [1, 2, 3];
// 在索引 1 的位置插入元素 1.5。时间复杂度为 O(N)
arr.splice(1, 0, 1.5);
console.log(arr) // [1, 1.5, 2, 3]
```

## 删除元素

### 删除末尾元素

```js
const arr = [1, 2, 3];
// 删除末尾元素 3。时间复杂度为 O(1)
arr.pop();
console.log(arr) // [1, 2]
```

### 删除开头元素

```js
const arr = [1, 2, 3];
// 删除开头元素 1。时间复杂度为 O(N)
arr.shift();
console.log(arr); // [2, 3]
```

### 删除中间元素

`splice()` 方法可以删除数组的任意位置元素。它接受两个参数：

- 起始索引
- 要删除的元素的数量（如果不需要删除元素，设置为 `0`）
- 要插入的元素（可以是一个或多个）

```js
const arr = [1, 2, 3];
// 删除索引 1 的元素 2。时间复杂度为 O(N)
arr.splice(1, 1);
console.log(arr) // [1, 3]
```

## 修改元素

### 根据索引修改元素

```js
const arr = [1, 2, 3];
arr[0] = 100;
console.log(arr); // [100, 2, 3]
```

### 使用 `splice` 方法

`splice()` 方法可以删除数组的任意位置元素。它接受两个参数：

- 起始索引
- 要删除的元素的数量（如果不需要删除元素，设置为 `0`）
- 要插入的元素（可以是一个或多个）

当你需要修改数组中连续的多个元素时，`splice()` 方法非常有用。

```js
const arr = [1, 2, 3];
// 从索引 2 开始，删除 1 个元素，并插入新元素 6。时间复杂度为 O(N)
arr.splice(1, 1, 6);
console.log(arr); // [1, 6, 3]
```

## 查询元素

### 根据索引查询元素值

```js
const arr = [1, 2, 3];
// 查询索引 1 的元素 2。时间复杂度为 O(1)
const element = arr[1];
console.log(element); // 2
```

### 根据元素值查找索引

```js
const arr = [1, 2, 3];
// 查询元素 2 的索引 1。时间复杂度为 O(N)
const index = arr.indexOf(2);
console.log(index); // 1
```
