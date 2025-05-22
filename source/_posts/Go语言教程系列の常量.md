---
title: Go 语言教程系列の常量
date: 2023-03-19 15:05:00
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1679280067130.png
description: Go 中的常量一词用于表示固定值
categories:
  - [Golang, Go 语言系列教程]
  - [紫升翻译计划]
tags:
  - Golang
  - Go 语言教程
  - Go 语言教程系列
  - Go 常量
---

## 常量是什么？

Go 中的常量一词用于表示固定值，例如：

```sh
95
"I love Go"
67.89
```

## 声明一个常量

关键字 `const` 用于声明常量。让我们看看如何使用 `const` 来声明一个常量。

```go
package main

import (
    "fmt"
)

func main() {
    const a = 50
    fmt.Println(a)
}
```

[Run in playground](https://play.golang.org/p/mv3B-q3h0zh)

上面的代码中，`a` 是一个常量并被赋值为 `50`。

## 声明一组常量

还有另一种语法可以使用单个语句定义一组常量。下面提供了使用此语法定义一组常量的示例。

```go
package main

import (
    "fmt"
)

func main() {
    const (
        name = "John"
        age = 50
        country = "Canada"
    )
    fmt.Println(name)
    fmt.Println(age)
    fmt.Println(country)
}
```

[Run in playground](https://play.golang.org/p/KvZ6zNz4A04)

在上面的程序中，我们声明了 3 个常量 `name`、`age` 和 `country`。 执行上面的程序会打印出以下内容：

```sh
John
50
Canada
```

顾名思义，常量不能再次重新分配任何其他值。在下面的程序中，我们试图将另一个值 `89` 分配给 `a`。这是不允许的，因为 `a` 是常量。 该程序将无法运行，并显示编译错误 `cannot assign to a`。

```go
package main

func main() {
const a = 55 //allowed
a = 89 //reassignment not allowed
}
```

[Run in playground](https://play.golang.org/p/b2J8_UQobb)

常量的值应在编译时确定。因此，由于函数调用在运行时发生，因此不能将函数调用返回的值分配给常量。

```go
package main

import (
    "math"
)

func main() {
    var a = math.Sqrt(4)   //allowed
    const b = math.Sqrt(4) //not allowed
}
```

[Run in playground](https://play.golang.org/p/GBlQDcbqfn-)

在上面的程序中，`a` 是一个变量，因此可以将函数 `math.Sqrt(4)` 的返回值分配给它（我们将在单独的教程中更详细地讨论函数）。

`b` 是一个常量，在编译时必须确定 `b` 的值。而 `math.Sqrt(4)` 函数是在运行时确定返回值，因此 `const b = math.Sqrt(4)` 编译失败并显示错误：

```
./prog.go:9:8: const initializer math.Sqrt(4) is not a constant
```

## 字符串常量、有类型常量和无类型常量

在 Go 中，双引号之间包含的任何值都是字符串常量。 例如，`"Hello World"`，`"Sam"` 之类的字符串在 Go 中都是常量。

字符串常量属于什么类型？ 答案是它们是无类型的。

像 `"Hello World"` 这样的字符串常量没有任何类型。

```go
const hello = "Hello World"
```

在上面的代码行中，常量 `"hello"` 没有类型。

Go 是一种强类型语言。所有变量都需要显式类型。试想一下，以下程序将无类型的常量 `n` 的值分配给变量 `name` 会发生什么？

```go
package main

import (
    "fmt"
)

func main() {
    const n = "Sam"
    var name = n
    fmt.Printf("type %T value %v", name, name)
}
```

[Run in playground](https://play.golang.org/p/oFv_cFuEucL)



答案是未类型的常量具有与之关联的默认类型，并且仅当一行代码需要它时，它们才提供默认类型。在 `var name = n` 的语句中，`name` 需要一个类型，它是从字符串常量 `n` 的默认类型（即字符串）中获取的。

有没有办法创建有类型的常量呢？答案是肯定的。下面的代码会创建一个有类型的常量。

```go
const typedhello string = "Hello World"
```

**上面的代码中的 `typedhello` 是字符串类型的常量。**

Go 是一种强类型语言。分配期间不允许混合类型。让我们看看下面的程序来理解下这意味着什么。

```go
package main

func main() {
    var defaultName = "Sam" //allowed
    type myString string
    var customName myString = "Sam" //allowed
    customName = defaultName //not allowed
}
```

[Run in playground](https://play.golang.org/p/1Q-vudNn_9)

在上面的代码中，我们首先创建一个变量 `defaultName`，并将常量 `Sam` 分配给它。**常量 `Sam` 的默认类型是 `string`，因此 `defaultName` 赋值后的类型是 `string`。**.

在下一行中，我们创建一个新类型 `myString`，它是字符串类型的别名。

然后，我们创建一个类型为 `myString` 的变量 `customName`，并为其分配常量 `"Sam"`。由于常量 `"Sam"` 是无类型的，因此可以将其分配给任何 `string` 变量。Go 允许这种分配，并且 `customName` 的类型为 `myString`。

现在，我们有一个字符串类型的变量 `defaultName` 和另一个 `myString` 类型的变量 `customName`。即使我们知道 `myString` 是字符串的别名，Go 的强类型策略也不允许将一种类型的变量分配给另一种类型。因此，不允许 `customName = defaultName` 这种分配，并且编译器将引发错误 `./prog.go:7:20: cannot use defaultName (type string) as type myString in assignment`。

## 布尔常量

布尔常量与字符串常量没有什么不同。它们是两个无类型的常量 `true` 和 `false`。字符串常量的相同规则也适用于布尔值，因此在此不再赘述。以下是一个解释布尔常量的简单程序：

```go
package main

func main() {
    const trueConst = true
    type myBool bool
    var defaultBool = trueConst //allowed
    var customBool myBool = trueConst //allowed
    defaultBool = customBool //not allowed
}
```

[Run in playground](https://play.golang.org/p/h9yzC6RxOR)

上面的程序的意思是不言而喻的。

## 数字常量

数字常量包含整形、浮点型和复数常量。这些概念使得数字常量很容易混淆。让我们看一些示例以使事情变得清楚。

```go
package main

import (
    "fmt"
)

func main() {
    const a = 5
    var intVar int = a
    var int32Var int32 = a
    var float64Var float64 = a
    var complex64Var complex64 = a
    fmt.Println("intVar",intVar, "\nint32Var", int32Var, "\nfloat64Var", float64Var, "\ncomplex64Var",complex64Var)
}
```

[Run in playground](https://play.golang.org/p/a8sxVNdU8M)

在上面的程序中，常量 `a` 是无类型的，其值是 5。你可能想知道 `a` 的默认类型是什么，如果它确实有一个，那么我们如何将其分配给不同类型的变量。答案在于 `a` 的语法。以下程序将使事情更加清楚。

```go
package main

import (
    "fmt"
)

func main() {
    var i = 5
    var f = 5.6
    var c = 5 + 6i
    fmt.Printf("i's type is %T, f's type is %T, c's type is %T", i, f, c)
}
```

[Run in playground](https://play.golang.org/p/0-eVCbJ76B5)

在上面的程序中，每个变量的类型由数字常量的语法确定。从语法上看，`5` 是整数，`5.6` 是浮点数，而 `5 + 6i` 是复数。当上面的程序运行时，它会打印：

```sh
i's type is int, f's type is float64, c's type is complex128
```

有了这些知识，让我们尝试了解以下程序的运行原理。

```go
package main

import (
    "fmt"
)

func main() {
    const a = 5
    var intVar int = a
    var int32Var int32 = a
    var float64Var float64 = a
    var complex64Var complex64 = a
    fmt.Println("intVar",intVar, "\nint32Var", int32Var, "\nfloat64Var", float64Var, "\ncomplex64Var",complex64Var)
}
```

[Run in playground](https://play.golang.org/p/_zu0iK-Hyj)

在上面的程序中，`a` 的值是 `5`，而 `a` 的语法是通用的。它可以表示浮点数，整数或者是没有虚部的复数。 因此，可以将其分配给任何兼容类型。这些常量的默认类型可以被认为是根据上下文动态生成的。 `var complex64Var complex64 = a` 要求 `a` 是一个复数，因此它成为一个复数常数。

## 数字表达式

数字常量可以在表达式中自由混合和匹配，并且仅当将它们分配给变量或在代码中需要类型的任何位置使用时，才需要类型。

```go
package main

import (
    "fmt"
)

func main() {
    var a = 5.9 / 8
    fmt.Printf("a's type is %T and value is %v", a, a)
}
```

[Run in playground](https://play.golang.org/p/Nsak9scUAWg)

在上面的程序中，`5.9` 是语法上的浮点数，`8` 是语法上的整数。不过，仍允许使用 `5.9 / 8`，这是因为它们都是数字常量。除法的结果是`0.7375` 是 `float`，因此变量 `a` 是 `float` 类型。该程序的输出是：

```sh
a's type is float64 and value is 0.7375
```

> 原文地址 [Constants](https://golangbot.com/constants/)
> 原文作者：[Naveen Ramanathan](https://golangbot.com/about/)
> 译文出自：[紫升翻译计划](https://youngjuning.cn/categories/%E6%B4%9B%E7%AB%B9%E7%BF%BB%E8%AF%91%E8%AE%A1%E5%88%92/)
