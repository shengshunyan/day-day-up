---
title: Dart语法学习(4)operator
date: 2020-05-05
keywords: dart, flutter, 移动端
cover: https://s1.ax1x.com/2020/05/28/tZj62D.png
tags:
     - 移动端
---


{% note info no-icon %}
Dart语法学习系列是自己学习dart的过程笔记
{% endnote %}

## 原始值操作符

1. 算数元素符：+ - * / ~/ %

2. 关系运算符：== != > < >= <=

3. 逻辑运算符：! && ||

4. 赋值运算符：= += -= *= ～/= %= ??=
  - ??= 若b没有值，则赋给右边的值；若b有值，则不赋值；

```dart
void main() {
  // 算数元素符
  int a = 10;
  int b = 2;
  a++;
  print(a);

  // 关系运算符
  print(a == b);

  // 逻辑运算符
  bool isTrue = true;

  // 赋值运算符
  b ??= 10;
  print(b);
}
```
<br/>


## 对象操作符

1. ？ 条件运算符: 若属为空，则不调用/取值

2. as 类型转换

3. is 类型判断

4. .. 级联操作（连缀）

```dart
void main() {

  // 条件运算符
  Person person;
  person?.work();

  // 类型转换
  (person as Person).name = 'Bob';

  // 类型判断
  if (person is Person) {
    person.name = 'Bob';
  }

  // .. 级联操作符，返回操作对象
  var person1 = new Person();
  person1..name = 'Tom'
        ..age = 20
        ..work();
}

class Person {
  String name;
  int age;

  void work() {
    print('Name is $name, age is $age, he is working...');
  }
}
```