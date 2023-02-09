---
title: 前端无感知刷新 Token
date: 2022-10-31 13:43:33
categories:
- 前端
tags:
- 网络编程
cover: https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3137468833474e6ea2b74b97fb101c0c~tplv-k3u1fbpfcp-watermark.image
---

为了安全考虑，一般后端都要求在请求接口时传递登录的 Token。为了防止 Token 泄漏的风险，服务器的 Token 一般不会设置太长时间，比如我最近联调的，两个小时就会过期，token 过期就需要重新登陆。频繁要求登陆会造成用户体验差，所以后端同时会提供刷新 Token 的接口，本文就是记录一下几种无感知刷新的方法。

## 方案一

在登录时，后端返回过期时间，前端每次请求就判断 token 的过期时间，如果快到过期时间，就去调用刷新 token 接口，我们可以封装一个 refreshToken 方法：

```js
const refreshToken = async () => {
  if (dayjs().diff(LOCAL_REFRESH_TIME > LOCAL_EXPIRE) {
    if (global.workPromise) {
      return global.workPromise
    }
    global.workPromise = new Promise(async (resolve) => {
      const {data} = await request({
        url: `https://api.com/login`,
        // other config
        method: 'POST',
      });
      // 更新 LOCAL_REFRESH_TIME
      global.workPromise = null;
      resolve()
    })
    return global.workPromise
  }
  return Access_Token
}
```

该方法主要原理是通过将 refresh 接口请求存在全局的 workPromise 中来保证在并发请求接口时只存在一个请求。

## 方案二

登录时设置定时器刷新 token 接口，请求的时候判断当前是否有 workPromise 存在，如果存在就等刷新完成。

```js
// 登录后设置定时器
setInterval(() => {
  global.workPromise = new Promise(async (resolve) => {
    const {data} = await request({
      url: `https://api.com/login`,
      // other config
      method: 'POST',
    });
    cookies.set('refresh_time')
    global.workPromise = null;
    resolve()
  })
}, EXPIRE / 2)

const request = () => {
  if (global.workPromise) {
    await global.workPromise()
  }
}
```

该方案由于有定时器一直存在，会额外消耗资源，不推荐使用。

## 方案三

如果使用了 axios，可以在请求响应拦截器中拦截，判断 token 返回过期后，调用刷新 token 接口。

```js
import axios from 'axios'

// 是否正在刷新的标记
let isRefreshing = false
//重试队列
let requests = []
service.interceptors.response.use(
  response => {
    //约定code 409 token 过期
    if (response.data.code === 409) {
      if (!isRefreshing) {
        isRefreshing = true
        //调用刷新token的接口
        return refreshToken().then(res => {
          const { token } = res.data
          // 替换token
          setToken(token)
          response.headers.Authorization = `${token}`
           // token 刷新后将数组的方法重新执行
          requests.forEach((cb) => cb(token))
          requests = [] // 重新请求完清空
          return service(response.config)
        }).catch(err => {
          //跳到登录页
          removeToken()
          router.push('/login')
          return Promise.reject(err)
        }).finally(() => {
          isRefreshing = false
        })
      } else {
        // 返回未执行 resolve 的 Promise
        return new Promise(resolve => {
          // 用函数形式将 resolve 存入，等待刷新后再执行
          requests.push(token => {
            response.headers.Authorization = `${token}`
            resolve(service(response.config))
          })
        })
      }
    }
    return response && response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)
```
