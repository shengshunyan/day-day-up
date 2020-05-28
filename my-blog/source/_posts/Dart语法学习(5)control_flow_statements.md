---
title: Dart语法学习(5)control_flow_statements
date: 2020-05-06
keywords: dart, flutter, 移动端
cover: https://s1.ax1x.com/2020/05/28/tZj62D.png
tags:
     - 移动端
---


{% note info no-icon %}
Dart语法学习系列是自己学习dart的过程笔记
{% endnote %}

## 条件表达式

1. if else

2. switch cas

3. 三目运算符

4. ?? 运算符

```dart
void main() {
  bool isTrue = true;

  if (isTrue) {
    print('true');
  } else {
    print('false');
  }

  var a;
  // 若a为空，则把后面的值赋值给b；若a不为空，则a的值赋给b
  var b = a ?? 10;
  print(b);
}
```
<br/>


## 循环语句

1. for循环

2. while循环

3. do while循环

4. break:
   - 跳出switch结构和以上
   - 只能向外跳出一层

5. continue: 结束本次循环

6. switch case 语句

```dart

void main() {
  for (int i = 1; i < 10; i++) {
    print(i);
  }

  var collection = [0, 1, 2];
  for (var x in collection) {
    print(x); // 0 1 2
  }

  int j = 1;
  while (j < 10) {
    j++;
    print(j);
  }

  
  var command = 'CLOSED';
  switch (command) {
    case 'CLOSED': // Empty case falls through.
    case 'NOW_CLOSED':
      // Runs for both CLOSED and NOW_CLOSED.
      executeNowClosed();
      break;
  }
}
```