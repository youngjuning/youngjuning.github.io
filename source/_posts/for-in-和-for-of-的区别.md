---
title: for in 和 for of 的区别
date: 2022-04-12 17:13:30
cover: https://s2.loli.net/2022/04/12/cIu5YhaebGpqfX7.png
categories:
  - javascript
tags:
  - 面试题
---

# 迭代的输入不同

- `for...in` 可以对任何对象进行操作；它通常被用作检查对象的属性。
- `for...of` 只能对可迭代对象进行操作；它通常被用作迭代数组的元素。

## 代码示例

```js
var obj = {
  a: 1,
  b: 2,
  c: 3
};

for (var key in obj) {
  console.log(key); // "a", "b", "c"
}

for (var value of obj) { // Uncaught TypeError: obj is not iterable
  console.log(value);
}
```

# 迭代的输出不同

- `for...in` 返回被迭代对象的键列表
- `for...of` 返回被迭代对象的数字属性的值列表

## 代码示例

### Array

```js
const list = [4, 5, 6];
list.foo = "bar";

for (let i in list) {
  console.log(i); // "0", "1", "2", "foo"
}

for (let i of list) {
  console.log(i); // ""4", "5", "6"
}
```

### Set

![](https://s2.loli.net/2022/04/12/RycBMqHSUPr8uXg.png)

```js
let pets = new Set(['cat', 'dog', 'bat']);
pets["species"] = "mammal";

for (let pet in pets) {
  console.log(pet); // "species"
}

for (let pet of pets) {
  console.log(pet); // "cat", "dog", "bat"
}
```

### Map

![](https://s2.loli.net/2022/04/12/x3WkK54cEUq2pDn.png)

```js
var pets = new Map([["1", "cat"],["2", "dog"],["3", "bat"]]);
pets["species"] = "mammal";

for (let pet in pets) {
  console.log(pet); // "species"
}

for (let pet of pets) {
  console.log(pet); // ["1", "cat"], ["2", "dog"], ["3", "bat"]
}
```

# 参考

- [What is the difference between ( for... in ) and ( for... of ) statements?](https://stackoverflow.com/questions/29285897/what-is-the-difference-between-for-in-and-for-of-statements)
