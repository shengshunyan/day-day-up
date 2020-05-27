---
title: Flutter学习(7)flutter基础开发知识
date: 2020-05-27
keywords: dart, flutter, 移动端
cover: https://i.loli.net/2020/05/17/z5FJLBw7kjeYhgC.png
tags:
     - 移动端
---


{% note info no-icon %}
Flutter学习系列是自己学习Flutter的过程笔记
{% endnote %}

## flutter基础开发

开发flutter app所需要了解的一些基础知识
<br/>


## 手势检测

利用GestureDetector组件可以监听用户在屏幕上的手势，包括点击、双击、长按等，下面带大家看一个根据用户手势可以移动的小球的示例

GestureDetector组件的onPanUpdate参数可以监听用户的拖动，传入函数可以接收一个事件详情的参数，可以获取到用户手指滑动的上下左右距离，再实时更新小球的定位moveX，moveY

```dart
class MyPage extends StatefulWidget {
  @override
  _MyPageState createState() => _MyPageState();
}

class _MyPageState extends State<MyPage> {
  double moveX = 0, moveY = 0;

  @override
  Widget build(BuildContext context) {
    return FractionallySizedBox(
      widthFactor: 1,
      child: Stack(
        children: <Widget>[
          Positioned(
            left: moveX,
            top: moveY,
            child: GestureDetector(
              onPanUpdate: (e) => _doMove(e),
              child: Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                    color: Colors.amber,
                    borderRadius: BorderRadius.circular(36)),
              ),
            ),
          )
        ],
      ),
    );
  }

  _doMove(DragUpdateDetails e) {
    setState(() {
      moveX += e.delta.dx;
      moveY += e.delta.dy;
    });
  }
}
```

![May-27-2020-21-05-513c634fa502c9ec21.gif](https://file.moetu.org/images/2020/05/27/May-27-2020-21-05-513c634fa502c9ec21.gif)

<br/>


## 引用本地图片资源

Flutter中引入图片资源需要先在配置文件 pubspec.yaml 中添加资源的路径

![WX20200527-2119102xea88dbbd34b79c1a.png](https://file.moetu.org/images/2020/05/27/WX20200527-2119102xea88dbbd34b79c1a.png)

然后才能在代码中引用图片资源

```dart
Image(
  width: 100,
  height: 100,
  image: AssetImage('images/icon.jpg'),
)
```