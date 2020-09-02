---
title: 从零构建React Todo项目(三)代码格式化
date: 2020-09-02
keywords: JavaScript, React, eslint, stylelint
cover: https://file.moetu.org/images/2020/08/28/5f48d9d61a9ab_5f48d9d6d1d611a696484bf725e3c.gif
tags:
     - JavaScript
---

{% note info no-icon %}
项目地址：https://github.com/shengshunyan/react-scaffold
{% endnote %}


## 概述

为了项目中代码风格的统一，所以对js代码和(s)css样式文件的风格做一下约束，在项目中集成eslint和stylelint的相关配置，这样能在代码书写的过程中对代码风格进行实时校验。

为了开发方便，默认配置成保存文件的时候自动对当前代码文件进行格式化。

<br/>


## 配置eslint

### 配置过程

1. 安装 eslint npm依赖包

     ```Bash
     npm install eslint --save-dev
     ```

2. 编辑器配置（以 VS Code 为例）
     a. 安装插件：在插件Tab中搜索 ESLint 插件，安装
     b. 添加编辑器配置项：Code -> Preferences -> Settings -> 搜索 editor.codeActionsOnSave 配置 -> 添加如下配置

     ```Json
     {
          "editor.codeActionsOnSave": {
               // For ESLint
               "source.fixAll.eslint": true,
               // For TSLint
               "source.fixAll.tslint": true,
          }
     }
     ```

3. 项目根目录下创建 eslint 配置文件 .eslintrc.js
     
     ```JavaScript
     module.exports = {
          // 禁用持续查找,一旦发现了配置文件就停止对父文件夹的查找
          root: true,
          // 指定支持的 JavaScript 语言选项
          parserOptions: {
               // 设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)。
               sourceType: 'module', 
               // 默认设置为 3，5（默认）， 你可以使用 6、7、8、9 或 10 来指定你想要使用的 ECMAScript 版本。
               // 你也可以用使用年份命名的版本号指定为 2015（同 6），2016（同 7），或 2017（同 8）或 2018（同 9）或 2019 (same as 10)
               ecmaVersion: 11,
               // 额外的语言特性
               ecmaFeatures: {
                    // 启用 JSX
                    jsx: true,
                    // 启用实验性的 object rest/spread properties 支持
                    experimentalObjectRestSpread: true
               }
          },
          // 一个环境定义了一组预定义的全局变量
          env: {
               browser: true, // 浏览器环境中的全局变量
               node: true, // Node.js 全局变量和 Node.js 作用域
               es2020: true, // 启用除了 modules 以外的所有 ECMAScript 2020 特性
          },
          // 脚本在执行期间访问的额外的全局变量: true表示变量可以被覆盖，false表示不允许被覆盖
          globals: {
               // globalVariable: true,
          },
          // 个性化规则配置
          rules: {}
     };
     ```

4. 为了使eslint支持es6语法，指定 eslint 的解析器为 babel-eslint
     a. 安装npm包
     ```Bash
     npm install babel-eslint --save-dev
     ```
     b. .eslintrc.js 文件中添加配置项
     ```JavaScript
     module.exports = {
          // ...

          // babel-eslint使eslint支持es6语法
          parser: 'babel-eslint',

          //...
     };
     ```

5. 引用Airbnb编码规则
     a. 安装npm包
     ```Bash
     npm install eslint-config-airbnb eslint-plugin-import eslint-plugin-react eslint-plugin-jsx-a11y --save-dev
     ```
     b. .eslintrc.js 文件中添加配置项
     ```JavaScript
     module.exports = {
          // ...

          extends: 'airbnb',

          //...
     };
     ```

6. 添加第三方插件：react(eslint-plugin-react在上一步已安装), react-hook
     a. 安装npm包 (eslint-plugin-react在上一步已安装)
     ```Bash
     npm install eslint-plugin-react-hooks --save-dev
     ```
     b. .eslintrc.js 文件中添加配置项
     ```JavaScript
     module.exports = {
          // ...

          plugins: [
               'react',
               'react-hooks'
          ],

          //...
     };
     ```

