---
title: Go 语言系列教程の参数可变的函数
date: 2023-03-19 15:12:00
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1679280067130.png
description: 一般来说，函数只接受固定数量的参数。参数可变的函数是一个接受可变参数的函数。如果一个函数定义的最后一个参数前面有省略号 ...，那么该函数可以接受该参数的任何数量的参数。
categories:
  - [Golang, Go 语言系列教程]
  - [洛竹翻译计划]
tags:
  - Golang
  - Go 语言系列教程
  - 洛竹翻译计划
  - Go 参数可变的函数
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>


## 什么是参数可变的函数？

一般来说，函数只接受固定数量的参数。参数可变的函数是一个接受可变参数的函数。如果一个函数定义的最后一个参数前面有省略号 **...**，那么该函数可以接受该参数的任何数量的参数。

**只有一个函数的最后一个参数可以是可变的。我们将在本教程的下一节中了解为什么是这样的情况。**

## 语法

```go
func hello(a int, b ...int) {
}
```

在上面的函数中，参数 `b` 是可变的，因为它的前缀是省略号，它可以接受任何数量的参数。这个函数可以通过使用语法来调用。

```go
hello(1, 2) // 将一个参数 `2` 传递给 b
hello(5, 6, 7, 8, 9) // 将参数 6、7、8 和 9 传递给 b
```

在上面的代码中，我们调用 `hello`，参数 `b` 是一个参数 `2`。1 中，我们调用 `hello`，参数 `b` 是一个参数 `2`，我们在下一行向 `b` 传递四个参数 `6, 7, 8, 9`。

也可以向一个变量函数传递零参数。

```go
hello(1)
```

在上面的代码中，我们调用 `hello` 时，`b` 的参数为零。这是很好的。

现在我想你已经明白了为什么变量参数应该只在最后一个。

让我们试着让 `hello` 函数的第一个参数变成变量。

语法将是这样的

```go
func hello(b ...int, a int) {
}
```

在上面的函数中，不可能向参数 `a` 传递参数，因为无论我们传递什么参数，都会被分配给第一个参数 `b`，因为它是变元的。因此，变量参数只能出现在函数定义的最后。上述函数将无法编译，错误为 `syntax error: cannot use ... with non-final parameter b`。

## 例子和了解变量函数的工作原理

让我们来创建我们自己的变量函数。我们将编写一个简单的程序来查找输入的整数列表中是否存在一个整数。

```go
package main

import (
    "fmt"
)

func find(num int, nums ...int) {
    fmt.Printf("type of nums is %T\n", nums)
    found := false
    for i, v := range nums {
        if v == num {
            fmt.Println(num, "found at index", i, "in", nums)
            found = true
        }
    }
    if !found {
        fmt.Println(num, "not found in ", nums)
    }
    fmt.Printf("\n")
}
func main() {
    find(89, 89, 90, 95)
    find(45, 56, 67, 45, 90, 109)
    find(78, 38, 56, 98)
    find(87)
}
```

