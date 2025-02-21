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
- JS 数组是动态大小的，会随着数据添加而自动增长。

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

```js
// 创建一个包含 [1, 2, 3] 的数组
let arr = Array.of(1, 2, 3);
```

### 使用 `Array.fill` 方法

```js
// 创建一个长度为 5 的数组，元素全为 0。时间复杂度为 O(N)
let arr = new Array(5).fill(0);
```

## 插入元素

### 在末尾插入元素

> 时间复杂度为 O(1)

```js
const arr = [1, 2, 3];
arr.push(4); // 在末尾插入元素 4
console.log(arr) // [1, 2, 3, 4]
```

### 在开头插入元素

> 时间复杂度为 O(N)

```js
const arr = [1, 2, 3];
arr.unshift(0); // 在开头插入元素 0
console.log(arr); // [0, 1, 2, 3]
```

### 在任意位置插入元素

> 时间复杂度为 O(N)

`splice()` 方法可以在数组的任意位置插入元素。它接受三个参数：

- 起始索引
- 要删除的元素的数量（如果不需要删除元素，设置为 `0`）
- 要插入的元素（可以是一个或多个）

```js
const arr = [1, 2, 3];
arr.splice(1, 0, 1.5); // 在索引 1 的位置插入元素 1.5。
console.log(arr) // [1, 1.5, 2, 3]
```

## 删除元素

### 从末尾删除元素

> 时间复杂度为 O(1)

```js
const arr = [1, 2, 3];
arr.pop(); // 删除末尾元素 3。
console.log(arr) // [1, 2]
```

### 从开头删除元素

> 时间复杂度为 O(N)

```js
const arr = [1, 2, 3];
arr.shift(); // 删除开头元素 1。
console.log(arr); // [2, 3]
```

### 在任意位置删除元素

> 时间复杂度为 O(N)

`splice()` 方法可以删除数组的任意位置元素。它接受两个参数：

- 起始索引
- 要删除的元素的数量（如果不需要删除元素，设置为 `0`）
- 要插入的元素（可以是一个或多个）

```js
const arr = [1, 2, 3];
arr.splice(1, 1); // 删除索引 1 的元素 2。
console.log(arr) // [1, 3]
```

## 修改元素

### 根据索引修改元素

> 时间复杂度为 O(1)

```js
const arr = [1, 2, 3];
arr[0] = 100;
console.log(arr); // [100, 2, 3]
```

### 使用 `splice` 方法

> 时间复杂度为 O(N)

`splice()` 方法可以删除数组的任意位置元素。它接受两个参数：

- 起始索引
- 要删除的元素的数量（如果不需要删除元素，设置为 `0`）
- 要插入的元素（可以是一个或多个）

当你需要修改数组中连续的多个元素时，`splice()` 方法非常有用。

```js
const arr = [1, 2, 3];
arr.splice(1, 1, 6); // 从索引 2 开始，删除 1 个元素，并插入新元素 6。
console.log(arr); // [1, 6, 3]
```

## 查询元素

### 根据索引查询元素值

> 时间复杂度为 O(1)

```js
const arr = [1, 2, 3];
const element = arr[1]; // 查询索引 1 的元素 2。
console.log(element); // 2
```

### 根据元素值查找索引

> 时间复杂度为 O(N)

```js
const arr = [1, 2, 3];
const index = arr.indexOf(2); // 查询元素 2 的索引 1。
console.log(index); // 1
```

# 链表

链表（Linked List）是一种常见的线性数据结构，它由一系列节点（Node）组成，每个节点包含两部分：数据域和指针域。数据域用于存储实际的数据，指针域则存储指向下一个节点的引用（在单链表中），通过这些指针将各个节点链接起来形成一个链式结构。

链表存储有序的元素集合，但不同于数组，链表中的元素在内存中不是连续放置的，而是通过指针相互关联。

## 链表的特点

- 插入和删除的效率高：在链表中插入或删除节点，只需要修改指针，时间复杂度为 O(1)。
- 随机访问效率低：由于链表中的节点在内存中不是连续存储的，不能像数组那样通过下标直接访问元素，需要从头节点开始依次遍历，时间复杂度为 O(n)。

## 链表的类型

- 单链表：每个节点包含一个数据元素和一个指向下一个节点的指针。链表的最后一个节点的指针通常指向 `null`，表示链表的结束。
- 双向链表：每个节点除了包含数据元素和指向下一个节点的指针外，还包含一个指向前一个节点的指针。这种结构允许在链表中双向遍历。
- 循环链表：单循环链表的最后一个节点的指针指向头节点，形成一个闭环；双循环链表则是双向链表的首尾相连形成闭环。

## 创建链表

### 节点类的实现

- 链表最后一个节点的下一个元素始终是 `undefined` 或 `null`。
- 当一个 Node 实例被创建时，它的 `next` 指针总是 `undefined`。这没问题，因为我们知道它会是链表的最后一项。

```js
class ListNode {
  constructor(element) {
    // 数据域，存储节点的值
    this.element = element;
    // 指针域，指向下一个节点
    this.next = undefined;
  }
}
```

### 链表类的实现

```js
class LinkedList {
  constructor() {
    // 存储链表中的元素数量
    this.count = 0;
    // 头节点，初始化为 undefined
    this.head = undefined;
  }
}
```

## 向链表尾部添加元素

```js
class LinkedList {
  constructor() {
    this.count = 0;
    this.head = undefined;
  }

  push(element) {
    const node = new ListNode(element);
    let current;
    if (this.head == null) {
      // 如果链表为空，将头节点指向新节点
      this.head = node;
    } else {
      current = this.head;
      // 遍历链表，找到最后一个节点
      while (current.next != null) {
        current = current.next;
      }
      // 将最后一个节点的 next 指针指向新节点
      current.next = node;
    }
    // 递增链表的长度
    this.count++;
  }
}
```

