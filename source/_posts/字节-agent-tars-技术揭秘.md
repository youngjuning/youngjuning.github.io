---
title: 字节 agent-tars 技术揭秘（硬啃）
description: '逐文件去了解 agent-tars 代码，没有顺序，没有思路'
cover: ''
date: 2025-04-13 20:14:59
categories:
  - [AGI]
tags:
  - agent
  - tars
  - bytedance
  - ReAct
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
import { ToolCallType } from '@renderer/type/agent';
import { Aware, AwareResult } from './Aware';
import { EventManager } from './EventManager';
import { Executor } from './Executor';
import { Greeter } from './Greeter';
import { ipcClient } from '@renderer/api';
import { SNAPSHOT_BROWSER_ACTIONS } from '@renderer/constants';

export class AgentFlow {
  private abortController: AbortController;

  constructor(private appContext: AppContext) {
    this.eventManager = new EventManager(omegaHistoryEvents);
  }

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
        const isMCPToolCall = mcpTools.some(
          (tool) => tool.name === toolCall.function.name,
        );

        // 如果是执行 MCP 工具
        if (isMCPToolCall) {
          if (
            // 如果是编辑和写入文件
            toolName === ToolCallType.EditFile ||
            toolName === ToolCallType.WriteFile
          ) {
            const params = JSON.parse(
               toolCall.function.arguments,
             ) as ToolCallParam['edit_file'];
             originalFileContent = await ipcClient.getFileContent({
               filePath: params.path,
             });
          }
          const callResult = (await executor.executeTools([toolCall]))[0];
          await this.eventManager.handleToolExecution({
            toolName,
            toolCallId: toolCall.id,
            params: toolCall.function.arguments,
            result: callResult.content,
            isError: callResult.isError as boolean,
          });
        }

