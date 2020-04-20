import React, { useEffect } from 'react';

// const Child = () => {

//     useEffect(() => {
//         console.log('child update')
//     })

//     return (
//         <div className="child">
//             child
//         </div>
//     );
// }

// export default React.memo(Child);

class Child extends React.Component {
    componentDidUpdate() {
        console.log('child update')
    }

    render() {
        return (
            <div>Child</div>
        )
    }
}

export default Child
