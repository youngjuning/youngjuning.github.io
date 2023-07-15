---
title: 如何开发一款 VS Code yarn.lock 预览插件
description: 人们总是喜欢炫耀自己的新技能，紫竹也不例外，毕竟新技能需要大量的实战练习。在入门了 VS Code 扩展开发后，遇到开发痛点我就习惯地用 VS Code 插件的思路去解决。不过大多扩展 idea 都已经名花有主，直到我想到可以将 yarn.lock 文件可视化并搜索相关插件无果后，我知道机会来了。
date: 2023-02-26T21:56:50+08:00
categories:
  - [前端, VS Code]
tags:
  - VS Code
  - yarn.lock
  - vscode 中文文档
  - vscode 插件开发
  - vscode webview
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

> [Yarn Lock Preview](https://marketplace.visualstudio.com/items?itemName=youngjuning.yarn-lock-preview) 插件已发布，亲测已比较稳定，源码在 [vscode-yarn-lock-preview](https://github.com/youngjuning/vscode-yarn-lock-preview) ，如果对你些许帮助和启发，不妨赏一个 Star。

## 前言

在 [《从零开发一款基于 webview 的 vscode 扩展》](https://juejin.cn/post/7000589186898231333) 一文中，紫竹通过实战阐述了如何基于 webview 实现在 vscode 中展示自定义 UI 的功能，另外文章配套产物 [掘金一下](vscode:extension/youngjuning.juejin-me) 插件也已经发布，欢迎试用。

人们👨🏻‍💻总是喜欢炫耀自己的新技能，紫竹也不例外，毕竟新技能需要大量的实战练习。在入门了 VS Code 扩展开发后，遇到开发痛点我就习惯地用 VS Code 插件的思路去解决。不过大多扩展 idea 都已经名花有主，直到我想到可以将 `yarn.lock` 文件可视化并搜索相关插件无果后，我知道机会来了。

## 什么是自定义编辑器❓

在开始开发之前，我们有必要先了解一下什么编辑器？什么又是自定义编辑器？

VS Code 中编辑器（Editor）其实就是我们使用频率最高的编码的地方。如下图，VS Code 的用户界面分为 5 个部分，分别是 Activity Bar（活动栏）、Side Bar（侧边栏）、Editor Groups（编辑器组）、Panel（面板） 和 Status Bar（状态栏）。

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/301eab5bbab04c65aec4a927b7d306a9~tplv-k3u1fbpfcp-zoom-1.image)

自定义编辑器指的是 VS Code 中相对于默认文本编辑器的编辑器类型。根据用途不同，自定义编辑器又分为 [自定义文本编辑器](https://vscode-api-cn.js.org/interfaces/vscode.CustomTextEditorProvider.html)、[自定义编辑器](https://vscode-api-cn.js.org/interfaces/vscode.CustomEditorProvider.html) 和 [自定义只读编辑器](https://vscode-api-cn.js.org/interfaces/vscode.CustomReadonlyEditorProvider.html)。

自定义文本编辑器常被用来为 JSON、XML、CSV、JSON 或者任意 [文本文档](https://vscode-api-cn.js.org/interfaces/vscode.TextDocument.html) 提供自定义的视觉渲染。比如 [Svg Preview](https://marketplace.visualstudio.com/items?itemName=SimonSiefke.svg-preview)、[Markdown Preview Enhanced](https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced)、[Mermaid Preview](https://marketplace.visualstudio.com/items?itemName=vstirbu.vscode-mermaid-preview) 和 [Todo List](https://marketplace.visualstudio.com/items?itemName=saber2pr.todolist)。

自定义编辑器常被用来预览资产(assets)文件，比如 [3D Viewer for VSCode](https://marketplace.visualstudio.com/items?itemName=slevesque.vscode-3dviewer)、[Draw.io Integration](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio) 和 [Magick Image Reader](https://marketplace.visualstudio.com/items?itemName=elypia.magick-image-reader)

但他们的共同点都是使用了 VS Code 自定义编辑器这个功能。本文的目标其实就是实现一个和上述插件一样的 Preview 类型的扩展。

## 为什么开发 Yarn Lock Preview？

本来文章是没有这一章的。在插件刚发布的时候，没等文章写完，我就迫不及待地向同事和朋友以及常混迹的几个群推荐了我的插件，然后就被一个群友灵魂拷问了“你这有什么意义？”：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c054b9bca3b44b61b7b9ecc7206240a4~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/643f9dd16c734e8487866f6a3306f0f3~tplv-k3u1fbpfcp-watermark.image?)

开发一款自定义编辑器插件要比单纯的开发插件和 webview 插件都要麻烦，没有人会闲的无聊牺牲业余时间，做一个没有意思的事情。从学习角度来讲，可以掌握了大量 VSCode API，从作用来讲，更直观地查看 `yarn.lock` 并支持搜索某个包以及依赖该包的包。这在你想确定应用的间接引用了哪些包时很有帮助：

![screenshot.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2faa24d3cee4c9088e83c4d0ee06c63~tplv-k3u1fbpfcp-watermark.image?)

这其实是一个来自于实际工作中的一个痛点，React Native 中如果同时依赖两个不同版本的原生包，运行项目的时候就会因为重复注册某个 `View` 造成应用崩溃。入职涂鸦一年来，帮助业务同学排查了 N 次这个问题。由于某些版本的依赖并不是直接在 `dependencies` 中写的，而是某个包间接依赖的，我的办法是就是在 `yarn.lock` 中 `cmd+f` 搜索造成崩溃的包被哪些包依赖了，然后再人肉分析这个有结构的纯文本文件：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ee531d6d54d4d269984174b5bae97b8~tplv-k3u1fbpfcp-watermark.image?)

虽然我已经是处理这个问题的老司机了，但总归是会耽误不少我和同事的时间。上面的这个问题可能比较极端，还有一个我们经常遇到的开发的反馈是引入了某个原生包之后导致应用崩溃。这其实是因为我们的 React Native 应用是以嵌套的形式集成到已有原生涂鸦 App 内的，所以原生库的支持也是依赖 App 提供的版本。我们在打包的时候也有相应的检验工具，但是用户有可能没有直接依赖这个库，而是这个库间接或者间接地间接库引用了这个库。这个时候我们就得在上万行纯文本 yarn.lock 中开启人肉分析。

比如，App 目前支持的 react-native-svg 版本是 5.5.1。用户使用的 `react-native-svg-charts` 最新版依赖的是 react-native-svg `^6.2.1` 或者 `^7.0.3`。用户按照指引直接安装使用运行崩溃，然后找到我们质疑。那如果用了这款插件，我们就可以直接在项目中搜索：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95d979f9b7c549e68f8321dac0aaa481~tplv-k3u1fbpfcp-watermark.image?)

最后一个就是你一定可能会遇到的场景，比如开发声明的依赖是 `tuya-panel-kit@^4.6.0`，然后遇到问题，直接截图告诉你我没有升级过版本呀，为啥报错了或者为啥表现不一样了的问题。然后我们就得让用户看一下实际依赖的版本是什么。有的开发会去 `node_modules` 下面找，这其实不靠谱，层级那么复杂，想快速定位是很难的；有的开发会在 `yarn.lock` 中人肉搜索；或者有的开发直接让我们帮忙排查。那么有了这款插件，我们就可以直接让开发自己搜，然后截图提 issues 给我们：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7bc01f9c7df543db90d6f6b31444eeca~tplv-k3u1fbpfcp-watermark.image?)

