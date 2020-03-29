---
title: 利用Node.js实现简易的sso流程
date: 2020-02-27
keywords: Node.js, sso, 单点登录
cover: https://i.loli.net/2020/02/27/zH3YRU7Km8kb6c4.jpg
tags:
     - JavaScript
---


## 复习单系统登录

HTTP是无状态的协议，这意味上一个http请求的用户状态不能直接带到下一次请求。于是乎，W3C创建了Cookie：每次发起http请求，都会带上相应的Cookie信息，用户用户信息认证；  

服务器会建立了一份“客户明细表”Session，它向用户浏览器发送了一个名为JESSIONID的Cookie，它的值是Session的id值，根据这个id就能确认目前登录的是哪个用户；

流程总结：
- 用户登录时，验证用户的账户和密码
- 将用户数据保存在Session中，并将SessionId已cookie的形式返回给浏览器
- 浏览器请求时都会带上Cookie，检查有没有登录，如果已经登录则放行
<!-- more -->

## 多系统单点登录（同一二级域名）
Session不共享问题：把Session数据放在Redis中

同一二级域名，cookie的相互设置不算跨域，如 test1.example.com 和 test2.example.com

他们之间单点登录认证只用设置相应的cookie的domain即可

## 多系统单点登录（不同二级域名，cookie操作跨域限制）

### 成熟解决方案 CAS（Central Authentication Service）

现在我们有两个系统，分别是 www.java3y.com 和 www.java4y.com，一个 SSOwww.sso.com
![1.jpg](https://i.loli.net/2020/02/27/iUHkwexGmvXOdcp.jpg)

首先，用户想要访问系统Awww.java3y.com受限的资源，系统Awww.java3y.com发现用户并没有登录，于是**重定向到sso认证中心，并将自己的地址作为参数**。请求的地址如下：

```
www.sso.com?service=www.java3y.com
```

sso认证中心发现用户未登录，将用户引导至登录页面，用户进行输入用户名和密码进行登录，用户与认证中心建立全局会话（**生成一份Token，写到Cookie中，保存在浏览器上**）

![2.jpg](https://i.loli.net/2020/02/27/zH3YRU7Km8kb6c4.jpg)

随后，认证中心**重定向回系统A**，并把Token携带过去给系统A，重定向的地址如下：

```
www.java3y.com?token=xxxxxxx
```

接着，系统A去sso认证中心验证这个Token是否正确，如果正确，则系统A和用户建立局部会话（**创建Session**）。到此，系统A和用户已经是登录状态了。

![3.jpg](https://i.loli.net/2020/02/27/l9Rcd6STt7YXCQp.jpg)

此时，用户想要访问系统Bwww.java4y.com受限的资源(比如说订单功能，订单功能需要登录后才能访问)，系统Bwww.java4y.com发现用户并没有登录，于是**重定向到sso认证中心，并将自己的地址作为参数**。请求的地址如下：

```
www.sso.com?service=www.java4y.com
```

注意，因为之前用户与认证中心www.sso.com已经建立了全局会话（当时已经把Cookie保存到浏览器上了），所以这次系统B重定向到认证中心www.sso.com是可以带上Cookie的。

认证中心根据带过来的Cookie发现已经与用户建立了全局会话了，认证中心重定向回系统B，并把Token携带过去给系统B，重定向的地址如下：

```
www.java4y.com?token=xxxxxxx
```

接着，系统B去sso认证中心验证这个Token是否正确，如果正确，则系统B和用户建立局部会话（创建Session）。到此，系统B和用户已经是登录状态了。

![4.jpg](https://i.loli.net/2020/02/27/H3bgjlieJ7RUvcT.jpg)

### 利用Node.js实现简易的sso流程

1. [github项目：sso-with-nodeJs](https://github.com/15754600159/sso-with-nodeJs)
2. **登录流程** 
    1. 应用平台前端XHR请求头部带上特殊字段(如IS-XHR)，区别其他静态资源的请求，进入页面之后，发起一个接口请求 www.app.com/api
    2. 应用平台后端服务在检测请求没登录的情况下，如果是XHR请求(有IS-XHR header字段)，则返回http code是200，response.body：
    ```JavaScript
    {
        statusCode: 302,
        data: 'http://www.sso.com?service=www.app.com/api'
    }
    ```
    让前端控制跳转到单点登录服务页面
    ```JavaScript
    if (res.statusCode === 302) {
        window.location.href = res.data
    }
    ```
    如果是静态资源请求，这正常重定向返回http code是302，设置response Location头部字段为 http://www.sso.com?service=www.app.com/api
    3. 跳到单点登录服务页面之后，用户输完信息，点击登录，登录完成之后后端返回登录凭证ticket，用静态资源请求的方式请求之前应用平台的接口路径+ticket
    ```
    www.app.com/api?ticket=screte-aa-bb
    ```
    4. 应用平台后端拿到ticket之后去单点登录平台后端认证，认证成功之后在应用平台set-cookie，并返回http code是302，再次跳转到应用平台的页面 www.app.com，此时应用平台已有cookie，登录成功！
3. **核心点：koa异步中间件——用户登录验证拦截器**
```JavaScript
// 用户信息认证中间件
const authMiddleware = async (ctx, next) => {
    const headers = ctx.headers
    const id = ctx.cookies.get('userId')
    const param = ctx.request.query

    // 是否已登录
    if (id !== undefined) {
        return next()
    }

    // 如果是同步请求，并且携带了ticket（是单点登录跳转过来）
    if (!headers['is-xhr'] && param.ticket) {
        await new Promise((resolve, reject) => {
            http.get(`http://www.sso.com/authTicket?ticket=${param.ticket}`, function (data) {
                let str = "";
                data.on("data", function (chunk) {
                    str += chunk; // 监听数据响应，拼接数据片段
                })
                data.on("end", function () {
                    const res = JSON.parse(str)
                    if (res.code === 200) {
                        ctx.cookies.set('userId', 1)
                        ctx.response.status = 302
                        ctx.response.set({
                            Location: `http://${ctx.request.header.host}`
                        })
                        resolve()
                    }
                })
            })
        })
    }

    ctx.response.body = {
        code: 302,
        data: {
            url: `http://www.sso.com?service=${ctx.request.header.host}${ctx.request.url}`
        }
    };
}
app.use(authMiddleware)
```