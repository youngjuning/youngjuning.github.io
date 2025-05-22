---
title: Go 语言教程系列の包
date: 2023-03-19 15:07:00
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1679280067130.png
description: 包用于组织 Go 源代码，以提高可重用性和可读性。包是位于同一目录中的 Go 源文件的集合。包提供了代码分隔，因此我们可以轻松维护 Go 项目。
categories:
  - [Golang, Go 语言系列教程]
  - [紫升翻译计划]
tags:
  - Golang
  - Go 语言教程
  - Go 语言教程系列
  - Golang 包
---

## 什么是包（package），为什么使用它们？

到目前为止，我们已经看到 Go 程序只有一个带有 `main` 函数的文件，以及几个其他函数。在实际情况下，这种将所有源代码写入单个文件的方法是不可扩展的。重用和维护以此方式编写的代码几乎是不可能。这时就需要用到包的概念。

**包用于组织 Go 源代码，以提高可重用性和可读性。包是位于同一目录中的 Go 源文件的集合。包提供了代码分隔，因此我们可以轻松维护 Go 项目。**

例如，假设我们正在 Go 中编写财务应用程序，其中一些功能是单利计算、复利计算和贷款计算。组织此应用程序的一种简单方法是根据功能。我们可以创建包 `simpleinterest`、`compoundinterest` 和 `loan`。如果 `loan` 包需要计算单利，则可以通过导入 `simpleinterest` 包来简单地进行计算。这样，代码就可以重用。

我们将通过创建一个简单的应用程序来学习包，以确定给定的本金、利率和持续时间（以年为单位）的单利。

## main 函数和 main 包

每个可执行的 Go 应用程序都必须包含 `main` 函数。此函数是执行的入口点。`main` 函数应保留在主包中。

`package packagename` 指定一个指向 `packagename` 包的特定源文件。这在每一个 go 源文件中都应该放在第一行。

接下来让我们从为应用创建 `main` 函数和 `main` 包开始吧。

执行下面的命令在 `Desktop` 文件夹下创建一个名为 `lernapackage` 的文件。

```sh
mkdir ~/Desktop/learnpackage/
```

在 `learnpackage` 目录下创建一个 `main.go` 文件，然后写入一下内容：

```go
package main

import "fmt"

func main() {
    fmt.Println("Simple interest calculation")
}
```

`package main` 表示该文件属于 `main` 包，`import "packagename"` 语句被用来导入一个已经存在的包。`packagename.FunctionName()` 是调用包中函数的语法。

在第 3 行中，为了使用 `Println` 函数我们导入了 `fmt` 包。`fmt` 是一个 Go 的标准库并且是内置可用的。然后是打印 `Simple interest calculation` 的 `main` 函数。

进入 `learnpackage` 目录并使用下面的命令编译上面的项目：

```sh
cd ~/Desktop/learnpackage/
```

然后输入下面的初始化 `mod`：

```sh
go mod init learnpackage
```

然后尝试输入下面的命令：

```sh
go install
```

如果一切顺利，我们的二进制文件将被编译并准备执行。在终端中输入命令 `learnpackage`，你将看到以下输出：

```sh
Simple interest calculation
```

## Go 模块（Module）

我们将以这样的方式构造代码，使所有与单利相关的功能都在 `simpleinterest` 包中。为此，我们需要创建一个自定义包 `simpleinterest`，其中将包含用于计算单利的函数。在创建自定义包之前，我们首先需要理解 Go 模块，因为创建自定义 packages 需要用到 **Go 模块**。

**Go 模块不过是 Go 软件包的集合。**现在你可能会想到一个问题：为什么我们需要 Go 模块来创建自定义包？答案是**我们创建的自定义包的导入路径是从 go 模块的名称获得的**。除此之外，我们的应用程序使用的所有其他第三方软件包（例如来自 github 的 源代码）将与版本一起出现在 `go.mod` 文件中。这个 `go.mod` 文件是在我们创建一个新模块时创建的。在下一部分中，你将更好地理解这一点。

## 创建一个单利自定义包

**属于包的源文件应放置在各自的单独文件夹中。Go 中的惯例是使用与包相同的名称来命名此文件夹。**

让我们在 `learnpackage` 文件夹内创建一个名为 `simpleinterest` 的文件夹。`mkdir simpleinterest` 将为我们创建此文件夹。

`simpleinterest` 文件夹中的所有文件均应以 `package simpleinterest` 开头，因为它们都属于 `simpleinterest` 软件包。

在 `simpleinterest` 文件夹内创建一个文件 `simpleinterest.go`。

