---
title: 2023 React Router 面试题与答案
date: 2023-03-06 19:30:00
description: 前 500 个 ReactJS 面试必知必会问题与答案，这是洛竹诚意翻译的前端 React 面试必备系列的 React Router 面试篇。
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678720116695.png
categories:
  - [前端, React 面试题]
  - [洛竹翻译计划]
tags:
  - React 面试题
  - React 面试
  - React 面试题与答案
  - 前端面试题
  - React Router
  - React Router 面试题
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

# 1. React Router 是什么？

React Router 是一个建立在 React 之上的强大的路由库，它可以帮助你快速添加新的屏幕和流程到你的应用程序，同时保持 URL 与页面上显示的内容同步。

# 2. React Router 与 history 库有什么不同？

React Router 是一个围绕 `history` 库的包装器，它处理与浏览器的 `window.history` 和哈希历史记录的交互。 它还提供了内存历史，这对没有全局历史的环境很有用，如移动应用开发（React Native）和 Node 的单元测试。

# 3. React Router v4 的 `<Router>` 组件是什么？

React Router v4 提供以下 3 个 `<Router>` 组件。

1. `<BrowserRouter>`
2. `<HashRouter>`
3. `<MemoryRouter>`

上述组件将创建*browser*、*hash*和*memory*历史实例。React Router v4 使与你的路由相关的 `history` 实例的属性和方法通过 `router` 对象中的上下文可用。

# 4. `history` 的 `push()` 和 `replace()` 方法的用处是什么？

一个 history 实例有两个方法用于导航。

1. `push()`
2. `replace()`

如果你把 history 看作是一个访问过的位置的数组， `push()` 将在数组中添加一个新的位置，`replace()` 将用新的位置替换数组中的当前位置。

# 5. 如何用 React Router v4 进行程序化导航？

There are three different ways to achieve programmatic routing/navigation within components.

1. **Using the `withRouter()` higher-order function:**

The `withRouter()` higher-order function will inject the history object as a prop of the component. This object provides `push()` and `replace()` methods to avoid the usage of context.

```jsx | pure
import { withRouter } from 'react-router-dom'; // this also works with 'react-router-native'

const Button = withRouter(({ history }) => (
  <button
    type="button"
    onClick={() => {
      history.push('/new-location');
    }}
  >
    {'Click Me!'}
  </button>
));
```

2. **Using `<Route>` component and render props pattern:**

The `<Route>` component passes the same props as `withRouter()`, so you will be able to access the history methods through the history prop.

```jsx | pure
import { Route } from 'react-router-dom';

const Button = () => (
  <Route
    render={({ history }) => (
      <button
        type="button"
        onClick={() => {
          history.push('/new-location');
        }}
      >
        {'Click Me!'}
      </button>
    )}
  />
);
```

3. **Using context:**

This option is not recommended and treated as unstable API.

```jsx | pure
const Button = (props, context) => (
  <button
    type="button"
    onClick={() => {
      context.history.push('/new-location');
    }}
  >
    {'Click Me!'}
  </button>
);

Button.contextTypes = {
  history: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired,
  }),
};
```

# 6. 如何在 React Router v4 中获取查询参数？

The ability to parse query strings was taken out of React Router v4 because there have been user requests over the years to support different implementation. So the decision has been given to users to choose the implementation they like. The recommended approach is to use query strings library.

```javascript
const queryString = require('query-string');
const parsed = queryString.parse(props.location.search);
```

You can also use `URLSearchParams` if you want something native:

```javascript
const params = new URLSearchParams(props.location.search);
const foo = params.get('name');
```

You should use a _polyfill_ for IE11.

# 7. 为什么你得到 `Router may have only one child element` 的警告？

You have to wrap your Route's in a `<Switch>` block because `<Switch>` is unique in that it renders a route exclusively.

At first you need to add `Switch` to your imports:

```javascript
import { Switch, Router, Route } from 'react-router';
```

Then define the routes within `<Switch>` block:

```jsx | pure
<Router>
  <Switch>
    <Route {/* ... */} />
    <Route {/* ... */} />
  </Switch>
</Router>
```

# 8. 如何在 React Router v4 中向 `history.push` 方法传递参数？

While navigating you can pass props to the `history` object:

```javascript
this.props.history.push({
  pathname: '/template',
  search: '?name=sudheer',
  state: { detail: response.data },
});
```

The `search` property is used to pass query params in `push()` method.

# 9. 如何实现 _default_ 或 _NotFound_ 页面？

A `<Switch>` renders the first child `<Route>` that matches. A `<Route>` with no path always matches. So you just need to simply drop path attribute as below

```jsx | pure
<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/user" component={User} />
  <Route component={NotFound} />
</Switch>
```

# 10. 如何在 React Router v4 上获得历史记录？

Below are the list of steps to get history object on React Router v4,

1. Create a module that exports a `history` object and import this module across the project.

For example, create `history.js` file:

```javascript
import { createBrowserHistory } from 'history';

export default createBrowserHistory({
  /* pass a configuration object here if needed */
});
```

2. You should use the `<Router>` component instead of built-in routers. Imported the above `history.js` inside `index.js` file:

```jsx | pure
import { Router } from 'react-router-dom';
import history from './history';
import App from './App';

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  holder,
);
```

3. You can also use push method of `history` object similar to built-in history object:

```javascript
// some-other-file.js
import history from './history';

history.push('/go-here');
```

# 11. 如何在登录后执行自动重定向？

The `react-router` package provides `<Redirect>` component in React Router. Rendering a `<Redirect>` will navigate to a new location. Like server-side redirects, the new location will override the current location in the history stack.

```javascript
import React, { Component } from 'react';
import { Redirect } from 'react-router';

export default class LoginComponent extends Component {
  render() {
    if (this.state.isLoggedIn === true) {
      return <Redirect to="/your/redirect/page" />;
    } else {
      return <div>{'Login Please'}</div>;
    }
  }
}
```
