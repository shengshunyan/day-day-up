---
title: 从零构建React Todo项目(八)添加单元测试
date: 2021-02-26
keywords: JavaScript, React, 单元测试
cover: https://i.loli.net/2020/09/07/M5yvXBUGnYsqEft.gif
tags:
     - JavaScript
---

{% note info no-icon %}
项目地址：https://github.com/shengshunyan/react-scaffold
{% endnote %}


## 概述

在2021的今天，构建一个 web 应用对于我们来说，并非什么难事。因为有很多足够多优秀的的前端框架（比如 React，Vue 和 Angular）；以及一些易用且强大的UI库（比如 Ant Design）为我们保驾护航，极大地缩短了应用构建的周期。

但是，互联网时代也急剧地改变了许多软件设计，开发和发布的方式。开发者面临的问题是，需求越来越多，应用越来越复杂，时不时会有一种失控的的感觉，并在心中大喊一句：“我太南了！”。严重的时候甚至会出现我改了一行代码，却不清楚其影响范围情况。这种时候，就需要测试的方式，来保障我们应用的质量和稳定性了。

接下来，让我们学习下，如何给 React 应用写单元测试吧🎁

<br/>


## 给纯函数(utils)添加单元测试

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
    }
    ```

3. 添加示例utils以及测试代码

    /src/common/utils.ts
    ```typescript
    export function sum(a: number, b: number): number {
        return a + b;
    }
    ```

    /\_\_test\_\_/common/utils.test.ts
    ```typescript
    import { sum } from '../../src/common/utils';

    test('adds 1 + 2 to equal 3', () => {
        expect(sum(1, 2)).toBe(3);
    }); 
    ```

4. 运行测试命令

    ```bash
    npm run test
    ```

    结果：
    ```bash
    $ npm run test

    > parcel-test@1.0.0 test
    > jest

    ts-jest[main] (WARN) Replace any occurrences of "ts-jest/dist/preprocessor.js" or  "<rootDir>/node_modules/ts-jest/preprocessor.js" in the 'transform' section of your Jest config with just "ts-jest".
    PASS  __test__/common/utils.test.ts
    ✓ adds 1 + 2 to equal 3 (1 ms)

    Test Suites: 1 passed, 1 total
    Tests:       1 passed, 1 total
    Snapshots:   0 total
    Time:        5.605 s
    Ran all test suites.
    ```

<br/>


## 给纯组件添加单元测试

{% note primary %}
Testing Library官网：https://testing-library.com/docs/
React Testing Library Tutorial：https://www.robinwieruch.de/react-testing-library
使用 React Testing Library 和 Jest 完成单元测试：https://segmentfault.com/a/1190000022054307
{% endnote %}

1. 安装相关依赖：
 - @testing-library/react：测试react组件
 - @testing-library/jest-dom：为jest的断言expect增加一些dom相关的api

    ```bash
    npm install --save-dev @testing-library/react @testing-library/jest-dom
    ```

2. 编写测试代码：有一个 ***注意点***，.tsx后缀文件的测试文件也需是.tsx后缀，因为测试的时候也会用到jsx语法

    /src/antd/index.tsx
    ```typescript
    import React from 'react';
    import { Button } from 'antd';

    const Antd: React.FunctionComponent = () => {
        return (
            <div>
                this is antd page
                <Button type="primary">Button</Button>
            </div>
        );
    };

    export default React.memo(Antd);
    ```

    /\_\_test\_\_/antd/index.test.tsx
    ```typescript
    import React from 'react';
    import { render, screen } from '@testing-library/react';
    import '@testing-library/jest-dom';
    import TestElements from '../../src/antd';

    describe('<Antd />', () => {
        test('antd page text should exist', () => {
            render(<TestElements />);
            expect(screen.getByText('this is antd page')).toBeInTheDocument();
        });

        test('button should exist', () => {
            render(<TestElements />);
            expect(screen.getByText('Button')).toBeInTheDocument();
        });
    });
    ```

<br/>


## 测试store（easy-peasy）相关的文件

{% note primary %}
easy-peasy 官网：https://easy-peasy.now.sh/docs/tutorials/testing.html
{% endnote %}

### 测试actions

/\_\_test\_\_/todo/store/index.test.ts
```typescript
import { createStore } from 'easy-peasy';
import todo from '../../../src/todo/store';

