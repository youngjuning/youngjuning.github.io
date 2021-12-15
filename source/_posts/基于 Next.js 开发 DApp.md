---
title: 基于 Next.js 开发 DApp
date: 2021-12-05 22:58:44
cover: https://cdn.jsdelivr.net/gh/youngjuning/images/202112101016728.png
categories:
  - 前端
tags:
  - Next.js
  - ethereum
---

## 项目初始化

```sh
npx create-next-app@latest --typescript
```

安装完成后，根据指示开启开发模式的 server。然后尝试编辑 `pages/index.tsx` 并在浏览器查看结果。

## commitlint

```sh
npx @luozhu/create-commitlint
```

## prettier

### 安装依赖

```sh
yarn add prettier eslint-config-prettier eslint-plugin-prettier @luozhu/prettier-config -D
```

### 配置 .eslintrc.json

```json
{
  "extends": ["next/core-web-vitals", "plugin:prettier/recommended", "prettier"],
  "rules": {
    "no-unused-vars": 1,
    "react-hooks/exhaustive-deps": 0,
    "@next/next/no-img-element": 0
  }
}
```

### 配置 .prettierrc.js

```js
module.exports = require('@luozhu/prettier-config');
```

## lint-staged

安装 lint-staged：

```sh
yarn add lint-staged
```

在 `package.json` 文件中如下配置即可：

```json
{
  "gitHooks": {
    "pre-commit": "lint-staged",
    "commit-msg": "commitlint -e -V"
  },
  "lint-staged": {
    "**/*.{js,jsx,ts,tsx}": [
      "eslint --fix"
    ],
    "**/*.{md,json}": [
      "prettier --write"
    ]
  }
}
```

## 基于根目录导入模块

`baseUrl` 配置选项允许您直接从项目的根目录导入。

```json
// tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

## 模块路径别名

在 tsconfig.json 中加入以下配置：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["./components/*"]
    }
  }
}
```

其他的地址依葫芦画瓢加到 paths 对象中即可。


## redirects 永久重定向

永久重定向不同于重写路由，它会在 url 中表现出来，在 Next.js 中重定向是在 `next.config.js` 中配置的：

```js
let config = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/cryptoyou',
        permanent: true,
      },
    ];
  },
};

module.exports = config;
```

## styled-jsx

next.js 内置支持 styled-jsx，我们要做的是配置支持 sass，首先安装 `@styled-jsx/plugin-sass`：

```sh
yarn add @styled-jsx/plugin-sass sass node-sass -D
```

然后配置 `.babelrc`：

```json
{
  "presets": [
    [
      "next/babel",
      {
        "styled-jsx": {
          "plugins": ["@styled-jsx/plugin-sass"]
        }
      }
    ]
  ]
}
```

> 注意：开启 babel 后，会自动禁用 swc，目前还没有 swc 的支持方案，进度请关注 [[Improvement] Next.JS 12 support + SWC](https://github.com/Thream/styled-jsx-plugin-sass/issues/100)

## antd

### 安装依赖

```sh
yarn add antd
```

### NextJS 使用 Less 编译 Antd

使用 yarn 安装 next-with-less 包，并顺带最新版本的 less 和 less-loader：

```sh
yarn add next-with-less less less-loader
```

并修改 `next.config.js` 配置文件：

```js
// next.config.js
const withLess = require("next-with-less");

/** @type {import('next').NextConfig} */
let config = {
  reactStrictMode: true
};

config = withLess({
  ...config,
  lessLoaderOptions: {
    lessOptions: {
      modifyVars: {
        "@primary-color": "#f74a49",
        "@border-radius-base": ".5em"
      }
    }
  }
});

module.exports = config
```

### 引入 antd less

在 `pages/_app.tsx` 中引入 less

```tsx
import 'antd/lib/style/themes/default.less';
import 'antd/dist/antd.less'
```

### 使用 dayjs 替换 moment.js

按照 [自定义组件](https://ant.design/docs/react/replace-moment-cn#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6) 的方式自定义组件在 Next.js 中是不够的，需要使用 next-transpile-modules 做进一步的处理：

```js
// next.config.js
const withTM = require('next-transpile-modules')([
  'rc-picker',
  'rc-util',
  'antd',
  'rc-pagination',
  'rc-notification',
  '@ant-design/icons',
]);

/** @type {import('next').NextConfig} */
let config = {
  reactStrictMode: true
};

config = withTM(config);

module.exports = config
```

在 `_app.tsx` 中初始化 dayjs：

```tsx
import dayjs from 'dayjs';

// 初始化 dayjs
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
```

### 布局

布局使用的是 antd 的 Layout，我选用的是侧边栏布局。

#### Layout.tsx

```tsx
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;

const Layout = ({children}) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
    </Layout>
  )
}
```

#### Sider.tsx

```tsx
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import menus from 'config/menus';

const { Sider } = Layout;

const AppSider = () => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  return (
    <>
      <Sider breakpoint="lg" collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Menu theme="dark" mode="inline" selectedKeys={[router.pathname]}>
          {menus.map(menu => (
            <Menu.Item key={menu.route} icon={menu.icon}>
              <Link href={menu.route}>
                <a>{menu.name}</a>
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
    </>
  );
};

export default AppSider;
```

#### config/menus.tsx

```tsx
export default [
  {
    route: '/cryptoyou',
    name: 'Crypto You',
    icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/youngjuning/images/202112081051602.png"
        width="30"
        alt="thecryptoyou"
      />
    ),
  },
  {
    route: '/squid',
    name: 'Squid NFT',
    icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/youngjuning/images/202112082111091.png"
        width="30"
        alt="thecryptoyou"
      />
    ),
  },
];
```

### 国际化

antd 提供了一个 React 组件 ConfigProvider 用于全局配置国际化文案。新建 `components/Layout/Provider.tsx`：

```tsx
import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

const Provider = ({ children }) => {
  return <ConfigProvider locale={zhCN}>{children}</ConfigProvider>;
};

export default Provider;
```

然后在 `components/Layout/index.tsx` 中引入：

```tsx
import Provider from './Provider';
export default function AppLayout({ children }) {
  return (
    <Provider>
      // ...
    </Provider>
  );
}
```

### 面包屑导航

参考 [Breadcrumbs and NextJS](https://stackoverflow.com/questions/64541235/breadcrumbs-and-nextjs) 封装了一个 Breadcrumb 组件：


```tsx
import React from 'react';
import Breadcrumbs from 'nextjs-antd-breadcrumbs';

const Example = () => {
  return <Breadcrumbs rootLabel="Home" omitRootLabel={false}/>;
};
```

## 安装 ethers.js

```sh
yarn add ethers.js
```

## 连接 MetaMask

```tsx
import { ethers } from 'ethers';
// ...
useEffect(() => {
  (async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    await provider.send('eth_requestAccounts', []);
    console.log('Account:', await signer.getAddress());
  })();
}, []);
// ...
```
