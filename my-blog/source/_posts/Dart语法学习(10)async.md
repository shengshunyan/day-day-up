---
title: Dart语法学习(10)async
date: 2020-05-11
keywords: dart, flutter, 移动端
cover: https://i.loli.net/2020/05/04/JWhexMEgDPTQHUI.jpg
tags:
     - 移动端
---


{% note info no-icon %}
Dart语法学习系列是自己学习dart的过程笔记
{% endnote %}

## 异步

Dart 库中包含许多返回 Future 或 Stream 对象的函数. 这些函数在设置完耗时任务（例如 I/O 曹组）后， 就立即返回了，不会等待耗任务完成。 使用 async 和 await 关键字实现异步编程，await 表达式会阻塞代码的执行，直到需要的对象返回为止。 可以让你像编写同步代码一样实现异步操作。（类似JavaScript中的Promise, sync await）
<br />


## 处理 Future

可以通过下面两种方式，获得 Future 执行完成的结果：
  - 使用 async 和 await.
  - 使用 Future API，使用.then()的形式，参考 https://www.dartcn.com/guides/libraries/library-tour#future.

async await关键字的用法

```dart
Future checkVersion() async {
  var version = await lookUpVersion();
  // Do something with version
}
```

使用 try， catch， 和 finally 来处理代码中使用 await 导致的错误

```dart
Future checkVersion() async {
  try {
    version = await lookUpVersion();
  } catch (e) {
    // React to inability to look up the version
  }
}
```
<br />


## 声明异步函数

函数体不需要使用Future API。 如有必要， Dart 会创建 Future 对象。

如果函数没有返回有效值， 需要设置其返回类型为 Future<void> 

```dart
// 同步函数
String lookUpVersion() => '1.0.0';

// 异步函数
Future<String> lookUpVersion() async => '1.0.0';
```
<br />


## 处理 Stream

当需要从 Stream 中获取数据值时， 可以通过一下两种方式：
  - 使用 async 和 一个 异步循环 （await for）。
  - 使用 Stream API, 更多详情，参考 https://www.dartcn.com/guides/libraries/library-tour#stream

```dart
await for (varOrType identifier in expression) {
  // Executes each time the stream emits a value.
}
```