> 温馨提示：`yarn list --pattern tuya-panel-kit` 命令也可以列出简要的依赖信息。

叨逼叨这么多，相信读者已经和我达成共识了，如果没有，欢迎评论区 Battle。废话不多说，下面就让我们来开始展示真正的技术吧。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c9f81662bba4518b8d075d132d870e1~tplv-k3u1fbpfcp-watermark.image?)

## 初始化项目

### 使用官方脚手架

1. 安装 [Yeoman](http://yeoman.io/) 和 [VS Code Extension Generator](https://www.npmjs.com/package/generator-code)：`npm install -g yo generator-code`
2. 生成项目：`yo code`

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
# ? What's the name of your extension? Yarn Lock Preview
# ? What's the identifier of your extension? yarn-lock-preview
# ? What's the description of your extension? Previews yarn.lock file
# ? Initialize a git repository? Yes
# ? Bundle the source code with webpack? No
# ? Which package manager to use? yarn

$ code ./vscode-yarn-lock-preview
```

### 规范化项目

1. 代码规范配置 - `npx @luozhu/create-coding-style`
2. 按照新的代码规范格式化代码 - `yarn lint --fix`
3. Git Commit 规范配置 - `npx @luozhu/create-commitlint`

### 扩展信息配置

1. 扩展信息配置（package.json）
   1. 配置 [publisher](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#create-a-publisher)
   2. 添加上 `license` 字段。
   3. 添加 `repository` 字段。
   4. 配置 `icon`：128 x 128 像素图标的路径。
2. 修改 readme：因为初始的没法通过 `vsce package` 校验
3. 使用 `npx vsce package` 尝试打包，确保没有错误和警告

### 使用 esbuild 打包

在 [从零开发一款基于 webview 的 vscode 扩展](https://juejin.cn/post/7000589186898231333/#heading-8) 中我们讲述了使用 esbuild 打包可以减小打包产物的体积以及加快调试速度。参考上一篇文章即可完成配置，这里就不赘述了。

### Don't repeat yourself

本着重复的工作都可以用脚本代替的原则，我 vscode 插件开发的最佳实践沉淀为了一个脚手架，执行 `yarn create @luozhu/vscode-extension` 即可快速开始开发 vscode 扩展。

## 自定义编辑器原理

### 工作机制

前面我们已经知道了在 VS Code 中自定义编辑器有三种：自定义文本编辑器、自定义编辑器和自定义只读编辑器。三种类型的编辑器都会替换 VS Code 中的标准文本编辑器展示的位置。不同的是自定义文本编辑器由于是基于 VS Code 的标准文本文档模型，不需要开发者提供，比如 [Svg Preview](https://marketplace.visualstudio.com/items?itemName=SimonSiefke.svg-preview) 插件。而自定义编辑器用于二进制文件的预览，因此需要开发者自己提供文档模型并自行实现诸如保存和备份这些功能比如 [Draw.io Integration](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio) 插件。自定义只读编辑器则用于预览二进制文件，比如 [Magick Image Reader](https://marketplace.visualstudio.com/items?itemName=elypia.magick-image-reader)。

了解了三种自定义编辑器的区别，我们来看下我们的插件属于哪种自定义编辑器。其实答案显而易见，`yarn.lock` 文件属于 VS Code 标准文档模型，我们选用最简单的自定义文本编辑器即可。

编写一个自定义编辑器会涉及视图、插件、文档模型、底层资源文件以及它们之间的交互，其大概原理如下图：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/116948b627f4406ba51faa0353f147a7~tplv-k3u1fbpfcp-zoom-1.image)

由于预览 `yarn.lock` 不需要我们提供文档模型，因此我们只需要基于 [CustomTextEditorProvider](https://vscode-api-cn.js.org/interfaces/vscode.CustomTextEditorProvider.html) 编写一个 CustomEditorProvider 给插件注册使用，然后编写我们的视图（用户界面），最后实现视图和插件的交互即可。

其中我们需要关注的点有如何开发视图、视图和插件如何通信、如何实现 CustomEditorProvider 以及如何注册 CustomEditorProvider。

### 如何开发视图

视图是通过 webview 实现的，所以你可以通过标准的 HTML、CSS 和 JavaScript 构建用户体验，也可以使用你熟悉的前端框架实现。

### 视图如何与插件通信

由于 VS Code 的限制，Webview 是不能直接访问 VS Code API 以及发送网络请求的，但是它可以通过 postMessage 与插件进行双向通信。但是手写双向通信比较麻烦，尤其是进行网络请求时，webview 需要先发送发起网络请求的消息，插件侧注册的监听事件发起网络请求，插件等待网络请求返回后再发送消息将数据发给 webview，最后 webview 通过注册的监听事件获取信息。简要的流程如下：

![webview 通信原理.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20f34a967c234945afbaf9aaf2901163~tplv-k3u1fbpfcp-watermark.image?)

抛开具体实现来看这个交互就已经很反人类了，而且具体使用时还会面对 webview 和插件用到的 API 也不一样导致的转换成本和心智负担。为了解决这个痛点，我封装了 [@luozhu/vscode-channel](https://www.npmjs.com/package/@luozhu/vscode-channel) 来实现好用的双向通信。你可以简单地在 webview 侧通过 `call` 方法调用方法并等待处理结果，插件侧通过 `bind` 方法绑定事件处理。

### 如何实现 CustomEditorProvider

参考官方 Demo [catScratchEditor](https://github.com/microsoft/vscode-extension-samples/blob/main/custom-editor-sample/src/catScratchEditor.ts#L16) 我们可以看到 `CatScratchEditorProvider` 是通过实现了 `vscode.CustomTextEditorProvider` 接口创建的自定义编辑器 Provider。而 `vscode.CustomTextEditorProvider` 这个接口只有一个方法  `resolveCustomTexEditor`。所以原理上我们只需要实现 `resolveCustomTexEditor` 这个方法即可。

### 如何注册 CustomEditorProvider

实现了自定义编辑器 Provider 之后，我们需要将其注册到插件中，VS Code 提供了 `vscode.window.registerCustomEditorProvider` 方法用来完成这项任务。

## 自定义编辑器实现

纸上得来终觉浅，绝知此事要躬行。如果对前面的概念感到困惑，那接下来的实战可能会让你豁然开朗。

### 声明自定义编辑器

自定义编辑器是通过 `package.json` 的贡献内容（`contributes`）的 `customEditors` 属性声明的，`customEditors` 提供自定义编辑器。它是一个数组，也就是说我们可以在一个扩展中提供多个自定义编辑器。我们声明的自定义编辑器如下：

```json
"contributes": {
  "activationEvents": [
    "onCustomEditor:yarn-lock-preview.yarnLock"
  ],
  "customEditors": [
    {
      "viewType": "yarn-lock-preview.yarnLock",
      "displayName": "Preview yarn.lock",
      "selector": [
        {
          "filenamePattern": "yarn.lock"
        }
      ],
      "priority": "option"
    }
  ]
},
```

- `activationEvents` - 注册激活事件
  - `onCustomEditor:*` - 激活自定义编辑器的事件
- `customEditors` - 提供的自定义编辑器。
  - `viewType` - 自定义编辑器的标识符。它在所有自定义编辑器中都必须是唯一的，因此建议将扩展 ID 作为 `viewType` 的一部分包括在内。在使用 `vscode.registerCustomEditorProvider` 和在 `onCustomEditor:${id}` 激活事件中注册自定义编辑器时，使用 `viewType`。
  - `displayName` - 自定义编辑器的用户可读名称。当选择要使用的编辑器时，向用户显示此名称。
  - `selector` - 为其启用了自定义编辑器的一组 glob。
  - `priority` - （可选）确定自定义编辑器的使用时机。这个字段控制合适使用特定的自定义编辑器。
    - `option` - 在用户打开资源时不会自动使用此编辑器，但用户可使用 `Reopen With` 命令切换到此编辑器。
    - `default` - 在用户打开资源时自动使用此编辑器，前提是没有为该资源注册其他默认的自定义编辑器。

我们现在可以打开一个 `yarn.lock` 文件，并在命令面板中输入 `Reopen with` 选择我前面注册的 `Preview yarn.lock`：

![Kapture 2021-09-14 at 11.28.37.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/376a6b66b7c24de589fb48a54d29efb6~tplv-k3u1fbpfcp-watermark.image?)

这时我们可以看到一个空白的编辑器以及顶部的不会停止的加载进度条。

打开命令面板输出命令的方式对用户来说不是很友好，我们可以在编辑器菜单中添加一个切换按钮实现快速切换编辑器模式。首先我们在 `package.json` 中配置命令和菜单：

```json
"contributes": {
  "commands":[
    {
      "command": "yarn-lock-preview.switchEditorMode",
      "title": "switch editor mode",
      "icon": "$(rocket)"
    }
  ],
  "menus": {
    "editor/title": [
      {
        "command": "yarn-lock-preview.switchEditorMode",
        "group": "navigation"
      }
    ]
  }
}
```

- `commands` - 对命令面板提供命令。
- `menus` - 向编辑器提供菜单项。

然后在 `src/extension` 中的 active 函数中注册命令及实现命令回调：

```ts
import { commands, ExtensionContext } from 'vscode';

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "yarn-lock-preview" is now active!');

  context.subscriptions.push(
    commands.registerCommand('yarn-lock-preview.switchEditorMode', () => {
      commands.executeCommand('workbench.action.reopenWithEditor');
    })
  );
}
```

我只找到了 `workbench.action.reopenWithEditor` 这个可以触发的命令，我本意是实现类似 git 的**打开文件**和**打开更改**的功能。由于学艺不精，[git.openFile](https://github.dev/microsoft/vscode/blob/f66a3e06bcb9f000e5dc0ad0040ff9b32fc75c78/extensions/git/src/commands.ts#L655-L656) 的实现我还需要再研究一下，如果有大佬看到这来可以指点一下。目前效果如下：

![Kapture 2021-09-14 at 12.46.00.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb03abea51634bd3a0a8c1a27b155ec0~tplv-k3u1fbpfcp-watermark.image?)

### 注册自定义编辑器 Provider

现在我们已经注册了自定义文档类型 `yarn-lock-preview.yarnLock` 和 `onCustomEditor:yarn-lock-preview.yarnLock` 激活事件。现在我们需要借助 [window.registerCustomEditorProvider](https://vscode-api-cn.js.org/modules/window.html#registerCustomEditorProvider) 方法注册对应的自定义编辑器 Provider。

如果这时候尝试调用 `registerCustomEditorProvider` 方法，你会发现我们并没有一个自定义编辑器 provider 可以使用，下一节我们会实现自定义编辑器 Provider。

```ts
import vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "yarn-lock-preview" is now active!');

  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(
      'yarn-lock-preview.yarnLock',
      provider // 自定义编辑器 provider 实例
    );
  );
}
```

### 实现自定义编辑器 Provider

由于我们要预览的文件是 VS Code 的标准文档模型，所以我们需要基于 `CustomTextEditorProvider` 这个接口封装一个类来实现它。为此我们新建一个 `YarnLockEditorProvider.ts` 文件，该文件的最小实现如下：

```ts
import vscode from 'vscode';

