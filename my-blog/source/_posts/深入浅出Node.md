---
title: 深入浅出NodeJS note
date: 2018-08-08
categories: "深入浅出NodeJS"
tags: 
     - JavaScript
     - 读书笔记
---
深入浅出NodeJS的一些读书笔记！


### 第一章 Node简介

### 第二章 模块机制

1. CommonJS
    1. CommonJS规范为JavaScript制定了一个美好的愿景，希望JavaScript能够在任何地方运行；
    2. CommonJS规范为JavaScript指明了一条非常棒的道路，规范涵盖了模块、二进制、Buffer、字符集编码、I/O流、进程环境、文件系统、套接字、单元测试、Web服务器网关接口、包管理器等；
    3. CommonJS的模块规范：模块引用、模块定义、模块标识(传递给require()方法的参数，必须是小驼峰命名)；
    
<!-- more -->

2. Node的模块实现
    1. Node中引入模块，需经历三个步骤：路径分析、文件定位、编译执行；
    2. Node中，模块分为两类：核心模块、文件模块；
    3. 优先从缓存加载：Node会缓存模块编译和执行后的对象；
    4. 路径分析：
        1. 优先判断模块标识符是否为核心模块(如fs)，不能加载和核心模块标识符相同的自定义模块；
        2. 以.、..和/开头的标识符，require()会将其转化为真实路径；
        3. 加载自定义模块(node_modules下的模块)，会逐级向上查找：当前目录下的node_modules目录 -> 父目录下的node_modules目录 -> 直到根目录的node_modules目录；
    5. 文件定位：
        1. 文件拓展名分析：Node会按.js、.json、.node的次序补足拓展名，依次尝试；
        2. 目录分析和包：文件拓展名分析之后，没有找到相关的文件，但得到一个目录，此时Node会将这个目录当作一个包来处理；首先，Node在当前目录下查找package.json，去除其中的main属性指定的文件名进行定位，如果，main属性指定的文件名错误，Node会将index作为默认文件名，然后一次查找index.js、index.json、index.node；
    6. 模块编译：
        1. .js文件：通过fs模块同步读取文件后编译执行；
        ```JavaScript
        // Node对获取的JavaScript文件内容进行了头尾包装
        (function(export, require, module, __filename, __dirname) {
            // module code
        });
        // 包装之后的带啊会通过VM原生模块的runInThisContext()方法执行(类似eval)，返回一个function对象，再将诸如export等以参数传入
        ```
        2. .node文件：这是用C/C++编写的拓展文件，通过dlopen()方法加载最后编译生成的文件；
        3. .json文件：通过fs模块读取文件后，用JSON.parse()解析返回结果；
        4. 其余拓展文件都会被当作.js文件载入;
3. 核心模块：
    1. JavaScript核心模块(lib目录下)的编译过程；
    2. C/C++核心模块(src目录下)的编译过程；
    3. 核心模块的引入流程；
    4. 编写核心模块；
4. C/C++拓展模块
5. 模块调用栈
6. 包与NPM
    1. 包的结构
    2. 包描述文件(package.json)
    3. 全局安装-g：-g是将一个包安装为全局可用的可执行命令；它根据包描述文件中的bin字段配置，将实际脚本链接到与Node可执行文件相同的路径下；
    4. npm钩子命令：在install前后可监听函数；
    5. 发布包(还有包的权限管理)；
    6. 局域npm：搭建企业内部保密的npm仓库；
    7. 高质量的npm包：良好的测试、良好的文档、良好的测试覆盖率、编码规范；
7. 前后端共用模块
    1. 后端模块获取是磁盘读取，可以同步引入；但是前端模块是通过网络加载，需要支持异步引入；
    2. 后端模块：CommonJS规范；
    3. 前端模块：AMD、CMD
    ```JavaScript
    // AMD
    define(['dep1', 'dep2'], function(dep1, dep2) {
        return function() {};
    })
    // CMD
    define(function(require, export, module) {
        // module code
    });
    ```
    4. 兼容多种模块规范：检测运行环境，包装模块；
    
