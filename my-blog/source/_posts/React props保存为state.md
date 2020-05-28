---
title: React props保存为state
date: 2020-05-27
keywords: React, props, state
cover: https://s1.ax1x.com/2020/05/28/tZXg7q.jpg
tags:
     - JavaScript
---


## 概述

在项目开发过程中，常常有这样的需求。打开一个弹窗，父组件会传属性给弹窗子组件，但是弹窗只需要在点击确认关闭的时候，才需要将弹窗中的数据状态更新到父组件。这时候，就需要将父组件传入的属性保存到本地状态。

要求：父组件的props改变的时候，子组件的state也要更新。

<br/>


## Class组件

Class组件需要利用生命周期来实现此需求

### 讲解

1. 在Child组件生命state的时候，直接赋值为count property
  ```JavaScript
  state = {
    parentCount: this.props.count
  }
  ```

2. 然后利用生命周期函数componentDidUpdate监听count property的变化，当count变化时，利用setState更新Child组件的state
  ```JavaScript
  componentDidUpdate(prevProps, prevState) {
      if (this.props.count !== prevProps.count) {
          this.setState({ parentCount: this.props.count })
      }
  }
  ```

### 完整示例

/src/App.jsx
```JavaScript
import React from 'react';
import './App.css';
import Child from './Child'

class App extends React.Component {
    state = {
        count: 0
    }

    addCount = () => {
        const { count } = this.state
        this.setState({ count: count + 1 })
    }
    
    render() {
        const { count } = this.state

        return (
            <div className="App">
                <p>Parent: {count}</p>
                <button onClick={this.addCount}>add count</button>

                <br />
                <hr />
                <br />

                <Child count={count}></Child>
            </div>
        )
    }
}

export default App;
```


/src/Child.jsx
```JavaScript
import React from 'react';

class Child extends React.Component {
    state = {
        parentCount: this.props.count
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.count !== prevProps.count) {
            this.setState({ parentCount: this.props.count })
        }
    }

    addCount = () => {
        const { parentCount } = this.state
        this.setState({
            parentCount: parentCount + 1
        })
    }

    render() {
        const { count } = this.props
        const { parentCount } = this.state

        return (
            <div className="child">
                child from parent count {count}
                <br />
                child self count {parentCount}

                <button onClick={this.addCount}>add count</button>
            </div>
        )
    }
}

export default Child;
```

![tZWSXD.gif](https://s1.ax1x.com/2020/05/28/tZWSXD.gif)

<br/>

{% note info no-icon %}
### 注意点
{% endnote %}

这里不能用getDerivedStateFromProps周期函数来实现保存props为state的需求。

因为getDerivedStateFromProps的触发机制在V16.4有所调整：
  - 父组件props变化
  - 自身state变化（setState）

所以如果加了类似的逻辑，当Child组件setState改变自身状态的时候，你会发现状态无法改变。因为触发了getDerivedStateFromProps，改变后的值又被props里的值覆盖了。
```JavaScript
static getDerivedStateFromProps(props, state) {
    if (props.count !== state.parentCount) {
        return {
            parentCount: props.count,
        }
    }
    // Return null if the state hasn't changed
    return null
}
```

所以，getDerivedStateFromProps只适合用来做类似props变形的需求


<br/>

## Function组件

Function组件使用hook相关的Api看着更简介，心智负担更低。

### 讲解

1. 在Child组件利用useState将count property的值直接存储为本地state
  ```JavaScript
  const [parentCount, setParentCount] = useState(count)
  ```

2. 然后利用useEffect监听count property的变化，当count变化时，Child组件保存的本地状态也能及时更新
  ```JavaScript
  useEffect(() => {
      setParentCount(count)
  }, [count])
  ```


### 完整示例

/src/App.jsx
```JavaScript
import React, { useState } from 'react';
import './App.css';
import Child from './Child'

function App() {
    const [count, setCount] = useState(0)

    return (
        <div className="App">
            <p>Parent: {count}</p>
            <button onClick={() => setCount(count + 1)}>add count</button>

            <br/>
            <hr/>
            <br/>

            <Child count={count}></Child>
        </div>
    );
}

export default App;
```


/src/Child.jsx
```JavaScript
import React, { useState, useEffect } from 'react';

const Child = ({ count }) => {
    const [parentCount, setParentCount] = useState(count)

    useEffect(() => {
        console.log('更新child self count')
        setParentCount(count)
    }, [count])

    return (
        <div className="child">
            child from parent count {count}
            <br/>
            child self count {parentCount}
        </div>
    );
}

export default Child;
```

![tZWSXD.gif](https://s1.ax1x.com/2020/05/28/tZWSXD.gif)