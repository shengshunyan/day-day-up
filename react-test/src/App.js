import React, {  useState, useReducer, useEffect, useRef, Component } from 'react'
import './App.css'

// class App extends Component {
//     state = {
//         count: 0
//     }

//     componentDidMount() {
//         console.log('componentDidMount')
//     }

//     componentWillUnmount() {
//         console.log('componentWillUnmount')
//     }

//     componentDidUpdate() {
//         console.log('componentDidUpdate')
//     }

//     render() {
//         const { count } = this.state

//         return <div>
//             <span>{count}</span>
//             <button onClick={() => this.setState({ count: count + 1 })}>+</button>
//         </div>
//     }
// }

const reducer = function(state, action) {
    switch(action.type) {
        case 'increment':
            return { ...state, count: state.count + 1 }
        case 'addList':
            return { ...state, arr: [ ...state.arr, 1] }
        default:
            throw new Error('undefined action type!');
    }
}

function App() {
    const initialState = {
        count: 1,
        arr: [1, 2, 3]
    }
    const [state, dispatch] = useReducer(reducer, initialState)
    const inputElem = useRef()
    const [name, setName] = useState({
        firstName: 'james',
        lastName: 'lebran'
    })

    useEffect(() => {
        inputElem.current.focus()
    }, [])

    useEffect(() => {
        document.title = `You click ${state.count} times`
        return () => {
            console.log('clean up!')
        }
    }, [state.count])

    const handleNameChange = (value, type) => {
        setName({
            ...name,
            [type]: value
        })
    }

    return (
        <div className="App">
            <span>{state.count}</span>
            <div>
                list:
                {
                    state.arr.map((item, index) => <div key={index}>{item}</div>)
                }
            </div>
            <button onClick={() => dispatch({ type: 'increment' })}>add num</button>
            <button onClick={() => dispatch({ type: 'addList' })}>add list</button>
            <input type="text" ref={inputElem}/>
            <br/>
            <input type="text" value={name.firstName} onChange={e => handleNameChange(e.target.value, 'firstName')}/>
            <input type="text" value={name.lastName} onChange={e => handleNameChange(e.target.value, 'lastName')}/>
        </div>
    )
}

export default App
