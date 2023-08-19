---
title: JavaScript Array 完全指南
description: ECMAScript 数组的每一项可以保存任何类型的数据；而且大小是可以动态调整的，即可以随着数据的添加自动增长以容纳新增数据。
date: 2023-03-08 17:17:16
categories:
  - [前端,JavaScript]
tags:
  - JavaScript
  - Array
  - ECMAScript
---

ECMAScript 数组的每一项可以保存任何类型的数据；而且大小是可以动态调整的，即可以随着数据的添加自动增长以容纳新增数据。

# 创建数组

## 构造函数

```js
var colors = new Array() // []
colors = new Array(10) // [empty × 10]
colors = new Array('red', 'blue', 'green') // ["red", "blue", "green"]
```

## 数组字面量表示法

```js
var colors = [] // 创建一个空数组
var colors = ['red', 'blue', 'green'] // 创建一个包含 3 个字符串的数组
var values = [1, 2] // 不要这样！这样会创建一个包含2或3项的数组
var options = [, , , , ,] // 不要这样！这样会创建一个包含5或6项的数组
```

# 读取和设置数组的值

```js
var colors = ['red', 'blue', 'green'] // 创建一个包含3个字符串的数组
alert(colors[0]) // 显示第1项
colors[2] = 'black' // 修改第3项
colors[3] = 'brown' // 新增第4项
```

# length 属性

```js
var colors = ['red', 'blue', 'green'] // 创建一个包含3个字符串的数组
alert(colors.length) // 显示数组长度
colors[colors.length] = 'black' // 在位置3添加一种颜色
colors[colors.length] = 'brown' // 在位置4再添加一种颜色
```

# 检测数组

```js
var array = []
if (Array.isArray(array)) {
  // 对数组执行某些操作
}
```

## Array.isArray Polyfill

如果是实际项目可以配置 `@babel/polyfill` 或者 `transform-runtime`，这不在本文的讨论范围

```js
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
}
```

# ES1 方法

- `Array.prototype.join`: `join()` 方法将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串。如果数组只有一个项目，那么将返回该项目而不使用分隔符。**原始数组不会被改变**。

```js
// join
var colors = ['red', 'blue', 'green']
console.log(colors.join()) // "red,blue,green"
console.log(colors.join('|')) // "red|blue|green"
console.log(colors.join('|')) // "red|blue|green"
console.log('red|blue|green'.split('|')) // ["red", "blue", "green"]
```

- `Array.prototype.reverse()`: `reverse()` 方法将数组中元素的位置颠倒，并返回该数组。**该方法会改变原数组**。
- `Array.prototype.sort()`: `sort()` 方法用原地算法对数组的元素进行排序，并返回数组。默认排序顺序是在将元素转换为字符串，然后比较它们的 UTF-16 代码单元值序列时构建的; sort 方法接收一个比较函数作为参数，如果第一参数应该位于第二个参数之前则返回负数，如果第一个参数应该位于第二个之后则返回一个正数。**该方法会改变原数组**。

```js
// reverse
var colors = [1, 2, 3, 4, 5]
console.log(colors.reverse()) // [5, 4, 3, 2, 1]

// sort
var colors = [1, 10, 3, 20, 5]
function sort(arr, asc = true) {
  return arr.sort((a, b) => {
    if (asc) {
      return a - b
    }
    return b - a
  })
}
console.log(sort(colors)) // [1, 3, 5, 10, 20]
console.log(sort(colors, false)) // [20, 10, 5, 3, 1]
```

# ES3 方法

- `Array.prototype.push`: `push()` 方法可以接受任意数量的参数，把它们逐个添加到数组末尾，并返回修改后数组的长度。**该方法会改变原数组**。
- `Array.prototype.pop`: `pop()` 方法从数组末尾移除最后一项，减少数组的 `length` 值，并返回该项。**该方法会改变原数组**。
- `Array.prototype.shift`: `shift()` 方法能够移除数组中的第一项并返回该项, 同时将数组长度减 1。**该方法会改变原数组**。
- `Array.prototype.unshift`: `unshift()` 方法能够在数组前端添加任意个项，并返回新数组的长度。**该方法会改变原数组**。

```js
// push、pop
var colors = ['red', 'blue', 'green']
var count = colors.push('black', 'brown') // 向末尾推入两项
console.log(count) // 5
var item = colors.pop() // 取得最后一项
console.log(item) // "brown"

// shift、unshift
var colors = ['red', 'blue', 'green']
var count = colors.unshift('black', 'brown') // 向开头推入两项
console.log(count) // 5
var item = colors.shift() // 取得第一项
console.log(item) // "red"
```

