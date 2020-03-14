import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { Button } from 'antd';
import Child from './Child'

function App() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        console.log('effect')
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
            <br/>
            <br/>
            <Button onClick={handleClick}>click</Button>
            <br/>
            <br/>
            <Child testFn={testFn}></Child>
        </div>
    );
}

export default App;
