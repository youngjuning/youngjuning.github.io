---
title: 从零开发一个 Node Cli
date: 2020-02-17 15:23:35
cover: https://i.loli.net/2020/03/04/IZEm27KSLcz3h9r.png
description: Node.js 用途很广，常用来开发服务、桌面应用等被开发者熟知，Node.js 还有另外一个非常实用的场景 - 命令行应用（后文统称 CLI）。
categories:
  - 前端
tags:
  - cli
  - Node.js
  - 掘金
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

Node.js 用途很广，常用来开发服务、桌面应用等被开发者熟知，Node.js 还有另外一个非常实用的场景 - 命令行应用（后文统称 CLI）。

> 本文可参考的源码：https://github.com/youngjuning/cli

## HelloWorld

创建一个`youngjuning` 目录，并使用进入该目录:

```sh
$ mkdir youngjuning && cd youngjuning
```

在该目录下新建 `bin/cli.js`:

```js
#!/usr/bin/env node
console.log('Hello World')
```

使用 `package.json` 的 `bin` 项是用来指定各个内部命令对应的可执行文件的位置：

```json
"bin": {
  "youngjuning": "./bin/cli.js"
}
```

在命令行输入 `npm link` 或 `npm install -g` 将当前项目安装到全局环境，这样就可以直接使用 `youngjuning` 来运行文件了：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dc89f3724cf4aa5bc71f7089c27c28d~tplv-k3u1fbpfcp-zoom-1.image)

## commander.js

Node.js 为我们提供了 `process.argv` 来读取命令行参数，这里我们对此不作介绍，有兴趣可以自行研究，我选择了 tj 大神的 [commander](https://www.npmjs.com/package/commander)：

- `command`: 定义命令行指令，后面可跟上一个 name，用空格隔开，如 `.command( 'app [name]')`
- `alias`: 定义一个更短的命令行指令
- `description`: 描述，它会在 help 里面展示
- `option`: 定义参数。它接受四个参数
  - 在第一个参数中，它可输入短名字 `-a` 和长名字 `–app`，使用 `|` 或者 `,` 分隔，在命令行里使用时，这两个是等价的，区别是后者可以在程序里通过回调获取到
  - 第二个为描述, 会在 `help` 信息里展示出来
  - 第三个参数为回调函数，他接收的参数为一个 `string`，有时候我们需要一个命令行创建多个模块，就需要一个回调来处理
  - 第四个参数为默认值
- `action`: 注册一个 `callback` 函数,这里需注意目前回调不支持 let 声明变量
- `parse`: 解析命令行

## inquire.js

> 交互命令输入插件！

### 基本语法

```js
const answers = await inquirer.prompt([
  /* Pass your questions in here */
])
console.log(answers)
```

### 参数详解

- `type`: 表示提问的类型，包括：`input`, `confirm`, `list`, `rawlist`, `expand`, `checkbox`, `password`, `editor`；
- `name`: 存储当前问题回答的变量；
- `message`: 问题的描述；
- `default`: 默认值；
- `choices`: 列表选项，在某些 type 下可用，并且包含一个分隔符(separator)；
- `validate`: 对用户的回答进行校验；
- `filter`: 对用户的回答进行过滤处理，返回处理后的值；
- `transformer`: 对用户回答的显示效果进行处理(如：修改回答的字体或背景颜色)，但不会影响最终的答案的内容；
- `when`: 根据前面问题的回答，判断当前问题是否需要被回答；
- `pageSize`: 修改某些 `type` 类型下的渲染行数；
- `prefix`: 修改 `message` 默认前缀；
- `suffix`: 修改 `message` 默认后缀。

## 实现动态模板

- 利用 `recursive-readdir` 库递归读取项目所有文件
- 利用 `handlebars` 进行模板替换
- 利用 `fs` 模块进行读文件和写文件操作

```js
const fs = require('fs')
const handlebars = require('handlebars')
const recursive = require('recursive-readdir')

const compile = (meta, file) => {
  const content = fs.readFileSync(file).toString()
  const result = handlebars.compile(content)(meta)
  fs.writeFileSync(file, result)
}

module.exports = (meta, src) => {
  recursive(src, (err, files) => {
    files.forEach(file => {
      compile(meta, file)
    })
  })
}
```

## 命令行工具

- [chalk.js](https://www.npmjs.com/package/chalk): 美化命令行的模块
- [ora](https://www.npmjs.com/package/ora): Elegant terminal spinner
- [ncp](https://www.npmjs.com/package/ncp): 异步的拷贝文件，包含空文件夹
- [recursive-readdir](https://www.npmjs.com/package/recursive-readdir): 递归地列出目录和子目录下的所有文件，不包含目录本身。
- [shelljs](https://github.com/shelljs/shelljs): Unix shell commands for Node.js
- [log-symbols](https://www.npmjs.com/package/log-symbols): 打印日志的特殊标志
- [download-git-repo](https://www.npmjs.com/package/download-git-repo): Download and extract a git repository (GitHub, GitLab, Bitbucket) from node
- [global-prefix](https://www.npmjs.com/package/global-prefix): 获取 npm 全局安装的前缀
- [exec-sh](https://www.npmjs.com/package/exec-sh): 执行 shell 命令转发所有 stdio 流，比 shelljs exec 命令好用
- [wml](https://www.npmjs.com/package/wml): wml 侦听某个文件夹中的更改（使用 watchman），然后将更改的文件复制到另一个文件夹中。
- [cmd-open](https://blog.ihaiu.com/cmd-open/): 扩展 Windows 命令 open
- [shx](https://github.com/shelljs/shx): shx is a wrapper around ShellJS Unix commands, providing an easy solution for simple Unix-like, cross-platform commands in npm package scripts.
