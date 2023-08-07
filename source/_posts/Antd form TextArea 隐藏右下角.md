---
title: Antd form TextArea 隐藏右下角
date:  2023-08-05 15:00:00
categories:
  - [前端, antd]
tags:
  - Antd Pro
  - 组件
  - 企业级
  - 中后台
  - textinput
description: 'Antd TextArea 用于多行输入。'
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

## TextArea

```tsx
import React from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

const App: React.FC = () => (
  <>
    <TextArea
      rows={4} 
      placeholder="maxLength is 6"
      maxLength={6}
      style={{
        resize: 'none'
      }}
    />
  </>
);

export default App;
```

## ProFormTextArea

ProFormTextArea 组件本质上是 Form.Item 和 Input.TextArea 的结合，我们可以把他们当成一个 FormItem 来使用，并且支持各种 props。每个表单项都支持 fieldProps 属性来支持设置输入组件的 props。 我们支持了 placeholder 的透传，你可以直接在组件上设置 placeholder。

```tsx
import React from 'react';
import { ProForm, ProFormTextArea } from '@ant-design/pro-components';

const App: React.FC = () => (
  <>
    <ProForm
      onValuesChange={(changeValues) => console.log(changeValues)}
    >
      <ProFormTextArea
        name="text"
        label="名称"
        placeholder="请输入名称"
        fieldProps={{
          style: {
            resize: 'none'
          }
        }}
      />
    </ProForm>
  </>
);

export default App;
```