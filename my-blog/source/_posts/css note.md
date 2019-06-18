---
title: CSS note
date: 2018-06-03
categories: "CSS note"
tags: 
     - CSS
     - note
---
日常积累的CSS笔记！

1. 用rem，JS动态改变html的font-size可以屏幕自适应
2. CSS3的属性pointer-events能控制JS事件的触发：
    ```
    pointer-events：none //禁止所有事件
    pointer-events：all  //启用所有事件监听
    ```
<!-- more -->
3. 元素垂直居中： 

    1. 父元素高度确定的单行文本设置  height = line-height  
    2. inline-block
        ```
        display: inline-block; 
        vertical-align: middle;
        ```
    3.  absolute定位：
        ```
        // 方法1：子元素
        position: relative; /*脱离文档流*/
        top: 50%; /*偏移*/
        transform: translateY(-50%);
        //方法2：
        .c1 { // 父
            height: 100px;
            width: 100px;
            background: #f3c8c8;
            position: relative;
        }
        .c2 { //子
            height: 50px;
            width: 50px;
            background-color: yellow; 
            position: absolute;
            top: 0;
            bottom: 0;
            display: inline-block;
            margin: auto;
        }
        ```
    4. [flex教程](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)   
    
        ```
        //父元素
        display: flex;
        align-items: center; /*定义body的元素垂直居中*/
        justify-content: center; /*定义body的里的元素水平居中*/
        ```  
    5. 父容器设置为display:table ，然后将子元素也就是要垂直居中显示的元素设置为 display:table-cell （不推荐使用）

4. 元素水平居中：  

    1. 行内元素：设置  text-align:center  
    2. 定宽块状元素：设置左右margin值为auto  
    3. transform
        ```
        // 方法1：子元素
        position: relative; /*脱离文档流*/
        left: 50%; /*偏移*/
        transform: translateX(-50%);
        // 方法2：
        .c1 { // 父
            height: 100px;
            width: 100px;
            background: #f3c8c8;
            position: relative;
        }
        .c2 { // 子
            height: 50px;
            width: 50px;
            background-color: yellow; 
            position: absolute;
            left: 0;
            right: 0;
            display: inline-block;
            margin: auto;
        }
        ```  
    4. flex布局

5. 清除浮动：
    1. 父元素：overflow：auto;
    2. 父元素内部最后加<br style="clear:both">
6. 元素设置为display:inline-block;之后会往下移：那是因为display:inline-block成了内联，inline box有一个叫做baseline的东西，想要更改很简单只要vertical-align: top;和vertical-align: bottom;
7. div剩余高度自动填充：  
    1. position:absolute 
        ```
        #nav {
            background-color: #85d989;
            width: 100%;
            height: 50px;
        }
        #content {
            background-color: #cc85d9;
            width: 100%;
            position: absolute;
            top: 50px;
            bottom: 0px;
            left: 0px;
        }
        ```  
    2. 也可利用CSS的calc方法实现

        ```
        height: calc(100% - 3.4986rem);
        ```
8. CSS超出宽度的文本用'...'

    ```
    <!---- 正常 >
    .div {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis; //裁剪文本 用...
        white-space: nowrap; //不换行
    }
    <!---- 表格 >
    table{
        
    　　table-layout: fixed;
    
    }
    td{
    
    　　white-space: nowrap;
    　　overflow: hidden;
    　　text-overflow: ellipsis;
    
    }
    ```
9. CSS 设置table下tbody滚动条
    ```
    table tbody {
    
        display:block;
    
        height:195px;
    
        overflow-y:scroll;
    
    }
    
    table thead, tbody tr {
    
        display:table;
    
        width:100%;
    
        table-layout:fixed;
    
    }
    ```
10. pointer-events: none; // 解决元素被覆盖，元素点不上的问题
11. 滚动视差：利用background-attachment: scroll/local/fixed; 实现; (滚动视差？CSS不在话下)
12. 三栏布局
    *参考：[三栏布局](https://blog.csdn.net/mrchengzp/article/details/78573208)*
    1. float布局；
    2. position: absolute;
    3. display: table;
    4. display: flex;
    5. display: grid;
13. CSS层叠顺序：(层叠次序, 堆叠顺序, Stacking Order) 描述的是元素在同一个层叠上下文中的顺序规则，从层叠的底部开始，共有七种层叠顺序：
    1. 背景和边框：形成层叠上下文的元素的背景和边框。
    2. 负z-index值：层叠上下文内有着负z-index值的定位子元素，负的越大层叠等级越低；
    3. 块级盒：文档流中块级、非定位子元素；
    4. 浮动盒：非定位浮动元素；
    5. 行内盒：文档流中行内、非定位子元素；
    6. z-index: 0：z-index为0或auto的定位元素， 这些元素形成了新的层叠上下文；
    7. 正z-index值：z-index 为正的定位元素，正的越大层叠等级越高；