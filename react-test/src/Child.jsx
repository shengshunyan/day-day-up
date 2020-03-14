import React, { useEffect } from 'react';


const Child = React.memo(({
    testFn
}) => {
    console.log('child')
    useEffect(() => {
        console.log('child update')
    })

    return (
        <div className="child">
            bbb
        </div>
    );
})

export default Child;
