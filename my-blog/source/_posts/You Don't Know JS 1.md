---
title: 你不知道的JavaScript 上 note
date: 2018-06-03
categories: "你不知道的JavaScript 上"
tags: 
     - JavaScript
     - 读书笔记
---
你不知道的JavaScript的一些读书笔记！


### 第一部分 作用域和闭包

#### 第一章 作用域

1. 编译：
    1. 分词/词法分析
    2. 解析/语法分析：生成"抽象语法树"AST
    3. 代码生成：AST转化成一组机器指令 
     
<!-- more -->
2. 作用域是一套规则，如果查找的目的是对变量进行赋值，就会使用LHS查询；如果目的是获取变量的值，就会使用RHS查询；
3. var a = 2;会被分解成两个独立的步骤：
    1. var a在其作用域中声明变量
    2. a = 2会查询(LHS查询)变量a并对其进行赋值
4. ReferenceError同作用域判别失败相关；而typeError则代表作用域判别成功了，但是对结果的操作是非法的或者不合理的；

#### 第二章 词法作用域
1. 词法作用域意味着作用域是由书写代码时函数声明的位置来决定的；
2. JavaScript有两个机制可以欺骗词法作用于: eval(...)和with，这将导致代码运行变慢，不要使用它们；

#### 第三章 函数作用域和块作用域
1. 立即执行函数(IIFE)：立即执行函数是一个函数表达式；如果function是声明中的第一个词，那么就是一个函数声明，否则就是一个函数表达式，如(funtion的开头；
2. var声明只能提供函数作用域，而let, const可以提供函数作用域和块级作用域{...}；

#### 第四章 提升
1. var a = 2; JavaScript引擎将 var a 和 a = 2 当作两个单独的声明，第一个是编译阶段的任务，第二个是执行阶段的任务；
2. 变量声明(var)和函数声明(function)都会被提升，但是函数会被首先提升，然后才是变量。重复的声明会被忽略。

#### 第五章 作用域和闭包
1. 闭包：当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行；

```JavaScript
function foo() {
    var a = 2;
    function bar() {
        console.log(a);
    }

    return bar;
}
var baz = foo();
baz(); // 2 ——闭包的效果
// setTimeout 事件监听函数都有闭包
```
2. 简单模块
```JavaScript
function module() {
    var name = 'daming';
    var age = 18;
    function getAge() {
        return age;
    };
    function setAge(num) {
        age = num;
    };

    return {
        getAge,
        setAge
    }
};

var m = module();
console.log(m.getAge());
m.setAge(19);
console.log(m.getAge());
```
3. 现代模块机制
```JavaScript
// core
const MyModules = (() => {
    const modules = {};

    function define(name, deps, impl) {
        for (let i=0; i<deps.length; i++) {
            deps[i] = modules[deps[i]];
        }
        modules[name] = impl.apply(impl, deps);
    }

    function get(name) {
        return modules[name];
    }

    return { define, get };
})();

// module bar
MyModules.define('bar', [], () => {
    function hello(who) {
        return `let me introduce: ${who}`;
    }

    return { hello };
});

// module foo
MyModules.define('foo', ['bar'], bar => {
    const hungry = 'hoppo';

    function awesome() {
        return bar.hello(hungry).toUpperCase();
    }

    return { awesome };
});

// useage
const bar = MyModules.get('bar'),
    foo = MyModules.get('foo');

console.log(bar.hello('hippo'));
console.log(foo.awesome());
```
4. 闭包、this、箭头函数
```JavaScript
// 猜测：setTimeout 将第一个参数(函数)绑定到了全局对象，相当于obj.cool().call(window)，所以之后this会指向window;
// 而jQuery事件绑定是将函数绑定到了相关dom元素上；
var obj = {
    id: 'awesome',
    cool: function () {
        console.log(this);
    },
}

setTimeout(obj.cool(), 100); // window
setTimeout(function () {
    obj.cool(); // obj
}, 100);

// 箭头函数在涉及this绑定时的行尾和普通函数不同，放弃了普通this的绑定，取而代之的时用当前词法作用域覆盖了this本来的值；
// 代码片段中的箭头函数并非是以某种不可预测的方式同所属的this进行了解绑定，而只是继承了cool函数的this绑定；
var obj1 = {
    id: 'awesome',
    cool: function () {
        setTimeout(function() {
            console.log(this);
        }, 100)
    },
}
var obj2 = {
    id: 'awesome',
    cool: function () {
        setTimeout(() => {
            console.log(this);
        }, 100)
    },
}

obj1.cool(); // window
obj2.cool(); // obj

```


### 第二部分 this和原型对象

#### 第一章 关于this
1. why this: 相比函数传参而言，this提供了一种更优雅的方式来隐式传递一个对象引用；
```JavaScript
function identify() {
    return this.name;
}
var me = {
    name: 'Kyle',
};
console.log(identify.call(me));
```
2. this:
    1. 当一个函数被调用，会创建一个活动记录。这个活动记录会包含函数在哪被调用(调用栈)、函数的调用方式、传入的参数等信息。this就是这个记录里的一个属性，会在函数执行的过程中用到；
    2. this既不指向函数自身，也不指向函数的词法作用域。实际上this实在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用了；

#### 第二章 this全面解析
1. 绑定规则：
    1. 默认绑定：独立函数调用，this的默认绑定指向全局变量(strict模式下，指向undefined)；
    ```JavaScript
    function foo() {
        console.log(this.a);
    }    
    var a = 2;
    foo(); // 2
    ```
    2. 隐式绑定：函数被调用时，obj对象“拥有”或者“包含”它；
    ```JavaScript
    function foo() {
        console.log(this.a);
    }
    const obj = {
        a: 2,
        foo,
    };
    obj.foo(); // 2
    
    // 隐式丢失
    // 回调只是传递了foo函数，并没有传递隐式绑定
    // setTimeout等回调函数也是同理
    function foo() {
        console.log(this.a);
    }
    function doFoo(fn) {
        // fn其实引用的时foo
        fn(); // <- 调用位置
    }
    const obj = {
        a: 2,
        foo,
    };
    var a = 'oops, global';
    doFoo(obj.foo); // oops, global
    ```
    3. 显示绑定：call, apply, bind
    ```JavaScript
    function foo(num2) {
        console.log(this.num1 + num2);
    }
    var obj = {
        num1: 2,
    };
    var bar = function() {
        return foo.apply(obj, arguments);
    };
    bar(3); // 5
    
    function foo(num2) {
        console.log(this.num1 + num2);
    }
    var obj = {
        num1: 2,
    };
    var bar = foo.bind(obj);
    bar(3); // 5
    ```
    4. new绑定：使用new来调用函数时，会自动自行下面的操作
        1. 创建一个全新的对象；
        2. 这个对象会被执行[[Prototype]]连接；
        3. 这个新对象会绑定到函数调用的this；
        4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象；
    ```JavaScript
    function foo(a) {
        this.a = a;
    }
    var bar = new foo(2);
    console.log(bar.a); // 2
    ```
2. this绑定优先级：默认绑定 < 隐式绑定 < (显式绑定 ? new绑定)
```JavaScript
// 貌似new的优先级高一点
function foo(num) {
    this.a = num;
}
var obj1 = {};

var bar = foo.bind(obj1);
bar(2);
console.log(obj1.a); // 2

var baz = new bar(3)
console.log(obj1.a); // 2
console.log(baz.a); // 3
```
3. 绑定例外
    1. 被忽略的this
    ```JavaScript
    // 如果把null或者undefined作为this的绑定对象传入call、apply或者bind，这些值在调用时会被忽略，实际上应用的时默认绑定规则；
    function foo() {
        console.log(this.a);
    }
    var a = 2;
    foo.call(null); // 2
    
    // 更安全的this
    // Object.create(null)是一个空对象，不会创建Object.prototype这个委托，所以它比一般的 {} 更空；
    function foo(a, b) {
        console.log(a, b);
    }
    var emptyObj = Object.create(null);
    // 使用bind()进行柯里化
    var bar = foo.bind(emptyObj, 2);
    bar(3); // 2, 3
    ```
    2. this词法(箭头函数)：优先级比new还高
    ```JavaScript
    function foo() {
        return (a) => {
            console.log(this.a);
        };
    }
    var obj1 = { a: 1 };
    var obj2 = { a: 2 };
    var bar = foo.call(obj1);
    bar.call(obj2); // 1
    ```

#### 第三章 对象
1. 类型: 简单基本类型(string, boolean, number, null, undefined)，他们不是对象，在进行某些操作得时候(获取字符长度)，语言会自动把他们转换成一个对象；对象类型(object)；
2. 属性描述符
```JavaScript
var myObject = {};
Object.defineProperty(myObject, 'a', {
    value: 2,
    writable: true,
    configurable: true,
    enumerable: true,
});
myObject.a; // 2
```
3. Getter和Setter
```JavaScript
var myObject = {
    get a() {
        console.log('get a');
        return this._a_;
    },
    set a(value) {
        this._a_ = value;
    },
}
myObject.a = 1;
console.log(myObject.a);
```
4. 存在性
```JavaScript
// in操作符会检查属性是否在对象及其[[Prototype]]的原型链中
// hasOwnProperty只会检查属性是否在myObject对象中，不会检查[[Prototype]]的原型链
var myObject = {
    a: 2,
};
('a' in myObject); // true
myObject.hasOwnProperty('a'); // true
```

#### 第四章 类

#### 第五章 原型
1. 
    1. JavaScript中的对象有一个特殊的[[Prototype]]内置属性，就是对于其他对象的引用。
    2. 几乎所有的对象引用在创建时[[Prototype]]属性都会被赋予一个非空的值。
    3. 当你引用对象的属性时，会触发[[Get]]操作，对于默认的[[Get]]操作来说，第一步会检查对象本身是否有这个属性；如果无法在对象本身找到需要的属性，就会继续访问对象的[[Prototype]]链；找完整条[[Prototype]]链，如果还没有找到，则返回undefined；
    4. 所有普通的[[Prototype]]链最终都会指向内置的Object.prototype，它包含JavaScript中许多通用的功能，比如.toString(), .valueOf()；
    5. ES6获取对象的原型：Object.getPrototypeOf(a);
    6. Object.create(null);会创建一个空[[prototype]]的对象，不会受到原型链的干扰，因此非常适合用来存储数据；
2. 构造函数
```JavaScript
// ‘构造函数’实际作用：a.__proto__ = Foo.prototype;
// constructor并不是a对象本身的属性，而是关联的原型链上委托的属性
// 而且constructor属性是可修改的，所以不是一个可靠的属性
function Foo() {
    // ...
}
var a = new Foo();

Foo.prototype.constructor === Foo; // true
a.constructor === Foo; // true
```
3. 原型模仿类的继承(JavaScript类之间的继承很别扭)
```JavaScript
/**
 * ES5原型链
 */
function Foo(name) {
    this.name = name;
}
Foo.prototype.myName = function() {
    return this.name;
};

function Bar(name, label) {
    Foo.call(this, name); // 类似super()
    this.label = label;
}
// ES5 需要抛弃默认的 Bar.prototype, 轻微的性能损失
// Bar.prototype = Object.create(Foo.prototype);
// ES6 直接修改 Bar.prototype
Object.setPrototypeOf(Bar.prototype, Foo.prototype);
Bar.prototype.myLabel = function() {
    return this.label;
};

var a = new Bar('a', 'obj a');
console.log(a.myName()); // a
console.log(a.myLabel()); // obj a

/**
 * ES6 class
 */
class Obj1 {
   constructor(a) {
       this.a = a;
   }
   sayName() {
       console.log(this.a);
   }
}
class Obj2 extends Obj1 {
    constructor(a) {
        super(a);
    }
    sayName() { // 重写父类方法
        super.sayName();
        console.log('obj2');
    }
}

var obj2 = new Obj2('1');
obj2.sayName();
```
4. 对象关联(JavaScript中的继承就是对象之间的关联，或者类于实例之间的关联)
```JavaScript
/**
 * 一般委托
 */
var obj1 = {
    a: 1,
    sayName: function() {
        console.log(this.a);
    },
};
var obj2 = {
    a: 2,
};
Object.setPrototypeOf(obj2, obj1);

obj1.sayName(); // 1
obj2.sayName(); // 2

/**
 * 可重写委托属性(方法)
 */
var obj1 = {
    a: 1,
    sayName: function() {
        console.log(this.a);
    },
};
var obj2 = {
    a: 2,
    sayName: function() {
        this.super.sayName(); // 重写委托方法
        console.log('obj2');
    }
}
Object.setPrototypeOf(obj2, obj1);
obj2.super = Object.getPrototypeOf(obj2); // 解决委托不能取相同的属性(方法)名字的bug

obj1.sayName(); // 1
obj2.sayName(); // 2 obj2
```

#### 第六章 行为委托
1. 函数自我引用问题
```JavaScript
// 对象中的方法中需要递归引用自身，则采用 baz: function baz() {...} 的写法，就可以用函数名来引用自身；
var Foo = {
    baz: function baz() {
        if (x < 10) {
            return baz( x * 2 );
        }
        return x;
    }
}
```