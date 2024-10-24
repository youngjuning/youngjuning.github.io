---
title: 'Error: error:0308010C:digital envelope routines::unsupported'
date: 2024-10-24 17:48:38
categories:
  - [issues, node]
---

在 Node.js 环境中，尤其是在使用最新的 Node.js 版本时，你可能会遇到 Error: error:0308010C:digital envelope routines::unsupported 错误。这个错误通常与 Node.js 的加密模块和 OpenSSL 版本有关。如果可以改 Node.js 版本，安装老的 Node 版本可以解决

最简单的解决方法是设置一个环境变量，告诉 Node.js 使用旧的加密算法。在命令行中运行以下命令：

```sh
export NODE_OPTIONS=--openssl-legacy-provider
```

如果你使用的是Windows系统，则可以运行：

```sh
set NODE_OPTIONS=--openssl-legacy-provider
```

然后重新运行你的 Node.js 应用程序。
