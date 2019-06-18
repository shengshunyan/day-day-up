---
title: 你不知道的JavaScript 中 note
date: 2018-07-10
categories: "你不知道的JavaScript 中"
tags: 
     - JavaScript
     - 读书笔记
---
你不知道的JavaScript的一些读书笔记！


### 第一部分 类型和语法

#### 第一章 类型

1. 内置类型
    1. JavaScript内置七种类型: null, undefined, boolean, number, string, object, symbol;
    2. typeof
    ```JavaScript
    typeof undefined === 'undefined'; // true
    typeof true === 'boolean'; // true
    typeof 42 === 'number'; // true
    typeof '42' === 'string'; // true
    typeof { life: 42 } === 'object'; // true
    typeof [1, 2] === 'object'; // true
    typeof Symbol() === 'symbol'; // true
    
    typeof null === 'object'; // true
    // 函数是object的一个子类型，是‘可调用对象’，它有一个内部属性[[call]]， 使其可以被调用
    typeof function a() {/* ... */} === 'function'; // true
    ```
<!-- more -->
2. 值和类型
    1. JavaScript中的变量是没有类型的，只有值才有；变量可以随时持有任何类型的值；
    2. undefined: 已在作用域中声明但还没有赋值；   
       undeclared: 还没有在作用域中声明的变量；
    ```JavaScript
    var a;
    typeof a; // 'undefined'
    typeof b; // 'undefined'
    // 安全防范机制
    typeof xxx !== 'undefined'
    ```
    
#### 第二章 值

1. 数字语法
    1. 对于.运算符需要特别注意，因为它是一个有效的数字字符，会被优先识别为数字字面量的一部分，然后才是对象属性访问运算符；
    ```JavaScript
    // 无效语法
    42.toFixed(3); // SyntaxError
    // 有效
    (42).toFixed(3);
    42..toFixed(3);
    ```
2. 特殊数值
    1. null: 指曾赋过值，但是目前没有值；  
       undefined: 值从未赋过值；  
       undefined是一个标识符，可以被当作变量来使用和赋值；而null不能；
    2. void运算符: 表达式void xxx 没有返回值，因此返回结果是undefined，void并不改变表达式的结果，只是让表达式不返回值；按照惯例，我们用 void 0 来获得undefined；
3. 特殊的数字
    1. NaN: 不是数字的数字(not a number的缩写)，意指‘坏数值’；
    ```JavaScript
    var a = 2 / 'foo'; // NaN
    typeof a === 'number'; // true
    a == NaN; // false  唯一一个非自反的值
    Number.isNaN(a); // true 
    ```
    2. 无穷数: Infinity / -Infinity
    ```
    // 可用作区分0和-0的方法
    var a = 1 / 0; // Infinity
    var a = 1 / -0; // -Infinity
    
    var a = Infinity / Infinity; // NaN
    var a = 1 / Infinity; // 0
    ```
    3. 特殊等式: Object.is(...)用于判断两个值是否绝对相等
    ```JavaScript
    // 1. 判断是否为NaN
    var a = 2 / 'foo';
    Object.is(a, NaN); // true
    
    // 2. 判断正负零
    var b = -3 * 0;
    Object.is(b, -0); // true
    Object.is(b, 0); // false
    ```
4. 值和引用: 
    1. JavaScript对值和引用的赋值/传递在语法上没有区别，完全根据值得类型来决定；
    2. 简单值总是通过值的复制的方式来赋值/传递，包括null, undefined, string, number, boolean, symbol;  
       复合值(对象和函数)，则总是通过引用复制的方式来赋值/传递；
    ```JavaScript
    var a = 2;
    var b = a; 
    b++;
    a; // 2
    b; // 3
    
    var c = [1, 2, 3];
    var d = c; // d是[1, 2, 3]的一个引用，而不是c的引用
    d.push(4);
    c; // [1, 2, 3, 4]
    d; // [1, 2, 3, 4]
    
    // 由于引用指向的是值本身而非变量，所以一个引用无法改变另一个引用的指向
    function foo(x) {
        x.push(4);
        x = [4, 5, 6];
    }
    var a = [1, 2, 3];
    foo(a);
    a; // 是[1, 2, 3, 4] 而不是[4, 5, 6]
    ```
    
