---
title: 2023 Rollup 插件机制源码解析
date: 2023-04-06 23:41:26
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680796317834.png
description: 一个 Rollup 插件是由一个或多个属性、构建钩子函数、输出钩子函数组成的对象，插件还需要符合一些官方的约定。一个插件应该作为一个包来发布，这个包导出一个可以用插件特定的选项来调用的函数，并且该函数返回一个对象。
categories:
  - [前端, 前端工程化]
  - [前端, 源码解析]
tags:
  - Rollup 源码解析
  - Rollup 插件机制
  - tapable
---

## `rollup -c` 简要流程

![rollup -c 简要流程](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bd4a66beffc4b6182498a4bda07ce8f~tplv-k3u1fbpfcp-zoom-1.image)

## 插件系统相关模块

- Graph: 全局唯一的图，包含入口以及各种依赖的相互关系，操作方法，缓存等。是 rollup 的核心
- PluginDriver: 插件驱动器，调用插件和提供插件环境上下文等

## 插件机制分析

### 概述

一个 Rollup 插件是由一个或多个属性、构建钩子函数、输出钩子函数组成的对象，插件还需要符合一些官方的约定。一个插件应该作为一个包来发布，这个包导出一个可以用插件特定的选项来调用的函数，并且该函数返回一个对象。

插件允许你自定义 Rollup 的行为，比如，打包之前转换代码或者在你的 `node_modules` 文件夹中查找第三方包。

官方插件维护在 [rollup/plugins][plugins] 仓库，社区精选插件维护在 [rollup/awesome][awesome-plugins]。如果你想给某个插件提建议，请提交一个 pr。

[plugins]: https://github.com/rollup/plugins
[awesome-plugins]: https://github.com/rollup/awesome

### 一个简单的例子

下面的插件可以在不访问文件系统的前提下拦截任何 `virtual-module` 的导入。例如，如果你想在浏览器中使用 Rollup，这是必要的。它甚至可以用来替换入口点，如例子中所示。

```js
// index.js
export default function myExample() {
  return {
    name: 'my-example', // 名字会在 warnings 和 errors 中显示
    resolveId(source) {
      if (source === 'virtual-module') {
        return source; // 这表明 rollup 不应该询问其他插件或检查文件系统来寻找这个 ID。
      }
      return null; // 其他的 ID 应该按照通常的方式处理
    },
    load(id) {
      if (id === 'virtual-module') {
        return 'export default "This is virtual!"'; // "virtual-module" 的源码
      }
      return null; // 其他的 ID 应该按照通常的方式处理
    },
  };
}

// rollup.config.js
import myExample from './index';

export default {
  input: 'virtual-module', // 被我们的插件解析
  plugins: [myExample()],
  output: [
    {
      file: 'bundle.js',
      format: 'es',
    },
  ],
};
```

### 约定

- 插件应该有一个清晰的名字，并且必须带上 `rollup-plugin-` 前缀。
- 在 `package.json` 中包含 `rollup-plugin` 关键字。
- 插件应该被测试，我们推荐 mocha 或者 ava 这类开箱支持 promises 的库。
- 尽可能使用异步方法。
- 使用英文编写插件文档
- 如果合适的话，确保你的插件输出正确的 sourcemap
- 如果你的插件使用 'virtual modules'（比如帮助函数），给模块名加上 `\0` 前缀。这可以阻止其他插件执行它。

### 钩子函数

[rollup.rollup]: https://github.com/rollup/rollup/blob/07b3a02069594147665daa95d3fa3e041a82b2d0/cli/run/build.ts#L34

rollup 插件的核心是钩子函数，rollup 钩子函数分为两类：

#### 构建钩子函数

为了与构建过程交互，你的插件对象需要包含一些构建钩子函数。构建钩子是构建的各个阶段调用的函数。构建钩子函数可以影响构建执行方式、提供构建的信息或者在构建完成后修改构建。rollup 中有不同的构建钩子函数：

