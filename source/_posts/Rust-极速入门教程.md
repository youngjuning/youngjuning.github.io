---
title: Rust 极速入门教程
description: Rust 是一门可以帮助你开发出高效率、高可靠性软件的编程语言。相较于 C/C++，Rust 力图同时提供强大的工程能力及良好的开发体验，在给予开发者控制底层能力（比如内存操作）的同时，避免传统语言带来的诸多麻烦。
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1681900359076.png
date: 2023-04-19 18:32:26
categories:
  - [Rust]
  - [Deno]
tags:
  - Rust
  - Deno
  - WebAssembly
  - Web
  - Node.js
---

## 为什么选择 Rust?

Rust 是一门可以帮助你开发出高效率、高可靠性软件的编程语言。相较于 C/C++，Rust 力图同时提供强大的工程能力及良好的开发体验，在给予开发者控制底层能力（比如内存操作）的同时，避免传统语言带来的诸多麻烦。

### 高性能

Rust 速度惊人且内存利用率极高。由于没有运行时和垃圾回收，它能够胜任对性能要求特别高的服务，可以在嵌入式设备上运行，还能轻松和其他语言集成。

### 可靠性

Rust 丰富的类型系统和所有权模型保证了内存安全和线程安全，让您在编译期就能够消除各种各样的错误。

### 生产力

Rust 拥有出色的文档、友好的编译器和清晰的错误提示信息，还集成了一流的工具——包管理器和构建工具， 能地自动补全和类型检验的多编辑器支持，以及自动格式化代码等等。

## Rust 落地情况

全世界已有数百家公司在生产环境中使用 Rust，以达到快速、跨平台、低资源占用的目的。很多著名且受欢迎的软件，例如 Firefox、 Dropbox 和 Cloudflare 都在使用 Rust。从初创公司到大型企业，从嵌入式设备到可扩展的 Web 服务，Rust 都完全合适。

### Dropbox

Dropbox 核心文件存储系统的多个模块是用 Rust 写的，因为它作为大型项目的一部分，需要追求更高的数据中心效率。目前，它应用于所有的 Dropbox 存储系统，为超过 5 亿用户服务。

### Yelp

Yelp 使用 Rust 开发了一个实时 A/B 测试的框架。它广泛应用于所有的 Yelp 网页和应用，选择 Rust 是因为它和 C 语言一样快（运行代价小），同时比 C 语言更安全（易于维护）。

## Deno 与 Rust

