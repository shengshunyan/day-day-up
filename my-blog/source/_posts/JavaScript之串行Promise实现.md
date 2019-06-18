---
title: JavaScript之串行Promise实现
date: 2018-10-30
categories: "JavaScript"
tags: 
     - JavaScript
     - 博客
---

1. 问题：Promise原生语法，then的链式调用实现的promise串行执行不太语义化(声明式)，语法稍微有点繁杂；
```JavaScript
new Promise((resolve, reject) => {
    // Promise #1
    resolve();
})
    .then(result => {
        // Promise #2
        return result;
    })
    .then(result => {
        // Promise #3
        return result;
    });
```
<!-- more -->
2. 解决方法：a. reduce；b. async/await；
```JavaScript
// 1. reduce
const runPromiseByQueue = (promises) => {
    promises.reduce(
        (previousPromise, nextPromise) => previousPromise.then(() => nextPromise()),
        Promise.resolve()
    )
}

// 2. async/await
const runPromiseByQueue = async(promises) => {
    for (let elem of promises) {
        await elem();
    }
}

// 使用
function createPromise(time, id) {
    return () => new Promise(resolve => 
        setTimeout(() => {
            console.log('promise ', id);
            resolve();
        }, time)    
    )
}
runPromiseByQueue([
    createPromise(300, 1),
    createPromise(200, 2),
    createPromise(100, 3),
])
```