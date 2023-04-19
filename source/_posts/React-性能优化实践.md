---
title: React 性能优化实践
description:  React 组件性能优化的核心是减少渲染真实 DOM 节点的频率，减少 VirtualDOM 比对的频率。
date: 2023-03-05 17:22:41
categories:
  - [前端, React]
tags:
  - React
  - 性能优化
  - React.memo
  - useMemo
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>


## React Profiler

React 16.5 添加了对开发者工具的 Profiler 插件的支持。该插件使用了 React 的 Profiler API 来收集所有组件渲染的耗时，目的是为了找出 React 应用程序的性能瓶颈。

这个“Profiler”面板初始为空，你可以点击 record 按钮开始分析：

![洛竹](https://zh-hans.reactjs.org/static/bae8d10e17f06eeb8c512c91c0153cff/ad997/start-profiling.png)

当你开始记录之后，开发者工具将在每次应用程序渲染时自动收集性能数据。 你可以和平常一样使用你的应用程序， 当你完成分析之后，请点击“Stop”按钮。

![洛竹](https://zh-hans.reactjs.org/static/45619de03bed468869f7a0878f220586/ad997/stop-profiling.png)

## 优化法则

- 法则一：动静分离，将变的部分与不变的部分分离。
- 法则二：缓存，复杂计算和有昂贵消耗的组件 memo 化，比如 React 的 useMemo、useCallback，Redux 的 useSelector。

下面我们将根据这些法则结合实际开发中案例进行分析。

## 案例一

我们都知道，当 state 更新后，整个组件以及它的子组件都会重新更新，尽管子组件没有依赖任何 state，下面的例子就能很好地展示这个问题。

```tsx
import { useState } from 'react'

function Random() {
  return <h1>{Math.random()}</h1>
}

function Count(props: { count: number}) {
  return (
    <h2>{props.count}</h2>
  )
}

function App() {
  const [count, setCount] = useState(0)
  const onAdd = () => {
    setCount(count + 1)
  }
  const onMinus = () => {
    setCount(count - 1)
  }
  return (
    <div className="App">
      <Random />
      <Count count={count}/>
      <button onClick={onMinus}>➖</button>
      <button onClick={onAdd}>➕</button>
    </div>
  );
}

export default App;
```

在以上示例中，我们声明了一个显示随机数的组件和一个依赖 count 状态的数字显示组件，使用 React Profiler 工具分析如下：

![洛竹](https://s2.loli.net/2022/09/25/zKn9HslamJi6Ro5.png)

就像预期的那样，App、Count 和 Random 组件都更新了，从工具中我们可以看到它们更新的原因：

- App：Hook 1 changed.
- Count：Props changed（count）.
- Random：The parent component rendered.

我们可以看到这里边除了 Count 是因为 count 更新之外，其他组件的更新都是被无辜牵连的。根据法则一，我们可以尝试将 Count 组件和它依赖的状态封装起来。

```tsx
import { useState } from 'react'

function Random() {
  return <h1>{Math.random()}</h1>
}

function Count() {
  const [count, setCount] = useState(0)
  const onAdd = () => {
    setCount(count + 1)
  }
  const onMinus = () => {
    setCount(count - 1)
  }
  return (
    <>
      <h2>{count}</h2>
      <button onClick={onMinus}>➖</button>
      <button onClick={onAdd}>➕</button>
    </>
  )
}

function App() {
  return (
    <div className="App">
      <Random />
      <Count />
    </div>
  );
}

export default App;
```

从下图 Profiler 分析可以看到当 count 更新时，只有 Count 组件更新了。

![洛竹](https://s2.loli.net/2022/09/25/YheAM9ZuviaJDmo.png)

上面的示例太过理想化，大部分时候，负责更新状态的组件和负责展示状态的组件可能并不在一起，也就没办法抽离动态组件。比如我们将示例中的组件位置做下调整：

```tsx
// ...
function App() {
  return (
    <div className="App">
      <Count count={count}/>
      <Random />
      <button onClick={onMinus}>➖</button>
      <button onClick={onAdd}>➕</button>
    </div>
  );
}
```

这个时候，我们就需要法则二来帮助我们，最简单的是通过 props.children 属性来实现，原理上是一种依靠缓存的 bailout 优化方案。

```tsx
import React, { useState } from 'react'

interface CountProps {
  children?: JSX.Element
}

function Random() {
  return <h1>{Math.random()}</h1>
}

function Count(props: CountProps) {
  const [count, setCount] = useState(0)
  const onAdd = () => {
    setCount(count + 1)
  }
  const onMinus = () => {
    setCount(count - 1)
  }
  return (
    <>
      <h2>{count}</h2>
      {props.children}
      <button onClick={onMinus}>➖</button>
      <button onClick={onAdd}>➕</button>
    </>
  )
}

function App() {
  return (
    <div className="App">
      <Count>
        <Random />
      </Count>
    </div>
  );
}

export default App;
```

# bailout

想要解释为什么案例一中使用 props.children 可以解决重复渲染，就要了解一下 React bailout 机制。

bailout（bail out of re-rendering）可以简单理解为是否重新渲染。

要触发 bailout 函数，需要同时满足以下条件：

1. oldProps === newProps 并且 Context 没有改变
2. !includesSomeLane(renderLanes, updateLanes)

当前 fiber 上是否存在更新，如果存在那么更新的优先级是否和本次整棵 Fiber 树调度的优先级一致？如果一致代表该组件上存在更新，需要走 render 逻辑。

```tsx
// beginWork 函数
if (current !== null) {
  const oldProps = current.memoizedProps;
  const newProps = workInProgress.pendingProps;
  if (
    oldProps !== newProps ||
    hasLegacyContextChanged()
  ) {
    didReceiveUpdate = true;
  } else if (!includesSomeLane(renderLanes, updateLanes)) {
    didReceiveUpdate = false;
    // 命中 bailoutOnAlreadyFinishedWork
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
  }
}
```

bailout 函数逻辑大致是：尽量复用 fiber，不进行 render。fiber 复用，判断 fiber 的子树是否有 work。有，返回 child，继续遍历子树。无，返回 null，跳过子树。

```tsx
// bailoutOnAlreadyFinishedWork 函数
function bailoutOnAlreadyFinishedWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  if (current !== null) {
    // 重用以前的 context 依赖关系
    workInProgress.dependencies = current.dependencies;
  }

  // 检测子树(childLanes)是否有 work
  if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
    //无，跳过子树
    return null;
  }

  // 虽然 fiber 没有 work，但是它的子树有，克隆子树的 fiber 然后继续检查
  cloneChildFibers(current, workInProgress);
  return workInProgress.child;
}
```

案例一中，由于 children Random 组件的 props 没有发生改变，并且 lanes 也不在 renderLanes 上 ，Diff 组件命中 bailoutOnAlreadyFinishedWork。

lane 是 React 调度模型中的优先级模型。想象一下不同的赛车疾驰在不同的赛道。内圈的赛道总长度更短，外圈更长。某几个临近的赛道的长度可以看作差不多长。

lane 模型借鉴了同样的概念，使用 31 位的二进制表示 31 条赛道，位数越小的赛道优先级越高，某些相邻的赛道拥有相同优先级。

## 案例二

```tsx
import React, { useState, useContext } from 'react'

const countContext = React.createContext<number>(0);
const CountProvider = countContext.Provider;

function Random() {
  return <h1>{Math.random()}</h1>
}

interface CountProps {
  children?: JSX.Element
  onAdd: () => void
  onMinus: () => void
}
function Count(props: CountProps) {
  const count = useContext(countContext);
  return (
    <>
      <h2>{count}</h2>
      <button onClick={props?.onMinus}>➖</button>
      <button onClick={props?.onAdd}>➕</button>
    </>
  )
}

function App() {
  const [count, setCount] = useState(0)
  const onAdd = () => {
    setCount(count + 1)
  }
  const onMinus = () => {
    setCount(count - 1)
  }
  return (
    <div className="App">
      <CountProvider value={count}>
        <Count onAdd={onAdd} onMinus={onMinus} />
        <Random />
      </CountProvider>
    </div>
  );
}

export default App;
```

该案例中我们引入了 Context，当 context 的 value 改变时，

## 参考链接

- [React Profiler 介绍](https://zh-hans.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)
- [深入 React Reconciliation Bailout 機制](https://blog.wuct.me/react-internal-reconciliation-bailout-587695eb05a8?gi=c4bc84e7c1df)
- [我在大厂写React学到了什么？性能优化篇](https://jishuin.proginn.com/p/763bfbd32552)
- [react 性能优化 - children如何避免不必要的渲染](https://juejin.cn/post/7090466770774917150)
- [React 性能优化，你需要知道的一切](https://juejin.cn/post/7092593300233781285#heading-4)
