---
title: 从零构建React Todo项目(六)添加项目常用组件
date: 2020-09-10
keywords: JavaScript, React, router, store, easy-peasy
cover: https://i.loli.net/2020/09/07/M5yvXBUGnYsqEft.gif
tags:
     - JavaScript
---

{% note info no-icon %}
项目地址：https://github.com/shengshunyan/react-scaffold
{% endnote %}


## 概述

一个基本react的项目需要一些额外的组件，比如React Router，公共状态管理组件，还有第三方的UI组件库等

<br/>


## React Router

1. 安装 (官网：https://reactrouter.com/web/guides/quick-start)

    ```bash
    npm install --save react-router-dom
    ```

2. 入口文件中引入资源，添加相关逻辑代码

    /src/index.js
    ```JavaScript
    //...

    // 引入router组件
    import {
        BrowserRouter as Router,
        Switch,
        Route,
        Link,
    } from 'react-router-dom';

    // ... 

    function App() {
        return (
            <div className="app">
                <Router>
                    <div>
                        <nav>
                            <ul>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/about">About</Link>
                                </li>
                                <li>
                                    <Link to="/users">Users</Link>
                                </li>
                            </ul>
                        </nav>

                        <Switch>
                            <Route path="/about">
                                <About />
                            </Route>
                            <Route path="/users">
                                <Users />
                            </Route>
                            <Route path="/">
                                <Home />
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }

    function Home() {
        return <h2>Home</h2>;
    }

    function About() {
        return <h2>About</h2>;
    }

    function Users() {
        return <h2>Users</h2>;
    }

    // ... 
    ```

3. 查看效果

    ![WX20200910-150718.png](https://i.loli.net/2020/09/10/EWuFy6lvUbIgXM8.png)

<br/>


## UI组件库：Ant Design of React

1. 安装

    ```bash
    npm install --save antd
    ```

2. 入口js文件头部引入antd css样式文件

    /src/index.js
    ```JavaScript
    //...

    // 引入antd组件库
    import 'antd/dist/antd.css';

    //...
    ```

3. 使用组件

    ```JavaScript
    import { DatePicker } from 'antd';

    export default function Home() {
        return (
            <h2>
                Home
                <DatePicker />
            </h2>
        );
    }    
    ```

4. 查看效果

    ![WX20200910-152427.png](https://i.loli.net/2020/09/10/KvcnHwx6DWziJjG.png)

<br/>


## 调整项目入口页面

1. 在引入了 React Router 和 antd 之后，我们可以根据 antd 的 layout 组件来搭建页面的骨架，配合 React Router 来做系统的导航，具体项目的调整细节请参考commit：[add the react router & antd design components](https://github.com/shengshunyan/react-scaffold/commit/37473253f17d4d984c3695a9aa00ce476a475c57)

    <img src="https://i.loli.net/2020/09/10/FiGJpN1Ium39BAL.png" width="30%" height="30%">

2. 利用[react原生支持的代码分割](https://www.shengshunyan.xyz/2019/07/28/React%E5%8E%9F%E7%94%9F%E4%BB%A3%E7%A0%81%E5%88%86%E5%89%B2%20&%20React%20Hook/)来做模块代码的分割和懒加载

    ```JavaScript
    const Index = lazy(() => import(/* webpackChunkName: "Index" */'../../modules/index'));

    function App() {
        return (
            <Switch>
                <Route path={url.app.index.path}>
                    <Suspense fallback={<div>loading</div>}>
                        <Index />
                    </Suspense>
                </Route>
            </Switch>
        )
    }
    ```

3. 调整后效果

    ![WX20200910-173534.png](https://i.loli.net/2020/09/10/AK6WLt37ymazJjQ.png)

<br/>


## easy-peasy 全局状态管理

### 简介

Easy Peasy 提供了一个直观的API，可以快速、轻松地管理您的React应用程序的状态。

### 使用

1. 安装 (官网：https://easy-peasy.now.sh/)

    ```bash
    npm install --save easy-peasy
    ```

2. 基本使用

    见之前的博客 [React状态管理之easy-peasy](https://www.shengshunyan.xyz/2020/04/14/React%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E4%B9%8Beasy-peasy/)