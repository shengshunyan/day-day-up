import React from 'react';

const Child = ({ person }) => {
    console.log('update')

    return (
        <div className="child">
            child component

            <div>person info: age {person.age}, child age{person.child.childAge}</div>
        </div>
    );
}

export default React.memo(Child);
