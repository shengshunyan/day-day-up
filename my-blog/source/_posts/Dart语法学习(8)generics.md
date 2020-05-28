---
title: Dart语法学习(8)generics
date: 2020-05-09
keywords: dart, flutter, 移动端
cover: https://s1.ax1x.com/2020/05/28/tZj62D.png
tags:
     - 移动端
---


{% note info no-icon %}
Dart语法学习系列是自己学习dart的过程笔记
{% endnote %}

## 范型

在 API 文档中你会发现基础数组类型 List 的实际类型是 List<E> 。 <…> 符号将 List 标记为 泛型 (或 参数化) 类型。 这种类型具有形式化的参数。 通常情况下，使用一个字母来代表类型参数， 例如 E, T, S, K, 和 V 等。

使用泛型可以减少重复的代码。

```dart
void main() {
  var list1 = new List<int>();

  list1.add(1);
  // 范型限定只能添加整数类型
  // list1.add('1');

  var utils = new Utils<int>();
  utils.put(1);
}

// 类范型
class Utils<T> {
  T element;

  // 方法范型
  void put<T1>(T element) {
    this.element = element;
  }
}
```
<br />


## 使用集合字面量

ist , Set 和 Map 字面量也是可以参数化的。 参数化字面量和之前的字面量定义类似， 对于 List 或 Set 只需要在声明语句前加 <type> 前缀， 对于 Map 只需要在声明语句前加 <keyType, valueType> 前缀

```dart
var names = <String>['Seth', 'Kathy', 'Lars'];
var uniqueNames = <String>{'Seth', 'Kathy', 'Lars'};
var pages = <String, String>{
  'index.html': 'Homepage',
  'robots.txt': 'Hints for web robots',
  'humans.txt': 'We are people, not machines'
};
```
<br />


## 使用泛型函数

函数范型 first (<T>) 泛型可以在如下地方使用参数 T ：
  - 函数的返回值类型 (T)
  - 参数的类型 (List<T>)
  - 局部变量的类型 (T tmp)

```dart
T first<T>(List<T> ts) {
  // Do some initial work or error checking, then...
  T tmp = ts[0];
  // Do some additional checking or processing...
  return tmp;
}
```
