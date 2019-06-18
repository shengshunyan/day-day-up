---
title: 你不知道的JavaScript 下 note
date: 2018-07-19
categories: "你不知道的JavaScript 下"
tags: 
     - JavaScript
     - 读书笔记
---
你不知道的JavaScript的一些读书笔记！


### 第一部分 起步上路

### 第二部分 ES6及其更新版本

#### 第一章 ES？现在与未来

#### 第二章 语法

1. 块作用域声明
    1. let + for
    ```JavaScript
    // let i不只为for循环本身声明了一个i，而是为循环的每一次迭代都重新声明了一个新的i
    var funcs = [];
    for (let i = 0; i < 5; i++) {
        funcs.push(function() {
            console.log(i);
        })
    }
    funcs(3); // 3
    ```
    <!-- more -->
    2. 块作用域
    ```JavaScript
    // ES5 foo()能执行
    // ES6 foo()会报错 ReferenceError
    {
        function foo() {
            //... 
        }
    }
    foo(); 
    ```
2. 默认参数
```JavaScript
// 函数默认值可以是表达式，甚至是函数调用
// z + 1中发现z是一个此刻还没有初始化的参数变量，所以它永远不会试图从外层作用域中寻找Z(类似let的声明前引用错误)
var w = 1, z = 2;
function foo(x = w + 1, y = x + 1, z = z + 1) {
    console.log(x, y, z);
}
foo(); // ReferenceError
```
3. 解构
    1. 对象属性赋值模式
    ```JavaScript
    var { x: a, y: b, z: c } = { x: 1, y: 2, z: 3 };
    console.log(a, b, c); // 1 2 3
    console.log(x, y, z); // ReferenceError
    ```
    2. 不止是声明
    ```JavaScript
    var which = 'x',
        o = {};
    ({ [which]: o[which] } = { x: 1 });
    o.x; // 1
    ```
    3. 重复赋值
    ```JavaScript
    var { a: x, a: y } = { a: 1 };
    x; // 1
    y; // 1
    ```
    4. 默认值赋值
    ```JavaScript
    var { x, y, w: W = 2 } = { x: 1 };
    console.log(x, y, W); // 1, undefined, 2
    ```
    5. 解构参数
    ```JavaScript
    function foo({ x = 10 } = {}, { y } = { y: 10 }) {
        console.log(x, y);
    }
    foo(); // 10 10
    foo({}, {}); // 10 undefined
    ```
4. 对象字面量拓展
    1. 简洁方法
    ```JavaScript
    // 1. x() {..} 就是 x: function() {..} 的简写形式
    // 2. 简写形式的特质：支持super
    
    // ES5
    var o = {
        x: function() {
            // ..
        },
    }
    // ES6
    var o = {
        x() {
            //..
        },
    }
    
    // 注意：有一种情况不能用这种简写形式(当函数里有内部递归时)
    var o = {
        something: function soemthing(x, y) {
            if (x > y) {
                return something(y, x);
            }
            return y - x;
        }
    }
    o.something(1, 2);
    ```
    2. ES5 Getter/Setter
    ```JavaScript
    var o = {
        __id: 10,
        get id() {
            return this.__id++;
        },
        set id(v) {
            this.__id = v;
        }
    }
    o.id; // 10
    o.id; // 11
    o.id = 20; 
    o.id; // 20
    ```
    3. 设定[[Prototype]] (不太建议使用)
    ```JavaScript
    // 建议使用ES6工具：Object.setPrototypeOf()
    var o1 = { // .. };
    var o2 = {
        __proto__: o1,
        // ..
    }
    ```
    4. super对象
    ```JavaScript
    // super就相当于Object.getPrototypeOf(o2)
    var o1 = {
        foo() {
            console.log('01:foo');
        }
    }
    var o2 = {
        foo() {
            super.foo();
            console.log('o2:foo');
        }
    }
    Object.setPrototypeOf(o2, o1);
    o2.foo(); // o1:foo o2:foo
    ```
