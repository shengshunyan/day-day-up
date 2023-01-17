import React, { useEffect, useState } from "react";
import { Button, Modal, Input } from 'antd';

import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  console.log('isModalOpen: ', isModalOpen)

  return (
    <div>
      {/* parent
      <button onClick={() => setCount(count + 1)}>button</button>
      <Child />
      {count} */}
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <MyModal visible={isModalOpen} key={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} />

    </div>
  );
}

function MyModal({ visible, handleOk, handleCancel }) {
  const [value, setValue] = useState('');
  const onChange = (e) => {
    setValue(e.target.value)
  }

  // useEffect(() => {
  //   if (!visible) {
  //     setValue('')
  //   }
  // }, [visible])

  console.log('visible: ', visible)
  return <Modal title="Basic Modal" visible={visible} onOk={handleOk} onCancel={handleCancel}>
    <Input placeholder="Basic usage" value={value} onChange={onChange} />
  </Modal>
}

// function Child() {
//   useEffect(() => {
//     console.log('child start')
//     return () => {
//       console.log('child end')
//     }
//   }, [])

//   return (
//     <div>
//       child
//     </div>
//   );
// }

export default App

// export default class App extends React.Component {
//   state = {
//     count: 0,
//   };
//   handleAdd = () => {
//     this.setState({
//       count: this.state.count + 1,
//     });
//   };
//   onChange = (key) => (e) => {
//     this.setState({
//       [key]: e.target.value,
//     });
//   };
//   render() {
//     const { text, password, count } = this.state;
//     return (
//       <div>
//         <div align="center">
//           <Count data={count} />
//           <button onClick={this.handleAdd}>add</button>
//         </div>
//       </div>
//     );
//   }
// }
