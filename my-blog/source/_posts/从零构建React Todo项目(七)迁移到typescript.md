---
title: 从零构建React Todo项目(七)迁移到typescript
date: 2021-02-22
keywords: JavaScript, React, TypeScript
cover: https://i.loli.net/2020/09/07/M5yvXBUGnYsqEft.gif
tags:
     - JavaScript
---

{% note info no-icon %}
项目地址：https://github.com/shengshunyan/react-scaffold

本节对应 [commit](https://github.com/shengshunyan/react-scaffold/commit/12054832c0652819c39ba1632572ed766b9a0656)
{% endnote %}


## 概述

TypeScript是微软开发的一个开源的编程语言，通过在JavaScript的基础上添加静态类型定义构建而成。TypeScript通过TypeScript编译器或Babel转译为JavaScript代码，可运行在任何浏览器，任何操作系统。

TypeScript正成为前端的一种必备技能，基于此，将项目从JavaScript迁移到TypeScript

<br/>


## 迁移过程

1. 安装 typescript 依赖

    ```bash
    npm install --save typescript
    ```

2. 初始化 typescript 配置文件 tsconfig.json

    ```bash
    # 在项目根目录执行，会生成 tsconfig.json 文件
    npx tsc --init
    ```

3. 修改 typescript 配置文件 tsconfig.json

    ```json
    {
        "compilerOptions": {
            "target": "es5",    
            "module": "ESNext",  // module 和 moduleResolution 配置解决React.lazy和Suspense的兼容问题
            "lib": ["es2015", "DOM"], // DOM 解决document全局变量的报错提示问题            
            "jsx": "react",                          
            "strict": true,                       
            "moduleResolution": "node", 
            "esModuleInterop": true,                 
            "skipLibCheck": true,                    
            "forceConsistentCasingInFileNames": true 
        }
    }
    ```

4. 文件名修改：js -> ts; jsx -> tsx

    1. 模块错误
     - 错误：Could not find a declaration file for module '**'
     - 解决：安装所需的类型模块：npm install --save-dev @types/**  

    2. 引入样式文件错误
     - 错误：引入样式的语句会提示错误 import style from './index.scss'; typescript不知道 index.scss 的类型
     - 解决：src/目录下新建 index.scss.d.ts 文件

        ```typescript
        declare module '*.scss' {
            const content: any;
            export default content;
        }
        ```

5. 更新 eslint 配置

    1. 安装依赖
        ```bash
        npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
        ```

    2. 删除旧的依赖：babel-eslint, eslint-config-airbnb, eslint-plugin-react

    3. **更新** .eslintrc.js 文件中的下列配置，再删除一些有冲突的自定义的规则
        ```JavaScript
        module.exports = {
            extends: ['plugin:@typescript-eslint/recommended'],
            parser: '@typescript-eslint/parser',
            plugins: [
                '@typescript-eslint',
                'react-hooks',
            ],
        }
        ```

<br/>


## 添加todo模块

用 typescript 完成todo模块的逻辑，相关 [commit](https://github.com/shengshunyan/react-scaffold/commit/98002fb0e535a3f47105c1f53b811ea4eacf2d21)

![WX20210223-174323@2x.png](https://i.loli.net/2021/02/23/wNmXiJGWxq6fLjD.png)
