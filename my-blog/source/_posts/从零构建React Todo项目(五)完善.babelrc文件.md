---
title: 从零构建React Todo项目(五)完善.babelrc文件
date: 2020-09-09
keywords: JavaScript, React, babel, babelrc
cover: https://i.loli.net/2020/09/07/M5yvXBUGnYsqEft.gif
tags:
     - JavaScript
---

{% note info no-icon %}
项目地址：https://github.com/shengshunyan/react-scaffold
参考：
 - Babel 7 升级实践：https://blog.hhking.cn/2019/04/02/babel-v7-update/
 - 五分钟突击之 .babelrc：https://zhuanlan.zhihu.com/p/84083454
{% endnote %}


## 回顾

之前创建项目时，配置了一个简洁的.babelrc文件

```json
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "modules": false
            }
        ],
        "@babel/preset-react"
    ]
}
```

<br/>


## 功能简介

Babel 是广为使用的 ES6 转码器，可以将 ES6 代码转化为 ES5 代码。比如：

```JavaScript
// 转码前
input.map(item=>item+1)
// 转码后
input.map(function (item){
    return item+1;
});
```

<br/>


## 配置 .babelrc 文件

### 基本格式

配置文件.babelrc放在项目根目录，此文件用于配置转码规则和插件，基本格式：

```json
{
     "presets":[],
     "plugins":[]
}
```

### 配置项

对预设（presets）和插件（plugins）进行配置，因此不同的转译器作用不同的配置项，大致可分为以下三项类：

1. 语法转译器：preset

     安装

     ```Bash
     npm install --save-dev @babel/preset-env @babel/preset-react @babel/preset-typescript
     ```

     **@babel/preset-env** 
     
     主要对 JavaScript 最新的语法糖进行编译。

     并不负责转译新增的 API 和全局对象， Promise,Iterator,Generator,Set,Maps,Proxy,Symbol 等全局对象，以及一些定义在全局对象的方法（比如 includes/Object.assign 等）并不能被编译。

     官方推荐使用，包含了所有现代js（es2015 es2016等）的所有新特性，你也可以传递一些配置给env，精准实现你想要的编译效果。

     ```json
     {
        "presets": [
            ["@babel/env",  {
                "modules": false
            }]
        ]
     }
     ```

     **@babel/preset-react** 转译react语法
     
     **@babel/preset-typescript** 转译typescript语法

2. API 和全局对象转译器：polyfill

     负责转译新增的 API 和全局对象，保证在浏览器的兼容性。比如Promise,Iterator,Generator,Set,Maps,Proxy,Symbol 等全局对象，以及一些定义在全局对象的方法（比如 includes/Object.assign 等）

     安装

     ```Bash
     npm install --save core-js regenerator-runtime
     ```

     **.babelrc文件添加useBuiltIns配置**
      a. targets 是编译的目标浏览器版本，有些浏览器已支持的API就不用转换了
      b. useBuiltIns: "usage" 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加。（[配置详解](https://blog.hhking.cn/2019/04/02/babel-v7-update/)）
      c. "corejs": 3 是值 core-js 的版本

     ```json
     {
        "presets": [
            [
                "@babel/preset-env",
                {
                    "targets": {
                        "chrome": "49",
                        "firefox": "65",
                        "safari": "12",
                        "node": "current"
                    },
                    "modules": false,
                    "useBuiltIns": "usage",
                    "corejs": "3"
                }
            ],
            "@babel/preset-react",
        ],
     }
     ```

    **入口js（/src/index.js）中引入相关js库**

    ```JavaScript
    // babel polyfill
    import 'core-js/stable';
    import 'regenerator-runtime/runtime';
    ```

     **@babel/plugin-transform-runtime**这个插件是用来复用辅助函数的

     ```json
     {
        "plugins": [
            ["@babel/plugin-transform-runtime"]
        ]
     }
     ```


3. 各种插件

     **@babel/plugin-proposal-object-rest-spread**： 转译 ... 语法

     等...

<br/>


## 最终配置文件

/src/.babelrc

```json
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "chrome": "49",
                    "firefox": "65",
                    "safari": "12",
                    "node": "current"
                },
                "modules": false,
                "useBuiltIns": "usage",
                "corejs": "3"
            }
        ],
        "@babel/preset-react",
        "@babel/preset-typescript"
    ],
    "plugins": [
        "@babel/plugin-transform-runtime"
    ]
}
```
