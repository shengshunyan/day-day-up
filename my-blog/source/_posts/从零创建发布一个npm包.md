---
title: 从零创建发布一个Npm包
date: 2021-06-03
keywords: JavaScript, npm, 模块
cover: https://i.loli.net/2021/06/03/q1yN83J6TMlpnHz.png
tags:
     - JavaScript
---


{% note info no-icon %}
参考：
 - [《Rollup.js官方文档》](https://www.rollupjs.com/)
 - [《如何使用rollup打包前端组件/库》](https://zhuanlan.zhihu.com/p/95119407)
 - [《Rollup.js: 开源JS库的打包利器》](https://zhuanlan.zhihu.com/p/90267057)
 - [《npm package开发指南-包内容篇》](https://zhuanlan.zhihu.com/p/95721138)
{% endnote %}

## 前言


之前做过一个从零初始化一个todo前端项目的系列，此篇文章目的是做一期npm包的创建发布，初始化一个npm包的脚手架，然后梳理一下npm包的发布流程。

npm is the package manager for javascript. npm是js的包管理器，更多的用于nodejs端。


{% note primary %}
项目github地址：[shengshunyan-utils](https://github.com/shengshunyan/shengshunyan-utils)
包npm地址：[@shengshunyan/utils](https://www.npmjs.com/package/@shengshunyan/utils)
{% endnote %}

<br/>


## 初始化脚手架

### 创建项目

1. 创建一个github仓库，初始化LICENSE和README文件，然后clone到本地

    ```bash
    git clone https://github.com/shengshunyan/shengshunyan-utils.git
    ```

2. 初始化package.json文件

    ```bash
    npm init
    ```

3. 创建src文件夹，添加模块功能代码，这里添加js的排序算法代码作为示例模块代码 (具体代码查看github仓库)

    ```bash
    touch src/index.ts
    touch src/sort/index.ts
    touch src/sort/bubble.ts
    touch src/sort/selection.ts
    ```

### 配置打包

1. 本文选择rollup作为打包工具，首先全局安装一下rollup

    ```bash
    npm install rollup -g
    ```

2. 根目录新建rollup.config.js文件，作为打包配置

    ```JavaScript
    import resolve from 'rollup-plugin-node-resolve';
    import commonjs from 'rollup-plugin-commonjs';
    import babel from 'rollup-plugin-babel';
    import { terser } from 'rollup-plugin-terser';
    import { eslint } from 'rollup-plugin-eslint';
    import typescript from 'rollup-plugin-typescript2';

    const isPro = process.env.NODE_ENV === 'production'

    export default {
        input: 'src/index.ts',
        output: [
            {
                file: 'lib/index.js',
                format: 'cjs',
            },
            {
                file: 'es/index.js',
                format: 'esm',
            },
            {
                file: 'umd/index.js',
                format: 'umd',
                // script标签的形式引入时，全局变量的模块名
                name: 'utils',
            },
        ],
        plugins: [
            resolve(),  // 这样 Rollup 能找到 `ms`
            commonjs(), // 这样 Rollup 能转换 `ms` 为一个ES模块
            eslint({
                throwOnError: true,
                throwOnWarning: true,
                include: ['src/**'],
                exclude: 'node_modules/**',
            }),
            typescript(),
            babel({
                runtimeHelpers: true,       // 使plugin-transform-runtime生效
                exclude: 'node_modules/**', // 防止打包node_modules下的文件
            }),
            isPro && terser()
        ]
    };
    ```

3. 修改package.json文件

    a. 指定各种模块格式打包产物的入口文件
    ```json
    {
        "main": "lib/index.js",
        "module": "es/index.js",
        "browser": "umd/index.js",
    }
    ```

    b. 配置运行脚本
    ```json
    "scripts": {
        "dev": "rollup -c -w",
        "build": "NODE_ENV=production rollup -c"
    }
    ```

### 完善配置文件

1. 添加eslint配置文件

    a. .eslintrc.js
    ```JavaScript
    module.exports = {
        "env": {
            "browser": true,
            "es6": true,
            "node": true
        },
        "extends": ['plugin:@typescript-eslint/recommended'],
        "parser": '@typescript-eslint/parser',
        "globals": {
            "Atomics": "readonly",
            "SharedArrayBuffer": "readonly",
            "ENV": true
        },
        "parserOptions": {
            "ecmaVersion": 11,
            "sourceType": "module"
        },
        "rules": {
            "linebreak-style": [
                "error",
                "unix"
            ],
            "quotes": [
                "error",
                "single"
            ],
            'linebreak-style': 'off',
        }
    };
    ```

    b. .eslintignore
    ```
    /example/
    /es/
    /lib/
    /umd/
    ```

2. 添加babel配置文件

    .babelrc
    ```json
    {
        "presets": [
            [
                "@babel/preset-env",
                {
                    "targets": {
                        "chrome": "49",
                        "firefox": "65",
                        "safari": "12",
                        "node": "current"
                    },
                    "modules": false,
                    "useBuiltIns": "usage",
                    "corejs": "3"
                }
            ]
        ],
        "plugins": [
            "@babel/plugin-transform-runtime"
        ],
        "ignore": [
            "node_modules/**"
        ]
    }
    ```

3. 添加typescript配置文件

    tsconfig.json
    ```json
    {
        "compilerOptions": {
            "baseUrl": ".",
            "outDir": "./lib", // 输出目录
            "sourceMap": false, // 是否生成sourceMap
            "target": "esnext", // 编译目标
            "module": "esnext", // 模块类型
            "moduleResolution": "node",
            "allowJs": false, // 是否编辑js文件
            "strict": true, // 严格模式
            "noUnusedLocals": true, // 未使用变量报错
            "experimentalDecorators": true, // 启动装饰器
            "resolveJsonModule": true, // 加载json
            "esModuleInterop": true,
            "removeComments": false, // 删除注释
            "declaration": true, // 生成定义文件
            "declarationMap": false, // 生成定义sourceMap
            "declarationDir": "./lib/types", // 定义文件输出目录
            "lib": [
                "esnext",
                "dom"
            ], // 导入库类型定义
            "types": [
                "node",
                "jest",
            ] // 导入指定类型包
        },
        "include": [
            "src/*" // 导入目录
        ]
    }
    ```

4. 添加git和npm配置文件

    a. .gitignore
    ```
    node_modules/
    package-lock.json
    ```

    b. .npmignore （可以在npm发布的时候不提交相关内容）
    ```
    __test__/
    example/
    src/
    .babelrc
    .eslintignore
    .eslintrc.js
    rollup.config.js
    tsconfig.json
    ```

### 添加单元测试

{% note primary %}
Jest官网：https://jestjs.io/docs/en/getting-started.html
{% endnote %}

1. 安装相关依赖：
 - jest是测试库；
 - @types/jest是jest对typescript的类型支持；
 - babel-jest转换测试代码中高级语法；
 - ts-jest转换测试代码中typescript语法；

    ```bash
    npm install --save-dev jest @types/jest babel-jest ts-jest
    ```

2. package.json文件中添加jest测试配置，使能够运行ts语法的测试代码；并在 "scripts" 配置中添加测试的命令：***"test": "jest"***

    ```json
    {
        "jest": {
            "moduleFileExtensions": [
                "ts",
                "tsx",
                "js"
            ],
            "transform": {
                "^.+\\.tsx?$": "ts-jest"
            },
            "testMatch": [
                "<rootDir>/__test__/**/?(*.)(spec|test).ts?(x)"
            ]
        },
        "scripts": {
            "test": "jest"
        }
    }
    ```

3. 添加测试代码

    /\_\_test\_\_/sort/bubble.test.ts
    ```typescript
    import bubbleSort from '../../src/sort/bubble'

    test('冒泡排序：正确排序数组 [1, 3, 2, 2, 2]', () => {
        expect(bubbleSort([1, 3, 2, 2, 2]).toString()).toEqual([1, 2, 2, 2, 3].toString());
    });
    ```

4. 运行测试命令

    ```bash
    npm run test
    ```

    结果：
    ```bash
    $ npm test     

    > @shengshunyan/utils@1.0.2 test
    > jest

    ts-jest[config] (WARN) There is a mismatch between your NodeJs version v12.18.2 and your TypeScript target ESNext. This might lead to some unexpected errors when running tests with `ts-jest`. To fix this, you can check https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping
    ts-jest[config] (WARN) There is a mismatch between your NodeJs version v12.18.2 and your TypeScript target ESNext. This might lead to some unexpected errors when running tests with `ts-jest`. To fix this, you can check https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping
    PASS  __test__/sort/selection.test.ts
    PASS  __test__/sort/bubble.test.ts

    Test Suites: 2 passed, 2 total
    Tests:       2 passed, 2 total
    Snapshots:   0 total
    Time:        3.022 s
    Ran all test suites.
    ```

### 添加库使用示例

根目录创建 /example 文件夹，里面放置库的使用示例

以script标签引入为例

/example/01 script/index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>test utils package</title>
</head>
<body>
    <h1>utils 模块测试</h1>
    <p>初始数组：[1, 3, 2, 2, 2]</p>
    <p class="bubble">冒泡排序：</p>
    <p class="selection">插入排序：</p>

    <script src="../../umd/index.js"></script>
    <script>
        const arr = [1, 3, 2, 2, 2]
        const bubbleSortArr = utils.sort.bubbleSort(arr)
        const selectionSortArr = utils.sort.selectionSort(arr)
        const bubbleDom = document.querySelector('.bubble')
        const selectionDom = document.querySelector('.selection')

        bubbleDom.textContent = `冒泡排序：${bubbleSortArr}`
        selectionDom.textContent = `冒泡排序：${selectionSortArr}`
    </script>
</body>
</html>
```

### 更新 README.md 文件

一般npm包README需要包含以下几项：
 - Introduction
 - Installation
 - Usage
 - Testing
 - License
 - Keywords

<br/>


## 发布流程

1. 先去npm 注册个账号，然后在命令行使用

    ```bash
    npm adduser # 根据提示输入用户名密码即可
    ```

2. 发布包 （注意：使用npm的源不要使用其他如：taobao）

    ```bash
    # 如果你的库名是 @name/subname，且按公开库发布，在运行 npm 发布命令时要加参数：npm publis --access public
    npm publish
    ```

{% note primary no-icon %}
**拓展：**

更新npm包也是使用npm publish命令发布，不过必须更改npm包的版本号，即package.json的version字段，否则会报错，同时我们应该遵 Semver(语义化版本号) 规范，npm 提供了npm version 给我们升级版本

升级补丁版本号
$ npm version patch

升级小版本号
$ npm version minor

升级大版本号
$ npm version major
{% endnote %}



<br/>