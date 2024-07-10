---
title: SPAs、SSGs 和 SSR 的区别是什么？
date: 2021-10-16 14:36:24
cover: https://cdn.jsdelivr.net/gh/youngjuning/images/202110161501538.png
description: Here we take a look at the difference between Single Page Applications, Static Site Generators, and Server-side Rendered Applications
categories:
  - [前端]
  - [紫升翻译计划]
tags:
  - SSG
  - SPA
  - SSR
---

> 原文链接🔗：https://graphcms.com/blog/difference-spa-ssg-ssr

本文我们回归 [可组合架构](https://graphcms.com/blog/better-digital-experiences-with-composable-architectures) 的基础知识，并强调一些重要的行话，这些行话在试图构建现代网络体验时是必须要理解的。在现代网络开发中，当涉及到构建数字体验时，总是有新的趋势，无论是完全拥抱新的技术或方法，还是发誓回归基本原理和简单性。

本文我们将详细讲解单页应用程序（SPA，Single Page Application）、静态网站生成器（SSG，Static Site Generator）和服务器端渲染应用程序（SSR，Server-Side ）之间的一些区别。这些概念构成了现代网络体验的骨干。每种方式都有其理想的用例，以及内容类型从前端模式中受益的地方。需要高度个性化的动态内容可能更适合 SSR 方法，而需要 SEO 优化的静态内容可能更适合 SSG 网站。

## What is a Single Page Application (SPA)?

A Single Page Application (SPA) is a broad overarching term for applications that are rendered when the client requests them. SPAs are structured as a single HTML page that has no preloaded content. Content is loaded via Javascript files for the entire application and housed within a single HTML page. The Javascript files house all of the data relating to the application logic, UI, and communication with the server. Popular Javascript frameworks and libraries for building SPAs include all of the usual suspects of [React](https://reactjs.org/), [AngularJS](https://angularjs.org/), [Vue.js](https://vuejs.org/), [Ember.JS](https://emberjs.com/) and [Svelte](https://svelte.dev/), among others.

When users are navigating through the various parts of the SPA, there will not be any additional loading time between the different elements of the application. SSGs can also fall into this category once they have been loaded in the browser. Because everything is loaded on the client-side, teams must account for the wide range of clients, while still ensuring a quick, seamless user experience. With modern frameworks, code splitting enables the loading of some elements on demand which can help eliminate this problem.

### 优点

- While the initial load maybe longer, once the application has fully loaded, there will not be additional loading required.
- Good choice for dynamic experiences where teams need a customized feeling to their user experience
- Teams have a lot of control over their architectures and can make use of modern web frameworks
- Can be used in tandem with other technologies

### 劣势

## What is a Static Site Generator (SSG)

While SPAs load all of their data on a single HTML site that is rendered only after a client request, static site generators take a very different approach to content and to building pages in general. [Static Site Generators](https://graphcms.com/resources/static-site-generators-and-headless-cms-ebook) generate content at the build time of new pages or when changes are made to the content. Because the SSGs are creating static sites, there is no need to load pages based on user requests. The content will remain consistent regardless of users. Employing SSGs as part of the tech stack enables teams to pull data from multiple data sources and lets teams take advantage of modern approaches to web development. Use cases that are ideal for the SSG approach are those where content does not need to be highly personalized.

Static site generators are typically used in concert with a headless CMS, a static hosting site, and a CDN to cache all of the data. Webhooks trigger to the SSG that there have been changes in the content and the changes are deployed to the site which is stored in a cache. CDNs enable teams to store pre-rendered HTML files in places that are geographically closer to the request, further reducing page load times. We’ve gone into depth [on SSGs and their benefits](https://graphcms.com/blog/top-12-ssgs-2021) in other posts but here are some highlights on the pros and cons of SSGs.

The ProsAnchor
Easy to create decoupled architecture with multiple content sources
Fast page load times due to much of the content being pre-rendered and the static nature of the content
Better for SEO
Easily scalable infrastructure that allows the project to grow organically
The ConsAnchor
Personalization and dynamic content require workarounds or additional services
When content does change, you must rebuild the site in order to have these changes reflected on the site