- `async`：这类 hook 也可以返回一个解析为相同类型值的 promise;否则，hook 将被标记为 `sync`。
- `first`：如果有多个插件实现了这个 hook，hook 将依次运行，直到钩子返回一个非 `null` 或非 `undefined` 的值。
- `sequential`：如果有多个插件实现了这个 hook，所有的插件都将按照指定的插件顺序运行。如果一个 hook 是异步的，这种类型的后续 hook 将一直等待，直到当前 hook 被解析。
- `parallel`：如果有多个插件实现了这个 hook，所有的插件都将按照指定的插件顺序运行。如果一个 hook 是异步的，这种类型的后续 hook 将并行运行，而不等待当前钩子。

构建钩子函数在构建阶段执行，它们被 [`rollup.rollup(inputOptions)`][rollup.rollup] 触发。它们主要关注在 Rollup 处理输入文件之前定位、提供和转换输入文件。构建阶段的第一个钩子是 `options`，最后一个钩子总是 `buildEnd`，除非有一个构建错误，在这种情况下 `closeBundle` 将在这之后被调用。

此外，在观察模式下，`watchChange` 钩子可以在任何时候被触发，以通知新的运行将在当前运行产生其输出后被触发。另外，当 watcher 关闭时，closeWatcher 钩子函数将被触发。

#### 输出生成钩子函数

