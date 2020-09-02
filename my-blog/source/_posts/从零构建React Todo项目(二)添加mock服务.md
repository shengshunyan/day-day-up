---
title: 从零构建React Todo项目(二)添加mock服务
date: 2020-08-28
keywords: JavaScript, React, Parcel, mock, express
cover: https://file.moetu.org/images/2020/08/28/5f48d9d61a9ab_5f48d9d6d1d611a696484bf725e3c.gif
tags:
     - JavaScript
---

{% note info no-icon %}
项目地址：https://github.com/shengshunyan/react-scaffold
{% endnote %}


## 概述

目前绝大多数项目开发都是前后端分离，并行开发。这时候前端FE就需要根据后端提供的接口文档创建mock服务来模拟接口返回数据，这样在最终联调的时候就只用改一下代理服务的目标地址就可快速完成联调工作。

<br/>


## 选择框架

Express是一个基于 Node.js 平台，快速、开放、极简的 Web 开发框架。可以通过Express搭建一个建议的后端服务，通过解析路径返回JSON文件的内容或者文件，就能满足大部分的mock需求。

<br/>


## 文件结构

把mock服务相关的文件放在server文件夹下，并且相关依赖与前端主项目分离。想用mock服务的时候，再安装相关的依赖。

[![WeChatWorkScreenshot_edfb846e-9736-4d0b-a09e-6fbbc991c7fdf1fcc1fdbef22ad1.md.png](https://file.moetu.org/images/2020/08/28/WeChatWorkScreenshot_edfb846e-9736-4d0b-a09e-6fbbc991c7fdf1fcc1fdbef22ad1.md.png)](https://moetu.org/image/7PsrS)

<br/>


## 创建mock服务

1. 项目跟目录下创建server文件夹

    ```Bash
    mkdir server
    cd server
    ```

2. 初始化 package.json 文件

    ```Bash
    npm init -y
    ```

3. 安装依赖 express、nodemon

    ```Bash
    npm install --save-dev express nodemon
    ```

4. 创建 /server/data 文件夹用于放置 json 数据，创建 /server/file 文件夹用于放置文件数据，创建 /server/server.js 作为server服务主入口

    ```Bash
    mkdir data
    mkdir file
    touch server.js
    ```

5. 向 /server/server.js 文件中写入mock服务逻辑

    ```JavaScript
    const express = require('express')
    const app = express()

    // 静态文件
    app.use('/file', express.static(`${__dirname}/file`))

    // JSON数据
    app.use('/', (req, res) => {
        const options = {
            root: `${__dirname}/data/`
        }
        const url = req.baseUrl + (req.path || '')
        // 统一请求路径前缀
        const urlPrefix = '/api/'
        const fileName = `${url.split(urlPrefix)[1]}.json`
        res.sendFile(fileName, options)
    })

    app.listen(8000, () => {
        console.log('Mock Server is running in http://localhost:8000')
    })
    ```

6. 在 package.json 的 npm scripts 命令中添加server启动命令

    ```JavaScript
    {
        "server": "nodemon server.js"
    }
    ```

7. 添加一个测试json数据，/server/data/init.list.json

    ```Json
    {
        "data": [
            {
                "dataSourceId": 1,
                "dataSourceName": "oracle",
                "sample": "jdbc:oracle:thin:@{hostname}:1521:{db_name}",
                "description": "oracle数据源",
                "projectId": -1
            },
            {
                "dataSourceId": 2,
                "dataSourceName": "hivehdfs",
                "sample": "hdfs://ns1/user/hive/warehouse/test.db",
                "description": "localhive数据源",
                "projectId": -1
            },
            {
                "dataSourceId": 3,
                "dataSourceName": "externalHive",
                "sample": "/user/hive/warehouse/default.db",
                "description": "localhive数据源",
                "projectId": -1
            },
            {
                "dataSourceId": 4,
                "dataSourceName": "mysql",
                "sample": "jdbc:mysql://${hostname}:3306/${db_name}",
                "description": "mysql数据源",
                "projectId": -1
            },
            {
                "dataSourceId": 5,
                "dataSourceName": "postgresql",
                "sample": "jdbc:postgresql://@{hostname}:5432/{db_name}",
                "description": "pg数据源",
                "projectId": -1
            }
        ],
        "statusCode": 200,
        "message": "success"
    }
    ```

8. 然后浏览器输入 http://localhost:8000/api/init/list 就可以访问到测试数据啦 （Ps: /init/list）
    - /api 是server.js文件中urlPrefix变量的值
    - /init/list 是；list.json 在 /server/data/目录下的文件路径

![WX20200828-1804176aabaccd57124824.png](https://file.moetu.org/images/2020/08/28/WX20200828-1804176aabaccd57124824.png)
