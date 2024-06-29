---
title: 「译」通过构建你自己的 Babel 插件理解 AST
cover: https://cdn.jsdelivr.net/gh/youngjuning/images/20210517191449.png
tags: [nodejs,翻译]
---

> 怕什么真理无穷，进一寸有一寸的欢喜。大家好，我是[@紫升](https://github.com/youngjuning)，一名热爱编程、热爱生活的终身学习实践者。

> 原文作者：[Dan Prince](https://www.sitepoint.com/author/dprince)
>
> 原文链接：https://www.sitepoint.com/understanding-asts-building-babel-plugin/

Every day, thousands of JavaScript developers use versions of the language that browser vendors haven’t even implemented yet. Many of them use language features that are nothing more than proposals, with no guarantee they’ll ever make it into the specification. All of this is made possible by the [Babel][babeljs] project.

Babel is best known for being able to translate ES6 code into ES5 code that we can run safely today, however it also allows developers to write plugins that transform the structure of JavaScript programs at compile time.

Today, we’ll look at how we can write a Babel plugin to add **immutable data by default** to JavaScript. The code for this tutorial can be downloaded from our [GitHub repo][moriscript].

## 语言概览

We want to design a plugin that will allow us to use regular object and array literals, which will be transformed into persistent data structures using [Mori][mori].

We want to write code like this:

```js
var foo = { a: 1 };
var baz = (foo.a = 2);
foo.a === 1;
baz.a === 2;
```

And transform it into code like this:

```js
var foo = mori.hashMap('a', 1);
var baz = mori.assoc(foo, 'a', 2);
mori.get(foo, 'a') === 1;
mori.get(baz, 'a') === 2;
```

Let’s get started with MoriScript!

## Babel 概览

If we look beneath the surface of Babel, we’ll find three important tools that handle the majority of the process.

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images/20210517173918.png)

### Parse

Babylon is the parser and it understands how to take a string of JavaScript code and turn it into a computer friendly representation called an Abstract Syntax Tree (AST).

### Transform

The [babel-traverse][babel-traverse] module allows you to explore, analyse and potentially modify the AST.

### Generate

Finally, the [babel-generator][babel-generator] module is used to turn the transformed AST back into regular code.

## AST 是什么？

It’s fundamental that we understand the purpose of an AST before continuing with this tutorial. So let’s dive in to see what they are and why we need them.

JavaScript programs are generally made up of a sequence of characters, each with some visual meaning for our human brains. This works really well for us, as it allows us to use matching characters (`[]`, `{}`, `()`), pairs of characters (`''`, `""`) and indentation to make our programs easier for us to interpret.

However, this isn’t very helpful for computers. For them, each of these characters is just a numeric value in memory and they can’t use them to ask high level questions like “How many variables are there in this declaration?”. Instead we need to compromise and find a way to turn our code into something that we can program and computers can understand.

Have a look at the following code.

```js
var a = 3;
a + 5;
```

When we generate an AST for this program, we end up with a structure that looks like this:

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images/20210517175639.png)

All ASTs start with a `Program` node at the root of the tree, which contains all of the top level statements in our program. In this case, we only have two:

1. A `VariableDeclaration` with one `VariableDeclarator` that assigns the `Identifier` "`a`" to the `NumericLiteral` "`3`".
2. An `ExpressionStatement` which is in turn is made up of a `BinaryExpression`, which is described as an `Identifier` "`a`", an operator "`+`" and another `NumericLiteral` "`5`".

Despite the fact that they are made up of simple building blocks, the size of ASTs means they are often quite complex, especially for nontrivial programs. Rather than trying to figure out ASTs ourselves, we can use [astexplorer.net][astexplorer], which allows us to input JavaScript on the left, then outputs an explorable representation of the AST on the right. We’ll use this tool exclusively to understand and experiment with code as we continue.

> To stay consistent with Babel, make sure you choose “@babel/parser” as a parser.

