---
title: Go 语言系列教程の数组
date: 2023-03-19 15:11:00
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1679280067130.png
description: 数组是属于同一类型的元素的集合。 例如，整数 5、8、9、79、76 的集合构成一个数组。 Go 中不允许混合不同类型的值，例如同时包含字符串和整数的数组。
categories:
  - [Golang, Go 语言系列教程]
  - [洛竹翻译计划]
tags:
  - Golang
  - Go 语言系列教程
  - 洛竹翻译计划
  - Go 数组
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

数组是属于同一类型的元素的集合。 例如，整数 5、8、9、79、76 的集合构成一个数组。 Go 中不允许混合不同类型的值，例如同时包含字符串和整数的数组。

## 数组声明

数组属于类型 `[n]T`。 `n` 表示数组中元素的数量，`T` 表示每个元素的类型。 元素的数量 `n` 也是类型的一部分（我们将在稍后更详细地讨论这一点。）

声明数组有不同的方法。 让我们一一看看它们。

```go
package main

import (
    "fmt"
)

func main() {
    var a [3]int // 长度为 3 的数组
    fmt.Println(a)
}
```

[Run in playground](https://play.golang.org/p/Zvgh82u0ej)

`var a[3]int` 声明了一个长度为 3 的整数数组。数组中的所有元素都会自动分配数组类型的零值。 在这种情况下，`a` 是一个整数数组，因此 `a` 的所有元素都分配给 `0`，即 int 的零值。 运行上面的程序会打印

```
[0 0 0]
```

数组的索引从 `0` 开始，到 `length - 1` 结束。 让我们为上面的数组分配一些值。

```go
package main

import (
    "fmt"
)


func main() {
    var a [3]int // 长度为 3 的 int 数组
    a[0] = 12 // 数组索引从 0 开始
    a[1] = 78
    a[2] = 50
    fmt.Println(a)
}
```

[Run in playground](https://play.golang.org/p/WF0Uj8sv39)

a[0] 为数组的第一个元素赋值。 该程序将打印

```
[12 78 50]
```

让我们使用 **短声明** 来创建相同的数组。

```go
package main

import (
    "fmt"
)

func main() {
    a := [3]int{12, 78, 50} // 创建数组的短声明
    fmt.Println(a)
}
```

[Run in playground](https://play.golang.org/p/NKOV04zgI6)

上面的程序将打印相同的输出

```
[12 78 50]
```

使用短声明时，不必为数组中的所有元素分配一个值。

```go
package main

import (
    "fmt"
)

func main() {
    a := [3]int{12}
    fmt.Println(a)
}
```

[Run in playground](https://play.golang.org/p/AdPH0kXRly)

在上面的程序中，`a := [3]int{12}` 声明了一个长度为 3 的数组，但只提供了一个值 `12`。 其余 2 个元素自动分配为 `0`。 该程序将打印

```
[12 0 0]
```

你甚至可以忽略声明中数组的长度，并用 `...` 替换它，让编译器自动计算长度。 代码实现如下。

```go
package main

import (
    "fmt"
)

func main() {
    a := [...]int{12, 78, 50} // ... 让编译器决定数组长度
    fmt.Println(a)
}
```

[Run in playground](https://play.golang.org/p/_fVmr6KGDh)

**数组的大小是类型的一部分。** 因此 `[5]int` 和 `[25]int` 是不同的类型。 因此，无法调整数组大小。 不要担心这个限制，因为可以使用 `切片` 来突破这个限制。

```go
package main

func main() {
    a := [3]int{5, 78, 8}
    var b [5]int
    b = a // 不可能成立，因为 `[3]int` 和 `[5]int` 是不同的类型
}
```

[Run in playground](https://play.golang.org/p/kBdot3pXSB)

在上面的程序中，我们试图将类型为 `[3]int` 的变量分配给类型为 `[5]int` 的变量，这是不允许的，因此编译器将打印以下错误

```
./prog.go:6:7: cannot use a (type [3]int) as type [5]int in assignment
```

## 数组是值类型

Go 中的数组是值类型而不是引用类型。 这意味着当它们被分配给一个新变量时，原始数组的副本被分配给新变量。 如果对新变量进行了更改，它将不会反映在原始数组中。

```go
package main

import "fmt"

func main() {
    a := [...]string{"USA", "China", "India", "Germany", "France"}
    b := a // a 的副本被分配给 b
    b[0] = "Singapore" // b 的第一个元素被改变为 Singapore，这不会影响到 a
    fmt.Println("a is ", a)
    fmt.Println("b is ", b)
}
```

[Run in playground](https://play.golang.org/p/-ncGk1mqPd)

程序会打印出：

```
a is [USA China India Germany France]
b is [Singapore China India Germany France]
```

同样，当数组作为参数传递给函数时，它们是按值传递的，原始数组不变。

```go
package main

import "fmt"

func changeLocal(num [5]int) {
    num[0] = 55
    fmt.Println("inside function ", num)

}
func main() {
    num := [...]int{5, 6, 7, 8, 8}
    fmt.Println("before passing to function ", num)
    changeLocal(num) // num 是按值传递的，因此不会因为函数调用而改变
    fmt.Println("after passing to function ", num)
}
```

[Run in playground](https://play.golang.org/p/e3U75Q8eUZ)

该程序将打印：

```
before passing to function  [5 6 7 8 8]
inside function  [55 6 7 8 8]
after passing to function  [5 6 7 8 8]
```

## 数组长度

数组的长度是通过将数组作为参数传递给 `len` 函数来得到的。

```go
package main

import "fmt"

func main() {
    a := [...]float64{67.7, 89.8, 21, 78}
    fmt.Println("length of a is",len(a))
}
```

[Run in playground](https://play.golang.org/p/UrIeNlS0RN)

上面的程序会打印出

```
length of a is 4
```

### 使用 range 迭代数组

`for` 循环可用于迭代数组的元素。

```go
package main

import "fmt"

func main() {
    a := [...]float64{67.7, 89.8, 21, 78}
    for i := 0; i < len(a); i++ { // 从 0 循环到数组的长度
        fmt.Printf("%d th element of a is %.2f\n", i, a[i])
    }
}
```

[Run in playground](https://play.golang.org/p/80ejSTACO6)

上面的程序使用一个 `for` 循环来迭代数组的元素，从索引 `0` 到 `length of the array - 1`。 这个程序可以工作并且会打印

```
0 th element of a is 67.70
1 th element of a is 89.80
2 th element of a is 21.00
3 th element of a is 78.00
```

Go 通过使用 `for` 循环的 **range** 形式提供了一种更好、更简洁的方法来迭代数组。 `range` 返回索引和该索引处的值。 让我们使用 `range` 重写上面的代码。 我们还将找到数组所有元素的总和。

```go
package main

import "fmt"

func main() {
    a := [...]float64{67.7, 89.8, 21, 78}
    sum := float64(0)
    for i, v := range a { // range 同时返回索引和值
        fmt.Printf("%d the element of a is %.2f\n", i, v)
        sum += v
    }
    fmt.Println("\nsum of all elements of a",sum)
}
```

[Run in playground](https://play.golang.org/p/Ji6FRon36m)

我们打印值并计算数组 `a` 的所有元素的总和。 程序的**输出**是，

```
0 the element of a is 67.70
1 the element of a is 89.80
2 the element of a is 21.00
3 the element of a is 78.00

sum of all elements of a 256.5
```

如果你只想要该值而想要忽略索引，您可以通过用 `_` 空白标识符替换索引来实现。

```go
for _, v := range a { // 忽略索引
}
```

上面的 for 循环忽略了索引。 同样，值也可以忽略。

### 多维数组

到目前为止我们创建的数组都是一维的。我们可以创建多维数组。

```go
package main

import (
    "fmt"
)

func printarray(a [3][2]string) {
    for _, v1 := range a {
        for _, v2 := range v1 {
            fmt.Printf("%s ", v2)
        }
        fmt.Printf("\n")
    }
}

func main() {
    a := [3][2]string{
        {"lion", "tiger"},
        {"cat", "dog"},
        {"pigeon", "peacock"}, // 这个逗号是必须的。 如果省略这个逗号，编译器会报错
    }
    printarray(a)
    var b [3][2]string
    b[0][0] = "apple"
    b[0][1] = "samsung"
    b[1][0] = "microsoft"
    b[1][1] = "google"
    b[2][0] = "AT&T"
    b[2][1] = "T-Mobile"
    fmt.Printf("\n")
    printarray(b)
}
```

[Run in playground](https://play.golang.org/p/InchXI4yY8)

上面的程序会打印：

```
lion tiger
cat dog
pigeon peacock

apple samsung
microsoft google
AT&T T-Mobile
```

这就是数组。 尽管数组似乎足够灵活，但它们具有固定长度的限制。 无法增加数组的长度。而这正是 **切片** 擅长的。 事实上，在 Go 中，切片比传统数组更常见。

## 结语

关注公众号`洛竹早茶馆`，一个持续分享编程知识的地方。

- `点赞`等于学会，`在看`等于精通
- 最后祝大家 2021 学习进步，升职加薪

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9752661d5474d8f8f4ae2584c288ac9~tplv-k3u1fbpfcp-zoom-1.image)

> 原文地址 [Arrays and Slices](https://golangbot.com/arrays-and-slices/)
> 原文作者：[Naveen Ramanathan](https://golangbot.com/about/)
> 译文出自：[洛竹翻译计划](https://youngjuning.js.org/categories/%E6%B4%9B%E7%AB%B9%E7%BF%BB%E8%AF%91%E8%AE%A1%E5%88%92/)
