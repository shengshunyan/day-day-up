---
title: Npm专题(二)包管理文件package.json
date: 2021-08-10
keywords: JavaScript, npm, package
cover: https://i.loli.net/2021/06/03/q1yN83J6TMlpnHz.png
tags:
     - JavaScript
---


## 文件简介

package.json 是一个项目配置文件，你可以在这个文件里面描述一下我们的项目，比如项目的名字，作者，描述，版本号，依赖的 package 等等。

并且允许我们使用“语义版本规则”，指明你项目依赖的版本，让你的构建更好的与其他人共享；

**创建配置文件：**

npm 提供了一个 init 命令可以帮助我们创建这个 package.json 文件。

```JavaScript
npm init -y
```

<br/>


## 文件内容

### 必填

name：全部小写，没有空格，可以使用下划线或者横线

version：x.x.x的格式，符合语义化规则

### 非必填

description：描述信息，有助于搜索

main：入口文件，一般都是index.js （**Ps: main、module、browser之间的关系？**）

scripts：支持的脚本，默认是一个空的test

author：作者信息

license：默认是MIT

keywords：关键字，有助于人们使用npm search搜索时候发现你的项目

<br />

## scripts脚本

[《npm scripts 使用指南》](https://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)

<br />

## 指定依赖的包

### 依赖包的方式

包依赖有2种方式
 - dependencies：在生产环境中需要用到的依赖
 - devDependencies：在开发、测试环境中用到的依赖

### 依赖包的版本规则

如 "vue": "^2.5.22"，key是依赖包的名称，value是这个依赖包的版本，那么版本签名的^是什么意思呢，或者版本前面直接是一个*是什么意思，这就是npm的语义化版本规则。

npm包提供者需要了解npm规则，应该注意版本规范，如果打算与别人分享，应该从1.0.0版本开始，遵循如下标准：

 - 补丁版本，解决了bug或者一些较小的更改，增加最后一位数字，如：1.0.1
 - 小版本，增加了新特性，同时不会影响之前的版本，增加中间一位数据，如：1.1.0
 - 大版本，大改版，无法兼容之前的版本，增加第一位数字，如：2.0.0

使用者，可以在package.json文件中写明可以接受的更新程度：

 - 接受补丁版本的更新：[1.0 | 1.0.x | ~1.0.4]
 - 接受小版本的更新：[1 | 1.x | ^1.0.4]
 - 接受大版本的更新：[* | x]

<br />

## peerDependencies

peerDependencies的引入，为了解决这种问题：如果你安装我，那么你最好也安装X,Y和Z

举个例子，就拿目前基于react的ui组件库ant-design@3.x来说，因该ui组件库只是提供一套react组件库，它要求宿主环境需要安装指定的react版本。具体可以看它package.json中的配置：

```json
"peerDependencies": {
  "react": ">=16.0.0",
  "react-dom": ">=16.0.0"
}
```

它要求宿主环境安装react@>=16.0.0和react-dom@>=16.0.0的版本，而在每个antd组件的定义文件顶部：

```JavaScript
import * as React from 'react';
import * as ReactDOM from 'react-dom';
```

组件中引入的react和react-dom包其实都是宿主环境提供的依赖包。

**npm2和npm3中peerDependencies的区别：**

在npm2中，PackageA包中peerDependencies所指定的依赖会随着npm install PackageA一起被强制安装，所以不需要在宿主环境的package.json文件中指定对PackageA中peerDependencies内容的依赖。

但是在npm3中，peerDependencies的表现与npm2不同：

{% note info no-icon %}
npm3中不会再要求peerDependencies所指定的依赖包被强制安装，相反npm3会在安装结束后检查本次安装是否正确，如果不正确会给用户打印警告提示。这时，你需要手动的在项目的package.json文件指定缺少的依赖。

{% endnote %}

类似下图：
![408483-20180923150858602-1272873115.jpeg](https://i.loli.net/2021/09/23/HPK4LF8rxUnl5vy.jpg)

<br />

## package-lock.json的作用

npm是一个用于管理package之间依赖关系的管理器，它允许开发者在pacakge.json中间标出自己项目对npm各库包的依赖。默认情况下，npm以如下方式来标明自己所需要库包的版本

```json
"dependencies": {
 "@types/node": "^8.0.33",
}
```

这里面的 向上标号^是定义了向后（新）兼容依赖，指如果 types/node的版本是超过8.0.33，并在大版本号（8）上相同，就允许下载最新版本的 types/node库包，例如实际上可能运行npm install时候下载的具体版本是8.0.35

大多数情况这种向新兼容依赖下载最新库包的时候都没有问题，可是因为npm是开源世界，各库包的版本语义可能并不相同，有的库包开发者并不遵守严格这一原则：相同大版本号的同一个库包，其接口符合兼容要求。这时候用户就很头疼了：在完全相同的一个nodejs的代码库，在不同时间或者不同npm下载源之下，下到的各依赖库包版本可能有所不同，因此其依赖库包行为特征也不同有时候甚至完全不兼容。

因此npm最新的版本就开始提供自动生成package-lock.json功能，为的是让开发者知道只要你保存了源文件，到一个新的机器上、或者新的下载源，只要按照这个package-lock.json所标示的具体版本下载依赖库包，就能确保所有库包与你上次安装的完全一样。

<br />


{% note info no-icon %}
## 拓展：项目依赖同一npm包的多版本，会有冲突吗
{% endnote %}

比如我的项目pony，依赖了A@1.0.0版本。 然后我又引入了B，而B依赖A@2.0.0版本，这时候会产生冲突吗？

验证一下：

首先建立好项目trade，然后安装 A@1.0.0，执行npm ls -depth=1

```
pony
└─ A@1.0.0
```

然后弄个npm包B，让它依赖A@2.0.0，项目pony安装B之后，执行npm ls -depth=1

```
pony
├─ A@1.0.0
└┬ B
  └─ A@2.0.0
```

这里就很清楚的知道了多版本存放的策略。

模块打包的时候，webpack查找模块的方式和node一致，都是先找当前目录的node_modules中是否有这个模块，然后再找上一级目录的node_modules，一直找到根目录。这样就能保证webpack能顺利找到模块了。