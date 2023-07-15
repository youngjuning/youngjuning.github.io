---
title: Go 语言教程系列の变量
date: 2023-03-19 15:03:00
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1679280067130.png
description: 这是我们 Golang 教程系列中的第三篇教程，它涉及 Golang 中的变量。
categories:
  - [Golang, Go 语言系列教程]
  - [紫竹翻译计划]
tags:
  - Golang
  - Go 语言教程
  - Go 语言教程系列
  - Golang 变量
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

这是我们 Golang 教程系列中的第三篇教程，它涉及 Golang 中的变量。

你可以先阅读 [《Go 语言教程系列》Hello World | Go 主题月](https://juejin.cn/post/6942876429625327653) 来了解关于配置 Go 和运行 hello world 程序的信息。

## 变量是什么？

变量是为内存地址指定的名称，用于存储特定类型的值。Go 中有多种语法来声明变量。让我们一一看一下。

## 声明单个变量

**var name type** 是声明单个变量的语法。

```go
package main

import "fmt"

func main() {
	  var age int // 变量声明
	  fmt.Println("My age is", age)
}
```

[Run in playground](https://play.golang.org/p/lvKWH29bwke)

语句 `var age int` 声明了一个类型为 `int` 的名为 `age` 的变量。我们没有为该变量赋任何值。如果未为变量分配任何值，则 Go 会使用变量类型的“零值”自动将其初始化。在这种情况下，为年龄分配了值 `0`，即 `int`的零值。如果运行此程序，则可以看到以下输出。

```go
My age is 0
```

可以为变量分配给其类型的任何值。在上面的程序中，可以为 `age` 分配任何整数值。

```go
package main

import "fmt"

func main() {
    var age int // 变量声明
    fmt.Println("My age is", age)
    age = 29 // 分配
    fmt.Println("My age is", age)
    age = 54 // 分配
    fmt.Println("My new age is", age)
}
```

[Run in playground](https://play.golang.org/p/hSsWbF-3lQU)

上面的程序将打印以下输出：

```go
My age is  0
My age is 29
My new age is 54
```

## 声明一个具有初始值的变量

声明变量时，还可以为其提供初始值。以下是声明具有初始值的变量的语法。

```go
var name type = initialvalue
```

```go
package main

import "fmt"

func main() {
    var age int = 29 // 带有初始值的变量声明

    fmt.Println("My age is", age)
}
```

[Run in playground](https://play.golang.org/p/NAbtaE0pjZ8)

在上面的程序中，`age`是类型为 `int` 的变量，其初始值为 `29`。上面的程序将输出以下内容：

```
My age is 29
```

它显示年龄已经用值 29 初始化。

## 类型推断

如果变量具有初始值，Go 将自动使用该初始值来推断该变量的类型。 因此，如果变量具有初始值，则可以删除变量声明中的 `type`。

如果使用以下语法声明了变量

```go
var name = initialvalue
```

Go 会自动从初始值推断出该变量的类型。

在下面的示例中，我们可以看到变量 `age` 的类型 `int` 已在第 6 行中删除。由于变量的初始值为 29，因此 Go 可以推断出它的类型为 `int`。

```go
package main

import "fmt"

func main() {
	  var age = 29 // 类型将被推断为 int
	  fmt.Println("My age is", age)
}
```

[Run in playground](https://play.golang.org/p/meyJPveRLrK)

## 多变量声明

多变量声明可以使用单行语句来声明多个变量。

`var name1, name2 type = initialvalue1, initialvalue2` 是多变量声明的语法。

```go
package main

import "fmt"

func main() {
    var width, height int = 100, 50 // 声明多变量

    fmt.Println("width is", width, "height is", height)
}
```

[Run in playground](https://play.golang.org/p/4aOQyt55ah)

如果变量具有初始值，则可以删除该类型。 由于上述程序具有变量的初始值，因此可以删除 `int` 类型。

```go
package main

import "fmt"

func main() {
    var width, height = 100, 50 // int 被移除了

    fmt.Println("width is", width, "height is", height)
}
```

[Run in playground](https://play.golang.org/p/f7deGqYFNEL)

上面的程序将以 `print width is 100 height is 50` 作为输出。

就像你现在可能已经猜到的那样，如果没有为 `width` 和 `height` 指定初始值，则它们的初始值将被指定为 `0`。

```go
package main

import "fmt"

func main() {
    var width, height int
    fmt.Println("width is", width, "height is", height)
    width = 100
    height = 50
    fmt.Println("new width is", width, "new height is", height)
}
```

[Run in playground](https://play.golang.org/p/-4CnqDgWOKG)

上面的程序会打印如下内容。

```
width is 0 height is 0
new width is 100 new height is 50
```

在某些情况下，我们可能希望在单个语句中声明属于不同类型的变量。这样做的语法是：

```go
var (
    name1 = initialvalue1
    name2 = initialvalue2
)
```

以下程序使用上述语法声明不同类型的变量。

```go
package main

import "fmt"

func main() {
    var (
        name   = "naveen"
        age    = 29
        height int
    )
    fmt.Println("my name is", name, ", age is", age, "and height is", height)
}
```

[Run in playground](https://play.golang.org/p/7pkp74h_9L)

在这里，我们声明了一个 `string` 类型的变量 `name`，类型为 `age` 的变量和 `height` 为 int 的变量。

运行以上程序将打印：

```
my name is naveen , age is 29 and height is 0
```

## 短声明

Go 还提供了另一种简洁的声明变量的方法。这被称为短声明，它使用`:=` 运算符。

`name := initialvalue` 是声明变量的简写语法。

以下程序使用简写形式的语法来声明变量 `count`，并将其初始化为 ` 10`。Go 会自动推断 `count` 是 `int` 类型的，因为它已经用整数值 `10`初始化了。

```go
package main

import "fmt"

func main() {
    count := 10
    fmt.Println("Count =",count)
}
```

[Run in playground](https://play.golang.org/p/L5_8aru7VQM)

以上程序将打印：

```
Count = 10
```

It is also possible to declare multiple variables in a single line using short hand syntax.

你也可以使用短声明在一行内声明多个变量：

```go
package main

import "fmt"

func main() {
  name, age := "naveen", 29 // short hand declaration

  fmt.Println("my name is", name, "age is", age)
}
```

[Run in playground](https://play.golang.org/p/ctqgw4w6kx)

上面的程序声明了两个变量，分别是类型为 `string` 的 `name` 和类型为 `int` 的 `age`。

如果运行上述程序，则可以看到 `my name is naveen age is 29` 被打印出来。

短声明要求赋值左侧所有变量的初始值。以下程序将显示错误 `assignment mismatch: 2 variables but 1 values`。这是因为 `age` 尚未分配值。

```go
package main

import "fmt"

func main() {
  name, age := "naveen" //error

  fmt.Println("my name is", name, "age is", age)
}
```

[Run in playground](https://play.golang.org/p/wZd2HmDvqw)

仅当 `:=` 左侧至少有一个新声明的变量时，才可以使用简写语法。注意以下程序：

```go
package main

import "fmt"

func main() {
    a, b := 20, 30 // declare variables a and b
    fmt.Println("a is", a, "b is", b)
    b, c := 40, 50 // b is already declared but c is new
    fmt.Println("b is", b, "c is", c)
    b, c = 80, 90 // assign new values to already declared variables b and c
    fmt.Println("changed b is", b, "c is", c)
}
```

[Run in playground](https://play.golang.org/p/MSUYR8vazB)

在上面的程序中，在第 8 行中，已经声明了**b**，但是新声明了**c**，因此它可以工作并输出：

```
a is 20 b is 30
b is 40 c is 50
changed b is 80 c is 90
```

而如果我们运行以下程序，

```go
package main

import "fmt"

func main() {
    a, b := 20, 30 //a and b declared
    fmt.Println("a is", a, "b is", b)
    a, b := 40, 50 //error, no new variables
}
```

[Run in playground](https://play.golang.org/p/EYTtRnlDu3)

它将显示错误 `/prog.go:8:10: no new variables on left side of :=` ，这是因为变量 **a** 和 **b** 已经声明，并且 `:=` 左侧没有新声明的变量。

还可以为变量分配在运行时计算的值。注意以下程序，

```go
package main

import (
    "fmt"
    "math"
)

func main() {
    a, b := 145.8, 543.8
    c := math.Min(a, b)
    fmt.Println("Minimum value is", c)
}
```

[Run in playground](https://play.golang.org/p/Kk84pOyFgQB)

在上述程序中，[math](https://golang.org/pkg/math/) 是一个程序包，[Min](https://golang.org/pkg/math/#Min) 是该程序包中的函数 。现在不用担心，我们将在后续的教程中详细讨论软件包和功能。我们需要知道的是，`c` 的值是在运行时计算出来的，它是 `a` 和 `b` 的最小值。 上面的程序将打印，

```
Minimum value is  145.8
```

由于 Go 是强类型的，因此不能将声明为属于一种类型的变量分配给另一种类型的值。以下程序将打印错误 `cannot use "naveen" (type string) as type int in assignment`，因为 `age` 被声明为类型 `int`，并且我们正在尝试为其分配 `string` 类型的值。

```go
package main

func main() {
    age := 29      // age is int
    age = "naveen" // error since we are trying to assign a string to a variable of type int
}
```

[Run in playground](https://play.golang.org/p/K5rz4gxjPj)

谢谢阅读。 请在评论部分留下你的反馈和查询。
贵的反馈和意见。谢谢阅读。

> 原文地址 [Variables](https://golangbot.com/variables/)
> 原文作者：[Naveen Ramanathan](https://golangbot.com/about/)
> 译文出自：[紫竹翻译计划](https://youngjuning.js.org/categories/%E6%B4%9B%E7%AB%B9%E7%BF%BB%E8%AF%91%E8%AE%A1%E5%88%92/)