7. 添加个性化的配置规则
     ```JavaScript
     module.exports = {
          // ...

          /**
          * 个性化规则配置
          * "off" 或 0 - 关闭规则
          * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
          * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
          */
          rules: {
               // 句尾分号
               semi: ['error', 'always'],
               // 代码中console/debugger处理
               'no-console': 'warn',
               'no-debugger': 'warn',
               // 代码使用4个空格的缩进风格
               indent: ['error', 4, { SwitchCase: 1 }],
               // 关闭命名function表达式规则
               'func-names': 'off',
               // 可以行尾空白
               'no-trailing-spaces': 'off',
               // 对象、数组换行时需要加拖尾逗号
               'comma-dangle': ['error', 'always-multiline'],
               // 关闭换行符转换
               'linebreak-style': 'off',
               // 禁止使用指定语法
               'no-restricted-syntax': ['error', 'WithStatement'],
               // 可以使用++/--
               'no-plusplus': 'off',
               // 禁止未使用过的变量包括全局变量和函数中的最后一个参数必须使用
               'no-unused-vars': [
                    'error', {
                         vars: 'all',
                         args: 'after-used',
                    },
               ],
               // 使用单引号
               quotes: [
                    'error', 'single',
               ],
               // 强制最大可嵌深度为3
               'max-depth': [
                    'error', 3,
               ],
               // 强制函数块中的语句最大50行
               'max-statements': [
                    'error', 50,
               ],
               // 强制行的最大长度150,注释200
               'max-len': [
                    'error', {
                         code: 150,
                         comments: 200,
                    },
               ],
               // 关闭require()强制在模块顶部调用（NodeJs rules， 9.0之后全部使用import）
               'global-require': 'off',

               // ES6 rules
               // 箭头函数的箭头前后都要有空格
               'arrow-spacing': 'error',
               // 接收const被修改的通知
               'no-const-assign': 'error',
               // 要求使用let或const而不是var
               'no-var': 'error',
               // 如果一个变量不会被重新赋值，则使用const声明
               'prefer-const': 'error',
               // 关闭强制在花括号内使用一致的换行符
               'object-curly-newline': 'off',
               'new-cap': ['error', { properties: false, capIsNew: false }],
               'no-useless-escape': 'off',

               // React 参考eslint-config-airbnb下的rules/react.js
               // jsx代码使用4个空格的缩进风格
               'react/jsx-indent': ['error', 4],
               // jsx属性使用4个空格的缩进风格
               'react/jsx-indent-props': ['error', 4],
               // 使用了jsx语法的js代码文件其扩展名可以使用js或jsx
               'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
               // 无状态和没有使用生命周期的组件使用函数组件声明
               'react/prefer-stateless-function': ['error', { ignorePureComponents: false }],
               // 数组索引可以用作key
               'react/no-array-index-key': 'off',
               // 组件属性可以传any,array,object
               'react/forbid-prop-types': 'off',
               // 组件内部换行
               'react/jsx-one-expression-per-line': 'off',
               // 链接地址中可以使用 javascript:
               'no-script-url': 'off',
               // 关闭点击元素上强制增加onKey**事件
               'click-events-have-key-events': 'off',
               // 关闭引用依赖检查
               'import/no-extraneous-dependencies': 'off',
               // 关闭路径处理依赖
               'import/no-cycle': 'off',
               // 扩展名处理
               'import/extensions': ['error', {
                    js: 'never',
                    jsx: 'never',
               }],
               // 可以使用html，有一些场景，后端会发一些html到前端需要渲染
               'react/no-danger': 'off',
               // 当它们只有一个参数时，箭头函数省略括号
               'arrow-parens': ['error', 'as-needed'],
               'jsx-a11y/control-has-associated-label': 'off',
               'react/jsx-props-no-spreading': 'off',
               'react-hooks/rules-of-hooks': 'error',
               'react-hooks/exhaustive-deps': 'warn',
          },

          //...
     };
     ```

8. 添加 .eslintignore 文件，对工程中一些文件不做格式校验

     ```
     /.cache/
     /.dev/
     /build/
     /*.js
     ```

### 最终配置文件 .eslintrc.js

