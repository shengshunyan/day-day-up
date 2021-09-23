---
title: Npm专题(一)基础使用
date: 2021-07-19
keywords: JavaScript, npm, package
cover: https://i.loli.net/2021/06/03/q1yN83J6TMlpnHz.png
tags:
     - JavaScript
---


{% note info no-icon %}
参考：
 - [《npm官网中文》](https://www.npmjs.cn/getting-started/what-is-npm/)
 - [《npm官网英文》](https://docs.npmjs.com/)
{% endnote %}

## 前言

npm 为你和你的团队打开了连接整个 JavaScript 天才世界的一扇大门。它是世界上最大的软件注册表，每星期大约有 30 亿次的下载量，包含超过 600000 个 包（package） （即，代码模块）。来自各大洲的开源软件开发者使用 npm 互相分享和借鉴。包的结构使您能够轻松跟踪依赖项和版本。

npm 由三个独立的部分组成：

 - [网站](https://npmjs.com/)：是开发者查找包（package）、设置参数以及管理 npm 使用体验的主要途径
 - 注册表（registry）：是一个巨大的数据库，保存了每个包（package）的信息
 - [命令行工具 (CLI)](https://docs.npmjs.com/cli/npm)：通过命令行或终端运行。开发者通过 CLI 与 npm 打交道

<br/>


## 安装和配置

### 安装

npm是基于Node.js的随同Node.js一起发布，所以要想使用npm，首先要安装Node.js。

Node.js的下载地址是：[nodejs 下载地址](https://nodejs.org/en/)

安装完成之后，在命令行输入如下命令查看npm版本：

```bash
npm -v
# 3.10.8
```

更新npm：

```bash
npm install -g npm
# 或
npm install -g npm@latest
```


### 配置快速安装源

在使用 npm install 的时候，会从一个默认的源里下载需要安装的东西，有时候这个源可能不是最快的，特别是在国内，可能会遇到网络问题。

我们可以使用 nrm 这个工具去更换 npm 安装包的那个源，比如可以使用淘宝提供的源。

安装 nrm ：

```bash
npm install -g nrm
```

查看可以使用的源：

```bash
nrm ls

# * npm ---- https://registry.npmjs.org/
#   cnpm --- http://r.cnpmjs.org/
#   taobao - https://registry.npm.taobao.org/
#   nj ----- https://registry.nodejitsu.com/
#   rednpm - http://registry.mirror.cqupt.edu.cn/
#   npmMirror  https://skimdb.npmjs.com/registry/
#   edunpm - http://registry.enpmjs.org/
```

切换安装源：

```bash
nrm use taobao
# Registry has been set to: https://registry.npm.taobao.org/
```

安装源已经切换到了taobao，以后下载包就从这个源下载。

<br/>


## 包管理

全局包的管理和本地包的管理基本一致，只需要添加 -g 参数

安装包：

```bash
# 默认添加在 package.json 的 dependencies
npm install @shengshunyan/utils
# 添加在 package.json 的 devDependencies
npm install -D @shengshunyan/utils
# 安装制定版本的包
npm install @shengshunyan/utils@1.0.2
```

删除包：

```bash
npm uninstall @shengshunyan/utils
```

查看包信息：

```bash
npm info @shengshunyan/utils
```

<br/>


## 同时引入一个库的不同版本

npm 6.9之后，支持安装依赖的时候指定别名；

```bash
npm install <alias>@npm:<packagename>@<version>
```

以一个utils组件为例，目前有1.0.0版本、1.0.1版本、1.0.2版本

![WX20210923-163804@2x.png](https://i.loli.net/2021/09/23/5rqB8makDGvJhXs.png)

原本项目中安装使用了1.0.0版本，如果我现在想用1.0.2版本的新特性，并且不该动引用了1.0.0版本的代码，这个时候我们可以这样安装新版本：

```bash
npm install @shengshunyan/utils1.0.2@npm:@shengshunyan/utils@1.0.2
```

然后在新新模块中，这样引用这个库

```bash
import { sort } from '@shengshunyan/utils1.0.2'
 
const arr = [1, 3, 2, 2, 2]
const bubbleSortArr = sort.bubbleSort(arr)
console.log('bubbleSortArr: ', bubbleSortArr)
```

<br/>


## npx 使用

npm 从5.2版开始，增加了 npx 命令。它有很多用处，本文介绍该命令的主要使用场景。

npx 想要解决的主要问题，就是调用项目内部安装的模块。比如，项目内部安装了测试工具 Mocha。

一般来说，调用 Mocha ，只能在项目脚本和 package.json 的scripts字段里面， 如果想在命令行下调用，必须像下面这样。

```bash
node-modules/.bin/mocha --version
```

npx 就是想解决这个问题，让项目内部安装的模块用起来更方便，只要像下面这样调用就行了。

```bash
npx mocha --version
```

npx 的原理很简单，就是运行的时候，会到node_modules/.bin路径和环境变量$PATH里面，检查命令是否存在。

<br/>
