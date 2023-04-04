---
title: Hexo 博客 SEO 优化实战
date: 2023-04-04 15:44:38
description: 本文主要记录了一些用 Hexo 写技术比克的 SEO 优化方法，包括文章标题、文章内容、文章标签、文章分类等。
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680608466033.png
categories:
  - [站点运营, SEO]
tags:
  - SEO
  - 优化
  - 文章
  - 网站
  - 优化实战
  - hexo seo
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

## SEO 是什么

SEO 全名为 Search Engine Optimization，是搜索引擎优化的缩写。 SEO 原理是一种利用搜索引擎的规则提高网站在有关搜索引擎内自然排名的方式。 它是一种可衡量、可重复的过程，可用于向搜索引擎发送信号，表明你的页面值得出现在搜索结果中。

## SEO 内容优化技巧

### 使用合适的标题

在页面中使用 H1 标题标记主要内容。此外，确保使用 H2、H3 等副标题来组织和说明页面上的其他内容。

### 增加描述性 meta 标签

在 head 部分中添加 meta 标签并填写描述信息，向搜索引擎解释该网页的主要内容和关键字。

```html
<head>
  <title>页面标题</title>
  <meta name="description" content="页面描述">
  <meta name="keywords" content="关键词">
</head>
```

只要正确添加了 Hexo Front-Matter，Hexo 就会自动为你生成 meta 标签。

![seo meta 标签](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680594944707.png)

### 图像优化

对于每个图像，在 alt 属性中使用适当的文本描述。这有助于提高搜索引擎对页面的理解。同时，压缩图像以减少页面加载时间，并将其大小放在无需滚动即可看到的位置。如下图，可以看到我之前的文章中，有些图片是没有 alt 属性的，这是不合理的。

![seo 图像优化](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680594655436.png)

### 内部链接

添加内部链接，使用户能够轻松浏览相关页面。此外，添加具有含义的锚文本，以便搜索引擎更好地理解您的网站结构。

### 状态码和 URL 结构

确保所有页面都有正确的状态码（如 404 或 301）和规范的 URL 结构。这将有助于保持您的页面在搜索引擎中的良好排名。

可以看到由于我之前博客迁移过一次，造成有很多 404 的页面。

![Google Search 404](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680596391394.png)

Google Search Console 没有批量删除失效链接的功能，如果嫌麻烦，可以给博客配置一个精美的 404 页面。

![Google Search 删除 404 链接](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1680596445237.png)

我有强迫症，正在一点一点地删除失效链接。我的建议就是文章发布之后，不要轻易改动文章的 URL、标题、分类、标签等，这样会造成很多的 404 链接。

### 良好的内容和排版

最后，一个优化 SEO 的重要因素是内容和排版。确保您的页面具有有价值的、原创的、易于阅读的内容，并使用适当的文本格式、段落和标题来使其易于阅读和理解。

### 爬虫友好

1. 提交网站地图：hexo 的话使用 hexo-generator-search 插件
2. robots.txt：告诉爬虫哪些页面可以抓取，哪些页面不可以抓取
3. 减少重复网页，使用 canonical 标签。
4. 使用 rel="nofollow" 标签来告诉爬虫不要抓取外链，hexo 的话使用 hexo-filter-nofollow。

> 注意：请不要给友情链接添加 rel="nofollow" 标签，这样会影响到你的友链网站的 SEO。

- [14个最适合 SEO 的免费 Chrome 扩展程序（亲测好用）](https://ahrefs.com/blog/zh/seo-chrome-extensions/)

### 关键词挖掘

使用关键词优化工具，比如 [Google Keyword Planner](https://ads.google.com/home/tools/keyword-planner/)，来找到最适合您的网站的关键词。

还有一些功能更强大的关键词优化工具：

- [Keyword Planner](https://keywordplanner.net/)
- [Keyword Tool](https://keywordtool.io/)
- [WordStream](https://www.wordstream.com/keywords)
- [好用的Google关键词分析工具](https://www.cifnews.com/article/126696)

除了关键词挖掘工具，你还可以使用 [Google Trends](https://trends.google.com/trends/?geo=US) 来找到热门的关键词，并针对性地去创作文章。

另外还可以直接找排名靠前的文章，看看他们的关键词是怎么做的，直接复制过来就行了。

## 免费自然流量

写博客本来就不盈利，为什么要花钱去买流量呢？下面是一些免费的自然流量工具，可以让你的博客获得更多的免费流量。

- [Traffic Engine](https://www.traffic-engine.com/)：自动的流量交换系统，可以让你的网站获得来自世界各地的免费流量。
- [Somiibo](https://somiibo.com/)：一个免费的社交媒体自动化工具，当然也可以优化网站流量。
- [Spark Traffic](https://www.sparktraffic.com/)：流量机器人免费试用，在短短 1 小时内获得 2000 个免费页面浏览量

## 交换友链

交换友链是一种很好的获取流量的方式，但是要注意的是，不要给不相关的网站交换友链，这样会影响到你的 SEO。我的建议是可以将博客同步到不同的平台，比如 CSDN、掘金、简书等，然后在这些平台上附上原文链接。
