---
title: 如何设置 Gatsby 绝对路径引用别名
description: 在这篇文章中，我们将逐步了解如何向我们的 gatsby 站点添加导入别名。
date: 2023-05-08 18:33:33
categories:
  - [前端, Gatsby]
tags:
  - Gatsby
  - TypeScript
  - React
---

在这篇文章中，我们将逐步了解如何向我们的 gatsby 站点添加导入别名。

我们设置导入别名的原因更多是为了代码的可读性和导入组件时代码外观的美观。

我的意思是，如果我们看一下以下示例：

```ts
import Subscribe from '../../../../../../../core/modules/newsletter/mixins/Subscribe'
```

在我看来，这样看起来非常丑陋，那么我们该如何改进呢？

我们可以通过更新 webpack 配置来包含针对我们已知将成为组件基础的主目录的别名来实现这一点。

一旦我们完成了这篇文章中的所有步骤，最终结果将如下所示：

```ts
import Subscribe from '@/core/modules/newsletter/mixins/Subscribe'
```

## 给 Gatsby 添加依赖

考虑到 Gatsby 使用 Webpack 作为其核心，并且默认情况下不会公开配置，因此我们可以使用 Gatsby 的 `onCreateWebpackConfig` API 添加自定义 Webpack 配置，这将导致自定义配置被合并，使您能够修改默认的 webpack 配置。

要添加自定义Webpack配置，我们需要编辑（或在项目根目录中创建文件，如果不存在）gatsby-node.js，并将新的配置添加到其中。

```js
const path = require("path");
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@/components": path.resolve(__dirname, "src/components"),
        "@/static": path.resolve(__dirname, "static")
      }
    }
  });
}
```

正如我们在上面的代码片段中看到的那样，actions 对象提供了使用 `setWebpackConfig` 选项的选项，该选项接受我们的自定义 webpack 配置并将其合并到 Gatsby 的 webpack 配置中。

为了添加新的别名，我们将使用 webpack 的 `resolve.alias`，这将允许我们在组件内部使用新创建的导入别名。

如下所示，在添加新别名后的最终结果将如下所示：

```ts
import Layout from '@components/Layout';
```

## 解析 ESlint import

```js
{
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      // use <root>/tsconfig.json
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<roo/>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
    },
  },
}
```

## Typescript

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/components/*": ["src/components/*"]
    },
  }
}
```
