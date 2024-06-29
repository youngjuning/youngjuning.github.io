---
title: 使用 React Router 优化单页应用程序（SPAs）
description: React 通常用于构建单页面应用程序（SPA）。 SPA 往往具有多个页面视图。当从一个页面视图导航到另一个页面视图时，重新加载整个页面视图是一项繁琐且不那么高效的任务。实际上，它会削弱 SPA 的优势。为了正常工作，SPA 必须在需要时呈现部分视图，而不是重新加载整个页面。
date: 2023-03-13 23:12:00
cover: https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678720445359.png
categories:
  - [前端, React]
  - [紫升翻译计划]
tags:
  - React
  - React Router
  - SPA
  - 单页应用程序
---

<!-- DRAFT 使用 React Router 优化单页应用程序（SPAs）  -->

React 通常用于构建单页面应用程序（SPA）。 SPA 往往具有多个页面视图。当从一个页面视图导航到另一个页面视图时，重新加载整个页面视图是一项繁琐且不那么高效的任务。实际上，它会削弱 SPA 的优势。为了正常工作，SPA 必须在需要时呈现部分视图，而不是重新加载整个页面。

在单页应用程序（SPA）中从一个页面导航到另一个页面时，路由起着重要作用。路由可以分为静态和动态两种。SPA应用程序采用动态路由方式。**在这个教程中，我们将会讨论一种流行的和React应用程序一起使用的路由库，它被称为 [React Router](https://reacttraining.com/react-router/web/guides/quick-start)**。

{% hideToggle 原文 %}
React is often used for building single page applications (SPAs). SPAs tend to have multiple page views. When navigating from one-page view to another, reloading the entire page view is a tedious and not so efficient task. In fact, it diminishes the benefits of a SPA. To work as it should, a SPA must render parts of views when required instead of reloading the entire page.

Routing comes into the picture when navigating from one page to another in a SPA app. Routing can be categorized in two ways. Static and dynamic. SPAs follow dynamic approach. **In this tutorial, we will discuss a popular routing library used with React applications known as [React Router](https://reacttraining.com/react-router/web/guides/quick-start)**.

# Requirements

- NodeJS v8.x.x or higher installed along with npm/yarn
- create-react-app installed globally to on your local dev machine generate a new React project

Bonus: You can also, use npx to generate a new React project without installing create-react-app.

# Getting Started

To create a new React project run the following command at the desired location on your local machine.

```sh
create-react-app react-router-v4-demo
```

Once the project is generated, traverse inside the newly created directory. This strategy is the default way to generate a new React app.


React Router as a library contains three different npm packages.

- react-router
- react-router-dom
- react-router-native

Each of the packages has a different use case. The first one, `react-router` is the core package and is used with the next two packages listed above. The `react-router-dom` has to be used when building a web application. This is what we are going to use in this tutorial. The last one, `react-router-native` tends to be used in a [React Native](https://medium.com/crowdbotics/how-to-build-a-real-time-logo-detection-app-with-react-native-google-vision-api-and-crowdbotics-9ed65fbcd15) application.

To add React Router in the React app, execute the following command from a terminal window.

```sh
yarn add react-router-dom
```

Please note that, for the rest of the tutorial, we will be using yarn as the JavaScript package manager to add or remove dependencies. If you wish to use npm, there is no one stopping you.

To run the React app, go to the terminal window and execute the command npm start. This will start the development server. You will be welcomed by the default boilerplate project screen in a web browser window on URL `http://localhost:3000/`.

![Edit src/App.js and save to reload](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678720760813.png)

# First Route with React Router

To create the first route in the React app, let us import BrowserRouter from react-router library.

```tsx
import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
```

To create a route, we use `<Route>` from the react-router-dom. This is where the logic of routing is placed. It renders the UI of a component. A `<Route>` has a prop called path which is always matched with the current location of the app. On the basis of this prop, the desired component gets rendered. When the component is not getting rendered, Routereturns null. The component name is also passed as prop component. Look at the below snippet.

```tsx
function App() {
  return (
    <Router>
      <Route path='/' component={Home} />
    </Router>
  )
}
```

There is the functional App component that returns a BrowserRouter which holds the very first Route component. The path is currently pointing towards the Home component which has the following UI logic.

```tsx
function Home() {
    return (
        <div>
            <h1>Home Component</h1>
        </div>
    )
}
```

Now, visit the URL on port 3000 and you will see the Home component being rendered right now.

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678721815386.png)

This is a bare minimum example. Now let us add another route with the same props like the Home. Call this route About with a similar rendering logic as Home.

```tsx
function About() {
  return (
    <div>
      <h1>About Component</h1>
    </div>
  )
}
```

Now add this functional component as the second route, below the Home route. Also, add both routes inside a div element. A router component can hold a single child element and adding a div solves this problem and allows the router component to have as many children as we want.

```tsx
function App() {
  return (
    <Router>
      <div>
        <Route path='/' component={Home} />
        <Route path='/about' component={About} />
      </div>
    </Router>
  )
}
```

Try visiting the URL `http://localhost:3000/about`. You will notice that both the components are being rendered right now on the path `/about`.

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678721636017.png)

The reason for this is that regular expression engine that React Router uses internally considers both the routes that are being started with a forward slash / equal. To solve this issue, we can use another essential prop on the Home route called exact.

```tsx
<Router>
    <div>
        <Route path='/' exact component={Home} />
        <Route path='/about' component={About} />
    </div>
</Router>
```

This exact is also known as a qualifier which states that the path must match the exactly the / and nothing after it, such as `/about` Now, if you visit the browser window at the URL `http://localhost:3000/about` you will notice that only the about component is getting rendered this time.

# What is BrowserRouter?

Do you remember reading earlier about that `react-router-dom` is used only in case of web applications? Well, `react-router-dom` library holds two types of routers API for a React application to use. One is called BrowserRouter that you have seen in action in the previous section. The other one is called HashRouter.

A BrowserRouter will always listen to URLs like: `http://localhost:3000/about` whereas a HashRouter will have `http://localhost:3000/#/about`, as the name suggests, uses a hash # in between. So why did we use the BrowserRouter?

BrowserRouter is a popular choice among modern day web applications. The main reason behind is that it uses HTML5 History API to keep track of the router history of your React app. The HashRouter has a use case for legacy browsers where window.location.hash is still being used to keep a track of routes in a SPA.

## DIY Exercise 👇

Here is a small task for you. Modify directory structure like below screenshot and separate the two functional components Home and about in their own component files such that, in future, if they grow with more JSX to render.

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678721953570.png)

