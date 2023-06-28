---
title: Rust 语法学习笔记
description: 语言之间都有着类似的核心特性，比如变量、基本类型、函数、注释和控制流程等概念。但是每个语言有都有自己的独有概念，本文便是记录了我在学习 Rust 语法过程中遇到的 Rust 独有概念。
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1681899618720.png
date: 2023-04-19 18:19:08
categories:
  - Rust
tags:
  - 紫升
  - 紫升的博客
  - Rust 语法
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

{% note primary modern %}
本文部分示例代码在 [youngjuning/learn-rust](https://github.com/youngjuning/learn-rust)
{% endnote %}

语言之间都有着类似的核心特性，比如变量、基本类型、函数、注释和控制流程等概念。但是每个语言有都有自己的独有概念，本文便是记录了我在学习 Rust 语法过程中遇到的 Rust 独有概念。

## 变量与可变性

Rust 中的变量默认是不可变的。Rust 语言提供这一概念是为了能够让你安全且方便地写出复杂、甚至是并行的代码。当然，Rust 也提供了让你可以使用可变变量的方法。

```rust
// main.rs
fn main() {
  let x = 5;
  println!("The value of x is: {}", x);
  x = 6;
  println!("The value of x is: {}", x)
}
```

`x = 6` 属于重复赋值，所以执行 `cargo run` 编译是不会通过的：

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c69b2d8dd78470d917c730a5fe5a0d0~tplv-k3u1fbpfcp-zoom-1.image)

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcfbdcb5c80944149b31b331b8165aee~tplv-k3u1fbpfcp-zoom-1.image)

我们可以通过在声明的变量名称前添加 `mut` 关键字来使其可变。除了使变量的值可变，`mut` 还会向阅读代码的人暗示其他代码可能会改变这个变量的值。

## 常量与变量的不同

1. 我们不能使用 `mut` 关键字来修饰一个变量。常量不仅是默认不可变的，它还总是不可变的。
2. 你需要使用 `const` 关键字而不是一个 `let` 关键字来声明一个常量。
3. 在声明的同时，你必须显式地标注值的类型。
4. 常量可以被声明在任何作用域中，甚至包括全局作用域。这在一个值需要被不同部分的代码共同引用时十分有用
5. 你只能将一个常量绑定到一个常量表达式上，而无法将一个函数的返回值，或其他需要在运行时计算的值绑定到常量上。

> 我们约定俗称地使用以下划线分割的全大写字母来命名一个常量，并在数值中插入下划线来提高可读性：`const MAX_POINTS: u32 = 100_000;`

## 隐藏

在 Rust 中，新声明的变量可以覆盖掉旧的同名变量，我们把这一现象描述为：第一个变量被第二个变量隐藏（shadow）了。这意味着我们随后使用这个名称时，它指向的将会是第二个变量。我们可以重复使用 `let` 关键字并分配以相同的名称来不断地隐藏变量：

```rust
fn main() {
    let x = 5;
    let x = x + 1;
    let x = x * 2;
    println!("The value of x is: {}", x)
}
```

如下图，我们可以看到 JavaScript 中并没有该特性：

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42b566023d5f486996638d08cdbf31b3~tplv-k3u1fbpfcp-zoom-1.image)

隐藏机制和变量声明为 `mut` 的不同：

1. 如果不是在使用 `let` 重新为这个变量赋值，则会导致编译错误。通过使用 `let`，我们可以对这个值执行一系列的变换操作，并允许这个变量在操作完成后保持自己的不可变性。
2. 由于重复使用 `let` 关键字会创建出新的变量，所以我们可以在复用变量名称的同时改变它的类型。

## 数据类型

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b6b8078eff445709283898b757e9834~tplv-k3u1fbpfcp-zoom-1.image)

RUST 的编译器可以根据我们如何绑定、使用变量的值来自动推导出变量的类型。但在无法自动推导的场景，就必须显式地添加一个类型标注。

