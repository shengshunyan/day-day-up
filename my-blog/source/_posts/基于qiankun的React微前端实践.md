---
title: 基于qiankun的React微前端实践
date: 2020-11-04
keywords: JavaScript, 微前端, React
cover: https://i.loli.net/2020/11/04/cINvZyxWlXhz8Ou.png
tags:
     - JavaScript
---


{% note info no-icon %}
qiankun官方网站：https://qiankun.umijs.org/zh

参考知乎文章：[微前端到底是什么](https://zhuanlan.zhihu.com/p/96464401)
{% endnote %}

## 概述

近几天接到一个之前没做过的需求：需要将几个web应用合到一个应用上进行展示，每一个独立应用作为新应用的一个子模块。想起之前常听大家说起的微前端，搜索一番之后确定这个需求就是实现微前端。

<br/>


## 微前端

### 概念

为了解决庞大的一整块后端服务带来的变更与扩展方面的限制，出现了微服务架构（Microservices）：

{% note info no-icon %}
微服务是面向服务架构（SOA）的一种变体，把应用程序设计成一系列松耦合的细粒度服务，并通过轻量级的通信协议组织起来

具体地，将应用构建成一组小型服务。这些服务都能够独立部署、独立扩展，每个服务都具有稳固的模块边界，甚至允许使用不同的编程语言来编写不同服务，也可以由不同的团队来管理
{% endnote %}

然而，越来越重的前端工程也面临同样的问题，自然地想到了将微服务思想应用（照搬）到前端，于是有了「微前端（micro-frontends）」的概念：

{% note info no-icon %}
即，一种由独立交付的多个前端应用组成整体的架构风格。具体的，将前端应用分解成一些更小、更简单的能够独立开发、测试、部署的小块，而在用户看来仍然是内聚的单个产品
{% endnote %}


### 特点

1. 代码库更小，更内聚、可维护性更高

2. 松耦合、独立部署，每个微前端都应具备有自己的持续交付流水线（包括构建、测试并部署到生产环境）

3. 渐进地升级、更新甚至重写部分前端功能成为了可能


### 实现方案

1. 微前端架构中一般会有个容器应用（container application）将各子应用集成起来，职责如下：
 - 渲染公共的页面元素，比如 header、footer
 - 解决横切关注点（cross-cutting concerns），如身份验证和导航
 - 将各个微前端整合到一个页面上，并控制微前端的渲染区域和时机

2. 难点就在于如何简便地将各个微前端集成到一个页面上，集成方法有：
 - 服务端集成：如 SSR 拼装模板
 - 构建时集成：将子应用发布成独立的 npm 包，共同作为主应用的依赖项，构建生成一个供部署的 JS Bundle
 - 运行时集成：如通过 iframe、JS、Web Components 等方式


### 微前端demo

{% note info no-icon %}
github地址：https://github.com/micro-frontends-demo/container
在线demo：https://demo.microfrontends.com/
{% endnote %}

demo中用的就是 **运行时集成** 的方法，每个子应用暴露出渲染函数，主应用在启动时加载各个子应用的独立 Bundle，之后根据路由规则渲染相应的子应用。

![WX20201104-201022.png](https://i.loli.net/2020/11/04/ORrPtVK18kagNmn.png)

<br/>


## React微前端实战

基于两个已有项目，一个作为容器应用（container application），一个作为微前端集成的应用

假设容器应用运行在 http://container.application.com，微应用运行在 http://micro.application.com


### 容器应用配置

1. 安装 qiankun

     ```bash
     yarn add qiankun
     ```

2. 在页面骨架中创建微应用的容器节点，dom节点id设置为 'microFrontendContent'
     
     ```html
      <Layout className="app">
          <Layout.Header>
               <Header username={username} logout={logout} />
          </Layout.Header>
          <Layout id="microFrontendContent"></Layout>
     </Layout>
     ```

3. 注册微应用（一般在项目的入口文件index.js）

     ```JavaScript
     // index.js

     // some code...

     import { registerMicroApps } from 'qiankun'

     // some code...

     registerMicroApps([
          {
               name: 'micro',
               entry: 'http://micro.application.com', // 微应用的访问地址
               container: '#microFrontendContent', // 上一步设置的微应用容器节点id
               activeRule: '/app/micro', // 出发渲染微应用的前端路由
          }
     ])
     ```

4. 启动 qiankun（一般在容器应用页面初始化完成之后执行，如 App.jsx 的 componentDidMount 生命周期函数中）

     ```JavaScript
     // App.jsx

     // some code...

     import { start } from 'qiankun'

     // some code...

     componentDidMount() {
          start({
               // experimentalStyleIsolation配置是做容器应用和微应用的样式隔离，在微应用的所有样式前加前缀区分，详见官网文档
               sandbox: { experimentalStyleIsolation: true } 
          })
     }
     ```

5. 在容器应用前端静态资源服务器配置中添加微应用的后端接口代理

     ```JavaScript
     const proxies = [
          // 容器应用的接口代理（之前开发 container application 配置的）
          {
               target: 'http://container.server.com',
               proxyPort: 9520,
               headers: {},
               paths: ['/containerapi']
          },
          // 微应用的接口代理
          {
               target: 'http://micro.server.com',
               proxyPort: 9520,
               headers: {},
               paths: ['/microapi']
          },
     ]
     ```


### 微应用配置

1. 导出相应的生命周期钩子

     微应用需要在自己的入口 js (通常就是你配置的 webpack 的 entry js) 导出 bootstrap、mount、unmount 三个生命周期钩子，以供主应用在适当的时机调用。

     注意 ‘microRoot’ 是微应用原本index.html文件根节点的id

     ```JavaScript
     // index.js

     /**
     * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
     * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
     */
     export async function bootstrap() {
          console.log('react app bootstraped');
     }
     /**
     * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
     */
     export async function mount(props) {
          ReactDOM.render(<App />, props.container ? props.container.querySelector('#microRoot') : document.getElementById('root'));
     }
     /**
     * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
     */
     export async function unmount(props) {
          ReactDOM.unmountComponentAtNode(props.container ? props.container.querySelector('#microRoot') : document.getElementById('root'));
     }
     /**
     * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
     */
     export async function update(props) {
          console.log('update props', props);
     }

     // __POWERED_BY_QIANKUN__ 能区别是否是微服务的形式访问
     // 让微应用既能集成在容器应用中，又能单独访问
     if (!window.__POWERED_BY_QIANKUN__) {
          ReactDOM.render(<App />, document.getElementById('microRoot'));
     }
     ```

2. 修改微应用的打包工具配置

     ```JavaScript
     // webpack config
     const packageName = require('./package.json').name;

     module.exports = {
          output: {
               publicPath: 'http://micro.application.com/', // 微应用的前端服务地址
               library: `${packageName}-[name]`,
               libraryTarget: 'umd',
               jsonpFunction: `webpackJsonp_${packageName}`,
          },
     };
     ```

3. 设置微应用的前端服务资源能跨域访问

     ```JavaScript
     const devServer = {
          // ...
          headers: { 'Access-Control-Allow-Origin': '*' },
          // ...
     }
     ```

4. 针对antd资源的调整：所有antd相关样式（dom class和css选择器）添加一个前缀，与父应用的antd样式区分开，避免相互影响

     ```JavaScript
     // webpack config
     {
          loader: 'less-loader',
          + options: {
          +   modifyVars: {
          +     '@ant-prefix': 'microPrefix',
          +   },
          +   javascriptEnabled: true,
          + },
     }
     ```
     ```JavaScript
     // 配置 antd ConfigProvider
     import { ConfigProvider } from 'antd';
   
     export const MyApp = () => (
          <ConfigProvider prefixCls="microPrefix">
               <App />
          </ConfigProvider>
     );
     ```

5. 针对antd资源的调整：设置微应用的antd弹出框（Select, Tooltip, Menu 等等）渲染在微应用的根节点上

     ```JavaScript
     // 配置 antd ConfigProvider
     import { ConfigProvider } from 'antd';
   
     export const MyApp = () => (
          <ConfigProvider getPopupContainer={() => document.getElementById('tigerContainer')}>
               <App />
          </ConfigProvider>
     );
     ```
