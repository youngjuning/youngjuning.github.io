---
title: React Navigation 5 最佳实践
date: 2020-02-17 10:29:14
categories:
  - [移动开发, React Native]
tags:
  - 最佳实践
---

![](https://i.loli.net/2020/02/23/caAngkCQdUxlp8L.png)

> 文章示例源码: https://github.com/youngjuning/react-navigation-best-practice

<!--more-->

## 安装依赖

```sh
$ yarn add @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
```

## 配置

为了完成  `react-native-screens` 的安装，添加下面两行代码到 `android/app/build.gradle` 文件的 `dependencies` 部分中：

```groovy
implementation 'androidx.appcompat:appcompat:1.1.0-rc01'
implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0-alpha02'
```

为了完成  `react-native-gesture-handler` 的安装, 在入口文件的顶部添加下面的代码, 比如 `index.js` 或 `App.js`:

```js
import 'react-native-gesture-handler';
```

现在，我们需要把整个 App用 `NavigationContainer`包裹：

```jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  return (
    <NavigationContainer>
      {/* Rest of your app code */}
    </NavigationContainer>
  );
};

export default App;
```

## App.js

```jsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  BackHandler,
} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import {IconOutline} from '@ant-design/icons-react-native';
import {Button} from '@ant-design/react-native';
import IconWithBadge from './IconWithBadge';
import HeaderButtons from './HeaderButtons';
import getActiveRouteName from './getActiveRouteName';
import getScreenOptions from './getScreenOptions';
import {navigationRef} from './NavigationService';

const HomeScreen = ({navigation, route}) => {
  navigation.setOptions({
    headerLeft: props => (
      <HeaderBackButton
        {...props}
        onPress={() => {
          console.log('不能再返回了！');
        }}
      />
    ),
    headerRight: () => (
      <HeaderButtons>
        {/* title、iconName、onPress、IconComponent、iconSize、color */}
        <HeaderButtons.Item
          title="添加"
          iconName="plus"
          onPress={() => console.log('点击了添加按钮')}
          iconSize={24}
          color="#ffffff"
        />
      </HeaderButtons>
    ),
  });

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );
  const {author} = route.params || {};
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text>Home Screen</Text>
        <Text>{author}</Text>
        <Button
          type="warning"
          // 使用 setOptions 更新标题
          onPress={() => navigation.setOptions({headerTitle: 'Updated!'})}>
          Update the title
        </Button>
        <Button
          type="primary"
          onPress={() =>
            // 跳转到指定页面，并传递两个参数
            navigation.navigate('DetailsScreen', {
              otherParam: 'anything you want here',
            })
          }>
          Go to DetailsScreen
        </Button>
        <Button
          type="warning"
          onPress={() => navigation.navigate('SafeAreaViewScreen')}>
          Go SafeAreaViewScreen
        </Button>
        <Button
          type="primary"
          onPress={() =>
            navigation.navigate('CustomAndroidBackButtonBehaviorScreen')
          }>
          Go CustomAndroidBackButtonBehavior
        </Button>
      </View>
    </>
  );
};

const DetailsScreen = ({navigation, route}) => {
  // 通过 props.route.params 接收参数
  const {itemId, otherParam} = route.params;
  return (
    <View style={styles.container}>
      <Text>Details Screen</Text>
      <Text>itemId: {itemId}</Text>
      <Text>otherParam: {otherParam}</Text>
      <Button
        type="primary"
        // 返回上一页
        onPress={() => navigation.goBack()}>
        Go back
      </Button>
      <Button
        type="primary"
        // 如果返回上一个页面需要传递参数，请使用 navigate 方法
        onPress={() => navigation.navigate('HomeScreen', {author: '杨俊宁'})}>
        Go back with Params
      </Button>
    </View>
  );
};

const SettingsScreen = ({navigation, route}) => {
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'space-between', alignItems: 'center'}}>
      <Text>This is top text.</Text>
      <Text>This is bottom text.</Text>
    </SafeAreaView>
  );
};

const SafeAreaViewScreen = () => {
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'space-between', alignItems: 'center'}}>
      <Text>This is top text.</Text>
      <Text>This is bottom text.</Text>
    </SafeAreaView>
  );
};

const CustomAndroidBackButtonBehaviorScreen = ({navigation, route}) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        alert('物理返回键被拦截了！');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
  return (
    <View style={styles.container}>
      <Text>AndroidBackHandlerScreen</Text>
    </View>
  );
};

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const BottomTabScreen = () => (
  <BottomTab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName;
        if (route.name === 'HomeScreen') {
          iconName = focused ? 'apple' : 'apple';
          return (
            <IconWithBadge badgeCount={90}>
              <IconOutline name={iconName} size={size} color={color} />
            </IconWithBadge>
          );
        } else if (route.name === 'SettingsScreen') {
          iconName = focused ? 'twitter' : 'twitter';
        }
        return <IconOutline name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    }}>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{tabBarLabel: '首页'}}
    />
    <Stack.Screen
      name="SettingsScreen"
      component={SettingsScreen}
      options={{tabBarLabel: '设置'}}
    />
  </BottomTab.Navigator>
);
const App = () => {
  const routeNameRef = React.useRef();
  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={state => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = getActiveRouteName(state);
          if (previousRouteName !== currentRouteName) {
            console.log('[onStateChange]', currentRouteName);
            if (currentRouteName === 'HomeScreen') {
              StatusBar.setBarStyle('dark-content'); // 修改 StatusBar
            } else {
              StatusBar.setBarStyle('dark-content'); // 修改 StatusBar
            }
          }
          // Save the current route name for later comparision
          routeNameRef.current = currentRouteName;
        }}>
        <Stack.Navigator
          initialRouteName="HomeScreen"
          // 页面共享的配置
          screenOptions={getScreenOptions()}>
          <Stack.Screen
            name="BottomTabScreen"
            component={BottomTabScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DetailsScreen"
            component={DetailsScreen}
            options={{headerTitle: '详情'}} // headerTitle 用来设置标题栏
            initialParams={{itemId: 42}} // 默认参数
          />
          <Stack.Screen
            name="SafeAreaViewScreen"
            component={SafeAreaViewScreen}
            options={{headerTitle: 'SafeAreaView'}}
          />
          <Stack.Screen
            name="CustomAndroidBackButtonBehaviorScreen"
            component={CustomAndroidBackButtonBehaviorScreen}
            options={{headerTitle: '拦截安卓物理返回键'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
```

> 路由名称的大小写无关紧要 -- 你可以使用小写字母`home`或大写字母`Home`，这取决于你的喜好。 我们更喜欢将路由名称大写。 我们更喜欢利用我们的路由名称。

> 跳转方法有 `navigate`、 `push` 、`goBack`、`popToTop`

> 可以用 `navigation.setParams` 方法更新页面的参数

> 我们可以通过 `options={({ route, navigation }) => ({ headerTitle: route.params.name })}` 的方式在标题中使用参数

> 我们可以用 `navigation.setOptions` 更新页面配置

- `Stack.Navigator`
  - `initialRouteName` : 用来配置 `Stack.Navigator` 的初始路由
  - `screenOptions`: 页面共享配置对象
- `Stack.Screen`
  - `name`: 页面名
  - `component`: 页面对应组件
  - `options`: 页面配置对象
  - `initialParams`: 默认参数

## HeaderButtons.js

使用 `react-navigation-header-buttons` 组件搭配任意 Icon 组件可以自定义自己的 Header Button 组件，我这里为了演示方便，使用了 `@ant-design/icons-react-native`：

```jsx
import React from 'react';
import {
  HeaderButtons as RNHeaderButtons,
  HeaderButton as RNHeaderButton,
  Item,
} from 'react-navigation-header-buttons';
import {IconOutline} from '@ant-design/icons-react-native';

const HeaderButton = props => {
  return (
    <RNHeaderButton
      {...props}
      IconComponent={IconOutline}
      iconSize={props.iconSize || 23}
      color={props.color || '#000000'}
    />
  );
};

const HeaderButtons = props => {
  return <RNHeaderButtons HeaderButtonComponent={HeaderButton} {...props} />;
};

HeaderButtons.Item = Item;

export default HeaderButtons;
```

## IconWithBadge.js

```jsx
import React from 'react';
import {View} from 'react-native';
import {Badge} from '@ant-design/react-native';

const IconWithBadge = ({children, badgeCount, ...props}) => {
  return (
    <View style={{width: 24, height: 24, margin: 5}}>
      {children}
      <Badge
        {...props}
        style={{position: 'absolute', right: -6, top: -3}}
        text={badgeCount}
      />
    </View>
  );
};

export default IconWithBadge;
```

## getActiveRouteName.js

```js
/**
 * Gets the current screen from navigation state
 * @param state
 */
const getActiveRouteName = state => {
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

export default getActiveRouteName;

```

## getScreenOptions.js

```js
import {TransitionPresets} from '@react-navigation/stack';

const getScreenOptions = () => {
  return {
    headerStyle: {
      backgroundColor: '#ffffff',
    }, // 一个应用于 header 的最外层 View 的 样式对象
    headerTintColor: '#000000', // 返回按钮和标题都使用这个属性作为它们的颜色
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerBackTitleVisible: false,
    headerTitleAlign: 'center',
    cardStyle: {
      flex: 1,
      backgroundColor: '#f5f5f9',
    },
    ...TransitionPresets.SlideFromRightIOS,
  };
};

export default getScreenOptions;

```

## NavigationService.js

```js
import React from 'react';

export const navigationRef = React.createRef();

const navigate = (name, params) => {
  navigationRef.current && navigationRef.current.navigate(name, params);
};

const getNavigation = () => {
  return navigationRef.current && navigationRef.current;
};

export default {
  navigate,
  getNavigation,
};
```

## 页面生命周期与React Navigation

一个包含 页面 A 和 B 的 StackNavigator ，当跳转到 A 时，`componentDidMount` 方法会被调用； 当跳转到 B 时，`componentDidMount` 方法也会被调用，但是 A 依然在堆栈中保持 被加载状态，他的 `componentWillUnMount` 也不会被调用。

当从 B 跳转到 A，B的 `componentWillUnmount` 方法会被调用，但是 A 的 `componentDidMount`方法不会被调用，应为此时 A 依然是被加载状态。

## React Navigation 生命周期事件

### addListener

```jsx
function Profile({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Screen was focused
      // Do something
    });

    return unsubscribe;
  }, [navigation]);

  return <ProfileContent />;
}
```

### useFocusEffect

```jsx
useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );
```

## 隐藏 Header/TabBar

- `headerMode:"none"`: hide Header for `Stack.Navigator`
- `headerShown:false`: hide Header for `Stack.Screen`
- `tabBar={() => null}`: hide TabBar for `BottomTab.Navigator`

```jsx
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets, HeaderBackButton} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

export default App = () => {
  <NavigationContainer>
  	<Stack.Navigator headerMode="none">
      <Stack.Screen
        ...
        options={{ headerShown: false }}
      />
      <Stack.Screen ...>
        {() => (
          <BottomTab.Navigator
            ...
           	tabBar={() => null}
          >
            ...
          </BottomTab.Navigator>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
}
```

## TabBar 的 StatusBar 不同

一般我们会对特殊的那个TabBar进行处理。

```jsx
const getActiveRouteName = state => {
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

const App = () => {
  const ref = React.useRef(null);
	return (
    <>
    	{/* 访问 ref.current?.navigate */}
      <NavigationContainer
        ref={ref}
        onStateChange={state => {
          const previousRouteName = ref.current;
          const currentRouteName = getActiveRouteName(state);
          if (previousRouteName !== currentRouteName) {
            console.log('[onStateChange]', currentRouteName);
            if (currentRouteName === 'HomeScreen') {
              StatusBar.setBarStyle('dark-content');  // 修改 StatusBar
            } else {
              StatusBar.setBarStyle('dark-content');  // 修改 StatusBar
            }
          }
        }}
      >
      </NavigationContainer>
    </>
	)
}
```

## 监听安卓物理返回键

```jsx
import {View, Text, BackHandler} from 'react-native';
const CustomAndroidBackButtonBehaviorScreen = ({navigation, route}) => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        alert('物理返回键被拦截了！');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
  return (
    <View style={styles.container}>
      <Text>AndroidBackHandlerScreen</Text>
    </View>
  );
};
```

## 在子组件中访问 `navigation`

我们可以通过 `useNavigation()` hook 来访问 navigation，再也不用传递多层 `navigation`

```jsx
import React from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function GoToButton({ screenName }) {
  const navigation = useNavigation();

  return (
    <Button
      title={`Go to ${screenName}`}
      onPress={() => navigation.navigate(screenName)}
    />
  );
}
```

## 给页面传递额外的属性

```jsx
<Stack.Screen
  name="HomeScreen"
  options={{headerTitle: '首页'}}>
  {props => <HomeScreen {...props} extraData={{author: '杨俊宁'}} />}
</Stack.Screen>
```

## 获取 Header Height

```jsx
import { useHeaderHeight } from '@react-navigation/stack'

const App = () => {
    const HeaderHeight = useHeaderHeight() // 获取Header Height
    return(...)
}

export default App
```

## 继续使用类组件

考虑到对于不适应 Hooks 的但是业务又很紧急的场景，我们可以再类组件之上封装一层来支持 React Navigation 的 Hooks 组件，之所以这么做，起因是因为 React Navigation 5 中我们只能通过 `useHeaderHeight()` 方法获取标题栏高度。

```jsx
class Albums extends React.Component {
  render() {
    return <ScrollView ref={this.props.scrollRef}>{/* content */}</ScrollView>;
  }
}
// 封装并导出
export default function(props) {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  return <Albums {...props} scrollRef={ref} />;
}
```
