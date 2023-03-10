---
title: React 面试必知必会
date: 2023-03-06 19:30:00
permalink: react-interview/
description: 前 500 个 ReactJS 面试问题和答案列表....编码练习题即将推出！
sticky: 3
toc_number: false
categories:
  - [前端, React]
  - [洛竹翻译计划, React]
tags:
  - React 面试题
  - React 面试
  - React 面试题与答案
  - 前端面试题
---

# React 核心

## 1. 什么是 React？

React 是一个**开源前端 JavaScript 库**，用于构建用户界面，尤其是单页应用程序。它用于处理 Web 和移动应用程序的视图层。React 是由 Facebook 的软件工程师 [乔丹·沃克](https://github.com/jordwalke) 创建的。React 于 2011 年在 Facebook 的 News Feed 上首次发布，2012 年首次在 Instagram 发布。

## 2. React 的主要特性是什么？

React 的主要特性是:

- 考虑到 DOM 操作内存开销大，React 使用**虚拟 DOM（VirtualDOM）** 替代了真实 DOM（RealDOM）
- 支持**服务端渲染**
- 遵循**单向**数据流或数据绑定
- 使用**可复用/可组合**的 UI 组件来进行视图开发

## 3. 什么是 JSX？

JSX 是 ECMAScript 的类似 XML 的语法扩展（缩写是 JavaScript XML）。实际上，它只是为 `React.createElement()` 函数提供语法糖，为我们提供了在 JavaScript 中使用类 HTML 模板语法的能力。

下面的示例中，`<h1>` 标签内的文本会作为 JavaScript 函数（`React.createElement()`）的返回值返回给 render 函数：

```jsx | pure
class App extends React.Component {
  render() {
    return (
      <div>
        <h1>{'Welcome to React world!'}</h1>
      </div>
    );
  }
}
```

## 4. 元素（Element）和组件（Component）的区别是什么？

元素是一个普通的对象，它描述了你希望以 DOM 节点或其他组件的形式出现在屏幕上的内容。元素可以在其 props 中包含其他 元素。创建一个 React 元素开销很小。一旦创建了元素，就永远不会对其进行修改。

React Element 的对象表示如下：

```js
const element = React.createElement('div', { id: 'login-btn' }, 'Login');
```

上面的 `React.createElement()` 函数会返回一个如下的对象：

```js
{
  type: 'div',
  props: {
    children: 'Login',
    id: 'login-btn'
  }
}
```

最终，它会使用 `ReactDOM.render()` 将元素渲染到 DOM：

```html
<div id="login-btn">Login</div>
```

而**组件**可以用几种不同的方式声明。它可以是带有 `render()` 方法的类。或者，你可以简单地将其定义为一个函数。无论哪种情况，它都将 props 作为输入，并返回 JSX 树作为输出：

```js
const Button = ({ onLogin }) => (
  <div id={'login-btn'} onClick={onLogin}>
    Login
  </div>
);
```

然后将 JSX 编译成 `React.createElement()` 函数：

```js
const Button = ({ onLogin }) =>
  React.createElement('div', { id: 'login-btn', onClick: onLogin }, 'Login');
```

## 5. 如何在 React 中创建组件？

这里有两种可以用方式来创建一个组件：

1. **函数组件：** 这是创建组件最简单的方式。它们是纯 JavaScript 函数，接受 props 对象作为第一个参数并返回 React 元素：

```jsx | pure
function Greeting({ message }) {
  return <h1>{`Hello, ${message}`}</h1>;
}
```

2. **类组件：** 你也可以使用 ES6 的 class 语法来定义一个组件。上面的函数组件可以被改写为：

```jsx | pure
class Greeting extends React.Component {
  render() {
    return <h1>{`Hello, ${this.props.message}`}</h1>;
  }
}
```

## 6. 何时选择类组件或函数组件

如果一个组件需要状态或者生命周期方法，则使用类组件，否则使用函数组件。

然而，从 React 16.8 引入 Hooks 后，你可以在函数组件中使用之前只在类组件中有的特性，比如状态和生命周期方法。

## 7. Pure Components 是什么？

`React.PureComponent` 与 `React.Component` 几乎完全相同，不同之处在于它为你处理了 `shouldComponentUpdate()` 方法。当 props 和 state 改变时，PureComponent 将对 props 和 state 进行浅表比较。另一方面，Component 初始不会将当前 props 和 state 与 nextPorps 和 nextState 进行比较。因此，每当调用 `shouldComponentUpdate` 时，组件将默认重新渲染。

## 8. React 中的 state 是什么？

组件的状态是一个对象，其中包含一些在组件的生命周期中可能会发生变化的信息。我们应该始终尝试使状态尽可能简单，并最大程度减少有状态组件的数量。

让我们来创建一个带有 message 状态的 user 组件：

```jsx | pure
class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: 'Welcome to React world',
    };
  }

  render() {
    return (
      <div>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
```

![state](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8472c6438dfe48068002c5fdf1fbf098~tplv-k3u1fbpfcp-zoom-1.image)

状态类似于 Props，但它是私有的，并由组件完全控制。也就是说除了拥有和设置它的组件之外，其他任何组件都无法访问它。

## 9. React 中的 props 是什么

Props 是组件的输入。它们是单个值或包含一组值的对象，这些对象在创建时会使用类似于 HTML 标签属性的命名约定传递给组件。它们是从父组件传递到子组件的数据。

React 中 props 的主要目的是提供以下组件功能：

1. 将自定义数据传递到你的组件。
2. 触发状态更改。
3. 通过组件的 `render()` 方法中的 `this.props.reactProp` 使用。

举个例子，让我们创建一个带有 `reactProp` 属性的元素：

```jsx | pure
<Element reactProp={'1'} />
```

然后，这个 `reactProp`（或你想出的任何名称）成为附加到 React 的本地 props 对象的属性，该对象最初已经存在于使用 React 库创建的所有组件上。

```js
props.reactProp;
```

## 10. state 和 props 的区别是什么？

props 和 state 都是普通的 JavaScript 对象。尽管它们两者都拥有影响渲染输出的信息，但它们在组件层面的功能却有所不同。将 props 传递给组件类似于传递参数给函数，而 state 则类似于函数中声明的变量一样在组件内进行管理。

## 11. 为什么我们不能直接更新状态？

如果你尝试直接更新状态，React 组件并不会重新渲染。

```javascript
// 错误❌
this.state.message = 'Hello world';
```

正确的做法是使用 `setState()` 方法。它会计划一个对组件状态对象的更新。当状态更改时，组件通过重新渲染进行响应。

```javascript
// 正确✅
this.setState({ message: 'Hello World' });
```

> **注意：**你可以使用构造函数或者最新的 javascript class 字段声明语法直接将其分配给状态对象。

## 12. 回调函数作为 `setState()` 的参数的目的是什么？

setState 完成并重新渲染组件后，将调用回调函数。由于 setState() 是异步的，因此回调函数可用于任何后续操作。

> **注意：**我们建议使用生命周期方法而不是这个回调函数

```javascript
setState({ name: 'John' }, () =>
  console.log('The name has updated and component re-rendered'),
);
```

## 13. HTML 和 React 的事件处理有什么不同？

下面是一些 HTML 和 React 的事件处理的主要不同：

1. 在 HTML 中，事件名应该是全小写的：

```html
<button onclick="activateLasers()"></button>
```

然而在 React 中事件名遵循小驼峰 格式：

```jsx | pure
<button onClick={activateLasers}>
```

2. 在 HTML 中，你应该返回 `false` 来阻止默认行为：

```html
<a href="#" onclick='console.log("The link was clicked."); return false;' />
```

然后在 React 中你必须明确地调用 `preventDefault()`

```javascript
function handleClick(event) {
  event.preventDefault();
  console.log('The link was clicked.');
}
```

3. 在 HTML 中，你调用函数时需要加上 `()`：

然后在 React 中你不应该在函数名后带上 `()`。（比如前面示例中的 `activateLasers` 函数）

## 14. 如何在 JSX 回调函数中绑定方法或事件处理器

这里有 3 个方法做到这一点：

1. **在构造器中绑定：** 在 JavaScript 类中，默认情况下不绑定方法。同样的事情也适用于定义为类方法的 React 事件处理器。通常我们将它们绑定在构造函数中。

```javascript
class Component extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
}
```

2. **类的公共字段语法：** 如果你不喜欢使用绑定的方式，也可以使用类的公共字段语法来正确绑定回调：

```jsx | pure
handleClick = () => {
  console.log('this is:', this);
};
```

```jsx | pure
<button onClick={this.handleClick}>{'Click me'}</button>
```

3. **箭头函数作为回调：** 你可以直接在回调中使用箭头函数

```jsx | pure
<button onClick={event => this.handleClick(event)}>{'Click me'}</button>
```

> **注意：** 如果回调作为 prop 传递给子组件，这些组件可能会触发额外的重渲染。在这些场景中，考虑到性能因素，最佳的选择是使用 `.bind()` 或类的公共字段语法。

## 15. 如何传递参数给事件处理器或回调？

你可以使用一个箭头函数来包裹一个事件处理器并传递参数：

```jsx | pure
<button onClick={() => this.handleClick(id)} />
```

这等价于调用 `.bind` 函数：

```jsx | pure
<button onClick={this.handleClick.bind(this, id)} />
```

除了这两种办法，你也可以传递参数给一个箭头函数：

```jsx | pure
<button onClick={this.handleClick(id)} />;
handleClick = id => () => {
  console.log('Hello, your ticket number is', id);
};
```

## 16. React 中的合成事件是什么？

`SyntheticEvent` 是基于浏览器本地事件的跨浏览器包装。它的 API 与浏览器的本地事件相同，包括 `stopPropagation()` 和 `preventDefault()`，但事件在所有浏览器中的表现均一致。

## 17. 什么是内联条件表达式？

你可以使用 JS 可用的 `if` 语句或三元表达式来有条件地渲染表达式。 除了这些方法之外，还可以通过将所有表达式括在花括号中然后在其后跟 JS 逻辑运算符 `&&` 来将任何表达式嵌入 JSX。

```jsx | pure
<h1>Hello!</h1>;
{
  messages.length > 0 && !isLogin ? (
    <h2>You have {messages.length} unread messages.</h2>
  ) : (
    <h2>You don't have unread messages.</h2>
  );
}
```

## 18. 什么是 `key` prop？在元素数组中使用它的好处是什么？

`key` 是当你创建一个元素数组时应该包含的一个特殊的字符串属性。`key` prop 会帮助 React 识别具体哪一项被修改、添加或被移除。

通常，我们将数据中的 ID 用作 `key`：

```jsx | pure
const todoItems = todos.map(todo => <li key={todo.id}>{todo.text}</li>);
```

如果呈现的项目没有稳定的 ID，退而求其次，我们可以将 `index` 作为 `key`：

```jsx | pure
const todoItems = todos.map((todo, index) => (
  <li key={index.toString()}>{todo.text}</li>
));
```

**注意：**

1. 如果列表项可能改变，不建议使用 `indexes` 作为 `keys`。这可能会对性能产生负面影响，并可能导致组件状态出现问题。
2. 如果你将列表项提取为单独的组件，则在列表组件上应用 `keys` 而不是 `li` 标签。
3. 如果列表项中不存在 `key` prop，则控制台中将出现警告消息。

## 19. refs 有什么用？

refs 用于返回对该元素的引用。在大多数情况下，应避免使用它们，但是，当你需要直接访问 DOM 元素或组件的实例时，它们会很有用。

## 20. 如何创建 refs？

这里有两种方式

1.这是最近添加的方法。使用 `React.createRef()` 方法创建 refs，并通过 ref 属性附加到 React 元素。为了在整个组件中使用 refs，只需将 ref 分配给构造函数中的 instance 属性。

```jsx | pure
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

2. 无论 React 版本如何，你都可以使用 ref 回调方法。例如，搜索栏组件的输入元素的访问方式如下。

```jsx | pure
class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.txtSearch = null;
    this.state = { term: '' };
    this.setInputSearchRef = e => {
      this.txtSearch = e;
    };
  }
  onInputChange(event) {
    this.setState({ term: this.txtSearch.value });
  }
  render() {
    return (
      <input
        value={this.state.term}
        onChange={this.onInputChange.bind(this)}
        ref={this.setInputSearchRef}
      />
    );
  }
}
```

你也可以使用闭包在函数组件中使用 refs。

> **注意：** 你也可以使用内联 ref 回调，即使这不是推荐的方法

## 21. refs 转发是什么？

_Ref 转发_ 是让某些组件可以使用它们接收的 `ref` 的特性，这些组件还可以进一步将其传递给子组件。

```jsx | pure
const ButtonElement = React.forwardRef((props, ref) => (
  <button ref={ref} className="CustomButton">
    {props.children}
  </button>
));

