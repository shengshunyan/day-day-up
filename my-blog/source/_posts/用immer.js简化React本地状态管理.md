---
title: 用immer.js简化React本地状态管理
date: 2020-08-09
keywords: JavaScript, React, immer.js
cover: https://file.moetu.org/images/2020/08/09/4039331718-56cc22613b287_articlex76c43b96d0c1f9ab.gif
tags:
     - JavaScript
---


{% note info no-icon %}
参考回答：https://segmentfault.com/a/1190000017270785
{% endnote %}

## 引言

immer.js可以让React组件状态的更新采用属性直接赋值的方式更改状态（mutable的写法），更加简洁、可读。

<br/>


## immer.js

### 原生JavaScript的问题

JS 里面的变量类型可以大致分为基本类型和引用类型。在使用过程中，引用类型经常会产生一些无法意识到的副作用。

```JavaScript
// 引用带来的副作用
var a = [{ val: 1 }]
var b = a.map(item => item.val = 2)

// 期望：b 的每一个元素的 val 值变为 2，但不影响a中的值
console.log(a[0].val) // 2
```

在发现这样的问题之后，解决方案也很简单。一般来说当需要传递一个引用类型的变量（例如对象）进一个函数时，我们可以使用 Object.assign 或者 ... 对对象进行解构，成功断掉一层的引用。

```JavaScript
var a = [{ val: 1 }]
var b = a.map(item => ({ ...item, val: 2 }))

console.log(a[0].val) // 1
console.log(b[0].val) // 2
```

但是这样做会有另外一个问题，无论是 Object.assign 还是 ... 的解构操作，断掉的引用也只是一层。如果是处理多层的数据结构，大多数情况下我们会考虑 **深拷贝** 这样的操作来完全复制出一个新对象（lodash.cloneDeep）。


### immer.js：优雅地解决问题

利用immer.js可以更优雅地解决上面出现的问题，虽然写法上看着像mutable的写法，但是实际上改变draft的属性会返回一个新对象。

```JavaScript
import produce from 'immer'

var a = [{ val: 1 }]
var b = produce(a, draft => {
  draft.map(item => ({ ...item, val: 2 }))
})

console.log(a[0].val) // 1
console.log(b[0].val) // 2
```

<br/>


## immer.js在React中的应用

React重渲染组件的时候，如果状态是基本类型（String、Number等），则会比较值是否相等；如果状态是引用类型（Object、Array等），则会比较引用是否一致，引用不一致的时候才会重新渲染。所以我们在setState的时候，引用类型的状态需要返回一个新对象改变状态对象的引用才能触发重新渲染。当状态的属性层级嵌套较多的时候，就得嵌套使用Object.assign 或者 ...符号来返回新对象，非常繁琐。

所以，借助immer.js我们可以在React组件中可以用我们喜欢的mutable的写法改变状态的属性并返回新的对象来触发重新渲染。


### 示例代码

```JavaScript
import React, { useState } from 'react'
import { Button } from 'antd'
import produce from 'immer'

import './App.css'

function App() {
    const [person, setPerson] = useState({
        name: 'xiao ming',
        age: 40,
        child: {
            name: 'child',
            childAge: 20,
        },
    })

    const onObjectAgeChange = () => {
        const newPerson = produce(person, draft => {
            draft.age = 11;
        })
        setPerson(newPerson)
    }
    const onObjectChildChange = () => {
        const newPerson = produce(person, draft => {
            draft.child.childAge = 12;
        })
        setPerson(newPerson)
    }

    return (
        <div className="App">
            App

            <div>
                <Button onClick={onObjectAgeChange} type="primary">change object age</Button>
                <Button onClick={onObjectChildChange} type="primary">change object child</Button>
            </div>
            <hr />

            <div>person info: age {person.age}, child age{person.child.childAge}</div>
        </div>
    )
}

export default App
```

### 重点分析

按照原本的写法，更新person中child的状态时得这样写：嵌套地使用...符号来复制旧属性，从而最终返回新对象

```JavaScript
const onObjectChildChange = () => {
    const newPerson = {
        ...person,
        child: {
            ...person.child,
            childAge: 12
        },
    }
    setPerson(newPerson)
}
```

现在，用immer.js可以大大简化：只用关心被修改的属性

```JavaScript
const onObjectChildChange = () => {
    const newPerson = produce(person, draft => {
        draft.child.childAge = 12;
    })
    setPerson(newPerson)
}
```