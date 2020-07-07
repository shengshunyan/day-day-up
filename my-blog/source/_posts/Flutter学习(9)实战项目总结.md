---
title: Flutter学习(9)实战项目总结
date: 2020-07-03
keywords: dart, flutter, 移动端
cover: https://s1.ax1x.com/2020/05/28/tZjPHI.png
tags:
     - 移动端
---


{% note info no-icon %}
Flutter学习系列是自己学习Flutter的过程笔记
{% endnote %}

## flutter项目实战

学习完基础知识之后，通过一个旅游的demo app来实践flutter的开发技能

项目代码地址：https://github.com/shengshunyan/my_flutter_app.git

<br/>


## 项目结构

1. images/ 存放项目图片

2. pubspec.yaml 项目配置文件（依赖保，静态资源配置等）

3. lib/ 项目代码
  - model/ 接口的数据模型
  - dao/ 获取接口数据的服务层
  - pages/ 页面模块
  - widget/ 公共组件
  - util/ 公共方法
  - navigator/ 导航
  - main.dart 主入口文件

<br/>


## 导航

1. 用PageView组件来控制页面模块的切换，PageView组件有相关的优化

```dart
Scaffold(
  body: PageView(
    controller: _controller,
    children: <Widget>[
      HomePage(),
      SearchPage(hideLeft: true,),
      TravelPage(),
      MyPage(),
    ],
    physics: NeverScrollableScrollPhysics(),
  ),
  bottomNavigationBar: BottomNavigationBar(
    currentIndex: _currentIndex,
    onTap: (index) {
      setState(() {
        _currentIndex = index;
      });
      _controller.jumpToPage(index);
    },
    type: BottomNavigationBarType.fixed,
    items: [
      _bottomItem('首页', Icons.home, 0),
      _bottomItem('搜索', Icons.search, 1),
      _bottomItem('旅拍', Icons.camera_alt, 2),
      _bottomItem('我的', Icons.account_circle, 3),
    ],
  ),
);
```

<br/>


## 首页

1. MediaQuery.removePadding可用于移除ListView顶部预设的padding
  ```dart
  MediaQuery.removePadding(
    context: context,
    removeTop: true,
    child: ...
  }
  ```

2. RefreshIndicator组件可实现下拉刷新功能
  ```dart
  RefreshIndicator(
    onRefresh: loadData,
    child: ...
  )
  ```

3. NotificationListener组件可以监听页面的上下滚动
  ```dart
  NotificationListener(
    onNotification: (scrollNotification) {
      // ...
    },
    child: ...,
  )
  ```

4. ListView组件可以用于一个从上到下的模块内容展示
  ```dart
  ListView(
      children: <Widget>[
        widget_1,
        widget_2,
      ]
  )
  ```

5. 页面的跳转
  ```dart
  Navigator.push(context, MaterialPageRoute(builder: (context) {
    return SpeakPage();
  }));
  ```

6. 根据loading状态，展示页面加载中样式
  ```dart
  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Center(
        child: CircularProgressIndicator(),
      );
    }

    return child;
  }
  ```

7. GestureDetector组件用于监听用户行为，比如点击
  ```dart
  GestureDetector(
    onTap: () {
      // ...
    },
    child: ...
  ```

8. Row用于横向展示元素，Column用于竖向展示元素（很常用）

9. 实现了一个WebView组件，用于app直接跳转h5页面，可以设置头部
  ```dart
  WebView(
    url: model.url,
    statusBarColor: model.statusBarColor,
    title: model.title,
    hideAppBar: model.hideAppBar,
  ));
  ```

