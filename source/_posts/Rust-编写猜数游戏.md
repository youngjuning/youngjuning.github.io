---
title: Rust 编写猜数游戏
description: 本文记录了使用 Rust 实现猜数游戏
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1681899044221.png
date: 2023-04-19 18:10:36
categories:
  - Rust
tags:
  - Rust
  - 紫升的博客
  - 紫升
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

{% note primary modern %}
猜数游戏代码在 [guessing_game](https://github.com/youngjuning/learn-rust/tree/master/guessing_game)
{% endnote %}

为了方便大家学习，需要运行（`cargo run`）看效果的地方，我都截了GIF图。喜欢的话可以给紫升个👍🏻鼓励一下。

## 环境

> - rustc：`1.50.0 (cb75ad5db 2021-02-10)`
>
> - cargo：`1.50.0 (f04e7fab7 2021-02-04)`
> - `rand` crate：`0.8.3`
> - vscode plugins
>   - Better TOML
>   - CodeLLDB
>   - crates
>   - rust-analyzer
> - oh-my-zsh theme：ys
> - 截图软件：[Kap](https://getkap.co/)

## 处理用户输入

猜数游戏第一部分会请求用户进行输入，上代码：

```rust
use std::io;

fn main() {
    println!("Guess the number!");

    println!("Please input your guess.");

    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("Failded to read line");

    println!("You guessed: {}", guess);
}
```

### 声明导入

- `use std::io;` 语句：把标准库（[std](https://github.com/rust-lang/rust/tree/master/library/std/src/io)）中的 `io` 模块引入当前的作用域中。
- Rust 默认会将预导入（prelude）模块内的条目自动引入每一段程序的作用域中，它包含了一小部分相当常用的类型。如果你需要的模块不在预导入模块内，那么我们就必须使用 `use` 语句来显式地进行导入声明。
- `std::id` 库包含了许多有用的功能，我们可以使用它来获得用户的输入数据。

### 使用变量来存储值

- `let mut guess`：创建出一个名为 `guess` 的可变变量，变量默认是不可变的，`mut` 关键字表示可变（mutable）变量，关于变量与可变性的概念在[两个番茄钟的Rust 语法学习笔记](https://juejin.cn/post/6929080722565267469)中有介绍。
- `String::new`：返回一个新的 `String` 实例
  - `::` 语法表明 `new` 是 `String` 类型的一个关联函数（associated function）——其他语言中被称为静态方法（static method）
  - `String`是标准库中的一个字符串类型，它在内部使用了 UTF-8 格式的编码并可以按照需求扩展自己的大小。
- `io::stdin`：返回`std::io::Stdin` 的实例，它被用作句柄来处理终端中的标准输入。
- `.read_line` 方法用来获得用户输入。
  - `read_line` 的参数 `&mut guess` 表示引用一个可变变量。
  - `&` 表示当前的参数是一个引用，这在 Go 中也是存在的。因为这些系统级编程语言大多都提供了操作内存的权限，而 JavaScript 是不给用户这些功能的。

> 句柄：在上世纪80年代的操作系统（如 Mac OS 句柄 和Windows）的内存管理中，句柄被广泛应用。Unix系统的文件描述符基本上也属于句柄。和其它桌面环境一样，Windows API大量使用句柄来标识系统中的对象)，并创建操作系统与用户空间之间的通信渠道。例如，桌面上的一个窗体由一个`HWND`类型的句柄来标识。

### 处理可能失败的情况

我们先来看下 Go 里边的错误处理方式：

```go
func main() {
  result,err := getResult();
  if err != nil {
    panic(err)
  }
  fmt.Printf("The result is %s", result);
}

func getResult() string,(string, err error) {
  // some codes
}
```

一般，一个函数可能报错的话都会在返回 result 的同时返回一个 `error` 。这并不是 Go 专属的，Rust 语言中也是如此，只不过实现方式不一样。

前面代码中，`read_line` 会将用户输入的内容存储到我们传入的字符串中，但与此同时，它还会返回一个 `io::Result` 值。在 Rust 标准库中，你可以找到许多以 `Result` 命名的类型，它们通常是各个子模块中 `Result` 泛型的特定版本，比如这里的`io::Result`。

> `Result` 是一个枚举类型。枚举类型由一系列固定的值组合而成，这些值被称作枚举的变体。（众所周知，Javascript 没有枚举类型）

对于 `Result` 而言，它拥有 `Ok` 和 `Err` 两个变体。其中的 `Ok` 变体表明当前的操作执行成功，并附带代码产生的结果值。相应地，`Err` 变体则表明当前的操作执行失败，并附带引发失败的具体原因。

`expect` 是 `Result` 类型的值的一系列方法中的一个。假如 `io::Result` 实例的值是 `Err`，那么 `expect` 方法就会中断当前的程序，并将传入的字符串参数显示出来。

> `read_line` 方法有可能因为底层操作系统的错误而返回一个 `Err` 结果。
>
> 相应地，假如 `io::Result` 实例的值是 `Ok`，那么 `expect` 就会提取出 `Ok` 中附带的值，并将它作为结果返回给用户。在我们的例子中，这个值就是用户输入内容的字节数。

即便我们没有在语句末尾调用 `expect`，这段程序也能够编译通过，但你会在编译过程中看到如下所示的警告信息。这一点和 Go 也基本一致。

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41b7da00e7764953a833d3aeb65b2142~tplv-k3u1fbpfcp-zoom-1.image" style="zoom:50%;" />

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd34722caa964f5f801a77768de68fea~tplv-k3u1fbpfcp-zoom-1.image" style="zoom:50%;" />

Rust 编译器提醒我们 `read_line` 方法返回的 `Result` 值还没有被处理，这通常以为着我们的程序没有对潜在的错误进行处理。

消除警告最正确的方法当然是编写对应的错误处理代码，为了简单起见，我们在这里选择使用 `expect` 方法，它会让程序在出现错误时直接终止运行并退出。

### 通过 `println!` 中的占位符输出对应的值

`println!("You guessed: {}", guess);` 可以将我们存储的用户输入打印出来。这段宏调用的第一个参数是用于格式化的字符串，而字符串中的那些花括号`{}`则是一个占位符。

> 举一反三：`{}` 作为占位符不是 Rust 特有的，我所知的 Shell 中也有类似的应用，比如 `ls | xargs -I {} tar zcvfm {}.tar.bz {}` 这段脚本的意思就是将 `ls` 输出的值逐个通过管道传入后面的命令，`{}` 便是接收管道传的值的占位符。顺便一提，这段脚本我在 [tuya-panel-demo](https://github.com/youngjuning/tuya-panel-demo/blob/3b66bbaa45560fa247a76adc2ab06f5ca477fcc5/.github/workflows/release.yml#L20) 有使用。这里挖个坑，后续会出一个 Shell 脚本的系列教程。

### 尝试运行代码

现在，让我们借助 `cargo run` 命令来尝试运行一下这段代码：

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74adfa100e0147b083ae72c782928916~tplv-k3u1fbpfcp-zoom-1.image)

## 生成一个保密数字

解决了接收用户输入的数字之后，我们需要生成一个保密数字来供玩家进行猜测。为了保证一定的可玩性，并使每局游戏都有不同的体验，这个生成的保密数字将会是随机的。

### 引入 rand 包

Rust 团队并没有把类似的随机数字生成功能内置到标准库中，而是选择将它作为 rand 包（rand crate）提供给用户。

> 注意：Rust 中包（crate）代表了一系列源代码文件的集合。我们当前构建的项目是一个用于生成可执行程序的二进制包（binary crate），而我们引入`rand`包则是一个用于复用功能的库包（libray crate，代码包）。

要使用第三方 `crate` ，我们需要在 `Cargo.toml` 文件中加入依赖：

```toml
...
[dependencies]

rand = "0.3.14"
```

在 `Cargo.toml` 文件中，从一个标题到下一个标题之间的所有内容都属于同一区域。这里的`[denpendencies]`区域被用来声明项目中需要用到的全部依赖包及其版本号。

> 书中的版本号比较老，vscode crates 插件提示了版本❌
>
> <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d11abe6e85e6441ca5469fe4cf70dcc3~tplv-k3u1fbpfcp-zoom-1.image" style="zoom:50%;" />
>
> 我们点击任意版本即可选择该版本作为我们依赖的版本，点击圆括号内的 docs 便可跳转到库文档。

我们先不修改任何代码，直接重新构建这个项目：

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5fe9b017f6e8431bb31df50335e7cd67~tplv-k3u1fbpfcp-zoom-1.image)

现在，我们的程序有了一个外部依赖，Cargo 可以从注册表（registry）中获取所有可用库的最新版本信息，而这些信息通常是从[cartes.io](https://cartes.io/) 上拷贝过来的。

> cates.io 在 Rust 生态中是人们用于分享各种各样开源 Rust 项目的网站。

现在，如果你没有做出任何改变，立即重新运行 `cargo build`，那么只会有 Finished 提示。Cargo 会自动分析当前已经下载或编译过的内容，并跳过无需重复的步骤。

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/910a4092bb524a788621f193cde3618f~tplv-k3u1fbpfcp-zoom-1.image)

### 生成一个随机数

```diff
+ use rand::Rng;
use std::io;

fn main() {
    println!("Guess the number!");

+   let secret_number = rand::thread_rng().gen_range(1..101);

+   println!("The secret number is: {}", secret_number);

    println!("Please input your guess.");

    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("Failded to read line");

    println!("You guessed: {}", guess);
}
```

- 我们额外增加了一行 `use` 语句：`use rand::Rng`。这里的 Rng 是一个 trait（特征），它定义了随机数生成器需要实现的方法集合。为了使用这些方法，我们需要显式地将它引入当前的作用域中。
- `rand::thread_rng()` 会返回一个特定的随机数生成器。随后我们调用这个生成器的`gen_range`方法。
- `gen_range` 方法是在刚刚引入作用域的 `Rng` trait 中定义的，它接收一个 Range 类型（`1..100`）的值作为参数，并生成一个范围在两者之前的随机数。

> 提醒：书中的 `gen_range` 接收的是两个参数，读到时不要奇怪，版本不一样而已。

>  值得指出的是，`gen_range`生成的随机数空间包含下限但不包含上限。——做人呢，也是这样，要有底线，但不要给自己设上限。

使用第三方包，不可避免要频繁查看文档。你可以去官方文档看，这没什么问题。但是你也可以借助`cargo doc --open` 命令在本地构建一份有关所有依赖的文档，并自动地在浏览器中将文档打来来供你查阅：

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bc83c1f8feb432884ceaef1794af0a0~tplv-k3u1fbpfcp-zoom-1.image)

上面代码中，我们将保密数字打印出来，只是为了调试，之后会删掉这段代码。

## 比较猜测数字与保密数字

现在，我们有了一个随机生成的保密数字，还有一个用户输入的猜测数字。接下来我们将比较这两个数字。

```diff
use rand::Rng;
+ use std::cmp::Ordering;
use std::io;

fn main() {
    println!("Guess the number!");

    let secret_number = rand::thread_rng().gen_range(1..101);

    println!("Please input your guess.");

    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("Failded to read line");

    println!("You guessed: {}", guess);

+   match guess.cmp(&secret_number) {
+       Ordering::Less => println!("Too small!"),
+       Ordering::Greater => println!("Too big!"),
+       Ordering::Equal => println!("You win!"),
+   }
}

```

- 我们从标准库中引入了 `std::cmp::Ordering` 类型。与 Result 相同，Ordering 也是一个枚举类型，它拥有`Less`、`Greater`、`Equal` 这3个变体。（cmp 是 compare 的缩写）
- `match` 表达式由由数个分支（arm）组成，每个分支都包含一个用于匹配的模式（pattern），以及匹配成功后要执行的相应代码。

> Rust 中的`match`结构及模式是一类非常强大的工具，它们提供了依据不同条件执行不同代码的能力（类似其他语言的`switch`），并能够确保你不会遗漏任何分支条件。

上面这段代码，目前是无法通过编译的：

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bee46fa3af2c4fd08bbef9df941af3bc~tplv-k3u1fbpfcp-zoom-1.image" style="zoom:50%;" />

错误原因是因为我们保存的 `guess` 变量类型是 String，保密数字是 integer 类型，不同的类型无法匹配（静态语言不存在隐式类型转换）。

为了正常进行比较操作，我们需要将程序中读取的输入从 String 类型转换为数值类型：

```diff
use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("Guess the number!");

    let secret_number = rand::thread_rng().gen_range(1..101);

    println!("Please input your guess.");

    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("Failded to read line");

+   let guess: i32 = guess.trim().parse().expect("Please type a number");

    println!("You guessed: {}", guess);

    match guess.cmp(&secret_number) {
        Ordering::Less => println!("Too small!"),
        Ordering::Greater => println!("Too big!"),
        Ordering::Equal => println!("You win!"),
    }
}
```

- 我们这里创建一个新的不可变变量`guess`，虽然和前面的同名，但这是有效的，Rust 允许使用同名的新变量 guess 来隐藏（shadow）旧变量的值。这一特性通常被用在需要转换值类型的场景中，它在本例中允许我们重用 guess 这个变量名，而无须创造出 guess_str 之类不同的名字。

- `guess.trim()` 是为了删除首尾所有空白字符。

- 字符串的 `parse` 方法会尝试将当前的字符串解析为某种数值。由于这个方法可以处理不同的数值类型，所以需要我们通过语句`let guess: i32` 来显式地声明我们需要的数值类型。

现在我们重新 Run 一下我们的程序：

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a2e0066cbbb4948aacf17ad5ea8b24b~tplv-k3u1fbpfcp-zoom-1.image)