// Create ref to the DOM button:
const ref = React.createRef();
<ButtonElement ref={ref}>{'Forward Ref'}</ButtonElement>;
```

## 22. refs 回调和 `findDOMNode()` 哪个是首选项？

最好使用 refs 回调 而不是 `findDOMNode()` API。因为 `findDOMNode()` 将来会阻止对 React 的某些改进。

使用 `findDOMNode` 的“传统”方法：

```javascript
class MyComponent extends Component {
  componentDidMount() {
    findDOMNode(this).scrollIntoView();
  }

  render() {
    return <div />;
  }
}
```

推荐的方式是：

```javascript
class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.node = createRef();
  }
  componentDidMount() {
    this.node.current.scrollIntoView();
  }

  render() {
    return <div ref={this.node} />;
  }
}
```

## 23. 为什么 Strings Refs 被遗弃了？

如果你以前使用过 React，那么你可能会熟悉一个较旧的 API，其中的`ref` 属性是一个字符串，例如 `ref = {textInput'}`，并且 DOM 节点作为`this.refs.textInput` 访问。我们建议你不要这样做，因为 String 引用有以下问题，并且被认为是旧版的。字符串引用已经在 **React v16 中被删除**。

1. 他们迫使 React 跟踪当前正在执行的组件。这是有问题的，因为它使 React 模块成为有状态的，并因此在打包 React 模块时冲突而引起奇怪的错误。
2. 它们是“不可组合的” — 如果库在传递的子项上放置了引用，则用户不能在其上放置其他引用。回调引用完全可以组合。
3. 他们不能和静态分析工具配合（比如 Flow）。Flow 无法猜测出框架 `this.refs` 上出现的字符串引用及其类型（可能不同）。 回调引用对静态分析更友好。
4. 它无法像大多数人期望的那样使用“渲染回调”模式（例如）

   ```jsx | pure
   class MyComponent extends Component {
     renderRow = index => {
       // This won't work. Ref will get attached to DataTable rather than MyComponent:
       return <input ref={'input-' + index} />;

       // This would work though! Callback refs are awesome.
       return <input ref={input => (this['input-' + index] = input)} />;
     };

     render() {
       return <DataTable data={this.props.data} renderRow={this.renderRow} />;
     }
   }
   ```

## 24. 虚拟 DOM 是什么？

_Virtual DOM_（VDOM）是*Real DOM*的内存表示形式。 UI 的表示形式保留在内存中，并与“真实” DOM 同步。 这是在调用渲染函数和在屏幕上显示元素之间发生的一步。 这整个过程称为 [协调](https://zh-hans.reactjs.org/docs/reconciliation.html)。

## 25. 虚拟 DOM 原理

虚拟 DOM 工作原理只有三个简单的步骤。

1. 无论何时任何基础数据发生更改，整个 UI 都将以虚拟 DOM 表现形式重新呈现。

![vdom](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f8a99a43f7049feb7806a1bd54e5929~tplv-k3u1fbpfcp-zoom-1.image)

2. 然后，计算先前的 DOM 表现形式与新的 DOM 表现形式之间的差异。

![vdom2](https://github.com/sudheerj/reactjs-interview-questions/raw/master/images/vdom2.png)

3. 一旦完成计算，将只会更新内容真正改变的那部分真是 DOM。

![vdom3](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/461ba77627524f96b2bf270c1935b969~tplv-k3u1fbpfcp-zoom-1.image)

## 26. Shadow DOM 和 Virtual DOM 有什么区别？

Shadow DOM 是一种浏览器技术，主要用于确定 web components 中的变量和 CSS。Virtual DOM 是由浏览器 API 之上的 JavaScript 库实现的概念。

## 27. React Fiber 是什么?

Fiber 是 React v16 中新的 [协调](https://zh-hans.reactjs.org/docs/reconciliation.html) 引擎或核心算法的重新实现。React Fiber 的目标是提高其在动画、布局、手势、暂停、中止或重用工作的能力，以及为不同类型的更新分配优先级等方面的适用性和新的并发原语。

## 28. React Fiber 的主要设计目的是什么？

React Fiber 的目标是提高其对动画、布局和手势等领域的适用性。它的 headline 功能是**增量渲染**：能够将渲染工作拆分为多个块并将其分布到多个帧中。

## 29. 受控组件是什么？

在用户输入后能够控制表单中输入元素的组件被称为“受控组件”，比如每一个状态概念都将有一个相关的处理函数

例如下面的例子中，为了将名字转换为全大写，我们使用 `handleChange`：

```javascript
handleChange(event) {
   this.setState({value: event.target.value.toUpperCase()})
}
```

## 30. 非受控组件是什么？

非受控组件是那些把状态维护在其内部的组件，当你想要获得当前值时需要使用 ref 查询 DOM。这有一点像传统的 HTML。

在下面的 `UserProfile` 组件中，`name` 输入被使用 `ref` 获取：

```jsx | pure
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          {'Name:'}
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

## 31. createElement 和 cloneElement 的区别是什么？

JSX 元素将被转换为 `React.createElement()` 函数以创建 React 元素，这些元素将用于 UI 的对象表示。而 `cloneElement` 用于克隆元素并将新的 `props` 传递给它。

**课后扩展：**

- [React 顶层 API](https://zh-hans.reactjs.org/docs/react-api.html)

## 32. React 中的状态提升是什么？

当多个组件需要共享相同的变化数据时，建议将共享状态提升到它们最接近的共同祖先。这意味着，如果两个子组件共享来自其父组件的相同数据，则将状态移到父组件，而不是在两个子组件中都保持内部状态。

## 33. 组件生命周期有哪些不同阶段？

组件生命周期具有三个不同的生命周期阶段。

1. **Mounting：** 组件已准备好安装在浏览器 DOM 中。这个阶段涵盖了生命周期方法 `constructor()`、`getDerivedStateFromProps()`、 `render()` 和 `componentDidMount()` 的初始化。
2. **Updating：** 在此阶段，组件以两种方式进行更新，即发送新 `props` 和从 `setState()` 或 `forceUpdate()` 更新状态。此阶段涵盖了`getDerivedStateFromProps()`，`shouldComponentUpdate()`，`render()` 、`getSnapshotBeforeUpdate()` 和 `componentDidUpdate()` 生命周期方法。
3. **Unmounting：** 在最后一个阶段，不再需要该组件并从浏览器 DOM 上卸载该组件。 这个阶段包括 `componentWillUnmount()` 生命周期方法。

值得一提的是，在将更改应用于 DOM 时，React 内部具有阶段性概念。 它们分开如下

1. **Render：** 该组件将渲染而没有任何副作用。这适用于 Pure 组件，在此阶段，React 可以暂停、中止或重新启动渲染。
2. **Pre-commit：** 在组件将更改实际应用于 DOM 之前，有一段时间可以让 React 通过 `getSnapshotBeforeUpdate()` 从 DOM 中读取内容。
3. **Commit：** React 与 DOM 一起工作并分别执行最终的生命周期：`componentDidMount()` 用于安装，`componentDidUpdate()` 用于更新，以及 `componentWillUnmount()` 用于卸载。

React 16.3+ (或者 [在线交互版本](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/))

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fac807b8490c4c11a9630a9f29e467d3~tplv-k3u1fbpfcp-zoom-1.image)

React 16.3 之前的版本：

![phases 16.2](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33a918a89bdd49c08e80732f5f6af367~tplv-k3u1fbpfcp-zoom-1.image)

## 34. React 生命周期有哪些？

React 16.3 以前的版本：

- **componentWillMount：** 在渲染之前执行，用于根组件中的应用程序级别配置。
- **componentDidMount：** 在首次渲染之后执行，所有 AJAX 请求，DOM 或状态更新以及设置事件侦听器都应在此执行。
- **componentWillReceiveProps：** 在特定属性更新以触发状态转换时执行。
- **shouldComponentUpdate：** 确定是否要更新组件。默认情况下，它返回 `true`。如果你确定在状态或属性更新后不需要渲染组件，则可以返回 `false` 值。这是提高性能的好地方，因为如果组件收到新的 `props`，它可以防止重新渲染。
- **componentWillUpdate：** 当有属性或状态改变被`shouldComponentUpdate()` 确认并返回 `true` 时，在重新渲染组件之前执行。
- **componentDidUpdate：** 通常，它用于响应属性或状态更改来更新 DOM。
- **componentWillUnmount：** 它将用于取消任何传出的网络请求，或删除与该组件关联的所有事件侦听器。

React 16.3+ 版本

- **getDerivedStateFromProps：** 在调用 `render()` 之前被调用，并且在每次渲染中都会被调用。对于需要派生状态的罕见用例，这是存在的。[如果您需要派生状态](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html) 值得一读。
- **componentDidMount：** 在首次渲染之后执行，并且所有 AJAX 请求、DOM 或状态更新以及设置事件侦听器都应在此发生。
- **shouldComponentUpdate：** 确定是否将更新组件。默认情况下，它返回 `true`。如果你确定在状态或属性更新后不需要渲染组件，则可以返回 `false`值。这是提高性能的好地方，因为如果组件接收到新的属性，它可以防止重新渲染。
- **getSnapshotBeforeUpdate：** 在将呈现的输出提交给 DOM 之前立即执行。此方法返回的任何值都将传递到 `componentDidUpdate()` 中。 这对于从 DOM（即滚动位置）捕获信息很有用。
- **componentDidUpdate：** 通常，它用于响应属性或状态更改来更新 DOM。如果 `shouldComponentUpdate()` 返回 `false`，则不会触发。
- **componentWillUnmount：** 它将用于取消任何传出的网络请求，或删除与该组件关联的所有事件侦听器。

## 35. 高阶组件是什么

高阶组件（HOC）是接收组件并返回新组件的函数。基本上，这是从 React 的组成性质衍生出来的一种模式。

我们称它们为纯组件，因为它们可以接受任何动态提供的子组件，但是它们不会修改或复制其输入组件中的任何行为。

```javascript
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

HOC 可以用到很多场景中：

1. 代码重用，逻辑和引导程序抽象。
2. 渲染劫持。
3. 状态抽象和操纵。
4. props 操作。

## 36. 如何为 HOC 组件 创建 props 代理？

您可以使用属性代理模式添加或编辑传递给组件的属性，如下所示：

```jsx | pure
function HOC(WrappedComponent) {
  return class Test extends Component {
    render() {
      const newProps = {
        title: 'New Header',
        footer: false,
        showFeatureX: false,
        showFeatureY: true,
      };

      return <WrappedComponent {...this.props} {...newProps} />;
    }
  };
}
```

**课后扩展：**

- [react 高阶组件的代理模式](https://juejin.cn/post/6844903641074106381)

## 37. context 是什么？

`Context` 提供了一种通过组件树传递数据的方法，而不需要一层一层手动传递属性。

例如，需要由许多组件在应用程序中访问经过身份验证的用户，本地设置首选项，UI 主题等。

```javascript
const { Provider, Consumer } = React.createContext(defaultValue);
```

## 38. 什么是 children 属性？

`Children` 是一个 prop（`this.props.children`），允许你将组件作为数据传递给其他组件，就像你使用的任何其他 prop 一样。放置在组件的开始标记和结束标记之间的组件树将作为 `children` 道具传递给该组件。

React API 中有许多方法可作为该属性。其中包括 `React.Children.map`、`React.Children.forEach`，`React.Children.count`、`React.Children.only` 和 `React.Children.toArray`。

children 的简单用法如下所示：

```jsx | pure
const MyDiv = React.createClass({
  render: function() {
    return <div>{this.props.children}</div>;
  },
});

ReactDOM.render(
  <MyDiv>
    <span>{'Hello'}</span>
    <span>{'World'}</span>
  </MyDiv>,
  node,
);
```

## 39. React 中如何写注释？

React JSX 中的注释和 JavaScript 的多行注释很像，但是用大括号括起来。

**单行注释：**

```jsx | pure
<div>
  {/* 这里是单行注释 */}
  {`Welcome ${user}, let's play React`}
</div>
```

**多行注释：**

```jsx | pure
<div>
  {/* Multi-line comments for more than
   one line */}
  {`Welcome ${user}, let's play React`}
</div>
```

## 40. 在 constructor 中给 `super` 函数传递 props 的目的是什么？

一个子类构造器在 `super()` 方法调用之前是无法拿到 `this` 引用的。这同样也适用于 ES6 中的 sub-classes。调用 `super()` 时传递 props 的主要是为了在子类的构造器中访问 `this.props`。

**传递 props：**

```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    console.log(this.props); // 打印 { name: 'John', age: 42 }
  }
}
```

**不传递 props：**

```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super();

    console.log(this.props); // 打印 undefined

    // 但是 props 参数依然可以访问
    console.log(props); // 打印 { name: 'John', age: 42 }
  }

  render() {
    // 在 constructor 之外没有影响
    console.log(this.props); // 打印 { name: 'John', age: 42 }
  }
}
```

上面的代码片段揭示了 `this.props` 仅在构造函数中有所不同。在构造函数外部表现将是相同的。

更多信息可以参考 [为什么我们要写 super(props) ？](https://overreacted.io/zh-hans/why-do-we-write-super-props/)

大多数场景中，我们建议使用受控组件来代替表单组件。

## 41. 协调（reconciliation）是什么？

当一个组件的 props 或 state 发生变化时，React 通过比较新返回的元素和之前渲染的元素来决定是否有必要进行实际的 DOM 更新。当它们不相等时，React 将更新 DOM。这个过程被称为 _协调（reconciliation）_。

## 42. 如何用一个动态键名来设置状态？

如果你使用 ES6 或 Babel 转码器来转换你的 JSX 代码，那么你可以用计算属性命名完成。

```javascript
handleInputChange(event) {
  this.setState({ [event.target.id]: event.target.value })
}
```

## 43. 每次组件渲染时，函数被调用的常见错误是什么？

你需要确保在传递函数作为参数时，没有调用该函数。

```jsx | pure
render() {
  // 错误❌： handleClick 被调用而不是作为引用被传入
  return <button onClick={this.handleClick()}>{'Click Me'}</button>
}
```

取而代之的是传递函数本身，不加圆括号。

```jsx | pure
render() {
  // 正确：handleClick 是作为一个引用传递的!
  return <button onClick={this.handleClick}>{'Click Me'}</button>
}
```

## 44. lazy 函数是否支持命名导出？

不，目前 `React.lazy` 函数只支持默认出口。如果你想导入被命名导出的模块，你可以创建一个中间模块，将其作为默认出口。这也保证了摇树的工作，不会拉取未使用的组件。

让我们来看看一个导出多个命名组件的组件文件。

```javascript
// MoreComponents.js
export const SomeComponent = /* ... */;
export const UnusedComponent = /* ... */;
```

并在一个中间文件 `IntermediateComponent.js` 中重新导出 `MoreComponents.js` 组件

```javascript
// IntermediateComponent.js
export { SomeComponent as default } from './MoreComponents.js';
```

现在你可以使用下面的 lazy 函数导入该模块。

```javascript
import React, { lazy } from 'react';
const SomeComponent = lazy(() => import('./IntermediateComponent.js'));
```

## 45. 为什么 React 使用 `className` 而不是 `class` 属性？

`class` 是 JavaScript 的一个关键字，而 JSX 是 JavaScript 的一个扩展。这就是为什么 React 使用 `className` 而不是 `class` 的主要原因。传递一个字符串作为 `className` prop。

```jsx | pure
render() {
  return <span className={'menu navigation-menu'}>{'Menu'}</span>
}
```

## 46. 片段（fragments）是什么？

这是 React 中常见的模式，用于一个组件返回多个元素。片段让你可以对一个 children 的列表进行分组，而无需在 DOM 中添加额外的节点。

```jsx | pure
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  )
}
```

这里还有一个短语法可以用，但是很多工具不支持：

```jsx | pure
render() {
  return (
    <>
      <ChildA />
      <ChildB />
      <ChildC />
    </>
  )
}
```

## 47. 为什么片段（fragments）比 div 容器要好？

1. 片段的速度更快一些，并且由于没有创建额外的 DOM 节点而使用更少的内存。这只有在非常大和深的树上才会体现出真正的好处。
2. 一些 CSS 机制，如 Flexbox 和 CSS Grid 有一个特殊的父子关系，在中间添加 div 会使其难以保持所需的布局。
3. DOM 检查器不那么杂乱。

## 48. 什么是 React 中的传递门（Portal）？

传递门是一种推荐的方式，可以将子节点渲染到父组件的 DOM 层次结构之外的 DOM 节点中。

```javascript
ReactDOM.createPortal(child, container);
```

第一个参数是任何可渲染的 React children，比如一个元素、字符串或片段。第二个参数是一个 DOM 元素。

## 49. 什么是无状态组件?

如果行为是独立于其状态的，那么它可以是一个无状态组件。你可以使用函数或类来创建无状态组件。但除非你需要在你的组件中使用生命周期钩子，否则你应该选择函数组件。如果你决定在这里使用函数组件，会有很多好处；它们易于编写、理解和测试，速度稍快，而且你可以完全避免使用 `this` 关键字。

## 50. 什么是状态组件?

如果一个组件的行为依赖于该组件的状态（state），那么它可以被称为有状态的组件。这些有状态的组件总是类组件，并且有一个在构造器（`constructor`）中被初始化的状态。

```javascript
class App extends Component {
  // 也可以使用类字段语法
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    // ...
  }
}
```

**React 16.8 更新：**

Hooks 让你在不写类的情况下使用状态和其他 React 功能。

等效的函数组件

```javascript
import React, {useState} from 'react';

