---
title: JavaScript代码规范
date: 2018-06-03
categories: "JavaScript代码规范"
tags: 
     - JavaScript
     - 代码规范
---
目标：不管有多少参与者，代码都应该像同一个人所写
声明：本规范中的一些规定无对错之分，只是为了统一风格和增加可读性

## 1 文件格式 ##

*   文件名：以字母开头，采用驼峰命名，后缀为`.js`
*   文件编码：`UTF-8`
*   换行符：`LF`
*   缩进：`Tab`
*   行末不能包含空格
*   文件以空白行结束
*   每行最大长度：`120`
*   单文件最大行数不要超过`2000`

<!-- more -->

## 2 命名 ##

*   所有命名均使用英文，除非对应的英文无法准确表述，否则禁止使用汉语拼音，尤其禁止使用汉语拼音的字母缩写
*   尽可能使用完整单词，避免使用缩写，除非缩写词使用很普遍，例如：`url`, `str`
*   避免单个字符的变量名
*   除常量外，命名应遵循驼峰命名法则，单词之间不使用下划线`_`
*   标识内部使用的变量或函数，可以使用下划线`_`开头

### 2.1 驼峰命名 ###

*   驼峰命名方法
	1.  把每个单词的全部字母都变成小写
	2.  把每个单词的第一个字母改为大写
	3.  根据使用场合把第一个单词的首字母改为大写或小写

*   驼峰命名示例

	正确示例：
```
	createHttpRequest
	userId
```

	错误示例：
```
	createHTTPRequest
	userID
```

### 2.2 方法名 ###

*   方法名以小写字母开头
*   方法名应该以动词开头，例如：`sendMessage`, `stop`

### 2.3 常量名 ###

*   常量名应该全部大写
*   常量名单词之间使用下划线`_`分隔

### 2.4 属性名 ###

*   属性名以小写字母开头
*   布尔型属性不要以`is`开头

### 2.5 参数名 ###

*   参数名以小写字母开头

### 2.6 局部变量名 ###

*   局部变量名以小写字母开头

### 2.7 jQuery对象名 ###

*   使用`$`作为存储jQuery对象的变量名前缀

	正确示例：
```
	var $sidebar = $('.sidebar');
```

	错误示例：
```
	var sidebar = $('.sidebar');
```


## 3 注释 ##

*   注释原则

    *   注释应该描述代码实现的功能，并提供代码自身没有提供的附加信息
	*   注释应该对设计决策中重要的或者不是显而易见的地方进行说明
	*   避免提供代码中己清晰表达出来的重复信息

*   注释内容前面增加一个空格

	正确示例：
```
	// comment
	/*
	 * comment
	 */
```

	错误示例：
```
	//comment
	/*
	 *comment
	 */
```

*   尽量避免行末注释

	正确示例：
```
	// comment
	doSomething();
```

	错误示例：
```
	doSomething(); // comment
```

*   文档注释
```
	/**
	 * 文档说明
	 * 
	 * @author xxx
	 */
```

*   方法注释
```
	/**
	 * 方法说明
	 * 
	 * @param 参数变量名 参数变量说明
	 * @return 返回值说明
	 */
```

## 4 代码格式 ##

### 4.1 语句 ###

*   每条语句必须以分号`;`结尾

	正确示例：
```
	var i = 0;
	doSomething();
```

	错误示例：
```
	var i = 0
	doSomething()
```

*   每行一条语句

	正确示例：
```
	var i = 0;
	doSomething();
```

	错误示例：
```
	var i = 0; doSomething();
```

### 4.2 变量 ###

*   每行声明一个变量，不要在一行中声明多个变量

	正确示例：
```
	var num1;
	var num2;
```

	错误示例：
```
	var num1, num2;
```

### 4.3 字符串 ###

*   字符值优先使用单引号	`''`

	正确示例：
```
	var str = 'some text';
```

	错误示例：
```
	var str = "some text";
```

