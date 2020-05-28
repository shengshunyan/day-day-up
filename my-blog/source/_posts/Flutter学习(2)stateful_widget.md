---
title: Flutter学习(2)stateful_widget
date: 2020-05-17
keywords: dart, flutter, 移动端
cover: https://s1.ax1x.com/2020/05/28/tZjPHI.png
tags:
     - 移动端
---


{% note info no-icon %}
Flutter学习系列是自己学习Flutter的过程笔记
{% endnote %}

## 状态组件

组件分类：
  - StatelessWidget：无状态变更，UI静态固化的Widget， 页面渲染性能更高。 
  - StatefulWidget：因状态变更可以导致UI变更的的Widget，涉及到数据渲染场景，都使用StatefulWidget。

在StatefulWidget里，因为要维护状态，他的生命周期比StatelessWidget更复杂，每次执行setState，都会触发 window.scheduleFrame() 导致整个页面的widget被刷新，性能就会降低。

## 代码示例

状态组件(继承自StatefulWidget)，类中的实例变量就是state
```dart
int num = 0;
```

方法中调用setState即可更新state，导致页面刷新
```dart
onPressed: () {
  setState(() {
    this.num++;
  });
},
```

demo
```dart
class MyStatefulPage extends StatefulWidget {
  @override
  _MyStatefulPageState createState() => _MyStatefulPageState();
}

class _MyStatefulPageState extends State<MyStatefulPage> {
  // state
  int num = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        SizedBox(height: 200,),
        Chip(
          label: Text('${this.num}'),
        ),
        SizedBox(height: 20,),
        RaisedButton(
          child: Text('按钮'),
          onPressed: () {
            // change state to refresh page
            setState(() {
              this.num++;
            });
          },
        )
      ],
    );
  }
}
```

![6.png](https://i.loli.net/2020/05/19/wOxBu9epQYNM8WX.png)