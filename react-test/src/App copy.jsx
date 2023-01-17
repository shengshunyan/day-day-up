// import logo from './logo.svg';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
// import { Form, Input, Button, Checkbox } from 'antd';

import './App.css';

export let isDetailReady = false;

// const getData = () => new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve({ name: 'xiaoming' })
//   }, 1000)
// })

// function App() {
//   const [person, setPerson] = useState(null);

//   useEffect(() => {
//     const init = async () => {
//       isDetailReady = false;
//       const data = await getData();
//       setPerson(data);
//       setTimeout(() => {
//         console.log('set isDetailReady true')
//         isDetailReady = true
//       }, 0);
//     }
//     init();
//   }, [])

//   return (
//     <div className="app">
//       app
//       <button onClick={onclick}>click</button>
//       <Header person={person} />
//     </div>
//   );
// }

// export default React.memo(App);

function App() {
  const [num, updateNum] = useState(0);
  console.log('App render', num);

  useEffect(() => {
    setInterval(() => {
      updateNum(1);
    }, 1000)
  }, [])

  return <Child />;
}

function Child() {
  console.log('child render');
  return <span>child</span>;
}

export default React.memo(App);