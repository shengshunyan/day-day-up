---
title: Flutter学习(3)common_widget
date: 2020-05-18
keywords: dart, flutter, 移动端
cover: https://s1.ax1x.com/2020/05/28/tZjPHI.png
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
  - Scaffold组件下的floatingActionButton可是设置界面上浮动的按钮，floatingActionButtonLocation可以设置按钮的位置
  ```dart
  floatingActionButton: FloatingActionButton(
    child: Icon(Icons.add),
    onPressed: () {},
  ),
  floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
  ```

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


## TextField

html中的输入框组件在flutter中是TextField组件，一下列举了几种常见的输入框

```dart
Column(
  children: <Widget>[
    // 普通输入框
    TextField(),

    SizedBox(height: 10),

    // 多行输入框
    TextField(
      maxLines: 4,
      decoration: InputDecoration(
        hintText: "请输入内容",
        border: OutlineInputBorder(),
      ),
    ),

    SizedBox(height: 10),

    // 密码框
    TextField(
      obscureText: true,
    ),

    SizedBox(height: 10),
    
    // 带标签的输入框
    TextField(
      decoration: InputDecoration(
        labelText: '用户名',
      ),
    ),

    SizedBox(height: 10),

    // 带图标的输入框
    TextField(
      decoration: InputDecoration(
        icon: Icon(Icons.home),
      ),
    ),
  ],
)
```

![4.png](https://i.loli.net/2020/05/21/9IuvFPK4prbXCRl.png)

Input组件状态控制：TextField组件的onChanged函数可以监听输入框值的变化

```dart
class InputController extends StatefulWidget {
  InputController({Key key}) : super(key: key);
  _InputControllerState createState() => _InputControllerState();
}

class _InputControllerState extends State<InputController> {
  var userName;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        TextField(
          onChanged: (value) {
            setState(() {
              this.userName = value;
            });
          },
        ),
        RaisedButton(
          child: Text('提交'),
          onPressed: () {
            print(this.userName);
          },
        ),
      ],
    );
  }
}
```
<br/>


## Checkbox

Checkbox组件以及状态控制

```dart
class CheckboxComponeng extends StatefulWidget {
  CheckboxComponeng({Key key}) : super(key: key);
  _CheckboxComponengState createState() => _CheckboxComponengState();
}

class _CheckboxComponengState extends State<CheckboxComponeng> {
  bool flag = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('checkbox'),
      ),
      body: Wrap(
        children: <Widget>[
          Checkbox(
            value: this.flag,
            onChanged: (value) {
              setState(() {
                this.flag = value;
              });
            },
          ),
          CheckboxListTile(
            value: this.flag,
            onChanged: (value) {
              setState(() {
                this.flag = value;
              });
            },
            title: Text('一级标题'),
            subtitle: Text('二级标题'),
            secondary: Icon(Icons.help),
          ),
        ],
      ),
    );
  }
}
```

![5.png](https://i.loli.net/2020/05/21/Uia8AHQM7x5zBO1.png)
<br/>


## Radio

Radio组件以及状态控制

```dart
class RadioComponeng extends StatefulWidget {
  RadioComponeng({Key key}) : super(key: key);
  _RadioComponengState createState() => _RadioComponengState();
}

class _RadioComponengState extends State<RadioComponeng> {
  int sex = 1;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('radio'),
      ),
      body: Wrap(
        children: <Widget>[
          Text('男'),
          Radio(
            value: 1,
            groupValue: this.sex,
            onChanged: (value) {
              setState(() {
                this.sex = value;
              });
            },
          ),
          Text('女'),
          Radio(
            value: 2,
            groupValue: this.sex,
            onChanged: (value) {
              setState(() {
                this.sex = value;
              });
            },
          ),
          
          RadioListTile(
            value: 1,
            groupValue: this.sex,
            onChanged: (value) {
              setState(() {
                this.sex = value;
              });
            },
            selected: this.sex == 1,
            title: Text('男'),
            subtitle: Text('性别'),
            secondary: Icon(Icons.help),
          ),
          RadioListTile(
            value: 2,
            groupValue: this.sex,
            onChanged: (value) {
              setState(() {
                this.sex = value;
              });
            },
            selected: this.sex == 2,
            title: Text('女'),
            subtitle: Text('性别'),
            secondary: Icon(Icons.help),
          ),
        ],
      ),
    );
  }
}
```

![6.png](https://i.loli.net/2020/05/21/9L5tmwkRB61IVEl.png)
<br/>


## Switch

Switch组件以及状态控制

```dart

class SwitchComponeng extends StatefulWidget {
  SwitchComponeng({Key key}) : super(key: key);
  _SwitchComponengState createState() => _SwitchComponengState();
}

class _SwitchComponengState extends State<SwitchComponeng> {
  bool flag = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('radio'),
      ),
      body: Wrap(
        children: <Widget>[
          Switch(
            value: this.flag,
            onChanged: (value) {
              setState(() {
                this.flag = value;
              });
            },
          ),
        ],
      ),
    );
  }
}
```

![7f4c9aca637a4849c.png](https://file.moetu.org/images/2020/05/21/7f4c9aca637a4849c.png)
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