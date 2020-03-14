---
title: PWA
date: 2019-07-28
tags:
     - JavaScript
---

## 简介
Progressive Web App, 简称 PWA，是提升 Web App 的体验的一种新方法，能给用户原生应用的体验。

PWA 能做到原生应用的体验不是靠特指某一项技术，而是经过应用一些新技术进行改进，在安全、性能和体验三个方面都有很大提升，PWA 本质上是 Web App，借助一些新技术也具备了 Native App 的一些特性，兼具 Web App 和 Native App 的优点。

PWA 的主要特点包括下面三点：
 1. 可靠 - 即使在不稳定的网络环境下，也能瞬间加载并展现
 2. 体验 - 快速响应，并且有平滑的动画响应用户的操作
 3. 粘性 - 像设备上的原生应用，具有沉浸式的用户体验，用户可以添加到桌面


## 技术组成
1. Service Work: (三类事件监听)
    - install
    - activate
    - fetch
```JavaScript
self.addEventListener('install', event => {
    console.log('install', event);
    event.waitUntil(self.skipWaiting());
})
self.addEventListener('activate', event => {
    console.log('activate', event);
})
self.addEventListener('fetch', event => {
    console.log('fetch', event);
})
```
2. fetch api 在Service Work发送一步请求的方式；
3. Cache API：
    - install用于注册缓存资源
    - activate 用于版本变化时，清楚旧版资源
    - fetch用于匹配缓存资源和增量添加需要缓存的资源
```JavaScript
// const CACHE_NAME = 'cache-v1';
const CACHE_NAME = 'cache-v2';

self.addEventListener('install', event => {
    console.log('install', event);
    // event.waitUntil(self.skipWaiting()); // 新版本直接激活
    // 添加资源缓存
    event.waitUntil(caches.open(CACHE_NAME).then(cache => {
        cache.addAll([
            '/', // 缓存主页index.html
            './index.css'
        ]);
    }))
})
self.addEventListener('activate', event => {
    console.log('activate', event);
    // 若缓存资源版本变化(CACHE_NAME变化)，则清楚其他的缓存版本
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
                return caches.delete(cacheName);
            }
        }))
    }))
})
self.addEventListener('fetch', event => {
    console.log('fetch', event);
    event.respondWith(caches.open(CACHE_NAME).then(cache => {
        // 匹配已缓存资源
        return cache.match(event.request).then(response => {
            if (response) {
                return response;
            }

            // 没有匹配到缓存资源，则向服务器发起请求，并增量加入缓存
            return fetch(event.request).then(response => {
                caches.put(event.request, response.clone());
                return response;
            })
        })
    }))
})
```
4. 通知Notification
    - 需要在page中获取通知权限；
    - page中和service work中通知的api不同
```javascript
/* 1. page中 */
// 查看当前通知权限
Notification.permission
// 弹出获取通知权限的弹窗
Notification.requestPermission()
// 用户确认允许通知后，可以发送通知
new Notification('title', { body: "hello, I am xiaoming" })

// 2. service work中
self.registration.showNotification('title', { body: "hello, I am xiaoming" })
```


## webpack多入口配置
1. public/目录创建多个html模板；
2. entry配置多个入口；
3. 配置多个HtmlWebpackPlugin，每个指定对应的js chunk和html模板；