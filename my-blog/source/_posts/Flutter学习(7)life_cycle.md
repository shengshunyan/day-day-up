---
title: Flutter学习(7)life_cycle
date: 2020-05-26
keywords: dart, flutter, 移动端
cover: https://s1.ax1x.com/2020/05/28/tZjPHI.png
tags:
     - 移动端
---


{% note info no-icon %}
Flutter学习系列是自己学习Flutter的过程笔记
{% endnote %}

## flutter生命周期函数

和react组件相似，flutter的组件也有生命周期函数，在组件的不同时期可以做相关的事情。不过除了组件的生命周期函数，flutter还有页面的生命周期函数。
<br/>


## 组件生命周期函数

StatelessWidget 的生命周期只有一个，那就是build

statefulWidget 的生命周期就相对较复杂

1. 初始化时期：
  - createState：构造函数，创建stateful widget时默认创建了
  - initState：插入到渲染树时调用，只执行一次。

2. 更新时期：
  - didChangeDependencies：1、在初始化initState后执行； 2、当State对象的依赖发生变化时会被调用；例如：在之前build() 中包含了一个InheritedWidget，然后在之后的build() 中InheritedWidget发生了变化，那么此时InheritedWidget的子widget的didChangeDependencies()回调都会被调用。InheritedWidget这个widget可以由父控件向子控件共享数据
  - build(每个widget都需要实现)：初始化之后开始绘制界面，当setState触发的时候会再次被调用
  - didUpdateWidget：上级节点rebuild widget时， 即上级组件状态发生变化时会触发子widget执行didUpdateWidget，有一个oldWidget参数，可以比较新旧值

3. 销毁时期：
  - deactivate：当State对象从树中被移除时，会调用此回调
  - dispose：在执行Navigator.pop后会调用该办法， 表示组件已销毁

<br/>
组件初始化：createState -> initState -> didChangeDependencies -> build
组件状态更新：build
组件移除：deactivate -> dispose
<br/>

示例代码
```dart
import 'package:flutter/material.dart';

class PageA extends StatefulWidget {
  @override
  _PageAState createState() => _PageAState();
}

class _PageAState extends State<PageA> {
  @override
  void initState() {
    print('initState');
    super.initState();
  }

  @override
  void didChangeDependencies() {
    print('didChangeDependencies');
    super.didChangeDependencies();
  }

  @override
  void didUpdateWidget(PageA oldWidget) {
    print('didUpdateWidget');
    super.didUpdateWidget(oldWidget);
  }

  @override
  void deactivate() {
    print('deactivate');
    super.deactivate();
  }

  @override
  void dispose() {
    print('dispose');
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    print('build');
    
    return MaterialApp(
      title: 'PageA',
      home: Scaffold(
          appBar: AppBar(
            title: Text('PageA'),
            leading: BackButton(
              onPressed: () {
                Navigator.pop(context);
              },
            ),
          ),
          body: Container(
            child: Column(
              children: <Widget>[
                Text('I am PageA'),
                RaisedButton(
                  child: Text('add $count'),
                  onPressed: _addCount,
                )
              ],
            ),
          )),
    );
  }

  int count = 0;

  void _addCount() {
    setState(() {
      count += 1;
    });
  }
}
```
<br/>


## 应用生命周期函数

flutter在组件中可以监听应用的生命周期函数，从而做相应的处理。

1. 组件需要mixin WidgetsBindingObserver 类
  ```dart
  class _PageAState extends State<PageA> with WidgetsBindingObserver
  ```
2. 在initState初始化时，添加监听器
  ```dart
  WidgetsBinding.instance.addObserver(this);
  ```
3. 重写监听函数，函数的参数state可以判别应用触发的生命周期
  ```dart
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    if (state == AppLifecycleState.paused) {
      print('App进入后台');
    } else if (state == AppLifecycleState.resumed) {
      print('App进入前台');
    } else if (state == AppLifecycleState.inactive) {
      print('App非活动状态');
    }
  }
  ```
4. 在dispose销毁时，也一起销毁监听器
  ```dart
  WidgetsBinding.instance.removeObserver(this);
  ```

```dart
import 'package:flutter/material.dart';

class PageA extends StatefulWidget {
  @override
  _PageAState createState() => _PageAState();
}

class _PageAState extends State<PageA> with WidgetsBindingObserver {
  @override
  void initState() {
    WidgetsBinding.instance.addObserver(this);
    super.initState();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    if (state == AppLifecycleState.paused) {
      print('App进入后台');
    } else if (state == AppLifecycleState.resumed) {
      print('App进入前台');
    } else if (state == AppLifecycleState.inactive) {
      print('App非活动状态');
    }
  }

  @override
  Widget build(BuildContext context) {
    print('build');

    return MaterialApp(
      title: 'PageA',
      home: Scaffold(
          appBar: AppBar(
            title: Text('PageA'),
            leading: BackButton(
              onPressed: () {
                Navigator.pop(context);
              },
            ),
          ),
          body: Container(
            child: Column(
              children: <Widget>[
                Text('I am PageA'),
              ],
            ),
          )),
    );
  }
}
```
<br/>


## 总结图例

最后放一张概括组件生命周期和应用生命周期的图例，便于记忆

![t188dP.png](https://s1.ax1x.com/2020/05/31/t188dP.png)