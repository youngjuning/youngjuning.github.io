---
title: React Native 热更新不求人
date: 2020-05-30
 21:59:19
tags:
---

<!--more-->

## code-push-server

> TODO

## code-push-cli

由于 `appcenter-cli` 只支持微软官方的 CodePush 服务，因此我们只好继续使用 code-push-cli。

### 登录

```shell
$ code-push login http://192.168.2.119:3000/
```

这时候，浏览器会弹出页面让你填写密码，以此获取 `accessKey`，将获取的`accessKey`填回命令行，即可登录成功，记住这个 `accessKey`，下次即可通过以下命令直接登录：

```shell
$ code-push login http://192.168.2.119:3000/ --accessKey 8CB9b37oz6CuHyW2vwsDaXut6biy4ksvOXqog
```

### 添加应用

> `code-push app add <appName> <os> <platform>`

```shell
$ code-push app add ios_myapp ios react-native
$ code-push app add android_myapp Android react-native
```

> 注意：如果你的应用分为 Android 和 ios 版，那么注册应用的时候需要注册两个 App 获取两套 `deployment key`，可以通过 `code-push deployment ls <appName> -k` 获取部署的密钥

### 操作应用

- 移除应用：`code-push app remove|rm <appName>`
- 重命名应用：`code-push app rename <currentAppName> <newAppName>`
- 应用列表：`code-push app list|ls`

### 添加部署

添加应用后，它默认包含两个部署环境：`Staging` 和 `Production` 。这让你可以理解发布更新到一个内部的环境，你可以在推送到终端用户之前彻底的测试每个更新。这个工作流是至关重要的，以确保你的版本准备好给大众，而且这是一个在Web上实践很久的惯例。

如果你的App有 `Staging` 和 `Production` 环境其实已经满足了你的需求，然后你不需要做任何事情。不过，如果你需要 `alpha`，`dev`等部署环境，那你可以简单的使用如下命令创建：

```shell
$ code-push deployment add <appName> <deploymentName>
```

### 操作部署

- `code-push deployment clear <appName> <deploymentName>`： 清除部署历史
- `code-push deployment remove|rm <appName> <deploymentName>`：删除一个部署
- `code-push deployment rename <appName> <currentDeploymentName> <newDeploymentName>`：重命名部署
- `code-push deployment list|ls <appName> [options]`：部署列表
  -  `--format` ：Output format to display your deployments with (`"json"`or `"table"`) [字符串] [默认值: `"table"`]
  - `--displayKeys`,` -k`： Specifies whether to display the deployment keys [布尔] [默认值: `false`]
- `code-push deployment history|h <appName> <deploymentName> [options]`：查看发布的历史记录
  -  `--format`：Output format to display the release history with (`"json"` or `"table"`) [字符串] [默认值: `"table"`]
  - `--displayAuthor`,` -a`：Specifies whether to display the release author [布尔] [默认值: `false`]

### 发布部署

- `code-push release-react <appName> <platform> [options]`: 发布新的热更新版本
  - `code-push release-react android_myapp android --gradleFile=android/app/build.gradle`
  - `code-push release-react ios_myapp ios --plistFile=ios/betty/Info.plist`

其中参数 `-t` 为二进制(`.ipa`与`apk`)安装包的的版本，建议动态读；`--dev` 为是否启用开发者模式(默认为`false`)；`–d` 是要发布更新的环境分 `Production` 与 `Staging` (默认为 `Staging`)；`--des` 为更新说明；`–m` 是强制更新。

## react-native-code-push

### 安装组件

```shell
$ yarn add react-native-code-push
```

### iOS设置

获得 CodePush 插件后，必须将其集成到 React Native 应用程序的 Xcode 项目中并正确配置。

1. 运行`cd ios && pod install && cd ..`以安装所有必需的CocoaPods依赖项。

2. 打开`AppDelegate.m`文件，并为CodePush标头添加导入语句：

   ```objective-c
   #import <CodePush/CodePush.h>
   ```

3. 查找以下代码行，该代码为生产版本的网桥设置源URL：

   ```objective-c
   return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
   ```

4. 用以下行替换它：

   ```objective-c
   return [CodePush bundleURL];
   ```

   此更改将你的应用配置为始终加载应用JS捆绑包的最新版本。在首次启动时，这将与使用该应用程序编译的文件相对应。但是，在通过CodePush推送更新后，这将返回最近安装的更新的位置。

   通常，您只想使用 CodePush 来解决发行版本中的 JS 包位置，因此，我们建议使用`DEBUG`预处理器宏在是否使用打包程序服务器和 CodePush 之间进行动态切换。这样可以更轻松地确保您在生产中获得所需的正确行为，同时仍可以在调试时使用Chrome开发工具，实时重新加载等。

   你的`sourceURLForBridge`方法应如下所示：

   ```objective-c
   - (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
   {
     #if DEBUG
       return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
     #else
       return [CodePush bundleURL];
     #endif
   }
   ```