#### 第三章 原生函数

1. 通过构造函数创建出来的是封装了基本类型值得封装对象；
```JavaScript
var a = new String('abc');
typeof a; // 是“object”，而不是“String”
a intanceof String; // true
Object.prototype.toString.call(a); // [object String]
```
2. 内部属性[[Class]]
    1. 所有typeof返回值为'object'得对象都包含一个内部属性[[Class]]，可以看作是一个内部得分类。这个属性无法直接访问，一般通过Object.prototype.toString(...)来查看
    ```JavaScript
    Object.prototype.toString.call([1, 2, 3]); // "[object Array]"
    Object.prototype.toString.call(/regex/i); // "[object RegExp]"
    Object.prototype.toString.call(null); // "[object Null]"
    Object.prototype.toString.call(42); // "[object Number]"
    Object.prototype.toString.call('aaa'); // "[object String]"
    Object.prototype.toString.call(true); // "[object Boolean]"
    ```
    2. 上例中基本类型被各自得封装对象自动包装；
3. 封装对象：
    1. 强制封装：Object(...) ——不推荐使用
    ```JavaScript
    var a = 'aaa';
    var b = Object(a);
    typeof b; // "Object"
    ```
    2. 自动封装: 由于基本类型值没有.length和.toSting()这样得方法，需要通过封装对象才能访问，此时JavaScript会自动为基本类型值包装一个封装对象；
    ```JavaScript
    var a = 'aaa';
    a.length; // 3
    a.toUpperCase(); // 'AAA'
    ```
4. 拆封对象：
    1. valueOf(): 得到封装对象中得基本类型值；
    ```JavaScript
    var a = new String('abc');
    a.valueOf(); // 'abc'
    ```
    2. 隐式拆封: 在需要用到封装对象中得基本类型值得地方会发生隐式拆封；
    ```JavaScript
    var a = new String('abc');
    var b = a + '';
    typeof b; // 'String'
    ```
5. 原生函数作为构造函数
    1. Array(...)
    ```JavaScript
    // Array构造函数只带一个参数的时候，该参数会被作为数组得预设长度(length)，非明智之举；
    // 然而数组并没有预设长度这个概念，这样只是创建了一个空数组，只不过它的length被设置成了指定的值
    var a = Array(3); // JavaScript会自动补齐new关键字
    a.length; // 3
    a; // [empty * 3]       和 [undefined, undefined, undefined]不同
    ```
    2. ...
    
#### 第四章 强制类型转换

1. 值类型转换
```JavaScript
var a = 42;
var b = a + ''; // 隐式强制类型转换
var c = String(a); // 显式强制类型转换
```
2. 抽象值操作
    1. ToString:
        1. null 转换为 'null';
        2. undefined 转换为 'undefined';
        3. true 转换为 'true';
        4. 大数字字符串化会转化为指数形式;
        5. 普通对象 会返回内部属性[[Class]]的值，如"[object object]";
        6. 数组
        ```JavaScript
        var a = [1, 2, 3];
        a.toString(); // "1, 2, 3"
        ```
    ```JavaScript
    // 因为toString和JSON.stringify很像，所以介绍一下；
    
    // #1. 使用(第二个参数可以是个数组或者函数，用来筛选)
    var a = {
        b: 42,
        c: '42',
    };
    JSON.stringfy(a, ['b']); // "{"b": 42}"
    JSON.stringfy(a, function(k, v) {
        if (c !== 'c') return v;
    }); // "{"b": 42}"
    
    // #2. toString和JSON.stringify的区别
    // 1. 字符串、数字、布尔值和null的toString和JSON.stringify基本相同；
    // 2. 如果传递给JSON.stringify的对象定义了toJSON()方法，那么该方法会在字符串化前调用，以便将对象转换为安全的JSON值；
    ```
    2. ToNumber
        1. true 转化为 1;
        2. false 转化为 0;
        3. undefined 转化为 NaN;
        4. null 转化为 0;
        5. 对象: 会首先检查是否有valueOf()方法，如果有并返回基本类型值，就使用该值进行强制类型转换；如果没有就使用toString()的返回值来进行强制类型转换；如果均不返回基本类型值，会产生TypeError错误；
    3. ToBoolean
        1. 假值: undefined, null, false, +0 -0和NaN, '';
        2. 假值之外的都是真值；
