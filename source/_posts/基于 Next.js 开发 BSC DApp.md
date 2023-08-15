---
title: 基于 Next.js 开发 BSC DApp
date: 2021-12-05 22:58:44
description: 本文记录了基于 Next.js 开发 BSC DApp
cover: https://cdn.jsdelivr.net/gh/youngjuning/images/202112101016728.png
categories:
  - [加密货币,区块链]
tags:
  - Next.js
  - BSC
  - DApp
---

## 项目初始化

```sh
npx create-next-app@latest --typescript
```

安装完成后，根据指示开启开发模式的 server。然后尝试编辑 `pages/index.tsx` 并在浏览器查看结果。

## 开发规范

### commitlint

```sh
npx @luozhu/create-commitlint
```

### prettier

#### 安装依赖

```sh
yarn add prettier eslint-config-prettier eslint-plugin-prettier @luozhu/prettier-config -D
```

#### 配置 .eslintrc.json

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

#### 配置 .prettierrc.js

```js
module.exports = require('@luozhu/prettier-config');
```

### .editorconfig

```
# EditorConfig is awesome: http://EditorConfig.org

# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
quote_type = single # Fix Prettier "prettier.singleQuote" not working in 1.40 vs code
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
```

### lint-staged

安装 lint-staged：

```sh
yarn add lint-staged -D
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

## antd 开发

### 安装依赖

```sh
yarn add antd
```

### NextJS 使用 Less 编译 Antd

使用 yarn 安装 next-with-less 包，并顺带最新版本的 less 和 less-loader：

```sh
yarn add next-with-less less less-loader -D
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
import Sider from './Sider';

const { Header, Content, Footer } = Layout;

const AppLayout = ({children}) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider />
        <Layout className="site-layout">
          <Header style={{ padding: 0, backgroundColor: '#ffffff' }} />
          <Content style={{ margin: '0 16px' }}>{children}</Content>
          <Footer style={{ textAlign: 'center' }}>
            Crypto Meta ©2021 Powered by{' '}
            <a className="default" href="https://nextjs.org/" target="_blank" rel="noreferrer">
              Next.js
            </a>
          </Footer>
        </Layout>
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

## Next.js 开发

### 基于根目录导入模块

`baseUrl` 配置选项允许您直接从项目的根目录导入。

```json
// tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

### 模块路径别名

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


### redirects 永久重定向

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

### 在 pages 目录包含非页面文件

要把测试文件、生成的文件或其他组件使用的文件放在 `pages` 目录中，你可以在扩展名前加上类似 `page` 的字样。

打开 `next.config.js` 并添加 `pageExtensions` 配置：

```js
module.exports = {
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
}
```

然后重命名你的页面，使其有一个包括 `.page` 的文件扩展名（例如，重命名 `MyPage.tsx` 为`MyPage.page.tsx`）。

> 注意：确保你也重命名 `_document.js`、`_app.js`、`_middleware.js`，以及 `pages/api/` 下的文件。

### styled-jsx

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

### 自定义错误页面

#### 404.tsx

```tsx
import { Result, Button } from 'antd';
import Link from 'next/link';

export default function Custom404() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary">
          <Link href="/">
            <a>返回首页</a>
          </Link>
        </Button>
      }
    />
  );
}
```

#### 500.tsx

```tsx
import { Result, Button } from 'antd';
import Link from 'next/link';

export default function Custom500() {
  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong."
      extra={
        <Button type="primary">
          <Link href="/">返回首页</Link>
        </Button>
      }
    />
  );
}
```

## Dapp

### 小狐狸钱包

1. [小狐狸钱包MetaMask新手使用教程](https://zhuanlan.zhihu.com/p/368736357)
2. [使用MetaMask连接到币安智能链(BSC)](https://blog.csdn.net/qq_33583069/article/details/115727642?ivk_sa=1024320u)

### @usedapp/core

#### 安装依赖

```sh
$ yarn add @usedapp/core
```

#### 设置 Provider

你需要做的第一件事是用可选的配置设置 DAppProvider，并将你的整个应用程序包裹在其中。本文中我们编辑 `components/Layout/Provider.tsx`：

```tsx
import React from 'react';
import { DAppProvider, Config, ChainId } from '@usedapp/core';

const config: Config = {
  readOnlyChainId: ChainId.BSC,
  readOnlyUrls: {
    [ChainId.BSC]: 'https://bsc-dataseed1.binance.org/',
  },
};

const Provider = ({ children }) => {
  return (
    <DAppProvider config={config}>{children}</DAppProvider>
  );
};

export default Provider;
```

#### 连接钱包

然后你需要使用 activateBrowserWallet 来激活 provider。最好是在用户点击 “Connect” 按钮时进行。本文中我们新建组件 `components/ConnectButton.tsx`：

```tsx
import React from 'react';
import { Button } from 'antd';
import { useEthers } from '@usedapp/core';
import { LoginOutlined } from '@ant-design/icons';

function ConnectButton() {
  const { activateBrowserWallet } = useEthers();

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  return (
    <Button size="large" type="primary" icon={<LoginOutlined />} onClick={handleConnectWallet}>
      Connect MetaMask
    </Button>
  );
}

export default ConnectButton;
```

#### 钱包余额

`useEtherBalance(address: string)`

提供一种获取账户余额的方法。以账户地址为参数，当数据不可用时（即未连接），返回 ·`BigNumber` 或 `undefined`。要获得当前连接的账户，请使用 `useEthers()`。

```tsx
import { formatEther } from '@ethersproject/units'

export function EtherBalance() {
  const { account } = useEthers()
  const etherBalance = useEtherBalance(account)

  return (
    <div>
      {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}
    </div>
  )
}
```

#### 代币余额

`useTokenBalance(address: string, tokenAddress: string)`

提供一种方法来获取由 `tokenAddress` 指定的 ERC20 代币在所提供地址的余额。当数据不可用时，返回 `BigNumber` 或 `undefined`。

```tsx
import { formatUnits } from '@ethersproject/units'

const BABY = '0x53e562b9b7e5e94b81f10e96ee70ad06df3d2657'

export function TokenBalance() {
  const { account } = useEthers()
  const tokenBalance = useTokenBalance(BABY, account)

  return (
    <div>
      {tokenBalance && <p>BABY: {formatUnits(tokenBalance, 18)}</p>}
    </div>
  )
}
```

#### 参考

- [Build a Web3 Dapp in React & Login with MetaMask](https://dev.to/jacobedawson/build-a-web3-dapp-in-react-login-with-metamask-4chp)

## 部署

### GitHub Pages

如果是 vercel 付费用户，推荐使用 vercel。GitHub Pages 只能部署静态内容，所以需要使用 `next export` 将静态内容导出部署。

首先配置 npm scripts：

```json
"scripts": {
  "preexport": "yarn build",
  "export": "next export"
},
```

然后添加 `.github/workflows/gh-pages.yml`：

```yml
name: github pages
on:
  push:
    branches:
      - main # default branch
jobs:
  deploy:
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v2
      - uses: c-hive/gha-yarn-cache@v2
      - name: Install Dependencies
        run: yarn --non-interactive --silent --ignore-scripts --production=false
      - name: Build Website
        run: yarn export
      - name: Deploy Website
        uses: peaceiris/actions-gh-pages@v3
        with:
          personal_token: ${{ secrets.PERSONAL_TOKEN }}
          external_repository: crypto-meta/crypto-meta.github.io
          publish_dir: ./out

```
