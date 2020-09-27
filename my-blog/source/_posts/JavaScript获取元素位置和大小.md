---
title: JavaScript获取元素位置和大小
date: 2020-09-27
keywords: JavaScript, Dom, 位置, 大小
cover: https://i.loli.net/2020/06/29/f1yJm3lD7aKsSnx.jpg
tags:
     - JavaScript
---


## 概述

之前一直对元素位置、大小等属性的计算和逻辑处理比较模糊，所以本文整理了一下JavaScript DOM 中获取元素位置和大小的API

<br/>


## 元素的位置

### 相对视口的位置

document.querySelector("...").getBoundingClientRect()的返回值中的属性
 - left: 元素(包括内容+padding+border)左侧相对于**可视区**左上角的距离
 - right: 元素(包括内容+padding+border)右侧相对于**可视区**左上角的距离
 - top: 元素(包括内容+padding+border)上边相对于**可视区**左上角的距离
 - bottom: 元素(包括内容+padding+border)下边相对于**可视区**左上角的距离

 ![rect.png](https://i.loli.net/2020/09/23/XdfItmB1OT4Wpcw.png)

### 相对已定位的父容器的位置

**已定位的父容器**（offsetParent对象）是指元素最近的定位（relative,absolute）祖先元素,可递归上溯。

document.querySelector("...")的相关属性
 - offsetLeft: 元素(包括内容+padding+border)左侧相对于**已定位的父容器**左上角的距离
 - offsetTop: 元素(包括内容+padding+border)上边相对于**已定位的父容器**左上角的距离

<br/>


## 元素的大小

1. document.querySelector("...").getBoundingClientRect()的返回值中的属性
 - width: 元素宽度(包括内容+padding+border)
 - height: 元素高度

2. document.querySelector("...")的相关属性
 - offsetWidth: 元素宽度(包括内容+padding+border)
 - offsetHeight: 元素高度(包括内容+padding+border)
 - clientWidth: 元素宽度(包括内容+padding)
 - clientHeight: 元素高度(包括内容+padding)

<br/>


## 滚动条相关

1. document.querySelector("...")的相关属性
 - scrollLeft: 元素内部子元素横向滚动距离
 - scrollTop: 元素内部子元素垂直滚动距离
 - scrollWidth: 元素内部子元素的总宽度，包括不可见部分
 - scrollHeight: 元素内部子元素的总高度，包括不可见部分

2. 全页面的滚动
 - 横向滚动距离：window.scrollX和window.pageXOffset（浏览器兼容性不同）
 - 纵向滚动距离：window.scrollY和window.pageYOffset（浏览器兼容性不同）

<br/>


## 事件的位置

1. event.clientX、event.clientY: 鼠标相对于浏览器窗口可视区域的X, Y坐标（窗口坐标），可视区域不包括工具栏和滚动条

2. event.offsetX、event.offsetY: 鼠标相对于事件源元素（触发事件的元素）的X, Y坐标

3. event.screenX、event.screenY: 鼠标相对于用户显示器屏幕左上角的X, Y坐标

<br/>


## 页面宽高

- window.screen.width: 电脑屏幕的宽度
- window.screen.height: 电脑屏幕的高度
- window.innerWidth: 浏览器展示页面的宽度
- window.innerHeight: 浏览器展示页面的高度度（不包括浏览器头部工具栏）
