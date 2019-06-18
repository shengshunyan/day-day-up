---
title: ES6 note
date: 2018-06-03
categories: "ES6教程"
tags: 
     - JavaScript
     - 读书笔记
---
阮一峰版ES6入门的一些阅读笔记！

# 第一章 简介
1. const
2. 解构赋值：函数*2、JSON、遍历
3. 字符串拓展：模板字符串
4. 正则拓展：先行断言、后行断言；具名组匹配
5. 数值拓展：EPSILON；**指数运算符
6. 函数拓展：默认参数、rest参数、箭头函数、尾调用优化

<!-- more -->

# 第二章：let和const命令
1. 块级作用域中声明函数应用函数表达式，而不是函数声明语句；
```JavaScript
-推荐-
{
    let f = function(){
        return 1;
    }
}

-不推荐-
{
    function f(){
        return 1;
    }
}

```
2. let、const、class命令声明的全局变量不属于顶层对象的属性；

```JavaScript
let b = 1;
window.b //undefined
```
3. 默认全用 const，只有该变量需要被重新赋值才用 let （实际代码中用到 const 的几率大概会是 95%）

# 第三章：变量的结构赋值
1. 数组的结构赋值
```JavaScript
let [x, , y] = [1, 2, 3];
x //1
y //3

// 默认值
let [x, y = 'b'] = ['a'];
x //'a'
y //'b'
```
2. 对象的解构赋值
```JavaScript
let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
foo //'aaa'
bar //'bbb'

// 模式-变量
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz //'aaa'
foo //error: foo is not defined

// 默认值
let { x, y = 5 } = { x: 1 };
x //1
y //5
```
3. 字符串的解构赋值
```JavaScript
const [a, b, c, d, e] = 'hello';
a //'h'
b //'e'
```
4. 函数的解构赋值
```JavaScript
function move({x = 0, y = 0}){
    return [x, y];
}
move({x: 3, y: 8}); //[3, 8]
move({x: 3}); //[3, 0]
move({}); //[0, 0]
move(); //error
```
5. 应用
```JavaScript
// 1.交换变量的值
let x = 1;
let y = 2;
[x, y] = [y, x];

// 2.函数返回多个值
function example(){
    return {
        foo: 1, 
        bar: 2,
    };
}
let {foo, bar} = example();

// 3.函数参数
function f({x, y, z}) {...}
f({z:3, y:2, x:1});

// 4.提取JSON数据
let jsonData = {
    id: 42,
    status: 'ok',
    data: [888, 666]
}
let {id, status, data: number} = jsonData;

// 5.遍历Map结构
var map = new Map();
map.set('first', 'hello');
map.set('second', 'world');
for (let [key, value] of map) {
    console.log(key + ' is ' + value);
}
```

# 第四章：字符串的拓展
1. includes(), startsWith(), endsWith();
2. 字符串补全：(金额、科学计数)
```JavaScript
'x'.padStart(5, 'ab'); //'ababx'
'x'.padEnd(5, 'ab'); //'xabab'
```
3. 模板字符串： \`hell0 ${world}\`
    1. 模板字符串中用到 \` 需要反斜杠转义  \\`；
    2. 空格和换行都会被保留，用trim()可以去除；
    3. ${}中能放变量、表达式、调用函数；
    4. 模板字符串可以嵌套；
    5. 标签模板功能（详细看P62）
    ```
    var a = 5,
        b = 10;
    tag`Hello ${a + b} world ${a * b}`;
    // 等同于
    tag(['Hello', 'world', ''], 15, 50);
    ```

