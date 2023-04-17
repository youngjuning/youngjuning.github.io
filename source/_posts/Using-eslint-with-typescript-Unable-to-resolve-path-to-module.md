---
title: 「已解决」Using eslint with typescript - Unable to resolve path to module
description: 我在使用 eslint 检查 typescript 代码时，遇到了一个问题，就是无法解析路径到模块（Unable to resolve path to module）
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678775085986.png
date: 2023-03-14 14:18:48
categories:
  - [前端, Eslint]
tags:
  - Eslint
  - Typescript
  - import/no-unresolved
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

我在使用 eslint 检查 typescript 代码时，遇到了一个问题，就是无法解析路径到模块（Unable to resolve path to module）：

```ts
import app from './app';
```

报错：

```sh
2:17  error  Unable to resolve path to module './app'  import/no-unresolved
```

这个问题的解决步骤如下：

1、设置 parserOptions：

```ts
// .eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

2、设置 `import/resolver`：

```ts
// .eslintrc.json
{
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
}
```