5. 模板字面量
```JavaScript
function foo(strings, ...values) {
    console.log(strings);
    console.log(values);
}
var desc = 'awesome';
foo`Everything is ${desc}!`;
// ['Everything is ', '!']
// ['awesome']
```
6. for..of循环
```JavaScript
// 在for (XYZ of ABC)..中，XYZ语句可以是赋值表达式也可以是声明
var o = {};
for (o.a of [1, 2, 3]) {
    console.log(o.a);
}
// 1 2 3
for ({x: o.a} of [ {x: 1}, {x: 2}, {x: 3} ]) {
    console.log(o.a);
}
// 1 2 3
```
7. 正则表达式
    1. Unicode标识(u)
    2. 定点标识(y)
    3. 正则表达式flags
    4. 补充：m标识(多行匹配)-使每一行都有一个^和$
    ```JavaScript
    var a = `
    456464
    阿萨斯
    12315
    `;
    a.match(/^\d+$/)   //null
    a.match(/^\d+$/m)   //["456464", index: 1, input: "↵456464↵阿萨斯↵12315↵"]
    a.match(/^\d+$/mg)   //["456464", "12315"]
    ```
8. 数字字面量拓展
```JavaScript
// 新的数字字面量形式
var dec = 42,
    oct = 0o52, // 八进制
    hex = 0x2a, // 十六进制
    bin = 0b101010; // 二进制
    
// 强制类型转换/变换成相应的数字值
Number('42'); // 42
Number('0o52'); // 42
Number('0x2a'); // 42
Number('0b101010'); // 42

// 反向转换
var a = 42;
a.toString(); // '42'
a.toString(8); // '0o52'
a.toString(16); // '0x2a'
a.toString(2); // '0b101010'
```
9. 符号(symbol)
```JavaScript
// 创建
var sym = Symbol('some optional description');
typeof sym; // 'symbol'
sym.toString(); // 'Symbol(some optional description)'
sym.instanceof Symbol; // false
var symObj = Object(sym);
symObj.instanceof Symbol; // true
symObj.valueOf() === sym; // true

// 作为对象属性
var o = {
    foo: 42,
    [Symbol('bar')]: 'heelo world',
    baz: true,
}
Object.getOwnPropertyNames(o); // ['foo', 'baz']
Object.getOwnPropertySymbols(o); // [Symbol(bar)]

// 内置符号：预先定义好的内置符号，它们可以暴露JavaScript对象值的各种元特性，它们作为Symbol函数对象的属性保存，比如 Symbol.iterator
```

#### 第三章 代码组织

1. 迭代器
    1. 接口：(补充：Iterable即@@iterator属性为Iterator生成函数)
    2. next()迭代
    ```JavaScript
    var greeting = 'hello world';
    var it = greeting[Symbol.iterator]();
    it.next(); // { value: 'h', done: false }
    it.next(); // { value: 'e', done: false }
    ```
    3. 迭代器循环
    ```JavaScript
    var it = {
        // 使迭代器it成为iterable
        [Symbol.iterator]() { return this; },
        next() { .. },
        ..
    };
    // for..of循环
    for (var v of it) {
        console.log(v);
    }
    // for..of 本质
    for (var v, res; (tes = it.next()) && !res.done) {
        v = res.value;
        console.log(v);
    }
    ```
    4. 自定义迭代器
    ```JavaScript
    // 无限斐波那契序列
    var Fib = {
        [Symbol.iterator]() {
            var n1 = 1, n2 = 1;
            return {
                [Symbol.iterator]() { return this; },
                next() {
                    var current = n2;
                    n2 = n1;
                    n1 = n1 + current;
                    return { value: current, done: false };
                },
                return(v) {
                    console.log('abandoned');
                    return { value: v, done: true };
                },
            };
        }
    };
    
    for (var v of Fib) {
        console.log(v);
        if (v > 50) break;
    }
    // 1 1 2 3 5 8 13 21 34 55 'abandoned'
    ```
    5. 迭代器消耗
    ```JavaScript
    // 1. for..of 循环一个接一个地消耗迭代器项目
    // 2. 数字解构可以完成部分消耗一个迭代器
    // 3. spread运算符...可以完全消耗了一个迭代器
    var a = [1, 2, 3, 4, 5];
    var it = a[Symbol.iterator]();
    // 获取前两个元素
    var [x, y] = it;
    // 获取第三个元素，然后获取其余所有元素
    var [z, ...w] = it;
    // it已经消耗尽？是的
    it.next(); // { value: undefined, done: true } 
    ```
