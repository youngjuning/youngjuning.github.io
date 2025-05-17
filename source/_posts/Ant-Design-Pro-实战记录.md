---
title: Ant Design Pro 实战记录
description: '本文记录了使用 Ant Design Pro 开发中后台的一些经验和问题'
cover: 'https://cdn.jsdelivr.net/gh/youngjuning/images@main/1747469127236.png'
date: 2025-05-17 16:04:15
categories:
  - 前端
tags:
  - Ant Design Pro
  - React
  - 前端框架
  - 中后台
  - 实战
  - 项目经验
  - 技术分享
  - 开发技巧
  - 前端开发
  - 前端工程化
  - 前端架构
  - 前端性能优化
  - 前端安全
  - 前端测试
  - 前端工具链
  - 前端社区
---

## 简介

Ant Design Pro 是基于 Ant Design 和 umi 的封装的一整套企业级中后台前端/设计解决方案，致力于在设计规范和基础组件的基础上，继续向上构建，提炼出典型模板/业务组件/配套设计资源，进一步提升企业级中后台产品设计研发过程中的『用户』和『设计者』的体验。随着『设计者』的不断反馈。

## 初始化

```sh
npm i @ant-design/pro-cli -g
pro create myapp
```

然后选择脚手架，simple 是基础模板，只提供了框架运行的基本内容，complete 包含所有区块，不太适合当基础模板来进行二次开发

```
? 🚀 要全量的还是一个简单的脚手架? (Use arrow keys)
❯ simple
  complete
```

> 我这里选择是 complete 脚手架，方便全量的最佳实践

安装依赖：

脚手架初始化成功之后就可以开始进行开发了，Ant Design Pro 提供了一些命令来辅助开发。

```sh
cd myapp && pnpm install
```

## 运行

complete 脚手架运行会报错：[🐛 [BUG] 路由错误 #11189](https://github.com/ant-design/ant-design-pro/issues/11189)，需要修改 `routes.ts` 文件，注释掉 `/user` 路由下的 404 路由（全局有一个 404 可以兜底）：

```js
{
  path: '/user',
  layout: false,
  routes: [
    // {
    //   component: '404',
    //   path: '/*',
    // },
  ],
}
```

然后执行 `yarn start` 即可启动项目。

### 修改调试 MOCK

`app.tsx` 文件中的 `baseURL` 注释掉，或者根据 `isDev` 判断：

```tsx
/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  baseURL: isDev ? '' : 'https://proapi.azurewebsites.net',
  ...errorConfig,
};
```

- [🧐[问题 | question] 如何修改调试Mock](https://github.com/ant-design/ant-design-pro/issues/11446)

## 部署

### netlify

如果不使用 github pages，需要把模版中 `gh-pages` 删掉：

- 删除 `public` 目录下的 `CNAME` 文件
- 删除 `gh-pages` 依赖和 npm script 脚本

然后在 `public` 目录下添加 `_redirects` 文件，内容：

```
<!-- https://gist.github.com/dance2die/acf9a148ec8025364bf0b6cf37367294 -->
/*    /index.html   200
```

- [🐛[BUG] Page not found when reloading Netlify](https://github.com/ant-design/ant-design-pro/issues/7227)
- [Page Not Found on Netlify with React Router](https://www.sung.codes/blog/2018/page-not-found-on-netlify-with-react-router)
