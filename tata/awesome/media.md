---
title: 新媒体运营
---

```jsx
/**
 * inline: true
 */
import React from 'react';
import data from './media';

export default () => {
  return <CardList data={data} />;
};
```

## 数据分析

### 次幂数据

> 公众号数据分析平台

- Homepage：https://www.cimidata.com/
- 功能：精准找号、公众号榜单、发文监控、爆款文章

## 设计

```jsx
/**
 * inline: true
 */
import React from 'react';
import { design } from './media';

export default () => {
  return <CardList data={design} />;
};
```

## 免费图源

```jsx
/**
 * inline: true
 */
import React from 'react';
import { picture } from './media';

export default () => {
  return <CardList data={picture} />;
};
```

## 微信公众号

```jsx
/**
 * inline: true
 */
import React from 'react';
import { wechat } from './media';

export default () => {
  return <CardList data={wechat} />;
};
```

## 文章

```jsx
/**
 * inline: true
 */
import React from 'react';
import { artist } from './media';

export default () => {
  return <ArtistList data={artist} />;
};
```