![Jul-07-2020-20-35-1702891cca370b5569.gif](https://file.moetu.org/images/2020/07/07/Jul-07-2020-20-35-1702891cca370b5569.gif)

<br/>


## 搜索及语音页

1. 继承自AnimatedWidget组件，实现了一个语音按钮的动画组件AnimatedMic
  ```dart
  const double MIC_SIZE = 80;

  class AnimatedMic extends AnimatedWidget {
    static final _opacityTween = Tween<double>(begin: 1, end: 0.5);
    static final _sizeTween = Tween<double>(begin: MIC_SIZE, end: MIC_SIZE - 20);

    AnimatedMic({Key key, Animation<double> animation})
        : super(key: key, listenable: animation);

    @override
    Widget build(BuildContext context) {
      final Animation<double> animation = listenable;
      return Opacity(
        opacity: _opacityTween.evaluate(animation),
        child: Container(
          height: _sizeTween.evaluate(animation),
          width: _sizeTween.evaluate(animation),
          decoration: BoxDecoration(
            color: Colors.blue,
            borderRadius: BorderRadius.circular(MIC_SIZE / 2),
          ),
          child: Icon(
            Icons.mic,
            color: Colors.white,
            size: 30,
          ),
        ),
      );
    }
  }
  ```

![WX20200707-204022be7cf88b6262d6e6.png](https://file.moetu.org/images/2020/07/07/WX20200707-204022be7cf88b6262d6e6.png)

![Jul-07-2020-20-41-16eca7d2de29b5384b.gif](https://file.moetu.org/images/2020/07/07/Jul-07-2020-20-41-16eca7d2de29b5384b.gif)

<br/>


## 旅拍

1. 利用TabBar组件实现一个头部横向的tab切换功能
  ```dart
  TabBar(
    controller: _controller,
    isScrollable: true,
    labelColor: Colors.black,
    labelPadding: EdgeInsets.fromLTRB(20, 0, 10, 5),
    indicator: UnderlineTabIndicator(
        borderSide: BorderSide(
          color: Color(0xff2fcfbb),
          width: 3,
        ),
        insets: EdgeInsets.only(bottom: 10)),
    tabs: tabs.map<Tab>((TravelTab tab) {
      return Tab(
        text: tab.labelName,
      );
    }).toList()
  )
  ```

2. 没有预设宽度/高度时，Flexible组件可以使Row、Column、Flex等子组件在主轴方向有填充可用空间的能力，但是不强制子组件填充可用空间。
  ```dart
  Flexible(
    child: ...
  )
  ```

3. flutter_staggered_grid_view库的组件StaggeredGridView可用于grid布局的实现（瀑布流）；还可利用controller属性监听上拉事件来实现上拉到底部加载更多；mixin AutomaticKeepAliveClientMixin组件来保持缓存各个tab页；
  ```dart
  class TravelTabPage extends StatefulWidget {
    @override
    _TravelTabPageState createState() => _TravelTabPageState();
  }

  // 缓存各个tab页的内容(1) AutomaticKeepAliveClientMixin mixin
  class _TravelTabPageState extends State<TravelTabPage>
      with AutomaticKeepAliveClientMixin {
    // 用于上拉加载更多
    ScrollController _scrollController = ScrollController();

    @override
    void initState() {
      _loadData();
      // 上拉加载更多
      _scrollController.addListener(() {
        if (_scrollController.position.pixels == _scrollController.position.maxScrollExtent) {
          _loadData(loadMore: true);
        }
      });
      super.initState();
    }

    @override
    Widget build(BuildContext context) {
      return Scaffold(
        body: StaggeredGridView.countBuilder(
          controller: _scrollController,
          crossAxisCount: 4,
          itemCount: travelItems?.length ?? 0,
          itemBuilder: (BuildContext context, int index) =>
              _TravelItem(index: index, item: travelItems[index]),
          staggeredTileBuilder: (int index) => new StaggeredTile.fit(2),
          mainAxisSpacing: 4.0,
          crossAxisSpacing: 4.0,
        ),
      );
    }

    // 获取页面数据
    void _loadData({bool loadMore = false}) {
      // ...
    }

    // 缓存各个tab页的内容(2)
    @override
    bool get wantKeepAlive => true;

    Future<Null> _handleRefresh() async {
      _loadData();
      return null;
    }
  }
  ```

![WX20200707-21011820b672b8116b4c83.png](https://file.moetu.org/images/2020/07/07/WX20200707-21011820b672b8116b4c83.png)

<br/>


## 我的

我的 模块页面直接引用的h5页面

```dart
@override
Widget build(BuildContext context) {
  return Scaffold(
    body: WebView(
      url: 'https://m.ctrip.com/webapp/myctrip/',
      hideAppBar: true,
      backForbid: true,
      statusBarColor: '4c5bca',
    ),
  );
}
```

![WX20200707-210351e67f4d321aaa8a9c.png](https://file.moetu.org/images/2020/07/07/WX20200707-210351e67f4d321aaa8a9c.png)