const App = (props) => {
  const [count, setCount] = useState(0);

  return (
    // JSX
  )
}
```

## 51. 如何在 React 中对 props 进行验证？

当应用程序运行在开发模式时，React 会自动检查我们在组件上设置的所有 props，以确保它们具有正确的类型。如果类型不正确，React 会在控制台生成警告信息。由于对性能的影响，它在生产模式中被禁用。必需 props 是用 `isRequired` 定义的。

预定义的 props 类型集合。

1. `PropTypes.number`
2. `PropTypes.string`
3. `PropTypes.array`
4. `PropTypes.object`
5. `PropTypes.func`
6. `PropTypes.node`
7. `PropTypes.element`
8. `PropTypes.bool`
9. `PropTypes.symbol`
10. `PropTypes.any`

我们可以为 `User` 组件定义 `propTypes`，如下所示。

```jsx | pure
import React from 'react';
import PropTypes from 'prop-types';

class User extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
  };

  render() {
    return (
      <>
        <h1>{`Welcome, ${this.props.name}`}</h1>
        <h2>{`Age, ${this.props.age}`}</h2>
      </>
    );
  }
}
```

> 注意：在 React v15.5 中，`PropTypes` 被从 `React.PropTypes` 移到 `prop-types`库中。

等效的函数式组件：

```jsx | pure
import React from 'react';
import PropTypes from 'prop-types';