When writing a Babel plugin, it’s our job to take an AST then insert/move/replace/delete some nodes to create a new AST which can be used to generate code.

## Setup

Make sure you have `node` and `npm` installed before you start. Then create a folder for the project, create a `package.json` file and install the following dev dependencies.

```sh
mkdir moriscript && cd moriscript
npm init -y
npm install --save-dev babel-core
```

Then we’ll create a file for our plugin and inside we’ll export a default function.

```js
// moriscript.js
module.exports = function(babel) {
  var t = babel.types;
  return {
    visitor: {},
  };
};
```

This function exposes an interface for the [visitor pattern](visitor_pattern), which we’ll come back to later.

Finally we’ll create an runner that we can use to test our plugin as we go.

```js
// run.js
var fs = require('fs');
var babel = require('babel-core');
var moriscript = require('./moriscript');

// read the filename from the command line arguments
var fileName = process.argv[2];

// read the code from this file
fs.readFile(fileName, function(err, data) {
  if (err) throw err;

  // convert from a buffer to a string
  var src = data.toString();

  // use our plugin to transform the source
  var out = babel.transform(src, {
    plugins: [moriscript],
  });

  // print the generated code to screen
  console.log(out.code);
});
```

We can call this script with the name of an example MoriScript file to check that it generates the JavaScript we are expecting. For example, `node run.js example.ms`.

## 数组

The first and foremost goal for MoriScript is to convert Object and Array literals into their Mori counterparts: HashMaps and Vectors. We’ll tackle arrays first, as they’re slightly simpler.

```js
var bar = [1, 2, 3];
// should become
var bar = mori.vector(1, 2, 3);
```

Paste the code from above into [astexplorer][astexplorer] and highlight the array literal [1, 2, 3] to see the corresponding AST nodes.

For the sake of readability, we’ll omit the metadata fields that we don’t need to worry about.

```json
{
  "type": "ArrayExpression",
  "elements": [
    {
      "type": "NumericLiteral",
      "value": 1
    },
    {
      "type": "NumericLiteral",
      "value": 2
    },
    {
      "type": "NumericLiteral",
      "value": 3
    }
  ]
}
```

Now let’s do the same with the call to `mori.vector(1, 2, 3)`.

```json
{
  "type": "CallExpression",
  "callee": {
    "type": "MemberExpression",
    "object": {
      "type": "Identifier",
      "name": "mori"
    },
    "property": {
      "type": "Identifier",
      "name": "vector"
    }
  },
  "arguments": [
    {
      "type": "NumericLiteral",
      "value": 1
    },
    {
      "type": "NumericLiteral",
      "value": 2
    },
    {
      "type": "NumericLiteral",
      "value": 3
    }
  ]
}
```

If we express this visually, we’ll get a better sense of what needs to change between the two trees.

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images/20210517182653.png)

Now we can see quite clearly that we’ll need to replace the top level expression, but we’ll be able to share the numeric literals between the two trees.

Let’s start by adding an `ArrayExpression` method onto our visitor object.

```js
module.exports = function(babel) {
  var t = babel.types;
  return {
    visitor: {
      ArrayExpression: function(path) {},
    },
  };
};
```

When Babel traverses the AST it looks at each node and if it finds a corresponding method in our plugin’s visitor object, it passes the context into the method, so that we can analyse or manipulate it.

```js
ArrayExpression: function(path) {
  path.replaceWith(
    t.callExpression(
      t.memberExpression(t.identifier('mori'), t.identifier('vector')),
      path.node.elements
    )
  );
}
```

We can find [documentation][babel-types] for each type of expression with the babel-types package. In this case we’re going to replace the `ArrayExpression` with a `CallExpression`, which we can create with `t.callExpression(callee, arguments)`. The thing we’re going to call is a `MemberExpression` which we can create with `t.memberExpression(object, property)`.

