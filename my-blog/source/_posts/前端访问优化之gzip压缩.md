---
title: 前端访问优化之gzip压缩
date: 2021-03-28
keywords: gzip, 压缩, nginx, http
cover: https://i.loli.net/2021/03/28/bYQKr8oRc1NEwPH.png
tags:
     - 计算机基础
---

{% note info no-icon %}
参考：
 - 知乎***李宇***回答[《前端性能优化之缓存与GZIP》](https://zhuanlan.zhihu.com/p/124681905)
 - 知乎***野路子小选手***回答[《你真的了解 gzip 吗？》](https://zhuanlan.zhihu.com/p/24764131)
{% endnote %}


## 背景

如果你是个前端开发人员，你肯定知道线上环境要把js，css，图片等压缩，尽量减少文件的大小，提升响应速度，特别是对移动端，这个非常重要。

前端压缩的方式很多，依赖java的有ant工具，前端自己打包压缩的有grunt，gulp，webpack，基本上能压缩50%以上。主要是去除了文件中的空行、会车，然后把变量名、函数名等替换成更简短的字母，从而达到压缩文件大小的目的。

但是，优化是无止境的。日常工作中，我们传输大文件之前都会先用压缩工具先压缩一下，然后再发送给对方，这样能大大节省文件传输时间。那在浏览器请求前端静态资源的这个过程中，能否也能用这种方式加快资源的传输从而加快前端页面的访问速度呢？答案正是我们今天要介绍的**gzip压缩**

对于HTTP的压缩，是一种使用CPU时间来换取网络传输时间的技术。在现有网络环境下，CPU所消耗的时间远远小于网络传输所使用的时间。因此，如果服务器的CPU尚有盈余，则开启压缩是收益很大的。

<br/>


## gzip

gzip是GNUzip的缩写，最早用于UNIX系统的文件压缩。HTTP协议上的gzip编码是一种用来改进web应用程序性能的技术，web服务器和客户端（浏览器）必须共同支持gzip。目前主流的浏览器，Chrome,firefox,IE等都支持该协议。常见的服务器如Apache，Nginx，IIS同样支持gzip。

gzip压缩比率在30%到10%左右，可以大大节省服务器的网络带宽。在实际应用中，一般针对前端静态资源进行压缩(js, css, html等)，一般不建议对图片文件、PDF、音频文件之类设置gzip，因为这类文件有自己的压缩算法。

那么客户端和服务器之间是如何通信来支持gzip的呢？

 1. 浏览器请求url，并在request header中设置属性accept-encoding:gzip。表明浏览器支持gzip。

 2. 服务器收到浏览器发送的请求之后，判断浏览器是否支持gzip，如果支持gzip，则向浏览器传送压缩过的内容，不支持则向浏览器发送未经压缩的内容。一般情况下，浏览器和服务器都支持gzip，response headers返回包含content-encoding:gzip。

 3. 浏览器接收到服务器的响应之后判断内容是否被压缩，如果被压缩则解压缩显示页面内容。

![WX20210328-173324@2x.png](https://i.loli.net/2021/03/28/8cuWIBjL4dVnYko.png)

<br/>


## nginx配置gzip压缩

对于静态资源，有两种开启压缩的方式，一种是compress in time，另一种是precompression。

![v2-9c3947e9a122d2a9daba1bee1d7ef59c_r.jpeg](https://i.loli.net/2021/03/28/TewocymBklifjzQ.jpg)

对于第二种，因为静态资源已经提前进行了压缩处理，当HTTP请求到达之后，可以直接响应已经压缩过的文件，所以可以节约服务器的CPU。

### 构建.gz前端资源

首先，我们需要构建出被压缩过的静态资源，这里可以借助[CompressionWebpackPlugin](https://webpack.js.org/plugins/compression-webpack-plugin/)来达成我们的目的。配置如下：

```JavaScript
new CompressionPlugin({
    test: /\.js$|\.css$|\.html$|\.json$/, // 对哪些资源进行压缩
    threshold: 8192, // 超过多大的资源会被压缩，单位bytes
    minRatio: 0.8, // 压缩过后体积减少到80%以下的文件会被压缩
})
```

### nginx配置

一般修改nginx热配置文件 /etc/nginx/nginx.conf，在 http 项下增加如下配置：

```conf
http {
    ...

    # gzip
    # 开启gzip on为开启，off为关闭
    gzip on;
    # 检查是否存在请求静态文件的gz结尾的文件，如果有则直接返回该gz文件内容，不存在则先压缩再返回
    gzip_static on;
    # 设置允许压缩的文件最小字节数，默认值是0，不管页面多大都压缩
    # 建议设置成大于10k的字节数，配合compression-webpack-plugin
    gzip_min_length 10k;
    # 支持的文件类型，对特定的MIME类型生效,其中'text/html’被系统强制启用
    gzip_types text/javascript application/javascript text/css application/json;
    # 同 compression-webpack-plugin 插件一样，gzip压缩比（1~9），
    # 越小压缩效果越差，但是越大处理越慢，一般取中间值
    gzip_comp_level 6;
    # 获取多少内存用于缓存压缩结果，‘16  8k’表示以8k*16 为单位获得。
    # PS: 如果没有.gz文件，是需要Nginx实时压缩的
    gzip_buffers 16 8k;
    # IE6一下 Gzip支持的不好，故不实用gzip
    gzip_disable "MSIE [1-6]\.";

    ...
}
```

### 效果

就以本站的静态资源index.css为例，看下图设置gzip压缩的前后比对：
 - 文件大小 118kb -> 15.5k
 - 请求时间 323ms -> 26ms

![before.png](https://i.loli.net/2021/03/28/ayE8hcDHLZ6Wz4R.png)

![after.png](https://i.loli.net/2021/03/28/RNC7VlwTEeQJ6GP.png)

<br/>

提升的幅度是不是特别大呢，各位看客老爷，心动的话就动手实践一下吧！

![WX20210328-180340@2x.png](https://i.loli.net/2021/03/28/nuEWQmTJA3xVyCa.png)