2. 生成器
    1. 语法：function *foo() {..}
    2. yield
    ```JavaScript
    // yield.. 基本上可以出现在任何a = 3合法出现地位置
    function *foo() {
        var arr = [yield 1, yield 2];
        console.log(arr, yield 3);
        var a = 2 + (yield 4); // 不加括号会报错
    }
    ```
    3. yield*：yield委托
    ```JavaScript
    // 1. 例子中，生成器没有真正暂停，因为没有yield..表达式，yield*只是通过递归调用
    // 保存当前地迭代步骤，所以只调用一次next()函数就运行了整个迭代器
    function *foo(x) {
        if (x < 3) {
            x = yield *foo(x + 1);
        }
        return x * 2;
    }
    var it = foo(1);
    it.next(); // { value: 24, done: true }
    ```
    4. 迭代器控制：next()方法双向传递值
    5. 提前完成：生成器上附着地迭代器支持可选return()和throw()方法，可终止一个暂停的生成器
    ```JavaScript
    function *foo() {
        try {
            yield 1;
            yield 2;
            yield 3;
        } finally {
            console.log('cleanup!');
        }
    }
    var it = foo();
    it.next(); // { value: 1, done: false }
    it.return(42); // cleanup! { value: 42, done: true }
    ```
    6. 错误处理：try..catch，由内向外和由外向内
3. 模块
    1. 旧方法：利用函数和闭包实现的模块机制；
    2. ES6模块：
        1. 一个文件，一个模块；
        2. 静态API；
        3. 模块是单例的：一个模块只有一个实例，其中维护了它的状态；
        4. 值绑定：模块公开API中暴露的属性和方法不仅仅是值或者引用的赋值，而是到模块内部定义的标识符的实际绑定；如果模块修改了这个变量的值，外部导入绑定现在会决议到新的值；
    3. 语法：
        1. import、export都必须出现在它们的最顶层作用域，不呢个放在if条件中；
        2. export
        ```JavaScript
        // 1. 命名导出
        function() { .. }
        var awesome = 42;
        var bar = [1, 2, 3];
        export { foo, awesome, bar };
        
        // 2. 默认导出
        function foo() {
            // ..
        }
        // 导出的是函数表达式值的绑定，而不是标识符foo，所以修改foo的值不会改变导出值
        export default foo;
        // 导出的是标识符foo，所以修改foo的值会改变导出值
        export { foo as default };
        
        // 3. 双向绑定是不允许的，如果从一个模块导入了foo，然后修改foo的值，就会抛出错误；
        ```
        3. import
        ```JavaScript
        // 1. 
        import { foo, bar } from 'foo';
        
        // 2. 导入默认导出的模块
        import foo from 'foo';
        
        // 3. 混合
        // foo.js
        export default function foo() {..};
        export function bar() {..};
        // index.js
        import FOO, { bar } from 'foo';
        
        // 4. 命名空间导入(暂不支持命名空间部分导入)
        import * as FOO from 'foo';
        FOO.foo();
        FOO.bar();
        
        // 5. import提升
        foo();
        import { foo } from 'foo';
        
        // 6. 基本形式：它加载、编译，并求值foo模块；一般来说，这种导入没什么太大的用处，可能需要模块的的一些副作用(比如把东西赋给全局变量window)
        import 'foo';
        ```
        4. 模块依赖环：加载模块时，先扫描分析模块的所有导出，再处理导入语句；
