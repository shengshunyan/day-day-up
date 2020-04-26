---
title: React Error Boundaries
date: 2020-04-26
keywords: react, Error Boundaries, 错误处理
cover: https://i.loli.net/2020/04/15/o8uxKypfQsBtdre.png
tags:
     - JavaScript
---


## 简介
自 React 16 开始，任何未被错误边界捕获的错误将会卸载整个 React 组件树。部分 UI 的 JavaScript 错误不应该导致整个应用崩溃，为了解决这个问题，React 16 引入了一个新的概念 —— 错误边界。

错误边界是一种 React 组件，这种组件可以捕获并打印发生在其子组件树任何位置的 JavaScript 错误，并且，它会渲染出备用 UI，而不是渲染那些崩溃了的子组件树。错误边界在 **渲染期间、生命周期方法和整个组件树的构造函数** 中捕获错误。

<br/>


## 示例代码

1. ErrorBoundary.jsx
    - getDerivedStateFromError允许你更新 state 使下一次渲染能够显示降级后的 UI
    - componentDidCatch可以处理一些副作用，如日志上传
```JavaScript
import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // 你同样可以将错误日志上报给服务器
        console.log(error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            // 你可以自定义降级后的 UI 并渲染
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary
```

2. App.jsx
```JavaScript
import React, from 'react';
import ErrorBoundary from './ErrorBoundary'

class App extends React.Component {
    state = {
        count: 1
    }

    render() {
        const { count } = this.state

        if (count === 3) {
            throw new Error('I crashed!');
        }

        return (
            <ErrorBoundary>
                <h1>App</h1>
                <p>{count}</p>
                <button onClick={() => this.setState({ count: count + 1 })}>add</button>
            </ErrorBoundary>
        )
    }
}

export default App;
```

<br/>


## 如何放置错误边界

错误边界的粒度完全取决于你的应用，可以将它包装在最顶层的路由组件，并且为用户展示一个发生异常的 的错误信息。就像服务端框架通常处理崩溃那样。

你也可以将单独的插件包装在错误边界内部以保护应用不受该组件崩溃的影响。

<br/>


## Error Boundaries 无法catch的场景

1. 事件处理（[了解更多](https://zh-hans.reactjs.org/docs/error-boundaries.html#how-about-event-handlers)）
2. 异步代码（例如 setTimeout 或 requestAnimationFrame 回调函数）
3. 它自身抛出来的错误（并非它的子组件）
4. 服务端渲染
