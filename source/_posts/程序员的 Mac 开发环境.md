---
title: 程序员的 Mac 开发环境
date: 2020-03-05 01:06:42
cover: https://i.loli.net/2020/03/07/dPCm6qwpsZn8k1o.png
description: 本文介绍了程序员常用的 Mac 环境配置，作为记录分享给大家。
categories:
  - 漫谈
tags:
  - Mac
  - 开发环境
  - 程序员
  - Mac 环境
  - 程序员 Mac 环境
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

## Xcode Command Line Tools

```sh
$ xcode-select --install
```

## Homebrew

```sh
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

## Git

### 命令行工具

```sh
// Re-installing Git on Mac OSX with Brew
$ alias git='/usr/local/bin/git'
$ brew install git
```

### 命令行配置

```bash
# 1、初始化设置
$ git config --global user.name '紫竹'
$ git config --global user.email 'luozhu2021@gmail.com'
# 2、将 `color.ui` 设置为 `auto` 可以让命令的输出拥有更高的可读性。
$ git config --global color.ui auto
# 3、忽略大小写
$ git config --global core.ignorecase false
# 4、core.autocrlf
$ git config --global core.autocrlf input
# 5、输出到terminal而不是vim
$ git config --global pager.branch false
```

### 代理配置

需要为 git 单独设置代理加速，`7890` 是 HTTP/HTTPS 代理端口，请按照自己的情况填写。

```sh
$ git config --global https.proxy http://127.0.0.1:7890
$ git config --global http.proxy http://127.0.0.1:7890
```

## Node

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时。我们使用 `n` 模块来维护 Node 的版本：

```sh
$ brew install n
```

### 安装命令

```sh
# 安装最新的稳定版
$ sudo n lts
# 安装最新版
$ sudo n latest
# 安装指定版本
$ sudo n 10.16.0
```

### 删除命令

```sh
# 删除指定版本
$ n rm 12.10.0
# 除去当前版本以外的所有缓存版本
$ n prune
```

### 安装 yarn

```sh
$ sudo npm install yarn -g
```

### 更新 npm

```shell
$ sudo npm install -g npm
```

### nrm 管理 registry

```shell
$ sudo npm install -g nrm
# 列出可用的代理
$ nrm ls
# 添加私有代理
$ nrm add <name> <url> [home]
```

## VS Code

- 下载 [Visual Studio Code](https://code.visualstudio.com/)
- 安装 [vscode-luozhu-pack](https://marketplace.visualstudio.com/items?itemName=youngjuning.vscode-luozhu-pack) 扩展包插件

## iTerm2

点击 https://iterm2.com/downloads/stable/latest 下载最新版 iTerm2。

## ohmyzsh

```sh
# 切换 shell 为 zsh
$ chsh -s /bin/zsh
# 通过 curl 安装 ohmyzsh
$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

### 插件

