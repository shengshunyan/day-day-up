import React, { useState } from 'react';

const Child = () => {
    const [count, setCount] = useState(0)

    if (count === 3) {
        throw new Error('child crashed!');
    }

    return (
        <div className="child">
            {count}
            <button onClick={() => setCount(count + 1)}>child add</button>
        </div>
    );
}

export default React.memo(Child);