function User() {
  return (
    <>
      <h1>{`Welcome, ${this.props.name}`}</h1>
      <h2>{`Age, ${this.props.age}`}</h2>
    </>
  );
}

User.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
};
```

## 52. React 的优势是什么？

以下是 React的 主要优势。

1. 通过虚拟 DOM 提高应用程序的性能。
2. JSX 使代码易于阅读和编写。
3. 它在客户端和服务器端都能进行渲染（SSR）。
4. 易于与框架（Angular, Backbone）集成，因为它只是一个视图库。
5. 使用 Jest 等工具容易编写单元和集成测试。

## 53. React 的局限性是什么？

除了优点之外，React 也有一些限制。

1. React 只是一个视图库，不是一个完整的框架。
2. 对于刚接触网络开发的初学者来说，有一个学习曲线。
3. 将 React 整合到传统的 MVC 框架中需要一些额外的配置。
4. 代码的复杂性随着内联模板和 JSX 的增加而增加。
5. 太多的小组件导致了过度工程化或模板化。

## 54. 什么是 React v16 中的错误边界（Error Boundary）？

错误边界是指在其子组件树的任何地方捕获 JavaScript 错误的组件，记录这些错误，并显示一个后备 UI ，而不是崩溃的组件树。

如果一个类组件定义了一个新的生命周期方法 `componentDidCatch(error, info)` 或 `static getDerivedStateFromError()` ，它就成为一个错误边界。

```jsx | pure
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // 你也可以把错误记录到一个错误报告服务中去
    logErrorToMyService(error, info)。
  }

  static getDerivedStateFromError(error) {
    // 更新状态，以便下次渲染时显示回退的用户界面。
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // 你可以渲染任何自定义的回退用户界面
      return <h1>{'Something went wrong.'}</h1>;
    }
    return this.props.children。
  }
}
```

之后把它作为一个普通的组件使用。

```jsx | pure
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

## 55. React v15 中是如何处理错误边界的？

React v15 使用 `unstable_handleError` 方法为错误边界提供了非常基本的支持。在 React v16 中，它已经被重新命名为 `componentDidCatch`。

## 56. 静态类型检查的推荐方式是什么？

通常我们使用 PropTypes 库（`React.PropTypes` 从 React v15.5 开始转移到 `prop-types` 包）来进行 React 应用中的类型检查。对于大型代码库，建议使用静态类型检查器，如 Flow 或 TypeScript，在编译时进行类型检查并提供自动补全功能。

## 57. `react-dom` 包有什么用？

`react-dom` 包提供了 DOM 特定的方法，可以在你的应用程序的顶层使用。大多数组件不需要使用此模块。这个包的一些方法是：

1. `render()`
2. `hydrate()`
3. `unmountComponentAtNode()`
4. `findDOMNode()`
5. `createPortal()`

## 58. `react-dom` 的 render 方法的目的是什么？

此方法用于将 React 元素渲染到提供的容器中的 DOM 中，并返回对组件的引用。如果 React 元素之前已渲染到容器中，它将对其执行更新，并且仅在必要时更改 DOM 以反映最新更改。

```jsx | pure
ReactDOM.render(element, container[, callback])
```

如果提供了可选的回调，它将在组件渲染或更新后执行。

## 59. 什么是 ReactDOMServer？

`ReactDOMServer` 对象使你能够将组件呈现为静态标记（通常用于节点服务器）。该对象主要用于服务器端渲染（SSR）。以下方法可用于服务器和浏览器环境：

1. `renderToString()`
2. `renderToStaticMarkup()`

例如，你通常运行基于 Node 的 Web 服务器（如 Express、Hapi 或 Koa），然后调用 `renderToString` 将根组件渲染为字符串，然后将其作为响应发送。

```javascript
// 使用 Express
import { renderToString } from 'react-dom/server';
import MyPage from './MyPage';

app.get('/', (req, res) => {
  res.write('<!DOCTYPE html><html><head><title>My Page</title></head><body>');
  res.write('<div id="content">');
  res.write(renderToString(<MyPage />));
  res.write('</div></body></html>');
  res.end();
});
```

## 60. 如何在 React 中使用 innerHTML？

`dangerouslySetInnerHTML` 属性是 React 在浏览器 DOM 中使用 `innerHTML` 的替代品。就像 `innerHTML` 一样，考虑到跨站点脚本 (XSS) 攻击，使用此属性是有风险的。你只需要传递一个 `__html` 对象作为键和 HTML 文本作为值。

在这个例子中，MyComponent 使用 `dangerouslySetInnerHTML` 属性来设置 HTML 标记：

