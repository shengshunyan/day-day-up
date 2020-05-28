---
title: React状态管理之easy-peasy
date: 2020-04-14
keywords: react, 状态管理, redux, easy-peasy
cover: https://s1.ax1x.com/2020/05/28/tZXg7q.jpg
tags:
     - JavaScript
---


## redux存在的问题

1. 项目中redux的样板文件太分散，书写和维护都比较麻烦
2. 使用thunk来处理异步操作，不是那么直观

<br/>


## easy-peasy特点

1. easy-peasy的使用方式和rematch相似，但easy-peasy内置对hook的支持
2. easy-peasy并不依赖react-redux，可以直接用useStoreState, useStoreActions在组件中直接获取相关的store状态和action，不需要connect container通过props来传递
3. 对typescript的完美支持，可以享受享自动补全和类型检查的功能
4. 内置immutable，写法上是mutable，但实际上是immutable
5. 内置computed

<br/>


{% note info no-icon %}
项目github地址：https://github.com/ctrlplusb/easy-peasy
{% endnote %}


## 示例代码

1. src/store.js
```JavaScript
import { createStore } from 'easy-peasy'
import pageA from './pageA/store'

const store = createStore({
    pageA
})

export default store
```

2. 在index.js中通过StoreProvider组件包裹App根组件

3. src/pageA/store/index.js  
有computed示例
```JavaScript
import { action, thunk, computed } from 'easy-peasy'
import axios from 'axios'

const pageA = {
    /**
     * @desc state
     * count 计数
     * optionList 选项列表
     */
    count: 0,
    optionList: [],

    /**
     * @desc computed
     */
    visibleOptionList: computed(({ optionList }) => {
        return optionList.slice(0, 2)
    }),

    /**
     * @desc actions
     * increment 加1
     * decrement 减1
     * change 改变相关值
     * getOptionList 接口获取选项
     * setOptionList 设置选项
     */
    increment: action((state, payload) => {
        state.count += 1
    }),
    decrement: action((state, payload) => {
        state.count -= 1
    }),
    change: action((state, payload) => {
        state.count += Number(payload)
    }),
    getOptionList: thunk(async (actions, text) => {
        const res = await axios.get('/api/pageA/options')
        actions.setOptionList(res.data.data);
    }),
    setOptionList: action((state, payload) => {
        state.optionList = payload
    }),
}

export default pageA
```

4. pageA/component/main.jsx
```JavaScript
import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy'

function PageA() {
    /**
     * @desc 全局store传入的状态
     * count 计数
     * optionList select选项数据
     * visibleOptionList 经过筛选的select选项数据
     */
    const {
        count, optionList, visibleOptionList,
    } = useStoreState(state => state.pageA)
    /**
     * @desc actions
     * increment 加1
     * decrement 减1
     * change 改变相关值
     * getOptionList 获取下拉选列表数据
     */
    const {
        increment, decrement, change,
        getOptionList,
    } = useStoreActions(actions => actions.pageA)
    /**
     * inputValue 输入框的值
     */
    const [inputValue, setInputValue] = useState('')

    // change按钮点击事件
    const handleClick = () => {
        change(inputValue)
        setInputValue('')
    }

    // 初始加载选择框数据
    useEffect(() => {
        getOptionList()
    }, [getOptionList])

    return (
        <div>
            <h1>pageA</h1>

            <p>count: {count}</p>
            <button onClick={increment}>increment</button>
            <button onClick={decrement}>decrement</button>

            <br/>

            <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} />
            <button onClick={handleClick}>change</button>

            <br/>

            <select name="options">
                {
                    optionList.map(item => (
                        <option key={item} value={item}>{item}</option>
                    ))
                }
            </select>

            <select name="visible-options">
                {
                    visibleOptionList.map(item => (
                        <option key={item} value={item}>{item}</option>
                    ))
                }
            </select>
        </div>
    )
}

export default PageA;
```

<br/>