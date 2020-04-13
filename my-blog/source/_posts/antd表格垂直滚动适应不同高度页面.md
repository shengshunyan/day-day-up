---
title: antd表格垂直滚动适应不同高度页面
date: 2020-04-13
keywords: react, antd, table, 垂直滚动
cover: https://i.loli.net/2020/04/13/j1qbBphVZ7AwUOX.png
tags:
     - JavaScript
---


## Ant Design

1. antd 是基于 Ant Design 设计体系的 React UI 组件库，主要用于研发企业级中后台产品
2. 开箱即用的高质量 React 组件

<br/>


## Table组件

1. 可以对数据进行排序、搜索、分页、自定义操作等复杂行为
2. scroll属性可以设置x轴、y轴的出现滚动条的宽度、高度大小

参数 | 说明 | 类型
---|---|---
x | 设置横向滚动，也可用于指定滚动区域的宽，可以设置为像素值，百分比，true 和 'max-content' | number | true
y | 设置纵向滚动，也可用于指定滚动区域的高，可以设置为像素值 | number

<br/>


## 需求

1. scroll.y可以设置一个数值，当table内容高度达到这个数值的时候出现滚动条；
2. 面对不同高度的屏幕，Table需要出现滚动条的内容高度不一样，可以根据不同容器高度适配；

<br/>


## 解决方案

1. 利用弹性布局（如flex）设置table组件的容器组件的样式，让其填充页面剩余空间
2. 利用ref动态获取table容器组件的高度，保存到state.scrollY中，table组件的scroll.y也引用scrollY

<br/>

## 示例代码

### class组件
```JavaScript
import React from 'React'
import { Table } from 'antd'

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

class TableDemo extends React.Component {
    constructor(props) {
        super(props)
        this.tableWrapperRef = null
        /**
         * scrollY 表格垂直出现滚动的高度
         */
        this.state = {
            scrollY: 700,
        }
    }

    componentDidMount() {
        const { scrollY } = this.state
        // 90 = 表格header高度 + pagination高度
        const newScrollY = this.tableWrapperRef.clientHeight - 90
        // 动态设置表格的垂直滚动高度，5是误差范围内
        if (Math.abs(scrollY - newScrollY) > 5) {
            this.setState({
                scrollY: newScrollY
            })
        }
    }

    render() {
        const { scrollY } = this.state
        
        return (
            <div className="table-wrapper" ref={c => { this.tableWrapperRef = c }}>
                <Table 
                    dataSource={dataSource} 
                    columns={columns}  
                    scroll={{ y: scrollY }}
                />
            </div>
        )
    }
}

export default TableDemo
```

### function组件
```JavaScript
import React, { useEffect, useRef, useState } from 'React'
import { Table } from 'antd'

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

function TableDemo() {
    const tableWrapperRef = useRef(null)
    /**
     * scrollY 表格垂直出现滚动的高度
     */
    const [scrollY, setScrollY] = useState(700)

    // 根据页面高度动态设置表格垂直出现滚动的高度
    useEffect(() => {
        if (tableWrapperRef.current) {
            // 42 = 表格header高度
            setScrollY(preScrollY => {
                const nextScrollY = tableWrapperRef.current.clientHeight - 42
                // 5是误差范围内
                if (Math.abs(preScrollY - nextScrollY) > 5) {
                    return nextScrollY
                }
                return preScrollY
            })
        }
    }, [])

    return (
        <div className="table-wrapper" ref={tableWrapperRef}>
            <Table 
                dataSource={dataSource} 
                columns={columns}  
                scroll={{ y: scrollY }}
            />
        </div>
    )
}

export default TableDemo
```