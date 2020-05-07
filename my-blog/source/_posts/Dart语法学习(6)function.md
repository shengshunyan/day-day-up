---
title: Dart语法学习(6)function
date: 2020-05-07
keywords: dart, flutter, 移动端
cover: https://i.loli.net/2020/05/04/JWhexMEgDPTQHUI.jpg
tags:
     - 移动端
---


{% note info no-icon %}
Dart语法学习系列是自己学习dart的过程笔记
{% endnote %}

## 函数

Dart 是一门真正面向对象的语言， 甚至其中的函数也是对象，并且有它的类型 Function 。 这也意味着函数可以被赋值给变量或者作为参数传递给其他函数。 也可以把 Dart 类的实例当做方法来调用。
<br/>


## 定义

1. 返回类型、参数类型

2. 可选参数、命名参数、默认参数：将参数放到 [] 中来标记参数是可选的

3. 匿名函数

4. 简写方式：箭头函数

```dart
void main() {
  print(getPerson("zhangsan",));
  print(getPerson1("zhangsan", sex: '女', age: 18));

  // 箭头函数
  List list = ['a', 'b', 'c'];
  list.forEach((value) => print(value));
  // 匿名方法
  list.forEach((value){
    print(value);
  });
}

// 返回类型、参数类型、可选参数、默认参数
String getPerson(String name, [int age, String sex = '男']) {
  return "name = $name, age = $age, sex = $sex";
}

// 命名参数
String getPerson1(String name, {int age, String sex = '男'}) {
  return "name = $name, age = $age, sex = $sex";
}
```
<br/>


## main() 函数

任何应用都必须有一个顶级 main() 函数，作为应用服务的入口。 main() 函数返回值为空，参数为一个可选的 List<String> 。
<br/>


## 函数是一等对象

一个函数可以作为另一个函数的参数。

```dart
void printElement(int element) {
  print(element);
}

var list = [1, 2, 3];

// 将 printElement 函数作为参数传递。
list.forEach(printElement);
```
<br/>


## 词法作用域

Dart 是一门词法作用域的编程语言，就意味着变量的作用域是固定的， 简单说变量的作用域在编写代码的时候就已经确定了。 花括号内的是变量可见的作用域。

```dart
bool topLevel = true;

void main() {
  var insideMain = true;

  void myFunction() {
    var insideFunction = true;

    void nestedFunction() {
      var insideNestedFunction = true;

      assert(topLevel);
      assert(insideMain);
      assert(insideFunction);
      assert(insideNestedFunction);
    }
  }
}
```

nestedFunction() 可以访问所有的变量， 一直到顶级作用域变量。
<br/>


## 词法闭包

闭包 即一个函数对象，即使函数对象的调用在它原始作用域之外， 依然能够访问在它词法作用域内的变量。

函数可以封闭定义到它作用域内的变量。 接下来的示例中， makeAdder() 捕获了变量 addBy。 无论在什么时候执行返回函数，函数都会使用捕获的 addBy 变量。

```dart
// 返回一个函数，返回的函数参数与 [addBy] 相加。
Function makeAdder(num addBy) {
  return (num i) => addBy + i;
}

void main() {
  // 创建一个加 2 的函数。
  var add2 = makeAdder(2);

  // 创建一个加 4 的函数。
  var add4 = makeAdder(4);

  assert(add2(3) == 5);
  assert(add4(3) == 7);
}
```
