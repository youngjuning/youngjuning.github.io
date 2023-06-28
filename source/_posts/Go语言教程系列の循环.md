---
title: Go 语言教程系列の循环
date: 2023-03-19 15:09:00
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1679280067130.png
description: Go 循环语句用于重复执行代码块。
categories:
  - [Golang, Go 语言系列教程]
  - [紫竹翻译计划]
tags:
  - Golang
  - Go 语言教程
  - Go 语言教程系列
  - Golang Loop
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>


循环语句用于重复执行代码块。

`for` 是 Go 中唯一可用的循环。Go 没有在其他语言（例如 C）中存在的`while` 或 `do while` 循环。

## for 循环语法

```go
for initialisation; condition; post {
}
```

初始化语句将仅执行一次。循环初始化后，将检查条件。如果条件的计算结果为 `true`，则将执行 `{` `}` 内部的循环主体，然后执行 post 语句。 每次循环成功迭代后，将执行 post 语句。执行 post 语句后，将重新检查条件。如果为 `true`，则循环将继续执行，否则 `for` 循环终止。

Go 中的 for 循环的三个部分，即初始化，条件和发布都是可选的。让我们看一个示例，以更好地理解循环。

## 示例

让我们编写一个程序，该程序使用 `for` 循环打印从 1 到 10 的所有数字。

```go
package main

import (
    "fmt"
)

func main() {
    for i := 1; i <= 10; i++ {
        fmt.Printf(" %d",i)
    }
}
```

