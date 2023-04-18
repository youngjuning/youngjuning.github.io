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

<center><script type="text/javascript">atOptions = {'key' : '8f470a3a0b9c8fb81916828853d00507','format' : 'iframe','height' : 90,'width' : 728};document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://harassinganticipation.com/8f470a3a0b9c8fb81916828853d00507/invoke.js"></scr' + 'ipt>');</script></center>

添加以下代码到 `index.js`:

```js
import { AppRegistry, Text, TextInput } from 'react-native'
Text.defaultProps = { ...Text.defaultProps, allowFontScaling: false }
TextInput.defaultProps = { ...TextInput.defaultProps, allowFontScaling: false }
```
