---
title: GitHub
---

<Alert type="info">
  欢迎 <a href="https://github.com/youngjuning/youngjuning.github.io/edit/main/docs/awesome/github.js">新增数据</a> 并提交 PR.
</Alert>

## 评论系统

### giscus

A comments system powered by GitHub Discussions. :octocat: 💬 💎

- Homepage：https://giscus.app/
- GitHub：https://github.com/laymonage/giscus

### utterances

A lightweight comments widget built on GitHub issues. Use GitHub issues for blog comments, wiki pages and more!

- Homepage：https://utteranc.es/
- GitHub：https://github.com/utterance/utterances

### gitalk

Gitalk is a modern comment component based on Github Issue and Preact.

- Homepage：https://gitalk.github.io/
- GitHub：https://github.com/gitalk/gitalk

## Actions

```jsx
/**
 * inline: true
 */
import React from 'react';
import { actions } from './github';

export default () => {
  return <CardList data={actions} />;
};
```

## profile-readme

### waka-box

> 📊 更新 github pinned 的 gist，包含你每周的 WakaTime 统计。

- Homepage：https://github.com/matchai/waka-box#readme
- GitHub：https://github.com/matchai/waka-box

```jsx
/**
 * inline: true
 */
import React from 'react';
import { profile } from './github';

export default () => {
  return <CardList data={profile} />;
};
```

## 电子书

```jsx
/**
 * inline: true
 */
import React from 'react';
import { ebook } from './github';

export default () => {
  return <CardList data={ebook} />;
};
```

## 工具

```jsx
/**
 * inline: true
 */
import React from 'react';
import { tools } from './github';

export default () => {
  return <CardList data={tools} />;
};
```

## 仓库

```jsx
/**
 * inline: true
 */
import React from 'react';
import { repo } from './github';

export default () => {
  return <CardList data={repo} />;
};
```

## 文章

```jsx
/**
 * inline: true
 */
import React from 'react';
import { article } from './github';

export default () => {
  return <ArtistList data={article} />;
};
```

## 关注

### sxei

> 技术永无止境~~小小程序猿一枚，曾经的 Javaer，现在的 Jser。

- 昵称：小茗同学
- Homepage：https://haoji.me/
- GitHub：https://github.com/sxei
