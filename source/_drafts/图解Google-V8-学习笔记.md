---
title: 图解 Google V8 学习笔记
---

## 核心概念

- JIT: Just In Time，即时编译技术。混合使用编译器和解释器的技术。不常用代码解释执行，常用代码编译执行。
- 惰性编译
- 内联缓存
- 隐藏类（Hide Class）
- 事件循环系统（Event Loop）
- 垃圾回收机制

作用域、词法环境、执行上下文、CPU 架构（intel、ARM、MIPS）、AST、机器语言

## V8 是什么

V8 是一个由 Google 开发的开源 JavaScript 引擎，也被称为虚拟机，模拟实际计算机各种功能来实现代码的编译和执行。目前用在 Chrome 浏览器和 Node.js 中，其核心功能是执行易于人类理解的 JavaScript 代码。

## Mac 安装 V8

### 预备条件

- Install Xcode (Avaliable on the Mac App Store)
- Install Xcode Command Line Tools (Preferences > Downloads)
- Install [depot_tools](https://www.chromium.org/developers/how-tos/install-depot-tools)
  - `cd ~ && git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git`
  - `sudo nano ~/.zshrc`(zsh) or `sudo nano ~/.bash_profile`(bash)
  - Add `export PATH=~/depot_tools:"$PATH"` (it's important that depot_tools comes first here)
  - `source ~/.zshrc`
  - From the directory you want to install V8 into, run `gclient`

### Build V8

- `fetch v8`
- `cd ~/v8`
- `gclient sync`
- `tools/dev/v8gen.py x64.optdebug`
- `ninja -C out.gn/x64.optdebug` (prepare for lots of fan noise)

I'd also recommend adding these to your `.zshrc`:

- `sudo nano ~/.zshrc`
- Add `alias d8=~/v8/out.gn/x64.optdebug/d8`
- Add `alias tick-processor=~/v8/tools/mac-tick-processor`
- Add `export D8_PATH="~/v8/out.gn/x64.optdebug"`
- `source ~/.zshrc`

> 使用 Demo 请参考 [d8-shell-examples](https://gist.github.com/kevincennis/0cd2138c78a07412ef21#d8-shell-examples)

## d8 命令

### 查看解析器生成的 AST

```sh
$ d8 --print-ast <file>
```

### 查看解析器生成的作用域

```sh
$ d8 --print-scopes <file>
```

### 查看解释器生成的字节码

```sh
$ d8 --print-bytecode <file>
```

## V8 执行一段 JavaScript 流程

解释执行:

编译执行:

## 代码执行方式

### 解释执行

需要先将输入的源代码通过解析器编译成中间代码，之后直接使用解释器解释执行中间代码，然后直接输出结果。解释执行的启动速度快，但是执行时的速度慢。

### 编译执行

采用这种方式时，也需要先将源代码转换为中间代码，然后我们的编译器再将中间代码编译成机器代码。通常编译成的机器代码是以二进制文件形式存储的，需要执行这段程序的时候直接执行二进制文件就可以了。还可以使用虚拟机将编译后的机器代码保存在内存中，然后直接执行内存中的二进制代码。编译执行的启动速度慢，但是执行时的速度快。

## JavaScript 虚拟机

- Safari: JavaScriptCore
- Firefox: TraceMonkey
- Chrome: V8
- Edge: Chakra

## 变量提升（Hoisting）

> 详细概念请参考 https://developer.mozilla.org/zh-CN/docs/Glossary/Hoisting

```js
// 函数表达式
sayHello();
var sayHello = function() {
  var a = '极客时间';
  return a;
};

// sayHello() // TypeError: sayHello is not a function
// var sayHello
// sayHello = function () {
//   var a = "极客时间"
//   return a
// }

// 函数声明
sayHello();
function sayHello() {
  var a = '极客时间';
  return a;
}

// function () {
//   var a = "极客时间"
//   return a
// }
// sayHello()
```