```JavaScript
module.exports = {
    // 禁用持续查找,一旦发现了配置文件就停止对父文件夹的查找
    root: true,
    extends: 'airbnb',
    // babel-eslint使eslint支持es6语法
    parser: 'babel-eslint',
    parserOptions: {
    // 设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)。
        sourceType: 'module',
        // 默认设置为 3，5（默认）， 你可以使用 6、7、8、9 或 10 来指定你想要使用的 ECMAScript 版本。
        // 你也可以用使用年份命名的版本号指定为 2015（同 6），2016（同 7），或 2017（同 8）或 2018（同 9）或 2019 (same as 10)
        ecmaVersion: 11,
        // 额外的语言特性
        ecmaFeatures: {
            // 启用 JSX
            jsx: true,
            // 启用实验性的 object rest/spread properties 支持
            experimentalObjectRestSpread: true,
        },
    },
    // 一个环境定义了一组预定义的全局变量
    env: {
        browser: true, // 浏览器环境中的全局变量
        node: true, // Node.js 全局变量和 Node.js 作用域
        es2020: true, // 启用除了 modules 以外的所有 ECMAScript 2020 特性
    },
    plugins: [
        'react',
        'react-hooks',
    ],
    // 脚本在执行期间访问的额外的全局变量: true表示变量可以被覆盖，false表示不允许被覆盖
    globals: {
    // globalVariable: true,
    },
    /**
     * 个性化规则配置
     * "off" 或 0 - 关闭规则
     * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
     * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
     */
    rules: {
        // 句尾分号
        semi: ['error', 'always'],
        // 代码中console/debugger处理
        'no-console': 'warn',
        'no-debugger': 'warn',
        // 代码使用4个空格的缩进风格
        indent: ['error', 4, { SwitchCase: 1 }],
        // 关闭命名function表达式规则
        'func-names': 'off',
        // 可以行尾空白
        'no-trailing-spaces': 'off',
        // 对象、数组换行时需要加拖尾逗号
        'comma-dangle': ['error', 'always-multiline'],
        // 关闭换行符转换
        'linebreak-style': 'off',
        // 禁止使用指定语法
        'no-restricted-syntax': ['error', 'WithStatement'],
        // 可以使用++/--
        'no-plusplus': 'off',
        // 禁止未使用过的变量包括全局变量和函数中的最后一个参数必须使用
        'no-unused-vars': [
            'error', {
                vars: 'all',
                args: 'after-used',
            },
        ],
        // 使用单引号
        quotes: [
            'error', 'single',
        ],
        // 强制最大可嵌深度为3
        'max-depth': [
            'error', 3,
        ],
        // 强制函数块中的语句最大50行
        'max-statements': [
            'error', 50,
        ],
        // 强制行的最大长度150,注释200
        'max-len': [
            'error', {
                code: 150,
                comments: 200,
            },
        ],
        // 关闭require()强制在模块顶部调用（NodeJs rules， 9.0之后全部使用import）
        'global-require': 'off',

        // ES6 rules
        // 箭头函数的箭头前后都要有空格
        'arrow-spacing': 'error',
        // 接收const被修改的通知
        'no-const-assign': 'error',
        // 要求使用let或const而不是var
        'no-var': 'error',
        // 如果一个变量不会被重新赋值，则使用const声明
        'prefer-const': 'error',
        // 关闭强制在花括号内使用一致的换行符
        'object-curly-newline': 'off',
        'new-cap': ['error', { properties: false, capIsNew: false }],
        'no-useless-escape': 'off',

        // React 参考eslint-config-airbnb下的rules/react.js
        // jsx代码使用4个空格的缩进风格
        'react/jsx-indent': ['error', 4],
        // jsx属性使用4个空格的缩进风格
        'react/jsx-indent-props': ['error', 4],
        // 使用了jsx语法的js代码文件其扩展名可以使用js或jsx
        'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
        // 无状态和没有使用生命周期的组件使用函数组件声明
        'react/prefer-stateless-function': ['error', { ignorePureComponents: false }],
        // 数组索引可以用作key
        'react/no-array-index-key': 'off',
        // 组件属性可以传any,array,object
        'react/forbid-prop-types': 'off',
        // 组件内部换行
        'react/jsx-one-expression-per-line': 'off',
        // 链接地址中可以使用 javascript:
        'no-script-url': 'off',
        // 关闭点击元素上强制增加onKey**事件
        'click-events-have-key-events': 'off',
        // 关闭引用依赖检查
        'import/no-extraneous-dependencies': 'off',
        // 关闭路径处理依赖
        'import/no-cycle': 'off',
        // 扩展名处理
        'import/extensions': ['error', {
            js: 'never',
            jsx: 'never',
        }],
        // 可以使用html，有一些场景，后端会发一些html到前端需要渲染
        'react/no-danger': 'off',
        // 当它们只有一个参数时，箭头函数省略括号
        'arrow-parens': ['error', 'as-needed'],
        'jsx-a11y/control-has-associated-label': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
    },
};
```

<br/>


## 配置stylelint

### 配置过程

1. 安装 stylelint npm依赖包

     ```Bash
     npm install stylelint stylelint-config-standard --save-dev
     ```

