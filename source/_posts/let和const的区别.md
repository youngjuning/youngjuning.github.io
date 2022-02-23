---
title: let和const的区别
date: 2020-02-07 18:49:11
categories:
  - [前端开发, JavaScript]
tags:
  - ES6
---

`let` 与 `const` 都是只在声明所在的块级作用域内有效。

`let` 声明的变量可以改变，值和类型都可以改变，没有限制。
`const` 声明的变量不得改变值，这意味着，`const` 一旦声明变量，就必须立即初始化，不能留到以后赋值。

```js
const a // Uncaught SyntaxError: Missing initializer in const declaration
const b = 2
b = 3 // Uncaught TypeError: Assignment to constant variable.
```

对于引用类型的值，如数组和对象，变量保存的是值的引用。`const` 命令只是保证引用不变，并不保证值不变。

```js
const names = []
names = [1,2,3] // Uncaught TypeError: Assignment to constant variable.
```

```js
//不会报错，因为names指向的地址不变，改变的只是内部数据
const names = []
names[0] = 1
names[1] = 2
names[2] = 3
```