### 第三章 异步I/O

1. 为什么要异步I/O:
    1. 多线程：状态同步、死锁的问题；
    2. 同步I/O：阻塞；
    3. Node: 单线程、异步I/O，分配资源更高效；
2. 异步I/O的实现现状：(实际上非阻塞和异步是不一样的)
    1. 非阻塞I/O：为获取完整数据，应用程序需要重复调用I/O操作来确认是否完成，这种技术叫轮询；
    2. 异步I/O的实现：一个主线程来做计算处理，其他线程进行I/O操作(阻塞或非阻塞)，通过线程的通信将I/O的数据进行传递，这就实现了异步I/O；
    3. Node是单线程的，但仅仅是JavaScript执行在单线程中，内部完成I/O任务的另有线程池；
3. Node的异步I/O：事件循环、观察者、I/O线程池(书本P59页流程图很清晰)；
4. 非I/O的异步API：
    1. setTimeOut(), setTimeInterval();
    2. process.nextTick(), setImmediate();
    ```JavaScript
    // process.nextTick()的回调函数保存在一个数组中，setImmediate()的结果保存在链表中；
    // process.nextTick()在每一轮循环中会将数组中的回调函数全部执行完毕，而setImmediate()在每轮循环中执行链表中的一个回调函数；
    process.nextTick(function() {
        console.log('nextTick延迟执行1');
    });
    process.nextTick(function() {
        console.log('nextTick延迟执行2');
    });
    setImmediate(function() {
        console.log('setImmediate延迟执行1');
        // 进入下次循环
        process.nextTick(function() {
            console.log('强势插入');
        });
    });
    setImmediate(function() {
        console.log('setImmediate延迟执行2');
    });
    console.log('正常执行');
    
    正常执行
    nextTick延迟执行1
    nextTick延迟执行2
    setImmediate延迟执行1
    强势插入
    setImmediate延迟执行2
    ```
5. 事件驱动与高性能服务器
    1. 经典服务器模型：同步式、每进程/每请求、每线程/每请求(Apache)；
    2. Node通过事件驱动的方式处理请求，无需为每个请求创建额外的对应线程；知名服务器Nginx，也摒弃了多线程的方式，采用了和Node相同的事件驱动；

### 第四章 异步编程

1. 函数式编程：
    1. 高阶函数
    ```JavaScript
    function(x) {
        return function() {
            return x;
        }
    }
    ```
    2. 偏函数用法
    ```JavaScript
    // 有冗余
    var toString = Object.prototype.toString;
    var isString = function(obj) {
        return toString.call(obj) == '[object String]';
    };
    var isFunction = function(obj) {
        return toString.call(obj) == '[object Function]';
    };
    // 偏函数用法
    var isType = function(type) {
        return function(obj) {
            return toString.call(obj) == '[object ' + type + ']';
        };
    }
    var isString = isType('String');
    var isFunction = isType('Function');
    ```
2. 异步编程的优势与难点
    1. 优势：
        1. Node带来的最大特性莫过于基于事件驱动的非阻塞I/O模型；
        2. Node是为了解决编程模型中阻塞I/O的性能问题的，采用了单线程模型，这导致了Node更像一个处理I/O密集的能手，而CPU密集型就取决于管家的能耐如何；
        3. 防止任何一个计算耗费过多的CPU时间片，建议CPU的耗用不要超过10ms，或者将大量的计算分解为诸多的小量计算，通过setImmediate()进行调度；
    2. 难点：
        1. 异常处理：不能同步捕获回调函数的异常，只能将异常作为回调函数的第一个参数传回；
        2. 函数嵌套过深；
        3. 阻塞代码；
        4. 多线程编程：child_process；
        5. 异步转同步；
3. 异步编程解决方案：
    1. 事件发布/订阅模式：事件emitter对象；
    2. Promise/Deferred模式：书本P90-91页有Promise的实现原理(为啥promise只会决议一次 shift);
    3. 流程控制库：尾触发与Next、async、step、wind；
