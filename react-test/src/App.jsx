import React, { useState } from 'react'
import { Button, Input } from 'antd'

import './App.css'

function debounce(fn, time) {
    return function (e) {
        let that = this
        let value = e.target.value
        clearTimeout(fn.tid)
        fn.tid = setTimeout(() => {
            // console.log(2, newArgs)
            fn.call(that, value)
        }, time);
    }
}

function App() {
    const inputChange = debounce((value) => {
        console.log(value)
    }, 1000)

    return (
        <div className="App">
            App

            <Input onChange={inputChange} ></Input>
        </div>
    )
}

export default App
