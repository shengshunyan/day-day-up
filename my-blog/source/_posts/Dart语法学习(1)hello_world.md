---
title: Dart语法学习(1)hello_world
date: 2020-05-02
keywords: dart, flutter, 移动端
cover: https://s1.ax1x.com/2020/05/28/tZj62D.png
tags:
     - 移动端
---


{% note info no-icon %}
Dart语法学习系列是自己学习dart的过程笔记
{% endnote %}

## Dart简介

Dart是由谷歌开发的计算机编程语言,它可以被用于web、服务器、移动应用 和物联网等领域的开发。

Dart诞生于2011年，号称要取代JavaScript。但是过去的几年中一直不温不火。直到Flutter的出现现在被人们重新重视。

要学Flutter的话我们必须首先得会Dart。
<br/>

## 开发环境搭建

1. Dart官网下载安装Dart SDK

2. 作者选用的是VS Code作为开发工具，然后下载Code Runner插件

3. 在代码文件中右键，点击run code，即可运行dart代码
<br/>

## hello world示例程序

1. 代码：main函数是dart程序的入口
```dart
// 程序入口
void main() {
  // 控制台打印
  print("Hello world!");
}
```
2. 运行结果
```bash
$ dart "/Users/guoshi/Desktop/flutter-learning/dart-learn/chapter1 hello/hello_world.dart"
Hello world!
```
<br/>
