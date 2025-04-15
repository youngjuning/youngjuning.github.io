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
- `jotai`：轻量状态管理库

## 架构

### Monorepo

- pnpm workspace

### Electron

agent-tars 是一个基于 Electron 的桌面应用，Electron 的主进程（Main Process）和渲染进程（Renderer Process）是其双进程架构的核心设计，两者的职责、运行环境和交互方式决定了 Electron 应用的性能与安全性。

#### **主进程（Main Process）**

- **​入口与生命周期管理**：作为应用的入口（`src/main/index.ts`），负责启动/关闭应用、管理窗口生命周期（如创建/销毁 `BrowserWindow` 实例）。
- **​系统级交互**：直接访问 Node.js API 和操作系统资源（如文件系统、网络请求、系统通知），执行敏感操作（如加密数据处理）
- **​全局状态控制**：管理跨窗口的全局数据（如用户配置、缓存），协调多渲染进程的通信。

#### **渲染进程（Renderer Process）**

- **UI 渲染与交互**：每个窗口对应一个独立的渲染进程，基于 Chromium 实现网页渲染，处理 HTML、CSS、JavaScript 的执行及用户交互（如点击事件）。
- **部分 Node.js能力**：默认不启用 Node.js 集成，但可通过 `preload` 脚本和 `contentBridge` 暴露有限 API（如 `fs` 模块的部分功能）。
- **沙箱环境**：出于安全考虑，渲染进程默认隔离，无法直接访问系统资源或执行危险操作。

#### 进程间通信（IPC）机制

主进程与渲染进程通过 IPC（Inter-Process Communication）实现安全通信：

1、**异步通信**：

- 渲染进程通过 `ipcRenderer.send()` 发送消息，主进程通过 `ipcMain.on()` 监听并响应。
- 示例：渲染进程请求打开文件 → 主进程调用 `fs` 模块读取 → 结果返回渲染进程。

2、**同步通信**：

- 渲染进程通过 `ipcRenderer.sendSync()` 发送同步请求，主进程处理后返回结果（可能阻塞 UI 线程，慎用）

3、**预加载脚本（Preload Script）**

- 在渲染进程加载前注入，通过 `contextBridge.exposeInMainWorld()` 安全暴露主进程 API（如 `sendMessageToMain`）
- 示例：预加载脚本桥接 `ipcRenderer`，避免直接暴露 Node.js 功能。

## 渲染进程（src/renderer）

### main.tsx

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

```tsx
import { ChatUI as BaseChatUI } from '@vendor/chat-ui';
import { MenuHeader } from './MenuHeader';
import { AgentStatusTip } from './AgentStatusTip';
import { BeforeInputContainer } from './BeforeInputContainer';
import { useAgentFlow } from '@renderer/hooks/useAgentFlow';
import { WelcomeScreen } from '../WelcomeScreen';

export function OpenAgentChatUI() {
  const launchAgentFlow = useAgentFlow();

  const sendMessage = useCallback(
    async (inputText: string, inputFiles: InputFile[]) => {
      setIsSending(true);
      // 截止发稿日，暂不支持文件上传
      await launchAgentFlow(inputText, inputFiles);
      setIsSending(false);
    },
    [addUserMessage, launchAgentFlow],
  );

  return (
    <>
      <BaseChatUI
        onMessageSend={sendMessage}
        slots={{
          beforeMessageList: (
            <>
              <MenuHeader />
              {isInitialized && messages.length >= 0 && <WelcomeScreen />}
            </>
          ),

          beforeInputContainer: <BeforeInputContainer />,
          customFeatures: (
            <>
              <div className="flex gap-2">
                {isSending ? <AgentStatusTip /> : null}
              </div>
            </>
          ),
        }}
      />
    </>
  )
}
```

