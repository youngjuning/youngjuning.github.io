---
title: 使用 rollup 打包 React Native 插件并发布
date: 2023-04-08 19:28:25
description: 本文接绍了如何使用 rollup 打包 React Native 插件并发布的流程和使用到的 rollup 插件
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680953626459.png
categories:
  - [前端, React Native]
  - [编程]
tags:
  - React Native
  - rollup
  - 打包
  - 发布
  - npm
  - React Native 插件
---

## 安装 rollup

```sh
$ yarn add -D rollup
```

## package.json

```json
{
  "name": "react-native-refined-components",
  "version": "0.1.0",
  "description": "refined react-native components",
  "main": "dist/cjs/index.js",
  "module": "dist/es/index.js",
  "browser": "dist/umd/index.js",
  "types": "dist/es/index.d.ts",
  "scripts": {
    "build": "rimraf dist/* && rollup -c",
    "dev": "rollup -c -w"
  }
}
```

## rollup配置文件

在根目录新建 `rollup.config.js`:

```js
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: "./src/index.ts",
    // 输出
    output: {
      file: pkg.browser, // 文件
      format: 'umd', // 格式
      name: 'refined-components', // 生成包名称，代表你的 iife/umd 包
    },
  },
  // CommonJS (for Node) and ES module (for bundlers) build.
  {
		input: "./src/index.ts",
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
    ],
	}
]
```

## 转换 `.json` 文件为 ES6 modules

### 安装 `@rollup/plugin-json`:

```sh
$ yarn add -D @rollup/plugin-json
```

### 配置 `rollup.config.js`

```js
// rollup.config.js
import json from '@rollup/plugin-json';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: "./src/index.ts",
    // 输出
    output: {
      file: pkg.browser, // 文件
      format: 'umd', // 格式
      name: 'refined-components', // 生成包名称，代表你的 iife/umd 包
    },
    plugins: [
      json(),
    ]
  },
  // CommonJS (for Node) and ES module (for bundlers) build.
  {
		input: "./src/index.ts",
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
    ],
    plugins: [json()]
	}
]
```

## 加载并解析 CommonJS 模块

我们写组件库或工具库时不可避免会用到外部库，这些外部库可能是符合 CommonJS 规范的。而 Rollup 力图实现 ES 模块的规范， 因此，加载 CommonJS 模块和使用 Node 模块位置解析逻辑都被实现为可选插件，默认情况下不在 Rollup 内核中。我们需要安装并配置 [CommonJS](https://github.com/rollup/plugins/tree/master/packages/commonjs) 和 [node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) 插件。

### 安装

```sh
$ yarn add -D @rollup/plugin-node-resolve @rollup/plugin-commonjs
```

### 配置

一般我们打的 cjs 和 esm 格式文件需要把第三放包打进来

```js
// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: "./src/index.ts",
    // 输出
    output: {
      file: "./dist/umd/index.js", // 文件
      format: 'umd', // 格式
      name: 'refined-components', // 生成包名称，代表你的 iife/umd 包
    },
    plugins: [
      json(),
      commonjs(), // 加载 commonjs 模块
      nodeResolve() // 将 commonjs 转换为 ES 模块
    ]
  }
]
```

> 注意：CommonJS 和 ES module 格式下我们一般不希望把第三方库打包到输出产物中，所以并不需要配置这两个插件。

## 忽略 `warning-treating-module-as-external-dependency`

Rollup 默认只会解析相对路径的模块，像是 `import _ from 'lodash'` 不会被打包进 bundle，并且打包时会有警告。如果你想忽略这些警告，你需要在 `external` 中指明这些外部模块。那么有没有更优雅的方式呢？答案是肯定的，我们只需要安装并配置 `rollup-plugin-node-externals` 插件即可。

```sh
$ yarn add -D rollup-plugin-node-externals
```

```js
// rollup.config.js
import externals from 'rollup-plugin-node-externals';

export default [
  // CommonJS (for Node) and ES module (for bundlers) build.
  {
		output: [
			{
        file: './dist/cjs/index.js',
        format: 'cjs',
        exports: 'auto',
      },
			{
        file: './dist/es/index.js',
        format: 'es'
      }
    ],
    plugins: [
      externals({deps: true}),
    ]
	}
]
```

## 打包 ts 文件

### 安装依赖

```sh
$ yarn add -D rollup-plugin-typescript2 typescript
```

### 配置

```js
import typescript from 'rollup-plugin-typescript2';

export default [
  // browser-friendly UMD build
  {
    input: "./src/index.ts",
    // 输出
    output: {
      file: './dist/umd/index.js', // 文件
      format: 'umd', // 格式
      name: 'refined-components', // 生成包名称，代表你的 iife/umd 包
      globals: {
        'react': 'React',
        'react-native': 'reactNative'
      },
      sourcemap: true
    },
    plugins: [
      // 如果用了 rollup-plugin-node-resolve， 则必须将它放在 typescript 插件前面
      typescript({
        tsconfigOverride: {
          compilerOptions: { declaration: false }
        }
      }),
    ],
    external: ["react","react-native"],
  },
  // CommonJS (for Node) and ES module (for bundlers) build.
  {
		input: './src/index.ts',
		output: [
			{ dir: './dist/cjs/index.js', format: 'cjs', exports: 'auto' },
			{ dir: './dist/es/index.js', format: 'es' }
    ],
    plugins: [
      typescript(),
    ],
    external: ["react","react-native"],
	}
]
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "declaration": true,
    "jsx": "react",
    "strict": true,
    "noImplicitAny": false,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
  },
  "exclude": ["dist","rollup.config.js"]
}
```

## rollup-plugin-multi-input 使用

组件库比较大时，我们可能需要让我们的库支持 tree-shaking。那么你就不能将所有的文件都打入到一个文件中。`rollup-plugin-multi-input` 便是一个将打包产物输出到各自的文件中的插件。就像：

```
src
  - A.ts
  - B.ts
  - index.ts
->
dist
  - A.js
  - B.js
  - index.js
```

### 安装依赖

```sh
$ yarn add -D rollup-plugin-multi-input
```

### 配置

> 注意：因为产物是多文件，所以需要用 `dir` 属性指定文件夹。

```js
import multiInput from 'rollup-plugin-multi-input';

export default [
  ...
  // CommonJS (for Node) and ES module (for bundlers) build.
  {
		input: ['src/**/*.ts','src/**/*.tsx'],
		output: [
			{ dir: './src', format: 'cjs', exports: 'auto' },
			{ dir: './src', format: 'es' }
    ],
    plugins: [
      multiInput(),
    ],
	}
]
```

## 其他插件

- rollup-plugin-progress: 打包进度条
- rollup-plugin-terser: 压缩文件
