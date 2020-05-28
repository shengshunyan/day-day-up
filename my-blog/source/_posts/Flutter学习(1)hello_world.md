---
title: Flutter学习(1)hello_world
date: 2020-05-16
keywords: dart, flutter, 移动端
cover: https://s1.ax1x.com/2020/05/28/tZjPHI.png
tags:
     - 移动端
---


{% note info no-icon %}
Flutter学习系列是自己学习Flutter的过程笔记
{% endnote %}

## Flutter简介

Flutter 是 Google 开源的 UI 工具包，帮助开发者通过一套代码库高效构建多平台精美应用，支持移动、Web、桌面和嵌入式平台。

Flutter 可以方便的加入现有的工程中。在全世界，Flutter 正在被越来越多的开发者和组织使用，并且 Flutter是完全免费、开源的。它也是构建未来的 Google Fuchsia 应用的主要方式。

Flutter 组件采用现代响应式框架构建，这是从React中获得的灵感，中心思想是用组件(widget)构建你的UI。 组件描述了在给定其当前配置和状态时他们显示的样子。当组件状态改变，组件会重构它的描述(description)，Flutter 会对比之前的描述， 以确定底层渲染树从当前状态转换到下一个状态所需要的最小更改。
<br/>


## 移动端跨平台技术对比

几种移动端跨平台技术的对比

### H5 + 原生APP

优点： 技术门槛最低，接入速度最快，热更新最方便的，自然就是H5方式。APP中提供一个Webview使用H5页面的Http直连。APP和H5可以相互独立开发，JS使用Bridge与原生进行数据通信，显示界面依赖Webview的浏览器渲染。

缺点：因为是需要远程直连，那么初次打开H5页面，会有瞬间的白屏，并且Webview本身会有至少几十M的内存消耗。首次的瞬间白屏和内存，Bridge的通信效率低下，始终是被技术框架给局限住了。

### RN & Weex

优点：使用原生去解析RN、Weex的显示配置，显示层、逻辑层都直接与原生数据通信。 因为抛弃了浏览器，自然渲染性能、执行性能都提升了一大截。

缺点：每次遇到显示的变更，JS都还会通过Bridge和原生转一道再做渲染的调整，所以Bridge就最后成为了性能的瓶颈。在实际项目中，特别是做一些大量复杂动画处理的时候，由于渲染部分需要频繁通信，性能问题变得尤为突出。

### Flutter

为了达到极致性能，Flutter更前进了一步，Flutter代码编译完成以后，直接就是原生代码，并且使用自绘UI引擎原生方式做渲染。

Flutter依赖一个Skia 2D图形化引擎。Skia也是Android平台和Chrome的底层渲染引擎，所以性能方面完全不用担心。

因为使用Dart做AOT编译成原生，自然也比使用解释性的JS在V8引擎中执行性能更快。

并且因为去掉Bridge，没有了繁琐的数据通信和交互，性能就更前进了一步。
<br/>


## Hello World

1. 按照之前[教程](https://www.shengshunyan.xyz/2019/05/30/flutter%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA/)配置完flutter开发环境之后，直接使用命令创建项目

  ```bash
  flutter create [project name]
  ```

2. 修改项目初始代码 /lib/main.dart
  - MaterialApp: 是我们app开发中常用的符合MaterialApp Design设计理念的入口Widget
  - Scaffold: 是Flutter的页面脚手架，你可以当HTML页面一样去理解，不同的是，他除了Body以外，还提供appBar顶部TitleBar、bottomNavigationBar底部导航栏等属性

  ```dart
  import 'package:flutter/material.dart';

  void main() => runApp(MyApp());

  class MyApp extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
      return MaterialApp(
        title: 'Welcome to  Flutter',
        home: Scaffold(
          appBar: AppBar(
            title: Text('Hello world'),
          ),
          body: Center(
            child: Text('hello world!'),
          ),
        ),
      );
    }
  }
  ```

3. 打开终端模拟器

  ```bash
  open -a Simulator
  ```

4. 运行flutter示例项目，查看 hello world app展示效果

  ```bash
  cd my_app
  flutter run
  ```