---
title: React状态管理之redux
date: 2020-04-11
keywords: react, 状态管理, redux
cover: https://i.loli.net/2020/04/15/o8uxKypfQsBtdre.png
tags:
     - JavaScript
---


## redux特点

1. Redux 是 JavaScript 状态容器，提供可预测化的状态管理。
2. 应用中所有的 state 都以一个对象树的形式储存在一个单一的 store 中。 惟一改变 state 的办法是触发 action，一个描述发生什么的对象。 为了描述 action 如何改变 state 树，你需要编写 reducers。
3. 但是模版代码太多，每次改一点业务动辄就需要改四五个文件，着实令人心累。

<br/>


## 示例代码

1. pageA/store/actions.js
```JavaScript
import axios from 'axios'

/**
 * action type
 * INCREMENT 增加
 * DECREMENT 减少
 * CHANGE 增加相关的值
 * GET_OPTIONS 从服务端获取数据
 */
export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'
export const CHANGE = 'CHANGE'
export const GET_OPTIONS = 'GET_OPTIONS'

/**
 * action creator
 * increase 增加
 * decrease 减少
 * change 增加相关的值
 * getOptions 从接口获取选项值
 */
export const increase = () => {
    return { type: INCREMENT }
}
export const decrease = () => {
    return { type: DECREMENT }
}
export const change = value => {
    return { 
        type: CHANGE,
        payload: value
    }
}
export const getOptions = () => dispatch => {
    axios.get('/api/pageA/options')
        .then(res => {
            dispatch({
                type: GET_OPTIONS,
                payload: res.data.data
            })
        })
}
```
2. pageA/store/reducer.js
```JavaScript
import * as actions from './actions'

/**
 * count 计数
 * optionList 选项值列表
 */
const initState = {
    count: 0,
    optionList: [],
}

export default function counter(state = initState, action) {
    switch (action.type) {
        case actions.INCREMENT:
            return { ...state, count: state.count + 1 };
        case actions.DECREMENT:
            return { ...state, count: state.count - 1 };
        case actions.CHANGE:
            return { ...state, count: state.count + Number(action.payload) };
        case actions.GET_OPTIONS:
            return { ...state, optionList: action.payload };
        default:
            return state;
    }
}
```
3. pageA/container/main.js
```JavaScript
import { connect } from 'react-redux'
import { increase, decrease, change, getOptions } from '../store/actions'
import view from '../component/main'

const mapStateToProps = store => {
    const pageAStore = store.pageA

    return {
        count: pageAStore.count,
        optionList: pageAStore.optionList,
    }
}

// const mapDispatchToProps = (dispatch, ownProps) => {
//     return {
//         increase: () => dispatch(increase()),
//         decrease: () => dispatch(decrease()),
//         change: value => dispatch(change(value)),
//         getOptions: () => dispatch(getOptions()),
//     }
// }

// 相当于上一种写法的简写
const mapDispatchToProps = {
    increase,
    decrease,
    change,
    getOptions
}

export default connect(mapStateToProps, mapDispatchToProps)(view)
```
4. pageA/component/main.jsx
```JavaScript
import React, { useState, useEffect } from 'react';

import './main.css';

function PageA({
    count, optionList, increase,
    decrease, change, getOptions,
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
            <button onClick={increase}>increase</button>
            <button onClick={decrease}>decrease</button>

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


## 注意点

1. redux可以用 redux-thunk 处理请求接口这样的副作用
2. redux可以用 combineReducers 整合reducer子模块
```JavaScript
// src/store.js
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import pageA from './pageA/store/reducer'

const rootReducer = combineReducers({
    pageA,
})

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store
```


{% note info no-icon %}
## 拓展：create-react-app 添加 proxy 接口代理
{% endnote %}

1. npm安装 http-proxy-middleware 模块
2. scr目录下添加 setupProxy.js 文件
```JavaScript
const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy.createProxyMiddleware('/api', {
        target: 'http://127.0.0.1:8000/',
    }));
};
```