3. 显式强制类型转换
    1. 字符串和数字之间的显式转换: String()和Number()
    ```JavaScript
    var a = 42; 
    var b1 = String(a);
    var b2 = a.toString();
    
    var c = '3.14';
    var d1 = Number(c);
    var d2 = +c;
    
    // 1. 位运算符 | :单竖杠“|”就是转换为2进制之后相加得到的结果，配合 | 0可以取整
    3.14 | 0; // 3
    
    // 2. 非运算符 ~ : ~x大致等同于-(x+1)
    // 利用只有~(-1)是0，可以优化indexOf的判断
    // bad
    if (a.indexOf('a') != -1) {/*...*/}
    // good
    if (~a.indexOf('a')) {/*...*/}
    
    // ~~也可取整
    ~~-49.6; // -49
    ~~49.6; // 49
    ```
    2. 显式解析数字字符串: 转换和解析是不同的，解析允许字符串中含有非数字字符；
    ```JavaScript
    var a = '42';
    var b = '42px';
    
    Number(a); // 42 -转换
    parseInt(a); // 42 -解析
    
    Number(b); // NaN -转换
    parseInt(b); // 42 -解析
    ```
    3. 显式转换为布尔值: Boolean() 和 !! 能将值强制类型转换为布尔值
    ```JavaScript
    // 在if()和三元表达式中，会自动隐式进行ToBoolean转换
    // 建议使用 Boolean() 或者 !! 来进行显式转换，提高代码可读性
    var a = 42;
    
    // bad
    if (a) {/*...*/}
    
    // good
    if (Boolean(a)) {/*...*/}
    ```
4. 隐式强制类型转换
    1. 隐式的优点：能简化代码，专注于实现逻辑；
    2. 字符串与数字之间的隐式强制类型转换
    ```JavaScript
    // 如果 + 的其中一个操作数是字符串(对象另处理...)，则进行字符串拼接；否则进行数字加法
    var a = '42';
    var b = 42;
    a + b; // '4242'
    ```
    3. 布尔值到数字的隐式强制类型转换
    ```JavaScript
    // 当参数只有一个true时，返回true,，否则返回false
    function onlyOne() {
        var sum = 0;
        for (var i = 0; i < arguments.length; i++) {
            sum += !!arguments[i];
        }
        return sum === 1;
    }
    onlyOne(true, false, false); // true
    ```
    4. 隐式强制类型转换为布尔值: 以下情况会发生转换
        1. if (...)
        2. for (.., ..; ..)中第二个判断语句
        3. while (..)和do..while(..)
        4. ? : 中的条件判断语句
        5. 逻辑运算符 || 和 && 左边的操作数
    5. || 和 &&
    ```JavaScript
    // || 对第一个操作数执行条件判断，如果为true则返回第一个操作数，如果为false则返回第二个操作数
    function foo(a) {
        a = a || 'hello'; // 默认值用法
    }
    
    // && 对第一个操作数执行条件判断，如果为true则返回第二个操作数，如果为false则返回第一个操作数
    a && a.say && a.say(); // 为后面的表达式把关
    ```
5. 宽松相等和严格相等 (自我感觉，不建议用==)
    1. 性能差别不大；
    2. 抽象相等
    ```JavaScript
    // # 1. 字符串和数字
    var a = 42;
    var b = '42';
    a == b; // true 都转化为数字，再比较
    
    // # 2. 其他类型和布尔类型
    var a = '42';
    var b = true;
    a == b; // false 会都转化为数字，再比较
    
    // # 3. null和undefined
    null == undefined; // true
    // bad
    if (a === null && a === undefined) {/*...*/}
    // good
    if (a == null) {/*...*/}
    ```
