import React, { useEffect } from 'react'

export function lazy(fn) {
    const fetcher = {
        status: 'pending',
        result: null,
        promise: null,
    }

    return function MyComponent() {
        const getDataPromise = fn()
        fetcher.promise = getDataPromise
        getDataPromise.then(res => {
            fetcher.status = 'resolved'
            fetcher.result = res.default
        })

        useEffect(() => {
            if (fetcher.status === 'pending') {
                throw fetcher
            }
        }, [])

        if (fetcher.status === 'resolved') {
            return fetcher.result
        }

        return null
    }
}

class Suspense extends React.PureComponent {
    /**
     * isRender 异步组件是否就绪，可以渲染
     */
    state = {
        isRender: true
    }

    componentDidCatch(event) {
        this.setState({ isRender: false })

        event.promise.then(() => {
            /* 数据请求后，渲染真实组件 */
            this.setState({ isRender: true })
        })
    }

    render() {
        const { fallback, children } = this.props
        const { isRender } = this.state

        return isRender ? children : fallback
    }
}

export default Suspense