# 第五章：正则的拓展
1. [先行断言和后行断言](http://blog.csdn.net/u012047933/article/details/38365541)
```JavaScript
// 先行断言
/\d+(?=%)/.exec('100% if US persidents have been male')  // ["100"]
// 先行否定断言
/\d+(?!%)/.exec('100 if US persidents have been male')  // ["100"]

// 后行断言
/(?<=\$)\d+/.exec('Beijamin Franklin is on the $100 bill.')  // ['100']
// 后行否定断言
/(?<!\$)\d+/.exec('Beijamin Franklin is on the *100 bill.')  // ['100']
```
2. 具名组匹配
```JavaScript
// 原先
const RE_DATE = /(\d{4})-(\d{2})-(\d{2})/;
const matchObj = RE_DATE.exec('1999-12-31');
const year = matchObj[1];  //1999
const month = matchObj[2];  //12
const day = matchObj[3];  //31

// 新属性
const RE_DATE = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const matchObj = RE_DATE.exec('1999-12-31');
const year = matchObj.groups.year;  //1999
const month = matchObj.groups.month;  //12
const day = matchObj.groups.day;  //31
// 应用----------------------------------------------------------------
// 1.日期替换
const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
'2015-01-02'.replace(re, '$<day>/$<month>/$<year>'); //'02/01/2015'
// 2.重复匹配 (匹配引用)
const re = /^(?<word>[a-z]+)!\k<word>!\1$/;
re.test('abc!abc!abc'); //true
```

# 第六章：数值的拓展
1. 二进制和八进制的表示法：0b(或0B)   0o(或0O)
```JavaScript
0b111110111 === 503 
0o767 === 503
```
2. Number.EPSILON 一个很小的数值，是一个可以接受的误差范围（两个值的差小于这个值，即可视为相等）;
3. 指数运算符：
```JavaScript
2 ** 3 = 8
a **= 2;  //等同于 a = a * a;
```

# 第七章：函数的拓展
1. 参数默认值
```JavaScript
// a.
function log(x, y = 'world') {
    console.log(x, y);
}
log('hello');   // hello world
// b.解构赋值-双重默认
function fetch(url, {method = 'GET'}) {
    cnosole.loh(method);
}
fetch('www.baidu.com', {}); //GET
fetch('www.baidu.com'); //报错
function fetch(url, {method = 'GET'} = {}) { //改进-双重默认
    console.log(method);
}
fetch('www.baidu.com'); //GET
// c.非尾部参数设置默认值，实际上这个参数是不能省略的
function(x = 1, y) {
    return [x, y];
}
f( , 1) // 报错
f(undefined, 1) // [1, 1]
// c.作用域： 函数外作用域 -> 函数默认值作用域 -> 函数内作用域
// d.指定一个函数可以省略，可以给赋默认值为undefined；不可省略，可以给默认赋值执行一个报错函数，来提醒开发者此参数不可省略；
```
2. rest参数 (可替代函数中的arguments变量)
```JavaScript
funciton add (...value) {
    let sum = 0;
    for (var val of values) {
        sum += val;
    }
    
    return sum;
}
add(2, 5, 3) //10
// rest之后不能由其他参数，不然会报错
```
3. 箭头函数  
[使用注意事项](http://www.zcfy.cc/article/when-not-to-use-arrow-functions-482.html)
```JavaScript
// a.
var sum = (num1, num2) => {
    return num1 + num2;
}
// b. 注意事项
//  1. this指向定义时所在的对象，而不是使用时所在的对象；
//  2. 不可用于构造函数；
//  3. 没有arguments对象，用rest参数替代；
//  4. 不可使用yield命令，不能用作Generator函数
// 实际上，箭头函数内部根本没有自己的this
// ES6
function foo() {
    setTimeout(() => 
        console.log(this.id);
    }, 100);
}
// ES5
function foo() {
    var _this = this;
    
    setTimeout(function(){
        console.log(_this.id);
    }, 100)
}
```
4. 绑定this（浏览器未支持，Babel转码器已支持）  
在箭头函数不适用的场景，用来替代call、apply、bind的写法；
```JavaScript
// a.
foo::bar //等同于 bar.bind(foo)
foo::bar(a) //等同于 bar.apply(foo, a)
foo::bar //等同于 bar.bind(foo)
// b. 双冒号运算符返回的是原对象，因此可以链式调用
document.querySelectorAll('div.maClass')
::find('p')
::html('hahaha');
```
5. 尾调用  (尾调用只在严格模式下才开启，正常模式下无效)
    1. 尾调用——优化 
    ```JavaScript
    // 普通函数
    function a() {
        let a = 1;
        func();
    }
    // 尾调用函数
    function a() {
        let a = 1;
        return func();
    }
    尾调用函数调用栈中的调用帧更少，节省内存；
    ```
    2. 尾递归
    ```JavaScript
    // 普通递归
    function factorial(n) {
        if (n === 1) return 1;
        return n * factorial(n - 1);
    }
    // 尾递归
    function factorial(n, total = 1) { // 给个默认值
        if (n === 1) return total;
        return n * factorial(n - 1, n * total);
    }
    普通递归计算n的阶乘，最多需要保存n个调用记录，复杂度为O(n);
    而尾递归，只保留一个调用记录，复杂度为0(1);
    普通递归容易造成堆栈溢出，而ES6中，尾调用不会发生栈溢出，相对节省内存；
    ```
6. 函数参数的尾逗号
```JavaScript
// ES6中最后的参数后加逗号，不会报错
function func(param1, param2,){//...};
```
# 第八章：数组的拓展
1. 拓展运算符 ... 三个点，将一个数组转化为用逗号分隔的参数序列；
```JavaScript
// a.替代数组apply 方法
// ES5写法
var arr1 = [1, 2, 3];
var arr2 = [1, 2, 3];
Array.prototype.push.apply(arr1, arr2);
// ES6写法
var arr1 = [1, 2, 3];
var arr2 = [1, 2, 3];
arr1.push(...arr2);
// 更简洁
var arr1 = [1, 2, 3];
var arr2 = [1, 2, 3];
arr1 = [...arr1, ...arr2];
```
2. Array.from() 用于将两类对象转化为正真的数组：类似数组的对象和可遍历对象
3. 数组遍历的keys()、values()、entries()
```JavaScript
var arr = [1, 2, 3];
for (let index of arr.keys()){
   console.log(index);
}
for (let elem of arr.values()){
   console.log(elem);
}
for (let [index, elem] of arr.entries()){
   console.log(index, elem);
}
```
4. includes()
```JavaScript
[1, 2, 3].includes(2)  //true
```
5. ES6明确将数组空位转为undefined  
Array.from()和拓展运算符(...)都会把空位转化为undefined

# 第九章：对象的拓展
1. 属性的简介表示法
```JavaScript
var birth = '2000/01/01';
var person = {
   name: 'zhangsan',
   // 等同于birth: birth
   birth,
   // 等同于 hello: function ()...
   hello() {
       console.log('我的名字');
   }
}
```
2. 属性名表达式 (对象中可用变量定义属性)
```JavaScript
var str = 'name';
var person = {
   [str]: 'dingding',
   ['say' + str]: function() {
       console.log('my name');
   }
}
```
3. Object.assign (浅复制)
```JavaScript
var target = {a: 1},
   source1 = {b: 2},
   source2 = {c: 3};

Object.assign(target, source1, source2);
console.log(target); //Object {a: 1, b: 2, c: 3}
```
4. for...in循环会遍历自身的和继承的可枚举属性，而Object.keys()只会返回自身的可枚举属性。所以尽量用Object.keys()来遍历对象；
```JavaScript
let {keys, values, entries} = Object;
let obj = {a: 1, b: 2, c: 3};

for (let key of keys(obj)) {
    console.log(key); // a, b, c
}
for (let value of values(obj)) {
    console.log(value); //1, 2, 3
}
for (let [key, value] of entries(obj)) {
    console.log([key, value]); //[a, 1], [b, 2], [c, 3]
}
```
5. 避免用__proto__去操作对象的原型，尽量使用Object.getPrototypeOf()和Object.setPrototypeOf()来获取和操作对象的原型；
6. 对象拓展运算符（浅复制）
```JavaScript
let {x, y, ...z} = {x: 1, y: 2, a: 3, b: 4};
x; //1
y; //2
z; //{a:3, b:4}
// 克隆对象
let aClone = {...a};
// 等同于
let aClone = Object.assign({}, a);
// 合并对象
let ab = {...a, ...b};
// 等同于
let ab = Object.assign({}, a, b);
```
7. 查询对象属性的描述对象
```JavaScript
// 返回对象某个属性的描述对象
Object.getOwnPropertyDescriptor(obj, 'a');
// Object {value: 1, writable: true, enumerable: true, configurable: true}
// 返回对象自身的所有属性的描述对象
Object.getOwnPropertyDescriptors(obj);
```
8. Null传导运算符 ?. ——提案
```JavaScript
// ES5 写法 
const firstName = (message && message.body && message.body.user) || 'default';
// ES6 写法
const firstName = message?.body?.user || 'default';
```

# 第十章：Symbol
1. 定义、使用
```JavaScript
let s = Symbol();
let s1 = Symbol('foo');

s1.toString(); // "Symbol(foo)"
var a = {
    [s]: 'Hello',
}
```
2. 消除魔术字符串
```JavaScript
// ES5
var shapeType = {
    triangle: 'Triangle',
};
// ES6
const shapeType = { // shapeType.triangle等于哪个值并不重要，只要确保不会和其他shapeType的值冲突即可
    triangle: Symbol(),
}

function getArea(shape, options) {
    var area = 0;
    switch (shape) {
        case shapeType.triangle:
            area = .5 * options.width * options.height;
            break;
    }
    return area;
}
```
3. Symbol.for()接受一个字符串为参数，搜索有没有以该参数为名称的Symbol值，如果有，则返回这个Symbol值；否则返回一个以该字符串为名称的Symbol值。
```JavaScript
var a = Symbol('str');
var b = Symbol.for('str');
var c = Symbol.for('str');
a === b // false
b === c // true
```

# 第十一章：Set和Map数据结构
1. Set: 类似数组，但成员值都是唯一的。
```JavaScript
const set = new Set([1, 2, 3, 4, 4]);
[...set]  //[1, 2, 3, 4] 可用于数组去重

// 方法
const s = new Set();
s.size //0
s.add(1);
s.has(1); //true
s.delete(1);

// 遍历 key和value返回的都是一样的，因为set的key、value是一样的
for (let item of set.keys()) {
    console.log(item);
}
for (let item of set.values()) {
    console.log(item);
}
for (let item of set.entries()) {
    console.log(item);
}
set.forEach( (value, key) => console.log(value * 2) );
set = new Set( [...set].map(x => x * 2) );
set = new Set( [...set].filter( x => (x % 2) == 0) );
```
2. Map: 键值对的集合，和Object的区别是：key不仅仅是字符串，各种类型的值都可以作为键值。
```JavaScript
// 方法和set的差不多
const map = new Map([
    ['name', '张三'],
    ['title', 'Author']
]);
const o = {p: 'Hello world'};
map.set(o, 'content');
map.get(o);
map.has(o);
map.delete(o);

// weakMap在事件监听防止内存泄露上的应用
const listerner = new WeakMap();
listerner.set(element1, handler1);
listerner.set(element2, handler2);
// 一旦DOM对象消失，与它绑定的监听函数也会自动消失，避免了内存泄露
element1.addEventListener('click', listerner.get(element1), false);
element2.addEventListener('click', listerner.get(element2), false);
```

# 第十二章：Proxy
1. Proxy用于修改某些操作的默认行为，等同于在语言层面做出修改，对编程语言进行编程。
```JavaScript
var proxy = new Proxy(target, handler);
```
2. 应用实例（除了get()和set()还有其他方法可以拦截，祥见书本...）
```JavaScript
// 1. get(): 拦截某个属性的读取操作
// 实现数组读取负数索引
function createArray(...elements) {
    let handler = {
        get(target, propKey, receiver) {
            let index = Number(propKey);
            if (index < 0) {
                propKey = String(target.length + index);
            }
            return Reflect.get(target, propKey, receiver);
        }
    };
    let target = [];
    target.push(...elements);
    return new Proxy(target, handler);
}

let arr = createArray('a', 'b', 'c');
// console.log(arr[-1]); //c

// 2. set(): 拦截某个属性的复制操作
// 属性存储的值检验
let validator = {
    set: function(obj, prop, value) {
        if (prop === 'age') {
            if (!Number.isInteger(value)) {
                throw new TypeError('The age is not an interger.');
            }
            if (value > 200) {
                throw new TypeError('The age seems invalid.');
            }
        }

        // 对于age以外的属性，直接保存
        obj[prop] = value;
    }
};

let person = new Proxy({}, validator);
person.age = 100;
console.log(person.age); //100
person.age = 201; // 报错

// set实现数据绑定
<body>
    <h1 class="title" onclick="tella();">I am h1 !</h1>
    <h1 class="a" data-var="obj.a">-</h1>
    <h1 class="b" data-var="obj.b">-</h1>
    <script type="text/javascript">

        $(function () {
            // 2. set(): 拦截某个属性的复制操作
            // 属性存储的值检验
            let validator = {
                set: function (obj, prop, value) {
                    $(`[data-var="${obj.name}.${prop}"]`).text(value);
                    obj[prop] = value;
                }
            };

            let obj = new Proxy({
                name: 'obj',
                a: 1,
                b: 2,
            }, validator);

            $('.a').on('click', function () {
                obj.a++;
            })
            $('.b').on('click', function () {
                obj.b++;
            })
        })
    </script>

</body>
```

# 第十三章：Reflect
1. 概述：
    1. 将Object对象的一些明显属于语言内部的方法放到Reflect对象上。未来的新方法只在Reflect对象上部署。
    2. 修改某些Objct方法的返回结果，变得更合理。
    3. 让Object操作都变成函数行为。
    4. Reflect对象的方法与Proxy对象的方法一一对应，这就使得Proxy对象可以方便调用对应的Reflect方法来完成默认行为
2. 观察者模式
```JavaScript
function observable(obj, func) {
    const queueObservers = new Set();
    queueObservers.add(func);
    const newObj = new Proxy(obj, {set});

    function set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver);
        queueObservers.forEach(observer => observer.call(obj));
        return result;
    }

    return newObj;
}

const obj1 = {
    name: '张三',
    age: 20
};
function print() {
    console.log(`${this.name}, ${this.age}`);
}
const obj2 = observable(obj1, print);
obj2.name = '李四'; //打印 李四, 20
```

# 第十四章：Promise
1. 基本用法
```JavaScript
// 1. 基本用法
var promise = new Promise(function(resolve, reject) {
    // ... some code 

    if (/* 异步操作成功 */) {
        resolve(value);
    } else {
        reject(error);
    }
});

promise.then(function(value) {
    //success
}, function(error) {
    //failure
});

// 2. 链式调用
// bad
getJSON("/post/1.json")
    .then(
        post => getJSON(post.commentURL)
    )
    .then(
        comments => console.log("Resolved: ", comments),
        err => console.log("Rejected: ", err)
    )
// good
getJSON("/post/1.json")
    .then(
        post => getJSON(post.commentURL)
    )
    .then(
        comments => console.log("Resolved: ", comments)
    )
    .catch(
        err => console.log("Rejected: ", err)
    )
    
// 3. Promise.all 方法的参数不一定是数组，但是必须具有Iterator接口
var p = Promise.all([p1, p2, p3]);

var promises = [2, 3, 4, 5, 11].map(function(id) {
    return getJSON('/post/' + id + ".json");
});
Promise.all(promises).then(function(posts) {
    // ...
}).catch(function(reason) {
    //...
});
// 4. Promise.race 方法的参数不一定是数组，但是必须具有Iterator接口
var p = Promise.race([p1, p2, p3]);
```
2. 
Promise.resolve(): 将现有对象转为Promise()对象
```JavaScript
Promise.resolve('foo');
// 等价于
new Promise(resolve => resolve('foo'))
```
Promise.reject(): 也会返回一个新的Promise对象，状态为rejected
```JavaScript
Promise.reject('出错了');
// 等价于
new Promise((resolve, reject) => reject('出错了'))
```
3. 附加方法
```JavaScript
// 1. finally
Promise.prototype.finally = function(callback) {
    let p = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback().then(() => { throw reason }))
    );
};
server.listen(0)
    .then(function() {
        // run test
    })
    .finally(server.stop);
```
4. Promise.try()：（目前一个提案）

# 第十五章：Iterator和for...of循环
1. 概念：  
    1. Iterator(遍历器)的作用：为各种数据提供一个统一的、简便的访问接口；供for...of消费；
    2. 每次调用next()方法都会返回一个包含value和done两个属性的对象；
    3. 默认的Iterator接口部署在数据结构的Symbol.iterator属性
    4. 具备原生Iterator接口的数据结构：Array, Map, Set, String, 函数的arguments对象, NodeList对象;
2. Iterator接口与Generator函数
```JavaScript
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
};
console.log([...myIterable]); //[1, 2, 3]
```
3. 遍历器对象除了具有next()方法外，还具有return()和throw()方法。  
return()方法: 用于for...of循环提前退出（通常是因为出错，或者有break语句或者continue语句），return()方法必须返回一个对象；  
4. for...of循环
    1. 数组: for (let elem of array)
    2. Set: for (let elem of set)
    3. Map: for (let [key, value] of Map)  
    4. 对于类数组对象，可以先Array.from(arrayLike)转为数组，再遍历；
    5. 一般对象Object: for (let [key, value] of Object.entires(object))
5. for...of与其他遍历语法的比较
    1. for (var index = 0; index < length; index++): 繁琐
    2. JS为数组提供的forEach: 中途无法跳出forEach循环
    ```JavaScript
    myArray.forEach(element => {
        console.log(element);
    });
    ```
    3. for...in循环: 遍历以字符串作为键名；会遍历原型链上的键；会以任意顺序遍历键；

# 第十六章：Generator函数的语法
1. 基本概念
    1. Generator函数是状态机，是一个遍历器对象生成函数，函数生成的遍历器继承了Generator函数prototype对象上的方法；
    ```JavaScript
    function* generator() {
        yield 'hello';
        yield 'world';
        return 'ending';
    }
    var gen = generator();
    gen.next(); // {value: 'hello', done: false}
    gen.next(); // {value: 'world', done: false}
    gen.next(); // {value: 'ending', done: true}
    gen.next(); // {value: undefined, done: true}
    ```
    2. yield表达式只能在Generator函数上下文中；
    3. yield表达式如果用在；另一个表达式之中，必须放在括号内；
    ```JavaScript
    function* generator() {
        console.log('hello' + yield 123); // SyntaxError
        console.log('hello' + (yield 123)); // OK
    }
    ```
    4. yield语句本身没有返回值，或者说总是返回undefined。next方法可以带有一个参数，改参数会被当做上一条yield语句的返回值；
    ```JavaScript
    // yield能传出值，然后接受新值继续运算；
    function* foo(x) {
        var y = 2 * (yield (x + 1));
        return (x + y);
    }
    var gen = foo(5);
    console.log(gen.next()); // {value:6, done:false}
    console.log(gen.next(12)); // {value:29, done:true}
    ```
2. for...of循环
```JavaScript
// 原生的JS对象没有遍历接口，无法用for...of循环遍历，可以通过Generator函数为它加上这个接口
function* objectEntries() {
    let propKeys = Object.keys(this);
    for (let propKey of propKeys) {
        yield [propKey, this[propKey]];
    }
}

let jane = {first: 'Jane', last: 'Doe'};
jane[Symbol.iterator] = objectEntries;
for (let [key, value] of jane) {
    console.log(`${key}: ${value}`);
}
```
3. Generator函数与其他语法的关系
```JavaScript
function* numbers() {
    yield 1;
    yield 2;
    return 3;
    yield 4;
}
// a. 扩展运算符
[...numbers()] //[1, 2]
// b. Array.from方法
Array.from(numbers()) //[1, 2]
// c. 解构赋值
let [x, y] = numbers(); // x = 1, y = 2
// d. for...of循环
for (let n of numbers()) {
    console.log(n);
}// 1, 2
```
4. Generator.prototype.throw()
```JavaScript
var g = function* () {
    try { 
        yield ;
    } catch (e) {
        console.log('内部捕获', e);
    }
};
var i = g();
i.next();
try {
    i.throw('a');
    i.throw('b');
} catch (e) {
    console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b
// 第一个错误被Generator函数体内的catch语句捕获，i第二次抛出错误，由于Generator函数内部的catch已经执行过了，
// 所以这个错误就被抛出了函数体外，被函数体外的catch语句捕获
```
5. Genetator.prototype.return()  
return 方法可以返回给定的值，并终结Generator函数的遍历。
```JavaScript
function* gen() {
    yield 1;
    yield 2;
    yield 3;
}
var g = gen();
g.next(); // {value: 1, done: false}
g.return('foo'); // {value: 'foo', done: true}
g.next(); // {value: undefined, done: true}
```
6. yield*表达式
```JavaScript
function* foo() {
    yield 'a';
    yield 'b';
}

function* bar() {
    yield 'x';
    foo();
    yield 'y';
}
for (let v of bar()) {
    console.log(v); // 'x', 'y'
}

function* bar1() {
    yield 'x';
    yield* foo();
    yield 'y';
}
for (let v of bar()) {
    console.log(v); // 'x', 'a', 'b', 'y'
}

// 中序遍历二叉树（inorder）
// 祥见P341
function* inorder(t) {
    if (t) {
        yield* inorder(t.left);
        yield t.label;
        yield* inorder(t.right);
    }
}
```
7. Generator含义：a.状态机；b.协程；P345
8. 应用：1.异步操作；2.回调函数改写；3.部署Iterator接口；P347

# 第十七章：Generator函数的异步应用
1. 异步任务的封装(手动执行，不方便)
```JavaScript
var fetch = require('node-fetch');
function* gen() {
    var url = 'http://api.github.com/users/github';
    var result = yield fetch(url);
    console.log(result.bio);
}

var g = gen();
var rusult = g.next();
result.value.then(function(data) {
    return data.json();
}).then(function(data) {
    g.next(data);
});
```
2. Generator函数的自动流程管理
```JavaScript
// 1. Thunk函数实现自动流程管理
function run(fn) {
    var gen = fn();
    function next(err, data) {
        var result = gen.next(data);
        if(result.done) return ;
        result.value(next); //yield语句后面返回的必须是Thunk函数
    } 
    next();
}

var fs = require('fs');
var thunkify = require('thunkify'); //引入thunk库
var readFlieThunk = thunkify(fs.readFile);
var gen = function* () {
    var r1 = yield readFlieThunk('/etc/fstab');
    console.log(r1.toString());
    var r2 = yield readFlieThunk('/etc/shells');
    console.log(r2.toString());
}
run(gen);

// 2. 基于Promise对象的自动执行
function run(gen) {
    var g = gen();
    function next(data) {
        var result = g.next(data);
        if (result.done) return result.value;
        result.value.then(function(data) { //yield语句后面返回的必须是Promise对象
            next(data);
        });
    };
    next();
}

var fs = require('fs');
var readFile = function (fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, function (error, data) {
            if (err) return reject(error);
            resolve(data);
        });
    });
};
var gen = function* () {
    var f1 = yield readFile('/etc/fstab');
    var f2 = yield readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
};
run(gen);

// 3. co模块
    // 1. 将以上两种自动执行器（Thunk函数和Promise对象）包装成了一个模块
    // 2. 加入了并发异步操作
var co = require('co');
co(function* () {
    var res = yield [promise1, promise2]; //相当于Promise.all()
    console.log(res);
}).catch(onerror);
    // 当然也可用Promise自身实现
    var res = yield Promise.all([promise1, promise2]); 
    var res = yield Promise.rece([promise1, promise2]); 
```

# 第十八章：async函数
1. async函数就是Generator函数的语法糖，改进体现在以下3点：
```JavaScript
var fs = require('fs');
var readFile = function (fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, function (error, data) {
            if (err) return reject(error);
            resolve(data);
        });
    });
};

var asyncReadFile = async function () {
    var f1 = await readFile('/etc/fstab/');
    var f2 = await readFile('/etc/shells/');
    console.log(f1.toString());
    console.log(f2.toString());
};
asyncReadFile();
```
    a. 内置执行器：Generator函数的执行必须靠执行器，所以才有了co模块，而async函数自带执行器，async函数的执行与普通函数一模一样；
    b. 更广的适用性：co模块约定，yield命令后面只能是Thunk函数和Promise对象，而async函数的await命令后面，可以使Promise对象和原始类型的数值(但这时等同于同步操作)；
    c. 返回值是Promise：async函数可以看作由多个异步操作包装成的一个Promise对象，而await命令就是内部then命令的语法糖；
2. 语法
```JavaScript
// 1. 返回Promise对象
async function f() {
    return 'hello';
}
f().then( v => console.log(v) ) //'hello'

async function f() {
    throw new Error('出错了');
}
f().then(
    v => console.log(v),
    e => console.log(e)
)

// 2. 错误处理
    //a. 内部捕获
    async function f() {
        try {
            await Promise.reject('出错了！');
        } catch (e) {
            console.log(e);
        }
        await Promise.resolve('hello'); //会执行
    }
    f()
        .then( v => console.log(v) );
    // b. 外部捕获
    async function f() {
        await Promise.reject('出错了！');
        await Promise.resolve('hello'); //不会执行
    }
    f()
        .then( v => console.log(v) )
        .catch( e => console.log(e) );
// 3. 并发请求
let [foo, bar] = await Promise.all([getFoo(), getBar()]);
```
3. 异步Generator——（没理解？？？）

# 第十九章：Class的基本语法
1. 简介
```JavaScript
// ES5
function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.toString() = function () {
    return `( ${this.x}, ${this.y} )`;
}
var p = new Point(1, 2);

// ES6 (模块和class内部的代码都是严格模式的)
    // class不存在变量提升
class Point {
    // constructor函数如果没有显式定义，会添加一个空的constructor方法
    constructor(x, y) { 
        this.x = x;
        this.y = y;
    } // class里面的函数之间不需要加逗号
    toString() {
        return `( ${this.x}, ${this.y} )`;
    }

    #x; // ——私有属性（提案）
    _self() { // ——私有方法（约定）
        // to do...
    }
}
const p = new Point(1, 2);
```
2. class的取值函数(getter)和存值函数(setter)
```JavaScript
//在类内部可以使用get和set关键字对某个属性设置存值函数和取值函数，拦截该属性的存取行为
class MyClass {
    constructor(x) {
        this.prop = x;
        this._prop = this.prop;
    }
    get prop() {
        return 'getter ' + this._prop; //不直接取值prop，避免陷入死循环
    }
    set prop(value) {
        console.log('setter: ' + value);
    }
}

const myClass = new MyClass(1); // setter: 1
console.log(myClass.prop); //getter getter undefined
```
3. Class的静态方法
```JavaScript
// 1. 方法之前加static关键字，类的静态方法不会被实例继承，而是需要通过类直接调用
// 2. 父类的静态方法可以被子类继承
class Foo {
    static classMethod() {
        return 'hello';
    }
}

Foo.classMethod() //hello

var foo = new Foo();
foo.classMethod(); //TypeError: foo.classMethod is not a function
```
4. 静态属性和实例属性——（提案）
```JavaScript
class Foo {
    myProp = 42; //实例属性
    static classProp = 41; //静态属性
}
```
5. new.target属性：Class内部调用new.target，返回当前Class;

# 第二十章：Class的继承
1. 简介
```JavaScript
class Point {
    constructor(x, y) { 
        this.x = x;
        this.y = y;
    } 
    toString() {
        return `( ${this.x}, ${this.y} )`;
    }
}

class ColorPoint extends Point {
    constructor(x, y, color) {
        // 1. 子类必须在constructor方法中调用super方法
        // 2. 子类constructor方法中，只有调用super之后才可以使用this
        super(x, y);
        this.color = color;
    }
}
```
2. super关键字：
    1. 当做函数使用时 super()：super代表了父类的构造函数，但是返回的是子类的实例，因此super()在这里相当于A.prototype.constructor.call(this);
    2. super作为对象时在普通方法中指向父类的原型对象，在静态方法中指向父类；
3. 类的prototype属性和__proto__属性
```JavaScript
class A {

}
class B extends A {

}
// 1. 作为一个对象，子类B的原型(__proto__属性)是父类A；
B.__proto__ = A;
// 2. 作为一个构造函数，子类B的原型(prototype属性)是父类的实例；
B.prototype.__proto__ = A.prototype;
```
4. 利用extends继承，可以构造自己的数据结构：Boolean(),Number(),String(),Array(),Date(),Function(),RegExp(),Error(),Object(); ——详见书P432

# 第二十一章：修饰器
1. 修饰器是一个函数，用来修改类的行为，ES2017引入，目前Babel转码器已经支持
```JavaScript
// 1. 类的修饰器 （target是所要修饰的类）
    // 给类添加静态属性和实例属性
@testable
class MyTestableClass {
    // ...
}
function testable(target) {
    target.isTestable = true; //静态属性
    target.prototype.isTestable1 = true; // 实例属性
}

MyTestableClass.isTestable; //true

// 2. 方法的修饰
    // 此时，修饰器函数有3个参数：所要修饰的目标target，所有修饰的属性名name，该属性的描述对象descriptor
    // 设置属性只读
class Person {
    @readonly //可使用多个修饰器
    name() {
        return 'hhhhh';
    }
}
function readonly(target, name, descriptor) {
    // descriptor对象原来的值如下
    // {
    //     value: specifiedFunction,
    //     enumerble: false,
    //     configurable: true,
    //     writable: true,
    // }
    descriptor.writable = false;
    return descriptor;
}
```
2. 第三方库   
    1. core-decoration.js是一个第三方模块，提供了几个常见的修饰器；
    2. Traits-decorator 在类中混入方法，实现继承的一种新思路；

# 第二十二章：Module的语法
1. ES6模块自动采用严格模式;
2. 语法
```JavaScript
// 1. export命令
    //module1.js
    const name = 'Michael',
        testFunc = function() {
            // ...
        };
    class A {
        // ...
    }
    export {name as newName, testFunc, A}; //as能重命名

// 2. import命令
    //module2.js
    // 1. import命令具有提升效果，会提升到整个模块的头部并首先执行；
    // 2. 由于import和export是静态执行的，所以不能使用表达式和变量；
    // 3. 多次重复执行一句import语句，那么只会执行一次；
    import {newName, A as newA} from './module1.js';

// 3. 模块的整体加载
    import * as module1 from './module1.js';
    module1.testFunc();

// 4. export default命令
    //module1.js
    function foo() {
        console.log('foo');
    };
    export default foo;
    //module2.js
    import anyName from './module1.js';
    anyName();
    // 同时引入默认方法和一般方法
    import _, {each, forEach} from 'loadash';

// 5. export与import的复合写法
    export {foo, bar} from './module1.js';
    // 等同于
    import {foo, bar} from './module1.js';
    export {foo, bar};
    // 整体输出
    export * from './module1.js';
    //可以用于整理页面所需所有的类库，引到一个文件下

// 6. import() —— 提案 
    // 1. 与import命令静态加载相对的，import()是动态加载的；
    // 2. 与require类似，不过require是同步加载，import()是异步加载，返回的是promise对象；
```

# 第二十三章： Module的加载实现

# 第二十四章： 编程风格
```JavaScript
// 1. 对象尽量静态化
	// bad
	const a = {};
	a.x = 3;
	// good: if reshape unavoidable(如果添加属性不可避免，要使用Object.assign方法)
	const a = {};
	Object.assign(a, {x:3});
	// good
	const a = {x: null};
	a.x = 3;
```