```jsx | pure
function createMarkup() {
  return { __html: 'First &middot; Second' };
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

## 61. 如何在 React 使用样式？

`style` 属性接受一个小驼峰命名法属性的 JavaScript 对象，而不是一个 CSS 字符串。这与 DOM 风格的 JavaScript 属性一致，更有效率，并能防止 XSS 安全漏洞。

```jsx | pure
const divStyle = {
  color: 'blue',
  backgroundImage: `url(${imgUrl})`,
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

样式键名是符合驼峰命名法的，以便与在 JavaScript 中访问 DOM 节点的属性相一致（例如 `node.style.backgroundImage`）。

## 62. 事件在 React 中有何不同？

Handling events in React elements has some syntactic differences:

在 React 元素上处理事件有一些语法上的不同：

1. React 事件处理程序使用小驼峰命名，而不是小写。
2. 使用 JSX，你传递一个函数作为事件处理程序，而不是一个字符串。

## 63. 如果你在构造函数中使用 `setState()`，会发生什么？

当你使用 `setState()` 时，除了分配给对象的状态外，React 还重新渲染组件和它的所有子组件。你会得到这样的错误：只能更新一个已挂载或正在挂载的组件。所以我们需要使用 `this.state` 来初始化构造函数中的变量。

## 64. 索引作为键的影响是什么？

键应该是稳定的、可预测的和唯一的，这样 React 就可以跟踪元素。

在下面的代码片段中，每个元素的键都是基于索引的，而不是与被表示的数据相联系。这限制了 React 可以做的优化。

```jsx | pure
{
  todos.map((todo, index) => <Todo {...todo} key={index} />);
}
```

如果你使用元素数据作为唯一键，假设 `todo.id` 在这个列表中是唯一的，并且是稳定的，React 将能够对元素进行重新排序，而不需要像以前那样重新计算它们。

```jsx | pure
{
  todos.map(todo => <Todo {...todo} key={todo.id} />);
}
```

## 65. 在 `componentWillMount()` 方法中使用 `setState` 真的好吗?

是的，在 `componentWillMount()` 方法中使用 `setState()` 是安全的。但同时，建议避免在`componentWillMount()` 生命周期方法中进行异步初始化。`componentWillMount()` 在挂载发生前立即被调用。它在 `render()` 之前被调用，因此在这个方法中设置状态不会触发重新渲染。避免在这个方法中引入任何副作用或订阅。我们需要确保组件初始化的异步调用发生在 `componentDidMount()` 而不是 `componentWillMount()`。

```jsx | pure
componentDidMount() {
  axios.get(`api/todos`).then((result) => {
    this.setState({
      messages: [...result.data]
    })
  })
}
```

## 66. 如果你在初始状态下使用 props，会发生什么？

如果组件上的 props 被改变而组件没有被刷新，新的 props 值将永远不会被显示，因为构造函数永远不会更新组件的当前状态。来自 props 的状态初始化只在组件第一次被创建时运行。

下面这个组件就不会显示更新的输入值。

```jsx | pure
class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      records: [],
      inputValue: this.props.inputValue,
    };
  }

  render() {
    return <div>{this.state.inputValue}</div>;
  }
}
```

在 render 方法中使用 props 将更新数值。

```jsx | pure
class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      record: [],
    };
  }

  render() {
    return <div>{this.props.inputValue}</div>;
  }
}
```

## 67. 你如何有条件地渲染组件？

在某些情况下，你想根据一些状态来渲染不同的组件。JSX 不渲染 `false` 或 `undefined`，所以你可以使用条件性短路来渲染你的组件的某一部分，只有当某个条件为真时。

```jsx | pure
const MyComponent = ({ name, address }) => (
  <div>
    <h2>{name}</h2>
    {address && <p>{address}</p>}
  </div>
);
```

如果你需要一个 `if-else` 条件，则使用三元运算符。

```jsx | pure
const MyComponent = ({ name, address }) => (
  <div>
    <h2>{name}</h2>
    {address ? <p>{address}</p> : <p>{'Address is not available'}</p>}
  </div>
);
```

## 68. 为什么我们在 DOM 元素上传递 props 时需要谨慎？

当我们传递 props 时，我们会遇到添加未知的 HTML 属性的风险，这是一个不好的做法。相反，我们可以使用带有 `...rest` 操作符的 prop 解构，所以它将只添加需要的 prop。

比如说。

```jsx | pure
const ComponentA = () => (
  <ComponentB isDisplay={true} className={'componentStyle'} />
);

const ComponentB = ({ isDisplay, ...domProps }) => (
  <div {...domProps}>{'ComponentB'}</div>
);
```

## 69. 如何在 React 中使用装饰器？

你可以对你的类组件进行装饰，这与将组件传入一个函数是一样的。**装饰器**是修改组件功能的灵活和可读的方式。

```jsx | pure
@setTitle('Profile')
class Profile extends React.Component {
  //....
}

/*
title 是一个字符串，将被设置为文档标题。WrappedComponent 是我们的装饰器在以下情况下会收到的东西直接放在一个组件类上面时，我们的装饰器会收到这样的信息，如上面的例子所示
*/
const setTitle = title => WrappedComponent => {
  return class extends React.Component {
    componentDidMount() {
      document.title = title;
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};
```

**注意：** 装饰器是一个没有进入 ES7 的功能，但目前是一个第二阶段的建议。

## 70. 如何 memo 化一个组件？

有一些可用的缓存库，可以用于函数组件。

例如，`moize` 库可以在另一个组件中对组件进行 memo 化。

```jsx | pure
import moize from 'moize';
import Component from './components/Component'; // 本模块导出一个非 memo 组件

const MemoizedFoo = moize.react(Component);

const Consumer = () => {
  <div>
    {'I will memoize the following entry:'}
    <MemoizedFoo />
  </div>;
};
```

**更新：** 从 React v16.6.0 开始，我们有一个 `React.memo`。它提供了一个更高阶的组件，除非 props 发生变化，否则会将组件缓存。要使用它，只需在使用前用 `React.memo` 包住组件。

```js
const MemoComponent = React.memo(function MemoComponent(props) {
  /* render using props */
});
// 或者
export default React.memo(MyFunctionComponent);
```

## 71. 你如何实现服务器端渲染或SSR？

React 已经具备了在 Nod e服务器上处理渲染的能力。有一个特殊版本的 DOM 渲染器，它与客户端的模式相同。

```jsx | pure
import ReactDOMServer from 'react-dom/server';
import App from './App';

ReactDOMServer.renderToString(<App />)。
```

这个方法将把常规的 HTML 输出为一个字符串，然后可以作为服务器响应的一部分放在页面主体内。在客户端，React 检测到预渲染的内容，并无缝地衔接该内容。

## 72. 如何在 React 中启用生产模式？

你应该使用 Webpack 的 `DefinePlugin` 方法来设置 `NODE_ENV` 为 `production`，通过它来剥离诸如 propType 验证和额外警告的东西。除此之外，如果你对代码进行最小化处理，例如 Uglify 的无效代码消除法，剥离出只用于开发的代码和注释，这将极大地减少你的包的大小。

## 73. 什么是 CRA 以及它的好处？

`create-react-app` CLI 工具允许你快速创建和运行React应用程序，无需配置步骤。

让我们使用 CRA 创建 Todo 应用程序。

```console
# 安装
$ npm install -g create-react-app

# 创建新项目
$ create-react-app todo-app
$ cd todo-app

# 构建、测试、运行
$ npm run build
$ npm run test
$ npm start
```

它包括我们建立一个 React 应用程序所需要的一切。

1. 支持 React、JSX、ES6 和 Flow 语法。
2. 超越 ES6 的语言额外功能，如对象传播操作者。
3. 自动前缀的 CSS，所以你不需要 `-webkit-` 或其他前缀。
4. 一个快速的交互式单元测试运行器，内置支持覆盖率报告。
5. 一个实时的开发服务器，对常见的错误发出警告。
6. 一个构建脚本，用于捆绑 JS、CSS 和图片，并提供哈希和源码图。

## 74. 安装中的生命周期方法的顺序是什么？

当一个组件的实例被创建并插入到 DOM 中时，生命周期方法按以下顺序被调用。

1. `constructor()`
2. `static getDerivedStateFromProps()`
3. `render()`
4. `componentDidMount()`

## 75. 在 React v16 中，有哪些生命周期方法将被废弃？

以下生命周期方法将是不安全的编码做法，在异步渲染中会出现更多问题。

1. `componentWillMount()`
2. `componentWillReceiveProps()`
3. `componentWillUpdate()`

从 React v16.3 开始，这些方法被别名为 `UNSAFE_` 前缀，未加前缀的版本将在 React v17 中被移除。

## 76. `getDerivedStateFromProps()` 生命周期方法的目的是什么？

新的静态的 `getDerivedStateFromProps()` 生命周期方法在一个组件实例化后以及重新渲染前被调用。它可以返回一个对象来更新状态，也可以返回 `null` 来表示新的 props 不需要任何状态更新。

```javascript
class MyComponent extends React.Component {
  static getDerivedStateFromProps(props, state) {
    // ...
  }
}
```

这个生命周期方法与 `componentDidUpdate()` 一起涵盖了 `componentWillReceiveProps()` 的所有用例。

## 77. `getSnapshotBeforeUpdate()` 生命周期方法的目的是什么？

新的 `getSnapshotBeforeUpdate()` 生命周期方法会在 DOM 更新前被调用。这个方法的返回值将作为第三个参数传递给 `componentDidUpdate()`。

```javascript
class MyComponent extends React.Component {
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // ...
  }
}
```

这个生命周期方法与 `componentDidUpdate()` 一起涵盖了 `componentWillUpdate()` 的所有用例。

## 78. Hooks 是否取代了渲染 props 和高阶组件？

渲染 props 和高阶组件都只渲染一个 children，但在大多数情况下，Hooks 是一种更简单的方式，通过减少树中的嵌套来达到这个目的。

## 79. 推荐用什么方式来命名组件？

建议通过引用来命名组件，而不是使用 `displayName`。

使用 `displayName` 来命名组件。

```javascript
export default React.createClass({
  displayName: 'TodoApp',
  // ...
});
```

推荐的方法。

```javascript
export default class TodoApp extends React.Component {
  // ...
}
```

## 80. 建议在组件类中方法的排序是什么？

建议从安装到渲染阶段的方法的排序。

1. `static` 方法
2. `constructor()`
3. `getChildContext()`
4. `componentWillMount()`
5. `componentDidMount()`
6. `componentWillReceiveProps()`
7. `shouldComponentUpdate()`
8. `componentWillUpdate()`
9. `componentDidUpdate()`
10. `componentWillUnmount()`
11. 点击处理程序或事件处理程序，如 `onClickSubmit()` 或 `onChangeDescription()`
12. 渲染的 getter 方法，如 `getSelectReason()` 或 `getFooterContent()`
13. 可选的渲染方法，如 `renderNavigation()` 或 `renderProfilePicture()`
14. render()

## 81. 什么是切换组件？

切换组件是一个渲染许多组件中的一个组件。我们需要使用对象来将 props 值映射到组件。

例如，一个切换组件可以根据 `page` props 显示不同的页面。

```jsx | pure
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ServicesPage from './ServicesPage';
import ContactPage from './ContactPage';

const PAGES = {
  home: HomePage,
  about: AboutPage,
  services: ServicesPage,
  contact: ContactPage,
};

const Page = props => {
  const Handler = PAGES[props.page] || ContactPage;

  return <Handler {...props} />;
};

// PAGES 对象的键可以在 props 类型中使用，以捕捉开发时间错误。
Page.propTypes = {
  page: PropTypes.oneOf(Object.keys(PAGES)).isRequired,
};
```

## 82. 为什么我们需要向 `setState()` 传递一个函数？

这背后的原因是，`setState()` 是一个异步操作。出于性能的考虑，React 会对状态变化进行批处理，所以在调用 `setState()` 后，状态可能不会立即发生变化。这意味着你在调用 `setState()` 时不应该依赖当前的状态，因为你不能确定这个状态会是什么。解决办法是将一个函数传递给 `setState()`，并将之前的状态作为参数。通过这样做，你可以避免由于 `setState()` 的异步性而导致用户在访问时获得旧的状态值的问题。

假设初始计数值为 0。在连续三次递增操作后，该值将只递增一个。

```javascript
// 假设 this.state.count === 0
this.setState({ count: this.state.count + 1 });
this.setState({ count: this.state.count + 1 });
this.setState({ count: this.state.count + 1 });
// this.state.count === 1，而不是 3
```

如果我们给 `setState()` 传递一个函数，计数就会被正确地递增。

```javascript
this.setState((prevState, props) => ({
  count: prevState.count + props.increment,
}));
// this.state.count === 3
```

## 83. 为什么在 `setState()` 中首选函数而不是对象？

React 可以将多个 `setState()` 的调用批量化为一次更新，以提高性能。因为 `this.props` 和 `this.state` 可能被异步更新，你不应该依赖它们的值来计算下一个状态。

这个计数器的例子将无法按预期更新。

```javascript
// 错误❌
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

首选的方法是用函数而不是对象调用 `setState()`。该函数将接收先前的状态作为第一个参数，并将应用更新时的 props 作为第二个参数。

```javascript
// 正确✅
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment,
}));
```

## 84. React 中的严格模式是什么？

`React.StrictMode` 是一个有用的组件，用于暴露应用程序中的潜在问题。就像 `<Fragment>`，`<StrictMode>`不会渲染任何额外的 DOM 元素。它为其后代激活了额外的检查和警告。这些检查只适用于开发模式。

```jsx | pure
import React from 'react';