        // 如果是执行浏览器快照动作
        if (SNAPSHOT_BROWSER_ACTIONS.includes(toolName)) {
          //
          const screenshotPath = await ipcClient.saveBrowserSnapshot();
          console.log('screenshotPath', screenshotPath);
        }
      }
    }
  }
}
```

#### Aware

```ts
export class Aware {
  private systemPrompt = `You are an AI agent with the ability to analyze the current environment, decide the next task status, tell user the next specific action.

<task_description>
You must call the aware_analysis tool.

You should give the insights of current environment according to the various context information, and then decide the next task status.

If the task is none or current step is done, you should increment the step number and update system status. Please return the json output in the tool call part:

\`\`\`json
{
  "reflection": "[your reflection about current environment]",
  "step": "[next step number]",
  "plan": "[steps array with id and title fields]",
  "status": "[next task description, a complete sentence tell user what to do next]",
}
\`\`\`

You should output the reflection first.

You should not output any response text and only return the tool call.

Only when there is no existing plan in the current environment, you should return plan field with the following format:
- id: string (format: "step_XXX" where XXX is a sequential number starting from 001)
- title: string (clear, concise description of the step)

</task_description>


<think_steps>
For any given task or problem:
1. Analyze the requirements thoroughly
2. Create a systematic, step-by-step solution
3. Ensure each step is concrete and actionable
4. Maintain logical progression between steps
</think_steps>

<limitation>
You must follow these limitations:

- If there is plan exist, you should not return the plan field.
- Don't ask user anything, just tell user what to do next. If some points is not very clear, you should tell user your solution. Remember, you are a agent for human.
- Don't output any response text and only return the tool call.
- You should not repeat the same behavior or mean with previous steps.
- Don't output any file path in current machine and ensure the security in your message. Don't output any absolute path in your message.

</limitation>

<update_plan_in_process>

Only except user interrupt or start a new session, you CANNOT update the plan!

If you reset the plan to a new one, you should also reset the step to number 1.

</update_plan_in_process>


<status_field>

In the \`status\` field, you should only return a sentence to tell user what you will do next, and don't need to return the reason and other information.Please the the first person perspective to answer, indicating that you are work for the user.

</status_field>


<end_step>

If in the last step, but we still have issues to solve, you cannot increment the step number and should continue to solve the issue.

</end_step>

<user_interrupt>

For user interrupt input in the middle of the event stream, you should handle it in the first important level and handle it as soon as possible.If current plan tasks cannot match the new user input, you should reset the plan.

</user_interrupt>

<event_stream>

The event stream result record the complete response of the agent, you should make next decision base on the history, if current step has not been done, please don't increment the step number. If you meet the \`ended\` message, that means you entered a new session and you should reset the plan from scratch.

In the event stream, the \`observation\` type message is the observation of the tool use, you should attention to the field and judge the task status according to it.When the observer represent the error message, you should reflect the error and solve it in the next step.

</event_stream>

<after_web_search>

After \`web_search\` called, then you must select web page from the search result, then you must see the detail of the page, call navigate to get detail. See the detail right away after get search result!

</after_web_search>

<write_file>

When you want to write file, you should list allowed directories and write the file to the allowed directory.

</write_file>


<language>

You should use the same language as the user input by default.

</language>`;
  async run() {
    // 获取环境信息
    const environmentInfo = await this.agentContext.getEnvironmentInfo(
      this.appContext,
      this.agentContext,
    );
    // 默认结果
    const defaultResult = {
      reflection: 'No plan',
      step: this.agentContext.currentStep,
      status: 'No plan',
      plan: [],
    };

    return new Promise(resolve, reject) => {
      try {
        // 获取执行器工具列表
        const executorTools = await ipcClient.listTools();
        // 调用 LLM
        const result = await ipcClient.askLLMTool({
          messages: [
            Message.systemMessage(this.systemPrompt),
            Message.systemMessage(
              `You are working with executor agent, here is the executor tools: ${executorTools
                .map((tool) => `${tool.name}: ${tool.description}`)
                .join(', ')}`,
            ),
            Message.userMessage(environmentInfo),
            Message.userMessage(
              `Please call aware_analysis tool to give me next decision.`,
            ),
          ],
          tools: [
            {
              type: 'function',
              function: {
                name: 'aware_analysis',
                description:
                  'Analyze the current environment with user input, and decide the next task status',
                parameters: this.awareSchema,
              },
            },
          ],
          requestId: streamId,
        });
        const awareResult = JSON.parse(
          result.tool_calls.filter(Boolean)[0].function.arguments,
        ) as AwareResult;
        resolve(awareResult);
      } catch (error) {
        reject(error);
      }
    }
  }
}
```

`src/main/ipcRoutes/llm.ts`

```ts
export const llmRoute = t.route({
  askLLMTool: t.procedure.input().handle(async ({ input }) => {
    try {
      const messages = input.messages.map((msg) => new Message(msg));
      const response = await llm.askTool({
        messages,
        tools: input.tools,
        mcpServerKeys: input.mcpServerKeys,
        requestId: input.requestId,
      });
      return response;
    } catch (error) {}
  })
})
```

`src/main/llmProvider/index.ts`

```ts
export class LLM {
  async askTool({
    messages,
    tools,
    requestId,
    toolChoice,
  }) {
    const allTools = [...tools];
    return await this.provider.askTool({
      messages,
      tools: allTools,
      requestId,
      toolChoice: toolChoice || 'auto',
    });
  }
}
```

`src/main/llmProvider/providers/OpenAIProvider.ts`：

```ts
export class OpenAIProvider extends BaseProvider {
  /**
   * Convert Message objects to OpenAI API format
   */
  protected formatMessages(
    messages: Message[],
  ): OpenAI.Chat.ChatCompletionMessageParam[] {
    return messages.map((item) => ({
      role: item.role as any,
      content: item.content,
      ...(item.tool_call_id && { tool_call_id: item.tool_call_id }),
      ...(item.tool_calls && {
        tool_calls:
          item.tool_calls as OpenAI.Chat.ChatCompletionMessageToolCall[],
      }),
      ...(item.name && { name: item.name }),
    }));
  }
  /**
   * Send a message to the LLM with tools and get a response with potential tool calls
   */
  async askTool({
    messages,
    tools,
    requestId,
    toolChoice = 'auto',
  }: {
    messages: Message[];
    tools: ChatCompletionTool[];
    requestId: string;
    toolChoice?: ToolChoice;
  }): Promise<LLMResponse> {
    try {
      const formattedMessages = this.formatMessages(messages);
      this.activeRequests.set(requestId, controller);

      const response = await this.client.chat.completions.create(
        {
          model: this.model,
          messages: formattedMessages,
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          tools,
          tool_choice: toolChoice,
          top_p: this.config.topP,
          frequency_penalty: this.config.frequencyPenalty,
          presence_penalty: this.config.presencePenalty,
        },
        {
          signal: controller.signal,
        },
      );
      const content = response.choices[0].message.content;
      const toolCalls = this.processToolCalls(response);
      return { content, tool_calls: toolCalls };
    } catch (error: unknown) {}
  }
}
```


#### Executor

```ts
export class Executor {
  private systemPrompt = `You are a tool use expert. You should call the appropriate tools according to the aware status and environment information.You should not output any response text and only return the JSON.

<overall_principal>
- Must respond with a tool use (function calling); plain text responses are forbidden
- Do not mention any specific tool names to users in messages
- Carefully verify available tools; do not fabricate non-existent tools
- Follow the instructions carefully in the aware status.
- Don't repeat the same mean with aware status, you should select the appropriate tool.
- Don't ask user anything, just tell user what you will do next.If some points is not very clear, you should tell user your solution.Don't ask user anything, remember, you are a agent for user.
- You should only respond chat message after you have finished some tools and return the summary in chat message.
- You should not output any response text and only return the tool call.
- Don't output any file path in current machine and ensure the security in your message. Don't output any absolute path in your message.
</overall_principal>

<chat_message_tool>
message as summary in current step.Don't return message first when the step just started.

Notice, you should not output a lot of words in chat message, because the chat message is always summary words. If you want to write something in detail, please use \`write_file\` to write in by markdown file by default.

In chat message tool, you should add the files that has been created in the past steps, and put the complete file path in the \`attachments\` param.
<chat_message_tool>

<file_system_tool>
If you meet the file system permission denied, you should check if the dir or file exists and create it if not.

Before you interact with filesystem, you must list the allowed dirs and files and check if the dir or file exists and create it if not.Don't write file directly. You should write the file into a safe directory.

</file_system_tool>

<web_search_tool>
After \`web_search\` called, then you must select web page from the search result, then you see the detail of the page, please call browser tool to do it.
</web_search_tool>

<browser_tools>
use \`browser_navigate\` to enter the page detail.
use \`browser_scroll\` to scroll the page.When you use browser to enter the page detail, if the page content is partially visible, you should call browser tool to scroll to get more content, until the page content is fully visible.
use \`browser_click\` to click the element.
use \`browser_form_input_fill\` to fill the form.
use \`browser_select\` to select the element.
use \`browser_hover\` to hover the element.
use \`browser_evaluate\` to evaluate the element.
use \`browser_get_text\` to get the text of the element.
</browser_tool>

<commands_tool>
When you use commands, you must cd the allowed dir instead of cwd.
</commands_tool>

<language>
You should use the same language as the user input by default.
</language>`;
}
```

构建出的 executor 结构，我们主要关注

#### EventManager

`EventManager` 类主要是负责和 chat-ui 交互的，由于 chat-ui 没有开源，这块是黑盒的。后续开源之后详细讲解。

```ts
export class EventManager {
  /**
   * Get all events
   */
  public getAllEvents() {
    return [...this.events];
  }