4. 类
    1. class
        1. class Foo表明创建了一个名为Foo的函数；
        2. constructor(..)指定Foo(..)函数的签名以及函数体内容；
        3. 类支持ES5 getter/setter语法，但是类方法不可枚举；
        4. class定义体内部不用逗号分隔成员；
        5. 类Foo不能这样调用Foo.call(obj)，必须通过new调用；
        6. function是提升的，而class不提升；
    ```JavaScript
    class Foo {
        constructor(a, b) {
            this.x = a;
            this.y = b;
        }
        add() {
            return this.x + this.y;
        }
    }
    
    // 类似
    function Foo(a, b) {
        this.x = a;
        this.y = b;
    }
    Foo.prototype.add = function() {
        return this.x + this.y;
    }
    ```
    2. extends和super
        1. 语法
        ```JavaScript
        class Bar extends Foo {
            constructor(a, b, c) {
                super(a, b);
                this.z = c;
            }
            add() {
                return super.add() + this.z;
            }
        }
        ```
        2. super恶龙：this可以动态绑定，而super则是静态绑定；
        ```JavaScript
        // 类的语法和对象委托二选一
        class ParentA {
            constructor() { this.id = 'a'; }
            foo() { console.log('ParentA:', this.id); }
        }
        class ParentB {
            constructor() { this.id = 'b'; }
            foo() { console.log('ParentB:', this.id); }
        }
        class ChildA extends ParentA {
            foo() {
                super.foo();
                console.log('ChildA:', this.id);
            }
        }
        class ChildB extends ParentB {
            foo() {
                super.foo();
                console.log('ChildB:', this.id);
            }
        }
        
        var a = new ChildA();
        a.foo(); // ParentA: a    ChildA: a
        var b = new ChildB();
        b.foo(); // ParentB: b    ChildB: b
        // 在a的上下文中借来b.foo()使用
        b.foo.call(a); // ParentB: a    ChildB: a
        ```
        3. 子类构造器
            1. 类和子类，构造器都不是必须的；省略的话会自动提供一个默认构造器；
            ```JavaScript
            // 子类默认构造器
            constructor(...args) {
                super(...args);
            }
            ```
            2. 子类构造器中，要先调用super()之后才能访问this；
        4. 拓展原生类
        ```JavaScript
        class MyArray extends Array {
            first() { return this[0]; }
            last() { return this[this.length - 1]; }
        }
        var a = new MyArray(1, 2, 3);
        a.length; // 3
        a.first(); // 1
        ```
    3. new.target: 总是指向new实际直接调用的构造器；
    4. static：当子类Bar从弗雷Foo拓展时，不仅Bar.prototype是[[prototype]]链接到Foo.prototype，而且Bar()也[[prototype]]连接到Foo()；
    ```JavaScript
    // static函数是直接添加在这个类的函数对象上的，而不是函数对象的prototype对象上
    class Foo {
        static cool() { console.log('cool'); }
    }
    class Bar extends Foo {
        static awesome() {
            super.cool();
            console.log('awesome');
        }
    }
    Bar.awesome(); // 'cool' 'awesome'
    ```
    5. 实践
    ```JavaScript
    // 原生类拓展，创建一个列表元素中id不重复的数组类型
    class NoRepeatIdArray extends Array {
        constructor(...args) {
            const { map, list: noRepeatList } = new.target.removeRepeat(args);
            super(...noRepeatList);
            this.map = map;
        }
        static removeRepeat(elems) {
            const map = {},
                list = [];
            for (let elem of elems) {
                if (map.hasOwnProperty(elem.id)) {
                    continue;
                }
                map[elem.id] = elem;
                list.push(elem);
            }
            return { map, list };
        }
        push(...args) {
            const map = this.map,
                list = [];
            if (args.length === 0) {
                return;
            }
            if (args.length === 1) {
                const elem = args[0];
                // 添加单个元素
    			if (map.hasOwnProperty(elem.id)) {
    				console.warn(`添加了相同 id:${elem.id} 的元素！`);
    				return;
    			}
    			map[elem.id] = elem;
    			super.push(elem);
            } else {
                // 添加多个元素
                for (let elem of args) {
                    if (map.hasOwnProperty(elem.id)) {
                        console.warn(`添加了相同 id:${elem.id} 的元素！`);
                        continue;
                    }
                    map[elem.id] = elem;
                    list.push(elem);
                }
                super.push(...list);
            }
        }
    }
    
    var arr = new NoRepeatIdArray( {id: 1}, {id: 2}, {id: 1} );
    arr.push({id: 2}, {id: 3});
    ```
    
#### 第四章 异步控制流 (你不知道的JavaScript中 Promise+生成器讲的更细)

#### 第五章 集合