以下将是我们应用程序的目录结构。

```sh
├── learnpackage
│   ├── go.mod
│   ├── main.go
│   └── simpleinterest
│       └── simpleinterest.go
```

添加下面的代码到 `simpleinterest.go` 文件中。

```go
package simpleinterest

// 计算并返回本金 p 的单利，持续时间 t 年的利率 r
func Calculate(p float64, r float64, t float64) float64 {
    interest := p * (r / 100) * t
    return interest
}
```

在上面的代码中，我们创建了一个函数 `Calculate`，该函数计算并返回单利。此功能不言自明，它计算并返回单利。

请注意，函数名称 **Calculate** 以大写字母开头。这是必不可少的，我们后边会解释为什么需要这样做。

## 导入自定义包

要使用自定义包，我们必须首先将其导入。导入路径是模块的名称，该名称后跟的是程序包的子目录和程序包名称。在我们的例子中，模块名称为 `learnpackage`，而软件包 `simpleinterest` 位于 `learnpackage` 下的 `simpleinterest` 文件夹中。

```sh
├── learnpackage
│   └── simpleinterest
```

因此 `import "learnpackage/simpleinterest"` 这行代码将会引入 simpleinterest 包。

如果我们有这样的目录结构

```sh
learnpackage
│   └── finance
│       └── simpleinterest
```

导入语句则应该是 `import "learnpackage/finance/simpleinterest"`

在 `main.go` 文件中添加相应代码：

```go
package main

import (
    "fmt"
    "learnpackage/simpleinterest"
)

func main() {
    fmt.Println("Simple interest calculation")
    p := 5000.0
    r := 10.0
    t := 1.0
    si := simpleinterest.Calculate(p, r, t)
    fmt.Println("Simple interest is", si)
}
```

上面的代码导入 `simpleinterest` 包，并使用 `Calculate` 函数计算单利。标准库中的软件包不需要模块名称前缀，因此 `fmt` 可以在没有模块前缀的情况下工作。当应用程序运行时，输出将是：

```sh
Simple interest calculation
Simple interest is 500
```

## 导出名称

我们在单利包中将函数 `Calculate` 大写。这在 Go 中具有特殊含义。 任何以大写字母开头的变量或函数都会在 go 中导出名称。在 Go 中只能从其他程序包访问导出的函数和变量。在我们的例子中，我们想从主程序包访问 `Calculate` 函数。 因此，这是大写的。

如果在 `simpleinterest.go` 中将函数名称从 `Calculate` 更改为 `calculate`，并且如果我们尝试在 `main.go` 中使用`simpleinterest.calculate(p，r，t)` 调用函数，则编译器将报错：

```
# learnpackage
./main.go:13:8: undefined: simpleinterest.Calculate
```

因此，如果要访问包外部的函数，应该将其大写。

## `init` 函数

Go 中的每个包都可以包含一个 `init` 函数。`init` 函数不能有任何返回类型，也不能有任何参数。在我们的源代码中不能显式调用 `init` 函数。程序包初始化时将自动调用它。初始化函数的语法：

```go
func init() {
}
```

`init` 函数可用于执行初始化任务，也可用于在执行开始之前验证程序的正确性。包的初始化顺序如下：

1. 首先对包级的变量进行初始化
2. 接下来调用 `init` 函数。包可以具有多个 `init` 函数（在单个文件中或分布在多个文件中），并且按将其呈现给编译器的顺序进行调用。

如果一个包导入了其他包，则首先初始化导入的软件包。

一个包即使从多个包中导入，也只会被初始化一次。

让我们对应用程序进行一些修改，以了解 `init` 函数。

首先，让我们将 `init` 函数添加到 `simpleinterest.go` 文件中。

```go
package simpleinterest

import "fmt"

/*
 * 添加 init 函数
 */
func init() {
    fmt.Println("Simple interest package initialized")
}
// Calculate 计算并返回本金 p 的单利，持续时间 t 年的利率 r
func Calculate(p float64, r float64, t float64) float64 {
    interest := p * (r / 100) * t
    return interest
}
```

我们添加了一个简单的 `init` 函数，该函数仅打印 已初始化的单利包

现在，让我们修改主程序包。我们知道，在计算单利时，本金、利率和持续时间应大于零。我们将使用 `init` 函数和 `main.go` 文件中的包级别变量定义此检查。

将 `main.go` 修改为以下内容：