function ExampleApplication() {
  return (
    <div>
      <Header />
      <React.StrictMode>
        <div>
          <ComponentOne />
          <ComponentTwo />
        </div>
      </React.StrictMode>
      <Footer />
    </div>
  );
}
```

在上面的例子中，严格模式检查只适用于 `<ComponentOne>` 和 `<ComponentTwo>` 组件。

## 85. 为什么 `isMounted()` 是一个反模式，正确的解决方案是什么？

`isMounted()` 的主要用例是避免在组件被卸载后调用 `setState()`，因为它会发出警告。

```javascript
if (this.isMounted()) {
  this.setState({...})
}
```

在调用 `setState()` 之前检查 `isMounted()` 确实可以消除警告，但这也违背了警告的目的。使用 `isMounted()` 是一种代码异味，因为你检查的唯一原因是你认为你可能在组件卸载后还持有一个引用。

一个最佳的解决方案是找到在组件卸载后可能调用 `setState()` 的地方，并修复它们。这种情况通常是由于回调引起的，当一个组件在等待一些数据时，在数据到达之前被卸载。理想情况下，任何回调都应该在 `componentWillUnmount()` 中取消（在解除挂载之前）。

> 代码异味 (Code smell)：程序开发领域，代码中的任何可能导致深层次问题的症状都可以叫做代码异味。 通常，在对代码做简短的反馈迭代时，代码异味会暴露出一些深层次的问题，这里的反馈迭代，是指以一种小范围的、可控的方式重构代码。

## 86. React 中支持哪些指针事件？

指针事件提供了一个处理所有输入事件的统一方法。在过去，我们有一个鼠标和各自的事件监听器来处理它们，但现在我们有许多设备与拥有鼠标不相关，如带有触摸表面的手机或笔。我们需要记住，这些事件只能在支持 Pointer Events 规范的浏览器中工作。

以下事件类型现在在 React DOM 中可用。

1. `onPointerDown`
2. `onPointerMove`
3. `onPointerUp`
4. `onPointerCancel`
5. `onGotPointerCapture`
6. `onLostPointerCapture`
7. `onPointerEnter`
8. `onPointerLeave`
9. `onPointerOver`
10. `onPointerOut`

## 87. 为什么组件名称要以大写字母开头？

如果你使用 JSX 渲染你的组件，该组件的名称必须以大写字母开头，否则 React 将抛出一个错误，即未识别的标签。这个惯例是因为只有 HTML 元素和 SVG 标签可以以小写字母开头。

```jsx | pure
class SomeComponent extends Component {
  // 掘金不止，代码不停
}
```

你可以定义名称以小写字母开头的组件类，但当它被导入时，它应该是大写字母。在这里，小写就可以了。

```jsx | pure
class myComponent extends Component {
  render() {
    return <div />;
  }
}

export default myComponent;
```

而当导入另一个文件时，它应该以大写字母开始。

```jsx | pure
import MyComponent from './MyComponent';
```

### 关于 React 组件的命名，有哪些例外情况？

组件名称应以大写字母开头，但这一惯例也有少数例外。带点的小写标签名（属性访问器）仍被认为是有效的组件名。

例如，下面的标签可以被编译成一个有效的组件。

```jsx | pure
render(){
return (
    <obj.component /> // `React.createElement(obj.component)`
   )
}
```

## 88. React v16 中支持自定义 DOM 属性吗？

是的，在过去，React 习惯于忽略未知的 DOM 属性。如果你写的 JSX 有一个 React 不认识的属性，React 会直接跳过它。

例如，让我们看一下下面的属性。

```jsx | pure
<div mycustomattribute={'something'} />
```

用 React v15 渲染一个空的 div 到 DOM 上。

```html
<div />
```
在 React v16 中，任何未知的属性最终都会出现在 DOM 中。

```html
<div mycustomattribute="something" />
```

这对于提供浏览器特定的非标准属性，尝试新的 DOM API，以及与有主见的第三方库集成是非常有用的。

## 89. constructor 和 getInitialState 的区别是什么？

当使用 ES6 类时，你应该在构造函数中初始化状态，而当使用 `React.createClass()` 时，应该在 `getInitialState()` 方法中初始化状态。

**使用 ES6 类：**

```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /* 初始化状态 */
    };
  }
}
```

**使用 `React.createClass()`：**

```javascript
const MyComponent = React.createClass({
  getInitialState() {
    return {
      /* 初始化状态 */
    };
  },
});
```

**注意：** `React.createClass()` 在 React v16 中已被废弃并删除。请使用普通的 JavaScript 类来代替。

## 90. 你能在不调用 setState 的情况下强制一个组件重新渲染吗？

默认情况下，当你的组件的状态或 props 改变时，你的组件会重新渲染。如果你的 `render()` 方法依赖于其他数据，你可以通过调用 `forceUpdate()` 告诉 React 该组件需要重新渲染。

```javascript
component.forceUpdate(callback);
```

建议避免使用 `forceUpdate()`，只在 `render()` 中读取`this.props` 和 `this.state`。

## 91. 在  React 中使用 ES6 类的，`super()` 和 `super(props)` 之间有什么区别？

当你想在 `constructor()` 中访问 `this.props` 时，你应该把 props 传给 `super()` 方法。

**使用 `super(props)`：**

```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props); // { name: 'John', ... }
  }
}
```

**使用 `super()`：**

```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super();
    console.log(this.props); // undefined
  }
}
```

在 `constructor()` 之外，两者都会显示相同的 `this.props` 的值。

## 92. 如何在 JSX 内循环？

你可以简单地使用 `Array.prototype.map` 与 ES6 箭头函数语法。

例如，对象的 `items` 数组被映射成组件的数组。

```jsx | pure
<tbody>
  {items.map(item => (
    <SomeComponent key={item.id} name={item.name} />
  ))}