class YarnLockEditorProvider implements vscode.CustomTextEditorProvider {
  // 将 context 注入 this 对象
  constructor(private readonly context: vscode.ExtensionContext) {}

  /**
   * 当自定义编辑器打开时调用。
   */
  async resolveCustomTextEditor(
    _document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    // 给 webview 设置初始内容
    webviewPanel.webview.options = {
      enableScripts: true, // 允许在 webview 中运行脚本
    };
    webviewPanel.webview.html = this.getHtmlForWebview();
  }

  private getHtmlForWebview(): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cat Coding</title>
        </head>
        <body>
            <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
        </body>
        </html>
    `;
  }
}

export default YarnLockEditorProvider;
```

- `class YarnLockEditorProvider implements vscode.CustomTextEditorProvider` - 声明一个类实现自定义文本编辑器 provider。
- [resolveCustomTextEditor](https://vscode-api-cn.js.org/interfaces/CustomTextEditorProvider.html#resolveCustomTextEditor)：根据给定的文本资源解析自定义编辑器。当用户第一次打开一个 `CustomTextEditorProvider` 的资源时，或者当他们使用这个 `CustomTextEditorProvider` 重新打开一个现有的编辑器时，该方法将被调用。
- `webviewPanel.webview.options` - 配置 webview 选项，这里我们配置了允许使用脚本。
- `webviewPanel.webview.html = this.getHtmlForWebview()` - 为 HTML 设置初始内容。

为了简化初始化操作，我们为 `YarnLockEditorProvider` 类封装一个 `register` 静态方法：

```ts
static register(context: vscode.ExtensionContext): vscode.Disposable {
  const provider = new YarnLockEditorProvider(context);
  const providerRegistration = vscode.window.registerCustomEditorProvider(
    YarnLockEditorProvider.viewType,
    provider,
    {
      webviewOptions: {
        retainContextWhenHidden: true, // 隐藏时保留上下文
      },
    }
  );
  return providerRegistration;
}

private static readonly viewType = 'yarn-lock-preview.yarnLock';
```

现在我们就可以注册我们的自定义编辑器 provider 了，在 `src/extension.ts` 的 `activate` 方法中调用 `YarnLockEditorProvider.register(context)` 得到注册的自定义编辑器，然后 `push` 到代理监听数组中即可：

```ts
import vscode from 'vscode';
import YarnLockEditorProvider from './YarnLockEditorProvider';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(YarnLockEditorProvider.register(context));
}
```

这样一个简单但完整的自定义编辑器就完成了：

![Kapture 2021-09-14 at 17.00.55.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6addd1cb739448db52db1767154fe65~tplv-k3u1fbpfcp-watermark.image?)

## yarn.lock 可视化预览实现

前面我们已经顺利带大家实现了在自定义编辑器中看猫的功能。当然了，我们的最终目标可不是看黑猫敲代码。这一章我们将挑战最后的 Boss：实现一个可以搜索的 yarn.lock 依赖 Json 树。

### 解析 yarn.lock 文件

解决了技术问题，现在我们来看下业务问题。我们的痛点是 yarn.lock 文件是纯文本的，阅读起来比较困难，需要一个更好的展示形式。那我们可以第一步肯定是将文本文件转成更易处理的资源，作为前端，当然首选 JSON。借助 Yarn 官方的 [@yarnpkg/lockfile](https://www.npmjs.com/package/@yarnpkg/lockfile) 工具我们就可以实现这个功能。我们来编写 demo 试一下。

```ts
import * as lockfile from '@yarnpkg/lockfile';
class YarnLockEditorProvider implements vscode.CustomTextEditorProvider {

  /**
   * 当自定义编辑器打开时调用。
   */
  async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    ...
    // 获取纯文本并解析成 json 数据
    const json = lockfile.parse(document.getText()).object;
    // 将 JSON 字符串传递给 HTML 拼装方法展示
    webviewPanel.webview.html = this.getHtmlForWebview(JSON.stringify(json));
    ...
  }
  private getHtmlForWebview(json: string): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cat Coding</title>
        </head>
        <body>
          <h1>JSON 数据</h1>
          <p>${json}</p>
        </body>
        </html>
    `;
  }
}
```

效果如下：

![Kapture 2021-09-14 at 18.59.12.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/979363c7be8c42d59e2aa564cf687c26~tplv-k3u1fbpfcp-watermark.image?)

### webview 集成 umijs

参考 [《# 从零开发一款基于 webview 的 vscode 扩展》](https://juejin.cn/post/7000589186898231333/#heading-9) 和 [vscode-juejin-me](https://github.com/youngjuning/vscode-juejin-me) 初始化 umijs 项目并做一些修剪适配工作。然后使用 `@luozhu/vscode-utils` 的 `getUmiHTMLContent` 方法获取 HTML 内容：

```ts
webviewPanel.webview.html = getUmiHTMLContent(this.context, webviewPanel, {
  title: 'Yarn Lock Preview',
});
```

### webview 内容更新

集成 umijs 后我们通过 `webviewPanel.webview.html` 设置的初始内容是空的。如果我们想要将文本传递从插件传递到 webview，我们需要进行一次通信。VS Code 中由于种种限制造成了编写通信的代码很繁琐。基本依赖 webview 的插件都会将通信机制给封装了。我这里的封装思路是借鉴了 [js-channel](https://www.npmjs.com/package/js-channel) 实现了一个使用起来心智负担最小的 [@luozhu/vscode-channel](https://github.com/youngjuning/luozhu/tree/main/packages/vscode-channel#readme)。借助这个工具我们可以很方便地实现更新 webview 的操作：

**插件侧发送更新消息：**

```ts
import Channel from '@luozhu/vscode-channel';
class YarnLockEditorProvider implements vscode.CustomTextEditorProvider {
  async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    // 给 webview 设置初始内容
    webviewPanel.webview.options = {
      enableScripts: true,
    };