  /**
   * Notify subscribers about event updates
   */
  private notifyUpdate() {
    if (this.onEventsUpdate) {
      this.onEventsUpdate(this.getAllEvents());
    }
  }

  /**
   * Add a generic event
   */
  private async addEvent(
    type,
    content,
    willNotifyUpdate = true,
  ) {
    const event = {
      id: nanoid(),
      type,
      content,
      timestamp: Date.now(),
    };

    this.events.push(event);
    willNotifyUpdate && (await this.notifyUpdate());
    return event;
  }

  /**
   * Add an observation event
   */
  public async addObservation(content) {
    return this.addEvent(EventType.Observation, content);
  }


  /**
   * Handle tool execution result and add related events
   */
  public async handleToolExecution({
    toolName,
    toolCallId,
    params,
    result,
    isError,
  }) {
    const normalizedInfo = normalizeToolUsedInfo(
      toolName,
      params,
      isError ? ActionStatus.Failed : ActionStatus.Success,
      result,
    );

    await this.addEvent(EventType.ToolUsed, {
      actionId: toolCallId,
      ...normalizedInfo,
    });

    await this.addObservation(JSON.stringify(result));
  }
}
```

`src/renderer/src/type/event.ts`：

```ts
export enum EventType {
  UserMessage = 'user-message',
  LoadingStatus = 'loading-status',
  ToolUsed = 'tool-used',
  ToolCallStart = 'tool-call-start',
  PlanUpdate = 'plan-update',
  AgentStatus = 'agent-status',
  ChatText = 'chat-text',
  Observation = 'observation',
  NewPlanStep = 'new-plan-step',
  UserInterruption = 'user-interruption',
  End = 'end',
}
```


### api

#### ipcClient

```ts
import { createClient } from '@ui-tars/electron-ipc/renderer';