</tbody>
```

但你不能用 `for` 循环来迭代。

```jsx | pure
<tbody>
for (let i = 0; i < items.length; i++) {
  <SomeComponent key={items[i].id} name={items[i].name} />
}
</tbody>
```

这是因为 JSX 标签被转换为函数调用，而且你不能在表达式中使用语句。这可能会改变，因为 `do` 表达式是第一阶段的建议。

## 93. 你如何在属性引号中访问 props？

React（或 JSX）不支持属性值内的变量插值。下面的表示方法就不能用了。

```jsx | pure
<img className="image" src="images/{this.props.image}" />
```

但你可以把任何 JS 表达式放在大括号内作为整个属性值。所以下面的表达式是有效的。

```jsx | pure
<img className="image" src={'images/' + this.props.image} />
```

使用模板字符串也可以。

```jsx | pure
<img className="image" src={`images/${this.props.image}`} />
```

## 94. 什么是带 shape 的 React 原型数组？

如果你想把一个对象数组传递给一个具有特定 shape 的组件，那么使用 `React.PropTypes.shape()` 作为 `React.PropTypes.arrayOf()` 的一个参数。

```javascript
ReactComponent.propTypes = {
  arrayWithShape: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      color: React.PropTypes.string.isRequired,
      fontSize: React.PropTypes.number.isRequired,
    }),
  ).isRequired,
};
```

## 95. 如何有条件地应用类属性？

你不应该在引号内使用大括号，因为它将被计算为一个字符串。

```jsx | pure
<div className="btn-panel {this.props.visible ? 'show' : 'hidden'}">
```

相反，你需要把大括号移到外面（别忘了在类名之间包括空格）。

```jsx | pure
<div className={'btn-panel ' + (this.props.visible ? 'show' : 'hidden')}>
```

模板字符串也可以使用。

```jsx | pure
<div className={`btn-panel ${this.props.visible ? 'show' : 'hidden'}`}>
```

## 96. React 和 ReactDOM 之间有什么区别？

`react` 包包含 `React.createElement()`、`React.Component`、`React.Children`, 以及其他与元素和组件类相关的帮助函数。你可以把这些看作是你构建组件所需要的同构或通用助手。`react-dom` 包包含 `ReactDOM.render()`，在 `react-dom/server` 中，我们有 `ReactDOMServer.renderToString()` 和 `ReactDOMServer.renderToStaticMarkup()` 的服务器端渲染支持。

## 97. 为什么 ReactDOM 要从 React 中分离出来？

React 团队致力于将所有与 DOM 相关的功能提取到一个单独的库中，称为 ReactDOM。React v0.14 是第一个分割库的版本。通过查看一些包，`react-native`、`react-art`、`react-canvas`和 `react-three`，已经很清楚，React 的优秀和本质与浏览器或 DOM 无关。

为了建立更多 React 可以渲染的环境，React 团队计划将主 React 包分成两个：`react` 和 `react-dom`。这就为编写可以在网络版 React 和 React Native 之间共享的组件铺平了道路。

## 98. 如何使用 React label 元素？

如果你试图用标准的 `for` 属性渲染一个绑定在文本输入上的 `<label>` 元素，那么它产生的 HTML 会缺少该属性，并在控制台打印出警告。

```jsx | pure
<label for={'user'}>{'User'}</label>
<input type={'text'} id={'user'} />
```

由于 `for` 在 JavaScript 中是一个保留关键字，我们可以使用 `htmlFor` 代替。

```jsx | pure
<label htmlFor={'user'}>{'User'}</label>
<input type={'text'} id={'user'} />
```

## 99. 如何组合多个内联样式对象？

你可以在常规 React 中使用展开语法。

```jsx | pure
<button style={{ ...styles.panel.button, ...styles.panel.submitButton }}>
  {'Submit'}
</button>
```

如果你使用的是 React Native，那么你可以使用数组符号。

```jsx | pure
<button style={[styles.panel.button, styles.panel.submitButton]}>
  {'Submit'}
</button>
```

## 100. 如何在浏览器调整大小时重新渲染视图？

你可以在 `componentDidMount()` 中监听 `resize` 事件，然后更新尺寸（`width` 和 `height`）。你应该在 `componentWillUnmount()` 方法中移除监听器。

```jsx | pure
class WindowDimensions extends React.Component {

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {
    return (
      <span>
        {this.state.width} x {this.state.height}
      </span>
    );
  }
}
```

## 101. `setState()` 和 `replaceState()` 方法之间的区别是什么？

当你使用 `setState()` 时，当前和之前的状态被合并。 `replaceState()` 抛出当前的状态，只用你提供的内容来替换它。通常 `setState()` 会被使用，除非你真的因为某些原因需要删除所有之前的键。你也可以在 `setState()` 中把状态设置为 `false`/`null`，而不是使用 `replaceState()`。

## 102. 如何监听状态变化？

当状态发生变化时，`componentDidUpdate` 生命周期方法将被调用。你可以将提供的状态和 props 值与当前的状态和 props 进行比较，以确定是否有意义的变化。

```
componentDidUpdate(object prevProps, object prevState)
```

**注意：** 以前的 ReactJS 版本也使用 `componentWillUpdate(object nextProps, object nextState)` 监听状态改变。在最新的版本中，它已被弃用。

## 103. 在 React 状态下，删除数组元素的推荐方法是什么？

更好的方法是使用 `Array.prototype.filter()` 方法。

例如，让我们创建一个 `removeItem()` 方法来更新状态。

```javascript
removeItem(index) {
  this.setState({
    data: this.state.data.filter((item, i) => i !== index)
  })
}
```

## 104. 有没有可能在不渲染 HTML 的情况下使用 React 呢？

在最新版本（>=16.2）中可以实现。以下是可用选项。

```jsx | pure
render() {
  return false
}
```

```jsx | pure
render() {
  return null
}
```

```jsx | pure
render() {
  return []
}
```

```jsx | pure
render() {
  return <React.Fragment></React.Fragment>
}
```

```jsx | pure
render() {
  return <></>
}
```

返回 `undefined` 是不行的。

## 105. 如何用 React 打印漂亮的 JSON？

我们可以使用 `<pre>` 标签，这样可以保留 `JSON.stringify()` 的格式。

```jsx | pure
const data = { name: 'John', age: 42 };

class User extends React.Component {
  render() {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }
}

React.render(<User />, document.getElementById('container'));
```

## 106. 为什么你不能在 React 中更新 props？

React 的理念是，props 应该是**不可变的**和**自上而下**的。这意味着父组件可以向子组件发送任何 props 值，但子组件不能修改收到的 props。

## 107. 如何在页面加载时聚焦一个输入框？

你可以通过为 `input` 元素创建 ref 并在 `componentDidMount()` 中使用它。

```jsx | pure
class App extends React.Component {
  componentDidMount() {
    if (this.nameInput) {
      this.nameInput.focus();
    }
  }

