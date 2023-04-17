---
title: React Native 配置字体大小不随字体设置变化
description: 本文记录了 React Native 如何配置字体大小不随字体设置变化
date: 2020-02-20 15:38:31
categories:
  - [前端, React Native]
tags:
  - 字体
  - React Native
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

添加以下代码到 `index.js`:

```js
import { AppRegistry, Text, TextInput } from 'react-native'
Text.defaultProps = { ...Text.defaultProps, allowFontScaling: false }
TextInput.defaultProps = { ...TextInput.defaultProps, allowFontScaling: false }
```
