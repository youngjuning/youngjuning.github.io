---
title: clashX optimal node automatic switching script
DRAFT: clashX optimal node automatic switching script
categories:
  - 未分类
date: 2023-02-28 11:11:21
tags:
---

```js
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}
fetch("http://127.0.0.1:9090/proxies/").then(response => response.json()).then(({proxies}) => {
    const myProxies = proxies.GLOBAL.all.filter(item => item.indexOf('勿用') === -1);
    if(localStorage.count > myProxies.length - 1) {
        localStorage.setItem("count", 0);
    }
    console.log("可用节点", myProxies);
    console.log(localStorage.count, myProxies[localStorage.count]);
    localStorage.setItem(
        "count",
        localStorage.count ? Number(localStorage.count) + 1 : 0
    );
    // TODO 优化节点选择
    fetch('http://127.0.0.1:9090/proxies/GLOBAL', {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: myProxies[localStorage.count] })
    })
});
```
