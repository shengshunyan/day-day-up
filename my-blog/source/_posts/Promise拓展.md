---
title: Promise拓展
date: 2021-04-15
keywords: JavaScript, promise
cover: https://i.loli.net/2021/04/15/VTELZAo4COiem3r.png
tags:
     - JavaScript
---


## 背景

Promise是JavaScript的内置对象，一般用于包装异步请求，再配合async/await语法，可以让代码可读性更好。

Promise也是前端面试的必考题。作为一名前端开发人员，有必要更深入理解Promise的内部运行机制，以及做相关的功能拓展。

<br/>


## Promise

Promise 对象用于表示一个异步操作的最终完成 (或失败)及其结果值。

romise 首先是一个对象，它通常用于描述现在开始执行，一段时间后才能获得结果的行为（异步行为），内部保存了该异步行为的结果。然后，它还是一个有状态的对象：

 - pending：待定
 - fulfilled：兑现，有时候也叫解决（resolved）
 - rejected：拒绝

一个 Promise 只有这 3 种状态，且状态的转换过程有且仅有 2 种：

 - pending 到 fulfilled
 - pending 到 rejected

因为 Promise.prototype.then 和  Promise.prototype.catch 方法返回的是 promise， 所以它们可以被链式调用。

![promises.png](https://i.loli.net/2021/04/15/VTELZAo4COiem3r.png)

可以通过如下的 Promise 对象构造器来创建一个 Promise：

```JavaScript
let promise = new Promise((resolve, reject) => {})
```

<br/>


## Promise的简单实现

### 要求

实现一个_Promise构造函数，满足一下代码的使用需求

```JavaScript
const getData = new _Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('data')
        // reject('error')
    }, 1000)
})

getData
    .then(res => {
        console.log(res)
    }, error => {
        console.log(error)
    })
```

### 实现

```JavaScript
class _Promise {
    constructor(fn) {
        /**
         * state promise状态
         * onFullFilled 兑现之后的回调函数
         * onRejected 拒绝之后的回调函数
         */
        this.state = 'pending'
        this.onFullFilled = null
        this.onRejected = null

        fn(this.resolve, this.reject)
    }

    then = (onFullFilled, onRejected) => {
        this.onFullFilled = onFullFilled
        this.onRejected = onRejected
    }

    resolve = data => {
        this.state = 'fullFilled'
        this.onFullFilled(data)
    }

    reject = error => {
        this.state = 'rejected'
        this.onRejected(error)
    }
}
```

<br/>


## Promise.all的简单实现

### 要求

实现一个Promise._all函数，满足一下代码的使用需求

```JavaScript
const promise1 = new Promise((resolve, reject) => {
    resolve(1);
    // reject(1);
});
const promise2 = new Promise((resolve, reject) => {
    resolve(2);
});
const promise3 = new Promise((resolve, reject) => {
    resolve(3);
});

Promise._all([promise1, promise2, promise3])
    .then(res => {
        console.log(res);
    }, error => {
        console.log(error)
    })
```

### 实现

```JavaScript
Promise._all = promises => {
    const resList = []
    let count = 0

    return new Promise((resolve, reject) => {
        promises.forEach((item, index) => {
            item
                .then(res => {
                    count++
                    resList[index] = res
                    if (count === promises.length) {
                        resolve(resList)
                    }
                }, error => {
                    reject(error)
                })
        })
    })
}
```

<br/>


## Promise并发限制

### 要求

我们在需要保证代码在多个异步处理之后执行,我们通常会使用

```JavaScript
Promise.all(promises: []).then(fun: function);
```

Promise.all可以保证，promises数组中所有promise对象都达到resolve状态，才执行then回调

那么会出现的情况是，你在瞬间发出几十万http请求（tcp连接数不足可能造成等待），或者堆积了无数调用栈导致内存溢出

这个时候需要我们对HTTP的连接数做限制。

```JavaScript
const urls = [
    'bytedance.com',
    'tencent.com',
    'alibaba.com',
    'microsoft.com',
    'apple.com',
    'hulu.com',
    'amazon.com',
]
const requestFn = url => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`任务${url}数据`)
        }, 1000)
    })
}
const promiseProducers = urls.map(item => requestFn.bind(null, item))

// 最大并发数3
const pool = new PromisePool(promiseProducers, 3)
pool.start()
    .then(res => {
        console.log(res)
    })
```

### 实现

```JavaScript
class PromisePool {
    constructor(promiseProducers, limit) {
        /**
         * promiseProducers promise生产者列表
         * limit 最大并发数
         * res 请求返回数据
         * index 目前发起请求的index
         * sum promise个数
         * count promise成功个数
         * resolve 全部promise成功之后的要执行的函数
         */
        this.promiseProducers = promiseProducers
        this.limit = limit
        this.res = []
        this.index = limit - 1
        this.sum = promiseProducers.length
        this.count = 0
        this.resolve = null
    }

    // 启动并发请求
    start() {
        const curPromiseProducers = this.promiseProducers.splice(0, this.limit)
        curPromiseProducers.forEach((item, index) => {
            this.runTask(item, index)
        })

        return new Promise(resolve => {
            this.resolve = resolve
        })
    }

    // 单个请求
    runTask(promiseProducer, index) {
        promiseProducer().then(res => {
            this.res[index] = res
            this.count++

            if (this.promiseProducers.length > 0) {
                this.index++
                this.runTask(this.promiseProducers.shift(), this.index)
            }

            if (this.count === this.sum) {
                this.resolve(this.res)
            }
        })
    }
}
```

<br/>