---
title: JavaScript之函数式编程
date: 2018-10-25
categories: "JavaScript"
tags: 
     - JavaScript
     - 博客
---

1. 纯函数：无副作用(不改变参数，不依赖环境，不进行请求，I/O操作)；如map, slice等；
2. 声明式代码
```JavaScript
// 命令式
const makes = [];
for (let i = 0; i < cars.length; i++) {
  makes.push(cars[i].make);
}
// 声明式
const makes = cars.map(function(car){ return car.make; });
```
<!-- more -->
3. 函数柯里化
```JavaScript
// 普通写法
const add = function(x, y) {
    return x + y;
}
// curry
const addCurry = x => y => (x + y);
const addTen = addCurry(10);
const num = addTen(1);
```
4. 函数组合
```JavaScript
const toUpperCase = x => x.toUpperCase();
const exclaim = x => x + '!';
// 普通
const shout = x => exclaim(toUpperCase(x));
console.log(shout('what happened!'));
// 函数组合
const compose = (...funcList) => x => funcList.reduce((pre, cur) => cur(pre), x);
const shoutCompose = compose(toUpperCase, exclaim);
console.log(shoutCompose('what happened!'));
```
5. Point Free：函数无须提及将要操作的数据是什么样的
```JavaScript
// 非 pointfree，因为提到了数据：word
const snakeCase = function (word) {
  return word.toLowerCase().replace(/\s+/ig, '_');
};
// pointfree
const snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase);
```