#### 第五章 语法
1. 语句和表达式
    1. 语句的结果值
        1. 每个语句都有一个结果值；
        2. 代码块{...}的结果值是其最后一个语句/表达式的结果
        ```JavaScript
        var b;
        if (true) {
            b = 4 + 38;
        }
        // 42 控制台输出42
        
        // 获取结果值
        // # 1. eval (极不推荐)
        var a, b;
        a = eval( 'if (true) { b = 4 + 38; }' );
        a; // 42
        // # 2. do (ES7提案, 还不可用)
        var a, b;
        a = do {
            if (true) {
                b = 4 + 38;
            }
        };
        a; // 42
        ```
    2. 表达式的副作用
    ```JavaScript
    var a = 42; 
    var b = a++; // 42  ++副作用产生在表达式返回结果之后
    
    var a = 42; 
    var b = ++a; // 43  ++副作用产生在表达式返回结果之前
    
    var a = 42, b;
    b = ( a++, a );
    a; // 43
    b; // 43
    
    // = 运算符的副作用是将42赋值给a
    var a, b, c;
    a = b = c = 42;
    
    // 利用赋值语句的结果值
    // bad
    function vowels(str) {
        var matches;
        if (str) {
            matches = str.match(/[aeiou]/g);
            if (matches) {
                return matches;
            }
        }
    }
    // good
    function vowels(str) {
        var matches;
        if (str && (matches = str.match(/[aeiou]/g))) {
            return matches;
        }
    }
    ```
    3. 上下文规则
        1. 大括号
        ```JavaScript
        // # 1. 对象常量
        var a = { foo: bar() };
        
        // # 2. 只有右值(也合法, 变成了标签语句的语法)
        {
            foo: bar()
        }
        
        function func() {
            bar: {
                console.log('hello');
                break bar;
                console.log('never runs');
            }
            console.log('world');
        }
        func(); 
        // hello
        // world
        ```
        2. 代码块
        ```JavaScript
        // {} 出现在+运算符表达式中，[]转化为''，{}转化为[object Object]，字符串相连
        [] + {}; // '[object Object]'
        // {} 被当作独立的代码块，最后 + []将显式强制类型转换为0
        {} + []; // 0
        ```
        3. else if
        ```JavaScript
        // JavaScript没有else if语句
        // if和else只包含单条语句的时候可以省略{}
        if (a) {
            // ...
        } else { // 实际结构 在else后面自动加上了{}
            if (b) {
                
            }
        }
        ```
2. 运算符优先级
    1. && > || > 三元运算符(? :)
    2. 关联
    ```JavaScript
    // 左关联 && ||
    a && b && c;
    (a && b) && c; // 相当于
    // 右关联 ?: =
    a ? b: c ? d : e;
    a ? b: (c ? d : e); // 相当于
    ```
3. try..finally
```JavaScript
// 先finally，再return
function foo() {
    try {
        return 42;
    }
    finally {
        console.log('hello');
    }
    console.log('never runs');
}
console.log(foo());
// hello
// 42
```
4. switch
```JavaScript
// case表达式的匹配算法与===相同
// 实现==匹配的技巧
var a = '42';
switch (true) {
    case a == 10: 
        console.log('10');
        break;
    default:
        // 永远执行不到这里
}

// break相关规则对default仍然适用
var a = 10;
switch (a) {
    case 1: 
        console.log('1');
        break;
    default:
        console.log('default');
    case 2: 
        console.log('2');
        break;
}
// default
// 2
```

### 第二部分 异步和性能

#### 第一章 异步: 现在和未来

1. 异步控制台
```
// 因为控制台I/O会延迟
var a = { index: 1 };
console.log(a); // ?? 有可能是2
a.index++;
```
2. 并发
    1. 交互
    ```JavaScript
    // 1. 门：等a, b都准备好了再进一步打开门
    var a, b;
    function foo(x) {
        a = x * 2;
        if (a && b) {
            baz();
        }
    }
    function bar(y) {
        b = y * 2;
        if (a && b) {
            baz();
        }
    }
    function baz() {
        console.log(a + b);
    }
    ajax('http://url.1', foo);
    ajax('http://url.2', bar);
    
    // 2. 门闩：只有第一名能取胜
    var a;
    function foo(x) {
        if (!a) {
            a = x * 2;
            baz();
        }
    }
    function bar(x) {
        if (!a) {
            a = x * 2;
            baz();
        }
    }
    function baz() {
        console.log(a + b);
    }
    ajax('http://url.1', foo);
    ajax('http://url.2', bar);
    ```
    2. 协作：取到一个长期运作的'进程'，并将其分割成多个步骤或者多批任务，使得其他并发'进程'有机会将自己的运算插入到事件循环队列中交替运行；
    ```JavaScript
    var res = [];
    function response(data) {
        // 一次处理1000个
        var chunk = data.splice(0, 1000);
        res = res.concat(
            chunk.map(function(val) {
                return val * 2;
            })
        );
        // 还有剩下的需要处理吗？
        if (data.length > 0) {
            setTimeout(function() {
                response(data);
            }, 0);
        }
    }
    ajax('http://url.1', response);
    ajax('http://url.2', response);
    ```