### 标量类型（scalar）

**标量**类型是单个值类型的统称。Rust 中内建了 4 种基础的标量类型：整数、浮点数、布尔值及字符。这类似于 JavaScript 中的基础类型。

#### 整数类型

整数是指那些没有小数部分的数字。

| 长度   | 有符号                 | 无符号            |
| ------ | ---------------------- | ----------------- |
| 8 bit  | i8（-128 到 127）      | u8（0 到 255）    |
| 16 bit | i16（-32768 到 32767） | u16（0 到 65535） |
| 32 bit | i32(默认)              | u32               |
| 64 bit | i64                    | u64               |
| arch   | isize                  | usize             |

> Isize 和 usize 是特殊的整数类型，它们的长度取决于程序运行的目标平台。在 64 位架构上，它们就是 64 位的，而在 32 位架构上，它们就是 32 位的。

> 可以使用 `_` 作为分隔符以方便读数，比如 `1_000`

如何选择：

- 如果拿不定注意，Rust 对于整数字面量默认推导类型 i32 通常就是一个很好的选择：它在大部分情况下都是运算速度最快的
- 较为特殊的两个整数类型 `usize` 和 `isize` 则主要用作某些集合的索引

#### 浮点数类型

- 单精度浮点数（`f32`）
- 双精度浮点数（`f64`）(默认)

> 由于在现代 CPU 中双精度和单精度的运行效率相差无几，却拥有更高的精读，所以在 Rust 中，默认会将浮点数字面量的类型推到为 f64。

```rust
fn main() {
  let x = 2.0; // f64

  let y: f32 = 3.0; // f32
}
```

#### 布尔值

和 Go 语言一样，Rust 的布尔类型只拥有两个可能的值：`true`和 `false`。相较于 Javascript 中`false`、`0`、 `NaN`、`''`、`null`、`undefined` 6 种都可以被转换成 `false` 真的是很节省脑容量。

```rust
fn main() {
  let t = true;
  let f: bool = false // 附带了显式类型标注的语句
}
```

#### 字符类型

在 Rust 中，`char` 类型被用于描述语言中最基础的单个字符。需要注意的是，`char` 类型使用单引号指定，而不同于字符串使用双引号指定。

### 复合类型（compound）

复合类型可以将多个不同类型的值组合为一个类型。Rust 提供了两种内置的基础复合类型：元组（tuple）和数组（array）。

#### 元组类型

- 元组可以将其他不同类型的多个值进行组合
- 元组拥有一个固定的长度，我们无法在声明结束后增加或减少其中的元素数量

**创建元组：**

```rust
fn main() {
    let tup: (i32, f64, u8) = (500, 6.4, 1);
}
```

- 把一些列值使用逗号分隔后放置到一对圆括号中
- 元组每个位置的值都有一个类型，这些类型不需要是相同的。

上面这段带来执行 `cargo run` 会有编译警告：

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3db475c146fa43aabef6a2be17dbe1b4~tplv-k3u1fbpfcp-zoom-1.image)

意思是，如果你是故意声明一个 `unused variable`，那就给变量名加一个下划线前缀来忽略警告

**取值：**

1、解构（destructuring）：使用模式匹配来解构元组：

```rust
fn main() {
    let tup = (500, 6.4, 1);
    let (_x, y, _z) = tup;
    println!("The value of y is: {}", y);
}
```

2、通过索引并使用点号(`.`)来访问元组中的值：

```rust
fn main() {
  let x: (i32, f64, u8) = (500, 6.4, 1);
  let five_hundred = x.0;
  let six_point_four = x.1;
  let one = x.2;
}
```

#### 数组类型

##### 数组（array）

通常当你不想在栈上而不是堆上为数据分配空间时，或者想要确保总有固定数量的元素时，数组是一个非常有用的工具。