4. 异步并发控制：异步发起并发调用，如果并发量过大，下层服务器会吃不消；
    1. bagpipe模块
    ```JavaScript
    var Bagpipe = require('bagpipe');
    var bagpipe = new Bagpipe(
        10, // 设定罪罚并发数10
        refuse: true, // 如果等待的调用队列满了，新来的直接返回拒绝异常
        timeout: 3000, // 设置单个异步调用的最大执行时间
    );
    for (var i = 0; i < 100; i++) {
        bagpipe.push(async, function() {
            // 异步回调执行
        })
    }
    bagpipe.on('full', function(length) {
        console.warn('底层系统处理不能及时完成，队列拥堵，目前队列长度为：' + length);
    });
    ```
    2. async的解决方案

### 第五章 内存控制

1. V8的垃圾回收机制与内存限制
    1. Node基于V8构建，而V8的内存管理机制主要面向浏览器的应用场景，所以在内存使用方面做了限制，只能使用部分内存(64位系统下约为1.4G，32位系统下约为0.7G)；
    2. V8的对象分配
        1. V8中，所有JavaScript对象都是通过堆来进行分配的；
        2. V8为何要限制堆的大小，因为垃圾回收会引起JavaScript线程暂停执行，堆的大小直接影响垃圾回收的性能；
        3. Node在启动时可以传递--max-old-space-size或--max-new-space-size来调整内存限制的大小；
    3. V8的垃圾回收机制(详细看书本P113)
        1. V8的内存分代：
            1. 新生代：存储存活时间较短的对象(64位-32MB, 32位-16MB)；
            2. 老生代：存活时间较长或者常驻内存的对象(64位-1400MB, 32位700MB)；
        2. 垃圾回收算法：
            1. 新生代(Scavenge算法)：垃圾回收时，From空降中的存货对象会被复制到To空间中，切换闲置和使用中的状态；牺牲空间换取时间的算法；From空间中的存活对象在复制到To空间之前需要进行检查是否经历过Scavenge回收，如果是，则直接移动对象到老生代空间中；
            2. 老生代(Mark-Sweep & Mark-Compact)：Mark-Sweep清理死亡对象；Mark-Compact整理内存空间，解决清理死亡对象后内存不连续的问题；
        3. 查看垃圾回收日志
2. 高效使用内存：在正常的JavaScript执行中，无法立即回收的内存有闭包和全局变量引用这两种情况；
3. 内存指标：
    1. 查看内存使用情况：
        1. 查看进程的内存占用：process.memoryUsage();
        2. 查看系统的内存占用：os模块的totalmem()和freemem()；
    2. Node的内存构成主要由通过V8进行分配的部分和Node自行分配的部分，受V8的垃圾回收限制的主要是V8的堆内存，而Buffer对象制类的不同于其他对象，属于堆外内存，不受V8限制；
4. 内存泄漏：缓存、队列消费不及时、作用域未释放；
    1. 慎将内存做缓存：如果利用JavaScript对象键值来缓存东西，则需要限定缓存对象的大小，防止内存无限增长；
    ```JavaScript
    var LimitableMap = function(limit) {
        this.limit = limit || 10;
        this.map = {};
        this.keys = [];
    };
    var hasOwnProperty = Object.propotype.hasOwnProperty;
    LimitableMap.prototype.set = function(key, value) {
        var map = this.map;
        var keys = this.keys;
        if (!hasOwnProperty.call(map, key)) {
            if (keys.length === this.limit) {
                var firstKey = keys.shift();
                delete map[firstKey];
            }
            keys.push(key);
        }
        map[key] = value;
    };
    LimitableMap.prototype.get = function(key) {
        return this.map[key];
    };
    module.export = LimitableMap;
    ```
    2. 缓存的解决方案：采用进程外的缓存，减少进程常驻对象的数量，进程之间还可以共享缓存；
        1. Redis
        2. Memcached
    3. 关注队列状态：
        1. 队列的消费速度低于生成速度，将会形成堆积；
        2. 引入Bagpipe模块，管理队列，控制队列长度和使回调都具有可控的响应时间；
