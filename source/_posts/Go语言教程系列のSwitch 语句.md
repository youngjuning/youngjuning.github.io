---
title: Go 语言教程系列のSwitch 语句
date: 2023-03-19 15:10:00
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1679280067130.png
description: switch 是一个条件语句，它对表达式进行求值并将其与可能的匹配列表进行比较，并执行相应的代码块。可以将其视为替换复杂的 if 语句的惯用方式。
categories:
  - [Golang, Go 语言系列教程]
  - [紫竹翻译计划]
tags:
  - Golang
  - Go 语言教程
  - Go 语言教程系列
  - Golang Switch
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>


## switch 语句是什么？

`switch` 是一个条件语句，它对表达式进行求值并将其与可能的匹配列表进行比较，并执行相应的代码块。可以将其视为替换复杂的 `if` 语句的惯用方式。

## 示例

`Talk is cheap,show you the example`。让我们从一个简单的示例开始，该示例将一个手指编号作为输入并输出该手指的名称。 例如，1 是拇指，2 是食指，依此类推。

```go
package main

import (
    "fmt"
)

func main() {
    finger := 4
    fmt.Printf("Finger %d is ", finger)
    switch finger {
    case 1:
        fmt.Println("Thumb")
    case 2:
        fmt.Println("Index")
    case 3:
        fmt.Println("Middle")
    case 4:
        fmt.Println("Ring")
    case 5:
        fmt.Println("Pinky")

    }
}
```