- 与元组不同的是数组中的每一个元素都必须是相同的类型。
- Rust 中的数组拥有固定的长度，一旦声明就再也不能随意更改大小，这与其他语言不同。

在 Rust 中，你可以将以逗号分隔的值放置在一对方括号内来创建一个数组：

```rust
fn main() {
  let a = [1, 2, 3, 4, 5]
}
```

为了写出数组的类型，你需要使用一对方括号，并在方括号中填写数组内所有元素的类型、一个分号以及数组内元素的数量，如下所示：

```rust
let a: [i32, 5] = [1, 2, 3, 4, 5]
```

**创建一个含有相同元素的数组：**

```rust
let a = [3; 5]
```

以 `a` 命名的数组将会拥有 5 个元素，而这些元素全部拥有相同的初始值 3。这一写法等价于 `let a = [3, 3, 3, 3, 3]`。

**访问数组的元素：**

数组由一整块分配在栈上的内存组成，你可以通过索引来访问一个数组中的所有元素：

```rust
fn main() {
	let a = [1, 2, 3, 4, 5];
  let first = a[0];
  let second = a[1];
}
```

**非法的数组访问**

```rust
fn main() {
  let a = [1, 2, 3, 4, 5];
  let index = 10;

  let element = a[index];
  println!("The value of elements is: {}", element)
}
```

在 [Rust Playground](https://play.rust-lang.org/) 运行这段代码，编译器提示我们，这个操作将会在运行时崩溃。原因是索引越界（Java 常见错误），数组长度是 5，但是我们给的索引是 10。

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af82e05277824ab285e1c35224c07996~tplv-k3u1fbpfcp-zoom-1.image)

> 许多底层语言并没有类似的检查，一旦尝试使用非法索引，你就会访问到某块无效的内存空间（JavaScript 中则返回一个 `undefined`）

##### 动态数组（vector）

动态数组是一个类似于数组的集合结构，但它允许用户自由地调整数组长度。如果你不确定使用数组还是动态数组，那就先使用动态数组吧。动态数组属于高级语法，不在本文讨论范围，后期会出一期更深入的解析。

## 函数（function）

- `main` 函数是大部分程序开始的地方。
- 使用 `fn` 关键字来声明一个新的函数。
- Rust 代码使用**蛇形命名法（snake case）**来作为规范函数和变量名称的风格。蛇形命名法只使用小写的字母进行命名，并以下划线分隔单词。

```rust
fn main () {
    println!("Hello world!");

    another_function();
}

fn another_function() {
    println!("Another function");
}
```

### 函数参数

函数参数是一种特殊的变量，并被视作函数签名的一部分。当函数存在参数时，你需要在调用函数时为这些变量提供具体的值。

```rust
fn main() {
  another_function(5);
}

fn another_function(x: i32) {
  println!("The value of x is: {}", x)
}
```

> 和 Go 语言一样，在 Rust 函数签名中，你必须显式地声明每个参数的类型。

和其他编程语言一样，Rust 中也是使用 `,` 来分隔多个参数：

```rust
fn main() {
  another_function(5, 6);
}

fn another_function(x: i32, y: i32) {
  println!("The value of x is: {}", x);
  println!("The value of y is: {}", y);
}
```

### 函数体中的语句和表达式

由于 Rust 是一门基于表达式的语言，所以它将语句（statement）与表达式（expression）区别为两个不同的概念。语句指那些执行操作但不返回值的指令，而表达式则是指会进行计算并产生一个值作为结果的指令。这个其他语言不太一样：

在 C 语言、Ruby、JavaScript 中 `var x = y = 6` 这种赋值语句会返回所赋的值，但是 Rust 中是行不通的。

值得注意的是，下面代码中的 `x+1` 是表达式。

```rust
fn main() {
  let x = 5;

  let y = {
    let x = 3;

    x + 1
  }

  println!("The value of y is: {}", y);
}
```

