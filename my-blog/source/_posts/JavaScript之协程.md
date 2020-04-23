---
title: JavaScript之协程
date: 2020-04-23
keywords: JavaScript, 调度, 进程, 线程, 协程
cover: https://i.loli.net/2020/04/23/E1jN4tsgQfYBTGp.jpg
tags:
     - JavaScript
---


{% note info no-icon %}
摘抄自 https://zhuanlan.zhihu.com/p/99977314 ，获益良多，记录一下！
{% endnote %}


## 上下文切换

在讲协程之前简单的回顾一下各种上下文切换技术，简单定义一下上下文相关的术语

- 上下文：程序运行中的一个状态
- 上下文切换：从一个上下文切换到另一个上下文的技术
- 调度：决定哪个上下文可以获得 cpu 时间片的方法

那么我们有哪些上下文切换的方式呢

<br/>


## 进程

进程是最传统的上下文系统，每个进程都有独立的地址空间和资源句柄，每次新建进程时都需要分配新的地址空间和资源句柄（可以通过写时赋值进行节省），其好处是进程间相互隔离，一个进程 crash 通常不会影响另一个进程，坏处是开销太大  

进程主要分为三个状态： **就绪态、运行态、睡眠态** ，就绪和运行状态切换就是通过调度来实现，就绪态获取时间片则切换到运行态，运行态时间片到期或者主动让出时间片(sched_yield)就会切换到就绪态，当运行态等待某系条件（典型的就是 IO 或者锁）就会陷入睡眠态，条件达成就切换到就绪态。

<br/>

## 线程

线程是一种轻量级别的进程（linux 里甚至不区分进程和线程），和进程的区别主要在于，线程不会创建新的地址空间和资源描述符表，这样带来的好处就是开销明显减小，但是坏处就是因为公用了地址空间，可能会造成一个线程会污染另一个线程的地址空间，即一个线程 crash 掉，很可能造成同一进程下其他线程也 crash 掉

<br/>


## 并发(concurrency)和并行(Parallelism）

并发并不等于并行，并行需要多核的支持，并发却不需要。线程和进程即支持并发也支持并行。  

并行强调的是充分发挥多核的计算优势，而并发更加强调的是任务间的协作，如 webpack 里的 uglify 操作是明显的 CPU 密集任务，在多核场景下使用并行有巨大的优势，而 n 个不同的生产者和 n 个不同消费者之间的协作，更强调的是并发。实际上我们绝大部分都是把线程和进程当做并发原语而非并行原语使用。

<br/>


## 阻塞型 IO

在 Python 没引入 asycio 支持前，绝大部分 python 应用编写网络应用都是使用多线程|多进程模型。

我们发现虽然使用了多线程，多线程更多的是用于并发而非并行，其实我们的任务绝大部分时间都是耗在了 IO 等待上面，这时候你是单核还是多核对系统的吞吐率影响其实不大。  

由于多进程内存开销较大，在 C10k 的时候，其创建和关闭的内存开销已基本不可接受，而多线程虽然内存开销较多进程小了不少，但是却存在另一个性能瓶颈：调度

linux 在使用 CFS 调度器的情况下，其调度开销大约为 O(logm),其中 m 为活跃上下文数，其大约等同于活跃的客户端数，因此每次线程遇到 IO 阻塞时，都会进行调度从而产生 O(logm)的开销。这在 QPS 较大的情况下是一笔不小的开销。

<br/>


## 非阻塞 IO 和 事件驱动

我们发现上面多线程网络模型的开销是由两个原因导致的：

- IO 阻塞读写 socket 导致触发调度：调度频繁
- 活跃上下文数目较大导致调度开销较大：调度效率低


我们发现这两个原因甚至是紧密关联的
由于使用了阻塞 IO 进行读写 socket，这导致了我们一个线程只能同时阻塞在一个 IO 上，这导致了我们只能为每个 socket 分配一个线程。即阻塞 IO 即导致了我们调度频繁也导致了我们创建了过多的上下文。

**所以我们考虑使用非阻塞 IO 去读写 socket。**

一旦使用了非阻塞 IO 去读写 socket，就面临读 socket 的时候，没就绪该如何处理，最粗暴的方式当然是暴力重试，事实上 socket 大部分时间都是属于未就绪状态，这实际上造成了巨大的 cpu 浪费。

这时候就有其他两种方式 **就绪事件通知** 和 **异步 IO** ，linux 下的主流方案就是就绪事件通知，我们可以通过一个特殊的句柄来通知我们我们关心的 socket 是否就绪，我们只要将我们关心的 socket 事件注册在这个特殊句柄上，然后我们就可以通过轮训这个句柄来获取我们关心的 socket 是否就绪的信息了，这个方式区别于暴力重试 socket 句柄的方式在于，对 socket 直接进行重试，当 socket 未就绪的时候，由于是非阻塞的，会直接进入下次循环，这样一直循环下去浪费 cpu，但是对特殊句柄进行重试，如果句柄上注册是事件没有就绪，该句柄本身是会阻塞的，这样就不会浪费 cpu 了，在 linux 上这个特殊句柄就是大名鼎鼎的 epoll。

