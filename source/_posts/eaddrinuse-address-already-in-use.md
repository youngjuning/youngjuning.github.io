---
title: '「已解决」EADDRINUSE: address already in use'
date: 2023-03-10T10:25:43+08:00
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678415328290.png
categories:
  - [洛竹翻译计划]
  - [issues]
  - [前端, NodeJs]
tags:
  - Node
  - EADDRINUSE
  - address already in use
  - 进程
---

# 问题

当你尝试重启一个 Node 应用时，上一个应用没有正确关闭，你可能会看到一个“listen EADDRINUSE: address already in use”错误，例如：

```sh
⇒  npm start
> react-app-es6-jest@0.0.1 start /Users/admin/Code/WorkSpace/react-app-es6-jest
> concurrently "npm run start:server" "npm run start:client"

[0]
[0] > react-app-es6-jest@0.0.1 start:server /Users/admin/Code/WorkSpace/react-app-es6-jest
[0] > nodemon src/server/index.js --watch src/server -e js --exec babel-node
[0]
[0] [nodemon] 2.0.1
[0] [nodemon] to restart at any time, enter `rs`
[0] [nodemon] watching dir(s): src/server/**/*
[0] [nodemon] watching extensions: js
[0] [nodemon] starting `babel-node src/server/index.js`
[0] events.js:174
[0]       throw er; // Unhandled 'error' event
[0]       ^
[0]
[0] Error: listen EADDRINUSE: address already in use :::3000
[0]     at Server.setupListenHandle [as _listen2] (net.js:1279:14)
[0]     at listenInCluster (net.js:1327:12)
[0]     at Server.listen (net.js:1414:7)
[0]     at Function.listen (/Users/admin/Code/WorkSpace/react-app-es6-jest/node_modules/express/lib/application.js:618:24)
[0] [nodemon] app crashed - waiting for file changes before starting...
```

# 问题背后的原因

`process.on('exit', ...)` 不会在进程崩溃或被杀死时调用。它只在事件循环结束时调用，因为 `server.close()` 会结束事件循环（它仍然必须等待当前运行的堆栈），所以将其放在 exit 事件中是没有意义的。

> 译者注：有时候直接关闭 vscode 会导致进程没有正确关闭，这时候也可能会出现这个问题。

# 解决方案

该应用程序的正确修复是

- 在 `server.listen()` 之前检查端口是否已经被占用
- 在崩溃时，可以使用 `process.on('uncaughtException', ..)` 进行处理。
- 在 kill 操作上，可以使用 `process.on('SIGTERM', ..)` 进行处理。

当出现 EADDRINUSE 问题时，为了解决它，您需要手动终止该进程。为此，您需要找到进程的进程 ID（PID）。您知道该进程占用了机器或服务器上的特定端口。

## 手动杀死进程

### Mac/Linux

找到与该端口关联的进程ID（PID）

```sh
$ lsof -i tcp:3000
COMMAND PID   USER  FD  TYPE DEVICE             SIZE/OFF NODE NAME
node    44475 chen5 31u IPv4 0x8b1721168764e4bf 0t0 TCP *:strexec-s (LISTEN)
```

这将返回使用该端口的任何进程的详细信息，包括PID。然后可以使用以下命令杀死该进程：

```sh
$ kill -9 44475
```

请注意，`-9` 选项强制终止进程而不考虑其当前状态，并立即使其退出。当需要强制关闭一个已经挂起或占据端口的进程时，通常需要使用此选项。

如果你遇到权限问题，请尝试在命令前加上sudo。例如：

```sh
sudo kill -9 44475
```

### Windows

#### 解决方案 1：任务管理器

打开“任务管理器”应用程序 (taskman.exe)，从进程或服务选项卡根据 PID 列进行排序。要显示 PID 列，请右键单击标头行并从列表中选择 PID。右键单击要停止的进程，然后选择“结束任务”

![example in Windows, source from Internet](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678416348850.png)

#### 解决方案 2：命令行

以管理员身份打开CMD（命令提示符）窗口，通过导航到 `开始 > 运行 > 输入cmd > 右键单击“命令提示符”`，然后选择“以管理员身份运行”打开 。

![source from Google Search](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678416450947.png)

可以使用命令提示符来查找与特定端口相关的进程ID。在管理员模式下打开CMD窗口，然后使用" netstat "命令来获取所有处于活动状态的端口以及占用者的进程ID。以下是要使用的完整命令:

```sh
$ netstat -ano|findstr "PID :3000"
Proto Local Address Foreign Address State PID
TCP 0.0.0.0:3000 0.0.0.0:0 LISTENING 18264
```

其中 `-a` 选项显示所有正在使用的端口（而不仅仅是与当前用户相关的端口）。`-n` 选项停止主机名查询（这需要很长时间）。`-o` 选项列出负责端口活动的进程 ID。最后，`findstr` 命令匹配包含 PID 字符串的标题行，并查找指定的端口。例如， `PID :3000`。

然后终止此进程（`/f` 是强制）：

```sh
$ taskkill /pid 18264 /f
```

> 原文地址：[How to kill server when seeing “EADDRINUSE: address already in use”](https://114.li/jscdep)
> 原文作者：[BChen](https://bindichen.medium.com/)
> 译文出自：[洛竹翻译计划](https://youngjuning.js.org/categories/%E6%B4%9B%E7%AB%B9%E7%BF%BB%E8%AF%91%E8%AE%A1%E5%88%92/)
