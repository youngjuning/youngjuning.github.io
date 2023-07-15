---
title: 掘金一下 | 从零开发一款基于 webview 的 vscode 扩展
date: 2023-03-01 00:55:47
description: 在团队降本提效的基建中，紫竹开发了一款 vscode 插件，第一版我使用的是 vscode 内置 UI，虽说也能用，但是用户体验欠佳。由于 vscode 内置 UI 不够灵活，一番调研后我决定使用 webview 重构。
cover: https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f53c4850008a49a5baa25a0e5f1b626b~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp
categories:
  - [前端, VS Code]
tags:
  - 掘金
  - Webview
  - VS Code
  - 扩展
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

> ⚠️本文为掘金社区首发签约文章，未获授权禁止转载

> 温馨提示：结合本文配套[源码](https://github.com/youngjuning/juejin-me)阅读体验更佳！

## 前言

在团队降本提效的基建中，紫竹开发了一款 vscode 插件，第一版我使用的是 vscode 内置 UI，虽说也能用，但是用户体验欠佳。由于 vscode 内置 UI 不够灵活，一番调研后我决定使用 webview 重构。

开发过 vscode 插件的同学可能对插件开发知识点多、文档阅读困难、参考资料少有所体会。基于 webview 开发插件更是如此，寻遍网络，虽然有优秀的项目，但却没有完整且优秀的教程。为了修炼 vscode 开发灵力，不妨和紫竹一起挑战从零到一开发一款基于 webview 的 vscode 插件。

## Hello vscode

英雄多起于市井，高楼皆起于平地。再伟大的软件也都是从 Hello World 开始的，本章尽量用最简洁的语言描述一个 vscode 插件 Hello World 的诞生。

### 初始化项目

安装 [Yeoman](http://yeoman.io/) 和 [VS Code Extension Generator](https://www.npmjs.com/package/generator-code)：

```sh
$ npm install -g yo generator-code
```

这个脚手架会生成一个可以立马开发的项目。运行生成器，然后填好下列字段：

```sh
$ yo code
#     _-----_     ╭──────────────────────────╮
#    |       |    │   Welcome to the Visual  │
#    |--(o)--|    │   Studio Code Extension  │
#   `---------´   │        generator!        │
#    ( _´U`_ )    ╰──────────────────────────╯
#    /___A___\   /
#     |  ~  |
#   __'.___.'__
# ´   `  |° ´ Y `

# ? What type of extension do you want to create? New Extension (TypeScript)
# ? What's the name of your extension? Juejin Posts
# ? What's the identifier of your extension? juejin-posts
# ? What's the description of your extension? 掘金文章管理
# ? Initialize a git repository? Yes
# ? Bundle the source code with webpack? No
# ? Which package manager to use? yarn

$ code ./juejin-posts
```

> 提交记录：[hello world](https://is.gd/IaJdlW)

### 代码规范

默认的脚手架生成的也有 ESLint 配置，但是 Editor、Prettier 的配置都没有，并且 ESLint 配置也不符合我的习惯。紫竹关于前端工程化的包都在 [youngjuning/luozhu](https://github.com/youngjuning/luozhu)， ESlint 配置的包是 `@luozhu/eslint-config-*`。由于我们开发插件使用的是 Typescript，所以我们选择 `@luozhu/eslint-config-typescript`。

**安装依赖：**

```sh
$ yarn add @luozhu/eslint-config-typescript @luozhu/prettier-config prettier -D
```

**具体配置：**

配置涉及文件较多，请参考 [coding-style](https://github.com/youngjuning/luozhu#coding-style)，不关心的同学也可以直接略过。

**提交检测：**

安装依赖：

```sh
$ yarn add lint-staged yorkie -D
```

修改配置：

```json
// package.json
{
  "gitHooks": {
    "pre-commit": "lint-staged"
  },
  "lint-staged": {
    "**/*.{js,jsx,ts,tsx}": ["eslint --fix"],
    "**/*.{md,json}": ["prettier --write"]
  }
}
```

**eslint --fix：**

修改完配置之后需要执行 fix 对所有文件格式化一次。

```sh
$ yarn lint --fix
```

> 提交记录：[chore: code style config](https://is.gd/xzFAVE)

### 约定式提交

约定式提交我使用的是渐进式脚手架 `@luozhu/create-commitlint`，在项目中执行 `npx @luozhu/create-commitlint` 即可使项目符合规范化提交的配置。对规范化提交不了解的同学，强烈建议读一下 [一文搞定 Conventional Commits ](https://juejin.cn/post/6877462747631026190/)。

> 提交记录：[chore: npx @luozhu/create-commitlint](https://is.gd/Ld142y)

### 调试

按下 `F5` 开启调试会出现[扩展开发宿主]窗口，然后按 `Command+Shift+P` 组件键输入 `Hello World` 命令。如下图所示 vscode 弹出了 `Hello World from Juejin Posts!` 的提示。

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc26d7d429f84564b88b55e9df60fcd7~tplv-k3u1fbpfcp-zoom-1.image)

同时我们的开发窗口中，会出现一个 watch 任务的终端：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75a15d0bd2cc4096af1a3f76173cbbe1~tplv-k3u1fbpfcp-zoom-1.image)

开发窗口的调试控制台会输出插件运行日志（忽略红色的警告）：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c31068ea0bca4d4793e35bdb16d70c0a~tplv-k3u1fbpfcp-zoom-1.image)

调试执行的任务是在 `.vscode/tasks.json` 中配置的：

```json
// See https://go.microsoft.com/fwlink/?LinkId=733558
// for the documentation about the tasks.json format
{
	"version": "2.0.0", // 配置的版本号。
	"tasks": [ // 任务配置。通常是外部任务运行程序中已定义任务的扩充。
		{
			"type": "npm", // 要自定义的任务类型。
			"script": "watch", // 要自定义的 npm 脚本。
			"problemMatcher": "$tsc-watch", // 要使用的问题匹配程序。可以是一个字符串或一个问题匹配程序定义，也可以是一个字符串数组和多个问题匹配程序。
			"isBackground": true, // 执行的任务是否保持活动状态并在后台运行。
			"presentation": { // 配置用于显示任务输出并读取其输入的面板。
				"reveal": "never" // 控制运行任务的终端是否显示。可按选项 "revealProblems" 进行替代。默认设置为“始终”。
			},
			"group": { // 定义此任务属于的执行组。它支持 "build" 以将其添加到生成组，也支持 "test" 以将其添加到测试组。
				"kind": "build", // 任务的执行组。
				"isDefault": true // 定义此任务是否为组中的默认任务。
			}
		}
	]
}
```

## 打包

我们的插件开发完成前，想要分享给小伙伴体验可以吗？答案是肯定的，vscode 为我们提供了 [vsce](https://github.com/microsoft/vscode-vsce) 实现这个需求，我们将 vsce 模块安装到全局，然后使用 `vsce package` 命令尝试打包：

```sh
$ vsce package
 ERROR  Missing publisher name. Learn more: https://code.visualstudio.com/api/working-with-extensions/publishing-extension#publishing-extensions
```

啊，咋还报错了？`publisher` 是啥？？一脸懵逼。不慌，按[链接](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#create-a-publisher) 我知道了 publisher 是一个可以将扩展发布到Visual Studio Code Marketplace 的身份。每个扩展都需要在其 `package.json` 文件中包含一个发布者名称。如果注册发布者我们后面详说，这里我们把 `publisher` 设置为 `luozhu`。

```sh
$ vsce package
 INFO  Detected presence of yarn.lock. Using 'yarn' instead of 'npm' (to override this pass '--no-yarn' on the command line).
 ERROR  Make sure to edit the README.md file before you package or publish your extension.
```

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf561381232b4690a5d7cd0378c267d7~tplv-k3u1fbpfcp-zoom-1.image)

额，裂开，这咋还报错，假装淡定，读一下提示原来是要我们编辑一下 README.md，没错，vscode 模板里有初始的 README，我们需要编辑一下才可以打包。修改后再次尝试 `vsce package`：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acfe2e957c9545578c7b6990371a3f0b~tplv-k3u1fbpfcp-zoom-1.image)

终于，打包成功！为了追求完美，最后我们再来做一些优化工作：

1. 执行 `vsce package` 的时候加上 `--no-yarn`
2. 在 _package.json_ 中加上 `repository` 字段即可看不到任何警告。
3. 为了便捷，我们将 vsce 安装到项目中，然后把 `vsce package --no-yarn` 添加到 npm scripts 中。
4. _package.json_ 加上 `license` 字段。

然后再次尝试 `yarn package` 就完美了：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a9a251834b945c8a882039020f56e4f~tplv-k3u1fbpfcp-zoom-1.image)

> 提示：vsce package 会先执行 `vscode:prepublish` 这个预发布脚本去编译项目。

> 提交记录：[chore: config vsce package](https://is.gd/ZCp4qU)

### 打包原理

如过你也跟着一路敲到了这里，此时你会在项目根目录发现 `vsix` 结尾的文件：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2c0846bd66747ceab0c09524a209b28~tplv-k3u1fbpfcp-zoom-1.image)

这就是 vscode 插件的安装包，我们先不急着安装，先一起来看一下这个文件是个什么东西。尝试用归档工具解压后得到如下目录文件夹：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/182c365a0690467cb0bd8b0d1490c175~tplv-k3u1fbpfcp-zoom-1.image)

我们可以看到编译后的文件夹 `out` 和其他一些文件是被直接压缩进安装包的，聪明的你肯定发现了 `.cz-config.js`、`.prettierrc.js` 和 `commitlint.config.js` 这种开发时文件也被压缩了，运行插件完全用不到，这明显不合理。其实和其他插件体系一样，vscode 也提供了 `.vscodeignore` 来实现打包忽略配置，我们将以上无关文件忽略重新打包即可。

原理就这？不存在的，我们打开 `extension.js` 会发现引用了 `vscode` 这个包：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb42881e49a94456aeac417f6b5cba71~tplv-k3u1fbpfcp-zoom-1.image)

但是我们的安装包中并没有 _node_modules_，那么 vscode 这个包存在在哪里呢？我猜的是挂在 node 环境上了，读了[源码](https://is.gd/33GTcH)后我发现我竟然是对的：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e796fcf81b64fd7a18d9c3e36fbefdf~tplv-k3u1fbpfcp-zoom-1.image)

vscode 实现了拦截器在加载 Node 环境的时候将 vscode 给添加到了内置包中，这样的好处是减小插件的体积。

那么我们如果使用三方插件呢？以常用的 lodash 为例，安装 lodash 之后重新打包：

```sh
$ yarn package
yarn run v1.22.10
$ vsce package --no-yarn
Executing prepublish script 'npm run vscode:prepublish'...

> juejin-posts@0.0.1 vscode:prepublish
> yarn run compile

$ tsc -p ./
This extension consists of 1060 files, out of which 1049 are JavaScript files. For performance reasons, you should bundle your extension: https://aka.ms/vscode-bundle-extension . You should also exclude unnecessary files by adding them to your .vscodeignore: https://aka.ms/vscode-vscodeignore
 DONE  Packaged: /Users/luozhu/Desktop/playground/juejin-posts/juejin-posts-0.0.1.vsix (1060 files, 644.72KB)
✨  Done in 5.54s.
```

这个时候提示我们有 1000 多个文件，大概率 _node_modules_ 文件夹被打包了，我们来解压下见证一下：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/917b7742991640c9a0b03314cef24ce6~tplv-k3u1fbpfcp-zoom-1.image)

不出所料，vscode 默认的打包方式就是简单的编译拷贝，通过忽略文件减小体积也是杯水车薪。而且 vscode 扩展的规模往往增长很快。它们是在多个源文件中编写的，并依赖于 npm 的模块。分解和重用是开发的最佳实践，但在安装和运行扩展时，它们是有代价的。加载 100 个小文件要比加载一个大文件慢得多。这就是我们推荐捆绑的原因。捆绑是将多个小的源文件合并成一个文件的过程。

在 JavaScript 中，有不同的打包工具可以用，流行的有 rollup.js、Parcel、esbuild 和 webpack，官方脚手架默认只能选 webpack，我们这里推荐直接使用更快更强的 esbuild。

> 提交记录：[chore: ignore config file when package](https://is.gd/ZCp4qU)、[chore: add esModuleInterop to tsconfig](https://is.gd/ggpQmv)

### 使用 esbuild 优化打包

**安装依赖：**

```sh
$ yarn add -D esbuild
```

**npm scripts：**

```diff
"scripts": {
-    "vscode:prepublish": "yarn run compile",
-    "compile": "tsc -p ./",
-    "watch": "tsc -watch -p ./",
-    "pretest": "yarn run compile && yarn run lint",
+    "vscode:prepublish": "yarn esbuild-base --minify",
+    "esbuild-base": "esbuild ./src/extension.ts --bundle --outfile=out/extension.js --external:vscode --format=cjs --platform=node",
+    "esbuild": "yarn esbuild-base --sourcemap",
+    "esbuild-watch": "yarn esbuild-base --sourcemap --watch",
+    "test-compile": "tsc -p ./",
+    "pretest": "yarn test-compile && yarn lint",
}
```

> 注意：由于 watch 改成了 esbuild-watch，所以 _.vscode/tasks.json_ 中的 scripts 子段也需要做相应修改。

**vscode tasks：**

理论上我们把打包命令改成 esbuild 之后，应该将 vscode 任务中的问题匹配程序设置为 `$esbuild-watch`，但是 vscode 会提示我们无法识别的问题匹配程序：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b51c79ee1344b6f92a3f2efaf9ef7aa~tplv-k3u1fbpfcp-zoom-1.image)

尝试搜索扩展，果然有一个 esbuild Problem Matchers 插件，我们将其安装并添加 `"connor4312.esbuild-problem-matchers"` 到 _.vscode/extensions.json_ 文件的 `recommendations` 中。

**忽略文件：**

我们使用 esbuild 打包后会将使用到的代码都打包进 `out/extension.js`，但是 vsce 的打包机制是不管你有没有用到都会把 `dependencies` 中的包打进安装包中，所以我们需要将 *_node_modules_* 忽略掉。

**成果展示：**

从图中我们可以看到，安装包的体积大大减小了。

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba86286be7fc41f4b8325a3e0be0d2d2~tplv-k3u1fbpfcp-zoom-1.image)

> 提交记录：[chore: config esbuild](https://is.gd/F12xNk)

## 集成 umijs

### 初始化 umi 项目

使用 umi 脚手架在根目录新建一个 _web_ 目录。

```sh
$ mkdir web && cd web
```

通过官方工具创建项目：

```sh
$ yarn create @umijs/umi-app
```

修改 _.umirc.ts_ 配置：

```ts
import { defineConfig, IConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {}, // 开发时可以保持组件状态，同时编辑提供即时反馈。
  history: {
    type: 'memory', // 默认的类型是 `browser`，但是由于 vscode webview 环境不存在浏览器路由，改成 `memory` 和 `hash` 都可以
  },
  devServer: {
    // 需要在 dev 时写文件到输出目录，这样保证开发阶段有 js/css 文件
    writeToDisk: filePath =>
      ['umi.js', 'umi.css'].some(name => filePath.endsWith(name)),
  },
} as IConfig);
```

修改 `package.json` 加入 `name`、`version`、`description`：

```json
{
  "name": "web",
  "version": "0.0.0",
  "description": "web for juejin-posts"
}
```

### 忽略文件

**.gitignore：**

将 vscode 扩展和 umijs 脚手架生成的 gitignore 合并为一下内容：

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# vscode
.vscode-test/
*.vsix

# dependencies
node_modules
npm-debug.log
yarn-error.log
package-lock.json

# production
out
dist

# misc
.DS_Store

# umi
**/src/.umi
**/src/.umi-production
**/src/.umi-test
**/.env.local
web/yarn.lock
```

**.vscodeignore：**

由于 vscode 打包的时候只需要获取 umijs 打包后的产物，所有加入 `web/**` 和 `!web/dist/**` 将无用的文件忽略掉。

```
.vscode/**
.vscode-test/**
out/test/**

src/**
.gitignore
.yarnrc
vsc-extension-quickstart.md
**/tsconfig.json
**/*.map
**/*.ts

.cz-config.js
.prettierrc.js
.commitlintrc.js
**/node_modules/**
yarn-error.log
web/**
!web/dist/**
```

### yarn workspace

由于我们的项目是 vscode 扩展和 web 项目混合的项目。为了方便管理脚本和依赖，我们引入了 `yarn workspace` 来管理项目。在根目录的 _package.json_ 中加入以下配置即可：

```json
{
  "private": "true",
  "workspaces": ["web"]
}
```

### 调试

由于我们的 web 项目也需要编译，所以我们需要修改一下 vscode `launch.json` 加入 web 项目的编译任务。配置参考了 [appworks](http://tny.im/bOqQT)。

首先在根目录的 `package.json` 的 scripts 中添加:

```json
{
  "scripts": {
    "web-build": "yarn workspace web run build",
    "web-watch": "yarn workspace web run start"
  },
}
```

然后修改 _.vscode/launch.json_ 配置为：

```json
// A launch configuration that compiles the extension and then opens it inside a new window
// Use IntelliSense to learn about possible attributes.
// Hover to view descriptions of existing attributes.
// For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
{
  "version": "0.2.0",
  "compounds": [
    // 复合列表。每个复合可引用多个配置，这些配置将一起启动。
    {
      "name": "Debug Extension", // 复合的名称。在启动配置下拉菜单中显示。
      "configurations": [
        // 将作为此复合的一部分启动的配置名称。
        "Run Extension",
        "Watch Webview"
      ],
      "presentation": {
        "order": 0
      }
    }
  ],
  "configurations": [
    {
      "name": "Watch Webview",
      "request": "attach",
      "type": "node",
      "preLaunchTask": "npm: web-watch"
    },
    {
      "name": "Run Extension",
      "type": "extensionHost",
      "request": "launch",
      "args": ["--extensionDevelopmentPath=${workspaceFolder}"],
      "outFiles": ["${workspaceFolder}/out/**/*.js"],
      "preLaunchTask": "${defaultBuildTask}"
    }
  ]
}
```

完成后进入 VS Code，按下`F5`，你会立即看到一个**插件发开主机**窗口，其中就运行着插件。这时候运行你会发现控制台报一下错误 ❌：

```
error TS6059: File '/Users/luozhu/Desktop/github/juejin-posts/web/src/pages/index.tsx' is not under 'rootDir' '/Users/luozhu/Desktop/github/juejin-posts/src'. 'rootDir' is expected to contain all source files.
  The file is in the program because:
    Matched by include pattern '**/*' in '/Users/luozhu/Desktop/github/juejin-posts/tsconfig.json'
```

原因是因为 umi 的约定的项目结构和 vscode extension 都包含 _src_ 目录。由于 vscode 插件和 umi 的编译是分开的，我们在根目录的 _tsconfig.json_ 中将 _web_ 目录忽略即可：

```json
{
  "exclude": ["web"]
}
```

现在，你可以按下 `F5` 看到**插件发开主机**窗口的同时还会看到两个调试任务：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4b3b6f2522643fb9bc574e2f9982775~tplv-k3u1fbpfcp-zoom-1.image)

> 注意📢：请选择 Debug Extension 调试任务而不是 Run Extension

### 其他优化工作

1. 由于基于 yarn workspace，我们把公用的依赖合并
2. 合并 Eslint 配置并使用 `@luozhu/eslint-config-react-typescrip`
3. 合并 Editorconfig 和 Prettier 配置
4. 添加 `prestart` 和 `prebuild` script
5. 设置 `HTML=none umi build`

> 提交记录：[chore: config umijs](https://is.gd/bt3WHr)

## vscode 插件开发核心概念

在开始 webview 能力开发之前，我们有必要了解一下 vscode 插件开发的核心概念。为了有个全局的理解，我们先来看下我们现在项目的主要目录结构：

```sh
.
├── CHANGELOG.md # 基于 standard-version 生成的更新日志文件
├── README.md
├── package.json # vscode 包配置文件，诸如插件 LOGO、名字、描述、注册激活事件
├── src
│   └── extension.ts # 插件入口文件，暴露 activate 方法用于注册命令和初始化一些配置，暴露 deactivate 方法用于插件关闭前执行清理工作
├── tsconfig.json # vscode 的编译配置
├── web # 基于 umi 的 web，也是我们后边 webview 要承载的内容
└── yarn.lock
```

从目录结构可以看出，关键的文件是 `package.json` 和 `extension.ts`，我们以 helloWorld 命令为例介绍下 vscode 插件的三个核心概念。

### 1. 激活事件

**激活事件**是在 `package.json` 中的 `activationEvents` 字段声明的一个 JSON 数组对象。为了注册 helloWorld 这个命令，第一步就是注册激活事件，激活事件类型有很多，注册命令的激活事件是 `onCommand`:

```json
{
  "activationEvents": ["onCommand:juejin-posts.helloWorld"]
}
```

### 2. 发布内容配置

发布内容配置（ 即 VS Code 为插件扩展提供的配置项）是 `package.json` 的 `contributes` 字段，你可以在其中注册各种配置项扩展 VS Code 的能力。上一步我们注册的 helloWorld 激活事件只是告诉了 vscode 可以通过 `juejin-posts.helloWorld` 命令触发。我们还需要再 `contributes.commands` 中注册我们的 `juejin-posts.helloWorld` 命令：

```json
{
  "contributes": {
    "commands": [
      {
        "command": "juejin-posts.helloWorld",
        "title": "Hello World"
      }
    ]
  }
}
```

### 3. VS Code API

**VS Code API** 是 VS Code 提供给插件使用的一系列 Javascript API。通过前两个核心概念的能力，我们已经注册好了命令和事件，那么下一步必然就是注册事件回调。事件回调在 vscode 中是通过 `vscode.commands.registerCommand` 函数来注册的，下面 👇🏻 是我们在入口文件 `src/extension.ts` 中注册 `juejin-posts.helloWorld` 命令。

```ts
// vscode 这个模块包含了 VS Code 扩展的 API
import vscode from 'vscode';

// 这个方法当你的扩展激活时调用，扩展会在命令首次执行时激活
export function activate(context: vscode.ExtensionContext) {
  // 当你的扩展被激活时，这行代码将只被执行一次
  //
  // 使用 console.log 输出日志信息或使用 console.error 输出错误信息。
  //
  console.log('Congratulations, your extension "juejin-posts" is now active!');

  // 入口命令已经在 package.json 文件中定义好了，现在调用 registerCommand 方法
  // registerCommand 中的参数必须与 package.json 中的 command 保持一致
  const disposable = vscode.commands.registerCommand('juejin-posts.helloWorld', () => {
    // 把你的代码写在这里，每次命令执行时都会调用这里的代码
    // 给用户显示一个消息提示
    vscode.window.showInformationMessage('Hello World from Juejin Posts!');
  });

  context.subscriptions.push(disposable);
}

// 当你的扩展被停用时，这个方法被调用。
export function deactivate() {}
```

## 集成 webview

### 注册命令

1、_package.json_ 激活事件（`activationEvents`）中添加 `"onCommand:juejin-posts.start"`

2、_package.json_ 命令（`commands`）中添加：

```json
{
  "command": "juejin-posts.start",
  "title": "start",
  "category": "Juejin Posts"
}
```

3、_src/extension.ts_ 中注册命令

```ts
context.subscriptions.push(
  vscode.commands.registerCommand('juejin-posts.start', () => {
    // Truth is endless. Keep coding...
  })
)
```

### 创建 webview 面板

#### 创建一个空白的面板

```ts
import vscode from 'vscode';

// 创建并显示新的webview
const panel = vscode.window.createWebviewPanel(
  'juejin-posts', // 只供内部使用，这个 webview 的标识
  'Juejin Posts', // 给用户显示的面板标题
  vscode.vscode.ViewColumn.One, // 给新的 webview 面板一个编辑器视图
  {
    enableScripts: true, // 启用 javascript 脚本
    retainContextWhenHidden: true, // 隐藏时保留上下文
  } // webview 面板的内容配置
);
```

我们使用了 [window.createWebviewPanel](https://vscode-api.js.org/modules/window.html#createWebviewPanel) API 创建了一个 webview 面板，现在我们尝试运行 `juejin-posts.start` 就可以打开一个 webview 面板：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d85ad985232542f587376e5073feb1a1~tplv-k3u1fbpfcp-zoom-1.image)

#### 给面板设置内容

上面我们创建了一个空白的面板，那么我们如何给面板添加内容呢？我们可以使用 `panel.webview.html` 来设置 HTML 内容：

```ts
function getWebviewContent() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Juejin Posts</title>
        <style>
          html, body {
            padding: 0px;
            height: 100vh;
            position: relative;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          #yoyo {
            position: absolute;
            bottom: 50px;
            right: -90px;
            opacity: 0;
            transition: .25s ease-in-out
          }
          #yoyo:hover {
            opacity: 1;
            right: 0;
          }
        </style>
    </head>
    <body>
      <a href="https://juejin.cn"><img id="yoyo" src="https://cdn.jsdelivr.net/gh/youngjuning/images/20210817163229.png" width="100" /></a>
    </body>
    </html>
  `;
}
...
// 给 webview panel 设置 HTML 内容
panel.webview.html = getWebviewContent();
...
```

重新使用 `juejin-posts.start` 命令就可以调戏悠悠船长了：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5160d0c76536441b8d1ac3cfcedc0d0e~tplv-k3u1fbpfcp-zoom-1.image)

#### 限制 webview 视图为一个

```ts
export function activate(context: vscode.ExtensionContext) {
  // 追踪当前 webview 面板
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  context.subscriptions.push(
    vscode.commands.registerCommand('juejin-posts.start', () => {
      // 获取当前活动的编辑器
      const columnToShowIn = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;

      if (currentPanel) {
        // 如果我们已经有了一个面板，那就把它显示到目标列布局中
        currentPanel.reveal(columnToShowIn);
      } else {
        // 不然，创建一个新面板
        currentPanel = vscode.window.createWebviewPanel();
        // 当前面板被关闭后重置
        currentPanel.onDidDispose(
          () => {
            currentPanel = undefined;
          },
          null,
          context.subscriptions
        );
      }
    })
  );
}
```

- [vscode.window.activeTextEditor](https://vscode-api-cn.js.org/modules/window.html#activeTextEditor)：获取当前活动的文本编辑器
- [currentPanel.reveal()](https://vscode-api-cn.js.org/interfaces/WebviewPanel.html#reveal)：调用 `reveal()` 或者拖动 webview 面板到新的编辑布局中去。

#### 设置 Icon

```ts
// 设置 Logo
panel.iconPath = vscode.Uri.file(
  path.join(context.extensionPath, 'assets', 'icon-juejin.png')
);
```

在 vscode 扩展中我们需要通过 `vscode.Uri.file` 方法获取磁盘上的资源路径。

#### webview 获取内容的 Uri

你应该使用 `asWebviewUri` 管理插件资源。不要硬编码 `vscode-resource://`，而是使用 `asWebviewUri` 确保你的插件在云端环境也能正常运行。

在 [@luozhu/vscode-utils](http://tny.im/jb4go) 中我们对获取本地资源路径做了封装：

```ts
// 获取内容的 Uri
const getDiskPath = (fileName: string) => {
  return webviewPanel.webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, rootPath, 'dist', fileName))
  );
};
```

### 使用 umi 开发 webview

上一节我们通过调戏悠悠船长熟悉了 webview 面板的创建，这一节我们来看下如何使用 umijs 来代替 HTML 的内容。

`panel.webview.html` 中的内容其实就是正常的 HTML+JavaScript+CSS 代码。你可以使用任何前端技术去编写它的内容，比如 jquery、bootstrap、Vue 以及 React。虽然本文的例子是基于 umijs 开发 webview 的内容，但是其他技术原理是一样的，紫竹在后续也会提供多个技术的 vscode webview 开发脚手架。

#### 封装获取 umijs 打包产物的方法

我们知道 `umi build` 命令会在 *web/dist* 产生 index.html、umi.js、umi.css 三个文件，我们根据 index.html 改造前面的 getWebviewContent 方法如下：

```ts
import vscode from 'vscode';
import path from 'path';

/**
 * 获取基于 umijs 的 webview 内容
 * @param context 扩展上下文
 * @param webviewPanel webview 面板对象
 * @param rootPath webview 所在路径，默认 web
 * @param umiVersion umi 版本
 * @returns string
 */
export const getUmiContent = (
  context: vscode.ExtensionContext,
  webviewPanel: vscode.WebviewPanel,
  umiVersion?: string,
  rootPath = 'web'
) => {
  // 获取磁盘上的资源路径
  const getDiskPath = (fileName: string) => {
    return webviewPanel.webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, rootPath, 'dist', fileName))
    );
  };
  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
        />
        <link rel="stylesheet" href="${getDiskPath('umi.css')}" />
        <style>
          html, body, #root {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
        </style>
        <script>
          //! umi version: ${umiVersion}
        </script>
      </head>
      <body>
        <div id="root"></div>
        <script src="${getDiskPath('umi.js')}"></script>
      </body>
    </html>
  `;
};
```

> 提示：上面的方法我已经封装在 [@luozhu/vscode-utils](https://github.com/youngjuning/luozhu/tree/main/packages/vscode-utils) 的中。

我们使用 getUmiContent 重新前面的代码：

```ts
import { getUmiContent } from '@luozhu/vscode-utils';
...
panel.webview.html = getUmiContent(context, panel, '3.5.17');
```

#### 优化打包

由于我们封装了 `getUmiContent` 方法，`umi build` 生成的 index.html 就没有用了，我们可以使用 `HTML=none umi build` 命令在打包的时候不生成 index.html 文件。

另外目前 [umijs 的 mfsu 不支持 writeToDisk 方法](https://github.com/umijs/umi/issues/7132)，如果后续支持了可以使用 mfsu 优化调试速度。

> 创建 webview 面板的任务大部分都比较重复，为了沉淀最佳实践，我在 [@luozhu/vscode-utils](https://github.com/youngjuning/luozhu/tree/main/packages/vscode-utils) 封装了 [createUmiWebviewPanel](http://tny.im/bHLQx) 方法。

### 给 webview 内容加上主题

webview 可以基于当前的 VS Code 主题和 CSS 改变自身的样式。VS Code 将主题分成 3 种类别，而且在 body 元素上加上了特殊类名以表明当前主题，我们在 umi 中全局加入下面的样式：

```ts
body.vscode-light {
  h1, h2, h3, h4, h5, h6 {
    color: black;
  }
  color: black;
  background-color: var(--vscode-editor-background);
}

body.vscode-dark {
  h1, h2, h3, h4, h5, h6 {
    color: white;
  }
  color: white;
  background-color: var(--vscode-editor-background);
}

body.vscode-high-contrast {
  h1, h2, h3, h4, h5, h6 {
    color: red;
  }
  color: red;
  background-color: var(--vscode-editor-background);
}
```

由于这部分适配大部分是通用的，所以我也将它封装进了 `@luozhu/vscode-utils` 的 `getUmiContent` 中了。

## webview 与 vscode 交互

### webview 中执行脚本

vscode 中的 webview 本质就是一个 iframe，因此我们是可以再 webview 中执行脚本的，只不过在 vscode 中 webview 默认禁用了 JavaScript，我们在调用 `createWebviewPanel` API 时传入 `enableScripts: true` 即可。

### 插件传递信息给 webview

webview 的脚本能做到任何普通网页脚本能做到的事情，但是 webview 运行在自己的上下文中，脚本是不能访问 VS Code API 的。我们需要借助 postMessage 这种事件的方式传递信息。在 vscode 中，我们在 vscode 侧可以使用 [Webview.postMessage](https://vscode-api-cn.js.org/interfaces/Webview.html#postMessage) 发布事件并发送任何序列化的 JSON 数据，在 webview 侧则使用 `window.addEventListener('message' event => { ... })` 来处理这些信息：

**vscode 侧**：

```ts
// 注册一个新的命令
context.subscriptions.push(
  vscode.commands.registerCommand('juejin-me.author', () => {
    if (!currentPanel) {
      return;
    }

    // 把信息发送到 webview
    // 你可以发送任何序列化的 JSON 数据
    currentPanel.webview.postMessage({ method: 'showAuthor' });
  })
);
```

**webview 侧**：

```ts
import { Modal } from 'antd';
...
window.addEventListener('message', event => {
  const message = event.data;
  switch (message.method) {
    case 'showAuthor': {
      Modal.info({
        title: '紫竹',
        content: (
          <div>
            大家好，我是紫竹🎋一只住在杭城的木系前端🧚🏻‍♀️，如果你喜欢我的文章📚，可以通过
            <a href="https://juejin.cn/user/325111174662855/posts">点赞</a>帮我聚集灵力⭐️。
          </div>
        ),
        okText: <a href="https://juejin.cn/user/325111174662855/posts">点赞 o(￣▽￣)ｄ</a>,
      });
      break;
    }
    default:
      break;
  }
});
```

**效果**：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0dd7dd37db954d84925ac1c0f60cb965~tplv-k3u1fbpfcp-zoom-1.image)

### webview 传递信息给插件

webview 反向传递信息给插件的原理也是一样的，只不过由于 webview 的上下文限制，我们只能通过 `acquireVsCodeApi` 函数获取阉割版的 VS Code API 对象，这个阉割的对象上有一个 `postMessage` 函数可以供我们发送事件用。注意 `acquireVsCodeApi` 个会话中只能调用一次，重复调用会报错。而在插件侧则可以通过 [Webview.onDidReceiveMessage](https://vscode-api-cn.js.org/interfaces/Webview.html#onDidReceiveMessage) 处理 webview 传递的信息。我们来写一个在 webview 中调用 `vscode.window.showInformationMessage` 的例子：

**webview 侧**：

```ts
const vscode = acquireVsCodeApi();
vscode.postMessage({
  method: 'showMessage',
  params: {
    text: `为人民服务`,
  },
});
```

**插件侧**：

```ts
// 处理 webview 中的信息
currentPanel.webview.onDidReceiveMessage(
  message => {
    if (message.method === 'showMessage') {
      vscode.window.showInformationMessage(message.params.content);
    }
  },
  undefined,
  context.subscriptions
);
```

**效果**：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c32c8b374b534d6fac1cb552287de6ca~tplv-k3u1fbpfcp-zoom-1.image)

### 在 webview 中请求接口

一开始，我以为这是个轻松的工作，直到遇到跨域半天解决不了后我绝望了，在 [VSCode WebView插件（扩展）开发实战](https://juejin.cn/post/6844903966799577101#heading-3) 一文中我终于知道了 vscode webview 内部是不允许发送 ajax 请求，所有 ajax 请求都是跨域的，因为 webview 本身是没有 host 的。

人裂开了，这什么鬼呀，我们核心的需求就是请求掘金的接口获取我们的文章列表呀，那我们还有办法吗？答案是肯定的，其实还是借助上面我们提到的通信机制把请求接口的任务交给 vscode 去处理，完事再让 vscode 把数据通过 `postMessage` 返回给我们，多说无益，我们来看代码：

**webview 侧**：

```tsx
React.useEffect(() => {
  // @ts-ignore
  const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null;
  vscode.postMessage({
    method: 'queryPosts',
  });
  window.addEventListener('message', event => {
    if (method === 'queryPosts') {
      const message = event.data;
      console.log(message);
    }
  });
}, []);
```

**vscode 侧**：

```ts
// 处理 webview 中的信息，并返回接口请求的数据
currentPanel.webview.onDidReceiveMessage(
  async message => {
    const data = await events(message);
    currentPanel?.webview.postMessage({ data });
  },
  undefined,
  context.subscriptions
);
```

### @luozhu/vscode-channel

前面我们知道了使用 [Webview.postMessage](https://vscode-api-cn.js.org/interfaces/Webview.html#postMessage)、[Webview.onDidReceiveMessage](https://vscode-api-cn.js.org/interfaces/Webview.html#onDidReceiveMessage)、`acquireVsCodeApi().postMessage` 和 `window.addEventListener` 就可以满足各种通信需求了，那 `@luozhu/vscode-channel` 又是什么呢？

受 [js-channel](https://www.npmjs.com/package/js-channel) 启发，`@luozhu/vscode-channel` 主要是封装了 webview 与 vscode 交互流程，核心原理是通过暴露 `call`、`bind` 方法抹平 API 的差异，减少重复代码量。其中参考 appworks 和 cs-channel 使用 uuid 保证交互的可靠性。Talk is cheap, show you the code：

**webview 侧**：

```ts
// 创建 channel 对象
const channel = new Channel();
const getData = async () => {
  // 发起一个请求，并等待其返回数据
  const { payload } = await channel.call({ method: 'queryPosts' });
  console.log(payload);
};
```

> webview 中由于 acquireVsCodeApi 只能调用一次，之后又需要在多个地方使用，所以我们在 `wev/src/layouts/index.ts` 中创建一次并挂载到 `window` 对象上比较合适。

**vscode 侧**：

```ts
// vscode 侧的 channel 需要依赖上下文和 WebviewPanel 实例
const channel = new Channel(context, currentPanel);
// 绑定一个回调函数，一般只需要创建一个，然后根据约定做分发即可
channel.bind(async message => {
  const { eventType, method, params } = message;
  // 实际发起请求获取数据的地方
  const data = await events[eventType][method](params);
  // 这里将获取的数据直接返回即可，channel 内部会进行消息合并和回传。
  // 如果只是执行一个功能，不写 return 语句即可，内部会进行判断降级成单工通信。
  return data;
});
```

## vscode 国际化

我们都知道 vscode 中是可以切换语言环境的，一款优秀的 vscode 扩展至少要支持中英两种语言。而且支持国际化可以让你的插件受众直接突破国界限制。vscode 国际化分为三部分，一部分是配置的国际化，一部分是代码中的国际化，另一部分则是 webview 中 umijs 的国际化。本章我们就来具体看一下如何在 vscode 中实现国际化。

### 配置国际化

我们已经知道 vscode 中的配置都是在 _package.json_ 中，而配置的国际化是约定在 `package.nls.json` 和 `package.nls.zh-cn.json` 这种文件中编写。比如我们要在中英文环境下命令配置中英文版本，我们可以在 `package.nls.json` 中写：

```json
{
  "contributes.category.juejin-me": "Juejin Me"
}
```

在 `package.nls.zh-cn.json` 写：

```json
{
  "contributes.category.juejin-me": "掘金一下"
}
```

然后 `package.json` 中写：

```json
{
  "contributes": {
    "commands": [
      {
        ...
        "category": "%contributes.category.juejin-me%"
      },
    ]
  }
}
```

### 代码中国际化

推荐使用紫竹贡献过代码的 [vscode-nls-i18n](https://github.com/axetroy/vscode-nls-i18n)，使用方法也很简单，配置的话和上一节一样，在 `src/extension.ts` 中使用 `init` 方法初始化，然后使用 `localize` 方法实现国际化：

```ts
import { init, localize } from 'vscode-nls-i18n';
export function activate(context: vscode.ExtensionContext) {
  init(context.extensionPath); // 初始化国际化配置。只用在扩展激活时初始化一次
  console.log(localize('extension.activeLog')); // 之后就可以在各个文件中使用。
}
```

### umijs 国际化

umijs 的国际化需要使用 `@umijs/plugin-locale` 插件支持，这个插件封装了 `react-intl`，配置方式如下：

1、.umirc.ts 中配置 `local`

```ts
locale: {}
```

2、在 _src_ 目录下创建 `locales` 并创建 `en.ts` 或 `zh-CN.ts`

```ts
// src/locales/en.js
export default {
  WELCOME_TO_UMI_WORLD: "welcome to umi's world",
};
```

```ts
// src/locales/zh-CN.js
export default {
  WELCOME_TO_UMI_WORLD: '欢迎光临  umi  的世界',
};
```

3、使用国际化

```ts
import React from 'react';
import { useIntl } from 'umi';

export default: React.FunctionComponent = (props) => {
  const intl = useIntl()
  return (
     <div>
     {intl.formatMessage(
        {
          id: 'WELCOME_TO_UMI_WORLD',
        }
      )}<div>
   )
}
```

4、切换语言

切换语言，我们需要使用 `setLocale` 方法，需要注意的是我们给这个方法第二个参数传入 `false` 来实现无刷新动态切换。

```ts
import { setLocale } from 'umi';
// 不刷新页面
setLocale('zh-CN', false);
```

不过，切换语言的时机在什么时候呢？切换时机就是我们语言环境改变的时机。在 vscode webview 环境中，其实当使用 `Config display language` 方法切换语言环境后，会要求 vscode 重启。也就说我们只需要在 webview 创建时设置一次语言环境即可。由于 vscode 和 webview 传值太困难，我们选择在 `getUmiHTMLContent` 时传如 `vscode.env`：

```html
<script>
  window.vscodeEnv = ${JSON.stringify(vscode.env)}
</script>
```

然后，我们在 `web/src/layouts/index.ts` 中设置一下即可：

```ts
setLocale(window.vscodeEnv.language, false);
```

## “掘金一下” 扩展核心实现

灵感来源于现实，作为掘金的重度使用者，几乎每篇文章和笔记都同步在这里。当有些知识忘记需要查阅或拷贝代码时，我就有在掘金搜索我的文章的需求。但是掘金的搜索是全站的，就算加上自己的名字搜索也会出现大量无关记录。“掘金一下” 这个名字就像插件功能一样，在你想搜索自己掘金文章的时候就可以打开插件“掘金一下” 进行搜索。

其实为了只搜索到自己的文章，我想到的还有开发 chrome 插件来实现。但是考虑到市场和便捷性，我最终还是决定开发 vscode 插件来落地这个灵感。本章就是综合前面的经验实现 “掘金一下” 的核心逻辑。

### `juejin-me.start` 命令

#### vscode 侧开启 channel 通信

vscode 侧通过 `channel.bind` 绑定一个事件处理函数。

```ts
import events from './events';
...
context.subscriptions.push(
  vscode.commands.registerCommand('juejin-me.start', async () => {
    currentPanel = createUmiWebviewPanel(
      context,
      'juejin-me',
      localize('extension.webview-panel.title'),
      'assets/icon-luozhu.png',
      '3.5.17'
    );
    // 处理 webview 中的信息
    channel = new Channel(context, currentPanel);
    channel.bind(async message => {
      const { eventType, method, params } = message;
      // 根据事件类型、方法、参数来完成一次 api 调用，内置的 eventType 有 request、command 和 variable。
      const data = await events[eventType][method](params);
      return data;
    }, vscode);
  })
);
```

> 注意：我们不需要给定监听事件名，内部会根据 eventId 保证可靠性和全局唯一性

#### 注册 events

**events/index.ts**：

```ts
import requests from './requests';

export default {
  request: requests,
};
```

**events/requests**：

```ts
import vscode from 'vscode';
import request from '../utils/request';

const queryPosts = async (params: { cursor: string }): Promise<any> => {
  // 这里我们根据 vscode 配置动态取的用户 id
  const { userId } = vscode.workspace.getConfiguration('juejin-me');

  const { cursor } = params;
  const data = await request.post('/article/query_list', {
    cursor: `${cursor}`,
    sort_type: 2,
    user_id: userId,
  });
  return data;
};

export default {
  queryPosts,
};
```

**utils/request**：

这里简单封装了基于 axios 的请求对象。

```ts
/* eslint-disable no-param-reassign */
import axios from 'axios';
import vscode from 'vscode';
import qs from 'qs';

// 中文文档: http://t.cn/ROfXFuj
// 创建实例
const request = axios.create({
  baseURL: 'https://api.juejin.cn/content_api/v1/',
  timeout: 10000,
});

// 添加请求拦截器
request.interceptors.request.use(
  config => {
    if (config.method === 'get') {
      config.paramsSerializer = params => qs.stringify(params, { arrayFormat: 'repeat' });
    }
    return config;
  },
  error => {
    vscode.window.showErrorMessage(error.message);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  response => {
    const { data } = response;
    return data;
  },
  error => {
    vscode.window.showErrorMessage(error.message);
    return Promise.reject(error);
  }
);

export default request;
```

### webview 中调用接口

channel 是在 `web/src/layouts/index.tsx` 中初始化并挂载到 window 上的，我们在 `web/src/pages/index.tsx` 中调用 `window.channel.call` 即可调用指定接口。由于我们需要模糊搜索所有的文章，所以我们需要在初始化页面时一次请求完所有数据。

```tsx
const Homepage = () => {
  const getData = async () => {
    const { payload } = (await window.channel.call({
      eventType: 'request',
      method: 'queryPosts',
      params: { cursor },
    })) as any;
    tempData = tempData.concat(payload.data);
    setData(tempData);
    if (!payload.has_more) {
      setInitLoading(false);
      setCategories(_union(['全部', ...tempData.map(item => item.category.category_name)]));
      tempData = [];
    } else {
      cursor += 10;
      getData();
    }
  };
}
```

更多具体实现细节就是一些页面编写逻辑，不是本文的重点，感兴趣的同学可以直接进查看[源码](https://github.com/youngjuning/juejin-me/tree/main/web)。

### 配置掘金 ID

**声明配置**：

vscode 的配置我们需要借助 package.json 的 `contributes.configuration` 属性，我们的掘金 ID 是 string，所以声明如下：

```json
{
  "contributes": {
    "configuration": {
      "title": "%configuration.title%",
      "type": "object",
      "properties": {
        "juejin-me.userId": {
          "type": "string",
          "default": "325111174662855",
          "description": "%configuration.properties.juejin-me.userId%"
        }
      }
    }
  }
}
```

**修改配置的命令**：

让用户打开设置去修改配置也可以，但是为了用户体验，我们提供了 `juejin-me.configUserId` 命令，我们来看下命令的实现：

```ts
context.subscriptions.push(
  vscode.commands.registerCommand('juejin-me.configUserId', async () => {
    const userId = await vscode.window.showInputBox({
      placeHolder: localize('extension.juejin-me.configUserId.placeHolder'),
      validateInput: value => {
        if (value) {
          return null;
        }
        return localize('extension.juejin-me.configUserId.validateInput');
      },
    });
    const config = vscode.workspace.getConfiguration('juejin-me');

    config.update('userId', userId, true);
  })
);
```

- [vscode.window.showInputBox](https://vscode-api-cn.js.org/modules/window.html#showInputBox)：打开一个输入框，提示用户输入掘金用户 ID
- [vscode.workspace.getConfiguration](https://vscode-api-cn.js.org/modules/workspace.html#getConfiguration)：获取工作空间的配置对象
- [WorkspaceConfiguration.update](https://vscode-api-cn.js.org/interfaces/WorkspaceConfiguration.html#update)：更新一个配置值。
- [InputBoxOptions.validateInput](https://vscode-api-cn.js.org/interfaces/InputBoxOptions.html#validateInput)：一个可选的函数，被调用来验证输入信息并提示用户

### 插件效果展示

感兴趣的话你也可以直接在扩展中搜索“掘金一下”自行体验。

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac7d2ab498b2469486e8f237fc3b7997~tplv-k3u1fbpfcp-zoom-1.image)

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91ae0fdbff7043db9513e539640fcc2e~tplv-k3u1fbpfcp-zoom-1.image)

## 彩蛋

### @luozhu/create-vscode-webview

本文中有很多最佳实践，为了方便之后创建新的项目时减少重复工作，紫竹抽离出了一个简单的模板。掘友直接使用 `yarn create @luozhu/vscode-webview  myvscode` 即可创建出一个属于自己的 vscode 扩展。参考本文的一些实践再加一些你的创意即可完成一个出色的基于 webview 的 vscode 扩展。

### Word Count Juejin

为了答谢掘金平台和掘友一直以来的支持，我编写了一款专为掘金适配的 Markdown 文件字数统计 VS Code 扩展，字数统计会实时显示在状态栏。比起来 vscode 官方的 Word Count，我们支持中文字数统计，比起来 Word Count CJK，我们支持中英文混排。如果你也喜欢使用 VS Code 的 Markdown 编辑能力，那么一定不要错过紫竹的这款插件，下载请认准：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08c060326c954849b3eb2d34f2e6b0e5~tplv-k3u1fbpfcp-zoom-1.image)

如果你还在犹豫要不要下载，那不妨看下三个插件的统计对比，我们拿 `i love juejin. 我爱掘金` 这个字符串测试一下三款插件的功能：

| Word Count       | Word Count CJK | Word Count Juejin                |
| ---------------- | -------------- | -------------------------------- |
| 4 个字           | 4 个字         | 7 个字                           |
| 中文算成了一个字 | 直接忽略了英文 | 中文4 个字加英文三个字，格局正好 |

### vscode api cn

在学习和开发 vscode 插件的过程中，最大的痛点无过于 API 文档翻译的缺失。哪怕是硬着头皮看英文原版 API 文档，阅读体验也很差。为了方便自己、回馈社区，我和 [寒草](https://juejin.cn/user/703340610597064) 等小伙伴决定翻译 vscode api 类型声明并使用 Typedoc 承载，另外在完工后我们也会输出 `@types/vscode-cn` 类型包代替 `@types/vscode` 进一步方便 vscode 插件开发者。团队成员现状：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa80c1603b2e4482883fe39e1b44f62e~tplv-k3u1fbpfcp-zoom-1.image)

翻译是一件带有侠义精神的事业，欢迎更多的小伙伴加入我们。你可以浏览[仓库](https://github.com/vscode-cn/vscode-api-cn)和[官网](https://vscode-api-cn.js.org/)了解具体情况。

## 后记

这是第一次尝试写这么长的文章，断断续续经历了有半个月，本着对读者负责任的态度，文中的实践都是经过反复测试以及和同事朋友的讨论。当然 vscode 插件开发的概念和 API 比较多，一篇文章也很难讲全，讲透彻。如果大家感兴趣，可以在评论区告诉紫竹，我可以继续更新这方面的教程。

> 本文首发于「掘金专栏」，同步于公众号「程序人生」。
