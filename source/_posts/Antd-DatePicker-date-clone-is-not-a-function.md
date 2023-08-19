---
title: Antd <DatePicker /> date.clone is not a function
description: 本文介绍了 Antd <DatePicker /> 组件报 date.clone is not a function 错误的解决方法
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1683531761607.png
date: 2023-05-08 15:36:04
categories:
  - [issues, antd]
tags:
  - antd
  - datepicker
  - date.clone
---

本文介绍了 Antd <DatePicker /> 组件报 date.clone is not a function 错误的解决方法

当我们给 Antd DatePicker 组件设置默认值或通过 `form.setFieldsValue` 设置值时，可能会遇到如下错误：

```bash
<DatePicker /> date.clone is not a function
```

这是因为 Antd DatePicker 组件的默认值必须是 moment 对象，而我们设置的值可能是字符串或者 Date 对象，所以需要将其转换为 moment 对象：

![<DatePicker /> date.clone is not a function](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1683531634144.png)
