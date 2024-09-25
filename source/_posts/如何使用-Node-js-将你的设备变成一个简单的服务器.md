---
title: 如何使用 Node.js 将你的设备变成一个简单的服务器
description: '本文是一篇关于在设备上使用 Node.js 创建简单服务器的教程。作者首先详细介绍了创建服务器的具体步骤，包括创建目录、初始化项目、安装依赖、创建配置文件和服务器脚本等。接着展示了最终的目录结构，并对服务器脚本进行了详细分析，解释了每个安装的依赖的用途。此外，还介绍了测试服务器的多种方式，如实时通信、文件上传、访问 RESTful API、触发错误处理以及连接数据库等。最后强调了通过创建这个简单服务器来学习后端开发基础和了解服务器工作原理的价值。'
date: 2024-09-25 18:27:35
categories:
  - [紫升翻译计划]
  - [前端, NodeJs]
tags:
  - Node.js
  - 服务器创建
  - express
  - ws
  - multer
  - 后端开发基础
  - 服务器工作原理
---

> 原文地址：[How to Turn Your Device Into a Simple Server Using Node.js](https://dev.to/trixsec/how-to-turn-your-device-into-a-simple-server-using-nodejs-1460)
> 原文作者：[Trix Cyrus](https://dev.to/trixsec)

让我们一起在你的设备上部署一个简单的 Node.js。

## 入门

首先，让我们使用 Node.js 创建一个基础的服务。步骤如下：

创建一个 `node-server` 目录：

```sh
mkdir node-server
cd node-server
```

初始化一个 Node.js 项目：

```sh
npm init -y
```

安装依赖：

```sh
npm install express ws multer mongoose dotenv helmet morgan cluster compression
```

- express：处理 HTTP 请求
- ws：支持 Websocket
- multer：处理文件上传
- mongoose：MongoDB 链接
- dotenv：读取环境变量
- helmet：保护服务器安全
- morgan：日志
- cluster：多线程
- compression：用于压缩响应数据

## 创建一个 .env 文件

在项目根目录，创建一个 `.env` 文件，它的作用是用来存储环境变量：

```
PORT=8080
MONGO_URI=mongodb://localhost:27017/serverdb
```

创建一个 `server.js` 文件：

```sh
touch server.js
nano server.js
```

粘贴下面的代码：

```js
require('dotenv').config();
const express = require('express');
const ws = require('ws');
const http = require('http');
const multer = require('multer');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const cluster = require('cluster');
const os = require('os');
const compression = require('compression');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;
const NUM_CPUS = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master process is running. Spawning ${NUM_CPUS} workers...`);
  for (let i = 0; i < NUM_CPUS; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Spawning a new worker.`);
    cluster.fork();
  });
} else {
  const app = express();
  const server = http.createServer(app);
  const wss = new ws.Server({ server });

  mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

  app.use(express.json());
  app.use(helmet());
  app.use(morgan('common'));
  app.use(compression());

  const upload = multer({ dest: 'uploads/' });

  app.use(express.static(path.join(__dirname, 'public')));

  app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
  });

  wss.on('connection', (socket) => {
    console.log('WebSocket connection established.');
    socket.on('message', (message) => {
      console.log(`Received WebSocket message: ${message}`);
      socket.send(`Message received: ${message}`);
    });
  });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.get('/api/data', async (req, res) => {
    res.json({ message: 'Server API Response', data: [] });
  });

  app.post('/upload', upload.single('file'), (req, res) => {
    console.log('File uploaded:', req.file);
    res.status(201).json({ message: 'File uploaded successfully', file: req.file });
  });

  app.get('/greet/:name', (req, res) => {
    const name = req.params.name || 'stranger';
    res.send(`<h1>Hello, ${name}!</h1>`);
  });

  app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  });

  app.use((err, req, res, next) => {
    console.error('Error encountered:', err);
    res.status(500).json({ error: 'An internal server error occurred' });
  });

  server.listen(PORT, () => {
    console.log(`Worker process ${process.pid} is running on port ${PORT}`);
  });
}
```

创建一个 `public` 文件夹：

```sh
mkdir public
cd public
```

## index.html

用作的首页的基本的 HTML 文件：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Node.js Server</title>
</head>
<body>
    <h1>Welcome to the node.js Server!</h1>
    <p>This server is a simple server.</p>
</body>
</html>
```

### 404.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found</title>
</head>
<body>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for doesn't exist in this universe.</p>
</body>
</html>
```

## 启动服务器

```sh
node server.js
```

## 测试服务器功能

- 实时通信：您可以设置一个 WebSocket 客户端向服务器发送消息。
- 文件上传：向“http://localhost:8080/upload”发送 POST 请求并附上一个文件，它将被保存到上传文件夹中。
- RESTful API：访问“http://localhost:8080/api/data”以查看 API 响应。
- 错误处理：访问任何不存在的 URL（例如“http://localhost:8080/nonexistent”）以查看自定义的 404 页面。
- 数据库：将您的服务器连接到一个 MongoDB 实例，并修改/api/data 路由以查询并返回实际数据。

最终目录：

```
node-server/
├── public/
│   ├── index.html
│   ├── 404.html
├── server.js
```

## 一切就绪

你已经在你的设备创建并运行一个简单的 Node.js 服务器！这是学习后端开发基础知识以及了解服务器如何工作的好方法。
