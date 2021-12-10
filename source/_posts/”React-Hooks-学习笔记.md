---
title: ”React Hooks 学习笔记
date: 2021-12-10 10:44:31
cover: https://cdn.jsdelivr.net/gh/youngjuning/images/202112101055275.png
categories:
  - 前端
tags:
  - react
  - hooks
---

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