  render() {
    return (
      <div>
        <input defaultValue={"Won't focus"} />
        <input
          ref={input => (this.nameInput = input)}
          defaultValue={'Will focus'}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
```

## 108. 更新状态中的对象的方式有哪些？

1. **合并状态和对象后调用 `setState()`：**

- 使用 `Object.assign()` 创建对象的拷贝：

```javascript
const user = Object.assign({}, this.state.user, { age: 42 });
this.setState({ user });
```

- 使用展开操作符：

```javascript
const user = { ...this.state.user, age: 42 };
this.setState({ user });
```

2. **调用 `setState()` 时传入函数：**

```javascript
this.setState(prevState => ({
  user: {
    ...prevState.user,
    age: 42,
  },
}));
```

## 109. 我们如何在浏览器中查看运行时的 React 的版本？

你可以使用 `React.version` 来获取版本。

```jsx | pure
const REACT_VERSION = React.version;

ReactDOM.render(
  <div>{`React version: ${REACT_VERSION}`}</div>,
  document.getElementById('app'),
);
```

## 110. 在 `create-react-app` 中包含 polyfills 的方法是什么？

有一些方法可以在 create-react-app 中包含 polyfills。

1. **手动从 `core-js` 引入：**

创建一个名为（类似）`polyfills.js` 的文件并将其导入根 `index.js` 文件。运行 `npm install core-js` 或 `yarn add core-js` 并导入你所需要的特定功能。

```javascript
import 'core-js/fn/array/find';
import 'core-js/fn/array/includes';
import 'core-js/fn/number/is-nan';
```

2. **使用 Polyfill 服务：**

使用 polyfill.io CDN，通过在 `index.html` 中添加这一行来检索自定义的、针对浏览器的 polyfills。

```html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Array.prototype.includes"></script>
```

在上面的脚本中，我们必须明确请求 `Array.prototype.includes` 功能，因为它不包括在默认功能集中。

## 111. 如何在 create-react-app 中使用 https 而不是 http？

你只需要是用 `HTTPS=true` 配置。你可以编辑 `package.json` scripts 部分：

```json
"scripts": {
 "start": "set HTTPS=true && react-scripts start"
}
```

或者运行 `set HTTPS=true && npm start`

## 112. 如何避免在 create-react-app 中使用相对路径导入？

在项目里根目录创建一个叫 `.env` 的文件并写入导入的路径：

```
NODE_PATH=src/app
```

然后重启调试服务器。现在你应该能够在 `src/app` 目录下不使用相对路径导入任何东西。

## 113. 如何在 React Router 中添加 Google Analytics？

在 `history` 对象上添加一个监听器，以记录每个页面的浏览。

```javascript
history.listen(function(location) {
  window.ga('set', 'page', location.pathname + location.search);
  window.ga('send', 'pageview', location.pathname + location.search);
});
```

## 114. 如何每秒更新一次组件？

你需要使用 `setInterval()` 来触发变化，但你也需要在组件卸载时清除计时器以防止错误和内存泄漏。

```javascript
componentDidMount() {
  this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000)
}

componentWillUnmount() {
  clearInterval(this.interval)
}
```

## 115. 如何在 React 中对内联样式使用 CSS 厂商前缀？

React 不会自动应用 CSS 厂商前缀。你需要手动添加 CSS 厂商前缀。

```jsx | pure
<div
  style={{
    transform: 'rotate(90deg)',
    WebkitTransform: 'rotate(90deg)', // 注意大写 'W'
    msTransform: 'rotate(90deg)', // 'ms' 是全小写
  }}
/>
```

## 116. 如何使用 React 和 ES6 导入和导出组件？

你应该使用默认值来导出组件

```jsx | pure
import React from 'react';
import User from 'user';

export default class MyProfile extends React.Component {
  render() {
    return <User type="customer">//...</User>;
  }
}
```

有了导出指定符，MyProfile 将成为成员并导出到这个模块，同样可以在其他组件中导入而不提及名称。

## 117. 为什么组件构造器只会被调用一次？

React 的 reconciliation（协调） 算法假定，在没有任何相反信息的情况下，如果一个自定义组件在随后的渲染中出现在相同的地方，它就是之前的那个组件，所以 React 重用之前的实例而不是创建一个新的。

## 118. 如何在 React 中定义常量？

你可以使用 ES7 的 `静态` 字段来定义常量。

```javascript
class MyComponent extends React.Component {
  static DEFAULT_PAGINATION = 10;
}
```

静态字段是类字段第三阶段提案的一部分。

## 119. 如何在 React 中以编程方式触发点击事件？

你可以使用 ref props 通过回调获得对底层 `HTMLInputElement` 对象的引用，将该引用存储为类属性，然后使用该引用从事件处理程序中使用 `HTMLElement.click` 方法触发点击。

这可以分两步进行。

1. 在 render 方法中创建 ref：

```jsx | pure
<input ref={input => (this.inputElement = input)} />
```

2. 在你的事件处理程序中应用点击事件。

```javascript
this.inputElement.click();
```

## 120. 有可能在纯 React 中使用 async/await 吗？

如果你想在 React 中使用 `async`/`await`，你将需要 Babel 和 [transform-async-to-generator](https://babeljs.io/docs/en/babel-plugin-transform-async-to-generator) 插件。React Native 已经包含了 Babel 和一系列的转换功能。

## 121. React 的常见文件夹结构是什么？

React 项目文件结构有两种常见做法。

1. **按特性或路由分组：***

一种常见的项目结构方式是将 CSS、JS 和测试放在一起，按特性或路由分组。

```
common/
├─ Avatar.js
├─ Avatar.css
├─ APIUtils.js
└─ APIUtils.test.js
feed/
├─ index.js
├─ Feed.js
├─ Feed.css
├─ FeedStory.js
├─ FeedStory.test.js
└─ FeedAPI.js
profile/
├─ index.js
├─ Profile.js
├─ ProfileHeader.js
├─ ProfileHeader.css
└─ ProfileAPI.js
```

2. **按文件类型分组：**

另一种流行的项目结构方式是将类似的文件分组。

```
api/
├─ APIUtils.js
├─ APIUtils.test.js
├─ ProfileAPI.js
└─ UserAPI.js
components/
├─ Avatar.js
├─ Avatar.css
├─ Feed.js
├─ Feed.css
├─ FeedStory.js
├─ FeedStory.test.js
├─ Profile.js
├─ ProfileHeader.js
└─ ProfileHeader.css
```

## 122. 有哪些流行的动画包？

React Transition Group 和 React Motion 是 React 生态系统中流行的动画包。

## 123. 样式模块的好处是什么？

我们建议避免在组件中硬编码样式值。任何可能在不同的 UI 组件中使用的值都应该被提取到它们自己的模块中。

例如，这些样式可以被提取到一个单独的组件中。

```javascript
export const colors = {
  white,
  black,
  blue,
};

export const space = [0, 8, 16, 32, 64];
```

然后在其他组件中单独导入。

```javascript
import { space, colors } from './styles';
```

## 124. 有哪些流行的 React 专用 linter？

ESLint 是一个很流行的 JavaScript linter。有一些插件可以用来分析特定的代码风格。其中最常见的 React 插件是一个名为 `eslint-plugin-react` 的 npm 包。默认情况下，它将检查一些最佳实践，其规则是检查从迭代器中的键到一整套道具类型的东西。

另一个流行的插件是 `eslint-plugin-jsx-a11y`，它将帮助修复可访问性方面的常见问题。由于 JSX 提供了与常规 HTML 稍有不同的语法，例如 `alt` 文本和 `tabindex` 的问题将不会被常规插件发现。

## 125. 如何进行 AJAX 调用，应该在哪个组件的生命周期方法中进行 AJAX 调用？

你可以使用 AJAX 库，如 Axios、jQuery AJAX，以及浏览器内置的 `fetch`。你应该在 `componentDidMount()` 生命周期方法中获取数据。这样你就可以在获取数据时使用 `setState()` 来更新你的组件。

例如，从 API 获取的雇员名单并设置本地状态。

```jsx | pure
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      error: null,
    };
  }

  componentDidMount() {
    fetch('https://api.example.com/items')
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            employees: result.employees,
          });
        },
        error => {
          this.setState({ error });
        },
      );
  }

  render() {
    const { error, employees } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else {
      return (
        <ul>
          {employees.map(employee => (
            <li key={employee.name}>
              {employee.name}-{employee.experience}
            </li>
          ))}
        </ul>
      );
    }
  }
}
```

## 126. 什么是渲染 props？

**渲染 props**是一种简单的技术，使用一个 props 在组件之间共享代码，其值是一个函数。下面的组件使用渲染 props，它返回一个 React 元素。

```jsx | pure
<DataProvider render={data => <h1>{`Hello ${data.target}`}</h1>} />
```

React Router 和 DownShift 等库正在使用这种模式。

# React Router

## 1. React Router 是什么？

React Router 是一个建立在 React 之上的强大的路由库，它可以帮助你快速添加新的屏幕和流程到你的应用程序，同时保持 URL 与页面上显示的内容同步。

## 2. React Router 与 history 库有什么不同？

React Router 是一个围绕 `history` 库的包装器，它处理与浏览器的 `window.history` 和哈希历史记录的交互。 它还提供了内存历史，这对没有全局历史的环境很有用，如移动应用开发（React Native）和 Node 的单元测试。

## 3. React Router v4 的 `<Router>` 组件是什么？

React Router v4 提供以下 3 个 `<Router>` 组件。

1. `<BrowserRouter>`
2. `<HashRouter>`
3. `<MemoryRouter>`

上述组件将创建*browser*、*hash*和*memory*历史实例。React Router v4 使与你的路由相关的 `history` 实例的属性和方法通过 `router` 对象中的上下文可用。

## 4. `history` 的 `push()` 和 `replace()` 方法的用处是什么？

一个 history 实例有两个方法用于导航。

1. `push()`
2. `replace()`

如果你把 history 看作是一个访问过的位置的数组， `push()` 将在数组中添加一个新的位置，`replace()` 将用新的位置替换数组中的当前位置。

## 5. 如何用 React Router v4 进行程序化导航？

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

## 6. 如何在 React Router v4 中获取查询参数？

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

## 7. 为什么你得到 `Router may have only one child element` 的警告？

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

## 8. 如何在 React Router v4 中向 `history.push` 方法传递参数？

While navigating you can pass props to the `history` object:

```javascript
this.props.history.push({
  pathname: '/template',
  search: '?name=sudheer',
  state: { detail: response.data },
});
```

The `search` property is used to pass query params in `push()` method.

## 9. 如何实现 _default_ 或 _NotFound_ 页面？

A `<Switch>` renders the first child `<Route>` that matches. A `<Route>` with no path always matches. So you just need to simply drop path attribute as below

```jsx | pure
<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/user" component={User} />
  <Route component={NotFound} />
</Switch>
```

## 10. 如何在 React Router v4 上获得历史记录？

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

## 11. 如何在登录后执行自动重定向？

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
