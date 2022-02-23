---
title: 微精通之Vue移动端开发【持续更新】
date: 2020-07-13 15:37:03
categories:
	- [前端开发,Vue]
tags:
	- vant
	- 微精通
---

[![](https://i.loli.net/2020/07/13/B1Hlcn3iazQ9fxs.png)](https://mubu.com/doc/7ZqGKUzpwrH)

精通任何技能都是需要时间的，但是往往工作中是不会给你这个时间的，尤其是开发工作。新技术层出不穷，每个项目都可能技术栈不一样。

无法改变环境，那么就只能改变我们自身。如果让公司等你精通再开发，那你只能被淘汰。但如果毫无准备进入开发，项目质量又无从谈起，而且项目也可能失控。而微精通就是框定一个最小范围，快速熟悉完成任务所涉及的内容。今天我就拿 Vue 移动端开发做一个实验。

<!--more-->

## 项目初始化

### 创建项目

```sh
# 安装 Vue Cli
npm install -g @vue/cli

# 创建一个项目
vue create zhiliao-vant
```

### 配置Prettier

1、安装依赖

```sh
$ yarn add prettier eslint-plugin-prettier eslint-config-prettier -D
```

- prettier: Prettier CLI
- eslint-plugin-prettier: 以 ESLint 插件的形式运行 prettier
- eslint-config-prettier: 关闭所有不必要或可能与 prettier 的规则冲突的 ESLint 规则。一定要放到最后。

2、配置  `.eslintrc.js`:

```js
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    'plugin:prettier/recommended',
    "prettier/vue"
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // add your rules
  },
};
```

3、新建 `/.prettierrc.js`，并写入如下配置

> 注意: 要不要加分号的原则是**领导为大，喜好为小**

```js
module.exports = {
  printWidth: 120, // 一行的字符数，如果超过会进行换行，默认为80
  tabWidth: 2, // tab缩进大小,默认为2
  useTabs: false, // 使用tab缩进，默认false
  semi: false, // 使用分号, 默认true
  /**
   * 行尾逗号,默认none,可选 none|es5|all
   * es5 包括es5中的数组、对象
   * all 包括函数对象等所有可选
   */
  trailingComma: 'es5',
  singleQuote: true, // 使用单引号, 默认false(在jsx中配置无效, 默认都是双引号)
  /**
   * 对象中的空格 默认true
   * true: { foo: bar }
   * false: {foo: bar}
   */
  bracketSpacing: true,
  /**
   * JSX标签闭合位置 默认false
   * false:
   * <div
   *  className=""
   *  style={{}}
   * >
   * true:
   * <div
   *  className=""
   * style={{}} >
   */
  jsxBracketSameLine: false,
  /**
   * 箭头函数参数括号 默认avoid 可选 avoid| always
   * avoid 能省略括号的时候就省略 例如x => x
   * always 总是有括号
   */
  arrowParens: 'always',
  vueIndentScriptAndStyle: false, // vue 文件 script 和 style 标签缩进，默认false
  endOfLine: 'lf', // 强制使用 unix 风格的换行符
}
```

### vscode 配置

新建 `/.vscode/settings.json` 并写入以下配置：

```json
{
  "editor.formatOnSave": false, // 关闭保存时自动格式化，防止与 eslint 冲突
  "files.eol": "\n", // 统一默认行尾字符为 LF
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true // 保存时自动修复
  },
  // 关闭 vetur 验证功能
  "vetur.validation.script": false,
  "vetur.validation.style": false,
  "vetur.validation.template": false,
  "vetur.format.enable": false,
  // 禁用 prettier 插件，避免与 eslint 冲突，建议删除 vscode-prettier
  "prettier.disableLanguages": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "json",
    "jsonc"
  ],
}
```

> 注意：如果是团队协作的项目，请删除 `.gitignire` 中的 `.vscode` ，将配置加入到代码库。

### Format初始代码

```sh
$ yarn lint
```

## @vue/cli

### ~/.vuerc

被保存的 preset 将会存在用户的 home 目录下一个名为 `.vuerc` 的 JSON 文件里。如果你想要修改被保存的 `preset/` 选项，可以编辑这个文件。

在项目创建的过程中，你也会被提示选择喜欢的包管理器或使用[淘宝 npm 镜像源](https://npm.taobao.org/)以更快地安装依赖。这些选择也将会存入 `~/.vuerc`。下面是我的配置：

```json
{
  "useTaobaoRegistry": false,
  "packageManager": "yarn",
  "presets": {
    "javascript": {
      "useConfigFiles": true,
      "plugins": {
        "@vue/cli-plugin-babel": {},
        "@vue/cli-plugin-router": {
          "historyMode": false
        },
        "@vue/cli-plugin-vuex": {},
        "@vue/cli-plugin-eslint": {
          "config": "airbnb",
          "lintOn": [
            "save",
            "commit"
          ]
        }
      },
      "cssPreprocessor": "less"
    }
  }
}
```

### git hooks

```json
{
  "gitHooks": {
    "pre-commit": "lint-staged"
  },
  "lint-staged": {
    "*.{js,jsx,vue}": [
      "vue-cli-service lint",
      "git add"
    ],
    "*.{md,json}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

### 常见问题

#### vue-cli3出现Invalid Host header的解决方案

> 参考: [vue-cli3出现Invalid Host header的解决方案](https://blog.csdn.net/guzhao593/article/details/85918869)

**产生原因**

新版的 `webpack-dev-server` 增加了安全验证，默认检查`hostname`，如果`hostname`不是配置内的，将中断访问。

**解决方案**

对`vue.config.js`进行如下配置：

```js
module.exports = {
  devServer: {
    disableHostCheck: true,
  },
}
```

## Vant UI

### 安装依赖

```bash
$ yarn add vant
```

### 按需引入组件

安装 `babel-import-plugin`

```sh
$ yarn add babel-plugin-import -D
```

对于使用 babel7 的用户，可以在 `babel.config.js` 中配置

```js
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true,
      },
      'vant',
    ],
  ],
}
```

接着你可以在代码中直接引入 Vant 组件：

```js
import { Button } from 'vant';
Vue.use(Button);
```


### 配置基于 Rem 的适配方案

Vant 中的样式默认使用`px`作为单位，如果需要使用`rem`单位，推荐使用以下两个工具：

- [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem) 是一款 postcss 插件，用于将单位转化为 rem
- [lib-flexible](https://github.com/amfe/lib-flexible) 用于设置 rem 基准值

1、安装依赖：

```sh
$ yarn add amfe-flexible 
$ yarn add postcss-pxtorem -D
```

2、在根目录新建 `postcss.config.js`，并写入以下配置：

> 参考: [设计稿是750px，根元素应该设置75，但是vant转换后好小，要改成35才行](https://github.com/youzan/vant/issues/1181)、[使用vue vantUi框架 根字体是37.5 和默认根字体75不一致，导致页面组件样式变小](https://www.cnblogs.com/yimei/p/11319657.html)

```js
module.exports = ({ file }) => {
  const designWidth = file.dirname.includes('node_modules/vant') ? 37.5 : 75
  return {
    plugins: {
      autoprefixer: {
        overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8'],
      },
      'postcss-pxtorem': {
        rootValue: designWidth,
        propList: ['*', '!border'],
        selectorBlackList: ['.ignore', '.hairlines'],
      },
    },
  }
}
```

> 注意: 你可以使用 `Px` 或 `PX` 来让 `postcss-pxtorem` 忽略转换，而且这样浏览器也能识别。

3、在 `src/main.js` 中引入 `amfe-flexible`：

```
...
import 'amfe-flexible'
...
```

### 底部安全区适配

iPhone X 等机型底部存在底部指示条，指示条的操作区域与页面底部存在重合，容易导致用户误操作，因此我们需要针对这些机型进行底部安全区适配。Vant 中部分组件提供了`safe-area-inset-bottom`属性，设置该属性后，即可在对应的机型上开启适配，如下示例：

```html
<!-- 在 head 标签中添加 meta 标签，并设置 viewport-fit=cover 值 -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"
/>