- `Array.prototype.concat()`: `concat()` 方法用于合并两个或多个数组。**原始数组不会被改变**，而是返回一个新数组。
- `Array.prototype.slice()`: `slice()` 方法返回一个新的数组对象，这一对象是一个由 `begin` 和 `end` 决定的原数组的浅拷贝（包括 `begin`，不包括 `end`）。**原始数组不会被改变**。
- `Array.prototype.splice()`: `splice()` 方法通过删除或替换现有元素或者原地添加新的元素来修改数组,并以数组形式返回被修改的内容。**此方法会改变原数组**。
  - **删除**: 可以删除任意数量的项，只需指定 2 个参数: 要删除的第一项的位置和要删除的项数。例如，`splice(0, 2)` 会删除数组中的前两项。
  - **插入**: 可以向指定位置插入任意数量的项，只需要提供 3 个参数：起始位置、0（要删除的项数）和要插入的项。如果要插入多个项，可以再传入任意多个项。例如，`splice(2, 0, "red", "green")` 会从当前数组的位置 2 开始插入字符串 `"red"` 和 `green`。
  - **替换**: 可以向指定位置插入任意数量的项，且同时删除任意数量的项，只需要指定 3 个参数：起始位置、要删除的项数和要插入的任意数量的项。插入的项不必与删除的项数相等。例如，`splice(2, 1, "red", "green")` 会删除当前数组位置 2 的项，然后再从位置 2 开始插入字符串 `"red"` 和 `green`。

```js
// concat
var colors = ['red', 'blue', 'green']
var colors1 = ['black', 'brown']
console.log(colors.concat(colors1)) // ["red", "blue", "green", "black", "brown"]
// slice
/**
 * 如果 `slice()` 方法的参数中有一个负数，则用数组长度加上该数来确定相应地位置。例如，在一个包含5项的数组上调用 `slice(-2, -1)` 与调用 `slice(3, 4)` 得到的结果相同。如果结束位置小于起始位置，则返回空数组。
 */
var colors = ['red', 'blue', 'green', 'black', 'brown']
var colors2 = colors.slice(1)
var colors3 = colors.slice(1, 4)

console.log(colors2) // ["blue", "green", "black", "brown"]
console.log(colors3) // ["blue", "green", "black"]

/**
 * splice() 方法始终都会返回一个数组，该数组中包含从原始数组中删除的项（如果没有删除任何项，则返回一个空数组）
 */
var colors = ['red', 'green', 'blue']
var removed = colors.splice(0, 1) // 删除第一项
console.log(colors) // ["green", "blue"]
console.log(removed) // ["red"] 返回的数组中只包含一项

removed = colors.splice(1, 0, 'yellow', 'orange') // 从位置 1 开始插入两项
console.log(colors) // ["green", "red", "orange", "blue"]
console.log(removed) // 返回的是一个空数组

removed = colors.splice(1, 1, 'red', 'purple') // 删除一项，增加两项
console.log(colors) // ["green", "red", "purple", "orange", "blue"]
console.log(removed) // yellow，返回的数组中只包含一项
```

# ES5 方法

- `Array.prototype.indexOf()`: `indexOf()` 方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1。从数组的前面向后查找，从 `fromIndex` 处开始。
- `Array。prototype.lastIndexOf)()`: `lastIndexOf()` 方法返回指定元素在数组中的最后一个索引，如果不存在则返回-1。从数组的后面向前查找，从 `fromIndex` 处开始。

```js
var numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1]
console.log(numbers.indexOf(4)) // 3
console.log(numbers.lastIndexOf(4)) // 5

console.log(numbers.indexOf(4, 4)) // 5
console.log(numbers.lastIndexOf(4, 4)) // 3

var person = { name: 'Nicholas' }
var people = [{ name: 'Nicholas' }]
var morePeople
/**
 * indexOf、lastIndexOf 在比较第一个参数与数组中的每一项时，会使用全等操作符
 */
console.log(people.indexOf(person)) // -1
console.log(morePeople.indexOf(person)) // 0
```

