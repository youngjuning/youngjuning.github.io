---
title: 2023 大陆人如何成功创建 Google 账户
date: 2023-03-17 00:50:37
description: 本文介绍了 2023 年大陆人如何成功创建一个新的 Google 账户，完美解决“此电话号码无法用于进行验证”。
categories:
  - Google
tags:
  - Google Account
  - 科学上网
  - 谷歌账号
  - 大陆
---

<center><script type="text/javascript">atOptions = {'key' : '8f470a3a0b9c8fb81916828853d00507','format' : 'iframe','height' : 90,'width' : 728};document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://harassinganticipation.com/8f470a3a0b9c8fb81916828853d00507/invoke.js"></scr' + 'ipt>');</script></center>

最近注册 Google 账号卡在了验证手机号码的步骤，应该是 Google 更新了他们的合规政策，具体报错如下图：

![此电话号码无法用于进行验证](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678987015915.png)

# 切换 VPN 到美国

为了模拟网络 IP，我们最好将 VPN 节点切到 Google 的总部所在国美国。洛竹收藏了一些好用的 [科学上网](/vpn/) 工具，有需要可以试用。

# 切换浏览器时区

只切换 VPN 节点，我们还是无法成功验证手机号，必须将时区设置成和 VPN 节点一致才可以，使用 [whoer.net](https://whoer.net) 可以看到当前时区不一致：

![](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678987547217.png)

使用浏览器扩展 [Change Timezone (Time Shift)](https://chrome.google.com/webstore/detail/change-timezone-time-shif/nbofeaabhknfdcpoddmfckpokmncimpj?utm_source=chrome-ntp-icon) 我们可以很方便地切换时区：

![](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678987441408.png)

# 修改浏览器语言

将浏览器的语言设置成 英语（美国），然后删除其他语言：

![](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678988750775.png)

然后再用 [whoer.net](https://whoer.net) 检查一下：

![](https://cdn.jsdelivr.net/gh/youngjuning/images@main/1678987676196.png)

这个时候你就可以成功注册 Google 了。

# 跨浏览器测试平台

如果以上还不行，那就是 VPN 节点不够纯净，可以使用 [sauce labs](https://saucelabs.com/) 开一个浏览器注册。

# 扩展知识

以前无知，以为 ip 地址改了身份就变了，实际能标识一个用户的方面有很多，比如：

- 浏览器 Cookie
- 浏览器默认 Track
- 浏览器历史记录
- 浏览器搜索历史
- 电脑设置
- 电脑分辨率
- 浏览器语言

校验严格的网站会禁止禁用 Cookie，不带 Cookie 或者网络是匿名的都会认为是异常用户，另外批量处理很容易触发封号，最近互关 Twitter，手动点的多了就被锁账号了。
