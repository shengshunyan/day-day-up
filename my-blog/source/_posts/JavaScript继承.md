---
title: JavaScript继承
date: 2018-10-08
categories: "JavaScript"
tags: 
     - JavaScript
     - 博客
---

1. 组合继承：ES5中常见的继承方式，利用构造函数和prototyoe属性实现
```JavaScript
function Super(){
    this.flag = true;
}
Super.prototype.getFlag = function(){
    return this.flag;
}
function Sub(){
    this.subFlag = false;
    Super.call(this);
}
Sub.prototype = new Super(); // Super后面加不加括号，结果一样
Sub.prototype.getSubFlag = function() {
    return this.subFlag;
}
var obj = new Sub();
console.log(obj.getSubFlag());
```
<!-- more -->
2. ES6 class继承：利用ES6的class语法糖实现继承，和ES5中的实现的继承很相似；提供了new.target和super的接口；
```JavaScript
class Super {
    constructor() {
        this.flag = true;
    }
    getFlag() {
        return this.flag;
    }
}
class Sub extends Super {
    constructor() {
        super();
        this.subFlag = false;
    }
    getSubFlag() {
        return this.subFlag;
    }
}
var obj = new Sub();
console.log(obj.getSubFlag());
```
3. JavaScript继承本质 无类继承：JavaScript实现的是基于原型的继承方式，不是方法/属性的复制，而是委托，所以称为对象委托感觉更为合适，对象都是属性包；
```JavaScript
const father = {
    flag: true,
    getFlag() {
        return this.flag;
    },
};
const child = {
    childFlag: false,
    getAllFlag() {
        return this.childFlag;
    },
};
Object.setPrototypeOf(child, father);
console.log(child.getAllFlag());
```