5. 内存泄漏排查：主要通过对堆内存进行分析；
    1. node-heapdump
    2. node-memwatch
6. 大文件应用：由于Node的内存限制，操作大文件需要小心，可以用stream的方式处理大文件；
```JavaScript
var reader = fs.createReadStream('in.txt');
var writer = fs.createWriterStream('out.txt');
reader.pipe(writer);
```

### 第六章 理解Buffer

1. Buffer结构：Buffer是一个像Array的对象，它将性能相关的部分用C++实现，将非性能相关的部分用JavaScript实现；
2. Buffer对象：Buffer对象类似数组，它的元素为16进制的两位数；
3. Buffer内存分配：Buffer的内存分配不是在V8的堆内存中，而是在Node的C++层面实现内存的申请的；
4. Buffer的转换：ASCII, UTF-8, UTF-16LE/UCS-2, Base64, Binary, Hex;
```JavaScript
new Buffer(str, [encoding]); // 字符串转Buffer
Buffer.toString([encoding], [start], [end]); // Buffer转字符串
```
5. Buffer的拼接：
    1. 问题描述：Buffer的使用场景中，通常是一段一段的方式传输的，英文不会出现问题，但是遇到中文宽字符编码时(中文在utf-8下占3个字节)，就可能会出现中文乱码问题；
    ```JavaScript
    var fs = require('fs');
    var rs = fs.createReadStream(test.md);
    var data = '';
    rs.on('data', function(chunk) { // chunk对象即是Buffer对象
        data += chunk; // 这里的 += 操作隐藏了toString()操作
    });
    rs.on('end', function() {
        console.log(data);
    });
    ```
    2. 解决方案：
    ```JavaScript
    // 1. setEncoding()
    var fs = require('fs');
    var rs = fs.createReadStream(test.md);
    rs.setEncoding('utf-8');
    var data = '';
    rs.on('data', function(chunk) { 
        data += chunk; 
    });
    rs.on('end', function() {
        console.log(data);
    });
    // 2. 正确拼接Buffer
    var chunks = [];
    var size = 0;
    var rs = fs.createReadStream(test.md);
    rs.on('data', function(chunk) { 
        chunks.push(chunk);
        size += chunk.length;
    });
    rs.on('end', function() {
        var buf = Buffer.concat(chunks, size);
        var str = iconv.decode(buf, 'utf-8');
        console.log(str);
    });
    ```
6. Buffer与性能：
    1. Buffer在文件I/O和网络I/O中运用广泛，尤其在网络传输中，性能举足轻重；
    2. 文件读取时，highWaterMark设置对大文件读取的性能有影响；
    3. Buffer时二进制数据，字符串与Buffer之间存在编码关系；

### 第七章 网络编程

1. 构建TCP服务
    1. TCP：传输控制协议，属于传输层协议，三次握手；
    2. 创建TCP服务器端
    ```JavaScript
    var net = require('net');
    var server = net.createServer(function(socket) {
        // 新的连接
        socket.on('data', function(data) {
            socket.write('你好');
        })
        socket.on('end', function() {
            console.log('连接断开');
        });
        wocket.write('欢迎光临');
    });
    server.listen(8124, function() {
        console.log('server bound');
    });
    ```
    3. TCP服务的事件；优化策略(Nagle算法: 小数据合并延迟发送);
2. 构建UDP服务
    1. UDP：用户数据包协议，属于传输层协议，不是面向连接的；
    2. 创建UDP服务器端
    ```JavaScript
    var dgram = require('dgram');
    var server = dgram.createSocket('udp4');
    server.on('message', function(mes, rinfo) {
        console.log('server got:' + msg + 'from' + rinfo.address + ':' + rinfo.port);
    });
    server.on('listening', function() {
        var adress = server.adress();
        console.log('server listening ' + address.address + ':' + address.port);
    });
    server.bind(41234);
    ```
