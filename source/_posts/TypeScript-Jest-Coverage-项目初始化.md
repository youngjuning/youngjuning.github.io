---
title: TypeScript+Jest+Coverage 项目初始化
description: '从零到一初始化一个 TypeScript+Jest+Coverage 的项目'
date: 2025-02-24 21:45:40
categories:
  - [前端, 工程化]
tags:
  - TypeScript
  - Jest
  - Coverage
  - 项目初始化
---

## TypeScript

> 参考文档：https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html

初始化：

```sh
# 初始化 npm 项目
$ npm init -y
# 全局安装 TypeScript
$ npm install -g typescript
# 项目安装 TypeScript
$ pnpm add typescript -D
# 初始化 TypeScript 配置文件
$ tsc --init
```

配置 tsconfig.json：

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

- target：用于指定 TypeScript 代码编译后生成的 JavaScript 代码的目标版本。
- module：用于指定 TypeScript 模块的目标模式，即编译后的 JavaScript 代码所使用的模块系统。
- outDir：用于指定编译后的 JavaScript 文件输出目录的配置选项。
- esModuleInterop：主要用于处理 ECMAScript 模块（ES 模块）与 CommonJS 模块之间的交互问题
  > 当esModuleInterop设置为true时，TypeScript 编译器会在编译过程中生成一些额外的代码来处理 ES 模块和 CommonJS 模块之间的差异。具体来说，它会确保当从 ES 模块中导入 CommonJS 模块时，能够正确地获取到 CommonJS 模块的导出内容。
- forceConsistentCasingInFileNames：用于指定是否强制使用一致的大小写来命名文件。
  > 当forceConsistentCasingInFileNames设置为true时，TypeScript 编译器会在编译过程中严格检查所有导入和引用的文件名的大小写是否与实际文件系统中的文件名大小写一致。如果发现不一致，编译器将抛出错误，提示开发人员修正文件名的大小写问题。
- strict：用于指定是否启用严格模式。
  > 当strict设置为true时，TypeScript 编译器会启用严格模式，对代码进行更严格的类型检查和错误检测。这意味着编译器会对代码进行更严格的类型检查，以帮助开发人员发现潜在的类型错误和问题。
- skipLibCheck：主要用于控制 TypeScript 编译器对声明文件（.d.ts）的类型检查行为，以下是具体介绍：
  > 当编译器遇到skipLibCheck设置为true时，它会在编译过程中跳过对node_modules目录下以及types目录（如果有）中声明文件的类型检查。编译器仍然会处理这些声明文件，以便在代码中正确地使用它们提供的类型信息，但不会对其内部的类型定义进行严格的检查和验证。

配置文件优化：

```json
{
  "compilerOptions": {
     /* 声明文件与源码映射 */
    "declaration": true,      // 生成 .d.ts 类型声明
    "declarationMap": true,   // 类型声明与源码映射
    "sourceMap": true,        // 生成调试用 sourcemap

    /* 路径与模块配置 */
    "baseUrl": ".",           // 模块解析基准路径[6,9](@ref)
    "paths": {                // 路径别名映射[6,9](@ref)
      "@/*": ["src/*"]
    },
  },
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
  ]
}
```

添加 `scripts`：

```json
{
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "rimraf": "^3.0.2"
  }
}
```

- rimraf：用于删除指定目录下的所有文件和子目录。

创建第一个 TypeScript 文件：

```ts
// src/sum.ts
function sum(a: number, b: number) {
  return a + b;
}

export default sum;
```

执行 `pnpm run build` 命令，生成 `dist` 文件夹：

![图 0](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1740441881437.png)

## Jest

> 参考文档：https://jestjs.io/zh-Hans/docs/getting-started

### 安装 jest

```sh
# 全局安装 Jest
$ npm install -g jest
# 项目安装 Jest
$ pnpm add jest -D
```

### 安装 ts-jest

```sh
$ pnpm add ts-jest -D
```

安装 ts-jest 后，Jest 会自动识别 TypeScript 文件，并使用 `ts-jest` 进行编译和测试。

### 安装 ts-jest

为了让 Jest 使用 ts-jest 来转换 TypeScript，你还需要使用 `jest --init` 命令创建一个配置文件。之后在 jest.config.ts 文件中添加一行：`preset: "ts-jest"`。

```sh
$ pnpm add ts-jest -D
```

### 安装 ts-node

使用 Typescript 配置文件的还需给 Jest 安装 ts-node， 请确保在项目中安装该依赖。

```sh
$ pnpm add ts-node -D
```

### 安装 @types/jest

安装 `@types/jest` 包。它为 Jest 的全局变量提供类型，无需导入它们。

```sh
$ pnpm add @types/jest -D
```

### 测试

创建一个测试文件，一般我们会把测试文件放在 `__tests__` 目录下：

```ts
// src/__tests__/sum.test.ts
import sum from './sum';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

执行 `pnpm run test` 命令，测试通过：

![图 1](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1740443065042.png)

会在项目根目录下生成 `coverage` 文件夹，里面包含了测试覆盖率的报告：

![图 2](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1740443117575.png)

## Codecov

### 介绍

Codecov 是一款专注于代码覆盖率分析的在线服务平台，支持多种编程语言和测试框架，能够帮助开发者直观评估测试用例的有效性，并优化代码质量。

### 初始化

访问 `codecov.io` 网站，点击 `Sign in with GitHub` 按钮，授权登录。选择具体仓库进行配置：

![图 4](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1740444392401.png)

在仓库中添加 TOKEN：

![图 3](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1740443734805.png)

在项目根目录添加 `.github/workflows/test.yaml` 文件：

```yaml
name: Run tests and upload coverage

on:
  push

jobs:
  test:
    name: Run tests and collect coverage
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Node
        uses: actions/setup-node@v4

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npx jest --coverage

      - name: Upload results to Codecov
        uses: codecov/codecov-action@v5
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          slug: youngjuning/fucking-js
```

执行完后访问 https://app.codecov.io/gh/youngjuning/fucking-js 网站，查看测试覆盖率：

![图 5](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1740444533825.png)
