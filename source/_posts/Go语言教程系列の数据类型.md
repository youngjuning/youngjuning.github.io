---
title: Go 语言教程系列の数据类型
date: 2023-03-19 15:04:00
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1679280067130.png
description: 本文介绍了 Go 的数据类型。
categories:
  - [Golang, Go 语言系列教程]
  - [洛竹翻译计划]
tags:
  - Golang
  - Go 语言教程
  - Go 语言教程系列
  - Go 数据类型
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>


下面是 Go 语言中可用的基础类型：

- bool
- Numeric Types
- int8, int16, int32, int64, int
- uint8, uint16, uint32, uint64, uint
- float32, float64
- complex64, complex128
- byte
- rune
- string

## bool

`bool` 表示 `boolean` 类型，用来表达 `true` 或 `false` 的。

> 生存还是毁灭，这是一个问题！

```go
package main

import "fmt"

func main() {
    a := true
    b := false
    fmt.Println("a:", a, "b:", b)
    c := a && b
    fmt.Println("c:", c)
    d := a || b
    fmt.Println("d:", d)
}
```

[Run in playground](https://play.golang.org/p/v_W3HQ0MdY)

上面的程序中，变量`a` 被分配了 `true`，变量`b` 被分配了 `false`。`c` 被分配了 `a && b` 表达式的值。当 `a` 和 `b` 的值都为 `true` 时 `&&` 操作符返回 `true`。因此上面的变量 `c` 的值是 `false`。

当 `a` 或 `b` 的值为 `true` 时，`||` 操作符返回 `true`。在这个例子中，因为 `a` 的值是 `true`，所以变量 `d` 的值是 `true`。上面的程序执行后会输出以下内容：

```sh
a: true b: false
c: false
d: true
```

## 有符号整形

- **int8**：表示 8 位有符号整数
  - **size**：8 位
  - **range**：-128 到 127
- **int16**：表示 16 位有符号整数
  - **size**：16  位
  - **range**：-32768 到 32767
- **int32**：表示 32 位有符号整数
  - **size**：32 位
  - **range**：-2147483648 到 2147483647
- **int64**：表示 64 位有符号整数
  - **size**：64 位
  - **range**：-9223372036854775808 到 9223372036854775807
- **int**：代表 32 或 64 位整数，具体取决于基础平台。除非需要使用特定大小的整数，否则通常应该使用 `int` 表示整数。
  - **size**：32 位操作系统中是 32 位，64 位操作系统中是 64 位。
  - **range**：32 位操作系统中是 -2147483648 到 2147483647，64 位操作系统中是 -9223372036854775808 到 9223372036854775807

```go
package main

import "fmt"

func main() {
    var a int = 89
    b := 95
    fmt.Println("value of a is", a, "and b is", b)
}
```

[Run in playground](https://play.golang.org/p/NyDPsjkma3)

上面的程序会输出 `value of a is 89 and b is 95`。

在上面的程序中，`a` 是 `int` 类型，`b` 的类型是从分配给它的值中推断出来的（95）。如上所述，`int` 的大小在 32 位系统中为 32 位，在 64 位系统中为 64 位。让我们继续进行验证。

可以使用 `Printf` 函数中的 `％T` 格式说明符来打印变量的类型。Go 有一个 [unsafe](https://golang.org/pkg/unsafe/) 包，该包拥有 `Sizeof` 函数，该函数以字节为单位返回传递给它的变量的大小。不安全的软件包应谨慎使用，因为使用它的代码可能存在可移植性问题，但是出于本教程的目的，我们可以使用它。

以下程序输出变量 `a` 和 `b` 的类型和大小。`％T` 是格式说明符，用于打印类型，而 `％d` 用于打印尺寸。

```go
package main

import (
  "fmt"
  "unsafe"
)

func main() {
  var a int = 89
  b := 95
  fmt.Println("value of a is", a, "and b is", b)
  fmt.Printf("type of a is %T, size of a is %d", a, unsafe.Sizeof(a)) //type and size of a
  fmt.Printf("\ntype of b is %T, size of b is %d", b, unsafe.Sizeof(b)) //type and size of b
}
```

[Run in playground](https://play.golang.org/p/mFsmjVk5oc)

上面的程序将输出以下内容：

```sh
value of a is 89 and b is 95
type of a is int, size of a is 4
type of b is int, size of b is 4
```

我们可以从上面的输出中推断出 `a` 和 `b` 的类型为 `int`，它们的大小为 32 位（4 个字节）。如果在 64 位系统上运行上述程序，输出将有所不同。 在 64 位系统中，`a` 和 `b` 占用 64 位（8 字节）。

## 无符号整形

- **uint8**：代表 8 位无符号整形
  - **size**：8 位
  - **range**：0 到 255
- **uint16**：代表 16 位无符号整形
  - **size**：16 位
  - **range**：0 到 65535
- **uint32**：代表 32 位无符号整形
  - **size**：32  位
  - **range**：0 到 4294967295
- **uint64**：代表 64 位无符号整形
  - **size**：64 位
  - **range**：0 到 18446744073709551615
- **uint**： 表示 32 或 64 位无符号整数，具体取决于基础平台。
  - **size**：在 32 位系统中为 32 位，在 64 位系统中为 64 位。
  - **range**：在 32 位系统中是 0 到 4294967295，在 62 位操作系统中是 0 到 18446744073709551615

## 浮点类型

- **float32**：32 位浮点数
- **float64**：64 位浮点数

下面是一个简单的程序，用于说明整数和浮点类型：

```go
package main

import (
 "fmt"
)

func main() {
  a, b := 5.67, 8.97
  fmt.Printf("type of a %T b %T\n", a, b)
  sum := a + b
  diff := a - b
  fmt.Println("sum", sum, "diff", diff)
  no1, no2 := 56, 89
  fmt.Println("sum", no1+no2, "diff", no1-no2)
}
```

[Run in playground](https://play.golang.org/p/upwUCprT-j)

`a` 和 `b` 的类型是从分配给它们的值推断出来的。在这种情况下，`a` 和 `b` 的类型为 `float64`。（`float64` 是浮点值的默认类型）。我们将 `a` 和 `b` 相加并将其分配给变量 `sum`。我们从 `a` 中减去 `b` 并将其分配给 `diff`。然后打印出 `sum` 和 `diff`。使用 `no1` 和 `no2` 进行类似的计算。上面的程序将打印：

```sh
type of a float64 b float64
sum 14.64 diff -3.3000000000000007
sum 145 diff -33
```

## 复数（complex）类型

> [复数](https://zh.wikipedia.org/wiki/%E5%A4%8D%E6%95%B0_(%E6%95%B0%E5%AD%A6))，为实数的延伸，它使任一多项式方程都有根。——维基百科

- **complex64**：具有 `float32` 实部和虚部的复数
- **complex128**：具有 `float64` 实部和虚部的复数

内置函数 `complex` 用于构造具有实部和虚部的复数。`complex` 函数具有以下定义：

```go
func complex(r, i FloatType) ComplexType
```

它以实部和虚部作为参数，并返回复数类型。实部和虚部都必须是同一类型。即 `float32` 或 `float64`。如果实部和虚部都为 `float32`，则此函数返回类型为 `complex64` 的复数值。如果实部和虚部都为 `float64` 类型，则此函数返回 `complex128` 类型的复数值：

复数可以使用短声明语法创建：

```go
c := 6 + 7i
```

让我们来写一个小程序助于理解复数：

```go
package main

import (
 "fmt"
)

func main() {
  c1 := complex(5, 7)
  c2 := 8 + 27i
  cadd := c1 + c2
  fmt.Println("sum:", cadd)
  cmul := c1 * c2
  fmt.Println("product:", cmul)
}
```

[Run in playground](https://play.golang.org/p/kEz1uKCdKs)

在上面的程序中，`c1` 和 `c2` 是两个复数。`c1` 的实部为 5，虚部为 7。 `c2` 具有实部 8 和虚部 27。`cadd` 被分配为 `c1` 和 `c2` 的和，而 `cmul` 被分配为 `c1` 和 `c2` 的乘积。该程序将输出：

```sh
sum: (13+34i)
product: (-149+191i)
```

## 其他数字类型

- **byte**：`uint8` 的别名
- **rune**：`int32` 的别名

## 字符串类型

在 Go 语言中，字符串是字节的集合。如果这个定义没有任何意义，那也没关系。现在，我们可以假设字符串是字符的集合。

让我们使用字符串类型来写一个程序：

```go
package main

import (
 "fmt"
)

func main() {
  first := "Naveen"
  last := "Ramanathan"
  name := first +" "+ last
  fmt.Println("My name is",name)
}
```

[Run in playground](https://play.golang.org/p/CI6phwSVel)

在上面的程序中，首先分配了字符串 `Naveen`，最后分配了字符串 `Ramanathan`。可以使用 `+` 运算符将字符串连接在一起。为 `name` 分配了 `first` 的值，该值连接到一个空格，后跟一个 `last`。上面的程序将输出 `My name is Naveen Ramanathan`。

还有一些可以对字符串执行的操作。我们将在单独的教程中介绍这些内容。

## 类型转换

Go 对于类型明确非常严格。没有自动类型提升或转换。让我们看一个例子来理解这意味着什么：

```go
package main

import (
 "fmt"
)

func main() {
  i := 55 //int
  j := 67.8 //float64
  sum := i + j //int + float64 not allowed
  fmt.Println(sum)
}
```

[Run in playground](https://play.golang.org/p/m-TMRpmmnm)

上面的代码在 C 语言中是完全合法的。但是在使用 go 的情况下，这将行不通。 `i` 是 `int` 类型，`j` 是 `float64` 类型。我们正在尝试添加 2 个不同类型的数字，这是不允许的。运行程序时，你将得到 `main.go：10:invalid operation:i + j(mismatched types int and float64)` 的错误。

要解决该错误，`i` 和 `j` 应该具有相同的类型。让我们将 `j` 转换为 `int`。`T(v)` 是将值 `v` 转换为类型 `T` 的语法：

```go
package main

import (
 "fmt"
)

func main() {
  i := 55 //int
  j := 67.8 //float64
  sum := i + int(j) //j is converted to int
  fmt.Println(sum)
}
```

[Run in playground](https://play.golang.org/p/mweu3n3jMy)

现在，当你运行上述程序时，你会看到 `122` 作为输出。

分配也是如此。需要进行显式类型转换才能将一种类型的变量分配给另一种类型。以下程序能够证实这一点：

```go
package main

import (
 "fmt"
)

func main() {
  i := 10
  var j float64 = float64(i) //this statement will not work without explicit conversion
  fmt.Println("j", j)
}
```

[Run in playground](https://play.golang.org/p/Y2uSYYr46c)

在第 9 行中，`i` 转换为 `float64`，然后被分配给 `j`。当你尝试将 `i` 分配给 `j` 而不进行任何类型转换时，编译器将引发错误。

> 原文地址 [Types](https://golangbot.com/types/)
> 原文作者：[Naveen Ramanathan](https://golangbot.com/about/)
> 译文出自：[洛竹翻译计划](https://youngjuning.js.org/categories/%E6%B4%9B%E7%AB%B9%E7%BF%BB%E8%AF%91%E8%AE%A1%E5%88%92/)