2. 编辑器配置（以 VS Code 为例）
     a. 安装插件：在插件Tab中搜索 stylelint 插件，安装
     b. 添加编辑器配置项：Code -> Preferences -> Settings -> 搜索 editor.codeActionsOnSave 配置 -> 添加如下配置

     ```Json
     {
          "editor.codeActionsOnSave": {
               // For stylelint
               "source.fixAll.stylelint": true,
          }
     }
     ```

3. 项目根目录下创建 stylelint 配置文件 .stylelint.js
     
     ```JavaScript
     module.exports = {
          extends: "stylelint-config-standard",
     };
     ```

4. 添加第三方插件：stylelint-order, stylelint-scss, stylelint-config-idiomatic-order
     a. 安装npm包
     ```Bash
     npm install stylelint-order stylelint-scss stylelint-config-idiomatic-order --save-dev
     ```
     b. .eslintrc.js 文件中添加配置项
     ```JavaScript
     module.exports = {
          // ...

          // stylelint-config-idiomatic-order是引用了别人整理好的css属性顺序
          extends: [
               'stylelint-config-standard',
               'stylelint-config-idiomatic-order'
          ],
          plugins: [
               'stylelint-order',
               'stylelint-scss'
          ],

          //...
     };
     ```

5. 添加个性化的配置规则

     ```JavaScript
     module.exports = {
          // ...

          rules: {
               indentation: [4, {
                    // align multiline property values
                    ignore: ['value'],
               }],
               // 属性没有浏览器前缀
               'at-rule-no-vendor-prefix': true,
               'block-opening-brace-space-before': 'always-multi-line',
               // 颜色值不简写
               'color-hex-length': 'long',
               // 不用颜色名
               'color-named': 'never',
               // 不能重复属性
               'declaration-block-no-duplicate-properties': true,
               'declaration-block-semicolon-newline-after': 'always',
               'declaration-block-semicolon-newline-before': 'never-multi-line',
               'declaration-colon-newline-after': null,
               'declaration-colon-space-after': 'always-single-line',
               'declaration-empty-line-before': ['never', {
                    ignore: ['after-declaration'],
               }],
               // 0值不用单位
               'length-zero-no-unit': true,
               'max-line-length': 200,
               'max-nesting-depth': 10,
               'no-descending-specificity': null,
               'no-duplicate-selectors': true,
               'no-unknown-animations': true,
               'number-max-precision': 8,
               'number-no-trailing-zeros': true,
               'property-no-unknown': true,
               'rule-empty-line-before': ['always-multi-line', {
                    except: ['first-nested'],
                    ignore: ['after-comment'],
               }],
               'selector-attribute-quotes': 'always',
               // 'selector-class-pattern': namingPattern,
               // 'selector-id-pattern': namingPattern,
               'selector-max-compound-selectors': 10,
               // "id,class,type"
               'selector-max-specificity': '1,3,3',
               'selector-max-id': 1,
               'selector-max-universal': 0,
               'selector-no-vendor-prefix': true,
               'selector-pseudo-class-no-unknown': [true, {
                    // :global is used by css modules
                    ignorePseudoClasses: ['global']
               }],
               // 统一用双引号
               'string-quotes': 'double',
               'time-min-milliseconds': 100,
               'unit-blacklist': ['pt'],
               // 属性value小写
               'value-keyword-case': 'lower',
               'value-list-comma-newline-before': 'never-multi-line',
               'value-no-vendor-prefix': true,
               'at-rule-empty-line-before': ['always', {
                    except: ['blockless-after-blockless', 'first-nested'],
                    ignore: ['after-comment'],
                    // allow @else to come on same line as closing @if brace
                    ignoreAtRules: ['import', 'else'],
               }],
               'at-rule-no-unknown': [true, {
                    ignoreAtRules: [
                         // additional scss at-rules:
                         'content', 'each', 'else', 'error', 'extend', 'for', 'function', 'if', 'include', 'mixin', 'return',
                    ],
               }],
               'block-closing-brace-newline-after': ['always', {
                    // allow @else to come on same line as closing @if brace
                    ignoreAtRules: ['else', 'if'],
               }],
               'scss/at-extend-no-missing-placeholder': true,
               'scss/at-function-pattern': namingPattern,
               'scss/at-import-no-partial-leading-underscore': true,
               'scss/at-import-partial-extension-blacklist': ['scss'],
               // "scss/at-mixin-argumentless-call-parentheses": "always", // TODO: coming in next stylelint-scss release
               'scss/at-mixin-pattern': namingPattern,
               'scss/dollar-variable-no-missing-interpolation': true,
               'scss/dollar-variable-pattern': namingPattern,
               'scss/media-feature-value-dollar-variable': 'always',
               'scss/percent-placeholder-pattern': namingPattern,
               'scss/selector-no-redundant-nesting-selector': true,
          },

          //...
     };
     ```

