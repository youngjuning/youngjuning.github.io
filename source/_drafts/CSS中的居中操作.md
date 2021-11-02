---
title: CSS中的居中操作
date: 2020-06-03 13:35:13
categories:
  - [前端开发,CSS]
tags:
---

![](https://i.loli.net/2020/06/03/RVGzPKoXgYINsAc.jpg)

居中的效果是Web开发中常见的需求，几乎和阴影、圆角可以并列为产品三大法宝，本文的目的是捋顺开发中常用的居中计较，方便记忆和日后查阅。为了方便演示，本文所有 demo 使用 React 的 CSS-in-JS 语法完成。

<!--more-->

## 单行文本

### height、lineHeight、textAlign

```jsx
<div
  style={{
    boxSizing: 'border-box',
    height: '100px',
    width: '300px',
    background: 'purple',
    color: '#fff',
    textAlign: 'center',
    lineHeight: '98px',
    border: '1px solid red',
  }}
>
  单行文本
</div>
```

### Flex

```jsx
<div
  style={{
    height: '100px',
    width: '300px',
    background: 'purple',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  单行文本
</div>
```

## 多行文本居中

### table-cell、vertical-align

```jsx
<div
  style={{
    boxSizing: 'border-box',
    height: '100px',
    width: '300px',
    background: 'purple',
    color: '#fff',
    display: 'table-cell',
    verticalAlign: 'middle',
  }}
>
  多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本
</div>
```

### Flex

```jsx
<div
  style={{
    height: '100px',
    width: '300px',
    background: 'purple',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本多行文本
</div>
```

## 图片居中

### table-cell、verticalAlign、textAlign

```jsx
<div
  style={{
    height: '100px',
    width: '300px',
    background: 'purple',
    display: 'table-cell',
    verticalAlign: 'middle',
    textAlign: 'center',
  }}
>
  <img src="http://iph.href.lu/50x50" alt="" />
</div>
```

### Flex

```jsx
<div
  style={{
    height: '100px',
    width: '300px',
    background: 'purple',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <img src="http://iph.href.lu/50x50" alt="" />
</div>
```

## 块级元素

### 子绝父相

```jsx
<div
  style={{
    height: '100px',
    width: '300px',
    background: 'purple',
    position: 'relative',
  }}
>
  <div
    style={{
      background: '#fff',
      width: '50px',
      height: '50px',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
    }}
  />
</div>
```

### Flex

```jsx
<div
  style={{
    height: '100px',
    width: '300px',
    background: 'purple',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <div
    style={{
      background: '#fff',
      width: '50px',
      height: '50px',
    }}
  />
</div>
```

## 联系作者

> 本文首发于个人博客：https://youngjuning.js.org/

|                           作者微信                           |                           知识星球                           |                           赞赏作者                           |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="https://user-gold-cdn.xitu.io/2020/2/24/17074acbb24c7412?w=200&h=200&f=jpeg&s=17183" style="width:200px"/> | <img src="https://user-gold-cdn.xitu.io/2020/2/24/17074acbb26af8e1?w=200&h=200&f=png&s=39093" style="width:200px"/> | <img src="https://user-gold-cdn.xitu.io/2020/2/24/17074acbb338c643?w=698&h=700&f=png&s=315492" style="width:200px"/> |