以上是去掉和 ChatUI 交互后的简化的核心代码，`@vender/chat-ui` 由于内部原因，暂未公开，可以关注 [issues#417](https://github.com/bytedance/UI-TARS-desktop/issues/417)。核心逻辑如下：

1. 用户输入完成后，触发 `sendMessage`，将用户输入发送给 `launchAgentFlow`
2. `launchAgentFlow` 触发 Agent 执行，详细代码请查看 [useAgentFlow](#useAgentFlow)

slots 插槽的配置分别是：

1. `beforeMessageList`，MessageList 前面的槽位，这里放了菜单栏和欢迎页
2. `beforeInputContainer`，InputContainer 前面的槽位，这里放了 [`<BeforeInputContainer />`](#BeforeInputContainer)，
3. `customFeatures`，自定义功能槽位，这里放了 `<AgentStatusTip />`，用来展示 Agent 的状态

#### BeforeInputContainer

```tsx
import { PlanTaskStatus } from './PlanTaskStatus';
import { UserInterruptArea } from './UserInterruptArea';

export function BeforeInputContainer() {
  return (
    <>
      <PlanTaskStatus />
      <UserInterruptArea isDark={isDarkMode.value} />
    </>
  );
}
```

1. `<PlanTaskStatus />`，计划任务状态，展示计划执行列表的进度
2. `<UserInterruptArea />`，用户中断区域，消息发送或执行中，允许用户发送新的消息或中断

### CanvasPanel

### hooks

#### useAgentFlow

```ts
import { useCallback } from "react";
import { AgentFlow } from '../agent/AgentFlow';
import { v4 as uuid } from 'uuid';

export function useAgentFlow() {
  return useCallback(
    async(inputText: string; inputFiles: InputFile[]) => {
      const agentFlowId = uuid();
      const agentFlow = new AgentFlow({
        agentFlowId,
        request: {
          inputText,
          // 截止发稿日，暂不支持文件上传
          inputFiles
        }
      });
      await agentFlow.run();
    },
    []
  )
}
```

1. `useAgentFow` hook 接收用户输入后，创建一个 [`AgentFlow`](#AgentFlow) 实例，并调用 `agentFlow.run()` 触发 Agent 执行

### agent

#### AgentFlow.ts

```ts
import { Aware, AwareResult } from './Aware';
import { Executor } from './Executor';
import { Greeter } from './Greeter';

export class AgentFlow {
  private abortController: AbortController;

  constructor(private appContext: AppContext) {}

  async run() {
    const greeter = new Greeter(this.appContext, this.abortController.signal);
    const aware = new Aware(
      this.appContext,
      agentContext,
      this.interruptController.signal,
    );
    // 构建执行器
    const executor = new Executor(
      this.appContext,
      agentContext,
      this.interruptController.signal,
    );

    // 展示 ai 打招呼消息
    const preparePromise = greeter.run().then(async () => {});

    await Promise.all([
      preparePromise,
      // 启动 Agent 循环
      this.launchAgentLoop(executor, aware, agentContext, preparePromise),
    ]);
  }

  private async launchAgentLoop(
    executor: Executor,
    aware: Aware,
    agentContext: AgentContext,
    preparePromise: Promise<void>
  ) {
    //  Agent 循环
    while(!this.abortController.signal.aborted && !this.hasFinished) {
      // 当任务没有被取消或完成时执行 Agent 循环
      const awareResult = await aware.run();
      if (this.abortController.signal.aborted) {
        // 如果任务被取消，则跳出 Agent 循环
        break;
      }

      if (
        awareResult.plan &&
        awareResult.plan.every(
          (task) => task.status === PlanTaskStatus.Done,
        )
      ) {
        // 如果所有任务都完成，则跳出 Agent 循环
        this.hasFinished = true;
        break;
      }

      const toolCallList = (await executor.run(awareResult.status)).filter(
        Boolean,
      );
      const mcpTools = await ipcClient.listMcpTools();
      const customServerTools = await ipcClient.listCustomTools();

      // 执行 工具
      for (const toolCall of toolCallList) {
         const toolName = toolCall.function.name;
      }
    }
  }
}
```


#### Executor

```ts
export class Executor {}
```

构建出的 executor 结构，我们主要关注

#### Aware

```ts
export class Aware {}
```

### utils

#### initMonacoWorkers

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

## 主进程（src/main）

### mcp client

```ts
import { MCPServerName } from '@agent-infra/shared';

//  TODO: 这里我很奇为什么不直接用 import，有空和三元大佬请教下
const dynamicImport = (url) => new Function(`return import('${url}')`)();

// 实现一个基于 commands、filesystem 和 browser 的 MCP 客户端
export const createMcpClient = async () => {
  // 动态导入 mcp server 模块
  const commandModule = await dynamicImport('@agent-infra/mcp-server-commands');
  const fsModule = await dynamicImport('@agent-infra/mcp-server-filesystem');
  const browserModule = await dynamicImport('@agent-infra/mcp-server-browser');

  const { client: commandClient } = commandModule.default;
  const { client: fsClient, setAllowedDirectories } = fsModule.default;
  const { client: browserClient } = browserModule.default;

  // 共享的 fClientModule 模块
  fsClientModule = fsModule.default;

  // 设置允许的目录
  const omegaDir = await getOmegaDir();
  setAllowedDirectories([omegaDir]);

  // 工具 map
  const toolsMap = {
    [MCPServerName.FileSystem]: {
      name: MCPServerName.FileSystem,
      description: 'filesystem tool',
      localClient: fsClient,
    },
    [MCPServerName.Commands]: {
      name: MCPServerName.Commands,
      description: 'commands tool',
      localClient: commandClient,
    },
    [MCPServerName.Browser]: {
      name: MCPServerName.Browser,
      local: true,
      description: 'browser tools',
      localClient: browserClient,
    }
  };

  logger.info('toolsMap', toolsMap);

  const client = new MCPClient(Object.values(toolsMap));
  mapClientRef.current = client;
  return client;
};
```


## 参考

- [基于 MCP 的 AI Agent 应用开发实践](https://www.rustc.cloud/mcp)
