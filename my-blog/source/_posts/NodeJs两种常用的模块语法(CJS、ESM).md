---
title: NodeJs两种常用的模块语法(CJS、ESM)
date: 2020-12-14
keywords: NodeJs, JavaScript, 模块, CJS, ESM
cover: https://i.loli.net/2020/12/14/I3OXARzKUBhY67s.jpg
tags:
     - JavaScript
---


{% note info no-icon %}
参考阮一峰的博客：[Node.js 如何处理 ES6 模块](http://www.ruanyifeng.com/blog/2020/08/how-nodejs-use-es6-module.html)
{% endnote %}

## 概述

之前在开发中遇到了一个问题，webpack的配置文件里需要引入业务代码中的一个变量（文件路径等），但是webpack的配置文件用的是 Node.js 的 CommonJS 模块语法，而业务代码中用的是ESM（ES6 module）模块语法，这两种模块不兼容，不能直接用对应的模块导入语法导入。

在完成了业务需求之后，找时间梳理了一下 Node.js 的常用模块语法：CommonJS 和 ESM。

<br/>


## 两种模块语法介绍

### CommonJS 模块

1. CommonJS 模块使用require()加载和module.exports输出

2. require()是同步加载，后面的代码必须等待这个命令执行完，才会执行

3. 对于**基本类型**的值，commonJS输出的是一个值的拷贝，一旦输出一个值（该值会被缓存起来），模块内部的变化就不会影响到拷贝；但是对于**引用类型**的值，commonJS输出的是一个引用的拷贝，模块内部的变化（变量属性的变化）会影响到拷贝

```JavaScript
// /CommonJsModule/module1.js
module.exports = {
    key: 123,
    name: 'commonjs'
}
```

```JavaScript
// /CommonJsModule/main.js
const module1 = require('./module1')
console.log(module1) // { key: 123, name: 'commonjs' }
```


### ES6 模块

1. ESM 使用import和export

2. import命令则是异步加载，或者更准确地说，ES6 模块有一个独立的静态解析阶段，依赖关系的分析是在那个阶段完成的，最底层的模块第一个执行

3. ESM 输出的是同一个引用，不管基本类型还是引用类型，模块内部的变化就会影响到每一处模块引入的地方

```JavaScript
// /ESModule/module1.mjs
const key = 132
const name = 'ESM'

export {
    key,
    name,
}
```

```JavaScript
// /ESModule/main.mjs
import { key, name } from './module1.mjs'
console.log(key, name) // 132 ESM
```

<br/>


## Node.js如何区分两种模块

1. .mjs文件总是以 ES6 模块加载，.cjs文件总是以 CommonJS 模块加载

2. .js文件默认以 CommonJS 模块加载

3. 如果希望 .js 文件以 ES6 模块加载，可以在项目的package.json文件中，指定type字段为module

```json
{
   "type": "module"
}
```

<br/>


## 两种模块之间如何相互加载

### CommonJS 模块加载 ES6 模块

CommonJS 的require()命令不能加载 ES6 模块，会报错，只能使用import()这个方法加载

```JavaScript
// /CommonJsModule/main.js
(async () => {
    const esmModule = await import('../ESModule/module1.mjs');
    console.log(esmModule) // { key: 132, name: 'ESM' }
})()
```

{% note info no-icon %}
require()不支持 ES6 模块的一个原因是，它是同步加载，而 ES6 模块内部可以使用顶层await命令，导致无法被同步加载
{% endnote %}

### ES6 模块加载 CommonJS 模块

ES6 模块的import命令可以加载 CommonJS 模块，但是只能整体加载，不能只加载单一的输出项。

```JavaScript
// /ESModule/main.mjs
import commonjsModule from '../CommonJsModule/module1.js'
console.log(commonjsModule) // { key: 123, name: 'commonjs' }

// error
// import { key, name } from '../CommonJsModule/module1.js';
```

{% note info no-icon %}
上文我们说过，import的模块需要静态分析，所以不能用于动态加载。因此，引入了import()函数，返回一个Promise对象。
{% endnote %}