但是如果我们在表达式末尾加上了分号，这一段代码就变成了语句而不会返回任何值。

### 函数的返回值

- 在 Rust 中，函数的返回值等同于函数体最后一个表达式的值。
- 和其他编程语言不同的是，Rust 中函数的 `return` 语句不是必需的，只是一个用来提前返回的关键字。而且大多数函数都隐式地返回了最后的表达式。
- 需要在瘦箭头（`->`）的后面声明它的类型。

函数体最后一行必须是表达式，不要加分号，下面是反例：

```rust
fn main() {
  let x = plus_one(5);

  println!("The value of x is: {}", x);
}

fn plus_one(x: i32) -> i32 {
  x + 1;
}
```

尝试编译这段代码会产生如下错误信息：

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68a309eddc6244e4a5b45bcd39553156~tplv-k3u1fbpfcp-zoom-1.image)

可以看出，由于 `x +1;` 是表达式没有返回值，函数体隐式地返回了空元祖（`()`），进而导致编译时 `mismatched types` 错误。编译器给的建议是删除 `x +1;` 语句的分号。

## 控制流

### if 表达式

```rust
fn main() {
    let number = 3;

    if number < 5 {
        println!("condition was true");
    } else {
        println!("condition was false")
    }
}
```

- 和 Go 一样，判断条件不需要圆括号包裹。
- 代码中的条件表达式必须产生一个 `bool` 类型的值，否则就会触发编译错误。
- 与 Ruby 或 JavaScript 等语言不同，Rust 没有隐式转换

#### 在 `let` 语句中使用 `if`

由于` if` 是一个表达式，所以我们可以再 `let` 语句的右侧使用它来生成一个值。

```rust
fn main() {
  let condition = true;
  let number = if condition {
    5
  } else {
    6
  };

  println!("The value of number is: {}", number);
}
```

- 代码块输出的值就是其中最后一个表达式的值，另外，数字本身也可以作为一个表达式使用。
- 整个 `if` 表达式的值取决于究竟是哪一个代码块得到了执行。这意味着，所有 `if` 分支可能返回的值都必须是一种类型的。

## 使用循环重复执行代码

Rust 提供了 3 种循环：`loop`、`while`和`for`

### loop 循环

```rust
fn main() {
  loop {
    println!("again!")
  }
}
```

运行这段程序时，除非我们手动强制退出程序，否则 `again!` 会被反复地输出到屏幕上。

**从 loop 循环中返回值**

```rust
fn main() {
  let mut counter = 0;

  let result = loop {
    counter += 1;

    if counter == 10 {
      break counter * 2
    }
  };

  println!("The result is {}", result);
}
```

上面的代码中我们将需要返回的值添加到 break 表达式后面，也就是我们用来终止循环的表达式后面。

### while 条件循环

```rust
fn main() {
  let mut number = 3;

  while number !=0 {
    println!("{}!", number);

    number = number - 1;
  }

  println!("LOFTOFF!!!")
}
```

`while` 循环的模式是会在每次执行循环体之前都判断一次条件，假如条件为真则执行代码片段，加入条件为假或在执行过程中碰到 `break` 就退出当前循环。这种模式可以通过 `loop`、`if`、`else` 及 `break` 关键字的组合使用来实现。

### 使用 for 循环遍历集合

我们可以使用 `for` 循环来遍历集合中的每一个元素。

```rust
fn main() {
  let a = [10, 20, 30, 40, 50];

  for element in a.iter() {
    println!("The value is: {}", element)
  }
}
```

`for` 循环的安全性和简捷性使它成为了 Rust 中最为常用的循环结构。大部分的 Rust 开发者也会选择使用 for 循环。

下面的例子中，我们配合标准库中的 Range 来实现打印 `1` 到`4`:

```rust
fn main() {
  for number in (1..4).rev() {
    println!("{}!", number);
  }
  println!("LIFTOFF!!!")
}
```
