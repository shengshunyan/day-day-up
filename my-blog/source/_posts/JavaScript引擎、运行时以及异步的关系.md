---
title: JavaScript引擎、运行时以及异步的关系
date: 2020-06-29
keywords: JavaScript, 引擎, 运行时
cover: https://i.loli.net/2020/06/29/f1yJm3lD7aKsSnx.jpg
tags:
     - JavaScript
---


{% note info no-icon %}
摘录自知乎doodlewind用户的回答：https://www.zhihu.com/question/390859209/answer/1185880057
{% endnote %}

## 引擎 / 运行时有什么关系

可能很多人不会相信，如果我做一门完全支持 ECMA-262 规范的 JavaScript 引擎，这个引擎甚至是完全不需要支持 setTimeout 的。

你没有看错，setTimeout 不在 ECMA-262 里，而是在 W3C 和 WHATWG 规范里。这有什么区别呢？这里也是有历史渊源的。请看 TC39 委员会成立之初的一段历史：

{% note info no-icon %}
微软 Internet Explorer 团队负责人 Thomas Reardon 建议委员会不要将 HTML 对象模型的内置库纳入规范中……这些内容应留给 W3C。这一建议被委员会接受，并对委员会的早期成功至关重要……这条 TC39 只开发独立于平台 / 宿主环境标准的决定，一直以来都是 TC39 的核心行动准则之一。 
    ——JavaScript 20 年第二部分
{% endnote %}

什么叫独立于平台和独立于宿主呢？setTimeout 就是典型的例子。纯粹的 JS 引擎不支持 setTimeout，因为它底层依赖操作系统（平台）「把线程挂起」的能力。TC39 制定的 JS 标准可不管这种东西，没想到吧。

那 JS 引擎应该支持什么呢？支持把任务 Run to Completion 就行，亦即从头跑到底。所谓任务（Task）指的是去 Eval 一段完整的脚本或执行某个函数。你可以认为浏览器加载 script 标签时就是要做一次 Eval，在这中途会注册上这段 JS 里涉及的回调。而 Eval 完成后虽然 JS 不再阻塞，但整个页面运行时则会继续保持活跃。这样每次用户事件到来时，就可以让引擎执行相应的回调函数任务了。每个任务一旦触发，都是由引擎单线程「一次同步跑到底」的，这也就是 JavaScript 最基础的执行模型了。

注意到「引擎」和「运行时」概念上的不同了吗？重点来了：**JS 运行时（Runtime）是对 JS 引擎（Engine）的封装** ，异步能力需要由 JS 运行时开发实现。浏览器是客户端的 JS 运行时，而 Node.js 就是服务端的 JS 运行时。运行时做了什么？不外乎搭建了一个能调用引擎执行任务的 Event Loop 而已。

{% note info no-icon %}
你可以认为 JS 引擎就是个无副作用的纯函数，没有运行时提供 IO 能力的话，JS 引擎甚至连 console.log 打日志都是不支持的——ECMAScript 也不包含 console 的标准，这也是 WHATWG 搞的。
{% endnote %}

<br/>


## 什么是异步

首先，我们说的「异步」指的是什么？在 JS 语境下这默认指「异步非阻塞」的编程范式，与其相对应的是「同步阻塞」。它们的核心都是解决这个问题：

如何编写可能要「隔一段时间后才执行」的代码？

举个典型的例子：我们都知道 GUI 一秒 60 帧，那么怎样每帧（每隔 16 毫秒）执行一段固定的逻辑呢？

经过我国扎实的计算机专业大一教育，你可能第一反应是这种朴素解法：

```JavaScript
var lastTime = new Date()
while (true) {
  var time = new Date() // 这行每秒大概要跑几万次吧
  if (time - lastTime > 16) {
    console.log('你为什么这么熟练啊')
    lastTime = time
  }
}
```

