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

![1.png](https://i.loli.net/2020/05/18/JdoOLW5x2uADeNQ.png)
<br/>


## Container

Container是非常常用的一个widget，一般是用作一个容器，类似html的div标签

基础属性：width，height，color，child

```dart
Container(
  child: new Text(
    'hello Imooc',
    style: TextStyle(
      fontSize: 40.0,
    ),
  ),
  alignment: Alignment.centerLeft,
  width: 300.0,
  height: 400.0,
  padding: const EdgeInsets.fromLTRB(10.0, 30.0, 0.0, 0.0),
  margin: const EdgeInsets.all(10.0),
  decoration: BoxDecoration(
    color: Colors.lightBlue,
    border: Border.all(
      color: Colors.blue,
      width: 2.0,
    ),
    borderRadius: BorderRadius.all(
      Radius.circular(10),
    )
  ),
)
```

![2.png](https://i.loli.net/2020/05/18/pBXwOyo8KFMsvQU.png)
<br/>


## Button

Flutter 的 Button 有好几种类型
  - RaisedButton: 凸起的按钮 
  - FlatButton：扁平化按钮 
  - OutlineButton：带边框按钮 
  - IconButton：带图标按钮

```dart
Column(children: <Widget>[
  RaisedButton(
    child: Text("我是 RaiseButton"),
    onPressed: () {},
  ),
  FlatButton(
    child: Text("我是 FlatButton"),
    color: Colors.blue,
    onPressed: () {},
  ),
  OutlineButton(
    child: Text("我是 OutlineButton"),
    textColor: Colors.blue,
    onPressed: () {},
  ),
  IconButton(
    icon: Icon(Icons.add),
    onPressed: () {},
  )
]),
```

![3.png](https://i.loli.net/2020/05/18/uoRyG3x9KrOw4LF.png)
<br/>


## Image

1. 网络图片加载：使用NetworkImage，可以做网络图片的加载

  ```dart
  Container(
    child: new Image.network(
      'https://img4.mukewang.com/szimg/59b8a486000107fb05400300.jpg',
      scale: 2.0,
      // fit: BoxFit.cover,
      repeat: ImageRepeat.repeat,
    ),
    width: 400.0,
    height: 300.0,
    color: Colors.lightBlue,
  )
  ```

  ![4.png](https://i.loli.net/2020/05/18/z31ljhWd2Z8C5MB.png)

2. 本地图片引入需要配置pubspec.yaml文件，使用AssetImage类

<br/>


## ListView

1. 横向列表

  ```dart
  ListView(
    children: <Widget>[
      ListTile(
        leading: Icon(Icons.border_right),
        title: Text('border_right'),
        subtitle: Text('中华天气网中华天气网中华天气网中华天气网'),
      ),
      ListTile(
        leading: Icon(Icons.android),
        title: Text('android'),
      ),
      ListTile(
        leading: Icon(Icons.arrow_back_ios),
        title: Text('arrow_back_ios'),
      ),
      Image.network('https://img4.mukewang.com/szimg/59b8a486000107fb05400300.jpg'),
      Image.network('https://img1.mukewang.com/5cfdd215089d136306000338-240-135.jpg'),
    ],
  )
  ```

  ![5.png](https://i.loli.net/2020/05/18/nyQPvDGMafoq1HZ.png)

2. 纵向列表

scrollDirection属性可以设置列表主轴方向

  ```dart
  ListView(
    scrollDirection: Axis.horizontal,
    children: <Widget>[
      new Container(
        width: 180.0,
        color: Colors.lightBlue,
      ),
      new Container(
        width: 180.0,
        color: Colors.amber,
      ),
      new Container(
        width: 180.0,
        color: Colors.deepOrange,
      ),
      new Container(
        width: 180.0,
        color: Colors.deepPurpleAccent,
      ),
    ],
  )
  ```

  ![6.png](https://i.loli.net/2020/05/18/LwAcojVP75Earku.png)

3. 动态列表

  ```dart
  class MyApp extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
      List<String> items = ['1', '2', '3'];

      return MaterialApp(
        title: 'List view widget',
        home: Scaffold(
          appBar: AppBar(
            title: Text('List view widget'),
          ),
          body: new ListView.builder(
            itemCount: items.length,
            itemBuilder: (context, index) {
              return new ListTile(
                title: new Text('${items[index]}'),
              );
            },
          )
        ),
      );
    }
  }
  ```
<br/>


## AspectRatio 可设置宽高比

AspectRatio组件的宽度和父容器一致，再按照宽高比展示高度

```dart
AspectRatio(
  aspectRatio: 3.0/1.0,
  child: Container(
    color: Colors.red,
  ),
)
```

![4.png](https://i.loli.net/2020/05/19/kzgMJ9IsFd1xO7c.png)
<br/>


## Card

card是常用的卡片信息展示组件

```dart
ListView(
  children: <Widget>[
    Card(
      margin: EdgeInsets.all(10),
      child: Column(
        children: <Widget>[
          AspectRatio(
            aspectRatio: 20/9,
            child: Image.network(
              'https://img1.mukewang.com/szimg/5ad05dc00001eae705400300.jpg',
              fit: BoxFit.cover,
            ),
          ),
          ListTile(
            leading: CircleAvatar(
              backgroundImage: NetworkImage('https://img1.mukewang.com/szimg/5ad05dc00001eae705400300.jpg'),
            ),
            title: Text('XX'),
            subtitle: Text('XXXXXX'),
          ),
        ],
      ),
    ),
  ],
)
```

![5.png](https://i.loli.net/2020/05/19/qJMLAn2Wf96UiZp.png)
<br/>