```go
package main

import (
    "fmt"
    "learnpackage/simpleinterest" // 导入自定义的包
    "log"
)
var p, r, t = 5000.0, 10.0, 1.0

/*
* init 函数检查 p, r 和 t 是否大于 0
 */
func init() {
    println("Main package initialized")
    if p < 0 {
        log.Fatal("Principal is less than zero")
    }
    if r < 0 {
        log.Fatal("Rate of interest is less than zero")
    }
    if t < 0 {
        log.Fatal("Duration is less than zero")
    }
}

func main() {
    fmt.Println("Simple interest calculation")
    si := simpleinterest.Calculate(p, r, t)
    fmt.Println("Simple interest is", si)
}
```

以下是对 `main.go` 所做的更改

1. **p**、**r** 和 ** t ** 变量从 `main` 函数级移至包级的。 2.增加了 `init` 函数。如果本金、利率或持续时间小于零，则使用 `init` 函数打印日志并终止程序执行。

初始化的顺序如下：

1. 首先初始化导入的软件包。因此，首先初始化 `simpleinterest` 包，然后调用它的 `init` 方法。
2. 接下来初始化包级别变量 `p`，`r` 和 `t`。
3. `init` 函数在 `main` 中调用。 4.最后调用 `main` 函数。

如果运行该程序，将得到以下输出：

```sh
Simple interest package initialized
Main package initialized
Simple interest calculation
Simple interest is 500
```

如预期的那样，首先调用 `simpleinterest` 包的 `init` 函数，然后初始化包级变量 `p`，`r` 和 `t`。接下来调用 `main` 包的 `init` 函数。它检查`p`、`r` 和 `t` 是否小于零，并在条件为真时终止。现在你可以假定 `if p <0` 将检查 `p` 是否小于 `0`，如果小于`0`，则程序将终止。我们为 `r` 和 `t` 写了类似的条件。在这种情况下，所有这些条件都是假的，程序将继续执行。最后，调用 `main` 函数。

让我们对该程序进行一些修改以学习 `init` 函数的用法。修改 `main.go` 这一行

```go
var p, r, t = 5000.0, 10.0, 1.0
```

为

```go
var p, r, t = -5000.0, 10.0, 1.0
```

我们已经将 `p` 初始化为负数。

现在，如果你运行该应用程序，你将看到

```
Simple interest package initialized
Main package initialized
2020/02/15 21:25:12 Principal is less than zero
```

`p` 是负数。因此，当 `init` 函数运行时，程序在打印 `Principal is less than zero` 后终止。

## 空白标识符的使用

在 Go 中导入包却不使用是不合法的。如果这样做，编译器会抱怨。这样设计的原因是避免使未使用的包越来越多，这会大大增加编译时间。用以下内容替换 `main.go` 中的代码，

```go
package main

import (
    "learnpackage/simpleinterest"
)

func main() {

}
```

上面的程序将会抛错：

```
"learnpackage/simpleinterest" imported but not used
```

但是，在应用程序处于开发阶段中时，导入包并随后在代码中的某个位置（如果不是现在）使用它们是很常见的。在这种情况下，`_` 空白标识符可以为我们节省时间。

上面的程序中的错误可以通过以下代码消除：

```go
package main

import (
  "learnpackage/simpleinterest"
)

var _ = simpleinterest.Calculate

func main() {

}
```

`var _ = simpleinterest.Calculate` 使错误静音了。如果不使用包，我们应该跟踪这些错误消音器，并在应用程序开发结束时删除它们，包括导入的包。因此，建议在 `import` 语句之后在包级别编写错误消音器。

有时，即使我们不需要使用包中的任何函数或变量，也需要导入包以确保初始化发生。例如，即使我们计划在代码中的任何地方都不使用该包，我们可能仍需要确保调用 `simpleinterest` 包的 `init` 函数。空白标识符 `_` 也可以在这种情况下使用，如下所示。

```go
package main

import (
    _ "learnpackage/simpleinterest"
)

func main() {

}
```

运行以上程序将输出 `Simple interest package initialized`。我们已经成功地初始化了 `simpleinterest` 包，即使在代码中的任何地方都没有使用它。

在第 13 行中，我们仅使用 `area`，而使用 `_` 标识符来丢弃 `perimeter`。

> 原文地址 [Go Packages](https://golangbot.com/go-packages/)
> 原文作者：[Naveen Ramanathan](https://golangbot.com/about/)
> 译文出自：[紫升翻译计划](https://youngjuning.cn/categories/%E6%B4%9B%E7%AB%B9%E7%BF%BB%E8%AF%91%E8%AE%A1%E5%88%92/)