> You can also try this out in realtime inside [astexplorer][astexplorer] by clicking on the “transform” dropdown and selecting “@babel/parser”.

## 对象

Next let’s take a look at objects.

```js
var foo = { bar: 1 };
// should become
var foo = mori.hashMap('bar', 1);
```

The object literal has a similar structure to the `ArrayExpression` we saw earlier.

```json
{
  "type": "ObjectExpression",
  "properties": [
    {
      "type": "ObjectProperty",
      "key": {
        "type": "Identifier",
        "name": "bar"
      },
      "value": {
        "type": "NumericLiteral",
        "value": 1
      }
    }
  ]
}
```

This is quite straightforward. There is an array of properties, each with a key and a value. Now let’s highlight the corresponding Mori call to `mori.hashMap('bar', 1)` and see how that compares.

```js
{
  "type": "CallExpression",
  "callee": {
    "type": "MemberExpression",
    "object": {
      "type": "Identifier",
      "name": "mori"
    },
    "property": {
      "type": "Identifier",
      "name": "hashMap"
    }
  },
  "arguments": [
    {
      "type": "StringLiteral",
      "value": "bar"
    },
    {
      "type": "NumericLiteral",
      "value": 1
    }
  ]
}
```

Again, let’s also look at a visual representation of these ASTs.

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images/20210517183905.png)

Like before, we have a `CallExpression` wrapped around a `MemberExpression` which we can borrow from our array code, but we’ll have to do something a bit more complicated to get the properties and values into a flat array.

```js
ObjectExpression: function(path) {
  var props = [];

  path.node.properties.forEach(function(prop) {
    props.push(
      t.stringLiteral(prop.key.name),
      prop.value
    );
  });

  path.replaceWith(
    t.callExpression(
      t.memberExpression(t.identifier('mori'), t.identifier('hashMap')),
      props
    )
  );
}
```

This is mostly quite similar to the implementation for arrays, except we have to convert the `Identifier` into a `StringLiteral` to prevent ourselves ending up with code that looks like this:

```js
// before
var foo = { bar: 1 };
// after
var foo = mori.hashMap(bar, 1);
```

Finally, we’ll create a helper function for creating the Mori `MemberExpressions` that we will continue to use.

```js
function moriMethod(name) {
  return t.memberExpression(t.identifier('mori'), t.identifier(name));
}

// now rewrite
t.memberExpression(t.identifier('mori'), t.identifier('methodName'));
// as
moriMethod('methodName');
```

Now we can create some test cases and run them to see whether our plugin is working:

```js
mkdir test
echo -e "var foo = { a: 1 };\nvar baz = foo.a = 2;" > test/case.ms
node run.js test/case.ms
```

You should see the following output to the terminal:

```js
var foo = mori.hashMap('a', 1);
var baz = (foo.a = 2);
```

## 赋值

For our new Mori data structures to be effective we’ll also have to override the native syntax for assigning new properties to them.

```js
foo.bar = 3;
// needs to become
mori.assoc(foo, 'bar', 3);
```

Rather than continue to include the simplified AST we’ll just work with the diagrams and plugin code for now, but feel free to keep running these examples through [astexplorer][astexplorer].

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images/20210517185202.png)

We’ll have to extract and translate nodes from each side of the `AssignmentExpression` to create the desired `CallExpression`.

```js
AssignmentExpression: function(path) {
  var lhs = path.node.left;
  var rhs = path.node.right;

  if(t.isMemberExpression(lhs)) {
    if(t.isIdentifier(lhs.property)) {
      lhs.property = t.stringLiteral(lhs.property.name);
    }

    path.replaceWith(
      t.callExpression(
        moriMethod('assoc'),
        [lhs.object, lhs.property, rhs]
      )
    );
  }
}
```

Our handler for `AssignmentExpressions` makes a preliminary check to see whether the expression on the left hand side is a `MemberExpression` (because we don’t want to mess with stuff like `var a = 3`). Then we replace the with with a new `CallExpression` using Mori’s `assoc` method.

