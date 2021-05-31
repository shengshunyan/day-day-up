import React, { useState } from 'react'
import kscreenshot from 'kscreenshot'

import './App.css'
// 100 200
class App extends React.Component {
    componentDidMount() {
        //65指键盘中的A
        const obj = new kscreenshot({
            key: 65,
            copyPath: this.copyPath,
            // immediately: true,
        })

        console.log(obj)
        obj.startScreenShot()
    }

    copyPath = (value) => {
        console.log('pic: ', value)
    }

    render() {
        return (
            <div className="container">
                aaa
            </div>
        )
    }
}

export default App
