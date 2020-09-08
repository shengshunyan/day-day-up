---
title: 从零构建React Todo项目(四)添加CSS Modules
date: 2020-09-08
keywords: JavaScript, React, CSS Modules
cover: https://i.loli.net/2020/09/07/M5yvXBUGnYsqEft.gif
tags:
     - JavaScript
---

{% note info no-icon %}
项目地址：https://github.com/shengshunyan/react-scaffold
{% endnote %}


## CSS的痛点

1. CSS 的规则是全局的，任何一个组件的样式规则，都对整个页面有效。相信写css的人都会遇到样式冲突（污染）的问题。

2. 为了解决全局污染的问题，那就把class命名写长一点吧、加一层父级选择器、降低冲突的几率，那么CSS命名混乱了。

3. 在引入一个组件时，如果class名称有冲突，则会影响原页面样式。

<br/>


## 使用 CSS Modules

### 简介

CSS Modules不是将CSS改造的具有编程能力，而是加入了局部作用域、依赖管理，这恰恰解决了最大的痛点。可以有效避免全局污染和样式冲突，能最大化地结合现有 CSS 生态和 JS 模块化能力。

### 配置过程

1. 安装 npm 包

     ```Bash
     npm install postcss-modules --save-dev
     ```

2. 创建一个文件.postcssrc.js

     ```JavaScript
     module.exports = {
          modules: true,
     }
     ```

3. 组件中使用 css modules 的写法

     /src/pages/PageA.jsx
     ```JavaScript
     import React from 'react';
     import styles from './pageA.scss';

     function PageA() {
     return (
          <div className={styles['page-a']}>
               我是一段文字
          </div>
     );
     }

     export default PageA;
     ```

     /src/pages/PageA.scss
     ```css
     .page-a {
          color: rgb(255, 0, 0);
     }
     ```

     ![WeChatWorkScreenshot_0837dae4-8932-4e61-9958-82099d3f5ebc.png](https://i.loli.net/2020/09/08/knjT2gBHVtq46RN.png)

4. 如果时全局样式，可以用 :global {} 包裹

     /src/index.scss
     ```css
     :global {
          .title {
               display: block;
               width: 100px;
               height: 100px;
               color: rgb(255, 0, 0);
          }
     }
     ```

### 推荐写法

1. 在每一个组件的最外层容器使用css modules，其子元素还是用正常的 css 样式

2. 组件样式文件遵循单一根节点原则，只有组件最外层容器className作为根节点，其子元素的样式均写在 :global{} 中

/src/pages/PageA.jsx
```JavaScript
import React from 'react';
import styles from './pageA.scss';

function PageA() {
     return (
          <div className={styles['page-a']}>
               pageA
               <p className="paragraph-1">我是另一段文字11</p>
               <p className="paragraph-2">我是另一段文字22</p>
          </div>
     );
}

export default PageA;
```

/src/pages/PageA.scss
```css
.page-a {
     color: rgb(255, 0, 0);

     :global {
          .paragraph-1 {
               color: rgb(0, 0, 0);
          }

          .paragraph-2 {
               color: rgb(0, 0, 0);
          }
     }
}
```
