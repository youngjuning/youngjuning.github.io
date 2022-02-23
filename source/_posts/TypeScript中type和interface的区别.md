---
title: TypeScript中type和interface的区别
date: 2020-02-19 01:26:43
categories:
  - [前端开发, TypeScript]
tags:
---

![](https://i.loli.net/2020/02/19/MIStsCk9XxZgv3G.png)

<!--more-->

## 相同点

### 都可以描述一个对象或者函数

#### interface

```ts
interface User {
  name: string
  age: number
}
interface SetUser {
  (name: string, age: number) : void
}
```

#### type

```ts
type User {
  name: string
  age: number
}
type SetUser = (name:string, age: number) => void
```

### 都允许拓展（`extends`）

`interface` 和 `type` 都可以扩展，并且两者并不是相互独立的，也就是说 `interface` 可以 `extends` `type`，`type` 也可以 `extends` `interface`。**虽然效果差不多，但是两者语法不同**。

#### interface extends type

```ts
type Name = {
  name: string;
}
interface User extends Name {
  age: number
}
```

#### type extends interface

```ts
interface Name {
  name: string;
}
type User = Name & {
  age: number
}
```

## 不同点

### type 可以而 interface 不行

#### type可以声明基本类型别名，联合类型，元组等类型

```ts
// 基本类型别名
type Name = string
// 联合类型
interface Dog {
  wong()
}
interface Cat {
  miao()
}
type Pet = Dog | Cat

// 具体定义数组每个的类型
type PetList = [Dog, Pet]
```

#### type 语句中还可以使用 typeof 获取实例的类型进行赋值

```ts
// 当你想获取一个变量的类型时，使用 typeof
let div = document.createElement('div')
type B = typeof div
```

### interface 可以而 type 不行

interface 能够声明合并

```ts
interface User {
  name: string
  age: number
}

interface User {
  sex: string
}

/*
User 接口为 {
  name: string
  age: number
  sex: string
}
*/
```

## 总结

一般来说，如果不清楚什么时候用interface/type，能用 interface 实现，就用 interface , 如果不能就用 type 。
