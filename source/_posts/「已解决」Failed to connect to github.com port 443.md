---
categories:
- - '[issues,github]'
date: '2023-07-18T11:20:35.047326+08:00'
description:    经常使用 Github 的开发在执行 git push 时经常会遇到 Failed to connect to github.com port 443 问题，今天紫竹就来介绍下如何完美解决这个问...
tags:
- github
title: 「已解决」Failed to connect to github.com port 443
---
<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

经常使用 Github 的开发在执行 `git push` 时经常会遇到 `Failed to connect to github.com port 443` 问题，今天紫竹就来介绍下如何完美解决这个问题。

- https://github.com.ipaddress.com/
- https://fastly.net.ipaddress.com/github.global.ssl.fastly.net
- https://github.com.ipaddress.com/assets-cdn.github.com

然后找到 A Records 依次记下 ip。

最后打开电脑的hosts文件，把下列的东东写在最后，然后保存即可：

```txt
140.82.113.4    github.com
185.199.108.153 assets-cdn.github.com
185.199.109.153 assets-cdn.github.com
185.199.110.153 assets-cdn.github.com
185.199.111.153 assets-cdn.github.com
151.101.1.194  github.global.ssl.fastly.net
151.101.65.194  github.global.ssl.fastly.net
151.101.129.194  github.global.ssl.fastly.net
151.101.193.194  github.global.ssl.fastly.net
```

