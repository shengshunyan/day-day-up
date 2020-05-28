---
title: Flutter学习(6)route
date: 2020-05-21
keywords: dart, flutter, 移动端
cover: https://s1.ax1x.com/2020/05/28/tZjPHI.png
tags:
     - 移动端
---


{% note info no-icon %}
Flutter学习系列是自己学习Flutter的过程笔记
{% endnote %}

## 路由

路由也是一个app不可或缺的一部分。当有多个不同的页面的，需要页面之间的跳转，就要用到路由了。

Flutter中的路由跳转有两种不同的方式：一种是引入页面的组件，直接导航到具体组件；一种是配置routes的路由名与页面组件之间的映射，然后跳转的时候指定相关路由名就能跳转到相关页面
<br/>


## 组件跳转

### 关键讲解

点击相关按钮，跳转指定页面

1. PageA是普通跳转
  ```dart
  Navigator.of(context).push(
    MaterialPageRoute(
      builder: (context) => SearchPage()
    )
  )
  ```

2. PageB是带参数的跳转：直接在实例化组件的时候传入相关参数
  ```dart
  Navigator.of(context).push(
    MaterialPageRoute(
      builder: (context) => Detail(id: 3,)
    )
  )
  ```

### 完整示例

/lib/main.dart
```dart
import 'package:flutter/material.dart';
import './PageA.dart';
import './PageBWithParam.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'demo',
      home: Scaffold(
        appBar: AppBar(
          title: Text('demo'),
        ),
        body: Body(),
      ),
    );
  }
}

class Body extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        RaisedButton(
          child: Text('跳到PageA页面'),
          onPressed: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => SearchPage()
              )
            );
          },
          color: Theme.of(context).accentColor,
          textTheme: ButtonTextTheme.primary,
        ),
        RaisedButton(
          child: Text('跳到PageB页面'),
          onPressed: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => Detail(id: 3,)
              )
            );
          },
          color: Theme.of(context).accentColor,
          textTheme: ButtonTextTheme.primary,
        ),
      ],
    );
  }
}
```

/lib/PageA.dart
```dart
import 'package:flutter/material.dart';

class SearchPage extends StatelessWidget {
  const SearchPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Scaffold(
        appBar: AppBar(
          title: Text('PageA'),
        ),
        body: Text('PageA'),
      ),
    );
  }
}
```

/lib/PageBWithParam.dart
```dart
import 'package:flutter/material.dart';

class Detail extends StatelessWidget {
  final int id;
  const Detail({Key key, this.id = 1}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('PageBWithParam'),
      ),
      body: Container(
        child: Text('PageBWithParam，id：${this.id}'),
      ),
    );
  }
}
```

![14b784fb677df2ed5.gif](https://file.moetu.org/images/2020/05/22/14b784fb677df2ed5.gif)
<br/>


## 路由名跳转

### 关键讲解

点击相关按钮，跳转指定页面

1. MaterialApp组件下的routes属性可以定义app的路由
  ```dart
  routes: {
    '/pageA': (context) => PageA(),
    '/pageB': (context) => PageBWithParam(),
  },
  ```

2. PageA是普通跳转
  ```dart
  Navigator.pushNamed(context, '/pageA');
  ```

3. PageB是带参数的跳转：参数需要通过arguments传递；ArgumentsType是PageBWithParam页面中定义的参数的类，相当于组件的参数接口
  ```dart
  Navigator.pushNamed(context, '/pageB', arguments: ArgumentsType(id: 3));
  ```
  ```dart
  // PageBWithParam.dart 
  // 定义参数类型
  class ArgumentsType {
    final int id;
    ArgumentsType({ this.id });
  }
  // 接收参数
  final ArgumentsType args = ModalRoute.of(context).settings.arguments;
  ```

### 完整示例

/lib/main.dart
```dart
import 'package:flutter/material.dart';
import './PageA.dart';
import './PageBWithParam.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'demo',
      routes: {
        '/pageA': (context) => PageA(),
        '/pageB': (context) => PageBWithParam(),
      },
      home: Scaffold(
        appBar: AppBar(
          title: Text('demo'),
        ),
        body: Body(),
      ),
    );
  }
}

class Body extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        RaisedButton(
          child: Text('跳到PageA页面'),
          onPressed: () {
            Navigator.pushNamed(context, '/pageA');
          },
          color: Theme.of(context).accentColor,
          textTheme: ButtonTextTheme.primary,
        ),
        RaisedButton(
          child: Text('跳到PageB页面'),
          onPressed: () {
             Navigator.pushNamed(context, '/pageB', arguments: ArgumentsType(id: 3),);
          },
          color: Theme.of(context).accentColor,
          textTheme: ButtonTextTheme.primary,
        ),
      ],
    );
  }
}
```

/lib/PageA.dart
```dart
import 'package:flutter/material.dart';

class SearchPage extends StatelessWidget {
  const SearchPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Scaffold(
        appBar: AppBar(
          title: Text('PageA'),
        ),
        body: Text('PageA'),
      ),
    );
  }
}
```

/lib/PageBWithParam.dart
```dart
import 'package:flutter/material.dart';

// 参数类型
class ArgumentsType {
  final int id;
  ArgumentsType({ this.id });
}

class PageBWithParam extends StatelessWidget {
  static String routeName = '/detail';

  const PageBWithParam({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // 接收参数
    final ArgumentsType args = ModalRoute.of(context).settings.arguments;

    return Scaffold(
      appBar: AppBar(
        title: Text('详情页'),
      ),
      body: Container(
        child: Text('这是详情页，id：${args.id}'),
      ),
    );
  }
}
```

![14b784fb677df2ed5.gif](https://file.moetu.org/images/2020/05/22/14b784fb677df2ed5.gif)
<br/>
