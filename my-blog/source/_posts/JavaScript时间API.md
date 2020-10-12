---
title: JavaScript时间API
date: 2020-10-11
keywords: JavaScript, Date, 时间, day.js
cover: https://i.loli.net/2020/06/29/f1yJm3lD7aKsSnx.jpg
tags:
     - JavaScript
---


{% note info no-icon %}
近期，Momentjs 在官方文档中发布了 Project Status，文中写道：Momentjs 正式进入维护期，不会再提供大版本更新，推荐使用其他时间处理库代替或使用 JavaScript 处于实验阶段的提案 Temporal
{% endnote %}

## 概述

Moment.js 已广泛应用于数百万个项目中，但是目前看来它存在几个问题。

Moment 对象是可变对象（mutable），这点经常被用户所诟病。尽管我们在 使用指南 中写了如何解决这个问题，但还是有很多新用户犯错。如果将 Moment 变为不可变对象（immutable）这会对已使用 Moment 的项目产生破坏性的影响。支持 immutable 的 v3 版本是件很艰巨的任务，这将使 Moment 变为另外一个库，其实有很多类似的库已经实现这个特性，所以让 Moment 保持 mutable 也没什么不好。

另一个反对使用 Moment 的点是它的包体积大小，而 tree shaking 对 Moment 无效，导致应用的包体积剧增。如果你的应用中需要用到国际化和时区，那么 Moment 可能会大到超乎想象。

所以借助这个契机，来熟悉一下JavaScript中时间相关的api。

<br/>


## JavaScript原生Date对象

***[MDN官方文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)***

### 常用方法

1. Date()构造函数有四种基本形式
```JavaScript
// 1. 没有参数，那么新创建的Date对象表示实例化时刻的日期和时间
new Date();
// 2. 一个整数值，表示自1970年1月1日00:00:00 UTC（the Unix epoch）以来的毫秒数
new Date(value);
// 3. 时间戳字符串，如 2019-12-31 23:59:59 
new Date(dateString);
// 4. 分别提供日期与时间的每一个成员
new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);
```

2. Date.now()：返回当前时间的时间戳

3. new Date()创建一个日期对象

| 方法名 | 说明 |
|  ----  | ----  |
| getFullYear() | 获取当年 |
| getMonth() | 获取当月（0-11） |
| getDate() | 获取当天日期 |
| getDay() | 获取星期几（周日0 到 周六6） |
| getHours() | 获取当前小时 |
| getMinutes() | 获取当前分钟 |
| getSeconds() | 获取当前秒钟 |
| getTime()、valueOf() | 获取时间戳（当前时间距离1970年1月1号过了的毫秒数） |


### 简单使用

1. 计算相差时间

     ```JavaScript
     var date = new Date();
     var date1 = new Date('2019-12-31 23:59:59');
     var times, d,h,m,s;
     times = date1.getTime() - date.getTime();           //获取剩余毫秒数
     d = parseInt(times/1000/60/60/24);      //获得天数
     h = parseInt(times/1000/60/60%24);      //计算小时
     m = parseInt(times/1000/60%60);       //获得分钟
     s = parseInt(times/1000%60)               //获得秒数
     ```

2. 格式化时间

     ```JavaScript
     function formatTen(num) { 
          return num > 9 ? (num + "") : ("0" + num); 
     } 
     function formatDate(date) { 
          var date = new Date(date)
          var year = date.getFullYear(); 
          var month = date.getMonth() + 1; 
          var day = date.getDate(); 
          var hour = date.getHours(); 
          var minute = date.getMinutes(); 
          var second = date.getSeconds(); 
          return year + "-" + formatTen(month) + "-" + formatTen(day) + " " 
               + formatTen(hour) + ":" + formatTen(minute) + ":" + formatTen(second); 
     }
     ```

### 注意点

1. **不建议使用new Date(dateString)的方式**：由于浏览器之间的差异与不一致性，强烈不推荐使用Date构造函数来解析日期字符串 (或使用与其等价的Date.parse)。

<br/>


## JavaScript库Day.js

***[官方文档](https://day.js.org/zh-CN/)***

Day.js 是一个轻量的 JavaScript 时间日期处理库，和 Moment.js 的 API 设计保持完全一样. 如果你曾经用过 Moment.js, 那么你已经知道如何使用 Day.js

Day.js 基本用法如下，相同的API，相同的链式操作，熟悉的味道。

```JavaScript
dayjs()
    .startOf('month')
    .add(1, 'day')
    .set('year', 2018)
    .format('YYYY-MM-DD HH:mm:ss');
```

特点：
- 🕒 和 Moment.js 相同的 API 和用法
- 📦 仅 2kB 大小的微型库
- 💪 不可变数据 (Immutable)
- 🔥 支持链式操作 (Chainable)
- 🌐 I18n 国际化
- 👫 支持全球时区转换