You can totally skip this if you want and move on to the next section. But performing this small task will benefit you to have an understanding of the above concepts.

# The Link Component

To navigate between to web pages in HTML, there is an `<a href=""></a>` anchor tag available. However, using this traditional approach will lead to a browser refresh. In order to overcome this, React Router API offers a Link component that can be used to navigate to a particular URL or a component.

Let us try to create a navigation menu with this new knowledge. Import Link from `react-router-dom` in `App.js` file. Here is the modified snippet of App component.

```tsx
// App.js

import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

import Home from "./components/Home"
import About from "./components/About"

function App() {
  return (
    <Router>
      <div>
        <nav style={{ margin: 10 }}>
          <Link to='/' style={{ padding: 10 }}>
            Home
          </Link>

          <Link to='/about' style={{ padding: 10 }}>
            About
          </Link>
        </nav>
        <Route path='/' exact component={Home} />
        <Route path='/about' component={About} />
      </div>
    </Router>
  )
}

export default App
```

In the above snippet, notice that all the Links are being added before all the Route components. The styling attributes inside style are optional for now. Start the development server and visit the browser window and you will notice a navigation menu pops up at the top. Try clicking links to navigate between different components.

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678722050699.png)

Wherever a `Link` is rendered in a React project, an anchor `<a>` will be rendered in the application’s HTML.

# Active Links with NavLink

In React Router API, NavLink is the extended version of the `Link` component. You can say that is a special type of the Link that can style itself as to represent the active state when matches the current route.

To demonstrate this, first, let us replace all the `Link` tags with NavLink in `App.js` file.

```tsx
// App.js
import React from "react"
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom"

import Home from "./components/Home"
import About from "./components/About"

function App() {
  return (
    <Router>
      <div>
        <nav style={{ margin: 10 }}>
          <NavLink to='/' style={{ padding: 10 }}>
            Home
          </NavLink>

          <NavLink to='/about' style={{ padding: 10 }}>
            About
          </NavLink>
        </nav>
        <Route path='/' exact component={Home} />
        <Route path='/about' component={About} />
      </div>
    </Router>
  )
}

export default App
```

At this point, each NavLink link is going to behave like an ordinary Link component which means there is no change so far. To make a link active, add an activeClassName prop to that. Such as below.

```tsx
<NavLink to='/' style={{ padding: 10 }} activeClassName='active'>
```

To set up the corresponding CSS for this to work, open `App.css` file and add the below.

```css
a {
  padding: 10px;
}

a,
a:visited {
  color: blue;
}

a.active {
  color: red;
}
```

Do not forget to import this file inside `App.js`. Also, modify the about route to have an activeClassName.

