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