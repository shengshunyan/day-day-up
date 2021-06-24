---
title: React 异步组件lazy和Suspense的简单实现
date: 2021-06-24
keywords: JavaScript, React, lazy, Suspense
cover: https://s1.ax1x.com/2020/05/28/tZXg7q.jpg
tags:
     - JavaScript
---


{% note info no-icon %}
参考：
 - [《React官网-错误边界》](https://zh-hans.reactjs.org/docs/error-boundaries.html#introducing-error-boundaries)
 - [《React异步组件前世与今生》](https://mp.weixin.qq.com/s/RR8uH6LcdGqgle0nY05tqw)
{% endnote %}

## 前言

打包是个非常棒的技术，但随着你的应用增长，你的代码包也将随之增长。尤其是在整合了体积巨大的第三方库的情况下。你需要关注你代码包中所包含的代码，以避免因体积过大而导致加载时间过长。

在React16.6中引入了React.lazy和React.Suspense两个API，再配合动态 import() 语法就可以实现组件代码打包分割和异步加载。

<br/>


## 使用示例

适当配置webpack[《webpack官网-代码分离》](https://webpack.docschina.org/guides/code-splitting/)，再根据如下语法使用import, lazy, Suspense之后，About的组件就会单独打包成一个js文件，异步加载。

当About组件代码还没有加载完成的时候，Suspense组件展示fallback参数传入的loading；当About组件代码加载完成之后，Suspense组件就会展示About组件代的内容。

```JavaScript
import React, { lazy, Suspense } from 'react';

// lazy 和 Suspense 配套使用，react原生支持代码分割
// webpackChunkName配置为了chunk名字更好认
const About = lazy(() => import(/* webpackChunkName: "about" */'./About'));

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <h1>App</h1>

                <Suspense fallback={<div>loading</div>}>
                    <About />
                </Suspense>
            </div>
        );
    }
}

export default App;
```

<br/>

## 前置知识

### 代码分割

 - [《React官网-代码分割》](https://zh-hans.reactjs.org/docs/code-splitting.html#reactlazy)
 - [《webpack官网-代码分离》](https://webpack.docschina.org/guides/code-splitting/)


### 动态import

import语句我们使用的很多，通常是import ... from '...'这样的写法，这样的写法也被称作是静态加载。

而所谓的动态import或者说动态加载，就是指在运行时加载。写法如下：

```JavaScript
import('./test.js').then(test => {
    // ...
});
```

可以发现，动态import实现了Promise规范，回调函数的test参数就是加载完成后的模块。


### 错误边界

React错误边界的用法可参考之前笔记[《React Error Boundaries》](https://www.shengshunyan.xyz/2020/04/26/React%20Error%20Boundaries/)

<br/>


## 技术原理

### 基本思路

**核心功能：** Suspense组件需要等待异步组件加载完成再渲染异步组件的内容

如何让同步的渲染停止下来，去等异步的数据请求呢？抛出异常可以吗? 异常可以让代码停止执行，当然也可以让渲染中止。

1. lazy包裹异步组件之后，React第一次加载组件的时候，异步组件会发起请求，并且抛出异常，终止渲染；
2. Suspense里有componentDidCatch生命周期函数，异步组件抛出异常会触发这个函数，然后改变状态使其渲染fallback参数传入的组件；
3. 等到异步组件的请求成功返回之后，Suspense组件再次改变状态使其渲染正常子组件（即异步组件）；


### 动态import模拟

我们用Promise模拟一下 import()效果

```JavaScript
const About = lazy(() => new Promise(resolve => {
    setTimeout(() => {
        resolve({
            default: <div>component content</div>
        })
    }, 1000)
}))
```


### Suspense组件

**关键**在声明componentDidCatch生命周期函数，监听子组件抛出的异常，改变渲染内容

```JavaScript
import React from 'react'

class Suspense extends React.PureComponent {
    /**
     * isRender 异步组件是否就绪，可以渲染
     */
    state = {
        isRender: true
    }

    componentDidCatch(event) {
        this.setState({ isRender: false })

        event.promise.then(() => {
            /* 数据请求后，渲染真实组件 */
            this.setState({ isRender: true })
        })
    }

    render() {
        const { fallback, children } = this.props
        const { isRender } = this.state

        return isRender ? children : fallback
    }
}

export default Suspense
```


### lazy方法

**关键**在第一次加载组件去请求组件内容的时候，抛出异常，并且把请求的promise对象传递给Suspense组件

```JavaScript
import React, { useEffect } from 'react'

export function lazy(fn) {
    const fetcher = {
        status: 'pending',
        result: null,
        promise: null,
    }

    return function MyComponent() {
        const getDataPromise = fn()
        fetcher.promise = getDataPromise
        getDataPromise.then(res => {
            fetcher.status = 'resolved'
            fetcher.result = res.default
        })

        useEffect(() => {
            if (fetcher.status === 'pending') {
                throw fetcher
            }
        }, [])

        if (fetcher.status === 'resolved') {
            return fetcher.result
        }

        return null
    }
}
```


### 实现效果

实现的效果和原生API效果一致

![Jun-23-2021 20-50-27.gif](https://i.loli.net/2021/06/23/28QmpzcvFiJCP6H.gif)

<br/>


## 技术踩坑

1. React函数组件代码运行错误时，会渲染两次 [《参考》](https://stackoverflow.com/questions/57717298/why-do-react-components-that-throw-errors-render-twice)

    代码中Test组件抛出了一个错误，组件会渲染两次，打印两次 'render test'

    ```JavaScript
    function Test() {
        console.log('render test')
        throw 'test error'
        return <div>test</div>
    }
    ```

    所以 lazy 函数实现中，请求然后抛出错误的代码需要放在hooks中，以避免渲染两次，第二次抛出错误会无法catch导致应用报错。

    ```JavaScript
    useEffect(() => {
        if (fetcher.status === 'pending') {
            throw fetcher
        }
    }, [])
    ```

2. componentDidCatch不能将错误处理结束，浏览器控制台依然会打印错误日志 uncaught error

    ![WX20210624-103004@2x.png](https://i.loli.net/2021/06/24/ilR5SM8OWnsZUfG.png)

    参考 [《window.onerror 和window.addEventListener('error')的区别》](https://segmentfault.com/a/1190000023259434)，在应用入口添加全局错误处理逻辑，这样就能消除浏览器控制台的错误信息

    ```JavaScript
    window.onerror = function(message, source, lineno, colno, error) {
        console.log('global caught error: ', error)
        return true
    }
    ```