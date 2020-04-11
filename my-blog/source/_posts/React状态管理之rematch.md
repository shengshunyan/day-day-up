---
title: React状态管理之rematch
date: 2020-04-12
keywords: react, 状态管理, redux, rematch
cover: https://i.loli.net/2020/04/11/qAxoWH5eVdTPD6u.png
tags:
     - JavaScript
---


## redux存在的问题

1. 项目中redux的样板文件太分散，书写和维护都比较麻烦
2. 使用thunk来处理异步操作，不是那么直观

<br/>


## 基于redux数据流的管理方案

1. Dva：
    - Dva是蚂蚁金服开源的一个数据流管理方案，基于redux和redux-saga；
    - 需要使用Dva的一整套框架，现有的项目会有较大的改动；
    - Dva使用redux-saga来处理异步，学习成本比较高
2. mirror：类似于Dva的一个redux数据流方案，更新不频繁；
3. rematch：结合了Dva和mirror的特点


## rematch特点

1. rematch是在redux的基础上再次封装后成果。rematch的写法和vuex基本一样
2. 使用model文件统一管理同步和异步操作
3. 通过中间键实现了async/await的方式来处理异步，不用引入其他插件
4. 支持多个store

<br/>


{% note info no-icon %}
项目github地址：https://github.com/rematch/rematch
{% endnote %}


## 示例代码

1. src/store.js
```JavaScript
import { init } from '@rematch/core'
import pageA from './pageA/store'

const store = init({
    models: { 
        pageA 
    },
})

export default store
```

2. src/pageA/store/index.js
```JavaScript
import axios from 'axios'

const count = {
    /**
     * count 计数
     * optionList 选项列表
     */
    state: {
        count: 0,
        optionList: [],
    },
    reducers: {
        increment(state, payload) {
            return { ...state, count: state.count + 1 }
        },
        decrement(state, payload) {
            return { ...state, count: state.count - 1 }
        },
        change(state, payload) {
            return { ...state, count: state.count + Number(payload) }
        },
        setOptionList(state, payload) {
            return { ...state, optionList: payload }
        },
    },
    effects: dispatch => ({
        async getOptions(payload, rootState) {
            const res = await axios.get('/api/pageA/options')
            this.setOptionList(res.data.data)
        },
    }),
}

export default count
```

3. pageA/container/main.jsx
```JavaScript
import { connect } from 'react-redux'
import view from '../component/main'

const mapStateToProps = store => {
    const pageAStore = store.pageA

    return {
        count: pageAStore.count,
        optionList: pageAStore.optionList,
    }
}

const mapDispatchToProps = ({ 
    pageA: { 
        increment, decrement, change,
        getOptions,
    }
}) => {
    return {
        increment, decrement, change,
        getOptions,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(view)
```

4. pageA/component/main.jsx
```JavaScript
import React, { useState, useEffect } from 'react';

import './main.css';

function PageA({
    count, optionList, increment,
    decrement, change, getOptions,
}) {
    /**
     * 输入框的值
     */
    const [inputValue, setInputValue] = useState('')

    // 输入框值变化
    const handleInputChange = event => {
        setInputValue(event.target.value)
    }

    useEffect(() => {
        getOptions()
    }, [getOptions])

    return (
        <div className="page-a">
            page a

            <br />
            <br />

            <h2>count: {count}</h2>
            <button onClick={increment}>increment</button>
            <button onClick={decrement}>decrement</button>

            <br />
            <br />

            <input value={inputValue} onChange={handleInputChange} type="text" />
            <button onClick={() => change(inputValue)}>change</button>

            <br />
            <br />

            <select name="select" id="select">
                {
                    optionList.map(item => (
                        <option key={item} value={item}>{item}</option>
                    ))
                }
            </select>
        </div>
    );
}

export default PageA;
```

<br/>