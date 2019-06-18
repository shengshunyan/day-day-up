---
title: 揭密React setState
date: 2018-09-19
categories: "react"
tags: 
     - JavaScript
     - 博客
---

1. [参考](https://zhuanlan.zhihu.com/p/43522965)
2. 注意点：setState(updater, callback)这个方法是用来告诉react组件数据有更新，有可能需要重新渲染。它是异步的，react通常会集齐一批需要更新的组件，然后一次性更新来保证渲染的性能。所以在使用setState改变状态之后，立刻通过this.state去拿最新的状态往往是拿不到的。  
<!-- more -->
3. 使用要点：
    1. 所以第一个使用要点就是：如果你需要基于最新的state做业务的话，可以在componentDidUpdate或者setState的回调函数里获取。
    ```JavaScript
    // setState回调函数
    changeTitle: function (event) {
        this.setState({ title: event.target.value }, () => this.APICallFunction());
    },
    APICallFunction: function () {
    // Call API with the updated value
    }
    ```
    2. 设想有一个需求，需要在在onClick里累加两次，如下
    ```JavaScript
    // wrong
    onClick = () => {
      this.setState({ index: this.state.index + 1 });
      this.setState({ index: this.state.index + 1 });
    }
    
    // correct
    // 如果是下一个state依赖前一个state的话，推荐给setState传function
    onClick = () => {
      this.setState((prevState, props) => {
        return {quantity: prevState.quantity + 1};
      });
      this.setState((prevState, props) => {
        return {quantity: prevState.quantity + 1};
      });
    }
    ```