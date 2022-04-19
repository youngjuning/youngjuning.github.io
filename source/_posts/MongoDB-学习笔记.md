---
title: MongoDB 学习笔记
date: 2022-04-12 16:55:53
cover: https://s2.loli.net/2022/04/14/Qu5yAM93EDnImKP.png
categories:
  - 全栈开发
tags:
  - MongoDB
---

# MongoDB 介绍

> 一个面向文档对象的数据库。

MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。

MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。

# 管理 MongoDB

## 安装 MongoDB

首先确保你的包是最新的：

```shell
sudo apt update && sudo apt upgrade -y
```

然后安装 MongoDB：

```shell
sudo apt install mongodb
```

检查 mongodb 服务的状态：

```shell
sudo systemctl status mongodb
```

![](https://s2.loli.net/2022/04/13/YX7SqhNajgwHuZv.png)

可以看到，服务正常启动了。

## 管理 MongoDB

### 服务状态管理

MongoDB 目前是一个 `systemd` 服务，因此我们使用 `systemctl` 来检查和修改它的状态，使用以下命令：

- 查看运行状态：`sudo systemctl status mongodb`
- 停止服务状态：`sudo systemctl stop mongodb`
- 启动服务状态：`sudo systemctl start mongodb`
- 重启服务状态：`sudo systemctl restart mongodb`
- 启用开机自启动：`sudo systemctl enable mongodb`
- 禁用开机自启动：`sudo systemctl disable mongodb`

### 配置管理

- 查看配置文件：`sudo nano /etc/mongodb.conf`

### 日志管理

- 查看日志：`sudo journalctl -u mongodb`
- 查看错误日志：`sudo journalctl -u mongodb --no-pager -n 100 -f | grep -i error`
- 查看警告日志：`sudo journalctl -u mongodb --no-pager -n 100 -f | grep -i warning`
- 查看提示日志：`sudo journalctl -u mongodb --no-pager -n 100 -f | grep -i notice`

### 卸载 MongoDB

```shell
$ sudo systemctl stop mongodb
$ sudo apt purge mongodb
$ sudo apt autoremove
```

## 远程管理 MongoDB

默认无法远程访问 MongoDB，我们需要先在服务器安全组中开放 `27017` 端口，然后再进行配置：

```shell
$ sudo /etc/mongodb.conf
```

修改  `bind_ip = 0.0.0.0` 为 `bind_ip = 0.0.0.0`，然后重启服务：

```shell
$ sudo systemctl restart mongodb
```

安装 [Studio 3T for Free](https://studio3t.com/free)，然后连接：

![](https://s2.loli.net/2022/04/13/tUBEgnVpSAc715F.png)

## 安全管理

默认我们不需要认证即可连接 MongoDB，这是很危险的，我们需要设置一个管理员用户来认证：

```shell
mongo
> use admin
> db.createUser({user:"admin", pwd:"123456", roles:[{role:"userAdminAnyDatabase", db:"admin"}]})
```

然后配置 MongoDB 的安全策略：

```shell
$ sudo nano /etc/mongodb.conf
```

将 `security.authorization = enabled` 写入文件，然后重启服务：

```shell
sudo systemctl restart mongodb
```

在 Studio 3T 中配置用户名密码即可，需要注意的是 Authentication DB 需要填写对应的。

![](https://s2.loli.net/2022/04/13/fLhd9t1sZ8KTaRA.png)

更多安全知识参考 [MongoDB数据库未授权访问漏洞防御最佳实践](https://help.aliyun.com/document_detail/112035.html)

# MongoDB 概念

- database：数据库，是 MongoDB 的核心，用来存储数据，每个数据库都有自己的集合，集合中存储的是数据。
- collection：集合，相当于关系型数据库中的表（table）
- document：文档，相当于关系型数据库中的行（row）
- field：字段，相当于关系型数据库中的列（column）
- index：索引，相当于关系型数据库中的索引
- primary key：主键，相当于关系型数据库中的主键，MongoDB 中主键的名称默认为 `_id`

## 数据库

一个 mongodb 中可以建立多个数据库。 MongoDB 的默认数据库为 `db`，该数据库存储在 data 目录中。

MongoDB 的单个实例可以容纳多个独立的数据库，每一个都有自己的集合和权限，不同的数据库也防止在不同的文件中。

`show dbs` 命令可以显示所有数据的列表。

```shell
$ mongo
MongoDB shell version v3.6.3
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.6.3
> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
```

运行 `use` 命令可以切换数据库，如果不存在则会自动创建。

```shell
> use test
switched to db test
```

执行 `db` 命令可以显示当前数据库对象或集合。

```shell
> db
test
```

### 数据库命名规范

- 不能是空字符
- 不能含有 `' '`（空格）、`.`、`/`、`\` 和 `\0`（空字符）
- 应全部小写
- 最多 64 字节

### 默认数据库

- admin：从权限的角度来看，这是 root 数据库。要是将一个用户添加到这个数据库，这个用户自动继承所有数据库的权限。一些特定的服务器端命令也只能从这个数据库运行，比如列出所有的数据库或者关闭服务器。
- local：这个数据永远不会被复制，可以用来存储限于本地单台服务器的任意集合。
- config：当 Mongo 用于分片设置时，config 数据库在内部使用，用于保存分片的相关信息。

# 连接 MongoDB

标准 URI 连接语法：

```shell
mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
```

- `mongodb://`：这是固定的格式，必须指定
- `username:password@`：可选项，如果设置，在连接数据库服务器之后，驱动都会尝试登录这个数据库
- `host1`：必须的，指定至少一个 host，host1 是这个 URI 唯一要填写的。它指定了要连接服务器的地址。如果要连接复制集，请指定多个主机地址。
- `portX`：可选的指定端口，如果不填，默认为 27017
- `/database`：如果指定 `username:password@`，连接并验证登录指定数据库。若不指定，默认打开 test 数据库。
- `?options`：是连接选项。如果不使用 `/database`，则前面需要加上 `/`。所有连接选项都是键值对 `name=value`，键值对之间通过 `&` 或 `;` 隔开

## nodejs

### 安装驱动

```shell
$ yarn add mongodb
```

### 连接数据库

要在 MongoDB 中创建一个数据库，首先我们需要创建一个 MongoClient 对象，然后配置好指定的 URL 和端口号。

如果数据库不存在，MongoDB 将创建数据库并建立连接。

```js
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/luozhu";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("数据库已创建！");
  db.close();
});
```

### 创建集合

我们可以使用 `createCollection()` 方法来创建一个集合，这个集合可以是空的，也可以包含数据。

```js
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/luozhu";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("luozhu");
  dbo.createCollection("site", function(err, res) {
    if (err) throw err;
    console.log("集合已创建！");
    db.close();
  });
});
```

### 插入数据

以下实例我们连接数据库 luozhu 的 site 表，并插入一条数据。使用 `insertOne()` 。

```js
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/luozhu";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("luozhu");
  var myobj = { name: "Google", address: "https://google.com" };

  dbo.collection("site").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("文档插入成功");
    db.close();
  });
})
```

如果要插入多条数据，可以使用 `insertMany()` 。

```js
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) console.log(err);
  var dbo = db.db("luozhu");
  var myobj = [
    { name: 'Facebook', website: 'https://www.facebook.com/' },
    { name: 'Github', website: 'https://github.com'}
  ]
  dbo.collection("site").insertMany(myobj, function(err, res) {
    if (err) console.log(err);
    console.log("文档插入成功", res.insertedCount);
    db.close();
  })
})
```

### 查询数据

#### 查询所有数据

可以使用 `find()` 来查找数据。`find()` 可以返回符合条件的所有数据。如果未指定条件，`find()` 返回集合中的所有数据。

```js
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if(err) console.log(err);
  var dbo = db.db("luozhu");

  dbo.collection("site").find({}).toArray(function(err, result) { // 返回集合中所有数据
    if(err) console.log(err);
    console.log(result);
    db.close();
  })
});
```

#### 查询指定条件的数据

```js
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if(err) console.log(err);
  var dbo = db.db("luozhu");
  var whereStr = {"name":'Github'};  // 查询条件
  dbo.collection("site").find(whereStr).toArray(function(err, result) {
    if(err) console.log(err);
    console.log(result);
    db.close();
  })
});
```

### 更新文档

#### 更新一条文档

```js
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if(err) console.log(err);
  var dbo = db.db("luozhu");
  var whereStr = { "name": 'Github' };  // 查询条件
  var updateStr = { $set:{ "website": "https://github.com/youngjuning" }};  // 更新内容
  dbo.collection("site").updateOne(whereStr, updateStr, function (err, res) {
    if(err) console.log(err);
    console.log("文档更新成功", res.matchedCount);
    db.close();
  })
})
```

#### 更新多条文档

```js

# 参考链接

- [如何在 Ubuntu 上安装 MongoDB](https://zhuanlan.zhihu.com/p/76349679)