使用 epoll 的好处是一方面由于避免直接使用阻塞 IO 对 socket 进行读写，降低了触发调度的频率，现在的上下文切换并不是在不同线程之间进行上下文切换，而是在不同的事件回调里进行上下文切换，这时的 epoll 处理事件回调上下文切换的复杂度是 O(1)的，所以这大大提高了调度效率。但是 epoll 在处理上下文的注册和删除时的复杂度是 O(logn),但对于大部分应用都是读写事件远大于注册事件的，当然对于那些超短链接，可能带来的开销也不小。

我们发现直接使用 epoll 进行编程时还是会需要处理大量的细节问题，而且这些细节问题几乎都是和业务无关的，我们其实不太关心内部是怎么注册 socket 事件|文件事件|定时器事件等，我们关心的其实就是一系列的事件。所以我们可以进一步的将 epoll 进行封装，只给用户提供一些事件的注册和回调触发即可。这其实就是 libuv 或者更进一步 nodejs 干的事情。

```JavaScript
var net = require("net");
var client = net.connect({ port: 8124 }, function() {
    //'connect' listener
    console.log("client connected");
    client.write("world!\r\n");
});
client.on("data", function(data) {
    console.log(data.toString());
    client.end();
});
client.on("end", function() {
    console.log("client disconnected");
});
```

<br/>


## 协程(coroutine)

使用事件驱动编程时碰到的一个问题是，我们的业务逻辑被拆散为一个个的 callback 上下文，且借助于闭包的性质，我们可以方便的在各个 callback 之间传递状态，然后由 runtime(比如 node.js 或者 nginx 等）根据事件的触发来执行上下文切换。

我们为什么需要将业务拆散为多个回调，只提供一个函数不行吗?

问题在于每次回调的逻辑是不一致的，如果封装成一个函数，因为普通函数只有一个 entry point，所以这实际要求函数实现里需要维护一个状态机来记录所处回调的位置。当然可以这样去实现一个函数，但是这样这个函数的可读性会很差。

假如我们的函数支持多个入口，这样就可以将上次回调的记过自然的保存在函数闭包里，从下个入口进入这个函数可以自然的通过闭包访问上次回调执行的状态，即我们需要一个可唤醒可中断的对象，这个可唤醒可中断的对象就是 coroutine。

不同语言的 coroutine 实现也各有不同，但基本上来说 coroutine 具有如下两个重要性质

- 可唤醒可中断的函数
- 不可抢占

回忆一下我们的 js 里是否有对象满足这两个性质呢，很明显因为 JS 是单线程的，所以不可抢占这个性质天然满足，我们只需要考虑第一个性质即可，答案已经很明显了，Generator 和 Async/Await 就是 coroutine 的一种实现。

<br/>


## Async/Await: 协程 + 异步 = 支持异步任务调度的协程

Generator 称为非对称协程或者叫半协程。Generator 的最大限制在于 coroutine 只能 yield 给 caller，这在实际应用中存在较大的局限，没有内置异步任务的自动调度。

使用Async/Await，我们能够进行任意任务之间的跳转，如 task1 调度到 task2 后，然后 task2 又调度到 task3，此时的调度行为完全由内置的调度器根据异步事件的触发顺序来决定的。

```JavaScript
const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });
async function task1() {
  while (true) {
    await sleep(Math.random() * 1000);
    console.log("task1");
  }
}
async function task2() {
  while (true) {
    await sleep(Math.random() * 1000);
    console.log("task2");
  }
}
async function task3() {
  while (true) {
    await sleep(Math.random() * 1000);
    console.log("task3");
  }
}

function main() {
  task1();
  task2();
  task3();
  console.log("start task");
}
main();
```

虽然 async/await 异常方便，但是仍然存在诸多限制

- 必须在 async 函数里才能使用 yield(await), async 函数存在向上的传染性，导致自顶向上都需要改成 async 函数，可参考https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/
- 不支持优先级调度：其调度规则是内置的按照事件触发顺序进行调度，实际应用中可能需要根据优先级进行调度

<br/>


## React Fiber： 框架层控制的支持同步任务和优先级的协程

事实上 React Fiber 是另一种协程的实现方式，事实上 React 的 coroutine 的实现经历过几次变动
如https://github.com/facebook/react/pull/8840，fiber 大部分情况下和 coroutine 的功能相同均支持cooperative multitasking，主要的区别在于 fiber 更多的是系统级别的，而 coroutine 则更多的是 userland 级别的，由于 React 并没有直接暴露操作 suspend 和 resume 的操作，更多的是在框架级别进行 coroutine 的调度，因此叫 fiber 可能更为合理（但估计更合理的名字来源于 ocaml 的 algebraic effect 是通过 fiber 实现的）。

React 之所以没有直接利用 js 提供的 coroutine 原语即 async|await 和 generator，其主要原因在于为了更加细粒度的进行任务调度。

