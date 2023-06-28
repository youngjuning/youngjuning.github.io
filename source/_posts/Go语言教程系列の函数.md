---
title: Go 语言教程系列の函数
date: 2023-03-19 15:06:00
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1679280067130.png
description: 函数是执行特定任务的代码块。一个函数接受一个输入，对该输入执行一些计算，然后生成一个输出。
categories:
  - [Golang, Go 语言系列教程]
  - [紫升翻译计划]
tags:
  - Golang
  - Go 语言教程
  - Go 语言教程系列
  - Golang 函数
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>


## 函数是什么？

函数是执行特定任务的代码块。一个函数接受一个输入，对该输入执行一些计算，然后生成一个输出。

## 函数声明

Go 语言声明一个函数的语法是：

```go
func functionname(parametername type) returntype {
 // 函数体
}
```

函数声明以关键字 `func` 开头，后跟 `functionname`。参数在函数 `(` 和 `)` 之间指定，然后跟着的是 函数的 `returntype`。指定参数的语法是参数名称后跟类型。可以指定任意数量的参数，例如 `(parameter1 type，parameter2 type)`。然后在 `{` 和 `}` 之间有一个代码块，它是函数的主体。

参数和返回类型在函数中是可选的。因此，以下语法也是有效的函数声明。

```go
func functionname() {
}
```

## 示例

让我们编写一个函数，该函数将单个产品的价格和产品数量作为输入参数，并通过将这两个值相乘来计算总价格并返回输出。

```go
func calculateBill(price int, no int) int {
    var totalPrice = price * no
    return totalPrice
}
```

上面的函数有两个输入参数 `int` 类型的 `price` 和 `no`，并返回 `price` 和 `no` 的乘积 ` totalPrice`。返回值也是 `int` 类型。

**如果连续参数具有相同的类型，我们可以不用重复书写该类型，事实上你只需要写一次就足够了。** 因此，上述功能可以重写为：

```go
func calculateBill(price, no int) int {
    var totalPrice = price * no
    return totalPrice
}
```

现在我们已经准备好一个函数，让我们从代码中的某个地方调用它。 调用函数的语法是 `functionname(parameters)`。现在我们可以使用代码来调用上述函数。

```go
calculateBill(10, 5)
```

这是使用上述函数并打印总价格的完整程序。

```go
package main

import (
    "fmt"
)

func calculateBill(price, no int) int {
    var totalPrice = price * no
    return totalPrice
}

func main() {
    price, no := 90, 6
    totalPrice := calculateBill(price, no)
    fmt.Println("Total price is", totalPrice)
}
```

[Run in playground](https://play.golang.org/p/FtjhPcx3ySa)

上面的程序将打印出以下内容：

```sh
Total price is 540
```

## 多个返回值

可以从一个函数返回多个值。让我们编写一个函数 `rectProps`，该函数接受矩形的 `length` 和 `width`，并返回矩形的 `area` 和 `perimeter`。矩形的面积是长度和宽度的乘积，周长是长度和宽度的总和的两倍。

```go
package main

import (
    "fmt"
)

func rectProps(length, width float64)(float64, float64) {
    var area = length * width
    var perimeter = (length + width) * 2
    return area, perimeter
}

func main() {
    area, perimeter := rectProps(10.8, 5.6)
    fmt.Printf("Area %f Perimeter %f", area, perimeter)
}
```

[Run in playground](https://play.golang.org/p/qAftE_yke_)

如果一个函数返回多个返回值，那么必须在 `(` 和 `)` 之间指定它们的类型。 `func rectProps(length, width float64)(float64,float64)` 具有两个`float64` 参数 `length` 和 `width`，并且还返回两个 `float64` 值。上面的程序会打印出：

```sh
Area 60.480000 Perimeter 32.800000
```

## 命名返回值

可以从函数返回命名值。如果已命名返回值，则可以将其视为在函数的第一行中声明为变量。

上面的 `rectProps` 函数可以使用命名的返回值重写为

```go
func rectProps(length, width float64)(area, perimeter float64) {
    area = length * width
    perimeter = (length + width) * 2
    return // 无需明确指定返回值
}
```

`area` 和 `perimeter ` 是上述函数中的命名返回值。请注意，函数中的`return` 语句不会显式返回任何值。由于在函数声明中将 `area` 和 ` perimeter` 指定为返回值，因此当遇到 `return` 语句时，它们会自动从函数中返回。

## 空白标识符

`_` 是 Go 语言中的空白标识符。它可以代替任何类型的任何值。让我们看看这个空白标识符的用途。

`rectProps` 函数返回矩形的面积和周长。如果我们只需要 `area` 而想要丢弃 `perimeter`，该怎么办。这时  `_` 就可以派上用场。

下面的程序仅使用从 `rectProps` 函数返回的 `area`。

```go
package main

import (
    "fmt"
)

func rectProps(length, width float64) (float64, float64) {
    var area = length * width
    var perimeter = (length + width) * 2
    return area, perimeter
}
func main() {
    area, _ := rectProps(10.8, 5.6) // perimeter 被丢弃
    fmt.Printf("Area %f ", area)
}
```

[Run in playground](https://play.golang.org/p/IkugSH1jIt)

在第 13 行中，我们仅使用 `area`，而使用 `_` 标识符来丢弃 `perimeter`。

> 原文地址 [Functions](https://golangbot.com/functions/)
> 原文作者：[Naveen Ramanathan](https://golangbot.com/about/)
> 译文出自：[紫升翻译计划](https://youngjuning.js.org/categories/%E6%B4%9B%E7%AB%B9%E7%BF%BB%E8%AF%91%E8%AE%A1%E5%88%92/)