- `Array.prototype.every()`: 对数组中的每一项运行给定函数，如果该函数对每一项都返回 `true`，则返回 `true`。
- `Array.prototype.some()`: 对数组中的每一项运行给定函数，如果该函数对任一项返回 `true`，则返回 `true`。
- `Array.prototype.filter()`: 对数组中的每一项运行给定函数，返回该函数会返回 `true` 的项组成的数组。
- `Array.prototype.map()`: 对数组中的每一项运行给定函数，返回每次函数调用的结果组成的数组。
- `Array.prototype.forEach()`: 对数组中的每一项运行给定函数，这个方法没有返回值。

```js
// every
var numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1]
var everyResult = numbers.every((item, index, array) => {
  return item > 2
})
console.log(everyResult) // false
// some
var someResult = numbers.some((item, index, array) => {
  return item > 2
})
console.log(someResult) // true
// filter
var numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1]
var filterResult = numbers.filter((item, index, array) => {
  return item > 2
})
console.log(filterResult) // [3, 4, 5, 4, 3]
// map
var numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1]
var mapResult = numbers.map((item, index, array) => {
  return item * 2
})
console.log(mapResult) // [2, 4, 6, 8, 10, 8, 6, 4, 2]
// forEach
var numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1]
numbers.forEach((item, index, array) => {
  // 执行某些操作
})
```

- `Array.prototype.reduce()`
- `Array.prototype.reduceRight()`

`reduce()` 和 `reduceRight()` 方法都会迭代数组的所有项，然后构建一个最终返回的值。其中，`reduce()` 方法从数组的第一项开始，逐个遍历到最后。而 `reduceRight()` 则从数组的最后一项开始，向前遍历到第一项。

这两个参数都接受两个参数: 一个在每一项上调用的函数和（可选的）作为归并基础的初始值。传给 `reduce` 和 `reduceRight` 的函数接受 4 个参数：前一个值、当前值、项的索引和数组对象。这个函数返回的任何值都会作为第一个参数自动传给下一项。第一次迭代发生在数组的第二项上，因此第一个参数是数组的第一项，第二个参数就是数组的第二项。

```js
// 数组求和
var values = [1, 2, 3, 4, 5]
var sum = values.reduce((prev, cur, index, array) => {
  return prev + cur
})
console.log(sum)
// 数组求乘积
var values = [1, 2, 3, 4, 5]
var pro = values.reduce((prev, cur, index, array) => {
  return prev * cur
})
console.log(pro) // 120
/**
 * 【累加对象数组里的值】
 * 要累加对象数组中包含的值，必须提供初始值，以便各个item正确通过你的函数。
 */
var values = [{ x: 1 }, { x: 2 }, { x: 3 }]
var sum = values.reduce((prev, cur) => {
  return prev + cur.x
}, 0)
console.log(sum) // 6
// 求最大值
var values = [1, 2, 3, 4, 5]
var max = values.reduce((prev, cur, index, array) => {
  return prev > cur ? prev : cur
})
console.log(max) // 5
// 计算数组中每个元素出现的次数
var names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice']
var countedNames = names.reduce((allNames, name) => {
  if (allNames.indexOf(name) > -1) {
    allNames[name]++
  } else {
    allNames[name] = 1
  }
  return allNames
})
// 按属性对object array分类
var people = [
  { name: '张三', age: 26 },
  { name: '李扬', age: 25 },
  { name: '杨六', age: 25 },
  { name: '王五', age: 26 },
]
var groupBy = (objectArray, property) => {
  return objectArray.reduce((acc, cur) => {
    const key = cur[property]
    if (!acc[key]) {
      acc[key] = [cur]
    } else {
      acc[key].push(cur)
    }
    return acc
  }, {})
}
var groupedPeople = groupBy(people, 'age')
```

**reduce 高级用法:**

> 搬砖工小王拿到了这样的格式：`var arr = [ {n ame: 'brick1'}, {name: 'brick2'}, {name: 'brick3'} ]`
> 希望得到这样的数据格式：`brick1, brick2 & brick3`
> 当然数组异常流: `[{name:'brick1'}]` 和空数组传入得到 `"brick1"` 和空

```js
var array = [{ name: 'brick11' }, { name: 'brick12' }, { name: 'brick13' }]
var carryBricks = arr => {
  return arr.reduce((prev, cur, index, array) => {
    if (index === 0) {
      return cur.name
    } else if (index === array.length - 1) {
      return prev + ' & ' + cur.name
    } else {
      return prev + ',' + cur.name
    }
  }, '')
}
console.log(carryBricks(array)) // "brick11,brick12 & brick13"
console.log(carryBricks([{ name: 'brick1' }])) // "brick1"
console.log(carryBricks([])) // ""
```

# ES2015/ES6

- `Array.from`：用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）

