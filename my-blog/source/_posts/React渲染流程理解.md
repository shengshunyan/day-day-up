---
title: React渲染流程理解
date: 2021-1-12
keywords: React, 生命周期
cover: https://s1.ax1x.com/2020/05/28/tZXg7q.jpg
tags:
     - JavaScript
---


{% note info no-icon %}
参考：[《React技术揭秘》](https://react.iamkasong.com/)
{% endnote %}


## 背景知识

1. React16架构可以分为三层:

     {% note success no-icon %}
     - Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入Reconciler
     - Reconciler（协调器）—— 负责找出变化的组件
     - Renderer（渲染器）—— 负责将变化的组件渲染到页面上
     {% endnote %}

2. Fiber的含义

     {% note success no-icon %}
     - 作为架构来说，之前React15的Reconciler采用递归的方式执行，数据保存在递归调用栈中，所以被称为stack Reconciler。React16的Reconciler基于Fiber节点实现，被称为Fiber Reconciler。

     - 作为静态的数据结构来说，每个Fiber节点对应一个React element，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。

     - 作为动态的工作单元来说，每个Fiber节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。
     {% endnote %}

<br/>


## 渲染流程概览

### 图例

1. class component

 ![WX20210120-202610.png](https://i.loli.net/2021/01/20/FNRHmnB1XkZo2PE.png)

2. function component

 ![WX20210118-165755.png](https://i.loli.net/2021/01/18/l2RnUhc6AFPuNgz.png)

<br/>


### render阶段

 - 目的：Scheduler 调度 Reconciler 找出变化的组件，在其虚拟DOM上打上代表增/删/更新的标记

 - React16 的 Fiber Reconciler 通过遍历的方式实现可中断的递归， Scheduler判断当前帧是否还有时间剩余，并且根据任务优先级，调度运行 Reconciler 的任务

 - 整个Scheduler与Reconciler的工作都在内存中进行。只有当所有组件都完成Reconciler的工作，才会统一交给Renderer（下一阶段commit）

{% note primary no-icon %}
***Reconciler的工作可以分为两部分：“递”和“归”***
{% endnote %}

1. “递”阶段 （beginWork）

     {% note info no-icon %}
     a. 首先从rootFiber开始向下深度优先遍历。为遍历到的每个Fiber节点调用beginWork方法 (opens new window)。

     b. 该方法会根据传入的Fiber节点创建子Fiber节点，并将这两个Fiber节点连接起来。

     c. 当遍历到叶子节点（即没有子组件的组件）时就会进入“归”阶段。
     {% endnote %}

2.  “归”阶段 （completeWork）

     {% note info no-icon %}
     a. 在“归”阶段会调用completeWork (opens new window)处理Fiber节点，生成/更新对应的DOM节点

     b. 当某个Fiber节点执行完completeWork，如果其存在兄弟Fiber节点（即fiber.sibling !== null），会进入其兄弟Fiber的“递”阶段；如果不存在兄弟Fiber，会进入父级Fiber的“归”阶段

     c. “递”和“归”阶段会交错执行直到“归”到rootFiber。至此，render阶段的工作就结束了
     {% endnote %}

<br/>


### commit阶段

 - commitRoot方法是commit阶段工作的起点。fiberRootNode会作为传参

 - 在rootFiber.firstEffect上保存了一条需要执行副作用的Fiber节点的 **单向链表effectList**，这些Fiber节点的 **updateQueue** 中保存了变化的props

 - 这些副作用对应的DOM操作在commit阶段执行，此外一些生命周期钩子（比如componentDidXXX）、hook（比如useEffect）需要在commit阶段执行

{% note primary no-icon %}
***commit阶段的主要工作（即Renderer的工作流程）分为三部分：before mutation阶段（执行DOM操作前）、mutation阶段（执行DOM操作）、layout阶段（执行DOM操作后）***
{% endnote %}

1.  before mutation阶段（执行DOM操作前）

     {% note info no-icon %}
     会遍历effectList，依次执行：

     a. 处理DOM节点渲染/删除后的 autoFocus、blur 逻辑

     b. 调用 **getSnapshotBeforeUpdate** 生命周期钩子

     c. 调度 useEffect （异步调用）
     {% endnote %}

2.  mutation阶段（执行DOM操作）

     {% note info no-icon %}
     会遍历effectList，依次执行：

     a. 根据ContentReset effectTag重置文字节点

     b. 更新ref

     c. 根据effectTag分别处理，其中effectTag包括(Placement | Update | Deletion | Hydrating)
     {% endnote %}

3.  layout阶段（执行DOM操作后）

     {% note info no-icon %}
     该阶段触发的生命周期钩子和hook可以直接访问到已经改变后的DOM，即该阶段是可以参与DOM layout的阶段

     会遍历effectList，依次执行：

     a. ClassComponent会调用 componentDidMount (opens new window)或 componentDidUpdate；触发状态更新的this.setState如果赋值了第二个参数回调函数，也会在此时调用。

     b. 对于FunctionComponent及相关类型，他会调用useLayoutEffect hook的回调函数，调度useEffect的销毁与回调函数

     c. 获取DOM实例，更新ref
     {% endnote %}

<br/>


## diff算法

### 执行时机

1. 在render 阶段的 beginWork 中，在 shouldComponentUpdate 生命周期函数之后

2. 对于update的组件，他会将当前组件与该组件在上次更新时对应的Fiber节点比较（也就是俗称的Diff算法），将比较的结果生成新Fiber节点。

<br/>


### diff算法的输入输出

{% note info no-icon %}
一个DOM节点在某一时刻最多会有4个节点和他相关。

- ***current Fiber***：如果该DOM节点已在页面中，current Fiber代表该DOM节点对应的Fiber节点。

- ***workInProgress Fiber***：如果该DOM节点将在本次更新中渲染到页面中，workInProgress Fiber代表该DOM节点对应的Fiber节点。

- ***DOM节点本身***

- ***JSX对象***：即ClassComponent的render方法的返回结果，或FunctionComponent的调用结果。JSX对象中包含描述DOM节点的信息。

**Diff算法** 的本质是对比1和4 **（输入）**，生成2 **（输出）**。
{% endnote %}

<br/>


### Diff的瓶颈以及React如何应对

由于Diff操作本身也会带来性能损耗，React文档中提到，即使在最前沿的算法中，将前后两棵树完全比对的算法的复杂程度为 O(n 3 )，其中n是树中元素的数量。

如果在React中使用了该算法，那么展示1000个元素所需要执行的计算量将在十亿的量级范围。这个开销实在是太过高昂。

为了降低算法复杂度，React的diff会预设三个限制：

1. 只对同级元素进行Diff。如果一个DOM节点在前后两次更新中跨越了层级，那么React不会尝试复用他。

2. 两个不同类型的元素会产生出不同的树。如果元素由div变为p，React会销毁div及其子孙节点，并新建p及其子孙节点。

3. 开发者可以通过 key prop来暗示哪些子元素在不同的渲染下能保持稳定。

<br/>


### Diff算法的实现

![WX20210120-210542.png](https://i.loli.net/2021/01/20/4kSz2MiRIn8ehHK.png)

<br/>