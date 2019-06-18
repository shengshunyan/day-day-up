---
title: 深入浅出React和Redux note
date: 2018-08-28
categories: "学习深入浅出React和Redux"
tags: 
     - JavaScript
     - 读书笔记
---
深入浅出React和Redux的一些读书笔记！


### 第一章 React新的前端思维方式

1. 组件的render函数所显示的动态内容来自于props和自身state;

### 第二章 设计高质量的React组件

1. 易于维护组件的设计要素：高内聚，低耦合；
    1. 高内聚：逻辑紧密相关的内容放一个组件中，传统的HTML, CSS, JAVASCRIPT文件分开管理不符合高内聚的原则；
    2. 低耦合：不同组件之间的依赖关系要尽量弱化；

<!-- more -->

2. React组件的数据：props(组件之间), state(组件内部);
    1. props: 
        1. propTypes检查只需在开发阶段添加辅助开发，正式环境打包可以用插件去除；
        2. defaultProps可以为组件的属性设置默认值；
    2. state: setState()函数先是改变this.state的值，然后驱动组件更新；
    3. props和state: 子组件不要去修改props;
3. 组件的生命周期：
    1. 装载：constructor -> render -> componentDidMount(componentWillMount基本没用)
        1. componentDidMount在所有组件render完毕之后才会依次执行；
        2. componentDidMount中可以通过ajax获取数据，操作dom(jquery)；
    2. 更新：componentWillRecieveProps -> shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate
        1. componentWillRecieveProps在父元素重新渲染的时候触发；
        2. shouldComponentUpdate(nextProps, nextState)可以比较新的props, state和当前this.props, this.state来决定是否更新组件，默认返回true更新；
        3. componentDidUpdate可以获取dom做一些操作(jqeury)；
        4. New props, this.setState(), this.forceUpdate()可以触发更新；
    3. 卸载：componentWillUnmount
        1. 用以清除在componentDidMount和componentDidUpdate阶段用非React的方法创造的一些DOM元素(React渲染的元素自己会清理)；
4. 16.4更新后的生命周期：去除componentWillMount, componentWillReceiveProps, componentWillUpdate, 添加static getDerivedStateFromProps;
    1. 装载：constructor -> static getDerivedStateFromProps -> render -> componentDidMount;
    2. 更新：static getDerivedStateFromProps -> shouldComponentUpdate -> render -> componentDidUpdate;
    3. 卸载：componentWillUnmount;
5. 高质量的组件：
    1. props定义组件对外接口，state保持内部状态；
    2. 利用propTypes和defaultProps规范化对外接口；
    3. 合理利用全局store，减少组件间保存重复的状态；

### 第三章 从Flux到Redux

1. Flux不足：
    1. 多个store，store之间存在依赖关系；
    2. 难以进行服务器端渲染；
    3. store混杂了逻辑和状态(开发调试不友好，不能hot load，即保持状态的条件下替换store逻辑)；
2. Redux：(Reducer + Flux)
    1. redux的基本原则：
        1. 唯一数据源；
        2. 保持状态只读；
        3. 数据改变只能通过纯函数完成；
    2. redux实例：每一个组件都引入store，并且将store中的数据存入state来渲染；
    3. redux + Context：构造一个顶层组件Provider，在其中将全局唯一的store存入Context中，这样下层组件都能获取到store;
    4. react-redux：原理和上一个一样，只是抽出了很多相同的逻辑；

### 第四章 模块化React和Redux应用

1. 代码文件的组织方式：按角色组织 -> 按功能组织(同一个功能的不同角色的文件放一个文件夹下)
2. 模块接口：每个模块根目录用一个index.js来作为模块的接口，导出actions, reducer, view，其他模块不能直接导入模块中的其他文件;
3. 状态树的设计：
    1. 一个模块控制一个状态节点；
    2. 避免冗余数据；
    3. 树形结构扁平；
4. react中获取表单值的两种方式：
    1. ref获取dom元素，然后再用相关属性获取值；
    2. 表单元素的value指向state，再指定表单元素的onChange事件不断更新state；
