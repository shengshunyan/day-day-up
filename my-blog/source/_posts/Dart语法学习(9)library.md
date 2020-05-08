---
title: Dart语法学习(9)library
date: 2020-05-10
keywords: dart, flutter, 移动端
cover: https://i.loli.net/2020/05/04/JWhexMEgDPTQHUI.jpg
tags:
     - 移动端
---


{% note info no-icon %}
Dart语法学习系列是自己学习dart的过程笔记
{% endnote %}

## 库

import 和 library 指令可以用来创建一个模块化的，可共享的代码库。 库不仅提供了 API ，而且对代码起到了封装的作用： 以下划线 (_) 开头的标识符仅在库内可见。 每个 Dart 应用程序都是一个库 ，虽然没有使用 library 指令。
<br />


## 自定义库

自定义类库的引用，import后面直接写路径

1. /lib/person.dart

  ```dart
  class Person {
    String name;
    int age;
    String _birthday;

    bool get isAdult => age > 18;

    void run() {
      print('Person run...');
    }
  }
  ```

2. /custom_package.dart

  ```dart
  import 'lib/person.dart';

  void main() {
    var person = new Person();

    person.run();
  }
  ```
<br />


## 内置库

内置库是dart自带的库，引入的时候加 dart: 前缀

```dart
/**
 * 系统内置库: io
 * 系统内置库: math
 */

import 'dart:io';
import 'dart:convert';
import 'dart:math';

void main() async {
  var result = await _getApiInfo();
  print(result);

  print(min(1, 2));
}

_getApiInfo() async {
  // 1. 创建http client对象
  var httpClient = new HttpClient();
  // 2. 创建Uri对象
  var uri = new Uri.https('m.douban.com', '/rexxar/api/v2/muzzy/columns/10018/items?start=0&count=3');
  // 3. 发起请求，等待请求
  var request = await httpClient.getUrl(uri);
  // 4. 关闭请求，等待响应
  var response = await request.close();
  // 5. 解码响应的内容
  return await response.transform(utf8.decoder).join();
}
```
<br />


## 网络库

1. 网络库是网上 https://pub.dev 上共享的库，需要 package: 前缀

2. 需要在 pubspec.yaml 文件中写依赖项，保存文件会自动下载包

```dart
/**
 * 网络库库: http
 *  1. 在pubspec.yaml中写依赖项
 */

import 'dart:convert' as convert;
import 'package:http/http.dart' as http;

main(List<String> arguments) async {
  // This example uses the Google Books API to search for books about http.
  // https://developers.google.com/books/docs/overview
  var url = "https://www.googleapis.com/books/v1/volumes?q={http}";

  // Await the http get response, then decode the json-formatted responce.
  var response = await http.get(url);
  if (response.statusCode == 200) {
    var jsonResponse = convert.jsonDecode(response.body);
    var itemCount = jsonResponse['totalItems'];
    print("Number of books about http: $itemCount.");
  } else {
    print("Request failed with status: ${response.statusCode}.");
  }
}
```
<br />


## 库引用语法

### 库重命名

库重命名可以解决两个存在冲突标识符的问题，使用 as 关键字

```dart
import 'package:lib1/lib1.dart';
import 'package:lib2/lib2.dart' as lib2;

// 使用 lib1 中的 Element。
Element element1 = Element();

// 使用 lib2 中的 Element。
lib2.Element element2 = lib2.Element();
```


### 库部分导入

如果你只使用库的一部分功能，则可以选择需要导入的内容，使用 show 关键字

```dart
// Import only foo.
import 'package:lib1/lib1.dart' show foo;

// Import all names EXCEPT foo.
import 'package:lib2/lib2.dart' hide foo;
```

### 延迟加载库

可以让应用在需要的时候再加载库，使用  deferred as 关键字和 loadLibrary() 方法

一些使用延迟加载库的场景：
  - 减少 APP 的启动时间
  - 执行 A/B 测试，例如 尝试各种算法的 不同实现
  - 加载很少使用的功能，例如可选的屏幕和对话框

```dart
import 'package:greetings/hello.dart' deferred as hello;

// 当需要使用的时候，使用库标识符调用 loadLibrary() 函数来加载库：
Future greet() async {
  await hello.loadLibrary();
  hello.printGreeting();
}
```