    webviewPanel.webview.html = getUmiHTMLContent(this.context, webviewPanel, {
      title: 'Yarn Lock Preview',
    });

    // 初始化一个 channel 对象
    const channel = new Channel(this.context, webviewPanel);
    const json = lockfile.parse(document.getText()).object;
    // 触发 updateWebview 事件，并将文本作为参数传入
    channel.call('updateWebview', json);
  }
}
```

**webview 侧监听消息：**

```tsx
import Channel from '@luozhu/vscode-channel';

export default function HomePage() {
  const [data, setData] = React.useState({});
  React.useEffect(() => {
    channel.bind('updateWebview', message => {
      setData(message.params);
    });
  },[])
}
```

### 文本内容同步

前面一章我们实现了初始内容的同步，但是内容不是一成不变的，`yarn.lock` 很可能会变化，这时候我们也需要相应地更新我们内容，这个需求我们需要借助 `vscode.workspace.onDidChangeTextDocument` 事件监听来实现：

```ts
// 仍然是在 resolveCustomTextEditor 方法中实现
// 由于需要对 json 数据处理和重复调用更新方法，封装了此方法
function updateWebview(textDocument: vscode.TextDocument) {
  let json = lockfile.parse(textDocument.getText());
  switch (json.type) {
    case 'merge':
      // TODO: 处理 merge type
      break;
    case 'conflict':
      // TODO: 处理 conflict type
      break;
    default:
      json = json.object;
  }
  channel.call('updateWebview', json);
}
// 注册钩子事件处理程序，这样我们就可以使 webview 与文本文档同步。
//
// 文本文件作为我们的模型，所以我们必须将文件中的变化同步到我们的编辑器。
// 请记住，一个文本文件也可以在多个自定义编辑器之间共享（例如，当你分割一个自定义编辑器时就会发生这种情况）。
const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
  if (e.document.uri.toString() === document.uri.toString()) {
    updateWebview(e.document);
  }
});
// 确保当我们的编辑器关闭时，移除了监听器。
webviewPanel.onDidDispose(() => {
  changeDocumentSubscription.dispose();
});
```

### 实现可搜索的 JSON View

搜索实现不复杂，大家感兴趣可以直接阅读源码，UI 用的是 umi 自带的 antd。JSON View 我选用了 `react-json-view`，这个有几点比较有意思可以讲一下。

1. 数据量过大时渲染性能差需要判断是否折叠

```tsx
import ReactJson from 'react-json-view';
...
<ReactJson
  shouldCollapse={filed => {
    // 除了根目录都折叠
    if (filed.name) {
      return true;
    }
    return false;
  }}