5. 开发辅助工具：
    1. react devtool, redux devtool, react perf(性能分析)；
    2. redux-immutable-state-invariant: 规范reducer中不去修改原来的state;

### 第五章 React组件的性能优化

1. 单个组件的性能优化：
    1. react根据新的props和state生成新的Virtual DOM，再比较新旧Virtual DOM，找出不同的地方，再去操作DOM；
    2. shouldComponentUpdate()函数能控制本组件是否需要比较新旧Virtual DOM之间的不同，返回false则会跳过这个组件的Virtual DOM的比较，自然也不会去更新DOM；
    3. react-redux，connect包装过的组件封装了shouldComponentUpdate()函数，他会浅比较oldProps和nextProps，若没有变化则返回false;
2. 多组件的性能优化：
    1. React的调和(Reconciliation)过程：新旧Virtual DOM树节点的比较过程(详细看书P116);
    2. 同类型组件需要加上Key(唯一，不变)，减少不必要的渲染；
    3. key和ref是React的保留属性，不能通过props传递给子组件；
3. 利用reselect提高数据获取性能：
    1. reselect插件可以缓存mapStateToProps()中的一些计算结果，如果传入的prop相关的参数没有改变，则直接用缓存值，减少计算；
    2. 范式化：不存储重复数据，查数据利用表连接(SQL风格)；
    3. 非范式化：为提高查询性能，存储重复数据，不进行表连接(NoSQL风格)；
    4. Store状态树的设计推荐范式化，因为借助reselect的缓存功能，大部分情况下都能命中缓存，减轻了表连接查询的计算性能问题；

### 第六章 React高阶组件(HOC)

1. 高阶组件：一个高阶组件就是一个函数，这个函数接受一个组件作为输入，然后返回一个新的组件最为结果，而且，返回的组件拥有了输入组件所不具有的功能；
2. 代理方式的高阶组件：
    1. 操纵prop;
    2. 访问ref;
    3. 抽取状态：实现类似react-redux的功能；
    4. 包装组件；
3. 继承方式的高阶组件：
    1. 操纵props;
    2. 操纵生命周期函数；
4. 代理方式和继承方式比较：
    1. 代理方式下，一次渲染，两个组件都要经历各自的生命周期；继承方式下，只有一个组件，只有一个生命周期；
    2. 尽量使用代理方式来构建高阶组件；
5. 高阶组件的显示名：标识高阶组件修饰，更易于调试；
6. 曾经的React Mixin: React.createClass中可以使用，现已不推荐；
7. 以函数为子组件：传递参数更灵活；(动画库中这样应用)
```JavaScript
const loggedinUser = 'mock user';
class AddUserProp extends React.Component {
    render() {
        const user = loggedinUser;
        return this.props.children(user);
    }
}
AddUserProp.propType = {
    children: React.PropTypes.func.isRequired
}

<AddUserProp>
    {
        (user) => <Foo user={user} />
    }
</AddUserProp>
```

### 第七章 Redux和服务器通信

1. React组件访问服务器：在componentDidMount()周期函数中去做请求服务器的事情，更新state去驱动组件更新；
2. Redux访问服务器：
    1. redux-thunk中间件：支持异步action
    2. 异步操作的模式：loading, success, failure代表请求的不同状态，dispatch不同的action;
    3. 异步操作的中止(abort)：维护各个请求的id，只在最新的请求返回时，去dispatch相关的action，忽略掉旧的请求返回；
3. Redux异步操作：
    1. 其他处理异步操作的中间件(方案)：redux-saga, redux-effects等；
    2. 利用Promise实现异步操作：将Promise作为特殊处理的异步action对象；

### 第八章 单元测试

1. 单元测试框架：
    1. Mocha + Chai
    2. Facebook出品的Jest
2. 测试代码组织：
    1. 在根目录下新建__test__目录；
    2. 目录结构和src下一样；
    3. 文件以.test.js后缀；
    4. 测试套件(describe)包裹测试用例(it) + 钩子函数；
3. 辅助工具：
    1. Enzyme：组件渲染；
    2. sinon.js：模拟请求；
    3. redux-mock-store；
