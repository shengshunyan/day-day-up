---
title: JavaScript之new和bind
date: 2018-10-22
categories: "JavaScript"
tags: 
     - JavaScript
     - 博客
---

1. new实现的功能: 
    1. 返回一个返回对象的函数；
    2. 返回对象的原型链(__proto__)链上构造函数的prototype；
    3. 利用apply给构造函数指定this引用；
```JavaScript
function _new(fn){
    return function() {
        var o = { '__proto__': fn.prototype };
        fn.apply(o, arguments);

        return o;
    };
}

function Person(name) {
    this.name = name;
}
const person = _new(Person)('aa');
console.log(person);
```
<!-- more -->
2. bind实现的功能：
    1. 返回一个绑定了上下文(context)的函数；
    2. 利用apply达到绑定的目的；
    3. 考虑new调用bind返回的函数(稍复杂)；
```JavaScript
Function.prototype._bind = function(context) {
    var self = this; // self是函数
    var args = Array.prototype.slice.call(arguments, 1);
    var fbound = function() {
        var bindArgs = Array.prototype.slice.call(arguments);
        // 平常调用时，环境为context
        // new 构造函数方式调用时，这环境指向this
        self.apply(this instanceof self ? this : context, args.concat(bindArgs));
    }
    // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承函数的原型中的值
    fbound.prototype = this.prototype;
    return fbound;
}

const foo = {
    value: 1
};
function bar() {
    console.log(this.value);
}
const bindFoo = bar.bind(foo); 
bindFoo(); // 1
```