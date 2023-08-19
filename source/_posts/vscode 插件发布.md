---
title: 2023 保姆级 VsCode 插件发布教程
date: 2021-08-12 20:46:38
cover: https://cdn.jsdelivr.net/gh/youngjuning/images/20210812204938.jpeg
description: VsCode 插件开发的最后一步也是最繁琐的就是插件发布，本文详细介绍了如何使用 vsce 将 vscode 插件发布到扩展市场。
categories:
  - [前端, VS Code]
tags:
  - vscode 插件
  - vscode 插件开发
  - vscode 插件发布
  - vscode 发布插件
  - vscode 插件市场
  - vsce
  - Visual Studio Code
  - access token
  - personal token
---

## 安装发布工具 vsce

[vsce](https://github.com/Microsoft/vsce) 是一个用于将插件发布到[vscode 插件市场](https://marketplace.visualstudio.com/)上的命令行工具。

```sh
$ npm install vsce -g
```

## 注册 vscode 开发者信息

### 新建 Azure DevPos 组织

1. 登录 [Azure DevOps](https://azure.microsoft.com/zh-cn/services/devops/)。
2. 点击 **New organization**。

![vscode 新建 Azure DevPos 组织](https://cdn.jsdelivr.net/gh/youngjuning/images/20210812201149.png)

3. 确认信息，然后选择 **Continue**。

![vscode 新建 Azure DevPos 组织](https://cdn.jsdelivr.net/gh/youngjuning/images/20210812201210.png)

![vscode 新建 Azure DevPos 组织](https://cdn.jsdelivr.net/gh/youngjuning/images/20210812201223.png)

到这里，一个组织就创建成功了，之后随时登录到你的组织<https://dev.azure.com/tuyaworks>。

### 获取 Personal Access Token

下面的例子里，我们假设组织名为 vscode，从你的组织主页（例如：https://dev.azure.com/tuyaworks ） 进入 Personal access tokens 页面：

![vscode 获取 Personal Access Token](https://cdn.jsdelivr.net/gh/youngjuning/images/20210812201259.png)

点击 **New Token** 创建一个新的 Personal Access Token：

![vscode 获取 Personal Access Token](https://cdn.jsdelivr.net/gh/youngjuning/images/20210812202141.png)

给 Personal Access Token 添加描述，过期时间等等，你最好把过期时间设置为 1 年，这样你接下就能方便很多，选择 **custom defined（用户自定义）** 范围，然后点击 **Show all scopes(显示全部)** ，在这个列表中找到 Marketplace，并勾选 Acquire 和 Manage：

![vscode 获取 Personal Access Token](https://cdn.jsdelivr.net/gh/youngjuning/images/20210812202337.png)

点击 **Create**，你就会看到新创建的 Personal Access Token 了，复制好，你接下来就会用到这个 token 来创建一个发行方了。

![vscode 获取 Personal Access Token](https://cdn.jsdelivr.net/gh/youngjuning/images/20210812202402.png)

### 创建一个发行方

**发行方**是 VS Code 市场有权发布插件的唯一标识，每个插件的 package.json 文件都包含着 publisher 字段。
现在我们已经有了 Personal Access Token，我们马上可以通过 [vscode-create-publisher](https://aka.ms/vscode-create-publisher) 创建一个发行方。

### 发行方登录

如果你已经有发行方账号了：

```sh
$ vsce login (publisher name)
```

`vsce` 会记住这个 Personal Access Token，日后你需要再次使用的时候会自动带上。

你也可以用命令参数 `-p <token>` 直接登录然后立即发布插件：

```sh
$ vsce publish -p <token>
```

## vscode 插件版本维护

### 增量更新插件版本

用 SemVer 语义标识符：major，minor，patch 增量更新插件版本号。

例如，你想把插件从 1.0.0 更新到 1.1.0，那么加上 minor：

```sh
$ vsce publish minor
```

插件 _package.json_ 的 version 会先更新，然后才发布插件。

你也可以通过命令行指定版本号：

```sh
$ vsce publish 2.0.1
```

### 下架插件

通过指定插件 idpublisher.extension 下架插件：

```sh
$ vsce unpublish (publisher name).(extension name)
```

> 当你下架插件的时候，市场会移除所有插件的历史统计数据，请在下架前再三考虑，最好还是更新插件吧。

### VS Code 版本兼容性

当你制作插件的时候，你需要描述插件对 VS Code 的版本兼容性——修改 _package.json_ 中的 engines.vscode：

```json
{
  "engines": {
    "vscode": "^1.8.0"
  }
}
```

1.8.0 表示你的插件只能兼容 1.8.0 版本的 VS Code，^1.8.0 则表示你的插件向上兼容，包括 1.8.1, 1.9.0 等等。

使用 `engines.vscode` 可以确保插件安装环境包含了插件依赖的 API。这个机制在稳定版和 Insider 版本都适用。

现在我们假设最新的稳定版 API 是 1.8.0，而 1.9.0 引入了新的 API，所以你可以用 1.9.0-insider 标识插件在 Insider 版中也可正常使用。 如果你想使用这些刚刚引入的 API，则将依赖版本设置为 ^1.9.0，你的插件则只能安装在 >=1.9.0 的 VS Code 上，也就意味着所有当前的 Insider 版本都可以用得上，而稳定版只有在更新到 1.9.0 才能使用你的插件。

## vscode 插件打包

你也可能只是想打包一下插件，而不是发布到商店里。用下列命令将插件打包到 `.vsix` 文件中：

```sh
$ vsce package
```

这个命令会在当前目录生成一个 .vsix 文件，直接从 .vsix 安装插件是允许的，查看[从 VSIX 安装插件](https://github.com/Microsoft/vscode-docs/blob/master/docs/editor/extension-gallery.md#install-from-a-vsix)了解更多内容。

## 相关链接

- [VS Code API 中文文档](https://vscode-api-cn.js.org/)
- [vscode 插件市场](https://marketplace.visualstudio.com/)
- [Azure Devops](https://azure.microsoft.com/zh-cn/services/devops/)
