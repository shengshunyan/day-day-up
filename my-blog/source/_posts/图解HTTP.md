---
title: 图解HTTP note
date: 2018-09-17
categories: "图解HTTP"
tags: 
     - 计算机基础
     - 读书笔记
---
学习图解HTTP的一些读书笔记！


### 第1-4章 HTTP基础

1. web为知识共享而规划；
2. 计算机网络分层：
    1. 应用层：(HTTP, FTP, DNS, SMTP);
    2. 传输层：(TCP, UDP);
    3. 网络层：(IP);
    4. 数据链路层：以太网；
    5. 物理层：  
<!-- more -->
3. HTTP方法：
    - GET: 获取资源；
    - POST: 传输文件；
    - PUT: 传输文件；
    - HEAD: 获得报文首部，用以确认资源有效性及资源更新日期等；
    - DELETE: 删除文件；
    - OPTIONS: 询问支持的方法；
    - TRACE: 追踪路径；
    - CONNECT: 要求用隧道协议连接代理；
4. 四种常见的 POST 提交数据方式：
    1. application/x-www-form-urlencoded (默认)：
        1. 参数形式：提交的数据按照 key1=val1&key2=val2 的方式进行编码，key 和 val 都进行了 URL 转码；
    2. multipart/form-data：
        1. 使用表单上传文件时; 
        2. Content-Type 里指明了数据是以 mutipart/form-data 来编码，本次请求的 boundary 是什么内容;
        3. 参数形式：消息主体里按照字段个数又分为多个结构类似的部分，每部分都是以 --boundary 开始，紧接着内容描述信息，然后是回车，最后是字段具体内容（文本或二进制）。如果传输的是文件，还要包含文件名和文件类型信息。消息主体最后以 --boundary-- 标示结束。
    3. application/json：
        1. 各大浏览器都原生支持 JSON.stringify;
        2. 可以方便的提交复杂的结构化数据，特别适合 RESTful 的接口;
        3. 参数形式：{"title":"test","sub":[1,2,3]} 
    4. text/xml：
        1. 它是一种使用 HTTP 作为传输协议，XML 作为编码方式的远程调用规范;
        2. XML 结构还是过于臃肿，一般场景用 JSON 会更灵活方便;
5. 持久连接：
    1. Connection: keep-alive; 一次TCP连接，多次HTTP请求(串行);
    2. pipelining: 同一个TCP连接的HTTP请求用并行方式发送；
6. HTTP报文：
    1. 分类：请求报文和响应报文；
    2. 结构：报文首部 + 空行(CR+LF) + 报文主体；
7. HTTP状态：
    1. 1XX：接收的请求正在处理；
    2. 2XX：请求正常处理完毕；
    3. 3XX：请求需要进行附加操作以完成请求(重定向)；
        - 304 Not Modified
    4. 4XX：接收的请求正在处理；
        - 400 Bad Request: 请求报文中存在语法错误；
        - 401 Unauthorized
        - 403 Forbidden: 资源访问被服务器拒绝了；
        - 404 Not Found
    5. 5XX：接收的请求正在处理；
        - 500 Internal Server Error
        - 503 Server Unavailable：服务器正忙，无法处理请求；

### 第5章 与HTTP协作的web服务器

1. 单台虚拟机实现多个域名：利用HTTP REQUEST头部的host字段区分；
2. 通信数据转发程序：
    1. 代理：请求代理；
    2. 网关：能使通信线路上的服务器提供非HTTP协议服务；
    3. 隧道：SSL加密手段通信；
3. 缓存：客户端缓存，服务器端缓存；

### 第6章 HTTP首部

1. 首部字段(P80概览)；
2. 四种缓存的优先级：cache-control > expires > etag > last-modified

### 第7章 HTTPS(加密 + 认证 + 完整性保护)

1. HTTPS = HTTP + SSL；
2. 公开密钥 + 共享密钥 的加密方式；
3. 权威第三方认证证书保证公开密钥的可靠性；
4. SSL加密解密慢，所以只用在交换共享密钥的时候用HTTPS方式，之后就用共享密钥加密；

### 第8章 确认用户身份认证

1. BASIC认证；
2. digest认证；
3. SSL客户端认证；
4. 基于表单认证；

### 第9章 基于HTTP的功能追加协议

1. 消除HTTP瓶颈的SPDY：多路复用，压缩头部，推送功能；
2. 双工通信：WbSocket；
3. HTTP/2.0;

### 第10章 构建Web内容的技术

### 第11章 web的攻击技术

1. 因输入/输出值转义不完全引发的安全漏洞：
    1. SQL注入；
    2. 跨站脚本攻击(XSS) + 会话劫持[1.DOM型； 2.存储型]]：利用没转义的输出构建script标签，将用户信息发送给自己的服务器，获取用户数据(cookie)，就可以伪装成用户发送请求了；[参考](https://tech.meituan.com/fe_security.html)*
    3. 跨站点请求伪造(CSRF)：利用img.src的属性，在用户不知情的情况下，发送请求(如购物)；[参考](https://tech.meituan.com/fe_security_csrf.html)
2. 其他安全漏洞：
    1. 密码破解：穷举法，字典攻击；
    2. 点击劫持(iframe透明覆盖)；
    3. Dos攻击：利用大量请求造成资源过载；