3. 任务
    1. 任务队列 和 事件循环队列 ？？？
    2. Promise的异步特性是基于任务的；

#### 第二章 回调

1. 大脑对于事情的计划方式是线性的、阻塞的、单线程的语义，但回调表达异步流程的方式是非线性、非顺序的，这使得大脑难于理解代码。
2. 回调把控制权交给了第三方(通常是不受你控制的第三方工具)，来调用你代码中的continuation，这会有信任问题，比如回调函数调用次数不是你能控制的。

#### 第三章 Promise

1. 判断某个值是不是Promise: 借助具有then方法的鸭子类型
```JavaScript
funtion isPromise(p) {
    if (
        p !== null &&
        (
            typeof p === 'object' || typeof p === 'function'
        ) && 
        typeof p.then === 'function'
    ) {
        return true;
    } else {
        return false;
    }
}
```
2. 回调未调用: 保证Promise有一个输出信号，防止永久挂住程序；
```JavaScript
// 用于超时一个Promise的工具
function timeoutPromise(delay) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject('timeout!');
        }
    });
}
// 设置foo()超时
Promise.rece([
    foo(),
    timeoutPromise(3000), // 给它3秒钟
]).then(function() {
    // foo及时完成
}, function(err) {
    // 或者foo被拒绝，或者没能按时完成
})
```
3. 可信任的Promise
    1. Promise通过把回调的控制反转回来，把控制权放在了一个可信任的系统中
    ```JavaScript
    // 可以把不信任的Promise对象传给Promise.resolve(..)，然后会得到期望中的规范化后的安全结果
    // 不要只这么做
    foo(42)
        .then(function(v) {
            console.log(v);
        });
    // 而要这么做
    Promise.resolve(foo(42))
        .then(function(v) {
            console.log(v);
        });
    ```
4. 链式流
    1. 调用Promise的then()会自动创建一个新的Promise从调用返回；
    2. 在完成或者拒绝函数内部，如果返回一个值或者抛出一个异常，新的返回的Promise就相应地决议
    3. 如果完成或拒绝处理函数返回一个Promise，它将会被展开(调用它的 then() 方法)，这样一来，不管它的决议值是什么，都会成为当前then()返回的连接Promise的决议值；
    ```JavaScript
    function request(url) {
        return new Promise(function(resolve, reject) {
            ajax(url, resolve);
        });
    }
    
    request('http://some.url.1/')
        .then(function(response1) {
            return request('http://some.url.2/?v=' + response1);
        })
        .then(function(response2) {
            console.log(response2);
        });
    ```
    4. resolve用于表达结果，可能是完成(fulfill)，也有可能是拒绝(reject)；
    ```JavaScript
    // 如果Promise.resolve()传入真正的Promise，则直接返回；
    // 如果Promise.resolve()传入的thenable，则会展开，展开如果得到一个拒绝状态，那么从Promise.resolve()返回的Promise实际上就同一个拒绝状态；
    var rejectedTh = {
        then: function(resolved, rejected) {
            rejected('Oop');
        }
    };
    ar rejectedPr = Promise.resolve(rejectedTh);
    
    // Promise()构造器的第一个参数resolve会展开thenable(和Promise.resolve()一样)或真正的Promise；
    // Promise()构造器的第二个参数reject不会展开thenable(和Promise.resolve()一样)或真正的Promise，它会把这个值原封不动地传给拒绝理由；
    var rejectedPr = new Promise(function(resolve, reject) {
        resolve(Promise.reject('Oop'));
    });
    
    rejectedPr.then(
        function fulfilled() {
            // 永远到不了这里
        },
        function rejected(err) {
            console.log(err); // 'Oop'
        }
    );
    ```