[Run in playground](<https://play.golang.org/p/7occymiS6s >)

在上面的程序中，`func find(num int, nums ...int)` 接受参数 `nums` 的数量不定。在函数 _find_ 中，`nums` 的类型是 `[]int`，即一个整数切片。

变量函数的工作方式是将变量参数的数量转换为变量参数的类型的切片。例如，在上面程序的中，`find` 函数的变量参数数是 89、90、95。查找函数期望一个变量 `int` 参数。因此，这三个参数将被编译器转换为 `int` 类型的切片 `[]int{89, 90, 95}`，然后它将被传递给 `find` 函数。

`for` 的循环是在 `f` 的基础上进行的。`for` 循环在 `nums` 切片上运行，如果 `num` 存在于切片中，则打印出它的位置。如果没有，则打印出没有找到这个数字。

上述程序的输出。

```sh
type of nums is []int
89 found at index 0 in [89 90 95]

type of nums is []int
45 found at index 2 in [56 67 45 90 109]

type of nums is []int
78 not found in  [38 56 98]

type of nums is []int
87 not found in  []
```

在上述程序中，`find` 函数的调用只有一个参数。我们没有向变量 `nums ...int` 参数传递任何参数。正如前面所讨论的，这是完全合法的，在这种情况下，`nums` 将是一个长度和容量为 0 的 `nil` 切片。

## 切片参数 vs 可变参数

我们现在肯定应该有一个问题在你的脑海中徘徊。在上一节中，我们了解到函数的变量参数实际上是转换了一个切片。那么，既然我们可以用切片实现同样的功能，为什么还要用变量函数呢？我在下面用切片重写了上面的程序。

```go
package main

import (
    "fmt"
)

func find(num int, nums []int) {
    fmt.Printf("type of nums is %T\n", nums)
    found := false
    for i, v := range nums {
        if v == num {
            fmt.Println(num, "found at index", i, "in", nums)
            found = true
        }
    }
    if !found {
        fmt.Println(num, "not found in ", nums)
    }
    fmt.Printf("\n")
}
func main() {
    find(89, []int{89, 90, 95})
    find(45, []int{56, 67, 45, 90, 109})
    find(78, []int{38, 56, 98})
    find(87, []int{})
}
```

[Run in playground](<https://play.golang.org/p/rG-XRL3yycJ >)

以下是使用可变参数而不是切片的优点。

1.  不需要在每次函数调用时创建一个片断。如果你看一下上面的程序，我们在每次函数调用时创建了新的分片。当使用变量函数时，可以避免这种额外的片断创建。
2.  在上述程序中，我们创建了一个空的切片，以满足 `find` 函数的签名。在参数可变函数的情况下，这完全没有必要。当使用变量函数时，这一行可以直接用 `find(87)`。
3.  我个人认为，有变量函数的程序比有切片的程序更具可读性 :)

## Append 是一个变量函数

你有没有想过，标准库中的 append 函数是如何将数值追加到一个切片中的，它可以接受任何数量的参数。这是因为它是一个变量函数。

```go
func append(slice []Type, elems ...Type) []Type
```

以上是 `append` 函数的定义。在这个定义中，`elems` 是一个变量参数。因此 append 可以接受不同数量的参数。

## 将一个切片传递给一个参数可变的函数

让我们把一个切片传递给一个变量函数，并从下面的例子中找出会发生什么。

```go
package main

import (
    "fmt"
)

func find(num int, nums ...int) {
    fmt.Printf("type of nums is %T\n", nums)
    found := false
    for i, v := range nums {
        if v == num {
            fmt.Println(num, "found at index", i, "in", nums)
            found = true
        }
    }
    if !found {
        fmt.Println(num, "not found in ", nums)
    }
    fmt.Printf("\n")
}
func main() {
    nums := []int{89, 90, 95}
    find(89, nums)
}
```

[Run in playground](https://play.golang.org/p/A-DNilpH2L)

我们将一个切片传递给一个期望有可变数量参数的函数。

这是不可行的。上述程序将失败，编译错误为 `./prog.go:23:10: cannot use nums (type []int) as type int in argument to find`。

为什么会出现这种情况呢？嗯，这是很直接的问题。下面提供了 `find` 函数的签名。

```go
func find(num int, nums ...int)
```

根据变量函数的定义，`nums ...int`意味着它将接受可变数量的`int`类型的参数。

在上面程序中，`nums` 是 `[]int` 切片，被传递给 `find` 函数，该函数期待一个变量 `int` 参数。正如我们已经讨论过的，这些变量参数将被转换为 `int` 类型的切片，因为 `find` 期待变量 `int` 参数。在这种情况下，`nums` 已经是一个 `[]int` 分片，编译器试图创建一个新的 `[]int`，也就是说，编译器试图做到:

```go
find(89, []int{nums})
```

这将会失败，因为 `nums` 是一个 `[]int` 而不是一个 `int`。

那么有没有一种方法可以将一个切片传递给一个变量函数呢？答案是肯定的。

有一个语法糖可以用来传递一个分片到变量函数中。你必须用省略号 `...` 作为切片的后缀，如果这样做了，切片就会直接传递给函数，而不需要创建新的切片。

在上面的程序中，如果你把 `find(89, nums)` 替换为 `find(89, nums...)`，程序将被编译并打印出以下输出。

```
type of nums is []int
89 found at index 0 in [89 90 95]
```

以下是完整的方案供您参考。

```go
package main

import (
    "fmt"
)

func find(num int, nums ...int) {
    fmt.Printf("type of nums is %T\n", nums)
    found := false
    for i, v := range nums {
        if v == num {
            fmt.Println(num, "found at index", i, "in", nums)
            found = true
        }
    }
    if !found {
        fmt.Println(num, "not found in ", nums)
    }
    fmt.Printf("\n")
}
func main() {
    nums := []int{89, 90, 95}
    find(89, nums...)
}
```

[Run in playground](https://play.golang.org/p/IvzwhzhFsT)

### 明白了吗？

只要确保你知道当你在一个参数可变的函数内修改一个切片时你在做什么。

让我们看一个简单的例子。

```go
package main

import (
    "fmt"
)

func change(s ...string) {
    s[0] = "Go"
}

func main() {
    welcome := []string{"hello", "world"}
    change(welcome...)
    fmt.Println(welcome)
}
```

[Run in playground](https://play.golang.org/p/R0GsuW7rdd)

你认为上述程序的输出会是什么？如果你认为会是 `[Go world]`，恭喜你！你已经理解了参数可变的函数和切片。如果你弄错了，也没什么大不了的，让我解释一下我们是如何得到这个输出的。

在上面程序中，我们使用了语法糖 `...`，并将切片作为变量参数传递给`change` 函数。

正如我们已经讨论过的，如果使用 `...`，`welcome` 切片本身将作为一个参数被传递，而不会创建一个新的切片。因此 `welcome` 将作为参数传递给 `change` 函数。

在 `change` 函数中，分片的第一个元素被改变为 `Go`。因此，这个程序输出

```
[Go world]
```

这里还有一个了解参数可变的函数的程序。

```go
package main

import (
    "fmt"
)

func change(s ...string) {
    s[0] = "Go"
    s = append(s, "playground")
    fmt.Println(s)
}

func main() {
    welcome := []string{"hello", "world"}
    change(welcome...)
    fmt.Println(welcome)
}
```

[Run in playground](https://play.golang.org/p/WdbFIkdLoe)

我想把它作为一个练习，让你弄清楚上述程序是如何工作的

参数可变的函数就介绍到这里。谢谢你的阅读。请留下您宝贵的反馈和意见。祝你有个愉快的一天。

> 原文地址 [Variadic Functions](https://golangbot.com/variadic-functions/)
> 原文作者：[Naveen Ramanathan](https://golangbot.com/about/)
> 译文出自：[洛竹翻译计划](https://youngjuning.js.org/categories/%E6%B4%9B%E7%AB%B9%E7%BF%BB%E8%AF%91%E8%AE%A1%E5%88%92/)
