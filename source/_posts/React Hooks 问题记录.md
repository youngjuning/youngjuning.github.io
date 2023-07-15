---
title: React Hooks 问题记录
description: 本文记录了一些 React Hooks 使用中的问题
date: 2021-12-10 10:44:31
cover: https://cdn.jsdelivr.net/gh/youngjuning/images/202112101055275.png
categories:
  - [前端, React]
tags:
  - react
  - hooks
  - useEffect
  - useState
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

## Warning: Can't perform a React state update on an unmounted component

由于 `useEffect` 中有异步操作，当组件卸载后异步操作结束并执行 state 操作，React 就会提醒存在内存泄漏的风险。在 React Hooks 中，解决方法是在异步操作中判断是否组件被卸载了。代码如下：

```js
function useAsync(asyncFn, onSuccess) {
  useEffect(() => {
    let isActive = true;
    asyncFn().then(data => {
      if (isActive) onSuccess(data);
    });
    return () => { isActive = false };
  }, [asyncFn, onSuccess]);
}
```

实际项目中，我们可以使用 ahooks 提供的功能更强大的 `useAsyncEffect`：

```js
import { useAsyncEffect } from 'ahooks';
import React, { useState } from 'react';

function mockCheck(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 3000);
  });
}

export default () => {
  const [pass, setPass] = useState<boolean>(null);

  useAsyncEffect(async () => {
    setPass(await mockCheck());
  }, []);

  return (
    <div>
      {pass === null && 'Checking...'}
      {pass === true && 'Check passed.'}
    </div>
  );
};
```
