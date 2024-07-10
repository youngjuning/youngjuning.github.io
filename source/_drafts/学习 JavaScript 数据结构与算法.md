---
title: 学习 JavaScript 数据结构与算法
date: 2022-04-12 21:43:51
cover: https://s2.loli.net/2022/04/12/I34q7dcmADfQSFw.png
categories:
  - [前端, JavaScript]
tags:
  - 数据结构
  - 算法
---

## 栈

栈是一种遵从后进先出（LIFO）原则的有序集合。新添加或待删除的元素都保存在栈的同一端，称作栈顶，另一端就叫栈底。

## 队列

### 普通队列

队列是遵循先进先出（FIFO，也称为先来先服务）原则的一组有序的项。队列在尾部添加新元素，并从顶部移除元素。最新添加的元素必须排在队列的末尾。

```js
class Queue {
  constructor() {
    // 声明一个 count 属性来帮助我们控制队列的大小
    this.count = 0;
    // 声明一个 lowestCount 变量来帮助我们追踪第一个元素
    this.lowestCount = 0;
    // 为了写出一个在获取元素时更高效的数据结构，我们将使用一个对象来存储我们的元素。
    this.items = {};
  }

  /**
   * 向队列添加元素
   * 向队列尾部添加一个（或多个）新的项
   */
  enqueue(element) {
    this.items[this.count] = element;
    this.count++;
  }

  /**
   * 从队列移出元素
   */
  dequeue() {
    if(this.isEmpty()) {
      return undefined;
    }
    // 如果队列不为空，我们将暂存队列头部的值，以便该元素被移出后将它返回。
    const result = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    // 我们也需要将 lowestCount 加 1。
    this.lowestCount++;
    return result;
  }

  /**
   * 查看队列头元素
   * 该方法会返回队列最前面的项（把 lowestCount 作为键名来获取元素值。）
   */
  peek() {
    if(this.isEmpty()) {
      return undefined;
    }
    return this.items[this.lowestCount];
  }

  /**
   * 检查队列是否为空并获取它的长度
   */
  isEmpty() {
    return this.count - this.lowestCount === 0;
  }

  /**
   * 获取队列尺寸
   */
  size() {
    return this.count - this.lowestCount;
  }

  /**
   * 清空队列
   */
  clear() {
    this.items = {};
    this.count = 0;
    this.lowestCount = 0;
  }

  toString() {
    if (this.isEmpty()) {
      return '';
    }
    let objString = `${this.items[this.lowestCount]}`;
    for (let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString},${this.items[i]}`;
    }
    return objString;
  }
}
```

只有 enqueue 方法和 dequeue 方法可以添加和移除元素，这样就确保了 Queue 类遵循先进先出原则。
