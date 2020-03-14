---
title: React新特性 & React Hook
date: 2019-07-28
keywords: REACT, Hook
cover: https://i.loli.net/2020/03/14/26Pfh8OveLgnDxX.jpg
tags:
     - JavaScript
---
{% note info no-icon %}
### 参考链接：https://zhuanlan.zhihu.com/p/67087685
{% endnote %}


## 代码分割 & 错误处理

1. lazy 和 Suspense 配套使用，react原生支持代码分割；

2. react错误边界处理getDerivedStateFromError和componentDidCatch；
<!-- more -->
```JavaScript
import React, { Component, lazy, Suspense } from 'react';
import './App.css';

// lazy 和 Suspense 配套使用，react原生支持代码分割
// webpackChunkName配置为了chunk名字更好认
const About = lazy(() => import(/* webpackChunkName: "about" */'./About'));

class App extends Component {
  state = {
    hasError: false
  }

  // 处理错误方法1
  static getDerivedStateFromError() {
    return {
      hasError: true
    }
  }

  // 处理错误方法2
  // componentDidCatch() {
  //   this.setState({ hasError: true })
  // }

  render() {
    if (this.state.hasError) {
      return <div>error</div>
    }

    return (
      <div className="App">

        <Suspense fallback={<div>loading</div>}>
          <About></About>
        </Suspense>

      </div>
    );
  }
}

export default App;
```


## 利用PureComponent或者memo优化组件，避免不必要的渲染

1. class组件：PureComponent
```JavaScript
import React, { Component, PureComponent, memo } from 'react';
import './App.css';

// age变化会导致child组件重新渲染
// class Child extends Component {
//   render() {
//     console.log('child render')
//     return <div>age: 11</div>
//   }
// }

// PureComponent: age变化不会导致child组件重新渲染
class Child extends PureComponent {
  render() {
    console.log('child render')
    return <div>age: 11</div>
  }
}

class App extends Component {
  state = {
    age: 18
  }

  addAge = () => {
    this.setState({
      age: this.state.age + 1
    })
  }

  render() {
    return (
      <div className="App">
        <Child></Child>
        <button onClick={this.addAge}>add</button>
      </div>
    );
  }
}

export default App;
```
2. Function组件：React.memo，React.useCallback
  - React.memo 和 React.useCallback 一定记得需要配对使用，缺了一个都可能导致性能不升反“降”
```JavaScript
import React, { memo, useState, useCallback } from 'react';
import './App.css';

// age变化不会导致child组件重新渲染
const Child = memo(function() {
  console.log('child render')
  return <div>age: 11</div>
})

function App() {
  const [age, setAge] = useState(18)
  const testFn = useCallback(() => {
        // do something
  }, [])
  const addAge = () => {
    setAge(age => age + 1)
  }

return (
      <div className="App">
        age: {age}
        <Child testFn={testFn}></Child>
        <button onClick={addAge}>add</button>
      </div>
    );
}

export default App;
```



## Hook API
1. useEffect
    - 第二个参数(依赖数组)不传的时候，fn在第一次渲染和更新的时候都会执行
    ```JavaScript
    useEffect(fn)
    ```
    - 第二个参数(依赖数组)传空数组的时候，fn在只在第一次渲染执行
    ```JavaScript
    useEffect(fn, [])
    ```
2. useMemo & useCallback:
    - useEffect和useMemo作用相似，但是useEffect是渲染结束后执行；
    - useMemo是渲染过程中执行，可以参与渲染过程；
    - useMemo可以根据依赖来决定一个函数是否需要重新执行；
    - useCallback是useMemo的一种特殊情况；
    ```JavaScript
    useMemo(() => fn)
    useCallback(fn)
    ```
    - 当一个函数需要当做属性传递给子组件，为了避免子组件重新渲染，可以用useCallback；
    - 当一个值不需要每次重新赋值或者计算，可以用useCallback指定依赖，依赖变化才会导致重新赋值或者计算；
    ```JavaScript
    const [word, setWord] - useState('');
    const trimWord = useMemo(() => word.trim(), [word]);
    ```
3. useRef:
    - 保存dom节点的引用；
    - 保存函数组件中变量的唯一引用（函数组件中声明的变量每次更新都会重新声明），而且值得变化不会导致重新渲染；
4. useEffect / useLayoutEffect:
    - useEffect: useEffect用于处理大多数副作用，其中的回调函数会在render执行之后在调用，确保不会阻止浏览器的渲染，这跟componentDidMount和componentDidUpdate是不一样的，他们会在渲染之后同步执行。
    - useLayoutEffect: 在大多数情况下，我们都可以使用useEffect处理副作用，但是，如果副作用是跟DOM相关的，就需要使用useLayoutEffect。useLayoutEffect中的副作用会在DOM更新之后同步执行。
5. useContext:
    - 是用来多级组件之间传递参数；
6. 自定义hook: 
    - 其实能做函数组件能做的任何事，复用逻辑；
7. hook实践：
    - useState创建的状态改变了，就会导致当前组件更新，不管该状态有没有在该组件中被引用；

