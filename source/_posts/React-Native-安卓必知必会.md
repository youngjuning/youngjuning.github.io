---
title: React Native 安卓必知必会
date: 2020-02-20 14:57:55
categories:
  - [移动开发, React Native]
tags:
  - 安卓
---

<img src="https://i.loli.net/2020/02/21/xUfw9Ib4TRsQGeM.png" style="zoom:70%;" />

<!--more-->

## 配置应用名

很简单,我们直接打开 `android/app/src/main/res/values/strings.xml`，即可看到配置中的 `app_name`，修改为你想要的即可。

## 配置图标

也很简单，在 `android\app\src\main\res\mipmap-xxxxxx` 中直接覆盖图标就可以，注意图标的大小。

## 打包 APK

1、在项目根目录执行 `keytool -genkeypair -v -keystore release.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000` 生成密钥文件 `release.keystore`

2、把 `release.keystore` 文件放到你工程中的 `android/app` 文件夹下。

3、配置 `android/app/build.gradle`

```java
android{
    ...
    signingConfigs {
        release {
            storeFile file("release.keystore")
            storePassword "****"
            keyAlias "my-key-alias"
            keyPassword "****"
        }
    }
    ...
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

### 去除无用的语言资源

通过配置 `android/defaultConfig/resConfigs` 可以选择只打包哪几种语言，进而去掉各种 aar 包中全世界的语言，尤其是 support 包中的。

选择保留什么语言要根据产品的用户和市场来定，如果只选择默认英语和中文语言，配置如下：

```diff
defaultConfig {
+    resConfigs "en","zh"
}
```

### 配置 PackagingOptions

打开 `android/app/build.gradle` 文件，添加如下配置：

```
packagingOptions {
    exclude 'META-INF/android_release.kotlin_module'
    exclude 'META-INF/DEPENDENCIES'
    exclude 'META-INF/LICENSE'
    exclude 'META-INF/LICENSE.txt'
    exclude 'META-INF/license.txt'
    exclude 'META-INF/NOTICE'
    exclude 'META-INF/NOTICE.txt'
    exclude 'META-INF/notice.txt'
    exclude 'META-INF/ASL2.0'
}
```

- pickFirsts: 当出现重复文件，会使用第一个匹配的文件打包进入 apk
- merges: 当出现重复文件，合并重复的文件打入 apk
- excludes: 打包的时候排除匹配的文件

**参考链接**

- [PackagingOptions](http://t.cn/Ewt1xD2)
- [More than one file was found with OS independent path](http://t.cn/AipuM9Ll)
- [More than one file was found with OS independent path 'META-INF/LICENSE'](http://t.cn/AipuMfcH)

### 配置 splits

> 查看手机 CPU 信息：`adb shell` -> `cd /proc` -> `cat cpuinfo`

默认情况下，生成的 `APK` 会同时包含针对于 `x86` 和 `ARMv7a` 两种 `CPU` 架构的原生代码。这样可以让我们更方便的向其他人分享这个 `APK`，因为它几乎可以运行在所有的 Android 设备上。但是，这会导致所有设备上都有一些根本不会运行的代码，白白占据了空间。目前安卓设备绝大多数是 `ARM` 架构，因此对于大部分应用来说可以考虑去掉 `x86` 架构的支持。

你可以在 `android/app/build.gradle` 中修改如下代码：

```diff
- include "armeabi-v7a", "x86", "arm64-v8a", "x86_64"
+ include "armeabi-v7a", "arm64-v8a"
- def versionCodes = ["armeabi-v7a":1, "x86":2, "arm64-v8a": 3, "x86_64": 4]
+ def versionCodes = ["armeabi-v7a":1, "arm64-v8a": 2]
```

- abi: Application Binary Interface，针对不同的 `CPU` 架构生成 `APK` 以减小 `APK` 文件的大小

  - `mips/mips64`：极少用于手机，出发点是高性能,主要用于路由器、猫。
  - `armeabi`：老版本 `ARMv5`，不支持硬件辅助浮点运算，支持所有的 `ARM` 设备。
  - `x86`/`x86_64`：`x86` 架构的手机的市场占有率很低，约为 1%左右。而且 `x86` 架构都包含 `ARM` 模拟层，兼容 `ARM` 类型的 `ABI`。注意，模拟器为 `x86` 架构。
  - `arm64-v8a`：64 位 `ARM` 架构。可用 32 位模式运行 `armeabi-v7a` 和 `armeabi`。（所谓的 `ARMv8` 架构，就是在 `MIPS64` 架构上增加了 `ARMv7` 架构中已经拥有的的 `TrustZone` 技术、虚拟化技术及 `NEON advanced SIMD` 技术等特性，研发成的）
  - `armeabi-v7a`：主流版本 `AMRv7`，2011 年 15 月以后的生产的大部分 Android 设备都使用它。

- density: 针对不同的分辨率生成 `APK` 以减小 `APK` 文件的大小

### Failed to read PNG signature: file does not start with PNG signature

有时从网上下载的 Demo 资源文件不规范，会出现直接将 jpg 文件改为 png 后缀名的情况，gradle 打包检查时报错编译通不过的。我们通过 `aaptOptions.cruncherEnabled=false` 来禁止 Gradle 检查 png 的合法性：

```diff
android {
  aaptOptions {
    cruncherEnabled=false
  }
}
```

### 配置 dexOptions.javaMaxHeapSize

> android studio 需要较大的内存才能正常编译项目，主要解决这个警告：[com.android.build.api.transform.TransformException](http://t.cn/EZcTDtV)

在 `android\gradle.properties` 中加入以下配置：

```diff
+ dexOptions.javaMaxHeapSize = 2g
```

### gradle 优化配置

在 `android\gradle.properties` 中加入以下配置：

```
# 让gradle使用单独的守护进程
org.gradle.daemon=true
# 让gradle并行编译
org.gradle.parallel=true
# 让gradle在需要的时候才配置
org.gradle.configureondemand=true
# 增加gradle运行的java虚拟机的大小
org.gradle.jvmargs=-Xmx3072m -XX:MaxPermSize=1024m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
```

### 配置方法数超过 64K 的应用

随着 Android 平台的持续成长，Android 应用的大小也在增加。当您的应用及其引用的库达到特定大小时，您会遇到构建错误，指明您的应用已达到 Android 应用构建架构的极限。会报告这一错误：

> The number of method references in a .dex file cannot exceed 64K.

解决办法是配置您的应用进行 Dalvik 可执行文件分包，在 `android/app/build.gradle` 中做下面的配置：

```diff
defaultConfig {
+    multiDexEnabled true
}
```

## BuildConfig

> 在 react-native 中，我们可以借助 react-native-config-reader 来方便地读取这些属性

BuildConfig 是程序编译后，根据 buildType 生成在 `app\build\generated\source\buildConfig\debug(release)\` 包名下的一个 java 文件。默认有一下属性：

- DEBUG：是否是调试版本
- APPLICATION_ID：当前应用的包名
- FLAVOR：产品（渠道包的名称）
- BUILD_TYPE：当前的编译类型(release/debug)
- VERSION_CODE：版本号(数字)
- VERSION_NAME：版本号

### 自定义 BuildConfig

```java
defaultConfig {
  // 三个参数: 1.要定义的常量的类型 2.该常量的命名 3.该常量的值
  // APP_NAME，对应 ios 的 CFBundleDisplayName
  buildConfigField "String", "APP_NAME", '"我是谁"'
  // BUILD_TIME
  buildConfigField "String", "BUILD_TIME", '"' + new Date().format("yyyy-MM-dd HH:mm:ss", TimeZone.getTimeZone("Asia/Shanghai")) + '"'
}
```

### 在子模块中取主项目的 BuildConfig

```java
...
public static Object getBuildConfigValue(Context context, String fieldName) {
  try {
    Class<?> clazz = Class.forName(context.getPackageName() + ".BuildConfig");
    Field field = clazz.getField(fieldName);
    return field.get(null);
  } catch (ClassNotFoundException e) {
    e.printStackTrace();
  } catch (NoSuchFieldException e) {
    e.printStackTrace();
  } catch (IllegalAccessException e) {
    e.printStackTrace();
  }
  return null;
}
...
String versionName = (String)getBuildConfigValue(activity, "VERSION_NAME"))
```

- [BuildConfig 与 build.gradle 的关系](https://www.jianshu.com/p/3d9b23afe514)
- [Gradle 之 BuildConfig 自定义常量](https://www.jianshu.com/p/274c9d95cf76)

## 解决在 Android P 上的提醒弹窗 （Detected problems with API compatibility(visit g.co/dev/appcompat for more info)

在 `MainActivity.java` 中添加 closeAndroidPDialog 方法并在 `onCreate` 方法中调用

```java
import android.os.Bundle;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
...
@Override
protected void onCreate(Bundle savedInstanceState) {
  closeAndroidPDialog(); // here
  super.onCreate(savedInstanceState);
}
...
private void closeAndroidPDialog(){
  try {
    Class aClass = Class.forName("android.content.pm.PackageParser$Package");
    Constructor declaredConstructor = aClass.getDeclaredConstructor(String.class);
    declaredConstructor.setAccessible(true);
  } catch (Exception e) {
    e.printStackTrace();
  }
  try {
    Class cls = Class.forName("android.app.ActivityThread");
    Method declaredMethod = cls.getDeclaredMethod("currentActivityThread");
    declaredMethod.setAccessible(true);
    Object activityThread = declaredMethod.invoke(null);
    Field mHiddenApiWarningShown = cls.getDeclaredField("mHiddenApiWarningShown");
    mHiddenApiWarningShown.setAccessible(true);
    mHiddenApiWarningShown.setBoolean(activityThread, true);
  } catch (Exception e) {
    e.printStackTrace();
  }
}
```

## 闪屏图尺寸

- mdpi：320x480
- hdpi：480x800
- xhdpi：720x1280
- xxhdpi：1080x1920
- xxxhdpi：2160x3840