export const ipcClient = createClient({
  ipcInvoke: window.electron.ipcRenderer.invoke,
});
```

createClient 代码如下：

```ts
import { IpcRenderer } from 'electron';

export const createClient = ({ ipcInvoke }) => {
  return new Proxy({}, {
    get: (_, prop) => {
      const invoke = (input) => {
        return ipcInvoke(prop.toString(), input);
      };

      return invoke;
    },
  });
};
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

### ipcRoutes

```ts
import { initIpc, createServer } from '@ui-tars/electron-ipc/main';

export const ipcRoutes = t.router({
  ...agentRoute,
  ...llmRoute,
  // 这里定义了 actionRoute
  ...actionRoute,
  ...browserRoute,
  ...fileSystemRoute,
  ...searchRoute,
  ...settingsRoute,
  ...mcpRoute,
});
export const server = createServer(ipcRoutes);
```

#### actionRoute

```ts
import { MCPServerName } from '@agent-infra/shared';
import { initIpc } from '@ui-tars/electron-ipc/main';

const t = initIpc.create();

export const actionRoute = t.router({
  listTools: t.procedure.handle(async () => {}),

  listMcpTools: t.procedure.handle(async () => {}),

  listCustomTools: t.procedure.handle(async () => {}),

  executeTool: t.procedure.input().handle(async () => {}),

  saveBrowserSnapshot: t.procedure.input().handle(async () => {
    // 通过 mcpClient 调用浏览器截图工具
    const result = await mcpClient,callTool({
      client: MCPServerName.Browser,
      name: 'browser_screenshot',
      args: {
        highlight: true
      }
    })
    const screenshotMeta = (
      result.content as [
        { type: 'text'; text: string },
        { type: 'image'; data: string; mimeType: string },
      ]
    )[1];

    const omegaDir = await getOmegaDir();
    const screenshotPath = path.join(omegaDir, 'screenshots');
    await fs.mkdirSync(screenshotPath, { recursive: true });
    const ext = screenshotMeta.mimeType.split('/')[1] || 'png';
    const timestamp = new Date().getTime();
    const filename = `screenshot_${timestamp}.${ext}`;
    const filepath = path.join(screenshotPath, filename);
    const imageBuffer = Buffer.from(screenshotMeta.data, 'base64');
    await fs.writeFile(filepath, imageBuffer);
    return { filepath };
  }),

  saveReportHtml: t.procedure.input().handle(async ({ input }) => {}),

  cleanup: t.procedure.handle(async () => {})
})
```

### mcp client

```ts
import { MCPServerName } from '@agent-infra/shared';

// 获取OmegaDir
export const getOmegaDir = async () => {
  // Create working directory in user's home directory.
  const omegaDir = path.join(os.homedir(), '.omega');
  if (!fs.existsSync(omegaDir)) {
    await fs.mkdir(omegaDir, { recursive: true });
  }
  return omegaDir;
};

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

## `@agent-infra/shared`

TODO

## `@agent-infra/mcp-client`

基于 `@modelcontextprotocol/sdk/client/index.js` 和 `@modelcontextprotocol/sdk/client/sse.js` 实现的 MCP 客户端。负责管理 MCP 服务器和工具调用。

## `@agent-infra/mcp-server-browser`

> 模块位于 `packages/agent-infra/mcp-servers/browser`

### server.ts

```ts
import {
  getBuildDomTreeScript,
  parseNode,
  type RawDomTreeNode,
  DOMElementNode,
  createSelectorMap,
  removeHighlights,
  waitForPageAndFramesLoad,
  locateElement,
  scrollIntoViewIfNeeded,
} from '@agent-infra/browser-use';

