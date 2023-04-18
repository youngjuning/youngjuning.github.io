---
title: hexo-theme-butterfly 魔改与美化
date: 2023-02-22 14:18:09
description: 本文将介绍本站对 hexo-theme-butterfly 进行的一些美化和魔改。
categories:
  - 站点运营
tags:
  - hexo
  - hexo-theme-butterfly
  - 魔改
  - 美化
---

<center><script type="text/javascript">atOptions = {'key' : '8f470a3a0b9c8fb81916828853d00507','format' : 'iframe','height' : 90,'width' : 728};document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://harassinganticipation.com/8f470a3a0b9c8fb81916828853d00507/invoke.js"></scr' + 'ipt>');</script></center>

> 当前魔改基于 hexo 6.3.0 和 hexo-theme-butterfly 4.7.0

# patch-package 配置

patch-package 可以将你的魔改记录保存到 `patches` 文件夹下，方便下次更新主题后应用魔改。按照下面的代码修改 package.json 即可：

```diff
{
  "scripts": {
+    "postinstall": "npx patch-package"
  }
}
```

如果你想直接应用我的魔改，可以直接复制本文的代码到 `patches/hexo-theme-butterfly+4.7.0.patch`

# 两个小人

{% tabs 两个小人 %}
<!-- tab 改动点 -->
```diff
diff --git a/node_modules/hexo-theme-butterfly/layout/includes/widget/card_announcement.pug b/node_modules/hexo-theme-butterfly/layout/includes/widget/card_announcement.pug
index 9e63627..905342a 100644
--- a/node_modules/hexo-theme-butterfly/layout/includes/widget/card_announcement.pug
+++ b/node_modules/hexo-theme-butterfly/layout/includes/widget/card_announcement.pug
@@ -4,3 +4,4 @@ if theme.aside.card_announcement.enable
       i.fas.fa-bullhorn.fa-shake
       span= _p('aside.card_announcement')
     .announcement_content!= theme.aside.card_announcement.content
+      .twopeople!= '<div class="twopeople"><div class="container" style="height:200px;"><canvas class="illo" width="800" height="800" style="max-width: 200px; max-height: 200px; touch-action: none; width: 640px; height: 640px;"></canvas></div><script src="https://cdn.jsdelivr.net/gh/Justlovesmile/CDN/js/twopeople1.js"></script><script src="https://cdn.jsdelivr.net/gh/Justlovesmile/CDN/js/zdog.dist.js"></script><script id="rendered-js" src="https://cdn.jsdelivr.net/gh/Justlovesmile/CDN/js/twopeople.js"></script><style>.twopeople{margin: 0;align-items: center;justify-content: center;text-align: center;}canvas {display: block;margin: 0 auto;cursor: move;}</style></div>'
```
<!-- endtab -->
<!-- tab 效果预览 -->
![效果预览](https://picbed.qunarzz.com/f3d661e2088ea4fd706709ee1024adce.png)
<!-- endtab -->
{% endtabs %}

> 鸣谢 https://guole.fun/posts/butterfly-custom/

# 站点 Logo 圆角

```diff
diff --git a/node_modules/hexo-theme-butterfly/source/css/_layout/head.styl b/node_modules/hexo-theme-butterfly/source/css/_layout/head.styl
index ade0db3..956a69e 100644
--- a/node_modules/hexo-theme-butterfly/source/css/_layout/head.styl
+++ b/node_modules/hexo-theme-butterfly/source/css/_layout/head.styl
@@ -289,6 +289,7 @@
       margin-right: 6px
       height: 36px
       vertical-align: middle
+      border-radius: 50%

   #toggle-menu
     display: none
```
