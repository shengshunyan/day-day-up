import React from 'react';

// const Child = ({ count }) => {
//     const [parentCount, setParentCount] = useState(count)

//     useEffect(() => {
//         console.log('更新child self count')
//         setParentCount(count)
//     }, [count])

//     return (
//         <div className="child">
//             child from parent count {count}
//             <br/>
//             child self count {parentCount}
//         </div>
//     );
// }

class Child extends React.Component {
    state = {
        parentCount: this.props.count
    }

    // static getDerivedStateFromProps(props, state) {
    //     console.log('getDerivedStateFromProps')
    //     console.log(props, state)
    //     if (props.count !== state.parentCount) {
    //         return {
    //             parentCount: props.count,
    //         }
    //     }
    //     // Return null if the state hasn't changed
    //     return state
    // }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.count !== prevProps.count) {
            this.setState({ parentCount: this.props.count })
        }
    }

    addCount = () => {
        const { parentCount } = this.state
        this.setState({
            parentCount: parentCount + 1
        })
    }

    render() {
        const { count } = this.props
        const { parentCount } = this.state

        return (
            <div className="child">
                child from parent count {count}
                <br />
                child self count {parentCount}

                <button onClick={this.addCount}>add count</button>
            </div>
        )
    }
}

export default React.memo(Child);
