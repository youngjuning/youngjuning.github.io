---
title: JavaScript 浅比较和深比较
date: 2020-02-05 14:33:23
categories:
  - [前端开发, JavaScript]
---

## 基本类型和引用类型的值

ECMAScript 变量可能包含两种不同数据类型的值：基本类型值和引用类型值。**基本类型值**指的是简单的数据段，而**引用类型的值**指那些可能由多个值构成的对象。

在将一个值赋给变量时，解析器必须确定这个值是基本类型值还是引用类型值。

ECMAScript 中有五种基本类型: Undefined、Null、Boolean、Number 和 String。这五种基本数据类型是按值访问的，因为可以操作保存在变量中的实际的值。

引用类型的值是保存在内存中的对象。与其他语言不同，JavaScript 不允许直接访问内存中的位置。也就是说不能直接操作对象的内存空间。在复制保存着对象的某个变量时，操作的是对象的引用。但在为对象添加属性时，操作的是实际的对象。

> 在很多语言中，字符串以对象的形式来表示，因此被认为是引用类型的。ECMAScript 放弃了这一传统

<!--more-->

## 浅比较

**浅比较**也称引用相等，在 javascript 中， `===` 是作**浅比较**,只检查左右两边是否是同一个对象的引用：

```js
var m = { a: 1 }
var n = { a: 1 }
var x = m
console.log(m === n) // false
console.log(m === n) // true
```

> 变量名只是指向栈内存的指针，也就是给这个栈内存取得别名

## 深比较

**深比较**也称原值相等，深比较是指检查两个**对象**的所有属性是否**都相等**,深比较需要以递归的方式遍历两个对象的所有属性，操作比较耗时，深比较不管这两个对象是不是同一对象的引用。

### lodash.isEqual

> `_.isEqual`: 执行深比较来确定两者的值是否相等。
> 注意: 这个方法支持比较 `arrays`, `array buffers`, `booleans`, `date objects`, `error objects`, `maps`, `numbers`, `Object objects`, `regexes`, `sets`, `strings`, `symbols`, 以及 `typed arrays`. Object对象值比较自身的属性，不包括继承的和可枚举的属性。不支持函数和DOM节点比较。

```js
import _ from 'lodash'
const m = {a:1}
const n = {a:1}
console.log(_.isEqual(m, n)) // true
```

### fast-deep-equal

```js
import deepEqual from 'fast-deep-equal'
deepEqual({name:'杨俊宁'},{name:'杨俊宁'}) // true
```
