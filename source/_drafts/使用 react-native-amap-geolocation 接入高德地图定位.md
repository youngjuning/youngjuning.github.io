---
title: 使用 react-native-amap-geolocation 接入高德地图定位
date: 2020-03-17 16:05:44
categories:
  - [前端开发, React Native]
tags:
  - amap
---

![](https://i.loli.net/2020/03/17/peGk8hUbdQAoY7w.png)

react-native-amap-geolocation这款插件接入了高德地图定位模块。支持 Android + iOS，提供尽可能完善的原生接口， 同时提供符合 Web 标准的 Geolocation API。

<!--more-->

> 本文基于 react-native 0.60 以上版本！

## 获取高德 App Key

为了使用高德 SDK，你需要准备高德 App Key，获取方法参考高德地图 SDK 官方文档：

- [获取 Android App Key](https://lbs.amap.com/api/android-location-sdk/guide/create-project/get-key)
  ```json
  {
    "an:key-debug": "keytool -list -v -keystore ./android/app/debug.keystore",
    "an:key-release": "keytool -v -list -keystore ./android/app/release.keystore"
  }
  ```

- [获取 iOS App Key](https://lbs.amap.com/api/ios-location-sdk/guide/create-project/get-key)

  > ios 只需要 `Bundle Identifier` 即可

## 安装

```sh
$ yarn add react-native-amap-geolocation
```

## ios 配置

### 下载和安装高德IOS SDK

1. 下载[基础SDK(含IDFA)](https://links.jianshu.com/go?to=https%3A%2F%2Fa.amap.com%2Flbs%2Fstatic%2Fzip%2FAMap_iOS_Foundation_Lib_V1.4.3.zip)
2. 下载[定位SDK](https://links.jianshu.com/go?to=https%3A%2F%2Fa.amap.com%2Flbs%2Fstatic%2Fzip%2FAMap_iOS_Loc_Lib_V2.6.2.zip)
3. 将下载的 `AMapFoundationKit.framework` 和 `AMapLocationKit.framework` 以及 项目自带的`ExternalAccessory.framework` 添加到 `Build Phases` ➜ `Link Binary With Libraries`。

### 配置权限

1. 添加以下权限到 `Info.plist` 文件中：

   ```xml
   <key>NSLocationWhenInUseUsageDescription</key>
   <string></string>
   <key>NSLocationAlwaysUsageDescription</key>
   <string></string>
   ```

2. ATS设置:  `Target`➜ `Info` ➜ `App Transport Security Setting` 展开后的 `Allow Arbitrary Loads` 设置为 `YES`

**如果要支持后台持续定位，还需要配置以下：**

1. 打开xcode，点击项目
2. 选择 `Signing&Capabilities`,把 `Background Modes` 打开为 `ON`，然后打勾 `Location updates`

   <img src="https://i.loli.net/2020/03/18/ljTXqS9AboycPNk.png" style="zoom: 67%;" />

## Android

react-native 为 0.6x 的话，`yarn add react-native-amap-geolocation` 就完事了，一步到位不需要过多配置。

## 基本用法

```js
import { PermissionsAndroid } from "react-native";
import { init, Geolocation } from "react-native-amap-geolocation";

// 对于 Android 需要自行根据需要申请权限
await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);

// 使用自己申请的高德 App Key 进行初始化
await init({
  ios: "9bd6c82e77583020a73ef1af59d0c759",
  android: "043b24fe18785f33c491705ffe5b6935"
});

Geolocation.getCurrentPosition(({ coords }) => {
  console.log(coords);
});
```

## 更多用法

该项目除了提供符合 Web 标准的 Geolocation API，同时为了最大程度的发挥高德定位 SDK 的功能， 会尽可能提供与原生 SDK 一致的接口封装。由于 iOS 和 Android SDK 提供的接口并不一致， 于是最终实现的接口大部分是并不通用的。这在接口文档或文档注释有注明， 比如 `@platform android` 表示该接口仅用于 Android。

以下是一些常用接口的用法说明以及示例代码，更多接口的具体用法请参考[接口文档](https://qiuxiang.github.io/react-native-amap-geolocation/#/)。

## 直接使用原生接口

```js
import { init, addLocationListener, start, stop } from "react-native-amap-geolocation";

// 添加定位监听函数
addLocationListener(location => console.log(location));

// 开始连续定位
start();

// 在不需要的时候停止定位
stop();
```

## 逆地理编码

Android 默认返回逆地理编码，而 iOS 需要手动设置。

```js
import { setLocatingWithReGeocode, setNeedAddress } from "react-native-amap-geolocation";

// android
setNeedAddress(true);

// ios
setLocatingWithReGeocode(true);
```

## 定位回调频率限制

```js
import { setInterval, setDistanceFilter } from "react-native-amap-geolocation";

// android，5 秒请求一次定位
setInterval(5000);

// ios，设备移动超过 10 米才会更新位置信息
setDistanceFilter(10);
```

## 参考

- [高德地图API](https://lbs.amap.com/api)
- [react-native-amap-geolocation安装与使用](https://www.jianshu.com/p/f87316635ff6)
- [react-native-amap-geolocation 使用指南](https://qiuxiang.github.io/react-native-amap-geolocation/)
- [[react-native-amap-geolocation 接口文档](https://qiuxiang.github.io/react-native-amap-geolocation/api/index.html)

## 联系作者

|                           作者微信                           |                           知识星球                           |                           赞赏作者                           |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="https://user-gold-cdn.xitu.io/2020/2/24/17074acbb24c7412?w=200&h=200&f=jpeg&s=17183" style="width:200px"/> | <img src="https://user-gold-cdn.xitu.io/2020/2/24/17074acbb26af8e1?w=200&h=200&f=png&s=39093" style="width:200px"/> | <img src="https://user-gold-cdn.xitu.io/2020/2/24/17074acbb338c643?w=698&h=700&f=png&s=315492" style="width:200px"/> |
