---
title: shell编程
date: 2019-10-18
tags:
     - 计算机基础
---

# Bash变量
## 一、bash变量和变量分类
1. 变量存储数据类型：
    1. 字符串型
    1. 整形
    1. 浮点型
    1. 日期型
2. 在bash中，变量的默认类型都是字符串类型；
3. 变量的分类：
    1. 用户自定义变量
    1. 环境变量：保存的是和系统操作环境相关的数据，变量可以自定义，但是对系统生效的环境变量名和变量作用是固定的；
    1. 预定义变量：是bash中已经定义好的变量，变量名不能自定义，变量作用也是固定的；
    1. 位置参数变量

<!-- more -->

## 二、用户自定义变量
1. 变量定义：x=aaa
    1. 等号两边不能加空格
    1. 变量名只能又字母数字下划线组成，不能用数字开头
2. 变量调用：echo $x
3. 变量叠加：
```bash
x=123
x="$x"456
echo $x // 123456
x=${x}789
echo $x // 123456789
```
4. 变量查看：set
5. 变量删除：unset 变量名

## 三、bash环境变量
1. 环境变量和用户变量的区别：
    1. 环境变量是全局变量
    1. 用户自定义变量是局部变量
2. 设置环境变量：
```bash
export 变量名=变量值
// 或
变量名=变量值
export 变量名
```
3. 查看环境变量：env
4. 系统环境变量：
    1. PATH: 系统查找命令的路径
    1. PS1：用户提示符(shell输入命令前的显示文本)
    ![1.png](https://i.loli.net/2019/08/22/4I5wF2ulZnzsthO.png)

## 四、bash语系变量
1. 当前语系查询：locale
    1. LANG: 定义系统主语系的变量
    1. LC_ALL: 定义整体语系的变量
2. 查看当前系统语系：echo $LANG
3. 查看linux支持的所有语系：locale -a | more
4. 查询默认语系(下次系统开机所使用的语系): cat /etc/sysconfig/i18n

## 五、位置参数变量
1. 位置参数变量(shell命令中向执行脚本传递参数)：
![1.png](https://i.loli.net/2019/08/22/ieVdMSAzGl37CZ6.png)
2. 接收键盘输入：read [选项] [变量名]
    1. p "提示信息": 在等待read输入时，输出提示信息；
    1. t：read命令会一直等待用户输入，使用此选项可以指定等待时间；
    1. n 字符数：read命令只接收指定的字符数，就会执行；
    1. s：隐藏输入的数据，适用于机密信息输入；

## 六、预定义变量
1. 预定义变量：
![2.png](https://i.loli.net/2019/08/22/18uWhqIYxOtXUdF.png)

# shell运算符
## 一、概述及declare命令
1. declare声明变量类型：declare [+/-][选项] 变量名
    1. -：给变量设定类型属性
    1. +：取消变量的类型属性
    1. -a：将变量声明为数组型
    1. -i：将变量声明为整数型
    1. -x：将变量声明为环境变量
    1. -r：将变量声明为只读变量
    1. -p：显示指定变量的被声明的类型
```bash
aa=11
bb=22
cc=$aa+$bb // 11+22
declare -i cc=$aa+$bb // 33
```
2. 声明数组
```
// 两种方法都可以
movie[0]=zp
declare -a movie[1]=tp
echo ${movie} // zp 只会打印第一个元素
echo ${movie[*]} // zp tp 打印整个数组
```
3. 声明环境变量：declare -x test=123 (export其实也是通过declare实现的)

## 二、数值运算方法
1. 利用declare：declare -i cc=$aa+$bb；
2. expr或let数值运算工具：
    1. dd=$(expr $aa + $bb) // 注意空格
3. $((运算式)) 或 $[运算式]:
    1. ff=$(($aa+$bb))
4. 运算符：
![3.png](https://i.loli.net/2019/08/22/Db2AykgC1rvXFYa.png)

## 三、变量测试
1. 好处：代码精简；
2. 坏处：不好理解记忆；

# 环境变量配置文件
## 一、简介
1. 修改配置文件：source 配置文件
    1. 用source修改配置文件后，不用重新登录即可生效

## 二、环境变量配置文件的功能
1. 输入用户名密码启动，环境变量文件加载过程：
![1.png](https://i.loli.net/2019/08/22/3jlruJYD5PZLxUK.png)
2. /etc/profile 作用：
    1. USER变量
    1. LOGNAME变量
    1. MAIL变量
    1. PATH变量
    1. HOSTNAME变量
    1. HISTSIZE变量
    1. umask变量
    1. 调用/etc/profile.d/*.sh文件

## 三、其他配置文件
1. ~/.bash_logout: 用户退出时候执行的命令；
2. ~/.bash_history: 用户执行命令的历史记录；
3. /etc/issue: 本地终端欢迎信息；
4. /etc/issue.net: 远程终端欢迎信息；
5. /etc/motd: 登录后欢迎信息(本地&远程)；

# 正则表达式
## 一、正则表达式
1. 正则表达式与通配符：
1. 正则表达式是包含匹配，grep, awk, sed等命令支持正则表达式；
1. 通配符是完全匹配，ls, find, cp只能会用shell自己的通配符来进行匹配；
2. 通配符：
1. *匹配任意内容
1. ?匹配任意一个内容
1. []匹配括号中的一个字符
3. 基础正则表达式
![1.png](https://i.loli.net/2019/10/23/x61iJPDgN4UFYTW.png)

## 二、字符截取命令
1. cut命令
    1. cut -d ':' -f 1,3 filepath  以:为分隔符，截取第一列和第三列(如果没有指定分隔符，默认是制表符分割)
2. printf命令
3. awk命令：awk '条件1{动作1}条件2{动作2}...' 文件名
    1. ![1.png](https://i.loli.net/2019/10/23/1yqpgm7VBzj52hG.png)
4. sed命令：截取和替换

## 三、字符处理命令
1. 排序命令sort
2. 统计命令wc

# 条件判断与流程控制
## 一、条件判断式语句
1. 文件类型判断；
2. 文件权限判断；
3. 整数之间比较；
4. 字符串比较；
5. 多重逻辑判断：与或非；

## 二、单分支if语句
1. 例子：判断登录用户
```bash
#!/bin/bash

# 取出env中含有USER的行，用=分隔，取第二项用户名
test=$(env | grep USER | cut -d "=" -f 2)

if [ "$test" == "shengshunyan" ]
	then
		echo "user is shengshunyan"
fi
```

## 三、双分支if条件语句
1. 例子：判断某磁盘是否使用率过高
```bash
#!/bin/bash

# 取出df中包含disk1s5的行，截取第5列，用%作为分隔符取第一项
test=$(df -h | grep disk1s5 | awk '{print $5}' | cut -d "%" -f 1)

if [ "$test" -ge "90" ]
	then
		echo "disk if almost full"
	else
		echo "normal"
fi
```
2. 判断Apache是否启动
![1.png](https://i.loli.net/2019/10/24/r9vKDokQPGNSZc1.png)

## 四、多分支if条件语句
![1.png](https://i.loli.net/2019/10/28/sCQqLeEaFlzbO2I.png)
1. 判读用户输入的是什么文件
```bash
#!/bin/bash

read -p "Please input a filename: " file

if [ -z "$file" ]
	then
		echo "Error, please enter a filename"
		# 返回值，提前返回错误值
		exit 0
elif [ ! -e "$file" ]
	then
		echo "You input is not a file"
		exit 1
else
	echo "This is a file"
fi

```

## 五、多分支case语句
1. 判断输入是yes/no
```bash
#!/bin/bash

read -p "Please choose yes/no: " cho

case $cho in
	"yes")
		echo "Your choose is yes"
		;;
	"no")
		echo "Your choose is no"
		;;
	*)
		echo "Your choose is error"
		;;
esac
```

## 六、for循环
1. 循环遍历当前文件下的文件
```bash
#!/bin/bash

ls >> ls.log

for i in $( cat ls.log )
	do
		echo $i
	done
```
2. 传统语法
```bash
#!/bin/bash

s=0
for (( i=0;i<100;i=i+1 ))
	do
		s=$(( $s+$i ))
	done
echo $s
```
3. 批量添加用户
![2.png](https://i.loli.net/2019/10/28/GfcQ8BI4NAPFvi2.png)

## 七、while循环和until循环
1. while循环计算1-100的和
![3.png](https://i.loli.net/2019/10/28/6irs9CjkYMQBRJg.png)
2. until循环
![4.png](https://i.loli.net/2019/10/28/Rsuz5BiYx147dOb.png)