4. 单元测试实例

### 第九章 拓展Redux

1. 中间件：
    1. 中间件可以用来增强Redux Store的dispatch方法，也就是从dispatch函数调用到action对象被reducer处理的这个过程中的操作；
    2. redux-thunk中间件：
    ```JavaScript
    function createThunkMiddleware(extrArgument) {
        return ({ dispatch, getState }) => next => action => {
            if (typeof action === 'function') {
                return action(dispatch, getState, extraArgument);
            }
            return next(action);
        };
    }
    const thunk = createThunkMiddleware();
    export default thunk;
    ```
    3. 中间件的使用
        1. 方法一：包装createStore;
        ```JavaScript
        import { createStore, applyMiddleware } from 'redux';
        import thunkMiddleware from 'redux-thunk';
        
        const configureStore = applyMiddleware(thunkMiddleware)(createStore);
        const store = configureStore(reducer, initialState);
        ```
        2. 方法二：把applyMiddleware的结果当作Store Enhancer；
        ```JavaScript
        import { createStore, applyMiddleware, compose } from 'redux';
        import thunkMiddleware from 'redux-thunk';
        
        const storeEnhancers = compose(
            applyMiddleware(...midlewares),
            (window && window.devToolsExtention) ? window.devToolsExtension() : f => f
        );
        const store = createStore(reducer, storeEnhancers);
        ```
    4. promise中间件的实现
2. Store Enhancer：可以增强Redux Store的各个方面，定制一份store对象的所有接口(其实中间件功能就是利用增强器来实现的)；
    1. 增强器接口：
    ```JavaScript
    // do nothing
    const doNothingEnhancer = (createStore) => (reducer, preloadedState, enhancer) => {
        const store = createStore(reducer, preloadedState, enhancer);
        return store;
    };
    ```
    2. 给dispatch增加一个日志输出功能；
    3. reset

### 第十章 动画

1. css方式：ReactCSSTransitionGroup;
    1. react官方提供的组件；
    2. 可在组件上配置active, leave, appear的相关属性；
    3. 需配合css样式实现动画(有相关的命名规则)；
    4. 解决的是react组件装载和卸载阶段的动画实现；
2. 脚本方式：React-Motion动画库；
    1. 以函数为子组件的模式；
    2. spring函数用于产生动画属性的开始和结束状态；
    3. TransitionMotion是一个组件，用于处理装载和卸载过程；

### 第十一章 多页面应用

1. 传统多页面应用缺点：
    1. 路由切换，页面刷新；
    2. 重复加载资源(js, css)；
2. 单页面模拟多页面应用：
    1. 不同页面之间切换不会刷新页面；
    2. 页面内容和url保持一致；
3. React-Router:
    1. 路由注册；
    2. 路由链接；
    3. 路由嵌套；
    4. 集成Redux(react-router-redux)：将路径和store中的路径状态保持一致；
4. 代码分片：(更新可能比较快)
    1. 修改webpack配置：output, plugins;
    2. 修改逻辑代码(Route配置)：路由注册映射组件的部分改用动态加载语法；
    3. 动态更新Store的reducer和状态；(较复杂，没看明白，具体应用的时候再试)

### 第十二章 同构

1. 服务器端渲染 VS 浏览器端渲染：
    1. 路径：静态html -> 动态html(服务器渲染) -> web2.0(ajax局部浏览器渲染) -> 完全浏览器渲染(模板库 + restful api);
    2. 网页性能：TTFP(发出http请求到用户看到有意义的内容的时间)，TTI(发出http请求到可以页面交互的时间)；
    3. 浏览器渲染至少需要三个http的时间才能到达TTFP：
        1. 请求HTML(空架子)；
        2. 请求JavaScript；
        3. 请求接口数据；
    4. 服务器渲染是否更好？
        1. 服务器端产生的html会变大；
        2. 服务器渲染消耗服务器性能；
        3. Facebook明确说React不是给服务器渲染设计的；
2. 热加载：保持state不变，只更新渲染逻辑(调试方便)；
3. React同构(代码改动较大，具体应用的时候再试)；