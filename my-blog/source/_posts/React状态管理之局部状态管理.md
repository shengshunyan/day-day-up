---
title: React状态管理之局部状态管理
date: 2020-04-15
keywords: react, 状态管理, hook, state
cover: https://s1.ax1x.com/2020/05/28/tZXg7q.jpg
tags:
     - JavaScript
---


## local state的管理

1. 之前讨论的 redux、rematch、easy-peasy 都是全局的状态管理
2. 对于大部分的简单业务，local state的管理并不麻烦，基本上就是控制一些弹窗的展示，loading的展示等

<br/>


## 常见例子

1. 例子中的逻辑是一个组件获取接口数据，并根据接口状态展示不同信息；
2. 例子中是一个class组件，组件中既包含view视图，又包含model数据处理（状态存储和状态修改逻辑）
3. 这样的写法优点是逻辑紧密关联，易于理解；缺点是逻辑难以复用
```JavaScript
import React from 'react';
import axios from 'axios'

class PageA extends React.Component {
    /**
     * loading 是否显示loading
     * data 数据
     * err 请求错误
     */
    state = {
        loading: false,
        data: null,
        err: null
    }

    async componentDidMount() {
        this.setState({ loading: true })
        try {
            const res = await axios.get('/api/pageA/options')
            this.setState({
                loading: false,
                data: res.data.data,
            })
        } catch (err) {
            this.setState({ 
                loading: false, 
                error: err.message 
            })
        }
    }

    render() {
        if (this.state.loading) {
            return <div>loading....</div>
        } else {
            return <div>{this.state.data}</div>
        }
    }
}

export default PageA;
```

<br/>


## class组件的逻辑复用：容器组件和视图组件分离

### 视图组件复用

1. 容器组件只负责处理状态
2. 视图组件之负责展示
3. 一般UI组件库使用这种方式
```JavaScript
import React from 'react';
import axios from 'axios'

// 视图组件
class Loading extends React.Component {
    render() {
        if (this.props.loading) {
            return <div>loading....</div>
        } else {
            return <div>{this.props.data}</div>
        }
    }
}

// 容器组件
class PageA extends React.Component {
    /**
     * loading 是否显示loading
     * data 数据
     * err 请求错误
     */
    state = {
        loading: false,
        data: null,
        err: null
    }

    async componentDidMount() {
        this.setState({ loading: true })
        try {
            const res = await axios.get('/api/pageA/options')
            this.setState({
                loading: false,
                data: res.data.data,
            })
        } catch (err) {
            this.setState({
                loading: false,
                error: err.message
            })
        }
    }

    render() {
        return <Loading {...this.state}></Loading>
    }
}

export default PageA;
```

### 容器组件复用

1. 高阶组件HOCTypescript的支持并不友好，代码可读性差
```JavaScript
import React from 'react';
import axios from 'axios'

// 视图组件
class Loading extends React.Component {
    render() {
        if (this.props.loading) {
            return <div>loading....</div>
        } else {
            return <div>{this.props.data}</div>
        }
    }
}

// 容器组件
function withLoading(Component) {
    return class PageA extends React.Component {
        /**
         * loading 是否显示loading
         * data 数据
         * err 请求错误
         */
        state = {
            loading: false,
            data: null,
            err: null
        }

        async componentDidMount() {
            this.setState({ loading: true })
            try {
                const res = await axios.get('/api/pageA/options')
                this.setState({
                    loading: false,
                    data: res.data.data,
                })
            } catch (err) {
                this.setState({
                    loading: false,
                    error: err.message
                })
            }
        }

        render() {
            return <Component {...this.state}></Component>
        }
    }
}

export default withLoading(Loading);
```
2. renderProps会导致嵌套过多
```JavaScript
<WithLoading>
  {(props) => {
    <Loading {...props} />
  }}
</WithLoading>
```

<br/>


## React Hook 实现逻辑复用

### 优势

1. React Hook的一大特色就是状态逻辑复用
2. 而且社区上已经积攒了很多的hook可以直接使用
```JavaScript
import React, { useState, useEffect } from 'react';
import axios from 'axios'

function useLoading() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get('/api/pageA/options').then(res => {
            setLoading(false);
            setData(res.data.data);
        }).catch(err => {
            setLoading(false);
            setError(err.message)
        })
    }, [])

    return [loading, error, data]
}

function PageA() {
    const [loading, error, data] = useLoading();

    if (loading) {
        return <div>loading....</div>
    } else {
        return <div>{data}</div>
    }
}

export default PageA;
```

### 不足
1. 在function里组织业务代码，调用函数的时候需要注意函数声明的顺序
2. 需要规范hook代码顺序
```JavaScript
function APP(){
  // 1. useState, useRef
  // 2. 组件函数
  // 3. useEffect
  // 4. render逻辑
}
```

<br/>