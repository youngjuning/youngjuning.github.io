---
title: Go 语言系列教程の切片
date: 2023-03-19 15:11:30
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1679280067130.png
description: 切片是数组上面的一个方便、灵活和强大的包装器。切片并不拥有自己的任何数据。它们只是对现有数组的引用。
categories:
  - [Golang, Go 语言系列教程]
  - [紫竹翻译计划]
tags:
  - Golang
  - Go 语言系列教程
  - 紫竹翻译计划
  - Go 切片
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

切片是数组上面的一个方便、灵活和强大的包装器。切片并不拥有自己的任何数据。它们只是对现有数组的引用。

## 创建切片

一个具有 T 类型元素的切片用 `[]T` 表示。

```go
package main

import (
    "fmt"
)

func main() {
    a := [5]int{76, 77, 78, 79, 80}
    var b []int = a[1:4] // 创建一个 a[1] 到 a[3] 的切片
    fmt.Println(b)
}
```

[Run in playground](https://play.golang.org/p/Za6w5eubBB)

语法`a[start:end]`从数组 `a` 中创建一个切片，从索引 `start` 开始到索引 `end`-1`。所以在上述程序中，`a[1:4]` 创建了一个从索引 1 到 3 的数组 `a` 的切片。因此切片 `b` 的值是 `[77 78 79]`。

让我们来看看创建切片的另一种方法。

```go
package main

import (
    "fmt"
)

func main() {
    c := []int{6, 7, 8} // 创建一个数组并返回切片的索引
    fmt.Println(c)
}
```

[Run in playground](https://play.golang.org/p/_Z97MgXavA)

在上述程序中，`c := []int{6, 7, 8}` 创建了一个包含 3 个整数的数组，并返回一个存储在 c 中的切片引用。

### 修改一个切片

一个切片并不拥有自己的任何数据。它只是底层数组的一个代表。对切片所做的任何修改都会反映在底层数组中。

```go
package main

import (
    "fmt"
)

func main() {
    darr := [...]int{57, 89, 90, 82, 100, 78, 67, 69, 59}
    dslice := darr[2:5]
    fmt.Println("array before",darr)
    for i := range dslice {
        dslice[i]++
    }
    fmt.Println("array after",darr)
}
```

[Run in playground](<https://play.golang.org/p/6FinudNf1k >)

在上述程序中，我们从数组的索引 2、3、4 创建 `dslice`。for 循环将这些索引的值增加 1。当我们在 for 循环后打印数组时，我们可以看到切片的变化已经反映在数组中。该程序的输出是

```
array before [57 89 90 82 100 78 67 69 59]
array after [57 89 91 83 101 78 67 69 59]
```

当一些切片共享同一个底层数组时，每个切片的变化都会反映在数组中。

```go
package main

import (
    "fmt"
)

func main() {
    numa := [3]int{78, 79 ,80}
    nums1 := numa[:] // 创建一个包含数组中所有元素的片断
    nums2 := numa[:]
    fmt.Println("array before change 1",numa)
    nums1[0] = 100
    fmt.Println("array after modification to slice nums1", numa)
    nums2[1] = 101
    fmt.Println("array after modification to slice nums2", numa)
}
```

[Run in playground](https://play.golang.org/p/mdNi4cs854)

在 `numa[:]` 中，缺少开始和结束值。start 和 end 的默认值分别为 `0` 和 `len(numa)`。两个切片 `nums1` 和 `nums2` 共享同一个数组。该程序的输出是

```
array before change 1 [78 79 80]
array after modification to slice nums1 [100 79 80]
array after modification to slice nums2 [100 101 80]
```

从输出结果来看，很明显，当切片共享同一个数组时。对切片所做的修改会反映在数组中。

### 切片的长度和容量

切片的长度是切片中元素的数量。**切片的容量是指从创建分片的索引开始的底层数组中的元素数**。

让我们写一些代码来更好地理解这一点。

```go
package main

import (
    "fmt"
)

func main() {
    fruitarray := [...]string{"apple", "orange", "grape", "mango", "water melon", "pine apple", "chikoo"}
    fruitslice := fruitarray[1:3]
    fmt.Printf("length of slice %d capacity %d", len(fruitslice), cap(fruitslice)) // 切的长度为 2，容量为 6
}
```

[Run in playground](https://play.golang.org/p/a1WOcdv827)

在上面的程序中，`fruitslice` 是由 `fruitarray` 的索引 1 和 2 创建的。因此，`fruitslice` 的长度是 2。

`fruitarray` 的长度是 7。`fruiteslice` 是从 `fruitarray` 的索引 1 创建的。因此，`fruitslice` 的容量是 `fruitarray' 中从索引 1 开始的元素数量，即从`orange` 开始，这个值是`6`。因此，`fruitslice` 的容量是 6。[程序](https://play.golang.org/p/a1WOcdv827) 打印出 **length of slice 2 capacity 6**。

一个切片可以被重新切割到它的容量。任何超过这个容量的部分都会导致程序出现运行时错误。

```go
package main

import (
    "fmt"
)

func main() {
    fruitarray := [...]string{"apple", "orange", "grape", "mango", "water melon", "pine apple", "chikoo"}
    fruitslice := fruitarray[1:3]
    fmt.Printf("length of slice %d capacity %d\n", len(fruitslice), cap(fruitslice)) // 长度为 2，容量为 6
    fruitslice = fruitslice[:cap(fruitslice)] // 重新分割切片，直到其容量。
    fmt.Println("After re-slicing length is",len(fruitslice), "and capacity is",cap(fruitslice))
}
```

[Run in playground](<https://play.golang.org/p/GcNzOOGicu >)

在上述程序中，`fruitslice` 被重新f分割成到其容量。上述程序的输出。

```
length of slice 2 capacity 6
After re-slicing length is 6 and capacity is 6
```

### 使用 make 创建切片

_func make([]T, len, cap) []T_ 可以通过传递类型、长度和容量来创建一个切片。容量参数是可选的，默认为长度。make 函数创建一个数组，并返回对它的切片的引用。

```go
package main

import (
    "fmt"
)

func main() {
    i := make([]int, 5, 5)
    fmt.Println(i)
}
```

[Run in playground](https://play.golang.org/p/M4OqxzerxN)

当使用 make 创建一个切片时，这些值默认为零。上述程序将输出 `[0 0 0 0]`。

> 原文地址 [Arrays and Slices](https://golangbot.com/arrays-and-slices/)
> 原文作者：[Naveen Ramanathan](https://golangbot.com/about/)
> 译文出自：[紫竹翻译计划](https://youngjuning.js.org/categories/%E6%B4%9B%E7%AB%B9%E7%BF%BB%E8%AF%91%E8%AE%A1%E5%88%92/)
