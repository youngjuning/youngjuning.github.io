---
title: word-wrap 和 word-break
description: word-wrap 和 word-break 是一对用于单词断句的双生属性，但是又有微妙的区别，每次要用的时候还要重新翻一下 MDN 文档，本文力求通过一张流程图快速记忆两者如何使用。
date: 2023-02-13 13:47:56
categories:
  - [前端, CSS]
tags:
  - CSS
  - word-wrap
  - word-break
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>


word-wrap 和 word-break 是一对用于单词断句的双生属性，但是又有微妙的区别，每次要用的时候还要重新翻一下 MDN 文档，本文力求通过一张流程图快速记忆两者如何使用。

## word-wrap

css 的 word-wrap 属性用来标明是否允许浏览器在单词内进行断句，这是为了防止当一个字符串太长而找不到它的自然断句点时产生溢出现象。

- normal：就是大家平常见得最多的正常的换行规则。
- break-word：一行单词中实在没有其他靠谱的换行点的时候在单词内换行。

## word-break

css 的 word-break 属性用来标明怎么样进行单词内的断句。

- normal：使用默认的换行规则，即如果一个单词很长，导致一行中剩下的空间已经放不下它时，则浏览器会把这个单词挪到下一行去。
- break-all：允许单词断行，即如果一个单词很长，导致一行中剩下的空间已经放不下它时，则浏览器不会把这个单词挪到下一行去，而是在单词内换行。

## 搭配使用，换行不累

![](https://picbed.qunarzz.com/3d7e329ab089d28c7bde5be75573f1d3.png)

> 参考资料来自 [你真的了解word-wrap和word-break的区别吗？](https://www.cnblogs.com/2050/archive/2012/08/10/2632256.html) 和 [word-break:break-all和word-wrap:break-word的区别](https://www.zhangxinxu.com/wordpress/2015/11/diff-word-break-break-all-word-wrap-break-word/)
