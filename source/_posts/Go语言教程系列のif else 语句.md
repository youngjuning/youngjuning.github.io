---
title: Go 语言教程系列のif else 语句
date: 2023-03-19 15:08:00
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1679280067130.png
description: if 是一个具有布尔条件的语句，如果该条件的值为 true，它将执行一个代码块。如果判定条件为 false，它将执行 else 代码块。在本教程中，我们将研究 if 语句的各种语法和使用方法。
categories:
  - [Golang, Go 语言系列教程]
  - [紫升翻译计划]
tags:
  - Golang
  - Go 语言教程
  - Go 语言教程系列
  - Golang if else
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>


`if` 是一个具有布尔条件的语句，如果该条件的值为 `true`，它将执行一个代码块。如果判定条件为 `false`，它将执行 `else` 代码块。在本教程中，我们将研究 `if` 语句的各种语法和使用方法。

## `if` 语句语法

下面的代码正是 `if` 语句的语法：

```go
if condition {
}
```

如果 `condition` 被判定为 `true`，大括号 `{` 和 `}` 之间的代码将被执行。

与其他语言（例如C、JavaScript）不同，Go 语言中大括号 `{}` 是必需的，即使大括号 `{}` 之间只有一行代码。

## Example

让我们来写一个简单的程序来判断一个数字的奇偶性。

```go
package main

import (
    "fmt"
)

func main() {
    num := 10
    if num%2 == 0 { // 检查数字是否是奇数
        fmt.Println("The number", num, "is even")
        return
    }
    fmt.Println("The number", num, "is odd")
}
```