describe('test todo store actions', () => {
    test('addTodoItem', async () => {
        // arrange
        const newTodoItem = 'foo';
        const store = createStore(todo);
    
        // act
        store.getActions().addTodoItem(newTodoItem);
    
        // assert
        expect(store.getState().todoList[0].content).toEqual('foo');
    });
});
```

### 测试依赖store的组件

1. 编写测试代码

    /src/todo/components/list/index.tsx
    ```typescript
    import React, { useCallback } from 'react';
    import { Checkbox } from 'antd';
    import { CloseOutlined } from '@ant-design/icons';
    import { createTypedHooks } from 'easy-peasy';

    import { TodoItemModel } from '../../common/model';
    import { StoreModel } from '../../../common/store';

    import style from './index.scss';

    const { useStoreActions } = createTypedHooks<StoreModel>();

    interface IProps {
        todoList: TodoItemModel[];
    }

    const List: React.FunctionComponent<IProps> = ({
        todoList,
    }) => {
        const { updateTodoItem, deleteTodoItem } = useStoreActions(actions => actions.todo);

        const onIsFinishedChange: (value: boolean, item: TodoItemModel) => void = useCallback((value, item) => {
            updateTodoItem({ ...item, isFinished: value });
        }, [updateTodoItem]);

        const onItemDelete = useCallback(item => {
            deleteTodoItem(item);
        }, [deleteTodoItem]);

        return (
            <div className={style['list-container']}>
                {
                    todoList.map((item, index) => (
                        <div className="list-item" key={index}>
                            <Checkbox 
                                checked={item.isFinished}
                                onChange={e => onIsFinishedChange(e.target.checked, item)}
                            >{item.content}</Checkbox>
                            <CloseOutlined 
                                onClick={() => onItemDelete(item)}
                                className="delete-icon" 
                            />
                        </div>
                    ))
                }
            </div>
        );
    };

    export default React.memo(List);
    ```

    /\_\_test\_\_/todo/components/list/index.test.tsx
    ```typescript
    import React from 'react';
    import '@testing-library/jest-dom';
    import { StoreProvider } from 'easy-peasy';
    import { render, screen } from '@testing-library/react';
    import store from '../../../../src/common/store';
    import TestElements from '../../../../src/todo/components/list';

    describe('<List />', () => {
        test('list should have two item', async () => {
            // arrange
            const mockList = [
                {
                    'id': 1,
                    'content': 'aaaa',
                    'isFinished': true,
                },
                {
                    'id': 2,
                    'content': 'bbbb',
                    'isFinished': false,
                },
            ];
            const app = (
                <StoreProvider store={store}>
                    <TestElements todoList={mockList} />
                </StoreProvider>
            );

            // act
            render(app);

            // assert
            expect(screen.getByText('aaaa')).toBeInTheDocument();
            expect(screen.getByText('bbbb')).toBeInTheDocument();
        });
    });
    ```

2. 发现问题：

被测试的组件中，有CSS Modules相关的样式引入

```typescript
import style from './index.scss';
```

这个语句jest是处理不了的，需要添加模块mock

***解决方法：***
 - 安装 identity-obj-proxy 模块
    ```bash
    npm install --save-dev identity-obj-proxy
    ```
 - package.json文件中的 jest 添加下列配置项
    ```json
    {
        "jest": {
            "moduleNameMapper": {
                "\\.(css|less|scss)$": "identity-obj-proxy",
                "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js"
            }
        },
    }
    ```