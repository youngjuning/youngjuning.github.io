---
title: 字节 agent-tars 技术揭秘
description: ''
cover: ''
date: 2025-04-13 20:14:59
categories:
tags:
---

## 依赖

- `@tavily/core`：Tavily 的 JavaScript SDK 允许与 Tavily API 轻松交互，直接在 JavaScript 和 TypeScript 程序中使用 Tavily 的全部搜索和提取功能。利用强大的 Tavily Search 和 Tavily Extract API，轻松将智能搜索和内容提取功能集成到应用程序中。
- `@computer-use/node-mac-permissions`：用来管理 macOS 权限的 nodejs 包。
- `@agent-infra/mcp-server-commands`：执行任意命令的 MCP 服务器。
- `@agent-infra/mcp-server-filesystem`：访问文件系统的 MCP 服务器。
- `@agent-infra/mcp-server-browser`：操作浏览器的 MCP 服务器。

## 架构

### Electron

agent-tars 是一个基于 Electron 的桌面应用，Electron 的主进程（Main Process）和渲染进程（Renderer Process）是其双进程架构的核心设计，两者的职责、运行环境和交互方式决定了 Electron 应用的性能与安全性。

1. **主进程（Main Process）**
    - **​入口与生命周期管理**：作为应用的入口（`src/main/index.ts`），负责启动/关闭应用、管理窗口生命周期（如创建/销毁 `BrowserWindow` 实例）。
    - **​系统级交互**：直接访问 Node.js API 和操作系统资源（如文件系统、网络请求、系统通知），执行敏感操作（如加密数据处理）
    - **​全局状态控制**：管理跨窗口的全局数据（如用户配置、缓存），协调多渲染进程的通信。
2 . **渲染进程（Renderer Process）**
    - **UI 渲染与交互**：每个窗口对应一个独立的渲染进程，基于 Chromium 实现网页渲染，处理 HTML、CSS、JavaScript 的执行及用户交互（如点击事件）。
    - **部分 Node.js能力**：默认不启用 Node.js 集成，但可通过 `preload` 脚本和 `contentBridge` 暴露有限 API（如 `fs` 模块的部分功能）。
    - **沙箱环境**：出于安全考虑，渲染进程默认隔离，无法直接访问系统资源或执行危险操作。

## 渲染进程（src/renderer）

### 入口（src/main.tsx）

渲染进程的入口在 `src/main.tsx`，主要作用：

1. 执行 `initMonacoWorkers()` 方法初始化 MonacoWorkers，具体分析看 [initMonacoWorkers](#initMonacoWorkers)
2. 引入 `./components/App.tsx`，具体分析看 [App.tsx](#App.tsx)

### App.tsx

`main.tsx` 一般都是执行一些和 UI 无关的全局初始化操作，`App.tsx` 则是处理一些 UI 相关的全局初始化操作：

1. 调用 `useMainProcessErrorHandler()` 注册主进程错误处理程序，这不是我们关注的重点，请查看[源码](https://github.com/bytedance/UI-TARS-desktop/blob/main/apps/agent-tars/src/renderer/src/services/errorHandlerService.ts#L88)
2. 引入 `./components/AgentApp` 进行展示

### AgentApp.tsx

1. [`<LeftSidebar />`](https://github.com/bytedance/UI-TARS-desktop/tree/main/apps/agent-tars/src/renderer/src/components/LeftSidebar)：放置主题切换、会话管理和设置，这不是本文关注的重点。
2. [`<OpenAgentChatUI />`](#OpenAgentChatUI)：负责指令输入和 Agent 执行链展示
3. [`<CanvasPanel>`](#CanvasPanel)：负责展示 Agent 执行细节的展示

### OpenAgentChatUI

### CanvasPanel

## utils

### initMonacoWorkers

`initMonacoWorkers` 方法位于 `src/utils/monacoConfig`：

```ts
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

export function initMonacoWorkers(): void {
  self.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === 'json') {
        return new jsonWorker();
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker();
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker();
      }
      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker();
      }
      return new editorWorker();
    },
  };
}

export const defaultEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
  {
    readOnly: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    renderLineHighlight: 'all',
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible',
    },
    automaticLayout: true,
  };
```

## 参考

- [基于 MCP 的 AI Agent 应用开发实践](https://www.rustc.cloud/mcp)