let globalBrowser: LocalBrowser['browser'] | undefined;
let globalPage: Page | undefined;
let selectorMap: Map<number, DOMElementNode> | undefined;

const screenshots = new Map<string, string>();
export const getScreenshots = () => screenshots;

async function buildDomTree(page: Page) {
  try {
    const rawDomTree = await page.evaluate(() => {
      // Access buildDomTree from the window context of the target page
      return window.buildDomTree({
        doHighlightElements: true,
        focusHighlightIndex: -1,
        viewportExpansion: 0,
      });
    });
    if (rawDomTree !== null) {
      const elementTree = parseNode(rawDomTree as RawDomTreeNode);
      if (elementTree !== null && elementTree instanceof DOMElementNode) {
        const clickableElements = elementTree.clickableElementsToString();
        selectorMap = createSelectorMap(elementTree);

        return {
          clickableElements,
          elementTree,
          selectorMap,
        };
      }
    }
    return null;
  } catch (error) {
    logger.error('Error building DOM tree:', error);
    return null;
  }
}

const handleToolCall: Client['callTool'] = async ({
  name,
  arguments: toolArgs,
}) => {
  const initialBrowser = await setInitialBrowser();
  const { browser } = initialBrowser;
  let { page } = initialBrowser;

  if (!page) {
    return {
      content: [{ type: 'text', text: 'Page not found' }],
      isError: true,
    };
  }

  const handlers = {
    //  浏览器后退
    browser_go_back: async () => {
      await Promise.all([waitForPageAndFramesLoad(page), page.goBack()]);
    },
    //  浏览器前进
    browser_go_forward: async () => {
      await Promise.all([waitForPageAndFramesLoad(page), page.goForward()]);
    },
    browser_navigate: async () => {
      await Promise.all([
          waitForPageAndFramesLoad(page),
          page.goto(args.url),
        ]);
      // 获取可点击元素
      const { clickableElements } = (await buildDomTree(page)) || {};
      return {
          content: [
            {
              type: 'text',
              text: `Navigated to ${args.url}\nclickable elements: ${clickableElements}`,
            },
          ],
          isError: false,
        };
    },
    browser_screenshot: async (args) => {
      if (args.highlight) {
        await buildDomTree(page);
      } else {
        await removeHighlights(page);
      }
      const width = args.width ?? page.viewport()?.width ?? 800;
      const height = args.height ?? page.viewport()?.height ?? 600;
      await page.setViewport({ width, height });
      const screenshot = await (args.selector
        ? (await page.$(args.selector))?.screenshot({ encoding: 'base64' })
        : page.screenshot({ encoding: 'base64', fullPage: false }));
      screenshots.set(args.name, screenshot as string);
    },
    browser_get_clickable_elements: async () => {
      const { clickableElements } = (await buildDomTree(page)) || {};
      return {
        content: [
          {
            type: 'text',
            text: clickableElements,
          },
        ],
        isError: false,
      };
    },
    browser_click: async() => {
      const elementNode = selectorMap?.get(Number(args?.index));
      const element = await locateElement(page, elementNode!);
      await scrollIntoViewIfNeeded(element);

      await Promise.race([
        element.click(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Click timeout')), 5000),
        ),
      ]);
      return {
        content: [
          {
            type: 'text',
            text: `Clicked element: ${args.index}`,
          },
        ],
        isError: false,
      };
    }
  }

  if (handlers[name]) {
    return handlers[name](toolArgs);
  }
}

export const client: Pick<Client, 'callTool' | 'listTools' | 'close' | 'ping'> =
  {
    callTool: handleToolCall,
  };

```

## 参考

- [基于 MCP 的 AI Agent 应用开发实践](https://www.rustc.cloud/mcp)