5. 错误处理
    1. 常规最佳实践：Promise链地最后总以一个catch()结束；
    2. 处理未捕获地情况：有些库实现了一些方法，注册一个“全局未处理拒绝”处理函数来处理未捕获地错误；
    3. Promise的未来；你不知道的JavaScript(中) P211
6. Promise模式
    1. Promise.all([..]): 门
        1. 数组中的值可以是Promise、thenable，甚至是立即值；
        2. 数组中的每个值都会通过Promise.resolve()过滤，以确保是一个真正的Promise；
        3. 如果数组是空，主Promise就会立即完成；
        4. 如果数组中的任何一个Promise被拒绝的话，主Promise.all([..])的promise就会被立即拒绝，丢弃来自其他所有Promise的结果；
        ```JavaScript
        var p1 = request('http://some.url.1/');
        var p2 = request('http://some.url.2/');
        Promise.all([p1, p2])
            .then(function(msgs) {
                return request('http://some.url.3/?v=' + msgs.join(','));
            })
            .then(function(msg) {
                console.log(meg);
            })
        ```
    2. Promise.race([..]): 门闩
        1. 数组中的值可以是Promise、thenable，甚至是立即值；
        2. 数组中的每个值都会通过Promise.resolve()过滤，以确保是一个真正的Promise；
        3. 如果数组是空，主Promise就永远不会决议；
        4. 如果数组中的任何一个Promise被拒绝的话，主Promise.all([..])的promise就会被立即拒绝；
        ```JavaScript
        var p1 = request('http://some.url.1/');
        var p2 = request('http://some.url.2/');
        Promise.race([p1, p2])
            .then(function(msg) {
                return request('http://some.url.3/?v=' + msg);
            })
            .then(function(msg) {
                console.log(meg);
            })
        ```
7. Promise并发迭代：对所有Promise都执行某个任务，类似于数组map()
```JavaScript
// 重新组装Promise
if (!Promise.map) {
    Promise.map = function(vals, cb) {
        // 一个等待所有map的promise的新promise
        return Promise.all(
            vals.map(function(val) {
                return new Promise(function(resolve) {
                    cb(val, resolve);
                })
            })
        );
    }
}

var p1 = Promise.resolve(21);
var p2 = Promise.resolve(42);
var p3 = Promise.reject('Oop');
Promise.map([p1, p2, p3], function(pr, done) {
    Promise.resolve(pr)
        .then(
            function(v) {
                done(v * 2);
            },
            done
        )
}).then(function(vals) {
    console.log(vals); // [42, 84, 'Oop']
})
```

#### 第四章 生成器
1. 打破完整运行：生成器能在代码的某个位置指示暂停，交出控制权，可以模拟实现多线程的竞态(两个函数中的语句可交替执行)；
```JavaScript
// 生成器的消息双向传递
function *foo(x) {
    var y = x * (yield 'hello');
    return y;
}
var it = foo(6);

var res = it.next();
res.value; // 'hello' 生成器向外传递的数据

res = it.next(7); // 向生成器里面传递数据
res.value; // 42
```
2. 迭代器
    1. 生产者与迭代器
    ```JavaScript
    var something = (function() {
        var nextVal;
        
        return {
            // for..of循环需要
            [Symbol.iterator]: function() { return this; },
            // 标准迭代器接口方法
            next: function() {
                if (nextVal === undefined) {
                    nextVal = 1;
                } else {
                    nextVal = (3 * nextVal) + 6;
                }
                return { done: false, value: nextVal };
            }
        }
    })();
    
    for (var v of something) {
        console.log(v);
        
        // 不要死循环
        if (v > 500) break;
    }
    // 1 9 33 105 321 969
    ```
    2. 生成器与迭代器
    ```JavaScript
    function *something() {
        var nextVal;
        
        while(true) {
            if (nextVal === undefined) {
                nextVal = 1;
            } else {
                nextVal = (3 * nextVal) + 6;
            }
            yield nextVal;
        }
    }
    
    for (var v of something()) { // 需要调用生成器来生成迭代器
        console.log(v);
        
        // 不要死循环
        if (v > 500) break;
    }
    // 1 9 33 105 321 969
    ```
