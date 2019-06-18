---
title: HTML代码规范
date: 2018-06-03
categories: "HTML代码规范"
tags: 
     - HTML
     - 代码规范
---
目标：不管有多少参与者，代码都应该像同一个人所写
声明：本规范中的一些规定无对错之分，只是为了统一风格和增加可读性

## 1 文件格式 ##

*   文件名：以小写字母开头，采用驼峰命名，后缀为`.html`
*   文件编码：`UTF-8`
*   换行符：`LF`
*   缩进：`Tab`
*   行末不能包含空格
*   文件以空白行结束
*   每行最大长度：`120`

<!-- more -->

## 2 命名 ##

### 2.1 id ###

*   class采用小写单词，单词之间用`-`连接，不使用下划线`_`和驼峰命名

	正确示例：
```
	<div id="form-login"></div>
```

	错误示例：
```
	<div id="form_login"></div>
	<div id="formLogin"></div>
```

### 2.2 class ###

*   class采用小写单词，单词之间用`-`连接，不使用下划线`_`和驼峰命名

	正确示例：
```
	<div class="panel-head"></div>
```

	错误示例：
```
	<div class="panel_head"></div>
	<div class="panelHead"></div>
```

### 2.3 data-* ###

*   data-*采用小写单词，单词之间用`-`连接，不使用下划线`_`和驼峰命名

	正确示例：
```
	<div data-user-id="1" data-user-name="john"></div>
```

	错误示例：
```
	<div data-userId="1" data-userName="john"></div>
```


## 3 注释 ##

*   单行注释内容前后各加一个空格

	正确示例：
```
	<!-- comment -->
```

	错误示例：
```
	<!--comment-->
```

*   多行注释使用一个缩进
```
	<!--
		comment
		more comment
	-->
```


## 4 代码格式 ##

### 4.1 标签 ###

*   添加Html5文档头
```
	<!DOCTYPE html>
```

*   定义页面编码，并将该定义放在`title`元素之前
```
	<meta charset="utf-8" />
```

*   省略样式和脚本引用的类型

	正确示例：
```
	<script src="main.js"></script>
```

	错误示例：
```
	<script type="text/javascript" src="main.js"></script>
```

	正确示例：
```
	<link rel="stylesheet" href="main.css">
```

	错误示例：
```
	<link rel="stylesheet" type="text/css" href="main.css">
```

	正确示例：
```
	<style>
	</style>
```

	错误示例：
```
	<style type="text/css">
	</style>
```

*   在属性上使用双引号`""`, 不要使用单引号`''`, 也不要省略引号

	正确示例：
```
	<div class="box"></div>
```

	错误示例：
```
	<div class='box'></div>
	<div class=box></div>
```

*   不要在自动闭合标签结尾处使用斜线

	正确示例：
```
	<br>
	<hr>
	<img src="test.png">
	<input type="text" name="name">
```

	错误示例：
```
	<br />
	<hr />
	<img src="test.png" />
	<input type="text" name="name" />
```

*   不要省略关闭标签

	正确示例：
```
	<p>text</p>
	<div>text</div>
```

	错误示例：
```
	<p>text
	<div>text
```

*   不要为Boolean属性添加取值

	正确示例：
```
	<input type="text" disabled>
	<input type="checkbox" value="1" checked>
```

	错误示例：
```
	<input type="text" disabled="disabled">
	<input type="checkbox" value="1" checked="true">
```

*   不要在style属性中写样式，应该定义class，将样式写在css文件中

	正确示例：
```
	<div class="box"></div>
```

	错误示例：
```
	<div style="border: 1px solid red;"></div>
```

*   属性应该按照特定的顺序出现以保证易读性

	推荐按以下顺序书写：
	class, type, 
	id, name, 
	for, src, href, value, data-*,
	title, alt

*   减少标签数量，避免无意义的标签嵌套

	正确示例：
```
	<div class="box">
		text
	</div>
```

	错误示例：
```
	<div class="box">
		<div>
			<div>
				text
			</div>
		</div>
	</div>
```

*   根据标签意义正确嵌套标签

	正确示例：
```
	<div>
		<span>text</span>
	</div>
```

	错误示例：
```
	<span>
		<div>text</div>
	</span>
```


### 4.2 换行 ###

*   超过单行最大字符数限制导致的换行，缩进使用两个Tab
```
	<img class="img-head" src="xxxxxxxxxxxxxxxxxxxxxxx.png"
			alt="">
```

*   块元素要新起一行

	正确示例：
```
	<div></div>
	<div></div>
```

	错误示例：
```
	<div></div><div></div>
```

### 4.3 空行 ###

*   代码逻辑块之间使用一个空行
*   脚本标签前使用一个空行

	正确示例：
```
	<div></div>

	<script>
		doSomething();
	</script>
```

	错误示例：
```
	<div></div>
	<script>
		doSomething();
	</script>
```

### 4.4 空格 ###

*   标签的各个属性名称前加一个空格, 且只能加一个空格

	正确示例：
```
	<div class="box" id="box">
	</div>
```

	错误示例：
```
	<div  class="box"    id="box">
	</div>
```

*   标签的属性如果有多个值，各个值之间加一个空格, 且只能加一个空格

	正确示例：
```
	<div class="box model large">
	</div>
```

	错误示例：
```
	<div class="box  model   large">
	</div>
```

*   标签结尾`>`之前不要加空格

	正确示例：
```
	<div class="box">
	</div>
```

	错误示例：
```
	<div class="box" >
	</div>
```

### 4.5 缩进 ###

*   标签要分级缩进

	正确示例：
```
	<table>
		<tr>
			<td>1</td>
			<td>2</td>
		</tr>
	</table>
```

	错误示例：
```
	<table>
	<tr>
	<td>1</td>
	<td>2</td>
	</tr>
	</table>
```
