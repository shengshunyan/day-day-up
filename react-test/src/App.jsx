import React from 'react'
import Suspense, { lazy } from './components/Suspense'

import './App.css'

const LazyComponent = lazy(() => new Promise(resolve => {
    setTimeout(() => {
        resolve({
            default: <div>component content</div>
        })
    }, 1000)
}))

class App extends React.PureComponent {
    render() {
        return (
            <div className="container">
                <h1>App</h1>
                
                <Suspense fallback={<div>loading</div>}>
                    <LazyComponent />
                </Suspense>
            </div>
        )
    }
}

export default App
