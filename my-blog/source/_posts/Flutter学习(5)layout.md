---
title: Flutter学习(5)layout
date: 2020-05-20
keywords: dart, flutter, 移动端
cover: https://s1.ax1x.com/2020/05/28/tZjPHI.png
tags:
     - 移动端
---


{% note info no-icon %}
Flutter学习系列是自己学习Flutter的过程笔记
{% endnote %}

## 布局组件

要绘制一个完整的页面，你就必须得学会如何布局；

学习完Flutter中的一些常见组件之后，我们一起来看下它的布局写法；
<br/>


## Row & Column & Center & Wrap 行列轴布局

字面意义也很好理解，行布局、列布局、居中布局，这些布局对于Flutter来说，也都是一个个的widget。

区别在于，row、column、Wrap 是有多个children的widget， 而Center是只有 1个child的 widget。

row组件是单行排列，Wrap是可以自动换行的

1. Row
  - mainAxisAlignment 可以调整主轴(X轴)的排列方式
  - crossAxisAlignment 可以调整交叉轴(Y轴)的对齐方式
  
  ```dart
  Container(
    width: 400.0,
    height: 600.0,
    color: Colors.pink,
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: <Widget>[
        Icon(Icons.search, size: 32, color: Colors.white,),
        Icon(Icons.home, size: 32, color: Colors.white,),
        Icon(Icons.select_all, size: 32, color: Colors.white,),
      ],
    ),
  )
  ```

  ![7.png](https://i.loli.net/2020/05/18/96tDof4zcJSbWjx.png)

2. Column
  - mainAxisAlignment 可以调整主轴(Y轴)的排列方式
  - crossAxisAlignment 可以调整交叉轴(X轴)的对齐方式

  ```dart
  Container(
    width: 400.0,
    height: 600.0,
    color: Colors.pink,
    child: Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: <Widget>[
        Icon(Icons.search, size: 32, color: Colors.white,),
        Icon(Icons.home, size: 32, color: Colors.white,),
        Icon(Icons.select_all, size: 32, color: Colors.white,),
      ],
    ),
  )
  ```

  ![8.png](https://i.loli.net/2020/05/18/YolwcduNpVH25iF.png)

3. Center
  - 居中展示元素

  ```dart
  Container(
    height: 400,
    width: 300,
    color: Colors.pink,
    child: Center(child: Text('I am in center'),)
  )
  ```

  ![9.png](https://i.loli.net/2020/05/18/RKpVJmHLF4BvAnr.png)

4. Wrap
  - spacing 横向间距
  - alignment 横向排列方式
  - runSpacing 纵向间距
  - runAlignment 纵向排列方式
  
  ```dart
  Container(
    height: 400,
    width: 300,
    color: Colors.pink,
    child: Wrap(
      spacing: 10,
      alignment: WrapAlignment.end,
      runSpacing: 10,
      runAlignment: WrapAlignment.spaceAround,
      children: <Widget>[
        RaisedButton(child: Text('第1集'), onPressed: null,),
        RaisedButton(child: Text('第2集第2集'), onPressed: null,),
        RaisedButton(child: Text('第3集'), onPressed: null,),
        RaisedButton(child: Text('第4集'), onPressed: null,),
        RaisedButton(child: Text('第5集第5集第5集'), onPressed: null,),
        RaisedButton(child: Text('第6集'), onPressed: null,),
        RaisedButton(child: Text('第7集'), onPressed: null,),
        RaisedButton(child: Text('第8集'), onPressed: null,),
        RaisedButton(child: Text('第9集'), onPressed: null,),
        RaisedButton(child: Text('第10集'), onPressed: null,),
      ],
    ),
  )
  ```

  ![10.png](https://i.loli.net/2020/05/18/WMGnQTkfIjtUVN8.png)

<br/>


## Align 角定位布局

在Container里，如果需要将内容显示在左上角，左下角，右上角，右下角，可以依赖Align 这个定位的Widget

Align还可以以 alignment: Alignment(0.1, 0) 的形式定位，更细粒度

```dart
Container(
  color: Colors.blue,
  width: 300,
  height: 200,
  child: Align(
    alignment: Alignment.bottomRight,
    child: Text("Hello Align ",
        style: TextStyle(fontSize: 20, color: Colors.white)),
  ));
```

![1.png](https://i.loli.net/2020/05/19/VCesfR8HJpZDxXl.png)
<br/>


## Stack & Positioned 绝对定位

这在css里，使用 position：absolute; 可以进行灵活得定位；在flutter里，借助stack+ positioned两个widget的组合能实现相同的效果。

```dart
Container(
  height: 400,
  width: 300,
  color: Colors.red,
  child: Stack(
    children: <Widget>[
      Positioned(
        top: 20,
        right: 10,
        child: Icon(Icons.home, size: 40, color: Colors.white)
      ),
      Positioned(
        right: 0,
        bottom: 0,
        child: Icon(Icons.send, size: 40, color: Colors.white,),
      ),
    ],
  ),
)
```

![2.png](https://i.loli.net/2020/05/19/WOTURb4KnMcjxIs.png)
<br/>


## Flex & Expanded 流式布局

类似前端的flex布局。

Row，Column，其实都是继承自Flex，也属于流式布局，children内也能使用Expanded组件。如果轴向不确定，使用Flex，通过修改direction的值设定轴向 如果轴向已确定，使用Row，Column，布局更简洁，更有语义化。

```dart
Flex(
  direction: Axis.horizontal,
  children: <Widget>[
    Container(
      width: 30,
      height: 100,
      color: Colors.blue,
    ),
    Expanded(
      flex: 1,
      child: Container(
        height: 100.0,
        color: Colors.red,
      ),
    ),
    Expanded(
      flex: 1,
      child: Container(
        height: 100.0,
        color: Colors.green,
      ),
    ),
  ],
)
```

![3.png](https://i.loli.net/2020/05/19/8ULeBN2kP9AaduF.png)