3. 构建HTTP服务
    1. HTTP报文：TCP的3次握手 -> 客户端向服务器端发送请求报文 -> 服务器端向客户端发送响应内容 -> 结束会话；
    2. 创建HTTP服务器端
    ```JavaScript
    var http = require('http');
    http.createServer(function(req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello Wrold\n');
    }).listen(1337, '127.0.0.1');
    console.log('Server running at http://127.0.0.1:1337/');
    ```
    3. http模块：
        1. HTTP服务继承自TCP服务器；
        2. 开启keepalive后，一个TCP会话可以用于多次请求和响应；
        3. TCP服务以connection为单位进行服务，HTTP服务以request为单位进行服务;
        4. http模块即是将connection到request得过程进行了封装；
        5. http模块将连接所用套接字得读写抽象为ServerRequest和ServerResponse对象；
    4. HTTP服务的事件；
    5. HTTP客户端
        1. HTTP代理：为了重用TCP连接，http模块有一个默认得客户端代理对象http.globalAgent，它控制ClientRequest对象对同一服务器端发起的HTTP请求最多可以创建5个连接；这与浏览器对同一个域名有下载连接数得限制是相同得行为；
4. WebSocket协议：客户端与服务器端只建立一个TCP连接，可以使用更少的连接；
    1. WebSocket握手部分是由HTTP完成的，但是它是在TCP上定义独立的协议；相比HTTP，WebSocket更接近于传输层协议；
    2. WebSocket握手：客户端通过HTTP发送请求报文，请求服务器端升级为WebSocket；服务器端告知客户端正在更换协议；
    3. WebSocket数据传输：客户端和服务器端都可以接受和发送消息；为了安全考虑，客户端需要对发送的数据帧进行掩码处理，而服务器发送到客户端的数据则无须做掩码处理；
5. 网络服务与安全
    1. TLS/SSL：是一个公钥/私钥的结构；SSL组为一种安全协议，它在传输层上提供对网络连接加密的功能；数字证书来进行认证；
    2. HTTPS：就是工作在TLS/SSL上的HTTP；

### 第八章 构建Web应用

1. 基础功能
    ```JavaScript
    var http = require('http');
    var app = function(req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello Wrold\n');
    };
    http.createServer(app).listen(1337, '127.0.0.1');
    console.log('Server running at http://127.0.0.1:1337/');
    
    // Express之类的框架都是从app函数展开
    var app = express();
    http.createServer(app).listen(1337);
    ```
    1. 请求方法：req.method
    2. 路径解析：req.url
    3. 查询字符串
    4. Cookie：标识用户状态；
        1. 处理步骤：服务器端向客户端发送cookie -> 浏览器将Cookie保存 -> 之后浏览器每次将会Cookie法向服务器端；
        2. 服务器端设置Cookie参数的时候，可以设定允不允许前端JS修改Cookie；
        3. 性能：规范好cookie的path，避免发送无用的Cookie；
    5. Session：将用户标识数据存储在服务器端；
        1. Cookie的问题：
            1. 数据都放在Cookie中，容易导致Cookie体积过大；
            2. 前端可以获取修改Cookie中的内容，不安全；
        2. Session方案：用户数据保存在后端服务器，给前端返回一个口令(session_id)来实现客户与服务器中数据的映射；
            1. 基于Cookie来实现用户与数据的映射：将口令放在Cookie中返回给前端；
            2. 通过查询字符串来实现浏览器和服务器端数据的对应：将口令作为url参数传递；
        3. Session与内存：将Session数据从Node进程内存中转移到第三方缓存中，如Redis；
        4. Session与安全：
            1. XSS(Cross Site Scripting)攻击，可以通过Cookie拿到口令；
            2. 将口令通过私钥加密进行签名，来提高伪造的成本；
    6. 缓存：
        1. 方案一：每次询问服务器端是否有更新，携带本地缓存文件的最后修改时间，发送给服务器端进行比较；
        2. 方案二：利用Catch-Control设置缓存倒计时，更新资源时，更改文件路径上的版本号即可废弃缓存；
    7. Basic认证：客户端与服务器端进行请求时，允许通过用户名和密码实现的一种身份认证的方式(不够安全)；
