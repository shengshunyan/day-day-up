import React, { useState } from 'react';
import './App.css';
import Child from './Child'

// function App() {
//     const [age, setAge] = useState(0)

//     return (
//         <div className="App">
//             <p>App</p>

//             {age}
//             <button onClick={() => setAge(age + 1)}>change theme</button>

//             <Child></Child>
//         </div>
//     );
// }

class App extends React.Component {
    state = {
        count: 1
    }

    render() {
        const { count } = this.state

        return (
            <div>
                <h1>App</h1>
                <p>{count}</p>
                <button onClick={() => this.setState({ count: count + 1 })}>add</button>
                <Child></Child>
            </div>
        )
    }
}

export default App;