- [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md#oh-my-zsh)
- [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md)

### 主题

ohmyzsh 主题我只用 ys。

## 提效工具

- [Alfred](https://www.alfredapp.com/)：Mac 上最强大的效率工具
- [Monica](https://monica.im/)：人工智能助手

## v8

> 不要使用 `brew install v8`，因为可用命令是不完整的。

### 预备条件

- Install Xcode (Avaliable on the Mac App Store)
- Install Xcode Command Line Tools (Preferences > Downloads)
- Install [depot_tools](https://www.chromium.org/developers/how-tos/install-depot-tools)
  - `cd ~ && git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git`
  - `sudo nano ~/.zshrc`(zsh) or `sudo nano ~/.bash_profile`(bash)
  - Add `export PATH=~/depot_tools:"$PATH"` (it's important that depot_tools comes first here)
  - `source ~/.zshrc`
  - From the directory you want to install V8 into, run `gclient`

### Build V8

- `fetch v8`
- `cd ~/v8`
- `gclient sync`
- `tools/dev/v8gen.py x64.optdebug`
- `ninja -C out.gn/x64.optdebug` (prepare for lots of fan noise)

I'd also recommend adding these to your `.zshrc`:

- `sudo nano ~/.zshrc`
- Add `alias d8=~/v8/out.gn/x64.optdebug/d8`
- Add `alias tick-processor=~/v8/tools/mac-tick-processor`
- Add `export D8_PATH="~/v8/out.gn/x64.optdebug"`
- `source ~/.zshrc`

> 使用 Demo 请参考 [d8-shell-examples](https://gist.github.com/kevincennis/0cd2138c78a07412ef21#d8-shell-examples)

## Java

### 下载安装

```sh
brew tap homebrew/cask-versions
brew install --cask zulu11
```

### 添加环境变量

添加以下配置到 `~/.zshrc`

```sh
export PATH="/usr/local/opt/openjdk@11/bin:$PATH"
export JAVA_HOME=`/usr/libexec/java_home -v 11`
```

执行下面的命令让配置立即生效：

```sh
source ~/.zshrc
```

### 实用命令

1、Mac 下查看已安装的 jdk 版本及其安装目录: `/usr/libexec/java_home -V`

```sh
Matching Java Virtual Machines (2):
  11.0.17 (x86_64) "Azul Systems, Inc." - "Zulu 11.60.19" /Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home
  1.8.0_312 (x86_64) "Homebrew" - "OpenJDK 8" /usr/local/Cellar/openjdk@8/1.8.0+312/libexec/openjdk.jdk/Contents/Home
/Library/Java/JavaVirtualMachines/zulu-11.jdk/Contents/Home
```

2、查看 jre 版本: `java -version`

3、查看 jdk 版本: `javac -version`

## Maven

### 安装

```sh
$ brew install maven
```

### 配置 Maven 本地仓库

`setting.xml` 路径为 `${Maven Home}/conf/settings.xml` ，Maven Home 可以通过 `mvn --version 获取`

```xml
<localRepository>~/maven_repo</localRepository>
```

可将 `settings.xml` 直接拷贝到 `.m2` 文件夹下，进行配置。

如果没有 `.m2` 文件夹时,运行命令

```sh
$ mvn help:system
```

然后打开当前用户的目录，可以在其中找到 `.m2` 文件夹

### 配置阿里镜像

```xml
<mirror>
  <id>alimaven</id>
  <name>aliyun maven</name>
  <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
  <mirrorOf>central</mirrorOf>
</mirror>
```

### 升级 Maven

```sh
$ brew unlink
$ brew update
$ brew install maven
```

## MySql

```shell
$ brew install mysql
```

### 修改配置文件

```shell
$ nano /usr/local/etc/my.cnf
```

### 启动服务

```shell
brew services start mysql
# 重启
brew services restart mysql
# 停止
brew services stop mysql
```

> Or, if you don't want/need a background service you can just run: `mysql.server start`

### 安全设置

```shell
$ mysql_secure_installation
```

1. 建立密码验证插件

```shell
Securing the MySQL server deployment.

Connecting to MySQL using a blank password.

VALIDATE PASSWORD PLUGIN can be used to test passwords and improve security. It checks the strength of password and allows the users to set only those passwords which are secure enough. Would you like to setup VALIDATE PASSWORD plugin?

Press y|Y for Yes, any other key for No: y
```

2. 选择密码规则

```shell
There are three levels of password validation policy:

LOW    Length >= 8
#长度大于等于8
MEDIUM Length >= 8, numeric, mixed case, and special characters
#长度大于等于8，数字、大小写字母、特殊符号
STRONG Length >= 8, numeric, mixed case, special characters and dictionary file
#长度大于等于8，数字、大小写字母、特殊符号和字典文件（慎选！）

Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG: 1
Please set the password for root here.

New password: （输入你的密码）
Re-enter new password: （再次输入你的密码）
```

3. 创建符合规则的新密码

```shell
Estimated strength of the password: 50 		#密码强度
Do you wish to continue with the password provided?(Press y|Y for Yes, any other key for No) : y
```

4. 删除匿名用户

```
By default, a MySQL installation has an anonymous user, allowing anyone to log into MySQL without having to have a user account created for them. This is intended only for testing, and to make the installation go a bit smoother.
You should remove them before moving into a production environment.

Remove anonymous users? (Press y|Y for Yes, any other key for No) : y
Success.
```

5. 禁止远程登录

```shell
Normally, root should only be allowed to connect from 'localhost'. This ensures that someone cannot guess at the root password from the network.

Disallow root login remotely? (Press y|Y for Yes, any other key for No) : y
Success.
```

6. 删除测试数据表

```shell
By default, MySQL comes with a database named 'test' that anyone can access. This is also intended only for testing, and should be removed before moving into a production environment.

Remove test database and access to it? (Press y|Y for Yes, any other key for No) : y
- Dropping test database...
Success.

- Removing privileges on test database...
Success.
```

7. Done

```shell
Reloading the privilege tables will ensure that all changes made so far will take effect immediately.

Reload privilege tables now? (Press y|Y for Yes, any other key for No) : y
#是否重新加载权限表
Success.

All done!
```

**Your password does not satisfy the current policy requirements：**

如果你在选择密码规则的时候不小心选择了 2，也就是数字、大小写字母、特殊符号和字典文件的组合。这时你会发现 `mysql_secure_installation`不会再给你机会重新设置了。手动微笑，mmp。方法还是有的：

```shell
SHOW VARIABLES LIKE 'validate_password%';
```

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68541c4633b944d69276a3da8f453406~tplv-k3u1fbpfcp-zoom-1.image)

使用命令 `mysql -u root` 登陆，执行：

```shell
set global validate_password.policy=0;
set global validate_password.length=4;
#将密码规则设置为LOW，就可以使用纯数字纯字母密码
```

### 登陆

```shell
$ mysql -u root -p
```

## mongodb

> 参考: [Mac OSX 平台安装 MongoDB](https://www.runoob.com/mongodb/mongodb-osx-install.html)、[Mac 下安装 MongoDB 数据库-启动-停止-开启验证-登陆](https://www.32e.top/system/mac/article-87.html)、[【环境搭建：二】Mac 安装、配置 MongoDB](https://uizph.com/article/5db177e4a9f13d7f535810c5)、[MongoDB 的用户创建更新及删除](https://www.jianshu.com/p/f5afc6488f9e)、[MongoDB 用户名密码登录 认证登陆](https://cloud.tencent.com/developer/article/1446551)

### 下载安装

```sh
$ brew install mongodb/brew/mongodb-community
$ mongod -version
```

### 配置

**启动 mongo**：

1. 新建 dbpath

```sh
$ sudo mkdir ~/data/db
$ sudo mkdir ~/data/log
```

2. 启动

```sh
$ sudo mongod --dbpath ~/data/db --fork --logpath ~/data/log/mongo.log
```

> 注意：Mac OS 10.15.1 版本之后， `/data/db` 文件夹消失了，重新创建文件夹提示 `mkdir: /data/db: Read-only file system`，解决办法也可以是 `sudo mkdir ~/data/db && sudo mongodb --dbpath ~/data/db`

**设置验证和用户名密码**：

```sh
$ mongo
# 创建超级管理员
> db.createUser({ user: "root" , pwd: "123456", roles: ["root"]});
Successfully added user: {
   "user" : "root",
   "roles" : ["root"]
}
# 尝试使用上面创建的用户信息进行连接。
> db.auth("root","123456")
1
# 创建一个名为 admin，密码为 123456 的用户。
> db.createUser({ user: "admin", pwd: "123456", roles:["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]});
Successfully added user: {
   "user": "admin",
   "roles": [
   {
      "role": "userAdminAnyDatabase",
      "db": "admin"
   }
  ]
}
# 尝试使用上面创建的用户信息进行连接。
> db.auth("admin","123456")
1
```

**开启验证模式登录**：

开启 mongod 时，指定 `--auth` 参数即可以验证模式打开：

```sh
$ sudo mongod --dbpath ~/data/db --fork --logpath ~/data/log/mongo.log --auth
```

**登录时验证**：

```shell
$ mongo 127.0.0.1:27017/admin -u admin -p 123456
# 等价于
$ mongo --port 27017 -u "adminUser" -p "adminPass" --authenticationDatabase "admin"
```

**登录后验证**：

```shell
$ mongo
> use admin
> ab.auth("admin","123456")
```

### 退出 mongodb

```sh
# 先停止 mongod 服务
$ use admin;
$ db.shutdownServer();

# 然后退出 mongo
$ exit;
```

## 更多

### natapp

开启您的内网穿透之旅,调试微信的利器，请至[官网](https://natapp.cn/)下载。

### 设置 SSH Key

在用户主目录下，看看有没有 `.ssh` 目录，如果有，再看看这个目录下有没有 `id_rsa` 和 `id_rsa.pub` 这两个文件，如果已经有了，可直接跳到下一步。如果没有，打开 Shell（Windows 下打开 Git Bash），创建 SSH Key：

```bash
$ ssh-keygen -t rsa -C "youngjuning@163.com"
# 添加到系统 keychain
ssh-add --apple-use-keychain ~/.ssh/id_rsa
# 添加 public key 到 github
gh auth login
gh ssh-key add ~/.ssh/id_rsa.pub -t id_rsa
```

### vim

> 建议使用：https://github.com/amix/vimrc

```shell
$ git clone --depth=1 https://github.com/amix/vimrc.git ~/.vim_runtime
$ sh ~/.vim_runtime/install_awesome_vimrc.sh
$ echo "set number" >> ~/.vimrc
$ echo "set showcmd" >> ~/.vimrc
$ source ~/.vimrc
```

> 本文首发于「[紫竹的官方网站](https://youngjuning.js.org/)」，同步于「[掘金专栏](https://juejin.cn/user/325111174662855)」。