这个游戏已经大体成型了，但玩家只能做出一次猜测，这显然是不够的，接下来，我们会加入一个循环来完善这个游戏。

## 使用循环来实现多次猜测

```diff
use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("Guess the number!");

    // `..` 语法是标准库中提供的 Range
    let secret_number = rand::thread_rng().gen_range(1..101);
+   loop {
        println!("Please input your guess.");

        let mut guess = String::new();

        io::stdin()
            .read_line(&mut guess)
            .expect("Failded to read line");

        let guess: i32 = guess.trim().parse().expect("Please type a number");

        println!("You guessed: {}", guess);

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
+           Ordering::Equal => {
+               println!("You win!");
+               break;
+           }
        }
+   }
}
```

- 我们将提示用户做出猜测决定之后的所有内容都移动到了 `loop` 中。在 Rust 中，`loop` 关键字会创建一个无限循环。
- 我们还给程序增加了一条`break`语句，使得玩家在猜对数字后能够正常退出游戏。

运行程序，玩家猜对数字，输出**You Win!**后，会退出程序：

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6b7b5953aec4e36a9fe7b44805100c0~tplv-k3u1fbpfcp-zoom-1.image)

## 处理非法输入

在转换 `guess` 字符串为 `number` 类型是，我们使用 `expect("Please type a number")`来处理可能出现的错误，我们尝试输入一个非 `number` 类型的值运行一下：

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b33a4d37eeb648f9837aef91fea55b05~tplv-k3u1fbpfcp-zoom-1.image)

用户如果想要重新开始游戏，需要重启程序，这很明显，用户体验挺差的。为了改善游戏的可玩性，我们可以在用户输入了一个非数字数据时简单地忽略这次猜测行为，并使用户可以继续进行猜测，从而避免程序发生崩溃。

```rust
use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("Guess the number!");

    // `..` 语法是标准库中提供的 Range
    let secret_number = rand::thread_rng().gen_range(1..101);
    loop {
        println!("Please input your guess.");

        let mut guess = String::new();

        io::stdin()
            .read_line(&mut guess)
            .expect("Failded to read line");

        let guess: i32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => {
              println!("Please type a number!");
              continue;
            }
        };

        println!("You guessed: {}", guess);

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}
```

- 我们使用了 `match` 表达式来替换之前的 `expect` 方法，这是我们处理错误行为的一种管用手段。
- `parse`会返回一个 Result 类型，而`Result`类型则包含了`Ok`与`Err`两个变体。

万事具备，让我们运行这个项目试试看：

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd1f88a003e34ac0b23e1cd4e923cbbc~tplv-k3u1fbpfcp-zoom-1.image)
