---
title: Java商城实战课程记录
date: 2021-1-4
keywords: Java, 商城, 实战
cover: https://i.loli.net/2021/01/04/kM7ovrTnbpFyWC2.png
tags:
     - Java
---


{% note info no-icon %}
项目地址：https://github.com/shengshunyan/java-mall-project

本文是学习慕课网的一个实战课程[《一次学习 双倍收获 支付+电商平台Java双系统实战》](https://coding.imooc.com/class/392.html)过程中对一些知识点的记录
{% endnote %}

## 总揽

此商城实战项目主要包括了用户注册登录、商品的查询、添加购物车、下单支付等功能，主要技术栈是：SpringBoot2.X + Mybatis + RabbitMQ

<br/>


## 数据库设计

1.  实体关系图

    ![ER图.png](https://i.loli.net/2021/01/04/oFPDfsg6HBtKS4Z.png)

2.  数据库表设计

 - mall_user: 用户表

 - mall_shipping: 收获地址表

 - mall_product: 商品表

 - mall_category: 商品分类表

 - mall_order: 订单表

 - mall_order_item: 订单中的商品表

 - mall_pay_info: 支付信息表（独立在支付系统中）

{% note info no-icon %}
详细表结构参考sql文件：https://github.com/shengshunyan/java-mall-project/blob/main/doc/mall.sql
{% endnote %}

<br/>


## SpringBoot项目初始化

1. 用idea的 Spring Initializr 初始化 SpringBoot 项目

    ![WX20210104-200548.png](https://i.loli.net/2021/01/04/MwQ3HLDNiZCyvWz.png)

2. 添加 Spring Web Starter 依赖

    ![WX20210104-200752.png](https://i.loli.net/2021/01/04/ZbPwxfjOoLlT8dz.png)

3. 在设置中调整 JDK 和 Maven 相关的配置
    - JDK版本要对应
    - Maven中配置默认JDK版本、阿里镜像源等

<br/>


## Mybatis三剑客

1. Mybatis-generator：根据提供的数据库连接信息和表名，自动生成pojo、dao、mapper层的模版文件

2. Mybatis-plugin：已收费，推荐安装 Free-Mybatis-plugin 插件

3. Mybatis-PageHelper: 查询分页的利器

<br/>


## 基于Redis完成购物车模块

在Web应用发展的初期，那时关系型数据库受到了较为广泛的关注和应用，原因是因为那时候Web站点基本上访问和并发不高、交互也较少。而在后来，随着访问量的提升，使用关系型数据库的Web站点多多少少都开始在性能上出现了一些瓶颈，而瓶颈的源头一般是在磁盘的I/O上。而随着互联网技术的进一步发展，各种类型的应用层出不穷，这导致在当今云计算、大数据盛行的时代，对性能有了更多的需求，主要体现在以下四个方面：

 - 低延迟的读写速度：应用快速地反应能极大地提升用户的满意度
 - 支撑海量的数据和流量：对于搜索这样大型应用而言，需要利用PB级别的数据和能应对百万级的流量
 - 大规模集群的管理：系统管理员希望分布式应用能更简单的部署和管理
 - 庞大运营成本的考量：IT部门希望在硬件成本、软件成本和人力成本能够有大幅度地降低

为了克服这一问题，NoSQL应运而生，它同时具备了高性能、可扩展性强、高可用等优点，受到广泛开发人员和仓库管理人员的青睐。

**Redis**是现在最受欢迎的NoSQL数据库之一，Redis是一个使用ANSI C编写的开源、包含多种数据结构、支持网络、基于内存、可选持久性的键值对存储数据库，其具备如下特性：

 - 基于内存运行，性能高效
 - 支持分布式，理论上可以无限扩展
 - key-value存储系统
 - 开源的使用ANSI C语言编写、遵守BSD协议、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API

**购物车的频繁操作，需要利用Redis的高性能的优势**

### 安装redis

1. 创建 docker-compose.yml

    ```yml
    version: '3.1'
    services:
      redis:
        image: daocloud.io/library/redis:5.0.7
        restart: always
        container_name: redis
        environment:
            - TZ=Asia/Shanghai
        ports:
            - 6379:6379
        command: ["redis-server", "/usr/local/redis/redis.conf"]
    ```

2. 运行容器

    ```bash
    docker-compose up -d
    ```

### redis可视化工具

安装 Another Redis Desktop Manager 管理工具

<br/>


## 基于RabbitMQ实现支付的异步通知

如果商品服务和订单服务是两个不同的微服务，在下单的过程中订单服务需要调用商品服务进行扣库存操作。按照传统的方式，下单过程要等到调用完毕之后才能返回下单成功，如果网络产生波动等原因使得商品服务扣库存延迟或者失败，会带来较差的用户体验，如果在高并发的场景下，这样的处理显然是不合适的，那怎么进行优化呢？这就需要消息队列登场了。

消息队列提供一个异步通信机制，消息的发送者不必一直等待到消息被成功处理才返回，而是立即返回。消息中间件负责处理网络通信，如果网络连接不可用，消息被暂存于队列当中，当网络畅通的时候在将消息转发给相应的应用程序或者服务，当然前提是这些服务订阅了该队列。如果在商品服务和订单服务之间使用消息中间件，既可以提高并发量，又降低服务之间的耦合度。

### 安装RabbitMQ

1. 创建 docker-compose.yml

    ```yml
    version: '3.1'
    services:
      rabbitmq:
        image: daocloud.io/library/rabbitmq:management
        restart: always
        container_name: rabbitmq
        ports: 
          - 5672:5672
          - 15672:15672
    ```

2. 运行容器

    ```bash
    docker-compose up -d
    ```

### RabbitMQ可视化工具

上一步运行的容器，暴露的 15672 端口就是web可视化工具的访问端口，访问 ip:15672 即可

<br/>


## 项目部署

{% note info no-icon %}
作者是部署在了腾讯云服务器上，访问地址是：http://mall.shengshunyan.xyz/

各大云服务器平台之间，部署服务的操作差别应该不大
{% endnote %}

### 前端资源的部署

1. 安装 nginx

2. 下载前端代码（前端代码只提供了打包后的压缩包，没有源码）

    ```bash
    wget https://imcfile.oss-cn-beijing.aliyuncs.com/shizhan/file/392/dist.zip
    unzip dist.zip
    ```

3. 项目的nginx配置文件
    - /opt/application/mall 是放置 mall项目 前端资源的文件夹
    - /api/ /pay/ 是后端接口代理
    - 注意 http://127.0.0.1:8081/pay/ 和 http://127.0.0.1:8081/pay 的代理路径是有区别的

    ```bash
    server {
        listen 80;
        server_name  mall.shengshunyan.xyz;

        error_page 497  https://$host$uri?$args;

        location / {
            root /opt/application/mall;
            index index.html index.htm;
        }

        location /api/ {
            proxy_pass http://127.0.0.1:8080/;
        }

        location /pay/ {
            proxy_pass http://127.0.0.1:8081/pay/;
        }

        # error_page 404 /404.html;
        # 	location = /40x.html {
        # }

        # error_page 500 502 503 504 /50x.html;
        # 	location = /50x.html {
        # }
    }
    ```

### 后端资源的部署

以 .service 结尾的单元（unit）配置文件，用于控制由 systemd 控制或监视的进程。简单说，用于后台以守护精灵（daemon）的形式运行程序。

这里的java后端服务就是按照这样的方式来部署启动

1. 上传mall项目的jar包到 /root/mall_and_pay_project/mall 文件夹下

    ```bash
    scp xxx xxx:/root/mall_and_pay_project/mall
    ```

2. 新建 /etc/systemd/system/mall.service 文件

    ```service
    [Unit]
    Description=mall
    After=syslog.target

    [Service]
    User=root
    ExecStart=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.262.b10-0.el7_8.x86_64/jre/bin/java -jar -Dspring.profiles.active=prod -Dlogging.path=/root/mall_and_pay_project/mall/log/ /root/mall_and_pay_project/mall/mall.jar

    [Install]
    WantedBy=multi-user.target
    ```

3. 启动服务

    ```bash
    systemctl start mall
    ```


