import React from 'react';
import './App.css';
import { Button, Table } from 'antd';

function App() {
    const dataSource = [
        {
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
        },
        {
            key: '2',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
        },
    ];
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '住址',
            dataIndex: 'address',
            key: 'address',
        },
    ];
    const onTableChange = () => {

    }

    return (
        <div className="App">
            <Button type="primary">Button</Button>
            <Table
                columns={[]}
                dataSource={[]}
                rowKey="taskSequence"
                onChange={onTableChange}
                pagination={{
                    defaultPageSize: 10,
                    defaultCurrent: 1,
                    total: 0,
                    size: 'middle',
                }}
            />
        </div>
    );
}

export default App;