<!-- 开启 safe-area-inset-bottom 属性 -->
<van-number-keyboard safe-area-inset-bottom />
```

### 配置自定义主题色方案

#### 1、按需引入样式

在 `babel.config.js` 中配置按需引入样式源文件:

```js
module.exports = {
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        // 指定样式路径
        style: (name) => `${name}/style/less`,
      },
      'vant',
    ],
  ],
};
```

#### 2、 修改样式变量

```shell
$ yarn add less less-loader
```

```js
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 直接覆盖变量
          'text-color': '#111',
          'border-color': '#eee',
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          hack: 'true; @import "your-less-file-path.less";',
        },
      },
    },
  },
};
```

> Vant 使用了 [Less](http://lesscss.org/) 对样式进行预处理，并内置了一些样式变量，下面是一些基本的样式变量，所有可用的颜色变量请参考 [配置文件](https://github.com/youzan/vant/blob/dev/src/style/var.less)。

### 配置基于 Viewport 的适配方案（推荐）

该方案和**配置基于 Rem 的适配方案**是互斥的，请二选一。

> 参考: [移动端布局之postcss-px-to-viewport（兼容vant）](https://my.oschina.net/u/4382386/blog/4290707)、[vue —— 利用 viewport 进行适配](https://www.cnblogs.com/cnloop/p/9697229.html)

1、安装 postcss-px-to-viewport

```shell
$ yarn add postcss-px-to-viewport -D
```

2、配置` postcss.config.js` 文件

```js
module.exports = ({ file }) => {
  const designWidth = file.dirname.includes('node_modules/vant') ? 375 : 750;
  return {
    plugins: {
      autoprefixer: {
        // 用来给不同的浏览器自动添加相应前缀，如-webkit-，-moz-等等
        overrideBrowserslist: [
          'Android 4.1',
          'iOS 7.1',
          'Chrome > 31',
          'ff > 31',
          'ie >= 8',
        ],
      },
      "postcss-px-to-viewport": {
      	unitToConvert: "px", // 要转化的单位
        viewportWidth: designWidth, // UI设计稿的宽度
        unitPrecision: 6, // 转换后的精度，即小数点位数
        propList: ["*","!border"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
        viewportUnit: "vw", // 指定需要转换成的视窗单位，默认vw
        fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位，默认vw
        selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换为视窗单位的类名
        minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
        landscape: false // 是否处理横屏情况
      }
    }
  }
}
```

- `propList`: 当有些属性的单位我们不希望转换的时候，可以添加在数组后面，并在前面加上`!`号，如`propList: ["*","!border"]`,这表示：所有css属性的属性的单位都进行转化，除了`border`的
- `selectorBlackList`：转换的黑名单，在黑名单里面的我们可以写入字符串，只要类名包含有这个字符串，就不会被匹配。比如`selectorBlackList: ['wrap']`,它表示形如`wrap`,`my-wrap`,`wrapper`这样的类名的单位，都不会被转换

## vue

### vue中style scope深度访问新方式(`::v-deep`)

> 参考： [vue中style scope深度访问新方式(::v-deep)](https://segmentfault.com/a/1190000021576348)

由于使用 scoped 后，父组件的样式将不会渗透到子组件中。官方引入了 [深度作用选择器](https://vue-loader.vuejs.org/zh/guide/scoped-css.html#深度作用选择器)，来解决这个问题。记得之前使用的是 `/deep/`，据说这个属性有兼容问题，现在引入了新方式：`::v-deep`:

```css
#editDoctorAdvice {
  .topSearch {
    float: left;
    margin-right: 10px;
  }
  &::v-deep .el-input__inner {
    padding-right: 6px;
  }
  .dateTimeClass {
    width: 150px;
  }
}
```

## 参考链接

- [Vue入门指南(快速上手vue)](https://juejin.im/post/5c9f22876fb9a05e425556ed)
- [vue快速入门的三个小实例](https://juejin.im/post/5a0c191f6fb9a04514639419)
- [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)


## 联系作者

> 本文首发于[杨俊宁的博客](https://youngjuning.js.org/)

|                           作者微信                           |                           赞赏作者                           |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="https://i.loli.net/2020/02/22/q2tLiGYvhIxm3Fl.jpg" width="200px"/> | <img src="https://i.loli.net/2020/02/23/q56X1eYZuITQpsj.png" width="200px"/> |
