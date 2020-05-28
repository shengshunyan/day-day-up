import React from 'react';
import './App.css';
import Child from './Child'

// function App() {
//     const [count, setCount] = useState(0)

//     return (
//         <div className="App">
//             <p>Parent: {count}</p>
//             <button onClick={() => setCount(count + 1)}>add count</button>

//             <br/>
//             <hr/>
//             <br/>

//             <Child count={count}></Child>
//         </div>
//     );
// }

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