/>
```

2. 样式符合当前主题

```tsx
import ReactJson from 'react-json-view';

const getCssVar = (cssVar: string) => {
  const htmlStyle = document.documentElement.style;
  return htmlStyle.getPropertyValue(cssVar).trim();
};

...
<ReactJson
  style={{
    backgroundColor: getCssVar('--vscode-editor-background'),
    fontSize: getCssVar('--vscode-editor-font-size'),
  }}
/>
```

3. 亮暗主题适配

完美的适配肯定是要随着主题的更改切换 ReactJson 的主题，我们需要在插件侧发起通知：

```ts
// 初始主题
channel.call('updateColorTheme', vscode.window.activeColorTheme);
// 监听主题改变事件
vscode.window.onDidChangeActiveColorTheme(colorTheme => {
  channel.call('updateColorTheme', colorTheme);
});
```

然后在 webview 侧监听 `updateColorTheme` 事件：

```tsx
const [theme, setTheme] = React.useState<ThemeKeys>();
...
React.useEffect(() => {
channel.bind('updateColorTheme', message => {
  const { kind } = message.params;
  setTheme(kind === 1 ? 'rjv-default' : 'monokai');
});
}, []);
...
<ReactJson
  theme={theme}
/>
```

文章开头已经演示了用户界面，这里放一张黑色主题效果吧：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8449b0b270aa423da2ede94f4ad10805~tplv-k3u1fbpfcp-watermark.image?)

## 涉及 API 附录

VS Code 插件开发涉及知识点比较多，每种插件类型都有自己的套路和 API。基于关注分离原则，这里列出了和自定义编辑器相关的一些 API，方便大家以及未来的我查阅。

### vscode.commands.registerCommand

注册一个可以被键映射、菜单项、动作或直接调用的命令。用一个现有的命令标识符注册两次一个命令将导致错误。

### vscode.TextDocument

### vscode.window.registerCustomEditorProvider

为 `customEditors` 扩展功能点贡献的 `viewType` 注册一个自定义编辑器的 Provider。

当打开一个自定义编辑器被时，会触发一个 `onCustomEditor:viewType` 活动事件。你的扩展必须为 `viewType` 注册一个 `CustomTextEditorProvider`、`CustomReadonlyEditor`  或 `CustomEditorProvider` 作为激活的一部分。

### vscode.CustomTextEditorProvider

基于文本的自定义编辑器 provider。

基于文本的自定义编辑器使用 TextDocument 作为其数据模型。因为它允许编辑器处理许多常见的操作，如撤销和备份。provider 负责在 webview 和 TextDocument 之间同步文本变化。

#### CustomTextEditorProvider.resolveCustomTextEditor

根据给定文本资源解析一个自定义编辑器。该方法将在用户第一次为 `CustomTextEditorProvider` 打开一个资源时，或者他们使用这个 `CustomTextEditorProvider` 重新打开已经存在的编辑器时被调用。

### vscode.CustomReadonlyEditorProvider

使用自定义文档模型的只读自定义编辑器 Provider。

自定义只读编辑器使用 `CustomDocument`，而不是 `TextDocument`。

当处理二进制文件或者更复杂的场景时，你应该使用这个类型的自定义编辑器。简单的基于文本的文档请使用 `CustomTextEditorProvider`。

### vscode.CustomEditorProvider

使用自定义文档模型的可编辑自定义编辑器的 provider。

自定义编辑器使用 `CustomDocument`，而不是 `TextDocument`。这使得扩展程序可以完全控制编辑、保存和备份等操作。

当处理二进制文件或者更复杂的场景时，你应该使用这个类型的自定义编辑器。简单的基于文本的文档请使用 `CustomTextEditorProvider`。

### vscode.WebviewPanel

一个包含 webview 的面板。

> 本文首发于 [掘金专栏](https://juejin.cn/user/325111174662855/posts)，同步于 [紫竹的博客](https://youngjuning.js.org) 和公众号 [紫竹早茶馆](https://cdn.jsdelivr.net/gh/youngjuning/images/20210418112129.jpeg)。