Like before, we also have to handle cases where an `Identifier` is used and convert it into a `StringLiteral`.

Now create another test case and run the code to see whether it works:

```js
echo -e "foo.bar = 3;" >> test/case.ms
node run.js test/case.ms

$ mori.assoc(foo, "bar", 3);
```

## 对象成员

Finally, we’ll also have to override the native syntax for accessing a member of an object.

```js
foo.bar;
// needs to become
mori.get(foo, 'bar');
```

Here’s the visual representation for the two ASTs.

![紫升](https://cdn.jsdelivr.net/gh/youngjuning/images/20210517185540.png)

We can almost use the properties of the `MemberExpression` directly, however the property section will come as an `Identifier`, so we’ll need to convert it.

```js
MemberExpression: function(path) {
  if(t.isAssignmentExpression(path.parent)) return;

  if(t.isIdentifier(path.node.property)) {
    path.node.property = t.stringLiteral(path.node.property.name);
  }

  path.replaceWith(
    t.callExpression(
      moriMethod('get'),
      [path.node.object, path.node.property]
    )
  );
}
```

The first important difference to note is that we’re exiting the function early if the parent of this node is an `AssignmentExpression`. This is because we want to let our `AssignmentExpression` visitor method deal with these cases.

This looks fine, but if you run this code, you’ll actually find yourself with a stack overflow error. This is because when we replace a given `MemberExpression` (`foo.bar`) we replace it with another one (`mori.get`). Babel then traverses this new node and passes it back into our visitor method recursively.

To get around this we can tag the return values from `moriMethod` and choose to ignore them in our `MemberExpression` method.

```js
function moriMethod(name) {
  var expr = t.memberExpression(t.identifier('mori'), t.identifier(name));

  expr.isClean = true;
  return expr;
}
```

Once it’s been tagged, we can add another return clause to our function.

```js
MemberExpression: function(path) {
  if(path.node.isClean) return;
  if(t.isAssignmentExpression(path.parent)) return;

  // ...
}
```

Create a final test case and compile your code to check that it works.

```js
echo -e "foo.bar" >> test/case.ms
node run.js test/case.ms

$ mori.get(foo, "bar");
```

All things being well, you now have a language that looks like JavaScript, but instead has immutable data structures by default, without compromising the original expressive syntax.

## 结论

This was quite a code-heavy post, but we’ve covered all the basics for designing and building a Babel plugin that can be used to transform JavaScript files in a useful way. You can play with MoriScript in a REPL [here][moriscript-site] and you can find the complete source [on GitHub][moriscript].

[babeljs]: http://babeljs.io/
[moriscript]: https://github.com/sitepoint-editors/moriscript
[moriscript-site]: https://danprince.github.io/moriscript/
[mori]: https://www.sitepoint.com/immutable-data-functional-javascript-mori/
[babylon]: https://github.com/babel/babylon
[babel-traverse]: https://www.npmjs.com/package/babel-traverse
[babel-generator]: https://www.npmjs.com/package/babel-generator
[astexplorer]: https://astexplorer.net/
[visitor_pattern]: https://juejin.cn/post/6844903698154389517
[acorn]: https://github.com/acornjs/acorn
[babel-types]: https://github.com/babel/babel/tree/master/packages/babel-types#babel-types

## 结语

关注公众号`紫升早茶馆`，一个持续分享编程知识的地方。

- `点赞`等于学会，`在看`等于精通
- 最后祝大家 2021 学习进步，升职加薪

> 本文首发于「[紫升的官方网站](https://youngjuning.js.org/)」，同步于公众号「[紫升早茶馆](https://cdn.jsdelivr.net/gh/youngjuning/images/20210418112129.jpeg)」和「[掘金专栏](https://juejin.cn/user/325111174662855)」。

![紫升](https://youngjuning.js.org/img/luozhu.png)
