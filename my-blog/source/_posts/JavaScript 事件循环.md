---
title: JavaScript 事件循环
date: 2021-03-15
keywords: JavaScript, event loop
cover: https://i.loli.net/2021/03/15/6cbOQB8e7akhNPI.png
tags:
     - JavaScript
---

{% note info no-icon %}
原文：淘系技术[《JavaScript 事件循环：从起源到浏览器再到 Node.js》](https://mp.weixin.qq.com/s/a6aFweCiLF0Mx03fARP8qQ)
好文收藏，谨防丢失
{% endnote %}


## 为什么是事件循环

JavaScript 是网景 (Netscape) 公司为其旗下的网景浏览器提供更复杂网页交互时所推出的一个动态脚本语言。其创作者 Eich 在 10 天内写出了 JavaScript 的第一个版本，通过 Eich 在 JavaScript 20 周年的演讲回顾中，我们可以发现 JavaScript 在最初设计的时候没有考虑所谓的事件循环。那么事件循环到底是怎么出现的？

首先让我们来看看引入 JavaScript 到网页端的经典用例：一个用户打开一个网页，填写完表单提交之后，等待 30s 的白屏之后发现表单中的某个地方填写错误了需要重新填写。在这个场景中，如果我们有 JavaScript 就可以在用户提交表单之前先在用户本地的浏览器端做一次校验，避免用户每次都通过网络找服务端来校验所浪费的时间。

分析一下这个场景，我们就可以发现，最早的 JavaScript 的执行就是用户通过浏览器的事件来触发的，例如用户填写完表单之后点击提交的时候，浏览器触发一个 DOM 的点击事件，而点击事件绑定了对应的 JavaScript 代码来执行校验的过程。在这个过程中，JavaScript 的代码都是被动被调用的。

仔细思考一下就会发现，JavaScript 所谓的事件和触发本质上都通过浏览器中转，更像是浏览器行为而不仅仅是 JavaScript 语言内的一个队列。顺着这个思路我们顺藤摸瓜，就会发现 EcmaScript 的标准定义中压根 就没有事件循环，反倒是 HTML 的标准中定义了事件循环（目前 HTML 有 whatwg 和 w3c 标准，这里讨论的是 wahtwg 的标准）：

> To coordinate events, user interaction, scripts, rendering, networking, and so forth, user agents must use event loops as described in this section. Each agent has an associated event loop, which is unique to that agent.

根据标准中对事件循环的定义描述，我们可以发现事件循环本质上是 user agent (如浏览器端) 用于协调用户交互（鼠标、键盘）、脚本（如 JavaScript）、渲染（如 HTML DOM、CSS 样式）、网络等行为的一个机制。

了解到这个定义之后，我们就能够清楚的知道，***与其说是 JavaScript 提供了事件循环，不如说是嵌入 JavaScript 的 user agent 需要通过事件循环来与多种事件源交互。***

<br/>


## 事件循环是什么

所以说事件循环本质是一个 user agent 上协调各类事件的机制，而这一节我们主要讨论一下浏览器中的这个机制与 JavaScript 的交互部分。

各种浏览器事件同时触发时，肯定有一个先来后到的排队问题。决定这些事件如何排队触发的机制，就是事件循环。这个排队行为以 JavaScript 开发者的角度来看，主要是分成两个队列：

 - 一个是 ***JavaScript 外部的队列***。外部的队列主要是浏览器协调的各类事件的队列，标准文件中称之为 Task Queue。下文中为了方便理解统一称为外部队列。

 - 另一个是 ***JavaScript 内部的队列***。这部分主要是 JavaScript 内部执行的任务队列，标准中称之为 Microtask Queue。下文中为了方便理解统一称为内部队列。

值得注意的是，虽然为了好理解我们管这个叫队列 (Queue)，但是本质上是有序集合 (Set)，因为传统的队列都是先进先出（FIFO）的，而这里的队列则不然，排到最前面但是没有满足条件也是不会执行的（比如外部队列里只有一个 setTimeout 的定时任务，但是时间还没有到，没有满足条件也不会把他出列来执行）。

### 外部队列

外部队列（Task Queue），顾名思义就是 JavaScript 外部的事件的队列，这里我们可以先列举一下浏览器中这些外部事件源（Task Source），他们主要有：

 - script 标签
 - 定时器 (setTimeout 等)
 - 网络请求 (Ajax 等)
 - 用户交互 (鼠标、键盘)
 - DOM 操作 (页面渲染)
 - History API 操作

可以观察到，这些外部的事件源可能很多，为了方便浏览器厂商优化，HTML 标准中明确指出一个事件循环由一个或多个外部队列，而每一个外部事件源都有一个对应的外部队列。不同事件源的队列可以有不同的优先级（例如在网络事件和用户交互之间，浏览器可以优先处理鼠标行为，从而让用户感觉更加流程）。

### 内部队列

内部队列（Microtask Queue），即 JavaScript 语言内部的事件队列，在 HTML 标准中，并没有明确规定这个队列的事件源，通常认为有以下几种：

 - Promise 的成功 (.then) 与失败 (.catch)
 - MutationObserver
 - Object.observe (已废弃)

### 处理模型

在标准定义中事件循环的步骤比较复杂，这里我们简单描述一下这个处理过程：

 1. 从外部队列中取出一个可执行任务，如果有则执行，没有下一步。

 2. 挨个取出内部队列中的所有任务执行，执行完毕或没有则下一步。

 3. 浏览器渲染。

![WX20210315-200207.png](https://i.loli.net/2021/03/15/6cbOQB8e7akhNPI.png)

### 案例分析

根据上述的处理模型，我们可以来看以下例子：

```JavaScript
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
```

输出结果：

```JavaScript
script start
script end
promise1
promise2
setTimeout
```


我们再看一个引入了 HTML 渲染的例子：

```html

<html>
    <body>
        <pre id="main"></pre>
    </body>
    <script>
        const main = document.querySelector('#main');
        const callback = (i, fn) => () => {
            console.log(i)
            main.innerText += fn(i);
        };
        let i = 1;
        while(i++ < 5000) {
            setTimeout(callback(i, (i) => '\n' + i + '<'))
        }

        while(i++ < 10000) {
            Promise.resolve().then(callback(i, (i) => i +','))
        }
        console.log(i)
        main.innerText += '[end ' + i + ' ]\n'
    </script>
</html>
```

通过这个例子，我们就可以发现，渲染过程很明显分成三个阶段：

1. JavaScript 执行完毕 innerText 首先加上 [end 10001]

2. 内部队列：Promise 的 then 全部任务执行完毕，往 innerText 上追加了很长一段字符串

3. HTML 渲染：1 和 2 追加到 innerText 上的内容同时渲染

4. 外部队列：挨个执行 setTimeout 中追加到 innerText 的内容

5. HTML 渲染：将 4 中的内容渲染。

6. 回到第 4 步走外部队列的流程（内部队列已清空）

<br/>


## 浏览器与 Node.js 的事件循环差异

根据本文开头我们讨论的事件循环起源，很容易理解为什么浏览器与 Node.js 的事件循环会存在差异。如果说浏览端是将 JavaScript 集成到 HTML 的事件循环之中，那么 Node.js 则是将 JavaScript 集成到 libuv 的 I/O 循环之中。

简而言之，二者都是把 JavaScript 集成到他们各自的环境中，但是 HTML (浏览器端) 与 libuv (服务端) 面对的场景有很大的差异。首先能直观感受到的区别是：

 1. 事件循环的过程没有 HTML 渲染。只剩下了外部队列和内部队列这两个部分。

 2. 外部队列的事件源不同。Node.js 端没有了鼠标等外设但是新增了文件等 IO。

 3. 内部队列的事件仅剩下 Promise 的 then 和 catch。

Node.js 官方文档中对于事件循环顺序的展示：

![WX20210315-202856.png](https://i.loli.net/2021/03/15/D3HpTA8akw4Zizo.png)

其中 check 阶段是用于执行 setImmediate 事件的。结合本文上面的推论我们可以知道，Node.js 官方这个所谓事件循环过程，其实只是完整的事件循环中 Node.js 的多个外部队列相互之间的优先级顺序。

我们可以在加入一个 poll 阶段的例子来看这个循环：

```JavaScript
const fs = require('fs');

setImmediate(() => {
  console.log('setImmediate');
});

fs.readdir(__dirname, () => {
  console.log('fs.readdir');
});

setTimeout(()=>{
  console.log('setTimeout');
});

Promise.resolve().then(() => {
  console.log('promise');
});
```

输出结果（v12.x）：

```JavaScript
promise
setTimeout
fs.readdir

setImmediate
```

根据输出结果，我们可以知道梳理出来：

 1. 外部队列：执行当前 script

 2. 内部队列：执行 promise

 3. 外部队列：执行 setTimeout

 4. 内部队列：空

 5. 外部队列：执行 fs.readdir

 6. 内部队列：空

 7. 外部队列：执行 check （setImmediate）

<br/>


## 小结

我们都知道浏览器端是直面用户的，这也意味着浏览器端会更加注重用户的体验（如可见性、可交互性），如果有一个优化效果是能够极大的减少 JavaScript 的执行时间，但要消耗更多 HTML 渲染的时间的话，通常来说我们都不会做这个优化。通过这个例子来观察，可以发现我们在浏览器并不是主要关注某件事整体所消耗的时间是否更少，而是用户是否能快的体验到交互（感受到 HTML 渲染）。而到了 Node.js 这个服务端 JavaScript 的场景下，这一点是明确不一样的。在服务端为了保持应用的流畅，早期甚至出现了一次事件循环执行多个外部事件的优化方式。

造成浏览器端与 Node.js 端事件循环的差异的一个很大的原因在于 。事件循环的设计初衷更多的是方便 JavaScript 与其嵌入环境的交互，所以事件循环如何运作，也更多的会受到 JavaScript 嵌入环境的影响，不同的设备、嵌入式环境甚至是不同的浏览器都会有各自的想法。