2. 数据上传：Node的http模块只对HTTP报文的头部进行了解析，内容需要用户自行解析，可以通过报头的Transfer-Encoding或Content-Length即可判断请求中是否有带有内容；
    1. 表单数据、JSON、XML、附件上传：
    ```JavaScript
    function(req, res) {
        if (hasBody(req)) {
            var done = function() {
                handle(req, res);
            };
            if (mime(req) === 'application/x-www-form-urlencoded') {
                parseUrl(req, done);
            } else if (mime(req) === 'application/json') {
                parseJSON(req, done);
            } else if (mime(req) === 'application/xml') {
                parseXML(req, done);
            } else if (mime(req) === 'application/form-data') {
                parseMultipart(req, done);
            }
        } else {
            handle(req, res);
        }
    }
    ```
    2. 数据上传与安全：
        1. 内存限制：
            1. 限制上传内容的大小，一旦超过限制，停止接受数据，并响应400状态码；
            2. 通过流式解析，将数据导入到磁盘中，Node只保留文件路径等小数据；
        2. CSRF(Cross-Site Request Forgery 跨站请求伪造)；
3. 路由解析：
    1. 文件路径型：URL的路径与网站资源的路径一致；
    2. MVC：路由解析，根据URL找到对应的控制器 -> 行为调用相关模型，操作数据 -> 操作数据结束后，渲染视图；
        1. 手工映射：手工配置URL到控制器的映射；
        ```JavaScript
        // 还有路径正则匹配和参数解析的部分
        var routes = [];
        var use = function(req, res) {
            routes.push([path, action]);  
        };
        function (req, res) {
            var pathname = url.parse(req.url).pathname;
            for (var i = 0; i < routes.length; i++) {
                var route = routes[i];
                if (pathname === route[0]) {
                    var action = route[1];
                    action(req, res);
                    return;
                }
            }
            handle404(req, res);
        };
        // 业务逻辑
        var setting = function(req, res) {
            // ...
        };
        use('/use/setting', setting);
        ```
        2. 自然映射：
            1. 并非无路由，而是路由按照一种约定方式自然而然地实现了路由，而无需去维护路由映射；
            2. /controller/action/param1/param2/param3：以/user/setting/12为例，它会按照约定去找controllers目录下地user文件，调用它地setting方法，12为参数；
    3. RESTful：
        1. 通过URL设计资源；
        2. 请求方法定义资源地操纵；
        3. 通过Accept决定资源地表现形式(文件类型/后缀)；
        ```JavaScript
        // 书中还有一些具体地路径匹配方法
        var routes = { 'all': [] };
        var app = {};
        app.use = function(path, action) {
            routes.all.push([pathRegexp(path), action]);
        };
        ['get', 'put', 'delete', 'post'].forEach(function(method) {
            routes[method] = [];
            app[method] = function(path, action) {
                routes[method].push([pathRegexp(path), action]);
            };
        });
        // 业务逻辑
        app.post('/user/:username', addUser);
        ```