1. TypedArray: 带类型的数组
```JavaScript
// buffer
var buf = new ArrayBuffer(32);
// 带类数组构造器
var a = new Int32Array(3); // ES6还提供好多其他类型
a[0] = 10;
a[1] = 20;
a[2] = 30;
a.join('-'); // '10-20-30'
```
2. Map: 可以非字符串作为键值；
3. WeakMap: 只是弱持有它的键，而不是值；
4. Set: 值唯一的集合；
5. WeakSet: 弱持有它的值，但值必须是对象；

#### 第六章 新增API

1. Array
    1. 静态函数Array.of(..): 解决Array构造器的一个陷阱，就是只传入一个参数，并且这个参数是数字的话，那么就会构造一个空数组，其length为这个数字；
    ```JavaScript
    var a = Array(3);
    a.length; // 3
    a[0]; // undefined
    
    var b = Array.of(3);
    b.length; // 1
    b[0]; // 3
    ```
    2. Array.from(..): 把类数组对象转化为真正的数组；
    3. 原型方法copyWithin(..)
    4. 原型方法fill(..)
    ```JavaScript
    var a = [null, null, null, null].fill(42, 1, 3); // [null, 42, 42, null]
    ```
    5. 原型方法find(..): 返回匹配项的值；
    6. 原型方法findIndex(..): 返回匹配项的索引；
    7. 原型方法entries(), values(), keys();
2. Object
    1. 静态函数Object.is(..): 和 === 相似
    ```JavaScript
    -0 === 0; // true
    Object.is(-0, 0); // false
    
    NaN === NaN; // false
    Object.is(NaN, NaN); // true
    ```
    2. 静态函数Object.getOwnPropertySymbols(..): 获取对象中的所有符号属性；
    3. 静态函数Object.setPrototypeOf(..): 用于行为委托；
    4. 静态函数Object.assign(..): 用于把一个对象的属性复制/混合到另一个对象中；
    5. Object.create(..) --ES5
3. Math: 增加了一些数学函数；
4. Number
    1. 静态属性: Number.EPSILON, MAX_SAFE_INITEGER, MIN_SAFE_INTEGER;
    2. 静态函数Number.isNaN(..)
    3. 静态函数Number.isFinite(..)
    4. 静态函数Number.isInteger(..)
    5. 静态函数Number.isSafeInteger(..)
5. String
    1. Unicode函数: String.fromCodePoint(..), String#codePointAt(..), String#normalize(..);
    2. 静态函数String.raw(..)
    ```JavaScript
    var str = 'bc';
    String.raw`\ta${str}d\xE9`; // "\ta${str}d\xE9"
    ```
    3. 原型函数repeat(..)
    ```JavaScript
    'foo'.repeat(3); // 'foofoofoo'
    ```
    4. 字符串检查函数：startsWith(..), endsWith(..), includes(..);
    
#### 第七章 元编程

1. 函数名称
    1. 函数有个name属性标识函数名称；
    2. 函数名称的推导；
2. 元属性
    1. new.target: 构造器调用的内部使用new.target时，指向调用new的目标构造器；
3. 公开符号：JavaScript预先定义了一些内置符号；
    1. Symbol.iterator: 对象的一个属性(方法)，构造一个迭代器来消耗这个对象；
    2. Symbol.toStringTag, Symbol.hasInstance: 可以操作toString()和instanceof()函数的行为特性；
    3. Symbol.species: 控制要生成新实例时，类的内置方法使用哪个构造器；
    4. Symbol.toPrimitive: 控制对象为了某个操作(==或+)必须强制转换为一个原生类型值的时候的行为；
    5. 正则表达式符号: Symbol.match, Symbol.replace, Symbol.search, Symbol.split, 控制对应的原型方法的行为；
    6. Symbol.isConcatSpreadable: 指示如果把它传给一个数组的concat(..)是否将其展开；
