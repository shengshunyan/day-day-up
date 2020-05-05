---
title: Dart语法学习(2)variable
date: 2020-05-03
keywords: dart, flutter, 移动端
cover: https://i.loli.net/2020/05/04/JWhexMEgDPTQHUI.jpg
tags:
     - 移动端
---


{% note info no-icon %}
Dart语法学习系列是自己学习dart的过程笔记
{% endnote %}

## 变量

1. var声明的变量，dart会自动推断其类型，不能给变量赋不同类型的值；

2. const值不变，一开始就得赋值，final可以开始不赋值，只能赋值一次；

3. final是运行时常量，惰性初始化，即在运行时第一次使用前才初始化；

```dart
void main() {
  // var 声明一般变量
  var a;
  print(a);

  a = 10;
  print(a);

  // final 定义的变量只能被赋值一次
  final b = 10;
  // b = 15;

  // const 声明常量
  const d = 20;
  // d = 50;

  // 报错
  // const time = new DateTime.now();
  // 不报错
  final time = new DateTime.now();
}
```
<br/>


## 默认值

未初始化的变量默认值是 null。即使变量是数字 类型默认值也是 null，因为在 Dart 中一切都是对象，数字类型 也不例外。