4. 中间件：对于单个中间件，它足够简单；组合使用，能发挥出强大能量；
```JavaScript
// 书中有中间件实现细节
app.use(querystring); // 全局中间件
app.use(cookie);
app.get('/use/:usename', getUser); // 局部中间件
```
5. 页面渲染
    1. 内容响应：
        1. MIME
        2. 附件下载：Content-Disposition字段设置返回数据是即使浏览地内容还是可下载地附件；
        3. 响应JSON
        4. 响应跳转
    2. 视图渲染
    3. 模板
        1. new Function和with地应用；
        2. 模板安全(XSS漏洞)：转义，将能够形成HTML标签地字符转换为安全地字符( & < > " ' );
        ```JavaScript
        // 转义函数
        var escape = function(html) {
            return String(html)
                .replace(/&(?!\w+;)/g, '&amp')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt')
                .replace(/"/g, '&quto;')
                .replace(/'/g, '&#039');
        };
        ```
        3. 模板逻辑
        4. 集成文件系统
        5. 子模版
        6. 布局视图
        7. 模板性能
    4. Bigpipe：前后端配合实现地优化技术；
        1. 先渲染页面布局
        2. 后端持续性地数据输出
        3. 前端渲染
        
### 第九章 玩转进程

1. 服务模型地变迁：同步 -> 复制进程 -> 多线程 -> 事件驱动
2. 多进程架构：面对单进程单线程对多核使用不足额问题，启动多进程为了充分利用CPU资源；理想状态下每个进程各自利用一个CPU，以此实现多核CPU地利用；
    1. 创建子进程：spawn(), exec(), execFile(), fork();(事实上后面3钟方法都是spawn()地延伸应用)
    2. 进程间通信：
        1. onmessage(), postMessage();
        2. 进程间通信原理(ICP)：父进程在创建子进程之前，会创建ICP通道并监听它，然后真正创建出子进程，并通过环境变量告诉子进程这个ICP通道地文件描述符。子进程在启动地过程中，根据文件描述符去连接这个已存在地ICP通道，从而完成父子进程地连接；
    3. 句柄传递：解决不同进程不能监听相同端口的问题；
3. 集群稳定之路：用child_process模块在单机上搭建Node集群；
    1. 进程事件：error, exit, close, disconnect
    2. 自动重启：监听子进程的exit事件来获知其退出的信息，然后重新启动一个工作进程来继续服务；
        1. 自杀信号：提前重启一个新进程；
        2. 限量重启；
    3. 负载均衡：分清进程的CPU、I/O两部分的繁忙程度；
    4. 状态共享：
        1. 第三方数据存储；
        2. 主动通知：单独设置一个进程进行轮询第三方数据的变化，然后通知各个工作进程；
4. Cluster模块：进程管理，隐藏child_process的一些细节；
    ```JavaScript
    // cluster.js (主进程)
    var cluster = require('cluster');
    cluster.setupMaster({
        exec: 'worker.js'
    });
    var cpus = require('os').cpus();
    for (var i = 0; i < cpus.length; i++) {
        cluster.fork();
    }
    
    // worker.js (子进程)
    var http = require('http');
    http.createServer(function(req, res) {
        res.writeHead(200);
        res.end('hello world');
    }).listen(8000);
    ```
    1. Cluster事件
    2. cluster模块应用中，一个主进程只能管理一组工作进程；通过child_process操作子进程时更灵活；

### 第十章 测试

1. 单元测试：测试用例、测试覆盖率；
2. 性能测试：
    1. 基准测试：统计多少时间内执行了多少次某个方法，一般会以次数作为参照，然后比较时间；(benchmark模块)
    2. 压力测试：对网络接口做压力测试需要考查的几个指标有吞吐率、响应时间和并发数；最常用的工具是ab, siegn, http_load等；还有一个比较重要的指标是QPS(Requests per second)，它标识每秒能处理多少请求；
    3. 启动多个进程，并没有显著提升QPS；
    4. 测试数据与业务数据的转换：QPS = PV / 24h; (PV是日均访问量，时间可能还要小，因为一般集中在某段时间内)

### 第十一章 产品化

1. 项目工程化：
    1. 目录结构
    2. 构建工具：Makefile, grunt;
    3. 编码风格：ESLint + 提交前验证；
2. 部署流程：
    1. 部署环境：代码 -> stage -> pre-release -> product
    2. 部署操作
3. 性能：
    1. 动静分离：Node处理静态文件的能力不算突出，所以让Node只处理动态请求即可；将静态资源都引导到专业的静态服务器上，如Nginx或者专业的CDN；
    2. 启用缓存：第三方缓存Redis；
    3. 多进程架构：cluster模块；
    4. 读写分离：数据库的读操作远远高于写操作，为了提升性能，通常会经常数据库的读写分离；
4. 日志
5. 监控警报：
    1. 监控：日志监控、响应时间、进程监控、磁盘监控、内存监控、CPU占用监控等；
    2. 警报：邮件警报(nodemailer模块)，短信电话；
6. 稳定性：多机器，多机房，容灾备份；