6. 添加 .stylelintrc.js 文件，对工程中一些文件不做格式校验，解决在jsx中使用style设置样式时，会自动使用stylelint规范进行修正，导致变量名称被修改的问题

     ```
     **/*.js
     **/*.jsx
     ```

### 最终配置文件 .stylelintrc.js

```JavaScript
const namingPattern = /^-?[a-z0-9]+(-[a-z0-9]+)*$/

module.exports = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-idiomatic-order'
    ],
    plugins: [
        'stylelint-order',
        'stylelint-scss'
    ],
    rules: {
        indentation: [4, {
            // align multiline property values
            ignore: ['value'],
        }],
        // 属性没有浏览器前缀
        'at-rule-no-vendor-prefix': true,
        'block-opening-brace-space-before': 'always-multi-line',
        // 颜色值不简写
        'color-hex-length': 'long',
        // 不用颜色名
        'color-named': 'never',
        // 不能重复属性
        'declaration-block-no-duplicate-properties': true,
        'declaration-block-semicolon-newline-after': 'always',
        'declaration-block-semicolon-newline-before': 'never-multi-line',
        'declaration-colon-newline-after': null,
        'declaration-colon-space-after': 'always-single-line',
        'declaration-empty-line-before': ['never', {
            ignore: ['after-declaration'],
        }],
        // 0值不用单位
        'length-zero-no-unit': true,
        'max-line-length': 200,
        'max-nesting-depth': 10,
        'no-descending-specificity': null,
        'no-duplicate-selectors': true,
        'no-unknown-animations': true,
        'number-max-precision': 8,
        'number-no-trailing-zeros': true,
        'property-no-unknown': true,
        'rule-empty-line-before': ['always-multi-line', {
            except: ['first-nested'],
            ignore: ['after-comment'],
        }],
        'selector-attribute-quotes': 'always',
        // 'selector-class-pattern': namingPattern,
        // 'selector-id-pattern': namingPattern,
        'selector-max-compound-selectors': 10,
        // "id,class,type"
        'selector-max-specificity': '1,3,3',
        'selector-max-id': 1,
        'selector-max-universal': 0,
        'selector-no-vendor-prefix': true,
        'selector-pseudo-class-no-unknown': [true, {
            // :global is used by css modules
            ignorePseudoClasses: ['global']
        }],
        // 统一用双引号
        'string-quotes': 'double',
        'time-min-milliseconds': 100,
        'unit-blacklist': ['pt'],
        // 属性value小写
        'value-keyword-case': 'lower',
        'value-list-comma-newline-before': 'never-multi-line',
        'value-no-vendor-prefix': true,
        'at-rule-empty-line-before': ['always', {
            except: ['blockless-after-blockless', 'first-nested'],
            ignore: ['after-comment'],
            // allow @else to come on same line as closing @if brace
            ignoreAtRules: ['import', 'else'],
        }],
        'at-rule-no-unknown': [true, {
            ignoreAtRules: [
                // additional scss at-rules:
                'content', 'each', 'else', 'error', 'extend', 'for', 'function', 'if', 'include', 'mixin', 'return',
            ],
        }],
        'block-closing-brace-newline-after': ['always', {
            // allow @else to come on same line as closing @if brace
            ignoreAtRules: ['else', 'if'],
        }],
        'scss/at-extend-no-missing-placeholder': true,
        'scss/at-function-pattern': namingPattern,
        'scss/at-import-no-partial-leading-underscore': true,
        'scss/at-import-partial-extension-blacklist': ['scss'],
        // "scss/at-mixin-argumentless-call-parentheses": "always", // TODO: coming in next stylelint-scss release
        'scss/at-mixin-pattern': namingPattern,
        'scss/dollar-variable-no-missing-interpolation': true,
        'scss/dollar-variable-pattern': namingPattern,
        'scss/media-feature-value-dollar-variable': 'always',
        'scss/percent-placeholder-pattern': namingPattern,
        'scss/selector-no-redundant-nesting-selector': true,
    },
}
```

<br/>