3. 生成器 + Promise
```JavaScript
function foo(x, y) {
    return request(`http://some.url.1/?x=${x}&y=${y}`);
}
function *main() {
    try {
        var text = yield foo(11, 31);
        console.log(text);
    } catch(err) {
        console.error(err);
    }
}

// 调用
var it = main();
var p = it.next().value();
p.then(
    function(text) {
        it.next(text);
    },
    function(err) {
        it.throw(err); // yield使得try..catch可以以同步的语法，捕获异步函数的错误；
    }
);
```
4. 生成器委托
```JavaScript
function *foo() {
    var r2 = yield request('http://some.url.2');
    return r3;
}
function *bar() {
    var r1 = yield request('http://some.url.1');
    var r3 = yield *foo(); // 委托
    console.log(r3);
}
run(bar);
```
5. 生成器并发
```JavaScript
var res = [];
function *reqData(url) {
    var data = yield request(url);
    // 控制转移
    yield;
    res.push(data);
}
var it1 = reqData('http://some.url.1');
var it2 = reqData('http://some.url.2');

var p1 = it1.next();
var p2 = it2.next();

p1.then(function() {
    it1.next(data);
});
p2.then(function() {
    it2.next(data);
});

Promise.all([p1, p2])
    .then(function() {
        it1.next();
        it2.next();
    });
```
6. 形实转换程序：thunk ??? 用途(有点像curry) 你不知道的JavaScript中 P273
7. ES6之前的生成器(babel代码转译)
```JavaScript
// ES6代码
function *foo(url) {
    try {
        console.log('requesting', url);
        var val = yield request(url);
        console.log(val);
    } catch (err) {
        console.log('Oop:', err);
        return false;
    }
}
var it = foo('http://some.url.1');

// ES5代码
// 利用闭包保存状态来实现
你不知道的JavaScript中 P282
```

#### 第五章 程序性能

1. Web Worker
    1. 环境：
        1. 无法访问主程序的任何资源；
        2. 加载额外JavaScript脚本
        ```JavaScript
        // 在worker内部
        importScripts('foo.js', 'bar.js');
        ```
    2. 数据传递：postMessage()可以传递transferAble对象；
    3. 共享Worker：整个站点页面实例共享的Worker(sharedWorker)；
2. SIMD：单指令多数据是一种数据并行方式，与Web Worker的任务并行相对，重点实际上不再是把程序逻辑分成并行的块，而是并行处理数据的多个位；
3. asm.js：js内存分配、垃圾收集和作用域访问的优化； [asm.js和Emscripten入门教程](http://www.ruanyifeng.com/blog/2017/09/asmjs_emscripten.html)

#### 第六章 性能测试与调优

1. chorme性能测试API：
```JavaScript
console.time("for-test");
// some codde...
console.timeEnd("for-test");
```
2. Benchmark.js
```JavaScript
function foo() {
    // code for test
}
var bench = new Benchmark(
    'for test', // 测试名称
    foo, // 测试的函数
    { } // 可选的额外参数
);
bench.hz; // 每秒运行数
bench.stats.moe; // 出错边界
bench.stats.variance; // 样本方差
```
3. jsPerf.com
4. 微性能：
    1. 你所写的代码并不总是JavaScript引擎真正运行的代码，JavaScript会对你的代码进行优化；
    2. 不要过度执着于语句层面的优化，不要试图和JavaScript引擎比谁聪明；
    ```JavaScript
    // 理论上，变量len缓存x数组的长度会提高性能
    // 但是，引擎会帮你做这件事，而你自行优化可能在V8引擎中反而会使性能下降
    var x = [1, 2, 3];
    // 选择1
    for (var i = 0, i < x.length; i++) {
        // ..
    }
    // 选择2
    for (var i = 0, len = x.length; i < len; i++) {
        // ..
    }
    ```
5. 尾调用优化：ES6要求引擎实现尾调用优化(TCO)
    ```
    // 函数调用出现在函数“结尾处”
    function factorial(n) {
        function fact(n, res) {
            if (n < 2) return res;
            return fact(n - 1, n * res);
        }
        return fact(n, 1);
    }
    factorial(5); // 120
    ```