[Run in playground](https://play.golang.org/p/mV6Zgcx2DY)

在上面的程序中，`i` 被初始化为 1。条件语句将检查 `i <= 10`。如果条件为真，则输出 `i` 的值，否则循环终止。在每次迭代结束时，post 语句将 `i` 递增 1。一旦 `i` 大于 10，则循环终止。

上面的程序将打印 `1 2 3 4 5 6 7 8 9 10`

在 for 循环中声明的变量仅在循环范围内可用。因此，无法在主体外部进行循环访问 `i`。

## break

`break` 语句用于在完成正常执行之前突然终止 `for` 循环，并将控制权移至 `for` 循环之后的代码行。

让我们编写一个使用 `break` 打印从 1 到 5 的数字的程序。

```go
package main

import (
    "fmt"
)

func main() {
    for i := 1; i <= 10; i++ {
        if i > 5 {
            break // 如果 i 大于 5，循环将终止
        }
        fmt.Printf("%d ", i)
    }
    fmt.Printf("\nline after for loop")
}
```

[Run in playground](https://play.golang.org/p/sujKy92f--)

在上面的程序中，在每次迭代过程中都会检查 `i` 值。如果 `i` 大于 5，则执行 `break` 并终止循环。然后在 `for` 循环之后执行 `print` 语句。上面的程序将输出：

```sh
1 2 3 4 5
line after for loop
```

## continue

`continue` 语句用于跳过 `for` 循环的当前迭代。在 `continue` 语句之后的 `for` 循环中存在的所有代码将不会针对当前迭代执行。循环将继续进行下一个迭代。

让我们编写一个程序，使用 `continue` 打印从 `1` 到 `10` 的所有奇数。

```go
package main

import (
    "fmt"
)

func main() {
    for i := 1; i <= 10; i++ {
        if i%2 == 0 {
            continue
        }
        fmt.Printf("%d ", i)
    }
}
```

[Run in playground](https://play.golang.org/p/DRLN2ZHwVS)

在上面的程序中，`if i％2 == 0` 行检查将 `i` 除以 `2` 的提示是否为 0。如果为零，则数字为偶数，并执行 `continue` 语句，并且控制移至 循环的下一次迭代。 因此，`continue` 之后的 `print` 语句将不会被调用，并且循环会进行到下一个迭代。上面程序的输出是 `1 3 5 7 9`。

## 嵌套循环

一个内部有另一个 `for` 循环的 `for` 循环称为嵌套 `for` 循环。让我们通过编写一个打印以下序列的程序来了解嵌套的 `for` 循环。

```sh
*
**
***
****
*****
```

下面的程序使用嵌套的 `for` 循环来打印序列。第 8 行中的变量 `n` 存储序列中的行数。在我们的例子中是 5。外部 `for` 循环将 `i` 从 `0` 迭代到 `4`，内部 `for` 循环将 `j` 从 `0` 迭代到 `i` 的当前值。 内循环为每次迭代打印“ \*”，而外循环在每次迭代结束时打印新行。 运行该程序，你会看到序列打印为输出。

```go
package main

import (
    "fmt"
)

func main() {
    n := 5
    for i := 0; i < n; i++ {
        for j := 0; j <= i; j++ {
            fmt.Print("*")
        }
        fmt.Println()
    }
}
```

[Run in playground](https://play.golang.org/p/0rq8fWjVDLb)

## 标签

标签可用于从内部 `for` 循环中断外部循环。让我们通过一个简单的例子来理解我的意思。

```go
package main

import (
    "fmt"
)

func main() {
    for i := 0; i < 3; i++ {
        for j := 1; j < 4; j++ {
            fmt.Printf("i = %d , j = %d\n", i, j)
        }

    }
}
```

[Run in playground](https://play.golang.org/p/BnCKho2x5hM)

上面的程序是不言自明的，它将打印：

```sh
i = 0 , j = 1
i = 0 , j = 2
i = 0 , j = 3
i = 1 , j = 1
i = 1 , j = 2
i = 1 , j = 3
i = 2 , j = 1
i = 2 , j = 2
i = 2 , j = 3
```

这没有什么特殊的！

如果我们想在 `i` 和 `j` 相等时停止打印该怎么办。为此，我们需要退出外部 `for` 循环。 当 `i` 和 `j` 相等时，在内部 `for` 循环中添加 `break` 只会退出内部 `for` 循环。

```go
package main

import (
    "fmt"
)

func main() {
    for i := 0; i < 3; i++ {
        for j := 1; j < 4; j++ {
            fmt.Printf("i = %d , j = %d\n", i, j)
            if i == j {
                break
            }
        }

    }
}
```

[Run in playground](https://play.golang.org/p/uMjbF8Ii41d)

在上面的程序中，当第 10 行的 `i` 和 `j` 相等时，我在内部的 `for` 循环中添加了一个 `break`。这只会退出内部 `for` 循环，而外部循环将继续执行。该程序将打印：

```sh
i = 0 , j = 1
i = 0 , j = 2
i = 0 , j = 3
i = 1 , j = 1
i = 2 , j = 1
i = 2 , j = 2
```

这不是预期的输出。当 `i` 和 `j` 相等时，即当它们等于 `1` 时，我们需要停止打印。标签可用于从外部循环中断开。让我们使用标签重写上面的程序：

```go
package main

import (
    "fmt"
)

func main() {
outer:
    for i := 0; i < 3; i++ {
        for j := 1; j < 4; j++ {
            fmt.Printf("i = %d , j = %d\n", i, j)
            if i == j {
                break outer
            }
        }

    }
}
```

[Run in playground](https://play.golang.org/p/BI10Rmp_Z3y)

在上面的程序中，我们在外部 `for` 循环的第 8 行中添加了标签 `outer`，在第 13 行中，通过指定标签来中断外部 `for` 循环。当 `i` 和 `j` 相等时，该程序将停止打印。该程序将输出：

```sh
i = 0 , j = 1
i = 0 , j = 2
i = 0 , j = 3
i = 1 , j = 1
```

## 更多示例

让我们写更多的代码来覆盖 `for` 循环的所有变体。下面的程序打印从 0 到 10 的所有偶数。

```go
package main

import (
    "fmt"
)

func main() {
    i := 0
    for ;i <= 10; { // initialisation and post 被省略
        fmt.Printf("%d ", i)
        i += 2
    }
}
```

[Run in playground](https://play.golang.org/p/PNXliGINku)

我们已经知道 `for` 循环的所有三个部分，即 `initialisation`、`condition` 和 `post` 都是可选的。在上述程序中，省略了`initialisation` 和 `post`。在 `for` 循环外，`i` 被初始化为 `0`。只要 `i <= 10`，循环就会执行。我在 `for` 循环内增加了 `2`。上面的程序输出 `0 2 4 6 8 10`。

也可以省略上述程序的 `for` 循环中的分号。可以将这种格式视为 `while` 循环的替代方法。上面的程序可以改写为：

```go
package main

import (
    "fmt"
)

func main() {
    i := 0
    for i <= 10 { // 分号被省略，只剩下条件语句
        fmt.Printf("%d ", i)
        i += 2
    }
}
```

[Run in playground](https://play.golang.org/p/UYiz-Wtnoj)

可以在 `for` 循环中声明多个变量并对其进行操作。让我们编写一个使用多个变量声明打印以下序列的程序。

```
10 * 1 = 10
11 * 2 = 22
12 * 3 = 36
13 * 4 = 52
14 * 5 = 70
15 * 6 = 90
16 * 7 = 112
17 * 8 = 136
18 * 9 = 162
19 * 10 = 190
```

```go
package main

import (
    "fmt"
)

func main() {
    for no, i := 10, 1; i <= 10 && no <= 19; i, no = i+1, no+1 {
        fmt.Printf("%d * %d = %d\n", no, i, no*i)
    }
}
```

[Run in playground](https://play.golang.org/p/e7Pf0UDjj0)

在上面的程序中，`no` 和 `i` 被声明并分别初始化为 10 和 1。在每次迭代结束时，它们将增加 1。布尔运算符 `&&` 用于确保 `i` 小于或等于 10 以及 `no` 小于或等于 19 的条件成立。

## 无限循环

创建无限循环的语法是：

```go
for {
}
```

以下程序将持续打印 `Hello World`，而不会终止。

```go
package main

import "fmt"

func main() {
    for {
        fmt.Println("Hello World")
    }
}
```

如果尝试在 [go park](https://play.golang.org/p/kYQZw1AWT4) 中运行上述程序，则会收到错误消息 `process took too long`。请尝试在你的本地系统中运行它以无限打印 `Hello World`。

还有一个范围 **range**可以在 `for` 循环中用于数组操作。当我们在后续教程中了解数组时，我们将进行介绍。

> 原文地址 [loops](https://golangbot.com/loops/)
> 原文作者：[Naveen Ramanathan](https://golangbot.com/about/)
> 译文出自：[紫竹翻译计划](https://youngjuning.js.org/categories/%E6%B4%9B%E7%AB%B9%E7%BF%BB%E8%AF%91%E8%AE%A1%E5%88%92/)