[Run in playground](https://play.golang.org/p/94ktmJWlUom)

在上面第 10 行的程序 `switch finger` 中，将 `finger` 的值与每个 `case` 语句进行比较。从上到下判断条件，并执行与表达式匹配的第一个分支。 在这种情况下，`finger` 的值为 `4`，因此输出：

```sh
Finger 4 is Ring
```

## 不允许重复的分支

不允许重复使用具有相同常量值的分支。如果你尝试运行以下程序，则编译器将抛错 `./prog.go:19:7: duplicate case 4 in switch previous case at ./prog.go:17:7`。

```go
package main

import (
    "fmt"
)

func main() {
    finger := 4
    fmt.Printf("Finger %d is ", finger)
    switch finger {
    case 1:
        fmt.Println("Thumb")
    case 2:
        fmt.Println("Index")
    case 3:
        fmt.Println("Middle")
    case 4:
        fmt.Println("Ring")
    case 4: // 重复的分支
        fmt.Println("Another Ring")
    case 5:
        fmt.Println("Pinky")

    }
}
```

[Run in playground](https://play.golang.org/p/7qrmR0hdvHH)

## 默认分支

我们只有五个手指。如果输入不正确的手指编号会怎样？这时我们需要一个默认分支。当其他情况都不匹配时，将执行默认分支。

```go
package main

import (
    "fmt"
)

func main() {
    switch finger := 8; finger {
    case 1:
        fmt.Println("Thumb")
    case 2:
        fmt.Println("Index")
    case 3:
        fmt.Println("Middle")
    case 4:
        fmt.Println("Ring")
    case 5:
        fmt.Println("Pinky")
    default: // 默认分支
        fmt.Println("incorrect finger number")
    }
}
```

[Run in playground](https://play.golang.org/p/Fq7U7SkHe1)

在上面的程序中，`finger` 是 `8`，它与任何情况都不匹配，因此在默认情况下会打印 `incorrect finger number`。把 `default` 作为 `switch` 语句的最后一个分支是没有必要的。它可以存在于 `switch` 中的任何位置。

你可能还注意到 `finger` 声明中的微小变化。它在 `switch 语句中声明。 `switch` 可以包含在计算表达式之前执行的可选语句。在第 8 行中，首先声明 `finger`，然后在表达式中使用它。在这种情况下，`finger` 的范围仅限于 `switch` 模块。

## 多表达式分支

通过用逗号将多个表达式分隔开，可以包含多个表达式。

```go
package main

import (
    "fmt"
)

func main() {
    letter := "i"
    fmt.Printf("Letter %s is a ", letter)
    switch letter {
    case "a", "e", "i", "o", "u": // 分支中的多个表达式
        fmt.Println("vowel")
    default:
        fmt.Println("not a vowel")
    }
}
```

[Run in playground](https://play.golang.org/p/AAVSQK76Me7)

上面的程序判断 `letter` 是否是元音。第 11 行中的代码 `case "a", "e", "i", "o", "u":` 与任何元音匹配。由于 `i` 是元音，因此该程序会打印：

```sh
Letter i is a vowel
```

## 无表达式分支

switch 中的表达式是可选的，可以省略。如果省略该表达式，则认为该 `switch` 为 `switch true`，并且对每个 `case` 表达式进行求值，并执行相应的代码块。

```go
package main

import (
    "fmt"
)

func main() {
    num := 75
    switch { // 表达式被省略
    case num >= 0 && num <= 50:
        fmt.Printf("%d is greater than 0 and less than 50", num)
    case num >= 51 && num <= 100:
        fmt.Printf("%d is greater than 51 and less than 100", num)
    case num >= 101:
        fmt.Printf("%d is greater than 100", num)
    }

}
```

[Run in playground](https://play.golang.org/p/KPkwK0VdXII)

在上面的程序中，`switch` 中不存在表达式，因此将其视为真，并判断每种情况。 第12行的 `case num> = 51 && num <= 100:` 为 `true`，程序将打印：

```sh
75 is greater than 51 and less than 100
```

这种类型的 `switch` 可以看作是多个 `if else` 语句句的替代方法。

## Fallthrough

在 Go 中，在执行分支后，控制权立即从 `switch` 语句中释放出来。`fallthrough` 语句用于将控制权转移到该分支执行后立即出现的分支的第一条语句。

让我们编写一个程序来理解 `fallthrough`。我们的程序将检查输入的数字是否小于 50、100 或 200。例如，如果输入 75，则程序将打印 75 小于 100 和 200。我们将使用 `fallthrough` 来实现。

```go
package main

import (
    "fmt"
)

func number() int {
    num := 15 * 5
    return num
}

func main() {
    switch num := number(); { // num 不是一个常量
    case num < 50:
        fmt.Printf("%d is lesser than 50\n", num)
        fallthrough
    case num < 100:
        fmt.Printf("%d is lesser than 100\n", num)
        fallthrough
    case num < 200:
        fmt.Printf("%d is lesser than 200", num)
    }
}
```

[Run in playground](https://play.golang.org/p/svGJAiswQj)

`switch` 和 `case` 表达式只能是常量。它们也可以在运行时进行计算。 在上面的程序中，第 14 行的 `num` 被初始化为函数 `number()` 的返回值。控制权位于 `switch` 内部，并对分支进行判断。第 18 行中的 `case num <100:` 是正确的，程序将输出 `75 is lesser than 100`。下一条语句是 `fallthrough`。 当遇到 `fallthrough` 时，控制权将移至下一种情况的第一个语句，并打印 `75 is lesser than 200`。该程序的输出是：

```sh
75 is lesser than 100
75 is lesser than 200
```

`fallthrough` 应该是 `case` 中的最后一条语句。如果它位于中间的某个位置，则编译器将报错 `fallthrough statement out of place`。

## 即使分支被计算为假，也会发生 Fallthrough

当使用 `fallthrough` 时要考虑一些细微之处。即使分支被计算为假，也会发生 Fallthrough。

请考虑以下程序。

```go
package main

import (
    "fmt"
)

func main() {
    switch num := 25; {
    case num < 50:
        fmt.Printf("%d is lesser than 50\n", num)
        fallthrough
    case num > 100:
        fmt.Printf("%d is greater than 100\n", num)
    }
}
```

[Run in playground](https://play.golang.org/p/sjynQMXtnmY)

在上述程序中，`num` 为 25，小于 50，因此第 9 行的情况为 `true`。第 11 行出现 `fallthrough`。行号中的下一个case `case num> 100:`。由于 `num < 100`，所以 12 是假的。但是 `fallthrough` 不考虑这一点。即使分支被计算为假，也会发生 Fallthrough。

上面的程序将打印：

```sh
25 is lesser than 50
25 is greater than 100
```

因此，请确保你了解使用 `fallthrough` 时的操作。

还有一件事是，不能在 switch 的最后一种分支中下使用 `fallthrough`。 如果在最后一种情况下存在 `fallthrough`，则将导致以下编译错误。

```sh
cannot fallthrough final case in switch
```

## switch 中的 switch

可以使用 `break` 语句在 `switch` 完成之前提早终止它。 让我们将上面的示例修改为一个人为的示例，以了解 `break` 的工作原理。

让我们添加一个条件，如果 `num` 小于0，则 switch 应终止。

```go
package main

import (
    "fmt"
)

func main() {
    switch num := -5; {
    case num < 50:
        if num < 0 {
            break
        }
        fmt.Printf("%d is lesser than 50\n", num)
        fallthrough
    case num < 100:
        fmt.Printf("%d is lesser than 100\n", num)
        fallthrough
    case num < 200:
        fmt.Printf("%d is lesser than 200", num)
    }
}
```

[Run in playground](https://play.golang.org/p/UHwBXPYLv1B)

在上面的程序中，`num` 是 `-5`。当控件权到达第 10 行的 `if` 语句时，由于 `num <0`，因此满足条件。`break` 语句在 `switch` 完成之前终止了，并且程序不输出任何内容。

### 退出外部的循环

当 `switch case` 位于 `for` 循环内时，可能需要尽早终止 `for` 循环。 这可以通过标记 `for` 循环并使用 `switch` 语句内的该标记中断 `for` 循环来完成。让我们来看一个例子。

让我们编写一个程序来生成一个随机偶数。

我们将创建一个无限 `for` 循环，并使用 `switch` 条件来确定所生成的随机数是否为偶数。如果是偶数，将打印生成的数字，并使用其标签终止 `for` 循环。`rand` 包的 [`Intn`](https://golang.org/pkg/math/rand/#Rand.Intn) 函数用于生成非负伪随机数。

```go
package main

import (
    "fmt"
    "math/rand"
)

func main() {
randloop:
    for {
        switch i := rand.Intn(100); {
        case i%2 == 0:
            fmt.Printf("Generated even number %d", i)
            break randloop
        }
    }

}
```

[Run in playground](https://play.golang.org/p/0bLYOgs2TUk)

在上面的程序中，第 9 行中的 `for` 循环标记为 `randloop`。使用第 `11` 行的 `Intn` 函数在 0 到 99 之间生成一个随机数（不包括 100）。 如果生成的数字为偶数，则使用标签在第 14 行中断循环。

该程序打印：

```
Generated even number 18
```

请注意，如果使用不带标签的 `break` 语句，则将仅中断 `switch` 语句，循环将继续运行。因此，标记循环并在 `switch` 内部的 `break` 语句中使用它对于中断外部 for 循环是必要的。

> 原文地址 [Switch Statement](https://golangbot.com/switch/)
> 原文作者：[Naveen Ramanathan](https://golangbot.com/about/)
> 译文出自：[紫竹翻译计划](https://youngjuning.js.org/categories/%E6%B4%9B%E7%AB%B9%E7%BF%BB%E8%AF%91%E8%AE%A1%E5%88%92/)