Deno 早期是 Golang + TypeScript 的，后来因为 Golang 和 V8 的 GC 问题，Ryan 下了大工夫把 golang 统统换成没有 GC 的 Rust了。知乎看到的一个[回答](https://www.zhihu.com/question/291707891/answer/481908886)觉得很有道理：

1. Go 自己有 GC，V8 自己也有 GC，双 GC 和复杂的运行时会造成多少性能损失。
2. Rust 具有高性能、内存安全等特性，非常适合写这种对性能要求高的程序。

> GC（Garbage Collector，垃圾回收机制），Rust 和其他没有垃圾回收机制，而是使用一种叫做所有权的机制代替。由于是入门篇，此处不展开。

## 安装 Rust

和其他不太一样的是，Rust 官方提供了 rustup 命令行工具来下载、安装、管理不同的 Rust 发行版本以及其附带的工具链。

> 注意：Rust 的稳定性保证了所有发行版本都是向后兼容的。

**安装 rustup：**

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

输出：

```sh
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
info: downloading installer

Welcome to Rust!

This will download and install the official compiler for the Rust
programming language, and its package manager, Cargo.

Rustup metadata and toolchains will be installed into the Rustup
home directory, located at:

  /Users/luozhu/.rustup

This can be modified with the RUSTUP_HOME environment variable.

The Cargo home directory located at:

  /Users/luozhu/.cargo

This can be modified with the CARGO_HOME environment variable.

The cargo, rustc, rustup and other commands will be added to
Cargo's bin directory, located at:

  /Users/luozhu/.cargo/bin

This path will then be added to your PATH environment variable by
modifying the profile files located at:

  /Users/luozhu/.profile
  /Users/luozhu/.zshenv

You can uninstall at any time with rustup self uninstall and
these changes will be reverted.

Current installation options:


   default host triple: x86_64-apple-darwin
     default toolchain: stable (default)
               profile: default
  modify PATH variable: yes

1) Proceed with installation (default)
2) Customize installation
3) Cancel installation
>1
```

以上信息可以总结为：

1. Rustup 家目录：`~/.rustup`，可以用 `RUSTUP_HOME` 环境变量修改
2. Cargo 家目录：`~/.cargo`，可以用 `CARGO_HOME` 环境变量修改
3. cargo、rustc、rustup 和其他命令都安装在 `~/.cargo/bin`
4. PATH 环境变量是放在 `~/.zshenv` 中的（这个方式第一次见）

这里让我们选择安装方式，由于是入门，我们直接选择默认安装，输入如下：

```sh
info: profile set to 'default'
info: default host triple is x86_64-apple-darwin
info: syncing channel updates for 'stable-x86_64-apple-darwin'
info: latest update on 2021-02-11, rust version 1.50.0 (cb75ad5db 2021-02-10)
info: downloading component 'cargo'
  4.3 MiB /   4.3 MiB (100 %)   3.1 MiB/s in  1s ETA:  0s
info: downloading component 'clippy'
info: downloading component 'rust-docs'
 14.7 MiB /  14.7 MiB (100 %)   2.2 MiB/s in  6s ETA:  0s
info: downloading component 'rust-std'
 23.3 MiB /  23.3 MiB (100 %)   2.2 MiB/s in 11s ETA:  0s
info: downloading component 'rustc'
 61.0 MiB /  61.0 MiB (100 %)   2.3 MiB/s in 26s ETA:  0s
info: downloading component 'rustfmt'
info: installing component 'cargo'
info: using up to 500.0 MiB of RAM to unpack components
info: installing component 'clippy'
info: installing component 'rust-docs'
 14.7 MiB /  14.7 MiB (100 %)   5.8 MiB/s in  1s ETA:  0s
info: installing component 'rust-std'
 23.3 MiB /  23.3 MiB (100 %)  13.0 MiB/s in  3s ETA:  0s
info: installing component 'rustc'
 61.0 MiB /  61.0 MiB (100 %)  13.3 MiB/s in  4s ETA:  0s
info: installing component 'rustfmt'
info: default toolchain set to 'stable-x86_64-apple-darwin'

  stable-x86_64-apple-darwin installed - rustc 1.50.0 (cb75ad5db 2021-02-10)


Rust is installed now. Great!

To get started you need Cargo's bin directory ($HOME/.cargo/bin) in your PATH
environment variable. Next time you log in this will be done
automatically.

To configure your current shell, run:
source $HOME/.cargo/env
```

以上这个过程是安装 rust 及其工具链并自动设置环境的过程，你可以根据提示输入 `source $HOME/.cargo/env` 让配置立即生效，也可以重新打开一个命令行让配置生效。

**验证是否安装成功：**

```sh
rustc --version
```

顺利的话，你会看到 `rustc x.y.z (版本的哈希码 yyyy-mm-dd)` 格式的输出。

**更新：**

```sh
rustup update
```

**卸载：**

```sh
rustup self uninstall
```

## 本地文档

安装工具在执行的过程中会在本地生成一份离线文档，你可以通过命令 `rustup doc` 在浏览器中打开它。但是我觉得一般用不到，我们在 vscode 中安装 Rust 插件有文档提示的功能。

## Hello,World!

### vscode

安装 Rust 插件：

> rust-analyzer 也是一个很好的替代品，不过目前还不完善！

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1719649428934.png)

安装成功后将 `"rust-client.rustupPath": "$HOME/.cargo/bin/rustup"` 添加到 `setting.json` 来修复 [couldn't start client Rust Language Server](https://github.com/rust-lang/vscode-rust/issues/622)

为了能调试软件，再安装插件 CodeLLDB：

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1719649496835.png)

crates 是辅助开发者在使用 `Cargo.toml`时管理依赖的插件：

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1719732946888.png)

由于 Rust 的依赖管理工具 Cargo 使用 TOML 作为配置文件，所以需要下载 `Even Better TOML` 插件支持语法。

最后设置下保存时自动格式化：

```json
// settings.json
{
  "[rust]": {
    "editor.formatOnSave": true
  }
}
```

### 第一行代码

> 注意：Rust 文件总是以 `rs` 结尾。如果在名字中使用了多个单词，那么你可以使用下划线来隔开它们。比如你最好使用 `hello_world.rs` 作为文件名而不是 helloworld.rs

新建一个 `main.rs` 并写入以下代码：

```rs
fn main() {
  println!("Hello,World!");
}
```

- 使用关键字 `fn` 定义了一个函数。（Go（`func`）、JS（`function`）、数学（`f`）），看起来 Rust 很省布料。
- main 函数比较特殊：当你运行一个可执行 Rust 程序的时候，所有的代码都会从这个入口函数开始运行（Go 也是一样）
- 按照惯例，Rust 推荐把左花括号与函数声明置于同一行并以空格分隔。
- 我们调用了一个被叫作 `println!` 的宏：假如我们调用的是一个普通函数，那么这里会以去掉 `!` 符号的 `println` 来进行标记。
- 大部分 Rust 代码都会以分号来结尾。

