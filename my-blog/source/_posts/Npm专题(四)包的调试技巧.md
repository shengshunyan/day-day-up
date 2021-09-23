---
title: Npm专题(四)包的调试技巧
date: 2021-09-19
keywords: JavaScript, npm, package
cover: https://i.loli.net/2021/06/03/q1yN83J6TMlpnHz.png
tags:
     - JavaScript
---


{% note info no-icon %}
参考：
 - [《我曾为 npm link 调试过程感到痛不欲生，直到我遇到这个宝藏神器》](https://mp.weixin.qq.com/s/jLAARAXo5sFGp0KagGMxQg)
{% endnote %}

## 前言

我们发布一个npm包之后，在项目中安装然后使用，难免会遇到npm包中有bug的情况，这时候需要npm包和项目一起调试来找到问题；本文整理了几个npm包调试的技巧；

三种常用方法：
 - 直接修改 dependencies
 - npm link
 - yalc

<br/>


## 直接修改 dependencies

1. 修改npm包代码，然后重新打包

2. 修改package.json文件

    ```json
    - "@shengshunyan/utils": "^1.0.2"
    + "@shengshunyan/utils": "file:/Users/guoshi/Desktop/shengshunyan-utils"
    ```

3. 项目重新安装 @shengshunyan/utils

    ```bash
    npm install
    ```

<br/>


## npm link

npm link用来在本地项目和本地npm模块之间建立连接，可以在本地进行模块测试

1. npm包目录下

    ```bash
    # 1. 开启开发模式，修改源码，自动打包
    npm run dev
    # 2. 将当前npm包链接到本地全局
    npm link
    # 3. 查看链接效果
    npm ls --global

    /usr/local/lib
    ├── @shengshunyan/utils@1.0.2 -> /Users/guoshi/Desktop/shengshunyan-utils
    ├── # ...other module
    ```

2. 项目目录下

    ```bash
    # 1. 将项目里的包@shengshunyan/utils链接到本地全局
    npm link @shengshunyan/utils
    # 2. 运行项目
    npm run dev
    # 3. 查看链接效果
    npm ls

    my-app@0.1.0 /Users/guoshi/Desktop/day-day-up/react-test
    ├── @shengshunyan/utils@1.0.2 -> /Users/guoshi/Desktop/shengshunyan-utils
    ├── # ...other module
    ```

3. 修改npm包的源码，改动就会实时同步到项目中

4. 调试完毕，删除link

    ```bash
    # 1. npm包目录下
    npm uninstall -g @shengshunyan/utils 
    # 2. 项目目录下
    npm uninstall @shengshunyan/utils 
    npm install --save @shengshunyan/utils 
    ```

{% note primary %}
NPM 组件 和你的项目使用了 React Hooks 的情况，React 会报致命异常。（原因是 React Hooks 依赖上下文，所以全局只能使用一个，即使是版本完全一样的）
{% endnote %}

## yalc

[yalc](https://github.com/wclr/yalc) 将组件的包依赖提升至应用中，在全局添加组件依赖，在应用下新建文件拉取依赖，即使有共同的依赖也会从应用的 node_modules 去查找。「使用 yalc 可以避免上面 npm link 的依赖问题」

1. 安装yalc包

    ```bash
    npm install -g yalc
    ```

2. npm包目录下

    ```bash
    # 1. 发布npm包
    yalc publish
    # 2. package.json文件里添加scripts脚本 
    "watch": "nodemon --ignore node_modules/ --watch src/ --ext ts,tsx,scss -x 'rollup -c && yalc push'",
    # 3. 监听模块代码改动，自动打包、更新包
    npm run watch
    ```

3. 项目目录下

    ```bash
    # 1. 在项目中 link 对应的包
    yalc link @shengshunyan/utils  
    # 2. 运行项目
    npm run dev
    ```

4. 修改npm包的源码，改动就会实时同步到项目中

5. 调试完毕，删除link

    ```bash
    # 1. 项目目录下
    yalc remove @shengshunyan/utils
    npm uninstall @shengshunyan/utils 
    npm install --save @shengshunyan/utils 
    ```