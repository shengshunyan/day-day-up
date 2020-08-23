---
title: 构建React Todo项目(一)打包工具选择
date: 2020-08-23
keywords: JavaScript, React, Parcel
cover: https://i.loli.net/2020/06/29/f1yJm3lD7aKsSnx.jpg
tags:
     - JavaScript
---

{% note info no-icon %}
项目地址：https://github.com/shengshunyan/react-scaffold
{% endnote %}


## webpack的问题

webpack 能够通过强大、灵活的配置实现我们目前遇到的大部分场景的 bundle ，但是强大就意味了复杂，比如跑一个最简单的 react 项目我们都至少得需要这样的一个 webpack.config.js ：

```JavaScript
{
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9000,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
}
```

其中还不包括正常项目所必需的对 CSS/FONT/IMG 的处理以及打包过程的一些优化项，配置确实很复杂。

俗话说，写完一个 webpack.config 你的项目就做完一半了...

<br/>


## 选择Parcel

### 简介

parcel，极速零配置Web应用打包工具。在 github 上开源 2 周不到的时间，star 就上了 11k , 目前有 36k+

### 优点

1. **极速打包：** Parcel 使用 worker 进程去启用多核编译。同时有文件系统缓存，即使在重启构建后也能快速再编译。

2. **将你所有的资源打包：** Parcel 具备开箱即用的对 JS, CSS, HTML, 文件 及更多的支持，而且不需要插件。

3. **零配置代码分拆：** 使用动态 import() 语法, Parcel 将你的输出文件束(bundles)分拆，因此你只需要在初次加载时加载你所需要的代码。

4. **热模块替换：** Parcel 无需配置，在开发环境的时候会自动在浏览器内随着你的代码更改而去更新模块。

<br/>


## 项目构建

1. 创建项目

    ```Bash
    ## 创建项目文件夹
    mkdir react-todo
    cd react-todo

    ## 初始化package.json
    npm init -y

    ## 安装parcel
    npm i parcel -D
    ```

2. 添加一下babel的默认配置 .babelrc
    ```JavaScript
    {
        "presets": ["env", "react"]
    }
    ```

3. 在package.json中添加 npm scripts 启动命令
    - src/index.html 是项目入口文件
    - --out-dir dev 表示资源打包的输出目录是dev
    - --open 表示启动项目之后自动打开浏览器页面
    - --no-source-maps 表示禁用源代码映射，生产环境打包可以减小体积
    - 其他配置项请参考官网：https://zh.parceljs.org/cli.html

    ```JavaScript
    {
        "start": "parcel src/index.html --out-dir .dev --open",
        "build": "parcel build src/index.html --no-source-maps",
    }
    ```

4. 添加示例逻辑代码

    a. /src/index.html
    ```html
    <html>

    <body>
        <div id="root"></div>
        <script src="./index.js"></script>
    </body>

    </html>
    ```

    b. /src/index.js
    ```JavaScript
    import React from 'react';
    import ReactDOM from 'react-dom';

    class App extends React.PureComponent {
        render() {
            return (
                <div>Hello Parcel</div>
            );
        }
    }

    ReactDOM.render(<App />, document.getElementById('root'));
    ```

5. 运行项目/打包项目：项目初次运行，parcel会根据打包需要自动添加相关依赖到package.json文件中，并安装。

    ```Bash
    npm run start
    npm run build
    ```

<br/>


## 特性探索

### 代码拆分 (Code Splitting)

1. 在/src目录下新建一个person.js文件用于测试
    ```JavaScript
    export function sayHello() {
        console.log('hello world')
    }
    ```

2. 在/src/index.js中动态引入
    ```JavaScript
    import('./person').then(function (person) {
        person.sayHello()
    })
    ```

3. npm run build打包之后，查看文件，person.js文件被单独打包用于动态加载

4. 了解更多请参考官网：https://zh.parceljs.org/code_splitting.html

### 接口代理 (Proxy)

parcel没有内置接口代理的功能，不过github上有已经实现的组件 [parcel-proxy-server](https://github.com/charlieduong94/parcel-proxy-server) 可以实现代理的功能

1. 安装相关依赖
    ```Bash
    npm install parcel parcel-proxy-server parcel-bundler --save-dev
    ```

2. 添加配置文件/build/dev.js，之前通过CLI传入parcel的参数，现在在这个文件中配置

    ```JavaScript
    const ParcelProxyServer = require('parcel-proxy-server');

    const server = new ParcelProxyServer({
    // 打包入口
    entryPoint: './src/index.html',
    // 配置参数
    parcelOptions: {
        outDir: './.dev',
        open: true,
    },
    // 代理配置
    proxies: {
        '/api': {
        target: 'http://localhost:8000/'
        }
    }
    });

    server.bundler.on('buildEnd', () => {
    console.log('Build completed!');
    });

    server.listen(8080, () => {
    console.log('Parcel proxy server has started');
    });
    ```

3. 将 package.json 的 npm scripts 命令的start修改为：
    ```JavaScript
    {
        "start": "node build/dev.js"
    }
    ```

4. npm run start项目就能启动，并且有接口代理的功能

<br/>


## 拓展 snowpack

### 简介

[snowpack](https://www.snowpack.dev/)：号称 无需打包工具（Webpack，Parcel）便能将代码结果实时展现在浏览器中。

bundleless：使用 Snowpack，当您构建现代的 Web 应用程序（使用React，Vue等），无需使用类似于 Webpack，Parcel 和 Rollup  等打包工具。每次您点击保存时，都无需等待打包程序重新构建。相反，所有的文件更改都会立即反映在浏览器中。

### 优劣势

1. 优势：
    - 减少了打包的时间成本，只要一次 snowpack。修改源码能够实时反馈在浏览器上。
    - 代码可移植能力强，相当于纯写 JavaScript 语言
    - 模块和源码相互独立，有点类似于 webpack 的 DDL

2. 劣势：
    -  对 ES Modules 的依赖性强，在npm 上虽然 ES Modules 的包在逐渐增加，但是短期内需要包都需要做额外的处理。例如我想引入 Antd, 发现其中依赖了很多 CommonJS 的模块以及样式未使用 CSS-in-JS, 引入较为繁琐。
    - 对于一些 css，images 资源处理不够友好，需要额外手动处理
    - 太多依赖包会造成网络问题

### 试用

```Bash
## 通过模版初始化一个react项目
npx create-snowpack-app snowpack-test --template @snowpack/app-template-react

## 运行项目
cd snowpack-test
npm run start
```