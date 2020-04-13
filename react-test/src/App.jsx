import React, { useEffect, useState, useCallback, useRef } from 'react';
import './App.css';
import { Button } from 'antd';
import Child from './Child'

function App() {
    const [count, setCount] = useState(0)
    const domRef = useRef(null)

    useEffect(() => {
        console.log('effect')
        console.log(domRef)
    }, [])

    const testFn = useCallback(() => {
        // do something
    }, [])

    const handleClick = () => {
        setCount(count => count + 1)
    }

    return (
        <div className="App">
            {/* count: {count} */}
            <br ref={domRef} />
            <br/>
            <Button onClick={handleClick}>click</Button>
            <br/>
            <br/>
            <Child testFn={testFn}></Child>
        </div>
    );
}

export default App;