4. 代理
    1. 语法
    ```JavaScript
    var obj = { a: 1 },
        handlers = {
            get(target, key, context) {
                // target === obj, context === pobj
                console.log('accessing: ', key);
                return Reflect.get(target, key, context);
            }
        },
        pobj = new Proxy(obj, handlers);
    obj.a; // 1
    pobj.a; // accessing: a   1
    ```
    2. 还有其他代理函数：get(), set(), deleteProperty(), apply()...等；
    3. 可取消代理
    ```JavaScript
    var obj = { a: 1 },
        handlers = {
            get(target, key, context) {
                console.log('accessing: ', key);
                return target[key];
            }
        },
        { proxy: pobj, revoke: prevoke } = Proxy.revocable(obj, handlers);
    pobj.a; // accessing: a   1
    // 取消代理
    prevoke();
    pobj.a; // TypeError
    ```
    4. 使用代理
        1. 代理在先，代理在后
        ```JavaScript
        // 问题：希望预先定义好一个对象的所有属性/方法之后，访问不存在的属性名时，能够抛出一个错误
        
        // 1. 代理在先
        var obj = {
                a: 1,
                foo() {
                    console.log('a', this.a);
                },
            },
            handlers = {
                get(target, key, context) {
                    if (Reflect.has(target, key)) {
                        return Reflect.get(target, key, context);
                    } else {
                        throw 'No such property/method!';
                    }
                },
                set(target, key, val, context) {
                    if (Reflect.has(target, key)) {
                        return Reflect.set(target, key, val, context);
                    } else {
                        throw 'No such property/method!';
                    }
                }
            },
            pobj = new Proxy(obj, handlers);
        pobj.a = 3;
        pobj.foo(); // a 3
        pobj.b = 4; // Error: No such property/method!
        pobj.bar(); // Error: No such property/method!
        
        // 2. 代理在后: 把proxy对象放到主对象的[[prototype]]链中
        var obj = {
                a: 1,
                foo() {
                    console.log('a', this.a);
                },
            },
            handlers = {
                get() {
                    throw 'No such property/method!';
                },
                set() {
                    throw 'No such property/method!';
                }
            },
            pobj = new Proxy({}, handlers);
        Object.setPrototypeOf(obj, pobj);
        pobj.a = 3;
        pobj.foo(); // a 3
        pobj.b = 4; // Error: No such property/method!
        pobj.bar(); // Error: No such property/method!
        ```
        2. 代理hack[[prototype]]链
        ```JavaScript
        // 模拟多继承
        var obj1 = {
                name: 'obj-1',
                foo() {
                    console.log('obj1.foo', this.name);
                },
            },
            obj2 = {
                name: 'obj-2',
                foo() {
                    console.log('obj2.foo', this.name);
                },
                bar() {
                    console.log('obj2.bar', this.name);
                },
            },
            handlers = {
                get(target, key, context) {
                    if (Reflect.has(target, key)) {
                        return Reflect.get(target, key, context);
                    } else {
                        for (var P of target[Symbol.for('[[Prototype]]')]) {
                            if (Reflect.has(P, key)) {
                                return Reflect.get(P, key, context);
                            }
                        }
                    }
                },
            },
            obj3 = new Proxy({
                name: 'obj-3',
                baz() {
                    this.foo();
                    this.bar();
                },
            }, handlers);
        obj3[Symbol.for('[[Prototype]]')] = [obj1, obj2];
        obj3.baz();
        // obj1.foo obj-3
        // obj2.bar obj-3
        ```
5. Reflect API
    1. Reflect: 是一个平凡对象(就像Math)，不是内置原生值(构造器)；Reflect的元编程能力提供了模拟各种语法特性的编程等价物，把之前隐藏的抽象操作暴露出来，你可以利用这些能力拓展功能和API；
    2. 常用方法
    ```JavaScript
    Reflect.ownKeys(..)
        返回所有‘拥有’的(不是继承的)键的列表(不管是否可以枚举)
    Reflect.enumerate(..)
        返回一个产生所有可枚举的非符号键集合的迭代器(包括原型链上的属性)；和for..in循环处理的那个键的集合是一样的；
    Reflect.has(..)
        Reflect.has(o, 'foo') 实质上就是执行 'foo' in o
    Reflect.apply(..)
    Reflect.construct(..)
        Reflect.construct(foo, [42, 'bar']) 实质上就是执行 new foo(42, 'bar')
    Reflect.get(..)
        Reflect.get(o, 'foo') 实质上就是执行 o.foo
    Reflect.set(..)
        Reflect.set(o, 'foo', 42) 实质上就是执行 o.foo = 42
    Reflect.deleteProperty(..)
        Reflect.deleteProperty(o, 'foo') 实质上就是执行 delete o.foo
    ```
