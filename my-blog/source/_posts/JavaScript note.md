---
title: JavaScript note
date: 2018-06-03
categories: "JavaScript note"
tags: 
     - JavaScript
     - note
---
日常积累的JavaScript笔记！

### 原生JavaScript
1. 选择器时态问题 
    ```JavaScript
    var elem = document.getElementsByClassName('div');//能选中未来的元素
    var elem = document.querySelectorAll('.div');//不能选中未来的元素
    var elem = $('.div');//不能选中未来的元素
    ```
<!-- more -->
2. 值检验：
    -  如果值是一个引用类型，使用instanceof检查其构造函数
    -  如果值是一个基本类型，使用typeof检查其类型
3. e.currentTarget指的是注册了事件监听器的对象，而e.target指的是该对象里的子对象，也是触发这个事件的对象。
4. [setTimeout详解](http://mp.weixin.qq.com/s/poxACQftbiXg2ePtfTrkkQ)
5. postMessage解决不同iframe之间的参数传递
    ```JavaScript
    // a页面 （!!!注意：window.frames[0]是目标iframe，是信息接收方，而不是信息发送方）
    window.frames[0].postMessage('getcolor','http://lslib.com');
    // b页面
    window.addEventListener('message',function(e){
        if(e.source!=window.parent) return;
        var color=container.style.backgroundColor;
        window.parent.postMessage(color,'*');
    },false);   
    ```
6. 解决路径跳转中文乱码的问题： encodeURI(url) decodeURI(url)
7. console正确打开方式：
    ```JavaScript
    console.log("log");
    console.log("%d年%d月%d日", 2015, 09, 22);
    
    console.debug("debug");
    console.info("info");
    console.warn("warn");
    console.error("error");
    
    // 输出表格
    const people = {
        "person1": {"fname": "san", "lname": "zhang"}, 
        "person2": {"fname": "si", "lname": "li"}, 
        "person3": {"fname": "wu", "lname": "wang"}
    };
    console.table(peopl);
    
    // 测试性能
    console.time("for-test");
    // some codde...
    console.timeEnd("for-test");
    
    // 记录代码被执行次数
    function func() {
        console.count("label");
    }
    for(let i = 0; i < 3; i++) {
        func();
    }
    ```
8. 浏览器渲染页面：
    1. HTML解析文件，生成DOM Tree，解析CSS文件生成CSSOM Tree;
    2. 将Dom Tree和CSSOM Tree结合，生成Render Tree(渲染树);
    3. 根据Render Tree渲染绘制，将像素渲染到屏幕上;
    
### jQuery
1. jQuery的attr()对应的是html文本；prop()对应的是DOM对象;
2. jQuery中each类似于javascript的for循环  
但不同于for循环的是在each里面不能使用break结束循环，也不能使用continue来结束本次循环，想要实现类似的功能就只能用return,  
break        用return false  
continue      用return true
3. [jQuery数据缓存和HTML5 data-*属性](http://note.youdao.com/)
    1. jQuery读取data-*会自动做数据类型转换，如果不想要这种转换只能使用attr()去获取原始的属性值。
    2. jQuery读取data-*属性是懒惰的、按需的，只有真正使用这些属性的时候，jQuery才会将其加载到内存。
    3. jQuery修改属性值，都是在内存中进行的，并不会修改 DOM。(通过js中的dataset修改时候，会刷新DOM)
    4. data-*会被jQuery绑定到HTMLElement对象上，而不是jQuery封装后的对象上。
    5. 最重要的一点：jQuery只会在data-*第一次被访问的时候将其加载到内存，之后再也不会重新读取了。
4. 问题：jQuery prop改变checkbox状态不能出发change事件；  
解决：添加change()，让它触发$("input[type='checkbox']").prop('checked', true).change();
