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

## React16架构可以分为三层：

 - Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入Reconciler
 - Reconciler（协调器）—— 负责找出变化的组件
 - Renderer（渲染器）—— 负责将变化的组件渲染到页面上

<br/>


## Fiber的含义

 - 作为架构来说，之前React15的Reconciler采用递归的方式执行，数据保存在递归调用栈中，所以被称为stack Reconciler。React16的Reconciler基于Fiber节点实现，被称为Fiber Reconciler。

 - 作为静态的数据结构来说，每个Fiber节点对应一个React element，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。

 - 作为动态的工作单元来说，每个Fiber节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

<br/>


## 图例

### class component

![WX20210118-165742.png](https://i.loli.net/2021/01/18/V6qhGRx42tpZiD1.png)

### function component

![WX20210118-165755.png](https://i.loli.net/2021/01/18/l2RnUhc6AFPuNgz.png)

<br/>


## render阶段

 - 目的：Scheduler 调度 Reconciler 找出变化的组件，在其虚拟DOM上打上代表增/删/更新的标记

 - React16 的 Fiber Reconciler 通过遍历的方式实现可中断的递归， Scheduler判断当前帧是否还有时间剩余，并且根据任务优先级，调度运行 Reconciler 的任务

 - 整个Scheduler与Reconciler的工作都在内存中进行。只有当所有组件都完成Reconciler的工作，才会统一交给Renderer（下一阶段commit）

Reconciler的工作可以分为两部分：“递”和“归”


### “递”阶段 （beginWork）

1. 首先从rootFiber开始向下深度优先遍历。为遍历到的每个Fiber节点调用beginWork方法 (opens new window)。

2. 该方法会根据传入的Fiber节点创建子Fiber节点，并将这两个Fiber节点连接起来。

3. 当遍历到叶子节点（即没有子组件的组件）时就会进入“归”阶段。


### “归”阶段 （completeWork）

1. 在“归”阶段会调用completeWork (opens new window)处理Fiber节点，生成/更新对应的DOM节点

2. 当某个Fiber节点执行完completeWork，如果其存在兄弟Fiber节点（即fiber.sibling !== null），会进入其兄弟Fiber的“递”阶段；如果不存在兄弟Fiber，会进入父级Fiber的“归”阶段

3. “递”和“归”阶段会交错执行直到“归”到rootFiber。至此，render阶段的工作就结束了

<br/>


## commit阶段

 - commitRoot方法是commit阶段工作的起点。fiberRootNode会作为传参

 - 在rootFiber.firstEffect上保存了一条需要执行副作用的Fiber节点的 **单向链表effectList**，这些Fiber节点的 **updateQueue** 中保存了变化的props

 - 这些副作用对应的DOM操作在commit阶段执行，此外一些生命周期钩子（比如componentDidXXX）、hook（比如useEffect）需要在commit阶段执行

commit阶段的主要工作（即Renderer的工作流程）分为三部分：before mutation阶段（执行DOM操作前）、mutation阶段（执行DOM操作）、layout阶段（执行DOM操作后）


### before mutation阶段（执行DOM操作前）

会遍历effectList，依次执行：

1. 处理DOM节点渲染/删除后的 autoFocus、blur 逻辑

2. 调用 **getSnapshotBeforeUpdate** 生命周期钩子

3. 调度 useEffect （异步调用）


### mutation阶段（执行DOM操作）

会遍历effectList，依次执行：

1. 根据ContentReset effectTag重置文字节点

2. 更新ref

3. 根据effectTag分别处理，其中effectTag包括(Placement | Update | Deletion | Hydrating)


### layout阶段（执行DOM操作后）

该阶段触发的生命周期钩子和hook可以直接访问到已经改变后的DOM，即该阶段是可以参与DOM layout的阶段

会遍历effectList，依次执行：

1. ClassComponent会调用 componentDidMount (opens new window)或 componentDidUpdate；触发状态更新的this.setState如果赋值了第二个参数回调函数，也会在此时调用。

2. 对于FunctionComponent及相关类型，他会调用useLayoutEffect hook的回调函数，调度useEffect的销毁与回调函数

3. 获取DOM实例，更新ref