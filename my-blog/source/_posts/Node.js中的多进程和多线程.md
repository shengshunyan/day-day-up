---
title: Node.js中的多进程和多线程
date: 2021-03-31
keywords: Node.js, 多进程, 多线程
cover: https://i.loli.net/2021/03/30/ZIYlOPU2XhqK6JS.jpg
tags:
     - JavaScript
---

{% note info no-icon %}
参考摘录：
 - [《试玩NodeJS多进程》](https://blog.csdn.net/hongchh/article/details/79898816)
 - [《深入理解Node.js 进程与线程》](https://zhuanlan.zhihu.com/p/77733656)
 - [《理解Node.js中的"多线程"》](https://zhuanlan.zhihu.com/p/74879045)
{% endnote %}


## 背景

我们知道，在一台计算机中，我们可以同时打开许多软件，比如同时浏览网页、听音乐、打字等等，看似非常正常。但仔细想想，为什么计算机可以做到这么多软件同时运行呢？这就涉及到计算机中的两个重要概念：多进程和多线程了。

每个 ***进程*** 都至少有一个线程。 一般，系统创建一个进程的开销是比较大的，需要分配内存，内核资源等等。 不同进程间无法直接共享彼此拥有的这些资源。

我们可以在同一进程内创建多个 ***线程***，这些线程相对来说‘轻量级’很多，可以认为线程是 个‘轻量级’进程，它们可以共享所在进程的各种资源。

<br/>


## Node.js 中的进程与线程

***Node.js是单进程单线程的:***

 - Node.js 虽然是单线程模型，但是其基于事件驱动、异步非阻塞模式，Node自身还有I/O线程存在（网络I/O、磁盘I/O），可以应用于高并发场景，避免了线程创建、线程之间上下文切换所产生的资源开销；
 - 当你的项目中需要有大量计算，CPU 耗时的操作时候，Node.js提供了API来实现多进程和多线程，发挥多核CPU的性能；
 - Node.js 开发过程中，错误会引起整个应用退出，应用的健壮性值得考验，尤其是错误的异常抛出，以及进程守护是必须要做的；

> 科普：在 Web 服务器方面，著名的 Nginx 也是采用此模式（事件驱动），避免了多线程的线程创建、线程上下文切换的开销，Nginx 采用 C 语言进行编写，主要用来做高性能的 Web 服务器，不适合做业务。

Web业务开发中，如果你有高并发应用场景那么 Node.js 会是你不错的选择。

在单核 CPU 系统之上我们采用 单进程 + 单线程 的模式来开发。在多核 CPU 系统之上，可以通过 child_process.fork 开启多个进程（Node.js 在 v0.8 版本之后新增了Cluster 来实现多进程架构） ，即 多进程 + 单线程 模式。**注意：开启多进程不是为了解决高并发，主要是解决了单进程模式下 Node.js CPU 利用率不足的情况，充分利用多核 CPU 的性能。**

***Node.js关于单线程的误区:***

大家常说的 Node 是单线程的指的是 JavaScript 的执行是单线程的(开发者编写的代码运行在单线程环境中)，但 Javascript 的宿主环境，无论是 Node 还是浏览器都是多线程的因为libuv中有线程池的概念存在的，libuv会通过类似线程池的实现来模拟不同操作系统的异步调用，这对开发者来说是不可见的。

Node 中最核心的是 v8 引擎，在 Node 启动后，会创建 v8 的实例，这个实例是多线程的:
 - 主线程：编译、执行代码
 - 编译/优化线程：在主线程执行的时候，可以优化代码
 - 分析器线程：记录分析代码运行时间，为 Crankshaft 优化代码执行提供依据
 - 垃圾回收的几个线程

<br/>


## 多进程

NodeJS的JavaScript运行在单个进程的单个线程上，一个JavaScript执行进程只能利用一个CPU核心，而如今大多数CPU均为多核CPU，为了充分利用CPU资源，Node提供了 **child_process** 和 **cluster** 模块来实现多进程以及进程管理。

<br/>

### child_process

child_process模块提供了spawn()、exec()、execFile()、fork()这4个方法用于创建子进程：

 - **child_process.spawn()**：在子线程开始执行后，就开始不断将数据从子进程返回给主进程。从语法中我们可以发现与exec的一个区别是spawn是不支持callback函数的，它通过流的方式发数据传给主进程，从而实现了多进程之间的数据交换。适用于返回大量数据，例如图像处理，二进制数据处理。
 - **child_process.exec()**：在子进程输出结果放在buffer中，在结果返回完全之后，再将输出一次性地以回调函数参数的形式返回。适用于小量数据，maxBuffer 默认值为 200 * 1024 超出这个默认值将会导致程序崩溃，数据量过大可采用 spawn。
 - **child_process.execFile()**：类似 child_process.exec()，区别是不能通过 shell 来执行，不支持像 I/O 重定向和文件查找这样的行为
 - **child_process.fork()**： 衍生新的进程，进程之间是相互独立的，每个进程都有自己的 V8 实例、内存，系统资源是有限的，不建议衍生太多的子进程出来，通长根据系统** CPU 核心数**设置。

> 比如要运行 du -sh /disk1 命令， 使用 **spawn** 函数需要写成spawn(‘du‘, [‘-sh ‘, ‘/disk1’])，参数配置比较麻烦；而使用 **exec** 函数时，可以直接写成exec(‘du -sh /disk1’)。exec是会先进行Shell语法解析，因此用exec函数可以更方便的使用复杂的Shell命令，包括管道、重定向等。

本文中，我们将使用fork()方法来创建子进程，fork()方法只需指定要执行的JavaScript文件模块，即可创建Node的子进程。

1.  进程创建

    /src/master.js
    ```JavaScript
    const childProcess = require('child_process')
    const cpuNum = require('os').cpus().length

    for (let i = 0; i < cpuNum; i++) {
        childProcess.fork('./worker.js')
    }

    console.log('Master: Hello world.')
    ```

    /src/worker.js
    ```JavaScript
    console.log('Worker-' + process.pid + ': Hello world.')
    ```

    输出
    ```shell
    $ node index.js
    Master: Hello world.
    Worker-88268: Hello world.
    Worker-88269: Hello world.
    Worker-88271: Hello world.
    Worker-88272: Hello world.
    Worker-88270: Hello world.
    Worker-88273: Hello world.
    Worker-88274: Hello world.
    Worker-88275: Hello world.
    ```

2. 父子进程间的通信

    创建worker之后，接下来实现master和worker之间的通信。Node父子进程之间可以通过on('message')和send()来实现通信。

    master进程中调用child_process的fork()方法后会得到一个子进程的实例，通过这个实例可以监听来自子进程的消息或者向子进程发送消息。worker进程则通过process对象接口监听来自父进程的消息或者向父进程发送消息。

    ![WX20210330-200624@2x.png](https://i.loli.net/2021/03/30/BNjYqpzOZabM2o8.png)

    /src/master.js
    ```JavaScript
    const childProcess = require('child_process')
    const worker = childProcess.fork('./worker.js')

    worker.send('Hello world.')

    worker.on('message', (msg) => {
        console.log('[Master] Received message from worker: ' + msg)
    })
    ```

    /src/worker.js
    ```JavaScript
    process.on('message', (msg) => {
        console.log('[Worker] Received message from master: ' + msg)
        process.send('Hi master.')
    })
    ```

    输出
    ```shell
    $ node index.js
    [Worker] Received message from master: Hello world.
    [Master] Received message from worker: Hi master.
    ```

3. 负载均衡（Master分发请求给Worker处理）

    进程通信时使用到的send()方法，除了发送普通的对象之外，还可以用于发送 **句柄**。句柄是一种引用，可以用来标识资源，例如通过句柄可以标识一个socket对象、一个server对象等。利用句柄传递，可以实现请求的分发。

    master进程创建一个TCP服务器监听特定端口，收到客户端的请求后，会得到一个socket对象，通过这个socket对象可以跟客户端进行通信从而处理客户端的请求。master进程可以通过句柄传递将该socket对象发送给worker进程，让worker进程去处理请求。

    ![WX20210330-202047@2x.png](https://i.loli.net/2021/03/30/H7WMAQfBDzjOYIG.png)

    /src/master.js
    ```JavaScript
    const childProcess = require('child_process')
    const net = require('net')
    const cpuNum = require('os').cpus().length

    // 创建工作进程
    let workers = []
    let cur = 0
    for (let i = 0; i < cpuNum; ++i) {
        workers.push(childProcess.fork('./worker.js'))
        console.log('Create worker-' + workers[i].pid)
    }

    // 创建TCP服务器
    const server = net.createServer()

    // 服务器收到请求后分发给工作进程去处理
    // 通过轮转方式实现工作进程的负载均衡
    server.on('connection', (socket) => {
        workers[cur].send('socket', socket)
        cur = Number.parseInt((cur + 1) % cpuNum)
    })

    server.listen(8080, () => {
        console.log('TCP server: 127.0.0.1:8080')
    })
    ```

    /src/worker.js
    ```JavaScript
    process.on('message', (msg, socket) => {
        if (msg === 'socket' && socket) {
            // 利用setTimeout模拟处理请求时的操作耗时
            setTimeout(() => {
                socket.end('Request handled by worker-' + process.pid)
            }, 10)
        }
    })
    ```

    /src/tcp_client.js
    ```JavaScript
    const net = require('net')
    const maxConnectCount = 10

    for (let i = 0; i < maxConnectCount; ++i) {
        net.createConnection({
            port: 8080,
            host: '127.0.0.1'
        }).on('data', (data) => {
            console.log(data.toString())
        })
    }
    ```

    先执行node master.js启动服务器，然后执行node tcp_client.js启动客户端。得到的结果如下，10个请求被分发到不同服务器上进行处理，并且可以看到master中的轮转分发请求起到了作用，实现了简单的负载均衡。

4. 进程重启

    worker进程可能因为某些异常情况而退出，为了提高集群的稳定性，master进程需要监听子进程的存活状态，当子进程退出之后，master进程要及时重启新的子进程。在Node中，子进程退出时，会在父进程中触发exit事件。父进程只需通过监听该事件便可知道子进程是否退出，并在退出的时候做出相应的处理。

    /src/master.js
    ```JavaScript
    const childProcess = require('child_process')
    const net = require('net')
    const cpuNum = require('os').cpus().length

    // 创建工作进程
    let workers = []
    let cur = 0
    for (let i = 0; i < cpuNum; ++i) {
        const newProcess = childProcess.fork('./worker.js')
        workers.push(newProcess)
        console.log('Create worker-' + workers[i].pid)

        // 工作进程退出后重启
        newProcess.on('exit', () => {
            console.log('Worker-' + newProcess.pid + ' exited')
            workers[i] = childProcess.fork('./worker.js')
            console.log('Create worker-' + childProcess.pid)
        })
    }

    // 创建TCP服务器
    const server = net.createServer()

    // 服务器收到请求后分发给工作进程去处理
    // 通过轮转方式实现工作进程的负载均衡
    server.on('connection', (socket) => {
        workers[cur].send('socket', socket)
        cur = Number.parseInt((cur + 1) % cpuNum)
    })

    server.listen(8080, () => {
        console.log('TCP server: 127.0.0.1:8080')
    })
    ```

    执行node master.js启动服务器后，可以通过任务管理器直接杀掉进程来模拟进程异常退出。可以看到worker进程退出后，master能够发现并及时创建新的worker进程。任务管理器中的Node进程数量恢复原样。

<br/>

### cluster

前面简单描述了使用child_process实现单机Node集群的做法，需要处理挺多的细节。Node提供了 **cluster** 模块，该模块提供了更完善的API，除了能够实现多进程充分利用CPU资源以外，还能够帮助我们更好地进行进程管理和处理进程的健壮性问题。

cluster模块调用fork方法来创建子进程，该方法与child_process中的fork是同一个方法。
cluster模块采用的是经典的主从模型，Cluster会创建一个master，然后根据你指定的数量复制出多个子进程，可以使用 **cluster.isMaster** 属性判断当前进程是master还是worker(工作进程)。由master进程来管理所有的子进程，主进程不负责具体的任务处理，主要工作是负责调度和管理。

cluster模块使用内置的负载均衡来更好地处理线程之间的压力，该负载均衡使用了Round-robin算法（也被称之为循环算法）。当使用Round-robin调度策略时，master accepts()所有传入的连接请求，然后将相应的TCP请求处理发送给选中的工作进程（该方式仍然通过IPC来进行通信）。

> **question:** 如果多个Node进程监听同一个端口时会出现 Error:listen EADDRIUNS的错误，而cluster模块为什么可以让多个子进程监听同一个端口呢?
> **answer:** 原因是master进程内部启动了一个TCP服务器，而真正监听端口的只有这个服务器，当来自前端的请求触发服务器的connection事件后，master会将对应的socket具柄发送给子进程。

![WX20210330-205427.png](https://i.loli.net/2021/03/30/M4EK9tSkFVLjoCG.png)

/src/server.js

```JavaScript
const cluster = require('cluster')

if (cluster.isMaster) {
    /* master进程 */
    const cpuNum = require('os').cpus().length

    for (let i = 0; i < cpuNum; ++i) {
        cluster.fork()
    }

    // 创建进程完成后输出提示信息
    cluster.on('online', (worker) => {
        console.log('Create worker-' + worker.process.pid)
    })

    // 子进程退出后重启
    cluster.on('exit', (worker, code, signal) => {
        console.log('[Master] worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal)
        cluster.fork()
    })
} else {
    /* worker进程 */
    const net = require('net')
    net.createServer().on('connection', (socket) => {
        // 利用setTimeout模拟处理请求时的操作耗时
        setTimeout(() => {
            socket.end('Request handled by worker-' + process.pid)
        }, 10)
    }).listen(8080)
}
```

<br/>

### process 模块

Node.js 中的进程 Process 是一个全局对象，无需 require 直接使用，给我们提供了当前进程中的相关信息。

 - process.env：环境变量，例如通过 process.env.NODE_ENV 获取不同环境项目配置信息
 - process.nextTick：这个在谈及 Event Loop 时经常为会提到
 - process.pid：获取当前进程id
 - process.ppid：当前进程对应的父进程
 - process.cwd()：获取当前进程工作目录，
 - process.platform：获取当前进程运行的操作系统平台
 - process.uptime()：当前进程已运行时间，例如：pm2 守护进程的 uptime 值
 - 进程事件：process.on(‘uncaughtException’, cb) 捕获异常信息、process.on(‘exit’, cb）进程退出监听
 - 三个标准流：process.stdout 标准输出、process.stdin 标准输入、process.stderr 标准错误输出
 - process.title 指定进程名称，有的时候需要给进程指定一个名称

<br/>

### Node.js进程通信原理

前面讲解的无论是child_process模块，还是cluster模块，都需要主进程和工作进程之间的通信。通过fork()或者其他API，创建了子进程之后，为了实现父子进程之间的通信，父子进程之间才能通过message和send()传递信息。

**IPC（Inter-Process Communication）** 即进程间通信。它的目的是为了让不同的进程能够互相访问资源并进行协调工作。实现进程间通信的技术有很多，如命名管道，匿名管道，socket，信号量，共享内存，消息队列等。Node中实现IPC通道是依赖于libuv。windows下由命名管道(name pipe)实现，*nix系统则采用Unix Domain Socket实现。表现在应用层上的进程间通信只有简单的message事件和send()方法，接口十分简洁和消息化。

![v2-518e2ec8816885ce4fa45798d257e1f6_720w.png](https://i.loli.net/2021/03/31/bAaDEgesJLcGfZM.png)

父进程在实际创建子进程之前，会创建IPC通道并监听它，然后才真正的创建出子进程，这个过程中也会通过环境变量（NODE_CHANNEL_FD）告诉子进程这个IPC通道的文件描述符。子进程在启动的过程中，根据文件描述符去连接这个已存在的IPC通道，从而完成父子进程之间的连接。

![v2-326116010971a13290994bc751f117c0_720w.jpeg](https://i.loli.net/2021/03/31/VbL9hC6D2gK1jTw.jpg)

<br/>

### Node.js句柄传递

讲句柄之前，先想一个问题，send句柄发送的时候，真的是将服务器对象发送给了子进程？

子进程对象send()方法可以发送的 **句柄类型**：

 - net.Socket TCP套接字
 - net.Server TCP服务器，任意建立在TCP服务上的应用层服务都可以享受它带来的好处
 - net.Native C++层面的TCP套接字或IPC管道
 - dgram.Socket UDP套接字
 - dgram.Native C++层面的UDP套接字

***send句柄发送原理分析：***

![v2-db1efb168a121ef3e04886906f0ad134_720w.jpeg](https://i.loli.net/2021/03/31/QE4rlD57hJSxXaA.jpg)

send()方法在将消息发送到IPC管道前，实际将消息组装成了两个对象，一个参数是hadler，另一个是message。message参数如下所示：

```JavaScript
{
    cmd: 'NODE_HANDLE',
    type: 'net.Server',
    msg: message,
}
```

发送到IPC管道中的实际上是我们要发送的句柄文件描述符。这个message对象在写入到IPC管道时，也会通过JSON.stringfy()进行序列化。所以最终发送到IPC通道中的信息都是字符串，send()方法能发送消息和句柄并不意味着它能发送任何对象。

连接了IPC通道的子线程可以读取父进程发来的消息，将字符串通过JSON.parse()解析还原为对象后，才触发message事件将消息传递给应用层使用。在这个过程中，消息对象还要被进行过滤处理，message.cmd的值如果以NODE_为前缀，它将响应一个内部事件internalMessage，如果message.cmd值为NODE_HANDLE,它将取出message.type值和得到的文件描述符一起还原出一个对应的对象。

以发送的TCP服务器句柄为例，子进程收到消息后的还原过程代码如下:

```JavaScript
function(message,handle,emit){
    var self = this;
    
    var server = new net.Server();
    server.listen(handler,function(){
      emit(server);
    });
}
```

这段还原代码，子进程根据message.type创建对应的TCP服务器对象，然后监听到文件描述符上。由于底层细节不被应用层感知，所以子进程中，开发者会有一种服务器对象就是从父进程中直接传递过来的错觉。

Node进程之间只有消息传递，不会真正的传递对象，这种错觉是抽象封装的结果。目前Node只支持我前面提到的几种句柄，并非任意类型的句柄都能在进程之间传递，除非它有完整的发送和还原的过程。

<br/>

### 进程守护

每次启动 Node.js 程序都需要在命令窗口输入命令 node app.js 才能启动，但如果把命令窗口关闭则Node.js 程序服务就会立刻断掉。除此之外，当我们这个 Node.js 服务意外崩溃了就不能自动重启进程了。

这些现象都不是我们想要看到的，所以需要通过某些方式来守护这个开启的进程，执行 node app.js 开启一个服务进程之后，我还可以在这个终端上做些别的事情，且不会相互影响。当出现问题可以自动重启。

**如何实现进程守护:**

这里我只说一些第三方的进程守护框架，[pm2](https://link.zhihu.com/?target=http%3A//pm2.keymetrics.io/docs/usage/quick-start/) 和 [forever](https://link.zhihu.com/?target=https%3A//github.com/foreverjs/forever) ，它们都可以实现进程守护，底层也都是通过上面讲的 child_process 模块和 cluster 模块 实现的，这里就不再提它们的原理。

pm2 指定生产环境启动一个名为 test 的 node 服务

```shell
pm2 start app.js --env production --name test
```

**pm2常用api:**

 - pm2 stop Name/processID 停止某个服务，通过服务名称或者服务进程ID
 - pm2 delete Name/processID 删除某个服务，通过服务名称或者服务进程ID
 - pm2 logs [Name] 查看日志，如果添加服务名称，则指定查看某个服务的日志，不加则查看所有日志
 - pm2 start app.js -i 4 集群，-i 参数用来告诉PM2以cluster_mode的形式运行你的app（对应的叫fork_mode），后面的数字表示要启动的工作线程的数量。如果给定的数字为0，PM2则会根据你CPU核心的数量来生成对应的工作线程。注意一般在生产环境使用cluster_mode模式，测试或者本地环境一般使用fork模式，方便测试到错误。
 - pm2 reload Name pm2 restart Name 应用程序代码有更新，可以用重载来加载新代码，也可以用重启来完成,reload可以做到0秒宕机加载新的代码，restart则是重新启动，生产环境中多用reload来完成代码更新！
 - pm2 show Name 查看服务详情
 - pm2 list 查看pm2中所有项目
 - pm2 monit用monit可以打开实时监视器去查看资源占用情况

<br/>


## 多线程

> worker_threads 的出现让 Node.js 拥有 **多工作线程**，但这个概念不同于Java等其它后端语言中的多线程。

Node.js 通过提供 cluster、child_process API 创建子进程的方式来赋予Node.js “多进程”能力。但是这种创建进程的方式会牺牲共享内存，并且数据通信必须通过json进行传输。（有一定的局限性和性能问题）

基于此 Node.js V10.5.0 提供了 [worker_threads](https://nodejs.org/api/worker_threads.html?source=post_page---------------------------#worker_threads_worker_threads)，它比 child_process 或 cluster更轻量级。 与child_process 或 cluster 不同，worker_threads 可以共享内存，通过传输 ArrayBuffer 实例或共享 SharedArrayBuffer 实例来实现。

**这里有一个误区：很多人可能认为在node.js核心模块中添加一个新的模块，来创建线程以及实现线程间同步问题，从而解决CPU密集型操作的问题？**

但事实并非如此，Node.js 并没有其它支持多线的程语言（如：java），诸如"synchronized"之类的关键字来实现线程同步的概念。**Node.js的 worker_threads 区别于它们的多线程。** 如果添加线程，语言本身的性质将发生变化，所以不能将线程作为一组新的可用类或函数添加。

我们可以将其理解为：JavaScript和Node.js永远不会有线程，只有基于Node.js 架构的多工作线程。

![v2-921c4ec34b45654887ec86c1a0aa04a0_720w.jpeg](https://i.loli.net/2021/03/31/rDoE64Q9gMmhZHV.jpg)

**使用示例：**

 - Worker: 该类用于创建 worker对象。有一个必填参数__filename（文件路径），该文件会被worker执行。同时我们可以在主线程中通过worker.on监听message事件
 - isMainThread: 该对象用于区分是主线程（true）还是工作线程（false）
 - parentPort: 该对象的 postMessage 方法用于 worker 线程向主线程发送消息
 - 该代码中在构造 worker的时候 传入了一个名为workerData的对象，这是我们希望线程在开始运行时可以访问的数据。**workerData 可以是任何一个JavaScript 值。**

```JavaScript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    // This code is executed in the main thread and not in the worker.

    // Create the worker.
    const worker = new Worker(__filename, { workerData: { name: 'xiaoming' } });
    // Listen for messages from the worker and print them.
    worker.on('message', (msg) => { console.log(msg); });
} else {
    // This code is executed in the worker and not in the main thread.
    const data = workerData.name
    // Send a message to the main thread.
    parentPort.postMessage('Hello world!' + data);
}
```

<br/>