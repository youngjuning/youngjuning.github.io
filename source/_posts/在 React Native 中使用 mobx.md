---
title: 在 React Native 中使用 Mobx
description: Mobx 是简单、可扩展的状态管理，React 和 MobX 是一对强力组合。React 通过提供机制把应用状态转换为可渲染组件树并对其进行渲染。而 MobX 提供机制来存储和更新应用状态供 React 使用。
cover: https://cdn.jsdelivr.net/gh/youngjuning/images/202109241156069.png
date: 2020-01-29 20:46:38
categories:
  - [前端, React Native]
tags:
  - Mobx
  - React Native
---

Mobx 是简单、可扩展的状态管理，React 和 MobX 是一对强力组合。React 通过提供机制把应用状态转换为可渲染组件树并对其进行渲染。而 MobX 提供机制来存储和更新应用状态供 React 使用。

## 安装

```sh
$ yarn add mobx
# React 绑定库
$ yarn add mobx-react
```

## 启用装饰器语法

### TypeScript

在 `tsconfig.json` 中启用编译器选项 `"experimentalDecorators": true` 。

### Babel

在 Babel 中配置 MobX 的方式是使用 mobx preset，这种方式更方便，其中包含了装饰器及其他几个经常与 mobx 一起使用的插件:

```sh
$ yarn add babel-preset-mobx -D
```

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset', 'mobx'],
}
```

## 核心概念

### `@observable`: 可观察的状态

装饰器可以在 ES7 或者 TypeScript 类属性中属性使用，将其转换成可观察的。 `@observable` 可以在实例字段和属性 `getter` 上使用。 对于对象的哪部分需要成为可观察的，`@observable` 提供了细粒度的控制。

```js
import { observable, computed } from 'mobx'

class OrderLine {
  @observable price = 0
  @observable amount = 1

  @computed get total() {
    return this.price * this.amount
  }
}
```

### `@computed`: 计算值

> 黄金法则: 如果你想创建一个基于当前状态的值时，请使用 `computed`。

计算值(computed values)是可以根据现有的状态或其它计算值衍生出的值。 概念上来说，它们与 excel 表格中的公式十分相似。 不要低估计算值，因为它们有助于使实际可修改的状态尽可能的小。 此外计算值还是高度优化过的，所以尽可能的多使用它们。

不要把 `computed` 和 `autorun` 搞混。它们都是响应式调用的表达式，但是，如果你想响应式的产生一个可以被其它 `observer` 使用的值，请使用 `@computed`，如果你不想产生一个新值，而想要达到一个效果，请使用 `autorun`。 举例来说，效果是像打印日志、发起网络请求等这样命令式的副作用。

### `@action`: 修改可观察状态

只有在严格模式(默认是不启用)下使用 MobX 时才需要 `action` 包装。 建议使用 `action`，因为它将帮助你更好地组织应用，并表达出一个函数修改状态的意图。 同时,

```js
class Ticker {
  @observable tick = 0

  @action increment = () => {
    this.tick++
  }
}

const ticker = new Ticker()
setInterval(ticker.increment, 1000)
```

### `runInAction`: 异步 Action

`runInAction` 是个简单的工具函数，它接收代码块并在(异步的)动作中执行。这对于即时创建和执行动作非常有用，例如在异步过程中。`runInAction(f)` 是 `action(f)()` 的语法糖。

```js
class Store {
  @observable data = []

  asyncAction = async () => {
    const getData = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ data: [] })
      }, 2000)
    })
    const { data } = await getData()
    runInAction(() => {
      this.data = data
    })
  }
}
```

## 最佳实践

- 不要传递基础类型值给子组件，使用对象包裹或将整个 store 传给子组件
- 在所有渲染 `@observable` 的组件上使用 `@observer`
- 不要拷贝可观察属性并存储在本地
- Render 回调函数不是 render 方法的一部分
- 间接引用值尽可能晚的使用
- 使用大量的小组件
- 在专用组件中渲染列表项