> 所谓宏（Macro），是一种批量处理的称谓。计算机科学里的宏是一种抽象(Abstraction)，它根据一系列预定义的规则替换一定的文本模式。解释器或编译器在遇到宏时会自动进行这一模式替换。—— 可以简单理解为全局定义的函数、变量等

然后在命令行输入 `rustc main.rs` 编译代码，编译成功后会生成可执行文件 `main`:

```sh
.
├── main
└── main.rs
```

执行 `./main` 便会输出 `Hello,World!`

> windows 下会生成 `main.exe`

> 和 Ruby、Python 或 JavaScript 之类的动态语言不同，Rust、Go、Deno 都属于编译语言（JIT技术不在讨论范围），这意味这当你编译完 Rust 程序之后，便可以将可执行文件交付于其他人，并运行在没有安装 Rust 的环境中。如果你使用 Node 开发的应用交付给别人，别人必须要拥有 Node 开发环境。

## Hello,Cargo!

和 Go 一样（go build），使用系统的编译工具（rustc）编译简单的程序足够了，但是它们无法满足规模大、协同开发人员多的项目。Go 有 gox、goxc、xgo，Rust 有 Cargo 来帮助我们管理简化项目依赖、代码构建这样的事情。

Cargo 是 Rust 工具链中内置的构建系统及包管理器。由于它可以处理众多诸如构建代码、下载编译依赖库等琐碎但重要的任务，绝大多数 Rust 用会选择它来管理自己的 Rust 项目（比如 Deno）。

前面我们的 helloworld 示例在 vscode 中，Rust 插件会报以下错误，可见 Cargo 是 Rust 的标配：

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1719733630580.png)

## 使用 Cargo 创建项目

使用 `cargo new hello_cargo` 新建项目：

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1719733650171.png)

Cargo 为我们生成了两个文件与一个目录：一个名为 `Cargo.toml` 的文件，以及一个名为 `main.rs` 的源代码文件
，该源代码被放置在 src 目录下。于此同时，Cargo 还会初始化一个新的 Git 仓库并升成默认的 `.gitignore` 文件。

### Cargo.toml

```toml
[package]
name = "hello_cargo"
version = "0.1.0"
authors = ["youngjuning <youngjuning@163.com>"]
edition = "2018"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
```

- `[package]`：是一个区域标签，它表明接下来的语句会被用于配置当前的程序包。`author` 这里的邮箱和名字是从 `~/.gitconfig` 中读取的
- `[dependencies]`：同样是一个区域标签，它表明随后的区域会被用来声明项目的依赖。

> TOML 是一种旨在成为一个小规模、易于使用的语义化的配置文件格式，“TOML”这个名字是“Tom's Obvious, Minimal Language（汤姆的浅显的、极简的语言）”的首字母略写词。“Tom”指它的作者 Tom Preston-Werner。

按照惯例，Cargo 会默认把所有的源代码文件保存到 `src` 目录下，而项目根目录只被用来存放诸如 `README` 文档、许可声明、配置文件等与源代码无关的文件。使用 Cargo 可以帮助你合理并一致地组织自己的项目文件，从而使一切井井有条。

### 使用 Cargo 构建和运行项目

```sh
cargo build
```

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1719733752129.png)

与之前不同，这个命令会将可执行程序生成在路径 `target/debug/hello_cargo` 下：

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1719734023741.png)

首次使用命令 cargo build 构建的时候，会生成 `Cargo.lock`（类似于 yarn.lock），不要手动修改该文件，默认 `.gitignore` 中只忽略了 `target` 目录，我们从 `https://github.com/github/gitignore/blob/master/Rust.gitignore` 中复制最佳实践过来。

使用 `cargo run` 命令可以简单地以此完成编译和运行工作：

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1719734443602.png)

> 我们还可以使用 `cargo check` 快速检查项目是否可以通过编译

### 以 Release 模式构建

``` sh
cargo build --release
```

生成的可执行文件会被放置在 `target/release` 目录下，而不是之前的 `target/debug` 目录下。

假如你想要对代码的运行效率进行基准测试，请通过 `cargo run --release` 命令进行构建，并使用 `target/release` 目录下的可执行程序完成基准测试。

### crate

在 Rust 中，我们把代码的集合称作包（crate）。crate 是 Rust 中最小的编译单元，package 是单个或多个 crate 的集合，crate 和 package 都可以被叫作包，因为单个 crate 也是一个 package，但 package 通常倾向于多个 crate 的组合。[crates.io](https://crates.io/) 是 Rust 社区的 crate 代理。
