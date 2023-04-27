---
title: 「译」Babel 新手向
tags: [nodejs, 翻译]
---

> 怕什么真理无穷，进一寸有一寸的欢喜。大家好，我是[@洛竹](https://github.com/youngjuning)，一名热爱编程、热爱生活的终身学习实践者。

本文介绍了 Babel，一个允许开发者可以使用下一代 JavaScript 的编译器。

It can be frustrating to write JavaScript when building web applications. We have to think about the features available in the browsers we’re targeting and what happens when a feature isn’t implemented. Some people would recommend simply not using it, which is a painful experience most of the time if we’re building something complicated.

Thankfully, some tools allow us to stop worrying about what’s supported and just write the best code we can. They’re called transpilers. A transpiler is a tool that takes source code as input and produces new source code as output, with a different syntax but semantically as close as possible — or ideally equivalent — to the original.

Babel is pretty much the standard transpiler to translate modern JavaScript (ES2015+) into compatible implementations that run in old browsers. It’s the perfect solution if you just want to concentrate on writing JavaScript.

And although the main goal of Babel is to translate the latest standards of ECMAScript (ES) for old — or sometimes current — browsers, it can do more. There’s an ecosystem of presets and plugins that make possible the addition of non-standard features as well. Each plugin makes a new feature/transformation available for your code, and presets are just a collection of plugins.

Getting Started
There are different ways to set up Babel depending on your project and the tools you use. In this article, we’re going to explain how to set up Babel using the CLI, although if you’re using a build system or framework, you can check out specific instructions on the official site. Most of the time the CLI is the fastest and easiest way to get started, so if you’re a first-time user, feel free to continue.

The first step to set up Babel in a project is to install the package using npm and add it as a dev dependency. Assuming you have a working Node.js environment already in place, it’s just a matter of running the following in your terminal:

mkdir babel-test
cd babel-test
npm init -y
npm install --save-dev babel-cli
This will create a directory (babel-test) change into the directory, initialize an npm project (thus creating a package.json file) and then install the babel-cli as a dev dependency.

If you need any help with the above, please consult our tutorials on installing Node and working with npm.

Next, we can open package.json and add a build command to our npm scripts:

"scripts": {
"build": "babel src -d dist"
}
This will take the source files from the src directory and output the result in a dist directory. Then we can execute it as:

npm run build
But wait! Before running Babel we must install and set up the plugins that will transform our code. The easiest and quickest way to do this is to add the Env preset, which selects the appropriate plugins depending on the target browsers that you indicate. It can be installed using:

npm install babel-preset-env --save-dev
Then create a .babelrc file in the root of your project and add the preset:

{
"presets": ["env"]
}
The .babelrc file is the place where you put all your settings for Babel. You’ll be using this primarily for setting up presets and plugins, but a lot more options are available. You can check the complete list in the Babel API page.

Please note that, depending on your operating system, files beginning with a dot will be hidden by default. If this is problematic for you (or if you just prefer fewer files), you can put your Babel settings in the package.json file, under a babel key, like so:

{
"name": "babel-test",
"version": "1.0.0",
"babel": {
// config
}
}
Finally, let’s create the directories and files Babel is expecting to find:

mkdir src dist
And give it something to transform:

let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a);
console.log(b);
This example uses destructuring assignment to swap the values of two variables.

Running Babel
Now that you have a ready-to-use Babel installation, you can execute the build command to run the compilation process:

npm run build
This will take the code from src/main.js, transform it to ES5 code and output the transformed code to dist/main.js.

Here’s what it produced:

"use strict";

var a = 1;
var b = 2;
var \_ref = [b, a];
a = \_ref[0];
b = \_ref[1];

console.log(a);
console.log(b);
As you can see, let has been replaced by var and Babel has introduced a temporary variable (denoted by the underscore) to facilitate the swap.

And that’s it. The code that you write in the src directory will be translated to previous versions of the language. By default, if you don’t add any options to the preset, it will load all the transformations. You can also indicate the target browsers as follows:

{
"presets": [
["env", {
"targets": {
"browsers": ["last 2 versions", "safari >= 7"]
}
}]
]
}
This will load the required transformations to support the latest two versions of each browser and Safari greater or equal to version 7. You can find the available options for the target browsers in the Browserlist repository.

