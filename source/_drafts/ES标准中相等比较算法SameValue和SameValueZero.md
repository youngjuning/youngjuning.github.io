---
title: ES标准中相等比较算法SameValue和SameValueZero
date: 2020-02-05 10:35:30
categories:
  - [前端开发, JavaScript]
---

JavaScript 对值的相等判断有很多不同的算法，`==` 只是最常用的一种。由于 `NaN` 和正负零的涉入，除了 `==` 和 `===` 之外还有 SameValue 和 SameValueZero 算法。

<!--more-->

## `==`、`===`、SameValue

|           | ==                   | ===                   | SameValue（Object.is）       |
| --------- | -------------------- | --------------------- | ---------------------------- |
| `NaN`     | `NaN == NaN` `false` | `NaN === NaN` `false` | `Object.is(NaN, NaN)` `true` |
| `0`、`-0` | `0 == -0` `true`     | `0 === -0` `true`     | `Object.is(0, -0)` `false`   |

## SameValueZero

但是你在使用es6中有没有疑惑这种情况：

```js
const set = new Set()
set.add(0)
set.add(NaN)
set.has(-0) // true
set.has(NaN) // true
```

是不是与上述的三种算法的表现多不一样，这就是第四种比较算法 SameValueZero，它与 SameValue 的区别主要在于 `0` 与 `-0` 是否相等。

所以你在实践 `includes` 方法时，遇到：

```js
const array = [0, NaN]
array.includes(-0) // true
array.includes(NaN) // true
```

就不用大惊小怪了，因为 `includes` 内部使用的比较算法就是SameValueZero。
