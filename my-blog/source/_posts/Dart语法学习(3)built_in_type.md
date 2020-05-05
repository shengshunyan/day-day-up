---
title: Dart语法学习(3)built_in_type
date: 2020-05-04
keywords: dart, flutter, 移动端
cover: https://i.loli.net/2020/05/04/JWhexMEgDPTQHUI.jpg
tags:
     - 移动端
---


{% note info no-icon %}
Dart语法学习系列是自己学习dart的过程笔记
{% endnote %}

## 内建类型

1. Dart 语言支持以下内建类型：
  - Number
  - String
  - Boolean
  - List (也被称为 Array)
  - Map
  - Set
  - Rune (用于在字符串中表示 Unicode 字符)
  - Symbol

这些类型都可以被初始化为字面量。 例如, 'this is a string' 是一个字符串的字面量， true 是一个布尔的字面量。

因为在 Dart 所有的变量终究是一个对象（一个类的实例）， 所以变量可以使用 构造涵数 进行初始化。 一些内建类型拥有自己的构造函数。 例如， 通过 Map() 来构造一个 map 变量。
<br/>


## String

1. 单、双引号一致；
2. 三个单/双引号里面可以写多行字符串；
3. 字符串拼接：+
4. 字符串模版：$ {}

```dart
void main() {
  String str1 = 'hello';
  String str2 = '''Hello
                world''';
  print(str2);

  String str3 = 'hello \n world';
  String str4 = r'hello \n world';
  print(str3);
  print(str4);

  String str5 = 'This is my favorite language';
  print(str5 + ' New');
  print(str5 * 4);
  print(str5 == str4);
  print(str5[1]);


  // 字符串模版
  int a = 1;
  int b = 2;
  print('a + b = ${a + b}');
  print('a = $a');

  print(str5.length);
  print(str5.isNotEmpty);
}
```
<br/>


## Number

### 特点
1. int: 整形； double: 浮点型；
2. double被赋值为整形的时候，dart会自动在后面加上.0；
3. \+ - * / ～/ %

```dart
void main() {
  num a = 10;
  a = 12.5;

  // 整形不能被赋值为浮点型
  int b = 20;
  // b = 20.5;

  // 浮点型不能被赋值为整形
  double c = 10.5;
  // c = 30;

  print(b + c);
  print(b - c);
  print(b * c);
  print(b / c);
  // 取整除完的结果
  print(b ~/ c);
  print(b % c);

  print(b.isEven);
  print(b.isOdd);
}
```

### 方法
int 和 double 都是 num. 的亚类型。 num 类型包括基本运算 +， -， /， 和 *， 以及 abs()， ceil()， 和 floor()， 等函数方法。 （按位运算符，例如»，定义在 int 类中。） 如果 num 及其亚类型找不到你想要的方法， 尝试查找使用 dart:math 库。

### 与字符串之间的转换
```dart
// String -> int
var one = int.parse('1');
assert(one == 1);

// String -> double
var onePointOne = double.parse('1.1');
assert(onePointOne == 1.1);

// int -> String
String oneAsString = 1.toString();
assert(oneAsString == '1');

// double -> String
String piAsString = 3.14159.toStringAsFixed(2);
assert(piAsString == '3.14');
```
<br/>


## Boolean

1. 值：true, false;
2. 条件判断；

```dart
void main() {
  bool isTrue = true;
  bool isFalse = false;

  if (isTrue) {
    print('true');
  } else {
    print('false');
  }
}
```
<br/>


## List

1. 数组/集合类型
  - 定义List的方式： 字面量、构造函数
  - 声明不可变列表
  - 范型定义List指定类型

2. 常用属性
  - length 长度
  - reversed 翻转
  - isEmpty 是否为空
  - isNotEmpty 是否不为空

