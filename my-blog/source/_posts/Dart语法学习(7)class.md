---
title: Dart语法学习(7)class
date: 2020-05-08
keywords: dart, flutter, 移动端
cover: https://s1.ax1x.com/2020/05/28/tZj62D.png
tags:
     - 移动端
---


{% note info no-icon %}
Dart语法学习系列是自己学习dart的过程笔记
{% endnote %}

## 类

Dart 是一种基于类和 mixin 继承机制的面向对象的语言。 每个对象都是一个类的实例，所有的类都继承于 Object。 基于 * Mixin 继承* 意味着每个类（除 Object 外） 都只有一个超类， 一个类中的代码可以在其他多个继承类中重复使用。


```dart
void main() {
  var person = new Person();
  person.name = 'Tom';

  print(person.name);
  person.work();
}

class Person {
  String name;

  void work() {
    // 也可以 ${this.name}
    print('Name is $name, he is working...');
  }
}
```
<br/>


## 构造函数

1. 构造函数前面的的 new 关键字是可选的

2. 简写构造函数：语法糖精简了代码

3. 命名构造函数：使用命名构造函数可为一个类实现多个构造函数， 也可以使用命名构造函数来更清晰的表明函数意图

4. 初始化列表： 在构造函数之前的赋值操作

  ```dart
  void main() {
    var person = new Person('Tom', 20);
    person.name = 'Tom';
    person.age = 20;

    print(person.name);
    person.work();

    var person1 = new Person.now();
  }

  class Person {
    String name;
    int age;
    // final String gender;

    // 构造函数
    Person(String name, int age): name = 'xiaoming', age = 19 {
      this.name = name;
      this.age = age;
    }

    // 简写
    // Person(this.name, this.age);

    // 命名构造函数
    Person.now() {
      print('我是命名构造函数');
    }

    // 初始化列表
    // Person(): name = 'xiaoming', age = 19 {

    // }

    void work() {
      print('Name is $name, age is $age, he is working...');
    }
  }
  ```
<br/>

## 获取对象的类型

使用对象的 runtimeType 属性， 可以在运行时获取对象的类型， runtimeType 属性回返回一个 Type 对象。

```dart
print('The type of a is ${a.runtimeType}');
```


## getter, setter

所有实例变量都生成隐式 getter 方法。 非 final 的实例变量同样会生成隐式 setter 方法。

```dart
class Point {
  num x;
  num y;
}

void main() {
  var point = Point();
  point.x = 4; // Use the setter method for x.
  assert(point.x == 4); // Use the getter method for x.
  assert(point.y == null); // Values default to null.
}
```

getter, setter的应用示例

```dart
void main() {
  var rect = new Rectangle();
  rect.height = 20;
  rect.width = 10;

  print(rect.area);
  rect.areaHeight = 30;
  print(rect.area);
 }

class Rectangle {
  num width, height;

  // 计算属性
  num get area {
    return width * height;
  }
  void set areaHeight(value) {
    this.height = value;
  }
}
```
<br/>


## 类的属性

1. 实例属性

2. 私有属性/方法：前面加_ 需要将相关类抽离成单独文件

3. 静态属性：静态方法不能访问非静态成员，非静态方法可以访问静态成员

```dart
void main() {
  var person = new Person();
  person.say();
}

class Person {
  static bool alive = true;
  int age = 19;
  // 下划线表示私有
  int _weight;

  void say() {
    print('alive is $alive, age is $age');
  }
}
```
<br/>


## 类的继承

1. 覆写父类方法： 可以使用 @override 注解指出想要重写的成员

2. 私有属性不能继承

3. 子类调用父类方法：使用 super 关键字来引用父类

  ```dart
  void main() {
    var student = new Student();
    student.study();

    student.name = 'Tom';
    student.age = 15;
    student.isAdult;
    student.run();
    // 私有属性不能继承
    // student._birthday;
  }

  class Person {
    String name;
    int age;
    String _birthday;

    bool get isAdult => age > 18;

    void run() {
      print('Person run...');
    }
  }

  class Student extends Person {
    void study() {
      print('Student study...');
    }

    // 覆写父类方法
    @override
    bool get isAdult => age > 15;

    // 子类调用父类方法
    @override
    void run() {
      super.run();
      print('student run');
    }
  }
  ```

4. 构造函数的继承
  - 子类不会继承父类的构造函数。 子类不声明构造函数
  - 默认情况下，子类的构造函数会自动调用父类的默认构造函数（匿名，无参数）
  - super的使用

  ```dart
  void main() {
    var student = new Student('Tom', 'Male', 2);

    print(student.name);
    print(student.age);
  }

  class Person {
    String name;

    Person(this.name);
  }

  // 父类的构造方法有参数时，子类中得手动调用
  class Student extends Person {
    int age;
    final gender;

    // age为可选参数
    Student(String name, this.gender, [this.age = 1]): super(name) {
      print('构造方法体');
    }
  }
  ```
<br/>


## 抽象类

主要用于约束子类

1. dart中没有单独的抽象方法；

2. 抽象类不能被实例化，只有继承它的子类可以；

3. 子类继抽象类必须实现里面的抽象方法（抽象类里面可以有普通方法）；

```dart
void main() {
  var person = new Student();
  person.run();
}

abstract class Person {
  void run();
}

class Student extends Person {
  @override
  void run() {
    print('run...');
  }
}
```
<br/>


## 接口

1. dart接口没有interface关键字，实际就是抽象类

2. 用implements关键字进行实现；

3. 需要实现抽象类里面的所有属性和方法；

4. 实现多个接口

```dart
class Person {
  String name;

  int get age => 18;

  void run() {
    print('run...');
  }
}

// 类其实和接口一致，用抽象类更像接口
class Student implements Person {
  @override
  String name;

  @override
  int get age => 15;

  @override
  void run() {
    // something
  }

}

// 实现多个接口
// class A implements B, C {

// }
```

## mixins

实现多继承

1. mixins的类不能有显式声明构造方法

2. mixins的类只能继承自object

```dart
void main() {
  var d = new D();

  d.a();
}

class A {
  void a() {
    print('a...');
  }
}

class B {
  void b() {
    print('b...');
  }
}

class C {
  void c() {
    print('c...');
  }
}

class D with A, B, C {

}
```

## 覆写操作符

```dart
void main() {
  var person1 = new Person(18);
  var person2 = new Person(16);

  print(person1 > person2);
}

class Person {
  int age;

  Person(this.age);

  bool operator > (Person person) {
    return this.age > person.age;
  }
}
```