别急着开嘲讽，这逻辑是非常符合直觉的，唯一缺点是会死循环让单核 CPU 跑满而已——不信在 Chrome 控制台里粘贴进这段代码，输出非常正确而熟练，但这个页面同时也就直接扑街了。所以怎么办呢？在 C 语言和 Python 里，最简单的方式是使用标准库里的 sleep 函数。这玩意封装了操作系统的能力（后面还会讲到），在睡眠（也就是所谓被挂起）期间 CPU 是闲置的。

```JavaScript
while (true) {
  sleep(16)
  console.log('你为什么这么熟练啊')
}
```

同样是死循环，但已经不会浪费 CPU 把应用卡死了。那为什么 JavaScript 里不这么写呢？JavaScript这种单线程语言一旦被挂起，这期间你什么别的逻辑都跑不了。鉴于 JavaScript 里函数也是一等公民，更好的方式是这样的：
- 把你要的逻辑包到一个函数里。
- 把这个函数指定给运行时，让它在特定时间调用。

还是上面 60 帧执行的例子，今天我们都知道有 setTimeout 和 setInverval，基于它们的「正解」是这样的：// 把逻辑包到函数里

```JavaScript
function callback () {
  console.log('你为什么这么熟练啊')
}
// 把函数指定给运行时
setInterval(callback, 16)
```

这就得出最基础的「异步非阻塞」玩法了，这类「交由运行时以后调用」的函数，就叫做「回调函数」了。从按钮的 onclick 点击回调到 AJAX 请求的 onload 回调再到 Node.js 里的 readFile 回调，这种根基级的手法都万变不离其宗。

所以，**在 JavaScript 中，「异步非阻塞」意味着一种以回调函数为基础的编程范式。**

<br/>


## Node.js实现的异步

大家都知道 Node.js = V8 + libuv，而这个 libuv 管的就是平台 IO，封装了定时器、网络、文件、IPC 通信等操作系统的 API，基于它就可以用异步非阻塞的方式，跨平台调用操作系统的这些能力，实现自己的 Event Loop 了。

{% note info no-icon %}
一个原生应用开发者眼里的操作系统，就是一个提供这些 API 给我调的平台，而不是 PPT 上什么分布式物联网微内核之类乱七八糟的炒作概念。
{% endnote %}

作为科普，这里不必看 V8 + libuv 是怎么搞的，讲一个更简单精炼的实现，看看 Fabrice Bellard 大神是怎么为 QuickJS 引擎配套出 Event Loop 的吧。下面是 quickjs-libc.c 的源码：

```c
/* main loop which calls the user JS callbacks */
void js_std_loop(JSContext *ctx)
{
    JSContext *ctx1;
    int err;

    for(;;) {
        /* execute the pending jobs */
        for(;;) {
            err = JS_ExecutePendingJob(JS_GetRuntime(ctx), &ctx1);
            if (err <= 0) {
                if (err < 0) {
                    js_std_dump_error(ctx1);
                }
                break;
            }
        }

        if (!os_poll_func || os_poll_func(ctx))
            break;
    }
}
```

这不就是在双重的死循环里先执行掉所有的 Job 任务，然后调 os_poll_func 吗？那么这里的 for 循环不会吃满 CPU 吗？这就是前面澄清过的地方：在原生开发中，进程里即便写着个死循环，也未必始终在前台运行，可以通过系统调用将自己挂起。

因此这里的 os_poll_func 封装的，就是原理类似的 poll 系统调用（准确地说用的其实是 select），从而可以借助操作系统的能力，使得只在「定时器触发、文件描述符读写」等事件发生时，让线程回到前台执行一个 tick，把此时应该运行的 JS 回调 Run to Completion 跑完，而其余时间都在后台挂起。在这条路上继续走下去，就能以经典的异步非阻塞方式来实现整个运行时了。

所以这个双层循环实现的 Event Loop 就很好理解了：外层循环让 OS 挂起自己，内层循环 Run to Completion 式地执行掉所有的 Job，因为 Promise 对应的 Microtask 也需要在单次 Run to Completion 的过程中执行完。至于 Node.js 的 Event Loop，显然会比这个复杂得多，但原理也是类似的。

<br/>