5. 将部署密钥添加到`Info.plist`：

   为了让 CodePush 运行时知道应该针对哪个部署查询更新，请打开你的应用的 `Info.plist` 文件，并添加一个名为`CodePushDeploymentKey`的新条目，其值是你要配置的应用的 `Staging Deployment Key`。

   你可以通过 `code-push deployment ls <appName> -k` 来检索这个值（该 `-k` 标志是必需的，因为默认情况下不会显示键），然后复制相对应的 `Deployment Key` 即可。

   ![](https://user-gold-cdn.xitu.io/2020/2/27/170823d9cfe4d5ba?w=1764&h=414&f=png&s=250595)

   为了有效利用与 CodePush 应用程序一起创建的 `Staging` 和 `Production` 部署，请在实际将你的应用程序对 CodePush 的使用移入生产环境之前，进行**多部署测试**的配置。


#### 多部署测试

> 该部分适用于 Xcode 11

Xcode 允许你为每个**配置** (如 `debug`, `release`) 自定义构建设置，然后可以将其引用为 `Info.plist` 文件中的键值（如 `CodePushDeploymentKey` 设置）。此机制是您可以轻松地进行构建配置以生成二进制文件，这些二进制文件被配置为与不同的 CodePush 部署同步。

要进行设置，请执行以下步骤：

1. 打开您的 Xcode 项目，然后在 `Project navigator` 窗口中选择您的项目

2. 确保已选择 `PROJECT` 节点，而不是 `TARGETS`

3. 选择 `Info` 标签

4. 点击 `+` 的内部按钮`Duplicate "Release" Configuration`
    ![](https://user-gold-cdn.xitu.io/2020/3/9/170bb342a289a24a?w=1026&h=366&f=png&s=63534)

5. 将新配置命名为 `Staging`（或您喜欢的任何名称）

6. 选择 `Build Settings` 选项卡

7. 单击工具栏上的 `+` 按钮，创建一个名为  `CONFIGURATION_BUILD_DIR` 的 `User-Defined Setting`, 使用相同的 `per-configuration` 配置。

     ```shell
     $(BUILD_DIR)/$(CONFIGURATION)$(EFFECTIVE_PLATFORM_NAME)`为`$(BUILD_DIR)/Release$(EFFECTIVE_PLATFORM_NAME)`
     ```

![](https://user-gold-cdn.xitu.io/2020/3/9/170bb34307cf8b7f?w=1058&h=316&f=png&s=99721)

  > 注意：每次创建这个 Xcode 都会崩溃，只能先把值写入之后，在 `project.pbxproj` 中新建。

8. 点击工具栏的 `+`  并选择 `Add User-Defined Setting`

   ![](https://user-gold-cdn.xitu.io/2020/3/9/170bb342a1fca283?w=1308&h=228&f=png&s=62560)

9. 将此新设置命名为`CodePushDeploymentKey`，展开它，然后为 `Staging `配置指定您的 `Staging` 部署密钥，为 `Release` 配置指定您的 `Production` 部署密钥。

   ![](https://user-gold-cdn.xitu.io/2020/3/9/170bb342d671ab43?w=890&h=172&f=png&s=67687)

   > 提醒一下，您可以通过`appcenter codepush deployment list -a <ownerName>/<appName> --displayKeys`从终端运行来检索这些键。

10. 打开项目的 `Info.plist` 文件，然后将`CodePushDeploymentKey`条目的值更改为`$(CODEPUSH_KEY)`

    ![](https://user-gold-cdn.xitu.io/2020/3/9/170bb342f42a6b4e?w=890&h=110&f=png&s=29574)

就是这样了，现在当你运行或构建你的App，你的 `Staging` 包将自动同步你的 `Staging` 部署，你的 `Release` 包将自动同步你的 `Production` 部署。

### Android设置

为了将CodePush集成到您的Android项目中，请执行以下步骤：

1. 在`android/app/build.gradle`文件中，将文件`codepush.gradle`添加为下面的其他构建任务定义：

   ```groovy
   ...
   apply from: "../../node_modules/react-native-code-push/android/codepush.gradle"
   ...
   ```

2. `MainApplication.java`通过以下更改更新文件以使用 CodePush：

   ```java
   ...
   // 1. 导入插件的类
   import com.microsoft.codepush.react.CodePush;
   public class MainApplication extends Application implements ReactApplication {
       private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
           ...
           // 2. 重写 getJSBundleFile 方法，每次 app 启动的时候让 CodePush 运行时决定从哪里加载 JS bundle
           @Override
           protected String getJSBundleFile() {
               return CodePush.getJSBundleFile();
           }
       };
   }
   ```

3. 将部署密钥添加到`strings.xml`：

   为了让 CodePush 运行时知道它应该查询哪些部署更新，请打开您的应用程序的 `string.xml` 文件，并添加一个名为 `CodePushDeploymentKey` 的新字符串，它的值是应用的 `Staging` 部署。你可以通过 `appcenter deployment list <ownerName>/<appName> -k` 获取该值。

   ![](https://user-gold-cdn.xitu.io/2020/2/27/170823d9cfe4d5ba?w=1764&h=414&f=png&s=250595)

   您`strings.xml`应该看起来像这样：

   ```xml
    <resources>
        <string name="app_name">AppName</string>
        <string moduleConfig="true" name="CodePushDeploymentKey">DeploymentKey</string>
    </resources>
   ```

   为了有效利用与CodePush应用程序一起创建的`Staging`和`Production`部署，请在实际将您的应用程序对CodePush的使用移入生产环境之前，请参考下面的**多部署测试**。


#### 多部署测试

```groovy
android {
  ...
  buildTypes {
    debug {
      signingConfig signingConfigs.debug
      // Note: CodePush updates should not be tested in Debug mode as they are overriden by the RN packager. However, because CodePush checks for updates in all modes, we must supply a key.
      resValue "string", "CodePushDeploymentKey", '""'
    }
    release {
      // Caution! In production, you need to generate your own keystore file.
      // see https://facebook.github.io/react-native/docs/signed-apk-android.
      signingConfig signingConfigs.release
      minifyEnabled enableProguardInReleaseBuilds
      proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
      resValue "string", "CodePushDeploymentKey", '""'
    }
    releaseStaging.initWith(release)
    releaseStaging {
        resValue "string", "CodePushDeploymentKey", '""'
        // Note: It is a good idea to provide matchingFallbacks for the new buildType you create to prevent build issues
        // Add the following line if not already there
        matchingFallbacks = ['release']
    }
  }
...
}
```

## 动态部署分配

上一节说明了如何利用多个`CodePush`部署，以便在更新发布给用户之前，有效地测试您的更新内容。 但是，由于该工作流静态地将部署分配嵌入到实际二进制文件中，因此`临时构建`和`生产构建`只会同步该部署的更新内容。

在许多情况下，这是足够的，因为您只希望您的团队，客户，利益相关者等与您的预生产版本同步，因此，他们只需要知道如何与该版本同步构建。

但是，如果你希望能够进行 `A / B` 测试，或者为某些用户提供应用程序的早期访问权限，那么能够在运行时将特定用户（或受众）动态地置于特定部署中将非常有用。

为了实现此工作流程，你需要做的就是指定调用该`codePush`方法时希望当前用户与之同步的部署密钥。指定后，此密钥将覆盖应用程序的 `Info.plist`（iOS）或 `MainActivity.java`（Android）文件中提供的“默认”密钥。这允许您生成临时或生产构建，也可以根据需要动态“重定向”。

```js
// Imagine that "userProfile" is a prop that this component received
// which includes the deployment key that the current user should use.
codePush.sync({ deploymentKey: userProfile.CODEPUSH_KEY });
```

有了这样的变化后，现在只需选择应用程序如何为当前用户配置正确的部署密钥。 在实践中，通常有两种解决方案：

1. 将更改部署的功能开放给用户。例如，您的设置页面可能会有一个切换按钮以启用“测试版”的访问权限。 如果您不在乎预生产更新的内容被得知，并且您的某些用户可能希望根据自己的意愿选择使用最新（并且可能有错误）的更新（有点像Chrome渠道）。 但是，此解决方案将决策权交给您的用户，这无法帮助您透明地执行 `A / B` 测试。
2. 使用额外的元数据注释用户的服务器端配置文件，标明与其同步的部署。 默认情况下，您的应用只能使用二进制嵌入密钥，但在用户通过身份验证后，您的服务器可以选择将其“重定向”到其他部署，这样您就可以根据需要逐步将某些用户或组放置在不同的部署中。您甚至可以选择将服务器响应存储在本地存储中，以使其成为新的默认值。 如何将密钥与用户的配置文件一起存储完全取决于您的身份验证解决方案（例如 `Auth0`，`Firebase`，自定义`DB` + `REST API`），但这通常非常简单。

> 注意：如果需要，您还可以实施混合解决方案，允许最终用户在不同部署之间切换，同时还允许您的服务器覆盖该决策。 这样，您就拥有了“部署解决方案”的层次结构，可确保您的应用程序能够自行更新，用户可以通过获得最新内容的访问权限来获得最新体验，但您也有能力根据需要对用户进行 `A / B` 测试。

由于我们建议将`Staging`部署用于更新的预发布测试（如上一节中所述），因此使用该部署对用户执行 `A / B` 测试并不一定有意义，与此相反，你应该允许早期访问（如上面选项1中所述）。因此，我们建议充分利用自定义应用程序部署，以便您可以按用户需求对用户进行细分。例如，您可以创建长期甚至是一次性的部署，向其发布应用程序的变体，然后将某些用户放入其中，以查看其参与度。

```sh
// #1) Create your new deployment to hold releases of a specific app variant
appcenter codepush deployment add -a <ownerName>/<appName> test-variant-one

// #2) Target any new releases at that custom deployment
appcenter codepush release-react -a <ownerName>/<appName> -d test-variant-one
```

> 注意：从一个部署“切换”到另一个部署的用户数，被纳入到部署中的“安装度量”中报告的总用户数。例如，如果您的`Production` 部署当前报告的用户总数为1，但您将该用户动态切换为 `Staging` 部署，则 `Production` 部署将报告 0个总用户，而 `Staging` 部署将报告1（刚刚切换的用户）。 即使在使用基于运行时的部署重定向解决方案的情况下，这种行为可以让你准确地跟踪您的版本使用情况。

## 最佳实践

> 源码：https://github.com/youngjuning/AppCenterCodePushDemo

### App.js

```js
import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import codePush from 'react-native-code-push';
import AwesomeButton from 'react-native-really-awesome-button';
import {codePushSync, checkForUpdate} from './CodePushUtils';
const App = () => {
  const getUpdateMetadata = async () => {
    const running = await codePush.getUpdateMetadata(
      codePush.UpdateState.RUNNING,
    );
    const pending = await codePush.getUpdateMetadata(
      codePush.UpdateState.PENDING,
    );
    console.log('[CodePush] running', running);
    console.log('[CodePush] pending', pending);
  };

  useEffect(() => {
    codePushSync();
  }, []);

  return (
    <View style={styles.container}>
      <AwesomeButton onPress={checkForUpdate} style={{marginBottom: 10}}>
        Check For Update!
      </AwesomeButton>
			<AwesomeButton onPress={() => codePush.clearUpdates()} style={{marginBottom: 10}}>
        Clear Updates!
      </AwesomeButton>
      <AwesomeButton onPress={getUpdateMetadata}>
        getUpdateMetadata!
      </AwesomeButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
```

### CodePushUtils.js

```js
import {AppState, Platform, Alert} from 'react-native';
import codePush from 'react-native-code-push';
import configReader from 'react-native-config-reader';

const CodePushDeploymentKey = {
  ios: {
    debug: '',
    staging: '944zuIiRSds-ZZY6AQF82aRl0b1vUL_mMxiie',
    release: 'yyJfk2vtpLUUlOCg3FnvCcky9o4U1lEWR1UJV',
  },
  android: {
    debug: '',
    releasestaging: 'tOncLvKACzzSkUaML9tCOUfPZxHVnobfaNIUe',
    release: 'Gtc4iXTPn24yu6CBrbl_V2GTy21xtdQyfm6x1',
  },
};

const getDeploymentKey = () => {
  const buildType = configReader.BUILD_TYPE.toLowerCase();
  const deploymentKey = CodePushDeploymentKey[Platform.OS][buildType];
  console.log('[CodePushUtils]', deploymentKey);
  return deploymentKey;
};

const codePushStatusDidChange = async syncStatus => {
  switch (syncStatus) {
    case codePush.SyncStatus.CHECKING_FOR_UPDATE:
      // 0 - 正在查询CodePush服务器以进行更新。
      console.info('[CodePush] Checking for update.');
      break;
    case codePush.SyncStatus.AWAITING_USER_ACTION:
      // 1 - 有可用的更新，并且向最终用户显示了一个确认对话框。（仅在updateDialog使用时适用）
      console.info('[CodePush] Awaiting user action.');
      break;
    case codePush.SyncStatus.DOWNLOADING_PACKAGE:
      // 2 - 正在从CodePush服务器下载可用更新。
      console.info('[CodePush] Downloading package.');
      break;
    case codePush.SyncStatus.INSTALLING_UPDATE:
      // 3 - 已下载一个可用的更新，并将其安装。
      console.info('[CodePush] Installing update.');
      break;
    case codePush.SyncStatus.UP_TO_DATE:
      // 4 - 应用程序已配置的部署完全最新。
      console.info('[CodePush] App is up to date.');
      break;
    case codePush.SyncStatus.UPDATE_IGNORED:
      // 5 该应用程序具有可选更新，最终用户选择忽略该更新。（仅在updateDialog使用时适用）
      console.info('[CodePush] User cancelled the update.');
      break;
    case codePush.SyncStatus.UPDATE_INSTALLED:
      // 6 - 安装了一个可用的更新，它将根据 SyncOptions 中的 InstallMode指定在 syncStatusChangedCallback 函数返回后立即或在下次应用恢复/重新启动时立即运行。

      // 由于安装了CodePush更新，暂时禁止任何程序性重启。这是高级API，当您应用中的组件（例如，入职流程）需要确保在其生命周期内不会出现最终用户中断时，此功能非常有用。
      // codePush.disallowRestart();
      console.info('[CodePush] Installed update.');
      break;
    case codePush.SyncStatus.SYNC_IN_PROGRESS:
      // 7 - 正在执行的 sync 操作
      console.info('[CodePush] Sync already in progress.');
      break;
    case codePush.SyncStatus.UNKNOWN_ERROR:
      // -1 - 同步操作遇到未知错误。
      console.info('[CodePush] An unknown error occurred.');
      break;
  }
};

const codePushDownloadDidProgress = progress => {
  const curPercent = (
    (progress.receivedBytes / progress.totalBytes) *
    100
  ).toFixed(0);
  console.log('[CodePushUtils] Downloading Progress', `${curPercent}%`);
  // console.log(`${progress.receivedBytes} of ${progress.totalBytes} received.`);
};

const syncImmediate = async () => {
  const deploymentKey = getDeploymentKey();
  codePush.sync(
    {
      updateDialog: {
        // 是否显示更新描述
        appendReleaseDescription: true,
        // 更新描述的前缀。 默认为"Description"
        descriptionPrefix: '\n\n更新内容：\n',
        // 强制更新按钮文字，默认为continue
        mandatoryContinueButtonLabel: '立即更新',
        // 强制更新时的信息. 默认为"An update is available that must be installed."
        mandatoryUpdateMessage: '必须更新后才能使用',
        // 非强制更新时，按钮文字,默认为"ignore"
        optionalIgnoreButtonLabel: '稍后',
        // 非强制更新时，确认按钮文字. 默认为"Install"
        optionalInstallButtonLabel: '后台更新',
        // 非强制更新时，检查到更新的消息文本
        optionalUpdateMessage: '有新版本了，是否更新？',
        // Alert窗口的标题
        title: '更新',
      },
      deploymentKey,
      installMode: codePush.InstallMode.IMMEDIATE,
    },
    codePushStatusDidChange,
    codePushDownloadDidProgress,
  );
};

export const checkForUpdate = async () => {
  const deploymentKey = getDeploymentKey();
  const update = await codePush.checkForUpdate(deploymentKey);
  if (!update) {
    Alert.alert('提示', '已是最新版本');
  } else {
    syncImmediate();
  }
};

export const codePushSync = () => {
  syncImmediate();
  AppState.addEventListener('change', newState => {
    newState === 'active' && syncImmediate();
  });
};
```

### Npm Scripts

```json
{
  "scripts": {
    ...
    "gradle:clean": "cd android && ./gradlew clean",
    "an:release": "yarn gradle:clean && cd android && ./gradlew app:assembleRelease",
    "an:installRelease": "yarn gradle:clean && cd android && ./gradlew app:installRelease",
    "an:staging": "yarn gradle:clean && cd android && ./gradlew app:assembleReleaseStaging",
    "an:installStaging": "yarn gradle:clean && cd android && ./gradlew app:installReleaseStaging",
    "displayKeys": "yarn disPlayIosKeys && yarn disPlayAndroidKeys",
    "disPlayIosKeys": "appcenter codepush deployment list --app youngjuning/AppCenterCodePushDemo-iOS --displayKeys",
    "disPlayAndroidKeys": "appcenter codepush deployment list --app youngjuning/AppCenterCodePushDemo-Android --displayKeys",
    "release-react": "yarn release-react-ios && yarn release-react-android",
    "release-react-ios": "appcenter codepush release-react --app youngjuning/AppCenterCodePushDemo-iOS",
    "release-react-android": "appcenter codepush release-react --app youngjuning/AppCenterCodePushDemo-Android"
    ...
  },
}
```