---
title: React Router跳转前确认
date: 2020-07-08
keywords: JavaScript, React, Router
cover: https://s1.ax1x.com/2020/05/28/tZXg7q.jpg
tags:
     - JavaScript
---


## 需求背景

项目开发中经常会有这样的需求，进入一个编辑页面，输入了相关内容，再点击导航进行有页面跳转，页面跳转前需要先弹窗向用户确认是否放弃修改。
这个时候，就可以使用React Router中的Prompt组件来实现。

<br/>


## 实际案例

1. 先创建一个App组件，添加页面导航
  ```JavaScript
  import { HashRouter as Router, Link, Route } from 'react-router-dom'

  // 根组件App
  function App() {
    return (
      <Router getUserConfirmation={getConfirmation}>
          <div className="App">
              <Link to="/">Home</Link>
              <Link to="/About">About</Link>
              <Link to="/Product">Product</Link>
              <hr />
              <Route path="/" exact component={Home}></Route>
              <Route path="/about" component={About}></Route>
              <Route path="/product" component={Product}></Route>
          </div>
      </Router>
    )
  }

  // 示例页面
  const Home = () => {
      return (
          <div>
              <h2>Home</h2>
          </div>
      )
  }
  const About = () => (
      <div>
          <h2>About</h2>
      </div>
  )
  const Product = () => (
      <div>
          <h2>Product</h2>
      </div>
  )
  ```

2. 在Home页面添加一个输入框，引入Prompt组件来实现编辑输入框之后跳转需要弹窗用户确认
  - Prompt组件参数message：String 弹窗的提示信息
  - Prompt组件参数when：Boolean 跳转前是否展示确认弹窗

  ```JavaScript
  // 编辑Home组件
  import { Prompt } from 'react-router-dom'

  const Home = () => {
      /**
       * text 输入框的值
       * isEdited 输入框是否编辑过
       */
      const [text, setText] = useState('')
      const [isEdited, setIsEdited] = useState(false)

      const onInputChange = e => {
          setText(e.target.value)
          setIsEdited(true)
      }

      return (
          <div>
              <Prompt message="编辑的内容还未保存，确定要离开该页面吗?" when={isEdited} />
              <h2>Home</h2>

              <Input value={text} onChange={onInputChange} />
          </div>
      )
  }
  ```

3. 以上逻辑实现的确认弹窗是系统自带的确认弹窗，为了保持风格一致，可以通过Router的getUserConfirmation参数来自定义弹窗，用了antd的modal组件
  ```JavaScript
  // 编辑App组件
  function App() {
    const getConfirmation = (msg, cb) => {
      Modal.confirm({
          title: '确认',
          content: msg,
          okText: '确认',
          cancelText: '取消',
          onOk() {
              cb(true)
          },
          onCancel() {
              cb(false)
          }
      })
    }

    return (
        <Router getUserConfirmation={getConfirmation}>
            // ...
        </Router>
    )
  }
  ```

4. 这时候，当用户在Home页面编辑了input输入框之后，点击导航跳转其他页面时，会出现用户确认弹窗。用户点击确认则会跳转，点击取消则会停在当前页面。

  ![WX20200708-2014078a748cc9b5a5e9eb.png](https://file.moetu.org/images/2020/07/08/WX20200708-2014078a748cc9b5a5e9eb.png)

<br/>


## 完整代码

/src/App.jsx

```JavaScript
import React, { useState } from 'react'
import './App.css'
import { HashRouter as Router, Link, Route, Prompt } from 'react-router-dom'
import { Modal, Input } from 'antd'

function App() {
  const getConfirmation = (msg, cb) => {
      Modal.confirm({
          title: '确认',
          content: msg,
          okText: '确认',
          cancelText: '取消',
          onOk() {
              cb(true)
          },
          onCancel() {
              cb(false)
          }
      })
  }

    return (
        <Router getUserConfirmation={getConfirmation}>
            <div className="App">
                <Link to="/">Home</Link>
                <Link to="/About">About</Link>
                <Link to="/Product">Product</Link>

                <hr />

                <Route path="/" exact component={Home}></Route>
                <Route path="/about" component={About}></Route>
                <Route path="/product" component={Product}></Route>
            </div>
        </Router>
    )
}

export default App


// pages
const Home = () => {
    const [text, setText] = useState('')
    const [isEdited, setIsEdited] = useState(false)

    const onInputChange = e => {
        setText(e.target.value)
        setIsEdited(true)
    }

    return (
        <div>
            <Prompt message="编辑的内容还未保存，确定要离开该页面吗?" when={isEdited} />
            <h2>Home</h2>

            <Input value={text} onChange={onInputChange} />
        </div>
    )
}

const About = () => (
    <div>
        <h2>About</h2>
    </div>
)

const Product = () => (
    <div>
        <h2>Product</h2>
    </div>
)
```