### 4.4 对象 ###

*   对象的每个属性单独占一行

	正确示例：
```
	var obj = {
  		a: 0,
  		b: 1
	}
```

	错误示例：
```
	var obj = {
  		a: 0, b: 1
	}
```

*   对象的属性除特殊字符不要使用引号, 尤其不要混合使用

	正确示例：
```
	var obj = {
		foo: 3,
		bar: 4,
		'data-blah': 5
	}
```

	错误示例：
```
	var obj = {
		'foo': 3,
		bar: 4,
		'data-blah': 5
	}
```

### 4.5 数组 ###

*   数组的每个值可以单独占一行，也可以都写在一行

	正确示例：
```
	var data = [
		0,
		1,
		2
	];

	var data = [0, 1, 2];
```

### 4.6 块语句 ###

*   `if`, `else`, `for`, `do`, `while` 语句必须使用大括号`{}`包含起来

	正确示例：
```
	if (condition) {
		doSomething();
	}
```

	错误示例：
```
	if (condition)
		doSomething();
```

*   块语句开头的大括号`{`放在行末

	正确示例：
```
	if (true) {
		return;
	}
```

	错误示例：
```
	if (true)
	{
		return;
	}
```

*   `else if` 和 `else` 语句跟在前一个块语句后面，而不是新起一行

	正确示例：
```
	if (true) {
		return;
	} else if (false) {
		return;
	} else {
		return;
	}
```

	错误示例：
```
	if (true) {
		return;
	}
	else if (false) {
		return;
	}
	else {
		return;
	}
```

### 4.7 换行 ###

*   超过单行最大字符数限制导致的换行，缩进使用两个Tab
*   表达式换行在操作符前面断开

	正确示例：
```
	var sum = 100 + 200 + 300 + 400
			+ 500 + 600 + 700 + 800;
	var val = true && false
			&& true && false
			&& true;
```

	错误示例：
```
	var sum = 100 + 200 + 300 + 400 + 
			500 + 600 + 700 + 800;
	var val = true && false && 
			true && false && 
			true;
```

*   参数换行在逗号后面断开

	正确示例：
```
	someMethod(arg1, arg2, arg3, 
			arg4, arg5);
```

	错误示例：
```
	someMethod(arg1, arg2, arg3
			, arg4, arg5);
```

### 4.8 空行 ###

*   函数定义前面和后面各使用一个空行
*   一个方法内的两个逻辑段之间使用一个空行
*   return语句之前使用一个空行

### 4.9 空格 ###

*  赋值符号`=`前后各加一个空格

	正确示例：
```
	var i = 0;
```

	错误示例：
```
	var i=0;
```

*  二元运算符和三元运算符的符号前后各加一个空格

	正确示例：
```
	a + b;
	condition ? a : b;
```

	错误示例：
```
	a+b;
	condition?a:b;
```

*  条件运算符前后各加一个空格

	正确示例：
```
	i > 0;
```

	错误示例：
```
	i>0;
```

*  关键字和它后面的	`(`或 `{`之间加一个空格

	正确示例：
```
	if (condition) {
		doSomething();
	}
```

	错误示例：
```
	if(condition) {
		doSomething();
	}
```

*  块语句开头的`{`之前加一个空格

	正确示例：
```
	if (condition) {
		doSomething();
	}
```

	错误示例：
```
	if (condition){
		doSomething();
	}
```

*  for条件语句之间加一个空格

	正确示例：
```
	for (var i = 0; i < list.length; i++) {
		doSomething();
	}
```

	错误示例：
```
	for (var i = 0;i < list.length;i++) {
		doSomething();
	}
```

### 4.10 缩进 ###

*   switch语句缩进

```
	switch (input) {
		case 1:
		case 2:
	    	prepareOneOrTwo();
		case 3:
	    	handleOneTwoOrThree();
	    	break;
		default:
			handleLargeNumber(input);
			break;
	}
```


