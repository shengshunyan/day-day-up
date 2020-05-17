---
title: Flutter学习(2)common_widget
date: 2020-05-17
keywords: dart, flutter, 移动端
cover: https://i.loli.net/2020/05/17/z5FJLBw7kjeYhgC.png
tags:
     - 移动端
---


{% note info no-icon %}
Flutter学习系列是自己学习Flutter的过程笔记
{% endnote %}

## 常用组件

Flutter提供了很多默认的组件，而每个组件的都继承自widget 。 在Flutter眼里：一切都是widget。 

widget，作为可视化的UI组件，包含了显示UI、功能交互两部分。大的widget，也可以由多个小的widget组合而成。
<br/>


## Text

Text的样式，来自另一个widget：TextStyle。 而TextStyle里的color，又是另一个widget Color的实例。

```dart
Text(
  '你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁你是谁',
  textAlign: TextAlign.left,
  // maxLines: 2,
  // overflow: TextOverflow.ellipsis,
  style: TextStyle(
    fontSize: 25.0,
    color: Color.fromARGB(255, 255, 150, 150),
    decoration: TextDecoration.underline,
    decorationStyle: TextDecorationStyle.solid,
  ),
)
```