6. 属性顺序
    1. (不可靠) Reflect.enumerate(..), Object.keys(..)和for..in，可观察的顺序是相同的，但是不再必须与Reflect.ownKeys(..)相同，依赖具体的实现；
    2. (可靠) ES6中，属性的列出顺序由[[OwnPropertyKeys]]算法定义，这个算法只对Reflect.ownKeys(..), Object.getOwnPropertyNames(..), Object.getOwnPropertySymbols(..)有保证；
    3. [[OwnPropertyKeys]]算法属性顺序：
        1. 首先，按照数字上升排序，枚举所有整数索引拥有的属性；
        2. 然后，按照创建顺序枚举其余的拥有的字符串属性名；
        3. 最后，按照创建顺序枚举拥有的符号属性；
    ```JavaScript
    var o = {};
    o[Symbol('c')] = 'yay';
    o[2] = true;
    o[1] = true;
    o.b = 'awesome';
    o.a = 'cool';
    Reflect.ownKeys(o); // [1, 2, 'b', 'a', Symbol(c)]
    Object.getOwnPropertyNames(o); // [1, 2, 'b', 'a']
    Object.getOwnPropertySymbols(o); // [Symbol(c)]
    ```
7. 特性测试
    1. 语法：
    ```JavaScript
    // API检查
    if (!Number.isNaN) {
        Number.isNaN = function(x) {
            return x !== x;
        };
    }
    
    // 新语法检查：检查箭头函数语法是否支持
    try {
        new Function("( () => {} )"); // 不用Function包装的话，编译会不通过
        ARROW_FUNCS_ENABLED = true;
    } catch(err) {
        ARROW_FUNCS_ENABLED = false;
    }
    ```
    2. 工具：FeatureTests.io进行特性测试；
8. 尾递归调用
    1. 尾调用：这个优化只在strict模式下应用；函数调用处于代码路径上最后发生的一件事(即return函数调用)；
    2. 递归重写
    ```JavaScript
    'use strict';
    function foo(x) {
        if (x <= 1) return 1;
        return (x / 2) + foo(x - 1);
    }
    foo(123456); // RangeError: Maximum call stack size exceeded
    
    // 尾调用优化(TCO)
    'use strict';
    var foo = (function() {
        function _foo(acc, x) {
            if (x <= 1) return acc;
            return _foo((x / 2) + acc, x - 1);
        }
        return function(x) {
            return _foo(1, x);
        }
    })();
    foo(123456); // 3810376848.5
    
    // 非尾调用优化：展开递归
    // 也许性能最好，但是可复用性不高，没有把循环逻辑提取出来
    'use strict';
    function(x) {
        var acc = 1;
        while (x > 1) {
            acc = (x / 2) + acc;
            x = x - 1;
        }
        return acc;
    }
    foo(123456); // 3810376848.5
    ```
    3. TCO特性测试：决定采用 尾调用优化 还是 非尾调用优化(展开递归)
    ```JavaScript
    'use strict';
    try {
        (function foo(x) {
            if (x < 5E5) return foo(x + 1);
        })(1)
        TCO_ENABLED = true;
    } catch (err) {
        TCO_ENABLED = false;
    }
    ```
    
#### 第八章 ES6之后

1. 异步函数：async..await(详细见ES6 note async部分)；
2. Object.observe(..): 数据绑定，侦听数据对象的更新；
3. 幂运算：
```JavaScript
'use strict';
var a = 2;
a ** 4; // 相当于 Math.pow(a, 4)
```
4. 对象拓展符...
5. Array#includes(..): 检查数组是否有某个元素，返回布尔值，可读性比indexOf()高；
6. SIMD: SIMD API暴露了可以同时对多个数字值运算的各种底层(CPU)指令；
7. WebAssembly(WASM): 更好的性能
    1. WASM是一种代码的高度压缩AST二进制表示格式，可以直接向JavaScript引擎发出指令，像C或者C++这样的语言可以直接编译为WASM；
    2. 之前：其他语言 -> ASM.js -> JS引擎； 现在：其他语言 -> WebAssembly -> JS引擎；
    3. JavaScript是未来不太可能转化为WASM的语言之一，但是JavaScript和WASM代码可以最大程度的交互，就像现在的模块交互一样；