输出生成钩子函数可以提供关于生成的包的信息并在构建完成后立马执行。它们和构建钩子函数拥有一样的工作原理和相同的类型，但是不同的是它们分别被 ·[`bundle.generate(output)`](https://github.com/rollup/rollup/blob/07b3a02069594147665daa95d3fa3e041a82b2d0/cli/run/build.ts#L44) 或 [`bundle.write(outputOptions)`](https://github.com/rollup/rollup/blob/07b3a02069594147665daa95d3fa3e041a82b2d0/cli/run/build.ts#L64) 调用。只使用输出生成钩子的插件也可以通过输出选项传入，因为只对某些输出运行。

输出生成阶段的第一个钩子函数是 [outputOptions](https://github.com/rollup/rollup/blob/07b3a02069594147665daa95d3fa3e041a82b2d0/src/Bundle.ts#L50)，如果输出通过 [bundle.generate(...)](https://github.com/rollup/rollup/blob/master/cli/run/build.ts#L44) 成功生成则第一个钩子函数是 [generateBundle](https://github.com/rollup/rollup/blob/master/src/Bundle.ts#L73)，如果输出通过 [`bundle.write(...)`](https://github.com/rollup/rollup/blob/07b3a02069594147665daa95d3fa3e041a82b2d0/src/watch/watch.ts#L200) 生成则最后一个钩子函数是 [`writeBundle`](https://github.com/rollup/rollup/blob/master/src/rollup/rollup.ts#L176)，另外如果输出生成阶段发生了错误的话，最后一个钩子函数则是 [renderError](https://github.com/rollup/rollup/blob/master/src/Bundle.ts#L70)。

另外，[closeBundle](https://github.com/rollup/rollup/blob/master/src/rollup/rollup.ts#L59) 可以作为最后一个钩子被调用，但用户有责任手动调用 `bundle.close()` 来触发它。CLI 将始终确保这种情况发生。

#### 钩子函数加载实现

[`PluginDriver`](https://github.com/rollup/rollup/blob/07b3a02069594147665daa95d3fa3e041a82b2d0/src/utils/PluginDriver.ts#L124) 中有 9 个 hook 加载函数。主要是因为每种类别的 hook 都有同步和异步的版本。

![rollup 钩子函数加载实现](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bba7776f98d4cbc9d184101d1f1b752~tplv-k3u1fbpfcp-zoom-1.image)

**1.hookFirst：**

> 加载 `first` 类型的钩子函数，场景有 `resolveId`、`resolveAssetUrl` 等

```js
function hookFirst<H extends keyof PluginHooks, R = ReturnType<PluginHooks[H]>>(
  hookName: H,
  args: Args<PluginHooks[H]>,
  replaceContext?: ReplaceContext | null,
  skip?: number | null
): EnsurePromise<R> {
  // 初始化 promise
  let promise: Promise<any> = Promise.resolve();
  // this.plugins 在实例化 Graph 的时候，进行了初始化
  for (let i = 0; i < this.plugins.length; i++) {
    if (skip === i) continue;
    // 覆盖之前的 promise，换言之就是串行执行钩子函数
    promise = promise.then((result: any) => {
      // 返回非 null 或 undefined 的时候，停止运行，返回结果
      if (result != null) return result;
      // 执行钩子函数
      return this.runHook(hookName, args as any[], i, false, replaceContext);
    });
  }
  // 返回 hook 过的 promise
  return promise;
}
```

**2.hookFirstSync**：

> hookFirst 的同步版本，使用场景有 `resolveFileUrl`、`resolveImportMeta` 等

```js
function hookFirstSync<H extends keyof PluginHooks, R = ReturnType<PluginHooks[H]>>(
  hookName: H,
  args: Args<PluginHooks[H]>,
  replaceContext?: ReplaceContext
): R {
  for (let i = 0; i < this.plugins.length; i++) {
    // runHook 的同步版本
    const result = this.runHookSync(hookName, args, i, replaceContext);
    // 返回非 null 或 undefined 的时候，停止运行，返回结果
    if (result != null) return result as any;
  }
  // 否则返回 null
  return null as any;
}
```

**3.hookSeq**

> 加载 `sequential` 类型的钩子函数，和 hookFirst 的区别就是不能中断，使用场景有 `onwrite`、`generateBundle` 等

```ts
async function hookSeq<H extends keyof PluginHooks>(
  hookName: H,
  args: Args<PluginHooks[H]>,
  replaceContext?: ReplaceContext,
  // hookFirst 通过 skip 参数决定是否跳过某个钩子函数
): Promise<void> {
  let promise: Promise<void> = Promise.resolve();
  for (let i = 0; i < this.plugins.length; i++)
    promise = promise.then(() =>
      this.runHook<void>(hookName, args as any[], i, false, replaceContext),
    );
  return promise;
}
```

**4.hookSeqSync**

> hookSeq 同步版本，不需要构造 promise，而是直接使用 `runHookSync` 执行钩子函数。使用场景有 `closeWatcher`、`watchChange` 等。

```js
hookSeqSync<H extends SyncPluginHooks & SequentialPluginHooks>(
  hookName: H,
  args: Parameters<PluginHooks[H]>,
  replaceContext?: ReplaceContext
): void {
  for (const plugin of this.plugins) {
    this.runHookSync(hookName, args, plugin, replaceContext);
  }
}
```

**5.hookReduceArg0**

> 对 arg 第一项进行 reduce 操作。使用场景: `options`、`renderChunk` 等

```js
function hookReduceArg0<H extends keyof PluginHooks, V, R = ReturnType<PluginHooks[H]>>(
    hookName: H,
    [arg0, ...args]: any[], // 取出传入的数组的第一个参数，将剩余的置于一个数组中
    reduce: Reduce<V, R>,
    replaceContext?: ReplaceContext // 替换当前 plugin 调用时候的上下文环境
) {
  let promise = Promise.resolve(arg0); // 默认返回 source.code
  for (let i = 0; i < this.plugins.length; i++) {
    // 第一个 promise 的时候只会接收到上面传递的arg0
    // 之后每一次 promise 接受的都是上一个插件处理过后的 source.code 值
    promise = promise.then(arg0 => {
      const hookPromise = this.runHook(hookName, [arg0, ...args], i, false, replaceContext);
      // 如果没有返回 promise，那么直接返回 arg0
      if (!hookPromise) return arg0;
      // result 代表插件执行完成的返回值
      return hookPromise.then((result: any) =>
        reduce.call(this.pluginContexts[i], arg0, result, this.plugins[i])
      );
    });
  }
  return promise;
}
```

**6.hookReduceArg0Sync**

`hookReduceArg0` 同步版本，使用场景 `transform`、`generateBundle` 等

**7.hookParallel**

> 并行执行 hook，不会等待当前 hook 完成。使用场景 `buildEnd`、`buildStart`、`moduleParsed` 等。

```js
hookParallel<H extends AsyncPluginHooks & ParallelPluginHooks>(
  hookName: H,
  args: Parameters<PluginHooks[H]>,
  replaceContext?: ReplaceContext
): Promise<void> {
  const promises: Promise<void>[] = [];
  for (const plugin of this.plugins) {
    const hookPromise = this.runHook(hookName, args, plugin, false, replaceContext);
    if (!hookPromise) continue;
    promises.push(hookPromise);
  }
  return Promise.all(promises).then(() => {});
}
```

#### runHook

上面的钩子函数加载函数，内部都调用了执行钩子函数的方法 `runHook` 或 `runHookSync`，我们以 `runHook` 为例分析一下源码：

```ts
function runHook<T>(
  hookName: string,
  args: any[],
  pluginIndex: number,
  permitValues: boolean,
  hookContext?: ReplaceContext | null,
): Promise<T> {
  this.previousHooks.add(hookName);
  // 找到当前 plugin
  const plugin = this.plugins[pluginIndex];
  // 找到当前执行的在 plugin 中定义的 hooks 钩子函数
  const hook = (plugin as any)[hookName];
  if (!hook) return undefined as any;

  // pluginContexts 在初始化 plugin 驱动器类的时候定义，是个数组，数组保存对应着每个插件的上下文环境
  let context = this.pluginContexts[pluginIndex];
  // 用于区分对待不同钩子函数的插件上下文
  if (hookContext) {
    context = hookContext(context, plugin);
  }
  return Promise.resolve()
    .then(() => {
      // 许可值允许返回值，而不是一个函数钩子，使用 hookReduceValue 或 hookReduceValueSync 加载。
      if (typeof hook !== 'function') {
        if (permitValues) return hook;
        return error({
          code: 'INVALID_PLUGIN_HOOK',
          message: `Error running plugin hook ${hookName} for ${plugin.name}, expected a function hook.`,
        });
      }
      // 传入插件上下文和参数，返回插件执行结果
      return hook.apply(context, args);
    })
    .catch(err => throwPluginError(err, plugin.name, { hook: hookName }));
}
```

## 核心依赖

- [yargs-parser](https://www.npmjs.com/package/yargs-parser)：yargs 使用的强大的选项解析插件
- [source-map-support](https://www.npmjs.com/package/source-map-support)：这个模块通过 V8 堆栈追踪 API 支持 堆栈 sourcemap 支持

## 总结

Rollup 的插件和其他大型框架大同小异，都是提供统一的接口并贯彻了约定优于配置的思想。9 种 hook 加载函数使 rollup 的插件开发非常灵活，同时也带来了学习成本。

和 webpack 相比，rollup 的插件系统自称一派且没有区分 plugin 和 loader。

Rollup 插件机制的核心是构建阶段和输出生成阶段的各种钩子函数。内部通过基于 Promise 实现异步 hook 的调度。

rollup 的源码全都糅杂在一个库中，阅读起来着实头大，模块、工具函数管理的看起来很随意。而且我们无法直接移植它的任何工具到我们的项目中，相比起来，webpack 的插件系统封装成了一个插件 [tapable](https://github.com/webpack/tapable) 就很利于我们学习和使用。


> 本文首发于「[紫升的博客](https://youngjuning.cn/)」，同步于公众号「[紫升早茶馆](https://cdn.jsdelivr.net/gh/youngjuning/images/20210418112129.jpeg)」和「[掘金专栏](https://juejin.cn/user/325111174662855)」。
