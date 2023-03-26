---
title: Go 语言系列教程のMap
date: 2023-03-19 15:13:00
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1679280067130.png
description: map 是 Go 中的一个内置类型，用于存储键值对。
categories:
  - [Golang, Go 语言系列教程]
  - [洛竹翻译计划]
tags:
  - Golang
  - Go 语言系列教程
  - 洛竹翻译计划
  - Go Map
---

## map 是什么？

map 是 Go 中的一个内置类型，用于存储键值对。让我们以一个有几个员工的创业公司为例。为了简单起见，我们假设所有这些员工的名字都是唯一的。我们正在寻找一个数据结构来存储每个员工的工资。对于这个用例来说，一个 map 将是一个完美的选择。员工的名字可以是键，工资可以是值。map 类似于其他语言中的字典，如 Python。

## 如何创建 map

通过向 `make` 函数传递键和值的类型，可以创建一个 map。下面是创建一个新 map 的语法。

```go
make(map[type of key]type of value)
```

```go
employeeSalary := make(map[string]int)
```

上面这行代码创建了一个名为 `employeeSalary` 的地图，它有 `string` 键和 `int` 值。

```go
package main

import (
    "fmt"
)

func main() {
    employeeSalary := make(map[string]int)
    fmt.Println(employeeSalary)
}
```

