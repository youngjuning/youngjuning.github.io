---
title: React Native 引入第三方 Android SDK
date: 2023-04-21 18:40:00
cover: https://i.loli.net/2021/04/07/Vm2bOetv4HuB3Al.png
description: 在 React Native 开发中，如果一个原生 SDK 没有适配 React Native 的插件，原则上我们不推荐你使用。但是万不得已的情况下，我们有办法吗？答案是肯定的。步骤大致分为集成 SDK、编写桥接代码。知难行易，本文就是顺着这个思路来解决让前端工程师脑壳疼的集成第三方 SDK 并编写桥接代码的问题。
categories:
  - [前端, React Native]
tags:
  - React Native
  - Android SDK
---

在 React Native 开发中，如果一个原生 SDK 没有适配 React Native 的插件，原则上我们不推荐你使用。但是万不得已的情况下，我们有办法吗？答案是肯定的。步骤大致分为集成 SDK、编写桥接代码。知难行易，本文就是顺着这个思路来解决让前端工程师脑壳疼的集成第三方 SDK 并编写桥接代码的问题。

## 预备知识

在我们开发安卓项目的时候，不会所有的功能都自己去造轮子，经常要使用到各种的其他包，其中有谷歌给我们提供的各种 `support` 包，也有各种第三方的功能库，有时候我们自己也会将一些功能封装成包。这些包存在和导入的形式也多种多样，有远程仓库的，有直接拷贝到本地的，`jar` 包、`aar` 包、`so` 包等。所幸我们都可以在主工程和各个 `Module` 的 `build.gradle` 里进行统一管理。— [Android 依赖导入全攻略](http://t.cn/Ai9T02Jq)

### 依赖引入方式

`Android Gradle plugin 3.0` 几个引入依赖的方法：

**implementation**

对于使用了该命令编译的依赖，对该项目有依赖的项目将无法访问到使用该命令编译的依赖中的任何程序，也就是将该依赖隐藏在内部，而不对外部公开。`react-native link` 命令即使用该方式

使用 `implementation` 会使编译速度有所增快：比如我在一个 `library` 中使用 `implementation` 依赖了 `gson` 库，然后我的主项目依赖了 `library`，那么，我的主项目就无法访问 `gson` 库中的方法。这样的好处是编译速度会加快，我换了一个版本的 `Gson` 库，但只要 `library` 的代码不改动，就不会重新编译主项目的代码。

**api**

等同于 compile 指令

**compileOnly**

等同于 `provided`，只在编译时有效，不会参与打包，不会包含到 `apk` 文件中。可以用来解决重复导入库的冲突。

## 远程仓库依赖

> 这里我们以 LeanCloud Android SDK 的引入来演示

引入远程仓库依赖是很方便的，但在之前我们需要在项目根目录的 `build.gradle` 声明远程仓库的地址。

```diff
buildscript {
    repositories {
        jcenter()
+        //这里是 LeanCloud 的包仓库
+        maven {
+            url "http://mvn.leancloud.cn/nexus/content/repositories/public"
+        }

    }
    dependencies {
        classpath 'com.android.tools.build:gradle:1.0.0'
    }
}

allprojects {
    repositories {
        jcenter()
+        //这里是 LeanCloud 的包仓库
+        maven {
+            url "http://mvn.leancloud.cn/nexus/content/repositories/public"
+        }
    }
}
```

然后打开 `app` 目录下的 `build.gradle` 进行如下配置：

```diff
android {
+    //为了解决部分第三方库重复打包了META-INF的问题
+    packagingOptions{
+        exclude 'META-INF/LICENSE.txt'
+        exclude 'META-INF/NOTICE.txt'
+    }
    lintOptions {
        abortOnError false
    }
}

dependencies {
    compile ('com.android.support:support-v4:21.0.3')

+    // LeanCloud 基础包
+    compile ('cn.leancloud.android:avoscloud-sdk:4.7.10')
+
+    // 推送与即时通讯需要的包
+    compile ('cn.leancloud.android:avoscloud-push:4.7.10@aar'){transitive = true}
}
```

## 本地依赖

> 使用 Android Studio 的同学请参考: [Android Studio 引入 jar 包和 so 文件（armeabi 和 armeabi-v7a）](http://t.cn/Ai9TFsHH)

### jar 包

1、将 `jar` 文件复制、粘贴到 `app/libs` 目录中，React Native 默认没有该文件夹，清新建一个

2、打开 `app/build.gradle`，进行如下配置以列出包含 `jar` 包的文件夹路径。

> 注意：React Native 默认已经进行了这个配置

```diff
dependencies {
    implementation fileTree(dir: "libs", include: ["*.jar"])
}
```

和远程仓库依赖引入方式不同，如果本地同时存在两个不同的 `jar` 包，或者本地已有 `jar` 包，再去远程依赖不同版本的 `jar` 包，就会报错。

![紫竹](https://i.loli.net/2019/06/05/5cf73b7ea3e2b53276.jpg)

解决方式：将其中的一个采用 `compileOnly` 替换 `implementation`。顾名思义，`compileOnly` 只在编译时起作用，不会包含到 `APK` 里面，在运行时也就避免找到重复的类了。

### aar 包

`arr` 全称是 `Andorid Archive`,是一个 Android 库项目的二进制归档文件，使用 Android Studio ，非常简单可以生成一个 AAR 文件。

和 `jar` 包不同，`aar` 包存放的路径声明和依赖引入是分开的：

1、将 `aar` 包复制到 `lib` 目录下

2、在项目根目录 `build.gradle`中声明 `aar` 文件存放路径

```diff
buildscript {
  repositories {
+    flatDir { // 引用本项目的libs下的aar
+      dir "$rootDir/libs"
+    }
  }
}
allprojects {
  repositories {
+    flatDir { // 引用本项目的libs下的aar
+      dir "$rootDir/libs"
+    }
  }
}
```

3、在 `app/build.gradle` 中注入依赖

> 注意：远程 `aar` 引入形式是：`implementation('com.sishu.android:watermelondb:0.7.0@aar')`

```diff
dependencies {
+    implementation(name: 'aar名字', ext: 'aar')
}
```

### so 文件

直接在 `src->main` 下新建一个文件夹 `jniLib` ，然后再把 `so` 文件所在的那个文件夹 `armeabi` 复制过去。

> 注：`jniLib` 是 so 文件默认的放置目录

## 坑

### 都是 Proguard 惹的祸

有时候明明导入了 `jar` 包，却仍然找不到 `jar` 包中的方法呢？八成是因为你开启了混淆，最安全的就是空间换安全。但是一个较真的程序员不能满足于此，我们还是要搞清楚 Proguard 惹了什么祸的。这里分享给大家一招：

打开 Android Studio 像原生开发工程师一样使用 Logcat 查看应用日志，比如你找到是 `com.huawei.**` 这个库找不到，那么进行如下配置：

```diff
+ -dontwarn com.huawei.**
+ -keep class com.huawei.**{*;}
```

- `-dontwarn` 表示让 ProGuard 不要警告找不到 `com.huawei.**` 这个包里面的类的相关引用
- `-keep class` 表示保持 `com.huawei.**` 这个包里面的所有类和所有方法不被混淆。再次编译打包，发现 apk 大小要明显大于之前的包。运行 app，问题解决！

### aar 包中的资源文件重复了

资源文件重复了，主工程的资源文件会直接覆盖 `aar` 包中的文件，并且不会有任何报错或者提示，最终 `aar` 包中也会直接用主工程的资源文件，所以需要注意命名方式。暂时没有更好的解决方法。

### AndroidManifest 合并错误

同样也是发生在 `aar` 包上， Android Studio 项目每个 module 中都可以有一个 `AndroidManifest.xml` 文件，但最终的 APK 文件只能包含一个 `AndroidManifest.xml` 文件。在构建应用时，Gradle 构建会将所有清单文件合并到一个封装到 APK 的清单文件中。aar 包的清单文件和我们的 app 清单文件属性冲突时：用 `tools:replace="属性名"` 解决。

### annotationProcessor 与 compileOnly 的区别

上文说了 `annotationProcessor` 与 `compileOnly` 都是只编译并不打入 apk 中，他俩到底有什么区别呢？扮演的角色不一样，`annotationProcessor` 作用是编译时生成代码，编译完真的就不需要了，`compileOnly` 是有重复的库，为的是剃除只保留一个库，最终还是需要的。

## 参考

- [Android Studio 引入 jar 包和 so 库](http://t.cn/Ai9HmlWb)
- [Android 依赖导入全攻略](http://t.cn/Ai9T02Jq)
- [React-native 使用原生(ios, android)第三方 sdk](http://t.cn/Ai98bNbj)
