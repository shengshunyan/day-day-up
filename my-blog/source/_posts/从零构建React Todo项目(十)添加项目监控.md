---
title: 从零构建React Todo项目(十)添加项目监控
date: 2021-03-11
keywords: JavaScript, React, 监控, webfunny
cover: https://i.loli.net/2020/09/07/M5yvXBUGnYsqEft.gif
tags:
     - JavaScript
---

{% note info no-icon %}
项目地址：https://github.com/shengshunyan/react-scaffold
参考：
 - [webfunny官网](https://www.webfunny.cn/home.html)
 - [webfunny github仓库地址](https://github.com/a597873885/webfunny_monitor)
 - [知乎：前端监控](https://www.zhihu.com/question/29953354)
{% endnote %}


## 前言

如果你是一位前端工程师，那你一定不止一次去解决一些顽固的线上问题，你也曾想方设法复现用户的bug，结果可能都不太理想。 怎样定位前端线上问题，一直以来，都是很头疼的问题，因为它发生于用户的一系列操作之后。错误的原因可能源于机型，网络环境，复杂的操作行为等等，在我们想要去解决的时候很难复现出来，自然也就无法解决。

如果线上环境的bug只等测试人员通过手动测试，然后提供bug复现的步骤，效率不是很高，也不够主动。要是能有一个平台，在用户使用产品的时候，能记录过程中代码发生的一些报错，甚至用户的操作步骤和报错代码位置，那对于产品的质量提升会大有裨益。

<br/>


## 调研

要实现这样一个前端监控平台，大致思路是：
 - 在产品代码中插入一段js代码，监听一些事件，如：页面渲染完成，用户点击事件，js的运行报错等。
 - 一旦触发相关事件，即向监控系统发送日志请求，记录相关问题，监控服务将日志数据存入数据库。
 - 最后得有一个监控平台的前端界面，主要是一些图标，来展示记录的用户操作日志数据。

当然，如果自己从0实现一个监控系统，成本太高。我们可以看看别人已经做好的轮子或者市面上提供相关服务的软件。

经过一番调研，大致有两类：
 - 免费开源：优点是免费，不过需要自己拉代码，修改配置，然后部署监控服务
 - 收费提供服务：按照文档在项目中嵌入探针js代码即可，不用关心监控服务

### 免费开源

1. [Webfunny](https://www.webfunny.cn/)

  webfunny是专门针对前端的监控系统，支持快速部署（私有化部署、容器化部署），支持H5前端、PC前端、小程序项目监控，而且文档是中文的，对国内开发者更友好

2. [sentry](https://docs.sentry.io/)

  sentry是国外开发者开发的平台，具体上手可以参考知乎文章 [sentry(一）初探](https://zhuanlan.zhihu.com/p/210765546)，功能应该差不多，看着部署应该比webfunny简单，但是文档是英文的

### 收费提供服务

1. [fundebug](https://www.fundebug.com/)

  专业的应用错误监控平台，及时发现Bug，提高Debug效率。支持JavaScript，React Native，微信小程序，微信小游戏，支付宝小程序，Java及Node.js

2. [bugsnag](https://www.bugsnag.com/)

  手机app监控解决方案，前后端。We are a full stack stability monitoring solution with best-in-class functionality for mobile applications.

3. [ARMS](https://www.aliyun.com/product/arms?spm=5176.19720258.J_8058803260.640.7b812c4askXztu)

  阿里云上的产品，应用实时监控服务 (Application Real-Time Monitoring Service, 简称ARMS) 是一款应用性能管理产品，包含前端监控，应用监控和Prometheus监控三大子产品，涵盖了浏览器，小程序，APP，分布式应用和容器环境等性能管理，能帮助你实现全栈式的性能监控和端到端的全链路追踪诊断， 让应用运维从未如此轻松高效。

<br/>


## 实战

人生的乐趣在于白嫖，有不花钱的咱就选不花钱的，实在没有，就选花钱最少的。打工人就是这么朴实无华。

在调研之后，决定使用免费的并且有中文文档的 Webfunny 。***Web funny, I funny!***

### 代码下载&环节初始化

1. 在本地调试一番，知道大概流程之后，咱可以跳过本地部署环节，直接上服务器搭建监控服务

    ```bash
    ssh root@xxx.xxx.xxx.xxx
    ```

2. 克隆代码（github网络不稳定，可以使用码云地址）

    ```bash
    # 本地克隆代码
    git clone https://github.com/a597873885/webfunny_monitor.git

    # or 使用码云仓库
    git clone https://gitee.com/webfunnyMonitor/webfunny_monitor.git
    ```

3. 项目根目录下执行初始化命令和安装命令

    ```bash
    cd webfunny_monitor
    npm run init && npm install
    ```

4. 添加执行权限：如果不授权，可能无法自动创建每天的数据库表

    ```bash
    chmod 755 createTable.sh
    chmod 755 restart.sh
    ```

5. 监控服务的运行依赖pm2，所以确认是否安装了pm2（pm2是node.js的进程管理工具）

    ```bash
    # check if pm2 installed
    pm2 -v

    # if not, install it
    npm install pm2 -g
    # linux下运行npm全局包的命令需要添加path, “/usr/local/node/lib/node_modules/pm2/bin/pm2”是全局包安装的位置，可能会有差异
    ln -s /usr/local/node/lib/node_modules/pm2/bin/pm2 /usr/local/bin/ 
    ```



### 配置数据库(Mysql)连接

1. 安装 Mysql 数据库（[Mysql安装教程](https://www.cnblogs.com/warm-stranger/p/10333348.html)）

2. 创建数据库

    ```
    创建数据库：webfunny_db。

    字符集设置：[Default Character set]：utf8、 [Default Collation]：utf8_bin
    ```

3. 数据库连接配置：进入 webfunny_monitor/bin/mysqlConfig.js 文件中

    ```JavaScript
    module.exports = {
        write: {
            ip: 'xxx.xxx.xxx.xxx',         // 远程ip地址
            port: '3306',                  // 端口号
            dataBaseName: 'webfunny_db',   // 数据库名
            userName: 'root',              // 用户名
            password: '123456'             // 密码
        }
    }
    ```

### 启动监控服务服务

1. IP地址或者域名配置：进入webfunny_monitor/bin/domain.js文件中（注意，对应的端口号要保持一致）

    ```JavaScript
    // IP地址配置方式：
    module.exports = {
        localServerDomain: 'xxx.xxx.xxx.xxx:8011',    // 日志上报域名
        localAssetsDomain: 'xxx.xxx.xxx.xxx:8010',    // 前端页面域名
        localServerPort: '8011',                      // 日志上报端口号
        localAssetsPort: '8010',                      // 前端页面端口号
    }

    //域名配置方式：
    module.exports = {
        localServerDomain: 'www.baidu.com:8011',      // 日志上报域名
        localAssetsDomain: 'www.baidu.com:8010',      // 前端页面域名
        localServerPort: '8011',                      // 日志上报端口号
        localAssetsPort: '8010',                      // 前端页面端口号
    }
    ```

2. 启动服务

    ```bash
    # （第一次运行使用此命令，重启使用：npm run restart）
    npm run prd
    ```

3. 查看页面：打开浏览器，访问地址：http://xxx.xxx.xxx.xxx:8010/webfunny/register.html?type=1 (初始化管理员账号，并登录)

    ![WX20210311-210344.png](https://i.loli.net/2021/03/11/LBugkxWAV75IvrZ.png)

### 在产品代码中添加探针

1. 用上一步注册的管理员账号登录之后，即可在 "首页" 创建新应用

    ![WX20210311-210259.png](https://i.loli.net/2021/03/11/4albYo7IQrJVn3F.png)

2. 选择h5项目，创建之后，就会展示添加探针的教程

    ![WX20210311-205555.png](https://i.loli.net/2021/03/11/9YpCrzen8QZwf6h.png)

3. 在todo项目中新增 /src/monitor.js，复制探针代码到文件中；在 /src/index.html head 标签的最顶部引入这个monitor.js

    ![WX20210311-205950@2x.png](https://i.loli.net/2021/03/11/huOfagilZdMKeUX.png)

4. 在js代码最开始的地方(/src/index.tsx)注入用户标识信息

    ![WX20210311-210125@2x.png](https://i.loli.net/2021/03/11/cBs6k1hHbJERDS3.png)

### 效果查看

1. 重新部署todo项目前端资源之后，访问todo项目线上地址：http://mall.shengshunyan.xyz/，可以看到发送日志上报的请求

    ![WX20210311-210629.png](https://i.loli.net/2021/03/11/mARyVDUX2M9CpTe.png)

2. 访问监控服务前端页面：http://xxx.xxx.xxx.xxx:8010/webfunny/overview.html，可以查看todo项目的统计数据

    ![WX20210311-210735.png](https://i.loli.net/2021/03/11/AMwli81qC2SfJHa.png)