Babel Ecosystem: A Quick Overview
As you noticed in the previous section, Babel won’t do anything by itself when you install it. We have to install a set of plugins to obtain the desired behavior, or we can use presets, which are predefined sets of plugins.

Usually, each feature that you want to include will be in the form of a plugin. Some examples for ES2015 include:

constants
arrow functions
block-scoped functions
classes
for-of
spread
template literals
See the Plugins page in the Babel Docs for a complete list.

But sometimes you don’t want to include all the plugins one by one. So there are prebuilt presets that will facilitate the process of installing each plugin.

The three official presets currently available are:

Env
React
Flow
Env is the most frequently used and the one we’ve used here. It automatically loads all the necessary transformations to make your code compatible depending on the targeted browsers.

The React preset transforms code typically found in React projects, mainly adding compatibility with Flow annotations and JSX.

And finally, the Flow preset is used to clean up the code from Flow type annotations (although it doesn’t check whether the types are valid or not.)

Babel Polyfill
There are JavaScript features that can’t be transformed syntactically, usually because there’s no equivalent functionality implemented — for example, Promises and generator functions.

Those kinds of features have to be implemented in the browser by a library to be used in your code, and that’s the work of a polyfill.

The Babel polyfill is composed by core-js and the Regenerator runtime. Together, they cover all the features in ES2015+.

Advanced Use
As mentioned, Babel can also be used to transform features that haven’t yet been implemented in the language. A good example of this is the class fields proposal (currently at TC39 stage 3: candidate). This is particularly popular among React devs, as it removes the necessity to explicitly bind methods to a particular component, and also means that a component’s state can be declared as a class field (potentially eliminating the need for a constructor).

For those of you wanting to use class fields today, you would need to add the babel-plugin-transform-class-properties as a dev dependency:

npm install --save-dev babel-plugin-transform-class-properties
You’d also update your .babelrc file as follows:

{
"presets": ["env"],
"plugins": ["transform-class-properties"]
}
Now you can write:

class App extends Component {
state = { count: 0 };

incCount = () => {
this.setState(ps => ({ count: ps.count + 1 }));
};

render() {
return (

<div>
<p>{ this.state.count }</p>
<button onClick={this.incCount}>add one</button>
</div>
);
}
}
And it doesn’t stop there. You can also use Babel to add new features of your own to the language, as our tutorial Understanding ASTs by Building Your Own Babel Plugin demonstrates.

Alternatives
Writing modern web applications sometimes requires more than the features available in JavaScript. Other languages can also be translated to compatible JavaScript but also implement other useful features.

The most popular option is TypeScript, which is regular JavaScript that implements modern ES features but also adds others, especially regarding type safety.

On the other extreme, there are entirely different languages across different categories, from the functional ones like PureScript to the object-oriented like Dart.

For a deeper overview of alternative languages, take a look at 10 Languages that Compile to JavaScript.

Conclusion
Babel is a great option for writing modern applications while still serving up JavaScript that can be understood by all developers and the wide range of browsers the code needs to run in.

Babel is not only useful for transforming ES2015+ to previous versions of the language — both in the browser and on platforms such as Node.js — but also for adding new features that aren’t part of the standard. To see what I mean, just take a look at the npm directory to find all the available Babel plugins or presets.

As JavaScript is evolving at such a rapid pace, it’s obvious that browser manufacturers will need a while to implement the latest features. Giving Babel a place in your toolkit means that you can write cutting-edge JavaScript today, safe in the knowledge that you’re not abandoning any of your users. What’s not to love?

## 结语

关注公众号`洛竹早茶馆`，一个持续分享编程知识的地方。

- `点赞`等于学会，`在看`等于精通
- 最后祝大家 2021 学习进步，升职加薪

> 本文首发于「[洛竹的官方网站](https://youngjuning.js.org/)」，同步于公众号「[洛竹早茶馆](https://cdn.jsdelivr.net/gh/youngjuning/images/20210418112129.jpeg)」和「[掘金专栏](https://juejin.cn/user/325111174662855)」。

![洛竹](https://youngjuning.js.org/img/luozhu.png)
