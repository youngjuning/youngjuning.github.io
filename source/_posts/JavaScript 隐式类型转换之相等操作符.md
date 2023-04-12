---
title: JavaScript 隐式类型转换之相等操作符
date: 2022-04-16 17:32:32
cover: https://s2.loli.net/2022/04/17/8l1Me5Vf9ZE7Lqh.png
categories:
  - [前端, JavaScript]
tags:
  - JavaScript 隐式类型转换
  - JavaScript 相等操作符
---

隐式类型转换多存在于使用 `==` 进行比较的场景，例如：

```js
var a = 1;
var b = true;

console.log('a == b'); // true
```

不同类型的值用相等运算符比较后的结果，可以用下表总结。

![](https://s2.loli.net/2022/04/16/WZboPTdBRmXQkja.png)

`toNumber` 方法对不同类型返回的结果如下。

![](https://s2.loli.net/2022/04/17/VQ7BxmTqcOFUh34.png)

`toPrimitive()`：如果对象的 `valueOf` 方法的结果是原始值，返回原始值；如果对象的 `toString` 方法返回原始值，就返回这个值；其他情况都返回一个错误。

用例子来验证一下表格中的结果。

```js
console.log(true == 'true'); // false
```

- 首先，布尔值会被 `toNumber` 方法转换为数字，因此得到 `true == 1`
- 其次，用 `toNumber` 转换字符串值。因为字符串包含字母，所以会被转成 `NaN`，因此表达式就变成了 `1 == NaN`，结果就是 false。
