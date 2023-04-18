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

<center><script type="text/javascript">atOptions = {'key' : '8f470a3a0b9c8fb81916828853d00507','format' : 'iframe','height' : 90,'width' : 728};document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://harassinganticipation.com/8f470a3a0b9c8fb81916828853d00507/invoke.js"></scr' + 'ipt>');</script></center>

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
