---
title: 在 Mac 上搭建 Java 开发环境
description: ''
cover: ''
date: 2025-03-07 07:38:26
categories:
  - [后端, Java]
tags:
  - Java
  - Maven
  - Mac
---

## Java

### 下载安装

```sh
brew install --cask zulu@17
```

### 实用命令

#### 查看 jdk 版本及其安装目录

```sh
$ /usr/libexec/java_home -V
Matching Java Virtual Machines (1):
    17.0.14 (arm64) "Azul Systems, Inc." - "Zulu 17.56.15" /Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

#### 查看 jre 版本

```sh
$ java -version
openjdk 17.0.14 2025-01-21 LTS
OpenJDK Runtime Environment Zulu17.56+15-CA (build 17.0.14+7-LTS)
OpenJDK 64-Bit Server VM Zulu17.56+15-CA (build 17.0.14+7-LTS, mixed mode, sharing)
```

#### 查看 jdk 版本

```sh
$ javac --version
javac 17.0.14
```

## Maven

### 安装

```sh
$ brew install maven
```

### 配置阿里镜像

`setting.xml` 路径为 `${Maven Home}/conf/settings.xml` ，Maven Home 可以通过 `mvn --version`

可将 `settings.xml` 直接拷贝到 `.m2` 文件夹下，进行配置。

如果没有 `.m2` 文件夹时,运行命令

```sh
$ mvn help:system
```

然后打开当前用户的目录，可以在其中找到 `.m2` 文件夹，在 `settings.xml` 的 `<mirrors>` 标签内添加：

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
$ brew update
$ brew install maven
```
