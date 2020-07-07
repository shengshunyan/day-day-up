---
title: Flutter学习(8)flutter基础开发知识
date: 2020-05-31
keywords: dart, flutter, 移动端
cover: https://s1.ax1x.com/2020/05/28/tZjPHI.png
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

{% note info no-icon %}
图片缓存可以用cached_network_image插件
{% endnote %}

<br/>


## Icon

### 内置icon
Material design内置的icon：https://material.io/resources/icons/?style=baseline

### 自定义Icon

1. 我们先构造一个类：
  ```dart
  const IconData(
    this.codePoint,//必填参数，fonticon对应的16进制Unicode {
    this.fontFamily,//字体库系列
    this.fontPackage,//字体在那个包中，不填仅在自己程序包中查找
    this.matchTextDirection: false,图标是否按照图标绘制方向显示
  });
  ```
2. 然后我们需要向使用字体一样，在pubspec.yaml中配置我们的icon
  ```yaml
  fonts:
    - family: devio
      fonts:
        - asset: fonts/devio.ttf
  ```
3. 代码中的使用
  ```dart
  child: new Icon(new IconData(0xf5566, fontFamily: "devio"), size: 100.0, color: Colors.blueAccent,)
  ```

<br/>


## 打开第三方应用

app内有些有打开其他app的需求，比如浏览器、地图等（需要搜索相关软件的schema，IOS和Android的不一样），可以利用dart包url_launcher提供的方法实现

{% note info no-icon %}
url_launcher包：https://pub.flutter-io.cn/packages/url_launcher
{% endnote %}

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    _launchURL() async {
      const url = 'https://flutter.cn';
      if (await canLaunch(url)) {
        await launch(url);
      } else {
        throw 'Could not launch $url';
      }
    }

    return MaterialApp(
      title: 'demo',
      home: Scaffold(
        appBar: AppBar(
          title: Text('demo'),
        ),
        body: Center(
          child: RaisedButton(
            onPressed: _launchURL,
            child: Text('Show Flutter homepage'),
          ),
        ),
      ),
    );
  }
}
```

![tecrKe.gif](https://s1.ax1x.com/2020/05/28/tecrKe.gif)

<br/>


## 全面屏适配

### 问题

1. 传统布局的高度不足，导致上下留黑边；

2. 基于屏幕顶部和底部的布局，如弹框，在全面屏上显示会发生位移；

3. 安全区域的问题。

![WX20200707-100739a663f1becdf41ed8.png](https://file.moetu.org/images/2020/07/07/WX20200707-100739a663f1becdf41ed8.png)


### 适配方案

1. 使用了Scaffold的appbar与bottomNavigationBar是不需要适配的，因为Scaffold框架会自动帮我们完成这些适配工；

2. 使用SafeArea来包裹页面，SafeArea是Flutter中的一个用于适配全面屏的组件，简单但是相较于第三点不灵活。类似于iOS中storyboard中的Safe Area Relative Margins和React Native的SafeAreaView；
![WX20200707-100044cb1d4ca8be860057.png](https://file.moetu.org/images/2020/07/07/WX20200707-100044cb1d4ca8be860057.png)

3. 借助MediaQuery.of(context).padding来获取屏幕四周的padding，然后根据padding自己手动实现对安全区域的控制（简单且灵活）。
![WX20200707-1001281e57b2c3ae8bb5fd.png](https://file.moetu.org/images/2020/07/07/WX20200707-1001281e57b2c3ae8bb5fd.png)

### android需要添加额外配置

在AndroidManifest.xml声明max_aspect值

由于全面屏手机的高宽比比之前大，如果不适配的话，Android默认为最大的宽高比是1.86，小于全面屏手机的宽高比，因此，在全面屏手机上打开部分App时，上下就会留有空间，显示为黑条。这样非常影响视觉体验，另外全面屏提供的额外空间也没有得以利用，因此，这样的应用需要做相关适配。

针对此问题，Android官方提供了适配方案，即提高App所支持的最大屏幕纵横比，实现起来也比较简单，在AndroidManifest.xml中做如下配置即可：

<meta-data android:name="android.max_aspect"  android:value="ratio_float"/>

其中ratio_float为浮点数，官方建议为2.1或更大，因为18.5：9=2.055555555……，如果日后出现纵横比更大的手机，此值将需要设为更大。

因此，建议开发者在自己App AndroidManifest的Application标签下面增加下面一段代码：

```html
<meta-data android:name="android.max_aspect" android:value="2.1" />
```

<br/>


## 项目优化

1. 代码优化
  - 封装冗余代码
2. 包大小
  - 压缩本地图片
  - 使用单架构so
3. 流畅性优化
  - 按需创建页面
  - 按需AutomaticKeepAliveClientMixin
  - 耗时的计算放到独立的Isolate
4. 内存优化
  - 图片优化：根据控件大小加载指定分辨率的图片
  - 分页加载
  - 使用ListView.build()来复用子控件，它会只创建可视区内的元素
  - 防止内存泄漏，dispose需要销毁的listener等