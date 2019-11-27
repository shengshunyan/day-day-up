---
title: React Hook & PWA
date: 2019-07-28
tags:
     - JavaScript
---

## 一、react hook和相关新特性
### 链接：
- https://zhuanlan.zhihu.com/p/67087685
1. lazy 和 Suspense 配套使用，react原生支持代码分割；
2. react错误边界处理getDerivedStateFromError和componentDidCatch；
<!-- more -->
```JavaScript
import React, { Component, lazy, Suspense } from 'react';
import './App.css';

// lazy 和 Suspense 配套使用，react原生支持代码分割
// webpackChunkName配置为了chunk名字更好认
const About = lazy(() => import(/* webpackChunkName: "about" */'./About'));

class App extends Component {
  state = {
    hasError: false
  }

  // 处理错误方法1
  static getDerivedStateFromError() {
    return {
      hasError: true
    }
  }

  // 处理错误方法2
  // componentDidCatch() {
  //   this.setState({ hasError: true })
  // }

  render() {
    if (this.state.hasError) {
      return <div>error</div>
    }

    return (
      <div className="App">

        <Suspense fallback={<div>loading</div>}>
          <About></About>
        </Suspense>

      </div>
    );
  }
}

export default App;
```
3. 利用PureComponent或者memo优化组件，避免不必要的渲染
```JavaScript
import React, { Component, PureComponent, memo } from 'react';
import './App.css';

// age变化会导致child组件重新渲染
// class Child extends Component {
//   render() {
//     console.log('child render')
//     return <div>age: 11</div>
//   }
// }

// PureComponent: age变化不会导致child组件重新渲染
// class Child extends PureComponent {
//   render() {
//     console.log('child render')
//     return <div>age: 11</div>
//   }
// }

// memo: age变化不会导致child组件重新渲染
const Child = memo(function() {
  console.log('child render')
  return <div>age: 11</div>
})

class App extends Component {
  state = {
    age: 18
  }

  addAge = () => {
    this.setState({
      age: this.state.age + 1
    })
  }

  render() {
    return (
      <div className="App">
        <Child></Child>
        <button onClick={this.addAge}>add</button>
      </div>
    );
  }
}

export default App;
```
4. useContext是用来多级组件之间传递参数；
5. useMemo & useCallback:
    1. useEffect和useMemo作用相似，但是useEffect是渲染结束后执行；
    2. useMemo是渲染过程中执行，可以参与渲染过程；
    3. useMemo可以根据依赖来决定一个函数是否需要重新执行；
    4. useCallback是useMemo的一种特殊情况；
    ```JavaScript
    useMemo(() => fn)
    useCallback(fn)
    ```
    5. 当一个函数需要当做属性传递给子组件，为了避免子组件重新渲染，可以用useCallback；
    6. 当一个值不需要每次重新赋值或者计算，可以用useCallback指定依赖，依赖变化才会导致重新赋值或者计算；
    ```JavaScript
    const [word, setWord] - useState('');
    const trimWord = useMemo(() => word.trim(), [word]);
    ```
6. useRef:
    1. 保存dom节点的引用；
    2. 保存函数组件中变量的唯一引用（函数组件中声明的变量每次更新都会重新声明），而且值得变化不会导致重新渲染；
7. 自定义hook: 其实能做函数组件能做的任何事，复用逻辑；
8. useEffect / useLayoutEffect:
    1. useEffect: useEffect用于处理大多数副作用，其中的回调函数会在render执行之后在调用，确保不会阻止浏览器的渲染，这跟componentDidMount和componentDidUpdate是不一样的，他们会在渲染之后同步执行。
    2. useLayoutEffect: 在大多数情况下，我们都可以使用useEffect处理副作用，但是，如果副作用是跟DOM相关的，就需要使用useLayoutEffect。useLayoutEffect中的副作用会在DOM更新之后同步执行。


## 二、PWA
### 1. 简介
Progressive Web App, 简称 PWA，是提升 Web App 的体验的一种新方法，能给用户原生应用的体验。

PWA 能做到原生应用的体验不是靠特指某一项技术，而是经过应用一些新技术进行改进，在安全、性能和体验三个方面都有很大提升，PWA 本质上是 Web App，借助一些新技术也具备了 Native App 的一些特性，兼具 Web App 和 Native App 的优点。

PWA 的主要特点包括下面三点：
 1. 可靠 - 即使在不稳定的网络环境下，也能瞬间加载并展现
 2. 体验 - 快速响应，并且有平滑的动画响应用户的操作
 3. 粘性 - 像设备上的原生应用，具有沉浸式的用户体验，用户可以添加到桌面


### 2. 技术组成
1. Service Work: (三类事件监听)
    1. install
    2. activate
    3. fetch
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
    1. install用于注册缓存资源
    2. activate 用于版本变化时，清楚旧版资源
    3. fetch用于匹配缓存资源和增量添加需要缓存的资源
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
    1. 需要在page中获取通知权限；
    2. page中和service work中通知的api不同
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


## 三、webpack
### 1. 多入口配置
1. public/目录创建多个html模板；
2. entry配置多个入口；
3. 配置多个HtmlWebpackPlugin，每个指定对应的js chunk和html模板；