## 循环迭代链表直到目标位置

循环到目标 index 的代码片段在 LinkedList 类的方法中很常见、因此我们将其提取到一个单独的方法中，这样就可以在不同的地方复用它。

> 注意：循环停止条件是小于目标 index，而不是小于等。这是因为目标的前一个节点的 next 就是目标节点。

```js
class LinkedList {
  constructor() {
    this.count = 0;
    this.head = undefined;
  }

  getElementAt(index) {
    // 检查越界值
    if (index >= 0 && index <= this.count) {
      let current = this.head;
      for (let i = 0; i < index && current != null; i++) {
        current = current.next;
      }
      return current;
    }

    // 显式声明返回值
    return undefined;
  }
}
```

## 移除指定位置的元素

- 移除第一个元素：要做的就是让 `head` 指向列表的第二个元素。我们将用 `current` 变量创建一个对链表第一个元素的引用。这样 `current` 变量就是对链表中第一个元素的引用。如果把 `head` 赋为 `current.next`，就会移除第一个元素。
- 移除最后一个或中间某个元素：需要迭代链表的节点，直到找到要移除元素的前一个元素，我们用 `previous` 变量表示对当前元素的前一个元素的引用。在迭代到目标元素之后，`current` 变量会持有我们想从链表中移除的节点。因此，要从链表中移除当前元素，要做的就是将 `previous.next` 赋值为 `current.next`。

```js
class LinkedList {
  constructor() {
    this.count = 0;
    this.head = undefined;
  }

  getElementAt(index) {
    // 检查越界值
    if (index >= 0 && index <= this.count) {
      let current = this.head;
      // 迭代整个链表直到目标 index。结束循环时，node 元素将是 index 位置元素的引用。
      for (let i = 0; i < index && current != null; i++) {
        current = current.next;
      }
      return current;
    }
    return undefined;
  }

  /**
   * 从链表的特定位置移除一个元素。
   * @param {number} index - 要移除的元素的索引。
   * @returns {any} - 被移除的元素的值。
   */
  removeAt(index) {
    // 检查越界值
    if (index >= 0 && index < this.count) {
      let current = this.head;
      // 移除第一项
      if (index === 0) {
        this.head = current.next;
      } else {
        const previous = this.getElementAt(index - 1);
        current = previous.next;
        // 将 previous 与 current 的下一项链接起来：跳过 current，从而移除它
        previous.next = current.next;
      }
      this.count--;
      return current.element;
    }
    return undefined; // 如果索引无效，则返回 undefined
  }
}
```

验证：

```js
const list = new LinkedList();
list.push(5);
list.push(10);
list.push(15);
list.push(20);

// 验证删除指定元素
list.removeAt(1);
console.info(list);
```

![移除指定位置的元素](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1739283779711.png)

如图可以看到，10 被成功移除了。

## 在任意位置插入元素

```js
class LinkedList {
  constructor() {
    this.count = 0;
    this.head = undefined;
  }

  /**
   * 在任意位置插入元素
   */
  insert(element, index) {
    // 由于我们处理的是位置，就需要检查越界值
    if (index >= 0 && index <= this.count) {
      const node = new ListNode(element);
      if (index === 0) {
        // 在第一个位置添加
        const current = this.head;
        node.next = current;
        this.head = node;
      } else {
        const previous = this.getElementAt(index - 1);
        const current = previous.next;
        node.next = current;
        previous.next = node;
      }
      this.count++; // 更新链表长度
      return true;
    }

    return false;
  }
}
```

> 注意：使用变量引用我们需要控制的节点非常重要，这样就不会丢失节点之间的链接。我们可以只使用一个变量（previous），但那样会很难控制节点之间的链接。
> 因此，最后声明一个额外的 current 变量来帮助我们处理这些引用。

验证：
```js
const list = new LinkedList();
list.push("张三");
list.push("王五");
list.insert("李四", 1);
```

![在任意位置插入元素](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1739287449033.png)

如图，我们成功在索引 1 的位置插入了 15。

## 返回一个元素的位置

```js
const defaultEquals = (a, b) => {
  return a === b;
}
class LinkedList {
  constructor(equalsFn = defaultEquals) {
    this.count = 0;
    this.head = undefined;
  }

  indexOf(element) {
    let current = this.head;
    for (let i = 0; i < this.count && current != null; i++) {
      if (this.equalsFn(element, current.element)) {
        return i;
      }
      current = current.next;
    }
    return -1;
  }
}
```

- 一如既往，需要一个变量来帮助我们循环访问列表。该变量是 current，它的初始值是 head。
- 然后迭代元素，从 head（索引 0） 开始，直到链表长度（count 变量）为止。为了确保不会发生运行时错误，我们可以验证下 current 变量是否为 null 或 undefined。

## 从链表中移除元素

```js
class LinkedList {
  constructor() {
    this.count = 0;
    this.head = undefined;
  }
  remove(element) {
    const index = this.indexOf(element);
    return this.removeAt(index);
  }
}
```

## isEmpty、size 和 getHead 方法

```js
class LinkedList {
  constructor() {
    this.count = 0;
    this.head = undefined;
  }
  isEmpty() {
    return this.count === 0;
  }
  size() {
    return this.count;
  }
  getHead() {
    return this.head;
  }
}
```

- size：返回链表包含的元素个数，与数组的 length 属性类似。
- getHead：返回链表包含的元素个数，与数组的 length 属性类似。
- isEmpty：在链表中不包含元素时，返回 true，如果链表长度大于 0 则返回 false。

## toString 方法

```js
class LinkedList {
  constructor() {
    this.count = 0;
    this.head = undefined;
  }

  toString() {}
}
```