[Run in Playground](https://play.golang.org/p/RRxkgK07ul4)

在上面的程序中，第9行的条件 `num％2` 确定 `num` 除以 `2` 的余数是否为零。由于在这种情况下为 `0`，所以将打印文本 `The number 10 is even`，然后程序退出。

## `if...else...` 语句

`if` 语句具有可选的 `else` 结构体，如果 `if` 语句中的条件被判定为 `false`，则将执行该结构体。

```go
if condition {
} else {
}
```

在上面的代码片段中，如果条件被判定为 `false`，那么将执行 `else {`和 `}` 之间的代码。

让我们重写程序以使用 `if else` 语句判断数字的奇偶性。

```go
package main

import (
    "fmt"
)

func main() {
    num := 11
    if num%2 == 0 { // 检查数字是否是奇数
        fmt.Println("the number", num, "is even")
    } else {
        fmt.Println("the number", num, "is odd")
    }
}
```

[Run in playground](https://play.golang.org/p/bMevwhJhguO)

在上面的代码中，我们没有像上一节那样返回条件是否为 `true`，而是创建了 `else` 语句，如果条件为 `false` 则执行该语句。在这种情况下，由于 `11` 为奇数，因此 `if` 条件为 `false` 并执行 `else` 语句中的代码。上面的程序将打印。

```
the number 11 is odd
```

## `if...else if...else...` 语句

`if` 语句还具有可选的 `else if` 和 `else` 组件。下面提供了相同的语法

```go
if condition1 {
...
} else if condition2 {
...
} else {
...
}
```

该语法用来从上到下来查找问题的真相。

在上面的语句中，如果 `condition1` 为 `true`，则执行 `if condition1 {` 和右括号 `}` 中的代码。

如果 `condition1` 是 `false`，而 `condition2` 是 `true`，则执行 `condition2 {` 和下一个右括号 `}` 的其他代码。

如果 `condition1` 和 `condition2` 均为假，则执行 `else {` 和 `}` 之间 `else` 语句中的代码。

可以有任意数量的 `else if` 语句。

通常，无论条件是 `if` 还是 `else if`，都将执行相应的代码块。如果没有一个条件为真，则执行 `else` 块。

让我们编写一个使用 `else if` 的程序。

```go
package main

import (
    "fmt"
)

func main() {
    num := 99
    if num <= 50 {
        fmt.Println(num, "is less than or equal to 50")
    } else if num >= 51 && num <= 100 {
        fmt.Println(num, "is between 51 and 100")
    } else {
        fmt.Println(num, "is greater than 100")
    }
}
```

[Run in playground](https://play.golang.org/p/VNPbCiK9eXT)

在上面的程序中，第 11 行的条件 `else if num >= 51 && num <= 100` 为 `true`，因此程序将打印：

```
99 is between 51 and 100
```

## 带有赋值语句的 `if`

`if` 的另一种变体，包括可选的短赋值语句，该语句在判定条件之前执行。它的语法是：

```go
if assignment-statement; condition {
}
```

在上面的代码段中，在判定条件之前首先执行 `assignment-statement`。

让我们使用上面的语法重写判断数字奇偶性的程序。

```go
package main

import (
    "fmt"
)

func main() {
    if num := 10; num % 2 == 0 { //checks if number is even
        fmt.Println(num,"is even")
    }  else {
        fmt.Println(num,"is odd")
    }
}
```

[Run in playground](https://play.golang.org/p/_X9q4MWr4s)

在上面的程序中，在第 8 行的 `if` 语句中初始化了 `num`。需要注意的一件事是 `num` 仅可用于 `if` 和 `else` 内部的访问。即 `num` 的有效范围仅限于 `if` 块。 如果我们尝试从 `if` 或 `else` 外部访问 `num`，则编译器会报错。当我们仅出于 `if else` 构造的目的声明变量时，这种语法通常会派上用场。在这种情况下使用此语法可确保变量的范围仅在 `if else` 语句内。

## 陷阱

`else` 语句应在 `if` 语句的大括号 `}` 之后的同一行开始。如果没有，编译器会抛错。

让我们通过一个程序来理解这一点。

```go
package main

import (
    "fmt"
)

func main() {
    num := 10
    if num % 2 == 0 { //checks if number is even
        fmt.Println("the number is even")
    }
    else {
        fmt.Println("the number is odd")
    }
}
```

[Run in playground](https://play.golang.org/p/RYNqZZO2F9)

在上面的程序中，在第 11 行的 `if` 语句的结束符 `}` 之后，`else` 语句不在同一行开始。而是从下一行开始。 Go 不允许这样做。如果你运行此程序，则编译器将输出错误，

```sh
./prog.go:12:5: syntax error: unexpected else, expecting }
```

原因是因为 Go 自动插入分号的方式。你可以在 [Semicolons](https://golang.org/ref/spec#Semicolons) 中阅读有关分号插入规则的信息。

在规则中，指定了在结束括号 `}` 之后插入分号（如果这是该行的最后一个标记）。因此，Go 编译器在第 11 行的 `if` 语句的右括号 `}` 之后自动插入了分号。

所以我们的程序实际上变成了：


```go
...
if num%2 == 0 {
      fmt.Println("the number is even")
};  // Go 编译器自动插入分号
else {
      fmt.Println("the number is odd")
}
```

编译器将在以上代码片段的第 4 行中插入分号。

由于 `if {...} else {...}` 是 一个单独的语句，因此中间不应使用分号。因此，该程序无法编译。 在语法上需要将 `else` 放在 `if` 语句的右括号 `}` 之后的同一行中。

我已经通过在 `if` 语句的结束符号 `}` 之后移动 `else` 来重写程序，以防止自动分号插入。

```go
package main

import (
    "fmt"
)

func main() {
    num := 10
    if num%2 == 0 { // 检查数字是否是奇数
        fmt.Println("the number is even")
    } else {
        fmt.Println("the number is odd")
    }
}
```

[Run in playground](https://play.golang.org/p/hv_27vbIBC)

现在编译器会很高兴，我们也很高兴。

## Go 惯例

我们已经看到了各种 `if-else` 构造，并且实际上已经看到了编写同一程序的多种方法。例如，我们已经看到了编写程序的多种方法，该程序使用不同的 `if` 构造检查数字是偶数还是奇数。Go 中的惯用编码方式是哪一种？ 按照 Go 的哲学，最好避免不必要的分支和代码缩进。也可以理解为尽早返回。我已经从下面的上一节中提供了该程序，

```go
package main

import (
    "fmt"
)

func main() {
    if num := 10; num % 2 == 0 { // 检查数字是否是奇数
        fmt.Println(num,"is even")
    }  else {
        fmt.Println(num,"is odd")
    }
}
```

[Run in playground](https://play.golang.org/p/_X9q4MWr4s)

按照 Go 的哲学，编写上述程序的惯用方式是避免 `else` 并在条件为 `true` 时从 `if` 返回。

```go
package main

import (
    "fmt"
)

func main() {
    num := 10;
    if num%2 == 0 { // 检查数字是否是奇数
        fmt.Println(num, "is even")
        return
    }
    fmt.Println(num, "is odd")

}
```

[Run in playground](https://play.golang.org/p/N8A5tPLnVYr)

在上面的程序中，一旦我们发现数字是偶数，我们将立即返回。这样可以避免不必要的 `else` 代码分支。这是 Go 中完成工作的方式。每当编写 Go 程序时，请记住这一点。

> 原文地址 [If else statement](https://golangbot.com/if-statement/)
> 原文作者：[Naveen Ramanathan](https://golangbot.com/about/)
> 译文出自：[紫升翻译计划](https://youngjuning.js.org/categories/%E6%B4%9B%E7%AB%B9%E7%BF%BB%E8%AF%91%E8%AE%A1%E5%88%92/)
