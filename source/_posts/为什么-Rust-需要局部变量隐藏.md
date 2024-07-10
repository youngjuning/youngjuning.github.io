---
title: 为什么 Rust 需要局部变量隐藏
description: 在 Rust 的世界中，变量可以被一个同名的变量覆盖掉的现象就叫做隐藏。这意味着我们随后使用这个名称时，他指向的将会是第二个变量。
date: 2023-04-19 18:08:20
categories:
  - Rust
tags:
  - Rust 变量隐藏
---

## 什么是变量隐藏

在 Rust 的世界中，变量可以被一个同名的变量覆盖掉的现象就叫做隐藏。这意味着我们随后使用这个名称时，他指向的将会是第二个变量。我们可以重复使用`let`关键字并配以相同的名称来不断地隐藏变量：

```rust
fn main() {
  let x = 5;

  let x = x + 1;

  let x = x + 2;

  println!("The value of x is: {}", x);
}
```

按照世界上没有完全一样的两个东西的原则（上一秒的你也不等于下一秒的你），这前后两个变量并不会完全一样。我并没有看过 Rust 源码，个人理解是这两个变量指向的内存空间是不一样的。所谓隐藏不过是编译器在编译的时候去做了区分。子非编译器，安知compiler之乐乎？

隐藏机制与`mut`（mutable）的不同：

1. 如果不是在使用 `let` 关键字的情况下重新为这个变量赋值，则会导致编译错误。通过使用`let`，我们可以对这个值执行一些列的变化操作，并允许这个变量在操作完成后保持自己的不可变性。
2. 由于重复使用 `let` 关键字会创建出新的变量，所以我们可以在复用变量名称的同时改变它的类型。

> 隐藏特性通常被用在需要转换值类型的场景中，如果只是改变值本身 `mut` 关键字就够用。

## 为什么 Rust 需要变量隐藏？

> 这是 reddit rust 话题下的一个问题，我这里翻译一下。

### 问题

我最近发现 Rust 不像其他类C语言，它允许在一个块作用域中定义多个拥有相同名称的变量：

```rust
let name = 10i;
let name = 3.14f64;
let name = "string";
let name = name; // "string" again, this definition shadows all the others
```

至少从我的 C++ 背景来说，第一次看到这个特性着实有点吓人。

这个特性来自哪里？它提供了什么好处？

### 回答

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6956030e8f734c3a81e5598aa9123dd7~tplv-k3u1fbpfcp-zoom-1.image)

变量隐藏与仿射类型（affine types）具有很多协同作用。例如：

```rust
let foo = foo.unwrap();
```

你在其中重新绑定 `foo` 的同时引用 `unwrap()` 的结果，因此旧 `foo` 由于该原因而变得不可访问。——变量指向了新的内存空间。

---
![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9b00e7afe1946ed84b10d7085f0a320~tplv-k3u1fbpfcp-zoom-1.image)

好处是使用一个单词来表示共同的变量，例如 `c` 用于绘制上下文。变量可以被改变类型，[Rust-Graphics](https://github.com/PistonDevelopers/graphics) 大量地依赖该特性。每一个方法返回一个新的类型，并且当上下文提供足够的信息去绘制时，你只能调用`.draw(gl)`。

---

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/699da31543d44ae99d95e0d371e9fce8~tplv-k3u1fbpfcp-zoom-1.image)

我经常使用的单个字母是：

- `a`、`b` 用作二进制操作的参数
- `c`、`d`、`g` 用作图形绘制
- `i`、`j`、`k` 用作索引
- `n`、`m` 用作长度
- `x`、`y`、`z`、`t` 作为空间坐标系

有时我也使用`p`、`q`或者`v`、`u` 作复杂的数学运算。

---

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/666f1cfe0c0e4a7f97779b7cc95dedf7~tplv-k3u1fbpfcp-zoom-1.image)

我认为变量隐藏的最佳论据是阻止对象可变性的能力。

```rust
let mut vec = Vec::new();
vec.push(1i);
vec.push(2i);
let vec = vec;
```

但是，对于中间变量，我也很喜欢。有时，通过`let`绑定将长方法链分成两行只是更漂亮。您只需两次使用变量名来代替使用 `let temp`,这样，临时变量不会使函数名称空间的其余部分杂乱无章。

---

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2a0e9fa316c4ad8a95d655d76b9295b~tplv-k3u1fbpfcp-zoom-1.image)

我不确定，但我认为此功能可将可变性降至最低。您可以使用新值重新声明它，而不用突变一个变量。

无论如何，它并没有看起来那么糟糕。类型系统禁止使用`int`代替浮点数或字符串。

确实，此功能可能会导致错误，但也可以防止它们。没有隐藏，您常常必须为变量（相同类型）使用不同的名称，这使得使用错误的变量成为可能。

---

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/551b748ead0b4ae89a1797d0032b79f5~tplv-k3u1fbpfcp-zoom-1.image)

我昨天也注意到了这一点。我宁愿没有它，因为它引入了难以发现的错误。

我自己的C ++代码中有与隐藏相关的错误（就在上周）。此外，由于隐藏局部变量，Gecko中也存在bug，因此显然这很危险。

我知道Rust是一种旨在防止错误的语言（即使它降低了便利性），所以我想知道为什么允许这样做。值得冒着出BUG的风险吗？

也有人评论说lint有一个选项可以警告可变阴影。会有这样的选择吗？但愿如此。

顺便提一句。该线程还有一些用例，人们如何使用隐藏，因此对此线程感兴趣的人应该通读它。

- [[rust-dev] Variables with the same name in the same scope](https://mail.mozilla.org/pipermail/rust-dev/2013-May/004306.html)
- [[rust-dev] Variables with the same name in the same scope](https://mail.mozilla.org/pipermail/rust-dev/2013-May/004298.html)

---

![紫升](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07fc8946bff243ddaf9abac9db16b02d~tplv-k3u1fbpfcp-zoom-1.image)

我经常使用隐藏来防止再次引用另一个变量。这是我从OCaml那里习得的一种习惯，在该习惯下，隐藏是允许的并且是惯用的。

比如，在 `trans` 中我经常隐藏来终止块变量，因为再次使用它们是一个错误。这样，隐藏可以成为防止错误的强大工具。

## 总结

这个问答中，整体的意见比较一致，就是隐藏特性乍看起来很不爽，但是用多了就会惊讶于它的安全性、便捷性。凡事有捧就有踩，还是有老哥说出来隐藏用多了，很难调试，由于老哥过于啰嗦，懒得翻译原文如下：

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c15812c59a3248c99c77eeed7838fabe~tplv-k3u1fbpfcp-zoom-1.image" style="zoom:50%;" />

个人觉得这有点杠了，所有设计一旦被滥用就会变得不对劲。总体来说隐藏带来的好处是大于益处的。
