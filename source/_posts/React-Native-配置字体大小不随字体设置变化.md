---
title: React Native 配置字体大小不随字体设置变化
date: 2020-02-20 15:38:31
categories:
  - 前端
tags:
  - 字体
  - React Native
---

添加以下代码到 `index.js`:

```js
import { AppRegistry, Text, TextInput } from 'react-native'
Text.defaultProps = { ...Text.defaultProps, allowFontScaling: false }
TextInput.defaultProps = { ...TextInput.defaultProps, allowFontScaling: false }
```
