import React, { useEffect } from 'react';
import { isDetailReady } from '../../App';

function Header({ person }) {
  useEffect(() => {
    console.log('person info change', person);
    console.log('isDetailReady: ', isDetailReady)
  }, [person])

  return (
    <div className="header">
      Header
    </div>
  );
}

export default React.memo(Header);