[Run in Playground](https://play.golang.org/p/EoaQ_Xwz66Z)

上面的程序创建了一个名为 `employeeSalary` 的 map，有 `string` 键和 `int` 值。上面的程序将打印。

```go
map[]
```

由于我们没有向 map 添加任何元素，所以它是空的。

## 向 map 添加元素

向 map 添加新元素的语法与数组的语法相同。下面的程序在 `employeeSalary` map 中增加了一些新雇员。

```go
package main

import (
    "fmt"
)

func main() {
    employeeSalary := make(map[string]int)
    employeeSalary["steve"] = 12000
    employeeSalary["jamie"] = 15000
    employeeSalary["mike"] = 9000
    fmt.Println("employeeSalary map contents:", employeeSalary)
}
```

[Run in playground](<https://play.golang.org/p/-IUSnvdgF2I >)

我们增加了三个雇员 `steve`、`jamie` 和 `mike` 以及他们相应的工资。

上述程序打印出来。

```sh
employeeSalary map contents: map[steve:12000 jamie:15000 mike:9000]
```

也可以在声明本身中初始化一个 map。

```go
package main

import (
    "fmt"
)

func main() {
    employeeSalary := map[string]int {
        "steve": 12000,
        "jamie": 15000,
    }
    employeeSalary["mike"] = 9000
    fmt.Println("employeeSalary map contents:", employeeSalary)
}
```

[Run in playground](<https://play.golang.org/p/oR_j4jkJflf >)

上面的程序声明了 `employeeSalary`，并在声明本身中添加了两个元素。后来又增加了一个键为 `mike` 的元素。该程序打印出

```sh
employeeSalary map contents: map[jamie:15000 mike:9000 steve:12000]
```

不一定只有字符串类型才是键。所有可比较的类型，如布尔、整数、浮点、复数、字符串也可以是键。甚至用户定义的类型，如结构体也可以是键。如果你想了解更多关于可比较类型的信息，请访问 http://golang.org/ref/spec#Comparison_operators。

## map 的零值

map 的零值是 `nil`。如果你试图向一个 `nil` map 添加元素，将会发生运行时 [panic](https://golangbot.com/panic-and-recover/)。因此，在添加元素之前，map 必须被初始化。

```go
package main

func main() {
    var employeeSalary map[string]int
    employeeSalary["steve"] = 12000
}
```

[Run in playground](https://play.golang.org/p/DH8gJVjn6M2)

在上面的程序中，`employeeSalary` 是 `nil`，我们试图在 map 中添加一个新的键。该程序将出现错误

`panic: assignment to entry in nil map`

## 从 map 中检索一个键的值

现在我们已经向 map 添加了一些元素，让我们来学习如何检索它们。`map[key]` 是检索 map 元素的语法。

```go
package main

import (
    "fmt"
)

func main() {
    employeeSalary := map[string]int{
        "steve": 12000,
        "jamie": 15000,
        "mike": 9000,
    }
    employee := "jamie"
    salary := employeeSalary[employee]
    fmt.Println("Salary of", employee, "is", salary)
}
```

[Run in playground](https://play.golang.org/p/qthGPQ6pj0Z)

上面的程序是非常直接的。雇员 `jamie` 的工资被检索并打印出来。该程序打印了

```
Salary of jamie is 15000
```

如果一个元素不存在，会发生什么？map 将返回该元素的类型的零值。在 `employeeSalary` 地图的例子中，如果我们试图访问一个不存在的元素，将返回 `int` 的零值，即 `0`。

```go
package main

import (
    "fmt"
)

func main() {
    employeeSalary := map[string]int{
        "steve": 12000,
        "jamie": 15000,
    }
    fmt.Println("Salary of joe is", employeeSalary["joe"])
}
```

[Run in playground](https://play.golang.org/p/iVal_ll7iN7)

上述程序的输出是

```
Salary of joe is 0
```

上面的程序返回 joe 的工资为 `0`。当我们试图检索 map 中不存在的键的值时，将不会出现运行时错误。

## Checking if a key exists

在上一节中我们了解到，当一个键不存在时，将返回该类型的零值。当我们想知道键是否真的存在于 map 中时，这并没有帮助。

例如，我们想知道一个键是否存在于 `employeeSalary` map 中。

```go
value, ok := map[key]
```
以上是查找一个特定的键是否存在于 map 中的语法。如果 `ok` 为真，那么该键就存在，其值也存在于变量 `value` 中，否则该键就不存在。

```go
package main

import (
    "fmt"
)

func main() {
    employeeSalary := map[string]int{
        "steve": 12000,
        "jamie": 15000,
    }
    newEmp := "joe"
    value, ok := employeeSalary[newEmp]
    if ok == true {
        fmt.Println("Salary of", newEmp, "is", value)
        return
    }
    fmt.Println(newEmp, "not found")

}
```

[Run in playground](https://play.golang.org/p/Y4n1p4yfdVi)

在上述程序中，`ok` 将是假的，因为 `joe` 不存在。因此，该程序将打印。

```
joe not found
```

## 遍历一个 map 中的所有元素

`for` 循环的 `range` 形式用于遍历一个 map 的所有元素。

```go
package main

import (
    "fmt"
)

func main() {
    employeeSalary := map[string]int{
        "steve": 12000,
        "jamie": 15000,
        "mike":  9000,
    }
    fmt.Println("Contents of the map")
    for key, value := range employeeSalary {
        fmt.Printf("employeeSalary[%s] = %dn", key, value)
    }

}
```

[Run in playground](<https://play.golang.org/p/rz8U_g2slb0 >)

上述程序的输出。

```
Contents of the map
employeeSalary[mike] = 9000
employeeSalary[steve] = 12000
employeeSalary[jamie] = 15000
```

> 一个重要的事实是，当使用 `for range` 时，从 map 中检索数值的顺序不保证在程序的每次执行中都是一样的。它也和元素被添加到 map 中的顺序不一样

## 从 map 中删除元素

[delete(map, key)](https://golang.org/pkg/builtin/#delete) 是从 `map` 中删除 `key` 的语法。删除函数不返回任何值。

```go
package main

import (
    "fmt"
)

func main() {
    employeeSalary := map[string]int{
        "steve": 12000,
        "jamie": 15000,
        "mike": 9000,
    }
    fmt.Println("map before deletion", employeeSalary)
    delete(employeeSalary, "steve")
    fmt.Println("map after deletion", employeeSalary)

}
```

[Run in playground](<https://play.golang.org/p/u0WCB-Ta_dB >)

上面的程序删除了键 `steve`，并且打印了

```
map before deletion map[steve:12000 jamie:15000 mike:9000]
map after deletion map[mike:9000 jamie:15000]
```

如果我们试图删除一个不存在于 map 中的键，将不会出现运行时错误。

## 结构体 map

到目前为止，我们只在地图中存储了雇员的工资。如果我们也能在地图中存储每个雇员的国家，那不是很好吗？这可以通过使用一个结构体 map 来实现。雇员可以被表示为一个包含工资和国家字段的结构，它们将以字符串键和结构值存储在 map 中。让我们写一个程序来了解如何做到这一点。

```go
package main

import (
    "fmt"
)

type employee struct {
    salary  int
    country string
}

func main() {
    emp1 := employee{
        salary:  12000,
        country: "USA",
    }
    emp2 := employee{
        salary:  14000,
        country: "Canada",
    }
    emp3 := employee{
        salary:  13000,
        country: "India",
    }
    employeeInfo := map[string]employee{
        "Steve": emp1,
        "Jamie": emp2,
        "Mike":  emp3,
    }

    for name, info := range employeeInfo {
        fmt.Printf("Employee: %s Salary:$%d  Country: %s\n", name, info.salary, info.country)
    }

}
```

[Run in playground](https://play.golang.org/p/wbGhkyZld1a)

在上述程序中，`employee` 结构包含 `salary` 和 `country` 字段。我们创建了三个雇员`emp1`, `emp2` 和 `emp3`。

我们用我们创建的三个雇员初始化一个键类型为 `string`、值类型为 `employee` 的地图。

这个程序将打印。

```
Employee: Mike Salary:$13000  Country: India
Employee: Steve Salary:$12000  Country: USA
Employee: Jamie Salary:$14000  Country: Canada
```

## map 的长度

map 的长度可以用 [len](https://golang.org/pkg/builtin/#len)函数来确定。

```go
package main

import (
    "fmt"
)

func main() {
    employeeSalary := map[string]int{
        "steve": 12000,
        "jamie": 15000,
    }
    fmt.Println("length is", len(employeeSalary))

}
```

[Run in playground](<https://play.golang.org/p/vDxsqn6g-0p >)

上面程序中的 `len(employeeSalary)` 返回 map 长度。上面的程序打印出来。

```
length is 2
```

## map 是引用类型

与切片类似，map 是引用类型。当一个 map 被分配给一个新的变量时，它们都指向同一个内部数据结构。因此，在一个中的变化将反映在另一个中。

```go
package main

import (
    "fmt"
)

func main() {
    employeeSalary := map[string]int{
        "steve": 12000,
        "jamie": 15000,
        "mike": 9000,
    }
    fmt.Println("Original employee salary", employeeSalary)
    modified := employeeSalary
    modified["mike"] = 18000
    fmt.Println("Employee salary changed", employeeSalary)

}
```

[Run in playground](<https://play.golang.org/p/hWouI1KvEb_i >)

在上述程序中，`employeeSalary` 被分配到 `modified`。在下一行中，`mike` 的工资在 `modified` map 中被改为`18000`。Mike 的工资现在在 `employeeSalary` 中也是 `18000`。该程序输出。

```
Original employee salary map[jamie:15000 mike:9000 steve:12000]
Employee salary changed map[jamie:15000 mike:18000 steve:12000]
```

当 map 作为参数传递给函数时也是类似的情况。当在函数中对 map 做任何改变时，它对调用者也是可见的。

## map 相等性

map 不能使用 `==` 操作符进行比较。`==` 只能用于检查一个 map 是否为`nil`。

```go
package main

func main() {
    map1 := map[string]int{
        "one": 1,
        "two": 2,
    }

    map2 := map1

    if map1 == map2 {
    }
}
```

[Run in playground](https://play.golang.org/p/MALqDyWkcT)

上述程序将无法编译，错误为

```
invalid operation: map1 == map2 (map can only be compared to nil)
```

检查两个 map 是否相等的一种方法是逐一比较每个 map 的各个元素。另一种方法是使用 [反射](https://golangbot.com/reflection/)。我鼓励你为此写一个程序，并使其发挥作用。

我已经把我们讨论过的所有概念编成了一个程序。你可以从 [github](https://github.com/golangbot/maps) 下载它。

至此，本教程结束。希望你喜欢它。请留下您的评论。

> 原文地址 [Golang Maps Tutorial](https://golangbot.com/maps/)
> 原文作者：[Naveen Ramanathan](https://golangbot.com/about/)
> 译文出自：[洛竹翻译计划](https://youngjuning.js.org/categories/%E6%B4%9B%E7%AB%B9%E7%BF%BB%E8%AF%91%E8%AE%A1%E5%88%92/)
