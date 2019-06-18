---
title: JavaScript之函数柯里化
date: 2018-11-12
categories: "JavaScript"
tags: 
     - JavaScript
     - 博客
---

### 概念
1. 柯里化是指这样一个函数(假设叫做createCurry)，他接收函数A作为参数，运行后能够返回一个新的函数。并且这个新的函数能够处理函数A的剩余参数。
### 简单场景下的柯里化
```JavaScript
function add(a, b, c) {
    return a + b + c;
}
add(1, 2, 3);

// 函数自身实现柯里化
function _add(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        }
    }
}
_add(1)(2)(3);
```
<!-- more -->
### 通用函数柯里化的实现(createCurry):
1. 思路
    1. 柯里化函数的运行过程其实是一个参数的收集过程，我们将每一次传入的参数收集起来，并在最里层里面处理。
    2. func有一个length属性，表示函数定义时所需参数个数；
    3. 通过函数的length属性判断合适停止收集参数，返回计算结果；
2. 实现：
```JavaScript
function createCurry(func, args) {
    var argsLength = func.length;
    var args = args || [];

    return function() {
        var _args = [].slice.apply(arguments);
        [].push.apply(_args, args);

        if (_args.length >= argsLength) {
            return func.apply(null, _args);
        }
        return createCurry(func, _args);
    }
}

function add(a, b, c) {
    return a + b + c;
}
const _add = createCurry(add);
_add(1)(2)(3);
```
### 无限柯里化
1. 问题：实现一个add方法，使计算结果能够满足如下预期
```JavaScript
add(1)(2)(3) = 6;
add(1, 2, 3)(4) = 10;
add(1)(2)(3)(4)(5) = 15;
```
2. 思路：
    1. 函数的隐式转换：当我们直接将函数参与其他的计算时，函数会默认调用valueOf/toString方法，直接将函数体转换为字符串参与计算；
    2. 当我们同时重写函数的toString方法与valueOf方法时，最终的结果会取valueOf方法的返回结果；
3. 实现：
```JavaScript
function unlimitedAdd() {
    var args = [].slice.call(arguments);

    var adder = function() {
        var _adder = function() {
            args.push(...arguments);
            return _adder;
        }
        _adder.toString = function() {
            return args.reduce(function(a, b) {
                return a + b;
            })
        }

        return _adder;
    }

    return adder(...args);
}

console.log(unlimitedAdd(1)); // f 1
console.log(unlimitedAdd(1)(2)); // f 3
console.log(unlimitedAdd(1)(2)(3)); // f 6
```
