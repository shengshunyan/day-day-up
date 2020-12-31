---
title: nginx入门到实践
date: 2019-12-24
tags:
     - 计算机基础
---

## 常用
```bash
# 检查nginx配置语法是否正确
nginx -t -c /etc/nginx/nginx.conf
# reload
systemctl reload nginx
# 或者
nginx -s reload
```

## 第一章、环境准备
1. 确认关闭iptables规则(防火墙)；
2. 确认停用selinux(linux安全)；

## 第二章、基础篇

### 一. nginx简介
1. 中间件架构
![1.png](https://i.loli.net/2019/12/07/dVBsUYCvIzW5yjS.png)
2. nginx: nginx是一个开源且高性能、可靠的HTTP中间件、代理服务；
3. nginx优势：
    - 采用IO多路复用epoll模型：多进程多线程 + epoll模型
    ![2.png](https://i.loli.net/2019/12/07/FhCHepjxlAbgDqS.png)  
    - cpu亲和：一种把cpu核心和Nginx工作进程绑定方式，把每个worker进程固定在一个cpu上执行，减少切换cpu的cache miss，获得更好的性能；
    - sendfile：普通http服务器发送文件需要经过user space，而nginx直接从kernel space复制发送过去，这样更快；
    ![3.png](https://i.loli.net/2019/12/07/W6Mu3C2GXnTfJYN.png)
    ![4.png](https://i.loli.net/2019/12/07/kROhI4LPHrGsNEV.png)

### 二. nginx安装
1. 方法一：下载安装解压编译安装，包下载地址：https://nginx.org/en/download.html；
2. 方法二：设置yum关于nginx的安装源，然后用yum安装即可yum install nginx;（参考地址：https://nginx.org/en/linux_packages.html，看centos的安装步骤）

### 三. nginx安装目录
1. 安装目录查看：rpm -ql nginx
2. /etc/logrotate.d/nginx(配置文件)：nginx日志轮转，用于logrotate服务的日志切割；
3. /etc/nginx/nginx.conf(配置文件)：自定义配置文件；
4. /etc/nginx/conf.d/default.conf(配置文件)：默认配置文件；
5. /etc/nginx/mime.types(配置文件)：设置http协议的Content-Type与拓展名对应关系；
6. ![5.png](https://i.loli.net/2019/12/07/PtNjcsdb1Da9zMJ.png)
7. /usr/sbin/nginx(命令)：nginx服务的启动管理的终端命令；
8. /var/cache/nginx(目录)：nginx的缓存目录；
9. /var/log/nginx(目录)：nginx的日志目录；

### 四. nginx配置语法
1. nginx默认配置语法（/etc/nginx/nginx.conf）
    - user 设置nginx服务的系统使用用户
    - worker_processes 工作进程数(一般与内核数一致)
    - error_log nginx的错误日志
    - pid nginx 服务启动时候的pid
    - events.worker_connections 每个进程允许的最大连接数
    - event.use 使用哪种内核模型
2. 检查nginx配置语法是否正确
```bash
nginx -t -c /etc/nginx/nginx.conf
```

### 五. nginx虚拟主机
1. curl -v [url] 可以查看请求的request和response
2. ip a 查看主机网卡  
3. **基于多主机多IP的方式**：一个服务器对应多个ip
    - 多网卡多IP的方式
    - 单网卡多IP的方式：在网卡上添加IP，增加/etc/nginx/conf.d目录下的配置文件，listen字段添加特定ip
4. **基于端口的配置方式**：多个服务监听不同的端口
    - 增加/etc/nginx/conf.d目录下的配置文件，listen字段改成不用的端口；
    - 检查端口是否被占用：ss -luntp
    - 检查nginx配置语法是否正确：nginx -tc /etc/nginx/nginx.conf
5. **基于多个host名称的方式**：一个主机对应多个域名
    - 增加/etc/nginx/conf.d目录下的配置文件，server_name字段修改为对应的域名

### 六. nginx日志
1. 类型：error_log, access_log
2. log_format定义日志输出的格式

### 七. nginx模块
1. 类型：nginx官方模块、第三方模块
2. 官方模块_sub_status: 
    - 编译选项：--with-http_stub_status_module
    - 作用：nginx的客户端状态
    - 配置context: server, location（提供一个端口或者一个端口下的路径可以查看nginx的连接状态）
3. 官方模块_surandom_index: 在访问目录下随机返回主页文件
4. 官方模块_sub_module: 
    - 编译选项：--with-http_sub_module
    - 作用：http内容替换
    - 配置context: http, server, location

### 八. nginx的请求限制
1. 请求限制：
    - 连接频率限制：limit_conn_module
    - 请求频率限制：limit_req_module
2. http  
    - http1.0: TCP不能复用；
    - http1.1: 顺序性TCP复用；
    - HTTP2.0: 多路复用TCP复用；
![three-times-handshake.png](https://i.loli.net/2019/12/11/TPt5i9jMGOKVd4Q.png)
3. apache压测工具ab (apache bench)
```bash
ab -n 100 -c 10 http://www.shengshunyan.xyz
```

### 九. nginx的访问控制
1. 类型
    - 基于IP的访问控制(ip、网段)：http_access_module
    - 基于用户的信任登陆：http_auth_basic_module
2. http_access_module的局限性
![2.png](https://i.loli.net/2019/12/11/X8gt2OAwum7zR9h.png)
**解决方法**：
    - 采用别的HTTP头信息控制访问，如HTTP_X_FORWARDED_FOR
![3.png](https://i.loli.net/2019/12/11/9Qh8cmON1C4vgyz.png)
    - 结合geo模块
    - 通过HTTP自定义变量传递
3. http_auth_basic_module的局限性
    - 用户信息依赖文件方式
    - 操作管理机械，效率低下  
**解决方法**：
    - nginx结合LUA实现高效验证
    - 利用nginx-auth-ldap模块

## 第三章、场景实践

### 一. nginx作为静态资源web服务
1。 结构：
![4.png](https://i.loli.net/2019/12/11/4I9LiJDKA8vYNzS.png)
2. 静态资源类型：非服务器动态运行生成的文件
3. 静态资源服务场景-CDN
![5.png](https://i.loli.net/2019/12/11/woQqLBKnHIFm3DX.png)
4. 配置语法-文件读取
    - syntax: sendfile on | off;
    - default: sendfile off;
    - context: http, server, location, if in location;
5. 配置语法-tcp_nopush
    - syntax: tcp_nopush on | off;
    - default: tcp_nopush off;
    - context: http, server, location, location;
    - 作用：sendfile开启的情况下，提高网络包的传输效率；
6. 配置语法-tcp_nodelay
    - syntax: -tcp_nodelay on | off;
    - default: -tcp_nodelay on;
    - context: http, server, location, location;
    - 作用：keepalive连接下，提高网络包的传输实时性；
7. 配置语法-压缩
    - syntax: gzip on | off;
    - default: gzip off;
    - context: http, server, location, location;
    - 作用：压缩传输；
8. 浏览器缓存：
    - http协议定义的缓存机制(如：Expires(http1.0), Cache-control等)
    - 校验过期机制：是否需要检查资源过期(Cache-Control中的max-age) -> 发起请求询问服务器资源是否过期
    ![1.png](https://i.loli.net/2019/12/12/qoJBAuOE1gn9lyF.png)
    ![2.png](https://i.loli.net/2019/12/12/seVigx2aTzIXJZC.png)
9. 跨站访问(Access-Control-Allow-Origin)
    - Syntax: add_header name value [always];
    - Default: -
    - Context: http, server, location, if in location
10. 防盗链
    - 目的：防止资源被盗用，防止其他网站用本站的资源
    - 根据请求头中的referer字段
    ```bash
    location ~ .*\.(jpg|gif|png)$ {
        valid_referers none blocked 116.62.103.228;
        if ($invalid_referer) {
            return 403;
        }
        root /opt/app/images;
    }
    ```

### 二. nginx作为代理服务
1. 代理分类：
    - 正向代理服务的对象是客户端；(翻墙：利用能访问外网的主机做跳板来达到翻墙的目的)
    ![1.png](https://i.loli.net/2019/12/12/5eQavsFcmYV2EUK.png)
    - 反向代理服务的对象是服务端；
    ![2.png](https://i.loli.net/2019/12/12/SvhKZTyzOBFtlfC.png)
2. nginx可支持的代理协议
![3.png](https://i.loli.net/2019/12/12/K1zpr5mw8oBXghv.png)
常见的nginx作为反向代理支持协议
![4.png](https://i.loli.net/2019/12/12/8AixH5EvIOPXucr.png)
常见的nginx作为正向代理支持协议（不支持https）
![5.png](https://i.loli.net/2019/12/12/ZvBu5WLn9CcitjN.png)
3. 模块proxy_pass配置语法
    - Syntax: proxy_pass URL;
    - Default: -
    - Context: location, if iin loacation, limit_except
4. 其他配置语法-缓冲区
    - Syntax: proxy_buffering on | off;
    - Default: proxy_buffering on;
    - Context: http, server, location
5. 其他配置语法-跳转重定向
    - Syntax: proxy_redirect default | off | replacement;
    - Default: proxy_redirect default;
    - Context: http, server, location
6. 其他配置语法-头信息
    - Syntax: proxy_set_header field value;
    - Default: proxy_set_header Host $proxy_host;
            proxy_set_header Connection close;
    - Context: http, server, location
7. 其他配置语法-超时
    - Syntax: proxy_connect_timeout time;
    - Default: proxy_connect_timeout 60s;
    - Context: http, server, location
8. 实践场景
```bash
location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_redirect default;
    
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    
    proxy_connect_timeout 30;
    proxy_send_timeout 60;
    proxy_read_timeout 60;
    
    proxy_buffer_size 32k;
    proxy_buffering on;
    proxy_buffers 4 128k;
    proxy_vusy_buffers_size 256k;
    proxy_max_temp_file_size 256k;
}
```

### 三. nginx作为缓存服务
1. 缓存类型：客户端缓存、代理缓存、服务端缓存；
2. 配置语法-proxy_cache_path
    - Syntax: proxy_cache_path path [level=levels] ...
    - Default: -
    - Context: http
3. 配置语法-proxy_cache
    - Syntax: proxy_cache zone | off;
    - Default: proxy_cache off;
    - Context: http, server, location
4. 配置语法-缓存过期周期
    - Syntax: proxy_cache——valid [code ...] time;
    - Default: -
    - Context: http, server, location
5. 配置语法-缓存的维度
    - Syntax: proxy_cache_key string;
    - Default: proxy_cache_key $scheme$proxy_host$request_uri;
    - Context: http, server, location
6. 实践场景
![1.png](https://i.loli.net/2019/12/13/cMdO3rqNAIUoaCi.png)
7. 缓存命中分析
    - 方法一：通过设置response的头信息Nginx-Cache，add_header Nginx-Cache "$upstream_cache_status";
    - 方法二：通过设置log_format，打印日志分析；
8. 大文件分片请求-http_slice_module
    - Syntax: slice size;
    - Default: slice 0;
    - Context: http, server, location
    - 优势：每个子请求收到的数据都会形成一个独立文件，一个请求断了，其他请求不会受到影响；

### 四. Fastcgi
1. 结构
![3.png](https://i.loli.net/2019/12/17/H4NheJbUgWmspuX.png)
2. fastcgi代理配置
    - Syntax: fastcgi_pass address;
    - Default: -
    - Context: location, if in location
3. fastcgi缓存
![1.png](https://i.loli.net/2019/12/17/j6AbveLyBn4h9pC.png)
4. fastcgi缓存配置：
    - fastcgi_cache_path(缓存路径)
    - fastcgi_cache_key(缓存维度)
    - fastcgi_cache(缓存对应的空间)

### 五、uwsgi
1. 结构
![2.png](https://i.loli.net/2019/12/17/w9BJ8PZjOXmDoFc.png)

### 六、nginx作为负载均衡服务
1. 按分布地域分，基于LVS的中间件架构：
    - GSLB：地域分布广
    ![4.png](https://i.loli.net/2019/12/17/McIgp6QxYWDePL7.png)
    - SLB (nginx是SLB类型)
    ![5.png](https://i.loli.net/2019/12/17/UCjaEtVX3DHZ9AN.png)
2. 按网络其层模型分
    1. 四层负载均衡：传输层，支持TCP/IP包的转发，性能快；
    2. 七层负载均衡（nginx是七层负载均衡）：应用层，能改写http头部信息；
3. nginx负载均衡结构
![6.png](https://i.loli.net/2019/12/17/vHCqo8jiaNAs4SB.png)
4. 配置语法：upstream
    - Syntax: upstream name {...}
    - Default: -
    - Context: http
5. 后端服务器在负载均衡调度中的状态
    - down: 当前的server暂时不参与负载均衡
    - backup: 预留的备份服务器
    - max_fails: 允许请求失败的次数
    - fail_timeout: 经过max_fails次失败后，服务暂停的时间
    - max_conns: 限制最大的接受接收的连接数
    ```bash
    upstream imooc {
        server 116.62.103.228:8001 down;
        server 116.62.103.228:8002 backup;
        server 116.62.103.228:8003 max_fails=1 fail_timeout=10s;
    }
    ```
6. 轮询策略与加权轮询
    - 轮询：按时间顺序逐一分配到不同的后端服务器
    - 加权轮询：weight值越大，分配到的访问几率越高
    ```bash
    upstream imooc {
        server 116.62.103.228:8001 weight=1;
        server 116.62.103.228:8002 weight=2;
    }
    ```
    - ip_hash：每个请求按访问的IP结果分配，这样来自同一个IP的固定访问一个后端服务器
    ```bash
    upstream imooc {
        ip_hash;
        server 116.62.103.228:8001;
        server 116.62.103.228:8002;
    }
    ```
    - url_hash：按照访问的URL的hash结果来分配请求，使每个URL定向到同一个后端服务器
    ```bash
    upstream imooc {
        hash $request_uri;
        server 116.62.103.228:8001;
        server 116.62.103.228:8002;
    }
    ```
    - least_conn：最少链接数，哪个机器连接数最少就分发
    - hash关键数值：hash自定义key

## 第四章、深度学习篇

### 一、nginx动静分离
1. 概念：通过中间件将动态请求和静态请求分离；
2. 为什么：分离资源，减少不必要的请求消耗，减少请求延时；

### 二、nginx的rewrite规则
1. 作用：实现url重写以及重定向，依赖正则匹配
2. 场景：
    - URL访问跳转，支持开发设计：页面跳转、兼容性支持、展示效果等
    - SEO优化
    - 维护：后台维护、流量转发等
    - 安全
3. 配置语法：rewrite
    - Syntax: rewrite regex replacement [flag]
    - Default: -
    - Context: server, location, if
    ```bash
    # 紧急维护页面
    rewrite ^(.*)$ /pages/maintain.html break;
    ```
4. 正则表达式
    1. \ 转义字符
    ```bash
    rewrite index\.php$ /pages/maintain.html break;
    ```
    2. () 用于匹配括号之间的内容，通过$1、$2调用
    ```bash
    if ($http_user_agent ~ MSIE) {
        rewrite ^(.*)$ /msie/$1 break;
    }
    ```
5. flag
    - last: 停止rewrite检测（服务重定向）
    - break：停止rewirte检测（静态资源重定向）
    - redirect：返回302临时重定向，地址栏会显示跳转后的地址
    - permanent：返回301永久重定向(会缓存在浏览器本地)，地址栏会现实跳转后的地址
6. rewrite规则优先级
    - 执行server块的rewrite指令
    - 执行location匹配
    - 执行选定的location中的rewrite

### 三、nginx进阶高级模块
1. secure_link_module模块
    - 作用：
        1. 制定并允许检查请求的链接的真实性以及保护资源免遭未经授权的访问
        2. 限制链接生效周期
    - 语法
        1. Syntax: secure_link expression;
        2. Default: -
        3. Context: http, server, location
        4. Syntax: secure_link_md5 expression;
        5. Default: -
        6. Context: http, server, location
    - 图示：dm5加密验证，expires过期校验
    ![1.png](https://i.loli.net/2019/12/20/ZOPYdSh9sqvxc3L.png)
    - 示例
    ![2.png](https://i.loli.net/2019/12/20/yFVc9tjzIsSmvw4.png)
2. geoip_module模块
    - 作用：基于IP地址匹配MaxMind GeoIP二进制文件，读取所在地域信息
    - 使用场景：
        1. 区别国内外作HTTP访问规则
        2. 区别国内城市地域作HTTP访问规则
    - 示例
    ![3.png](https://i.loli.net/2019/12/20/FMhmtwNRIdgLiD5.png)

### 四、基于nginx的HTTPS服务
1. 为什么需要HTTPS
    - HTTP传输数据被中间人盗用、信息泄露
    - 数据内容劫持、篡改
2. 加密方式
    - 对称加密
    ![4.png](https://i.loli.net/2019/12/20/VU1oOkzEucl6aGq.png)
    - 非对称加密
    ![5.png](https://i.loli.net/2019/12/20/ow4Y61Bl3LjKS8i.png)
3. HTTPS协议的实现：对传输内容进行加密以及身份验证；
    - HTTPS加密：对称加密和非对称加密混合使用
    ![6.png](https://i.loli.net/2019/12/20/IBo9RlUx2ZkEDVX.png)
    - HTTPS身份认证：CA签名证书
4. HTTPS服务优化
    - 激活keepalive长连接
    - 设置ssl session缓存

### 五、nginx与LUA的开发
1. Lua：一个简洁、轻量、可扩展的脚步语言；
2. Nginx+Lua的优势：充分的结合Nginx的并发处理epoll优势和Lua的轻量实现简单的功能且高并发的场景；
3. 示例：Nginx+Lua实现灰度发布(部分用户先体验新代码)
    - nginx实现高并发、代理
    - Lua脚本控制访问逻辑，根据用户信息(cookie或、ip等)判断是访问新版本还是旧版本；

## 第五章、nginx架构篇
### 一、匹配优先级
1. 多个server_name中虚拟主机匹配的优先级：按照配置文件排序列表，先读取的优先级高；
2. location匹配优先级
    - = 进行普通字符精确匹配，匹配到就不会再继续向下查找
    - ^~ 表示普通字符前缀匹配，匹配到就不会再继续向下查找
    - ～ \~* 表示执行一个正则匹配，还会往下查找是否有更精确的

### 二、nginx常见问题
1. nginx的try_files的使用：按顺序检查文件是否存在
2. nginx的alias和root区别
    - ![1.png](https://i.loli.net/2019/12/23/zMixKghS7ocW1vR.png)
    - ![2.png](https://i.loli.net/2019/12/23/9obIgke6CKj4LFc.png)
3. 用什么方法传递用户的真实IP：在第一级代理添加一个头字段存储用户真实IP
![3.png](https://i.loli.net/2019/12/23/Ea12pg5MNQcm3nS.png)
4. nginx中常见的错误
    - 413 Request Entity Too Large: 调整用户上传文件限制，client_max_body_size
    - 502 bad gateway: 后端无响应
    - 504 Gateway Time-out: 后端服务超时

### 三、nginx性能优化
1. ab压测工具 
    - 安装：yum install httpd-tools
    - 使用：ab -n 2000 -c 2 http://127.0.0.1/
        1. -n 总的请求数
        2. -c 并发数
        3. -k 是否开启长连接
2. 网络、**系统、服务、** 程序、数据库、底层服务
    - 文件句柄：
        1. linux\Unix一切皆文件，文件句柄就是一个索引
        2. 设置方式(/etc/security/limit.conf)：系统全局性修改、用户局部性修改、进程局部性修改
    - CPU的亲和：work绑定到CPU，减少切换的性能损耗
    - nginx通用配置：https://coding.imooc.com/lesson/121.html#mid=6246

### 四、nginx安全
1. nginx的安全-常见的恶意行为：爬虫行为和恶意抓取、资源盗用
    - 基础防盗功能
    - secure_link_module对数据安全性提高加密验证和失效性，适合核心重要数据
    - access_module-对后台、部分用户服务的数据提供IP防控
2. nginx的安全-常见的攻击手段：
    - 后台密码撞库，通过猜测密码字典不断对后台系统登录性尝试，获取后台登录密码
        1. 后台登陆密码复杂度
        2. access_module-对后台提供IP防控
        3. 预警机制（nginx+lua对某用户不断尝试登录进行报警）
    - 文件上传漏洞-利用上传接口将恶意代码植入到服务器中，再去通过url去访问执行代码
        1. 在nginx配置文件中做判断
    - SQL注入-利用未过滤用户输入的攻击方法，让应用运行本不应该运行的sql
    ![4.png](https://i.loli.net/2019/12/23/875xTLNZMpbhHzu.png)
        1. nginx+lua防火墙防sql注入:https://github.com/loveshell/ngx_lua_waf

### 五、nginx架构总结
1. 定义nginx在服务体系中的角色
    - 静态资源服务：浏览器缓存、类型分类、防盗链、流量限制、压缩
    - 代理服务：协议类型、正向代理、反响代理、负载均衡、代理缓存、头信息处理、proxypass
    - 动静分离

## 第六章、新特性篇
### 一、nginx平滑升级
1. 平滑升级：不造成服务终中断，用户访问无感知；
2. 升级注意：
    - 新老版本Nginx安装目录结构一致
    - 老版本备份：nginx -> nginx.old
    - 重启进程采用reload的方式
3. 升级步骤：
    - 了解现有版本nginx的安装
    - 按照原有的编译参数重新编译新版本
    - reload服务

### 二、http 2.0和gRPC
1. http 1.1 长连接  
![1.png](https://i.loli.net/2019/12/24/eqSAFbNniJsWjx3.png)
2. http 2.0 多路复用  
![2.png](https://i.loli.net/2019/12/24/8ofQqYtPyJCUsEe.png)
3. gRPC
    - gRPC是由Google主导开发的RPC框架
    - gRPC提供的从客户端到服务器的整套解决方案
    - gRPC是一个基于HTTP 2.0的协议