- `Array.of`：用于将一组值，转换为数组

- `arr.fill(value[, start[, end]])`：用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。不包括终止索引

- `find()`：用于找出第一个符合条件的数组成员

- `findIndex()`：返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回`-1`

- `entries()`，`keys()` 和 values()：`keys()`是对键名的遍历、`values()`是对键值的遍历，`entries()`是对键值对的遍历

# ES2016/ES7

- `copyWithin()`： 方法浅复制数组的一部分到同一数组中的另一个位置，并返回它，不会改变原数组的长度。
- `includes()`：返回一个布尔值，表示某个数组是否包含给定的值

# ES2019/ES10

- `flat()`：会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。
- `flatMap()`： 方法首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。它与 [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 连着深度值为1的 [flat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) 几乎相同，但 `flatMap` 通常在合并成一种方法的效率稍微高一些

# lodash

## 数组并集

- `_.union([arrays])`: 创建一个按顺序排列的唯一值的数组。所有给定数组的元素值使用 SameValueZero 做等值比较。（ `arrays`（数组）的并集，按顺序返回，返回数组的元素是唯一的）
- `_.unionBy([arrays], [iteratee=_.identity])`: 这个方法类似 `_.union` ，除了它接受一个 `iteratee` （迭代函数），调用每一个数组（`array`）的每个元素以产生唯一性计算的标准。`iteratee` 会传入一个参数：(`value`)。
- `_.unionWith([arrays], [comparator])`: 这个方法类似 `_.union`， 除了它接受一个 `comparator` 调用比较 `arrays` 数组的每一个元素。 `comparator` 调用时会传入 2 个参数： (`arrVal`, `othVal`)。

```js
import _ from 'lodash'
// union
_.union([2], [1, 2]) // [2, 1]

// unionBy
_.unionBy([2.1], [1.2, 2.3], Math.floor) // [2.1, 1.2]
// The `_.property` iteratee shorthand.
_.unionBy([{ x: 1 }], [{ x: 2 }, { x: 1 }], 'x') // [{ 'x': 1 }, { 'x': 2 }]

// unionWith
var objects = [
  { x: 1, y: 2 },
  { x: 2, y: 1 },
]
var others = [
  { x: 1, y: 1 },
  { x: 1, y: 2 },
]
_.unionWith(objects, others, _.isEqual) // [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
```

## 数组交集

- `_.intersection([arrays])`: 创建唯一值的数组，这个数组包含所有给定数组都包含的元素，使用 SameValueZero 进行相等性比较。（可以理解为给定数组的交集）
- `_.intersectionBy([arrays], [iteratee=_.identity])`: 这个方法类似 `_.intersection`，区别是它接受一个 `iteratee` 调用每一个 arrays 的每个值以产生一个值，通过产生的值进行了比较。结果值是从第一数组中选择。iteratee 会传入一个参数：`(value)`。
- `_.intersectionWith([arrays], [comparator])`: 这个方法类似 `_.intersection`，区别是它接受一个 `comparator` 调用比较 arrays 中的元素。结果值是从第一数组中选择。`comparator` 会传入两个参数：`(arrVal, othVal)`。

```js
import _ from 'lodash'
// intersection
_.intersection([2, 1], [4, 2], [1, 2])) // [2]

// intersectionBy
_.intersectionBy([2.1, 1.2], [4.3, 2.4], Math.floor) // [2.1]
// The `_.property` iteratee shorthand.
_.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x') // => [{ 'x': 1 }]

// intersectionWith
var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
_.intersectionWith(objects, others, _.isEqual) // [{ 'x': 1, 'y': 2 }]
```

## 数组差集

- `_.difference(array, [values])`: 创建一个具有唯一 array 值的数组，每个值不包含在其他给定的数组中。（即创建一个新数组，这个数组中的值，为第一个数字（array 参数）排除了给定数组中的值。）该方法使用 SameValueZero 做相等比较。结果值的顺序是由第一个数组中的顺序确定。
- `_.differenceBy(array, [values], [iteratee=_.identity])`: 这个方法类似 \_.difference ，除了它接受一个 iteratee （迭代器）， 调用 array 和 values 中的每个元素以产生比较的标准。 结果值是从第一数组中选择。iteratee 会调用一个参数：(value)。（首先使用迭代器分别迭代 array 和 values 中的每个元素，返回的值作为比较值）。
- `_.differenceWith(array, [values], [comparator])`: 这个方法类似 `_.difference` ，除了它接受一个 `comparator` （比较器），它调用比较 `array`，`values` 中的元素。 结果值是从第一数组中选择。`comparator` 调用参数有两个：`(arrVal, othVal)`。

```js
import _ from 'lodash'

// difference
_.difference([3, 2, 1], [4, 2]) // [3, 1]

// differenceBy
_.differenceBy([3.1, 2.2, 1.3], [4.4, 2.5], Math.floor) // [3.1, 1.3]
// The `_.property` iteratee shorthand.
_.differenceBy([{ x: 2 }, { x: 1 }], [{ x: 1 }], 'x') // [{ 'x': 2 }]

// differenceWith
var objects = [
  { x: 1, y: 2 },
  { x: 2, y: 1 },
]
_.differenceWith(objects, [{ x: 1, y: 2 }], _.isEqual) // [{ 'x': 2, 'y': 1 }]
```

## 数组分组

- `_.groupBy(collection, [iteratee=_.identity])`: 创建一个对象，`key` 是 `iteratee` 遍历 `collection`(集合) 中的每个元素返回的结果。 分组值的顺序是由他们出现在 `collection`(集合) 中的顺序确定的。每个键对应的值负责生成 `key` 的元素组成的数组。`iteratee` 调用 1 个参数： (`value`)。

```js
import _ from 'lodash'

_.groupBy([6.1, 4.2, 6.3], Math.floor) // { '4': [4.2], '6': [6.1, 6.3] }
// The `_.property` iteratee shorthand.
_.groupBy(['one', 'two', 'three'], 'length') // { '3': ['one', 'two'], '5': ['three'] }
const students = [
  { name: '杨俊宁', province: '河南' },
  { name: '宋光刚', province: '河南' },
  { name: '谢晧曜', province: '江苏' },
  { name: '李珂威', province: '河南' },
]
_.groupBy(students, 'province')
// { '江苏': [{ name: '谢晧曜', province: '江苏' }], '河南': [{ name: '杨俊宁', province: '河南' }, { name: '宋光刚', province: '河南' },{ name: '李珂威', province: '河南' }] }
```

## 删除数组项

### 根据断言删除数组项

- `remove`: 移除数组中 predicate（断言）返回为真值的所有元素，并返回移除元素组成的数组。predicate（断言） 会传入 3 个参数： (`value`, `index`, `array`)。

```js
import _ from 'lodash'

const array = [1, 2, 3, 4]
const evens = _.remove(array, value => {
  return value % 2 == 0
})
console.log(array) // => [1, 3]
console.log(evens) // => [2, 4]

const students = [
  { name: '杨俊宁', province: '河南' },
  { name: '宋光刚', province: '河南' },
  { name: '谢晧曜', province: '江苏' },
  { name: '李珂威', province: '河南' },
]
const removedStudent = _.remove(students, student => {
  return student.province === '江苏'
})
console.log(students)
// [{name: "杨俊宁", province: "河南"}, {name: "宋光刚", province: "河南"}, {name: "李珂威", province: "河南"}]
console.log(removedStudent)
// [{name: "谢晧曜", province: "江苏"}]
```

### 根据给定值删除数组项

- `_.pull(array, [values])`: 移除数组 array 中所有和给定值相等的元素，使用 SameValueZero 进行全等比较。
- `_.pullAll(array, values)`: 这个方法类似 \_.pull，区别是这个方法接收一个要移除值的数组。
- `_.pullAllBy(array, values, [iteratee=_.identity])`: 这个方法类似于 `_.pullAll` ，区别是这个方法接受一个 `iteratee`（迭代函数） 调用 `array` 和 `values`的每个值以产生一个值，通过产生的值进行了比较。`iteratee` 会传入一个参数： (`value`)。
- `_.pullAllWith(array, values, [comparator])`: 这个方法类似于 `_.pullAll`，区别是这个方法接受 `comparator` 调用 `array` 中的元素和 `values` 比较。`comparator` 会传入两个参数：(`arrVal`, `othVal`)。

> pull 系列和 difference 系列不同之处在于 pull 系列方法会改变数组 array

```js
import _ from 'lodash'

// pull
var array = [1, 2, 3, 1, 2, 3]
_.pull(array, 2, 3)
console.log(array) // [1, 1]

// pullAll
var array = [1, 2, 3, 1, 2, 3]
_.pullAll(array, [2, 3])
console.log(array) // [1, 1]

// pullAllBy
var array = [{ x: 1 }, { x: 2 }, { x: 3 }, { x: 1 }]
_.pullAllBy(array, [{ x: 2 }, { x: 3 }], 'x')
console.log(array) // [{ 'x': 1 }, { 'x': 1 }]

// pullAllWith
var array = [
  { x: 1, y: 2 },
  { x: 3, y: 4 },
  { x: 5, y: 6 },
]
_.pullAllWith(array, [{ x: 3, y: 4 }], _.isEqual)
console.log(array) // [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
```

- `_.pullAt(array, [indexes])`: 根据索引 `indexes`，移除 `array` 中对应的元素，并返回被移除元素的数组。

```js
import _ from 'lodash'

var array = [5, 10, 15, 20]
var evens = _.pullAt(array, 1, 3)

console.log(array) // [5, 15]
console.log(evens) // [10, 20]
```

- `_.without(array, [values])`: 创建一个剔除所有给定值的新数组，剔除值的时候，使用 SameValueZero 做相等比较。不像 `_.pull`, 这个方法会返回一个新数组。

```js
import _ from 'lodash'

_.without([2, 1, 2, 3], 1, 2) // [3]
```

## 数组去重

- `_.uniq(array)`: 创建一个去重后的 array 数组副本。使用了 SameValueZero 做等值比较。只有第一次出现的元素才会被保留。
- `_.uniqBy(array, [iteratee=_.identity])`: 这个方法类似 `_.uniq` ，除了它接受一个 `iteratee`（迭代函数），调用每一个数组（`array`）的每个元素以产生唯一性计算的标准。`iteratee` 调用时会传入一个参数：(`value`)。
- `_.uniqWith(array, [comparator])`: 这个方法类似 `_.uniq`， 除了它接受一个 `comparator` 调用比较 `array` 数组的每一个元素。 `comparator` 调用时会传入 2 个参数：(`arrVal`, `othVal`)。

```js
import _ from 'lodash'

// uniq
_.uniq([2, 1, 2]) // [2, 1]

// uniqBy
_.uniqBy([2.1, 1.2, 2.3], Math.floor) // [2.1, 1.2]
// The `_.property` iteratee shorthand.
_.uniqBy([{ x: 1 }, { x: 2 }, { x: 1 }], 'x') // [{ 'x': 1 }, { 'x': 2 }]

// uniqWith
var objects = [
  { x: 1, y: 2 },
  { x: 2, y: 1 },
  { x: 1, y: 2 },
]
_.uniqWith(objects, _.isEqual) // [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
```

## 数组排序

- `_.sortBy(collection, [iteratees=[_.identity]])`: 创建一个元素数组。 以 `iteratee` 处理的结果升序排序。 这个方法执行稳定排序，也就是说相同元素会保持原始排序。 `iteratees` 调用1个参数：(`value`)。可以使用 `Array.prototype.reverse` 方法倒序

```js
import _ from 'lodash'

var users = [
  { user: { name: 'fred' }, age: 48 },
  { user: { name: 'barney' }, age: 36 },
  { user: { name: 'fred' }, age: 40 },
  { user: { name: 'barney' }, age: 34 },
]

// The `_.property` iteratee shorthand.
_.sortBy(users, 'user.name')
/**
 * [
 *  {age: 34, user: "barney"},
 *  {age: 36, user: "barney"},
 *  {age: 40, user: "fred"},
 *  {age: 48, user: "fred"}
 * ]
 */
```

## 数组降维

- `_.flatten(array)`: 减少一级 `array` 嵌套深度。
- `_.flattenDeep(array)`: 将 `array` 递归为一维数组。
- `_.flattenDepth(array, [depth=1])`: 根据 `depth` 递归减少 `array` 的嵌套层级

```js
import _ from 'lodash'

// flatten
_.flatten([1, [2, [3, [4]], 5]]) // [1, 2, [3, [4]], 5]

// flattenDeep
_.flattenDeep([1, [2, [3, [4]], 5]]) // [1, 2, 3, 4, 5]

// flattenDepth
var array = [1, [2, [3, [4]], 5]]
_.flattenDepth(array, 1) // [1, 2, [3, [4]], 5]
_.flattenDepth(array, 2) // [1, 2, 3, [4], 5]
_.flattenDepth(array, 3) // [1, 2, 3, 4, 5]
```

## 获取部分元素

- `_.initial(array)`: 获取数组 `array` 中除了最后一个元素之外的所有元素（去除数组array中的最后一个元素）。
- `_.tail(array)`: 获取除了 `array` 数组第一个元素以外的全部元素。
