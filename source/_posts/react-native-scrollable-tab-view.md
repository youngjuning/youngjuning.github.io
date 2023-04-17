---
title: react-native-scrollable-tab-view
description: react-native-scrollable-tab-view 中文文档
cover: https://cdn.jsdelivr.net/gh/youngjuning/images/202109241201260.png
date: 2020-01-30 15:19:19
categories:
  - [前端, React Native]
tags:
  - React Native
  - 文档
  - 翻译
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

## 安装

```sh
$ yarn add react-native-scrollable-tab-view
# support AndroidX
$ yarn add @react-native-community/viewpager
```

***

## renderTabBar

TabBar 的样式，系统提供了两种默认的，分别是 `DefaultTabBar` 和 `ScrollableTabBar`。当然，我们也可以自定义一个。

### DefaultTabBar

Tab 会平分在水平方向的空间

```js
import React from 'react'
import { Text } from 'react-native'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'

export default () => {
  return (
    <ScrollableTabView renderTabBar={() => <DefaultTabBar />}>
      <Text tabLabel="Tab #1">My</Text>
      <Text tabLabel="Tab #2">favorite</Text>
      <Text tabLabel="Tab #3">project</Text>
    </ScrollableTabView>
  )
}
```

### ScrollableTabBar

Tab 可以超过屏幕范围，滚动可以显示

```js
import React from 'react'
import { Text } from 'react-native'
import ScrollableTabView, { ScrollableTabsExample } from 'react-native-scrollable-tab-view'

export default () => {
  return (
    <ScrollableTabView renderTabBar={() => <ScrollableTabsExample />}>
      <Text tabLabel="Tab #1">My</Text>
      <Text tabLabel="Tab #2">favorite</Text>
      <Text tabLabel="Tab #3">project</Text>
    </ScrollableTabView>
  )
}
```

### children

表示所有子视图的数组，请设置 `tabLabel` 属性，你可以实现一个简单地包装组件:

```tsx
import React from 'react'

interface Props {
  tabLabel: string
}

const ScrollableTabViewItem: React.SFC<Props> = props => <>{props.children}</>

export default ScrollableTabViewItem
```

### onChangeTab

Tab 切换之后会触发此方法，包含一个参数（`Object`类型），这个对象有两个参数

- `i`: 被选中的 Tab 的下标（从 0 开始）
- `ref`: 被选中的 Tab 对象（基本用不到）

## 其他 Props

- `tabBarPosition`(String) 默认值 `'top'`
  - `top`：位于屏幕顶部
  - `bottom`：位于屏幕底部
  - `overlayTop`：位于屏幕顶部，悬浮在内容视图之上（看颜色区分：视图有颜色，Tab 栏没有颜色）
  - `overlayBottom`：位于屏幕底部，悬浮在内容视图之上（看颜色区分：视图有颜色，Tab 栏没有颜色）
- `onScroll` (Function): 视图正在滑动的时候触发此方法，包含一个 Float 类型的数字，范围是`[0, tab数量-1]`
- `locked`(Bool): 表示手指是否能拖动视图，默认为 `false`（表示可以拖动）。设为 `true` 的话，我们只能“点击”Tab 来切换视图。
- `initialPage`(Integer): 初始化时被选中的 Tab 下标，默认是 0（即第一页）
- `tabBarUnderlineStyle`(style): 设置 `DefaultTabBar` 和`ScrollableTabBarTab` 选中时下方横线的样式
- `tabBarBackgroundColor`(String): 设置整个 Tab 这一栏的背景颜色
- `tabBarActiveTextColor`(String): 设置选中 Tab 的文字颜色
- `tabBarInactiveTextColor(String)`: 设置未选中 Tab 的文字颜色
- `tabBarTextStyle(Object)`: 设置 Tab 文字的样式，比如字号、字体等
- `style`: 系统 View 都拥有的属性，基本不会涉及到。
- `contentProps`: 这里要稍微说下 react-native-scrollable-tab-view 的实现，其实在 Android 平台底层用的是 `ViewPagerAndroid`，iOS 平台用的是 `ScrollView`。这个属性的意义是：比如我们设置了某个属性，最后这个属性会被应用在 `ScrollView`/`ViewPagerAndroid`，这样会覆盖库里面默认的，通常官方不建议我们去使用。
- `scrollWithoutAnimation`(Bool，默认为 `false`): 设置“点击”Tab 时，视图切换是否有动画，默认为 `false`（即：有动画效果）。
- `prerenderingSiblingsNumber` (Integer): 预加载相近的兄弟节点数量，`Infinity` 表示渲染所有的兄弟节点， 默认值是 `0` 表示渲染当前页面