```tsx
import "./App.css"

// ...

return (
  {/* */}
  <nav style={{ margin: 10 }}>
      <NavLink to='/' activeClassName='active'>
          Home
      </NavLink>

      <NavLink to='/about' activeClassName='active'>
          About
      </NavLink>
  </nav>

 {/* */}
)
```

Go back to the browser, open develop tools like below and you will notice, at first, the Home route has a class name active.

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678722233048.png)

Try navigating to the About route and see what happens.

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678722243666.png)

On navigating to About route did you notice that the active class name is also added to the corresponding route? However, the Home route still has the active class even though the URL matches the `/about`. Why?

The way NavLink works is almost similar to Route component in React Router API. To make sure that only one route has the class active state, try modifying the home route in the navigation menu, as below.

```tsx
//App.js

<NavLink to='/' exact activeClassName='active'>
  Home
</NavLink>
```

You will get the desired output this time.

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678722287934.png)

# Adding Parameters to the Routes

In this section, you will learn how to create and manage dynamic routes based on a query parameter such as `:id`. We start by creating a static array in `App.js` file that will serve as the mock data.

The idea is to demonstrate a route as `/posts` which displays all the posts that are coming from the array. However, each post in the array will be having an id or a unique identifier. Using that unique identifier, you will be approaching the concept of dynamic content rendering by writing the logic for URLs such as `/posts/:id` where :id will be represented by the specific id of a post.

To start, let us add a bunch of mock posts in the state inside a new component file called `components/posts.js`.

```tsx
// Posts.js
import React from "react"
import "../App.css"

class Posts extends React.Component {
  state = {
    posts: [
      { id: 1, title: "Hello Blog World!" },
      { id: 2, title: "My second post" },
      { id: 3, title: "What is React Router?" }
    ]
  }

  render() {
    return (
      <div className='posts'>
        <h1>Posts List</h1>
      </div>
    )
  }
}

export default Posts
```

The corresponding styles to the above are added in `App.css` file for brevity.

```css
.posts ul {
  list-style: none;
  margin: 0;
  margin-bottom: 20px;
  padding: 0;
}

.posts ul li {
  padding: 10px;
}

.posts a {
  text-decoration: none;
}
```

Now, import the newly created component inside App.js where other routes already exist.

```tsx
//App.js
// ...
import Posts from "./components/Posts"

function App() {
  return (
    <Router>
      <div>
        <nav style={{ margin: 10 }}>
          <NavLink to='/' exact activeClassName='active'>
            Home
          </NavLink>
          <NavLink to='/about' activeClassName='active'>
            About
          </NavLink>
          <NavLink to='/posts' activeClassName='active'>
            Posts
          </NavLink>
        </nav>
        <Route path='/' exact component={Home} />
        <Route path='/about' component={About} />
        <Route path='/posts' component={Posts} />
      </div>
    </Router>
  )
}

export default App
```

The existing navigation menu has a new route and its called Posts.

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678722701566.png)

Open Posts.js to rend er the list of Posts and display them as a list whenever the current location in the web browser matches `/posts`.

```tsx
import React from "react"
import { Link, Route } from "react-router-dom"
import "../App.css"

function Child({ match }) {
  return (
    <div>
      <h3>ID: {match.params.id}</h3>
    </div>
  )
}

class Posts extends React.Component {
  state = {
    posts: [
      {
        id: 1,
        title: "Hello Blog World!"
      },
      {
        id: 2,
        title: "My second post"
      },
      {
        id: 3,
        title: "What is React Router?"
      }
    ]
  }

render() {
  const { posts } = this.state
    return (
      <div className='posts'>
        <h1>Posts List</h1>
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
        <Route path='/posts/:id' component={Child} />
      </div>
    )
  }
}

export default Posts
```

Also, the Child component reads anything coming from the URL parameters, such as, in the above case, the id of each post. A match object contains information about how a `<Route path>` matched the URL, thus, in our case, the id of each post.

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678722789204.png)

# Conclusion

Hopefully, by now, you are familiar with the basic concepts of how React Router library works. It is a powerful library that helps you build better React apps. If you want to learn more about React Router visit its official documentation here.

You can find the complete for the tutorial at this Github repo.
{% endhideToggle %}

> 原文地址：<https://www.crowdbotics.com/blog/introduction-to-react-router-v4-with-reactjs>
> 原文作者：[amanhimself](https://www.crowdbotics.com/author/amanhimself)
> 译文出自：[紫升翻译计划](https://youngjuning.js.org/categories/%E6%B4%9B%E7%AB%B9%E7%BF%BB%E8%AF%91%E8%AE%A1%E5%88%92/)