## 5 编程惯例 ##

### 5.1 变量 ###

*   未使用的变量要删除

*   避免在一个语句中给多个变量赋相同的值

	错误示例：
```
	var a = b = c = 0;
```

*   避免声明的局部变量覆盖上一级声明的变量

	错误示例：
```
	var i = 0;
	
	function doSomething(i) {
		var i = 1;
	}
```

*   总是使用`var`来声明变量

	正确示例：
```
	var i = 0;
	var length = 100;
```

	错误示例：
```
	i = 0;
	length = 100;
```

### 5.2 对象 ###

*   定义对象不要使用`Object`构造器

	正确示例：
```
	var obj = {};
```

	错误示例：
```
	var obj = new Object();
```

*   对象属性访问使用`.`, 属性名有特殊字符的除外

	正确示例：
```
	obj.name;
	obj['data-name'];
```

	错误示例：
```
	obj['name'];
```

*   对象属性名不要使用保留字

	正确示例：
```
	var obj = {
		className: 'alien'
	};
```

	错误示例：
```
	var obj = {
		class: 'alien'
	};
```

### 5.3 数组 ###

*   定义数组不要使用`Array`构造器

	正确示例：
```
	var a1 = [];
	var a2 = [1, 2, 3];
```

	错误示例：
```
	var a1 = new Array();
	var a2 = new Array(1, 2, 3);
```

*   向数组增加元素时使用push方法

	正确示例：
```
	var items = [];
	items.push('text');
```

	错误示例：
```
	var items = [];
	items[items.length] = 'text';
```

### 5.4 条件语句 ###

*   switch语句需要包含default分支

	正确示例：
```
	switch (input) {
		case 1:
			func1();
			break;
		case 2:
			func2();
			break;
		case 3:
			func3();
			break;
		default:
			handleLargeNumber(input);
			break;
	}
```

	错误示例：
```
	switch (input) {
		case 1:
			func1();
			break;
		case 2:
			func2();
			break;
		case 3:
			func3();
			break;
	}
```

*   多个条件互斥时要使用`else if`

	正确示例：
```
	if (condition1) {
		doSomething();
	} else if(condition2) {
		doSomethingElse();
	}
```

	错误示例：
```
	if (condition1) {
		doSomething();
	}
	if(condition2) {
		doSomethingElse();
	}
```

*   条件判断使用快捷方式

	正确示例：
```
	if (name) {

	}
```

	错误示例：
```
	if (name != '' && name != null) {

	}
```

*   不要嵌套使用三元表达式

	正确示例：
```
	const maybeNull = value1 > value2 ? 'baz' : null;

	const foo = maybe1 > maybe2 ? 'bar' : maybeNull;
```

	错误示例：
```
	var foo = maybe1 > maybe2 ? 'bar' : value1 > value2 ? 'baz' : null;
```

### 5.5 函数 ###

*   未使用的函数参数要删除

*   不要在一个非函数代码块（if、while、for等）中声明一个函数

	正确示例：
```
	function test() {
		console.log('test');
	}

	for(var i = 0; i < length; i++) {
		test();
	}
```

	错误示例：
```
	for(var i = 0; i < length; i++) {
		function test() {
			console.log('test');
		}
		
		test();
	}
```

### 5.6 字符串 ###

*   不使用不必要的转义字符

	正确示例：
```
	var str = '<input name="username">';
```

	错误示例：
```
	var str = '<input name=\"username\">';
```

*   拼接字符串使用`Array.join`

	正确示例：
```
	var items = ['a', 'b', 'c'];

	var str = items.join(',');
```

	错误示例：
```
	var items = ['a', 'b', 'c'];

	var str = '';
	for(var i = 0; i < items.length; i++) {
		if(i > 0) {
			str += ',';
		}
		
		str += items[i];
	}
```

### 5.7 注释 ###

*   注释中使用`TODO`来说明未实现或可以改进的逻辑