3. 常用方法
  - add 增加
  - addAll 拼接数组
  - indexOf 查找 传入具体值
  - remove 删除 传入具体值
  - removeAt 删除 传入索引值
  - fillRange 修改
  - insert(index, value) 指定位置插入
  - insertAll(index, list) 指定位置插入List
  - toList 其他类型转换成List
  - join List转换成字符串
  - split 字符串转换成List
  - forEach
  - map
  - where 筛选
  - any
  - every

  ```dart
  void main() {
    var list1 = [1, 2, 'dart'];
    print(list1);
    list1[1] = 3;
    print(list1);

    // 不可变列表
    var list2 = const [1, 2, 3];
    // list2[1] = 4;

    var list3 = new List();

    var list = ['hello', 'dart'];
    list.add('aaa');
    list.insert(1, 'java');
    print(list);

    var list4 = new List<String>();
    list4.add('张三');
    // list4.add(1);

    // reverse
    print(list1.reversed.toList());

    list1.addAll(['香蕉', '苹果']);

    // 遍历
    print('for loop ------');
    for (int i = 0; i < list1.length; i++) {
      print(list1[i]);
    }
    print('for in loop ------');
    for ( var o in list1) {
      print(o);
    }
    print('foreach loop ------');
    list1.forEach((val){
      print(val);
    });
  }
  ```

4. 在 List 字面量之前添加 const 关键字，可以定义 List 类型的编译时常量：

  ```dart
  var constantList = const [1, 2, 3];
  // constantList[1] = 1; // 取消注释会引起错误。
  ```
<br/>


## Set

1. 不重复的list
2. Set是没有顺序的集合，不能通过索引去获取值
3. Map 字面量语法同 Set 字面量语法非常相似。 因为先有的 Map 字母量语法，所以 {} 默认是 Map 类型。   如果忘记在 {} 上注释类型或赋值到一个未声明类型的变量上，   那么 Dart 会创建一个类型为 Map<dynamic, dynamic> 的对象

```dart
var halogens = {'fluorine', 'chlorine', 'bromine', 'iodine', 'astatine'};
var names = <String>{};
// Set<String> names = {}; // 这样也是可以的。
// var names = {}; // 这样会创建一个 Map ，而不是 Set 。
```
<br/>


## Map

### 字典类型

1. key类型不限：字符串、数值、布偶、数组、字典
2. 两种声明方式：字面量、构造函数
3. 不可变Map
4. Map取值只能用[]

### 常用属性

1. keys 获取所有的key值
2. values 获取所有的value值
3. isEmpty 是否为空
4. inNotEmpty 是否不为空

### 常用方法

1. remove(key) 删除指定key的数据
2. addAll 合并字典 增加属性
3. containsValue 查看字典是否有某个值
4. forEach
5. map
6. where
7. any
8. every

### 示例代码
```dart
void main() {
  var map1 = {'first': 'dart', 1: true};
  print(map1);
  print(map1['first']);

  // 不可变map
  var map2 = const {'first': 'dart', 1: true};

  var map3 = new Map();

  print(map1.keys);
  print(map1.values);

  // 遍历
  print('遍历------------');
  map1.forEach((key, value) {
    print('$key: $value');
  });
  Map map4 = map1.map((key, value) {
    return MapEntry(value, key);
  });
  print('key value调换：$map4');
}
```
<br/>


## some tips

### 类型判断

1. 用is来判断类型

```dart
void main() {
  var str = '1234';

  print(str is String);
}
```

### dynamic、var、Object三者区别

1. dynamic：动态类型，运行过程中数据类型可以修改
2. var：动态类型，运行过程中数据类型不可修改，只能是第一次推断的数据类型
3. Object：静态检查，只能调用Object上有的方法

```dart
void main() {
  print('dynamic: ----------------');
  dynamic b = 20;
  b = 'JavaScript';
  print(b);
  print(b.runtimeType);

  print('var: ----------------');
  var a = 123;
  print(a);
  print(a.runtimeType);
  // a = '111'; // 报错

  print('Object: ----------------');
  Object c = '11';
  print(c);
  print(c.runtimeType);
}
```