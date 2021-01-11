---
title: 剑指offer算法题
date: 2021-1-7
keywords: 剑指offer, JavaScript, 算法
cover: https://i.loli.net/2021/01/07/Oe5yFdH1fs92wqC.png
tags:
     - JavaScript
---


{% note info no-icon %}
线上练习网站：https://www.nowcoder.com/ta/coding-interviews

前置知识：[JavaScript数据结构与算法](https://www.shengshunyan.xyz/2018/08/14/JavaScript%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95/)
{% endnote %}

## 入门

### 斐波那契数列

{% note primary %}
**题目描述：**

大家都知道斐波那契数列，现在要求输入一个整数n，请你输出斐波那契数列的第n项（从0开始，第0项为0，第1项是1）
{% endnote %}

示例：
 - 输入：4
 - 输出：3

```JavaScript
function Add(num1, num2) {
    let a = 0
    let b = 1

    while (n > 0) {
        b = a + b
        a = b - a
        n = n - 1
    }

    return a
}
```

<br/>


## 简单

### 用两个栈实现队列

{% note primary %}
**题目描述：**

用两个栈来实现一个队列，完成队列的Push和Pop操作。 队列中的元素为int类型。
{% endnote %}

```JavaScript
const stackIn = []
const stackOut = []

function push(node) {
    while (stackOut.length) {
        stackIn.push(stackOut.pop())
    }

    stackIn.push(node)
}

function pop() {
    while (stackIn.length) {
        stackOut.push(stackIn.pop())
    }

    return stackOut.pop()
}
```

<br/>


### 用两个栈实现队列

{% note primary %}
**题目描述：**  

把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。
输入一个非递减排序的数组的一个旋转，输出旋转数组的最小元素。
NOTE：给出的所有元素都大于0，若数组大小为0，请返回0。
{% endnote %}

示例：
 - 输入：[3,4,5,1,2]
 - 输出：1

```JavaScript
function minNumberInRotateArray(rotateArray)
{
    if (rotateArray.length === 0) {
        return 0
    }

    let left = 1
    let right = rotateArray.length

    while (left < right) {
        let middle = Math.floor((left + right) / 2)
        if (rotateArray[middle - 1] <= rotateArray[right - 1]) {
            right = middle
        } else {
            left = middle + 1
        }
    }

    return rotateArray[left - 1]
}
```

<br/>


### 变态跳台阶

{% note primary %}
**题目描述：**  

一只青蛙一次可以跳上1级台阶，也可以跳上2级……它也可以跳上n级。求该青蛙跳上一个n级的台阶总共有多少种跳法。
{% endnote %}

示例：
 - 输入：3
 - 输出：4

```JavaScript
/** 
    假设青蛙跳上一个n级的台阶总共有f(n)种跳法。
    现在青蛙从第n个台阶往下跳，它可以跳到任意一个台阶上，所以：
    f(n)=f(n-1)+f(n-2)+...+f(1)
    f(n-1)=f(n-2)+f(n-3)+...f(1)
    将f(n-2)+...+f(1)替换为f(n-2)
    f(n)=2f(n-1)
*/

function jumpFloorII(number)
{
    if(number == 1) return 1
    return jumpFloorII(number - 1) * 2
}
```

<br/>


### 二叉树的镜像

{% note primary %}
**题目描述：**  

操作给定的二叉树，将其变换为源二叉树的镜像。
{% endnote %}

示例：
 - 说明：本题目包含复杂数据结构TreeNode，[点此查看相关信息](https://blog.nowcoder.net/n/954373f213e14eeab0a69ed0e9ef1b6e)
![WX20210107-111946.png](https://i.loli.net/2021/01/07/2ltAw5R3pvOdWSP.png)


```JavaScript
/* function TreeNode(x) {
    this.val = x;
    this.left = null;
    this.right = null;
} */
function Mirror(root) {
    if (root === null) {
        return
    }

    const { left, right } = root
    root.left = right
    root.right = left

    if (left !== null) {
        Mirror(left)
    }

    
    if (right !== null) {
        Mirror(right)
    }
}
```

<br/>


### 数组中出现次数超过一半的数字

{% note primary %}
**题目描述：**  

数组中有一个数字出现的次数超过数组长度的一半，请找出这个数字。例如输入一个长度为9的数组{1,2,3,2,2,2,5,4,2}。由于数字2在数组中出现了5次，超过数组长度的一半，因此输出2。如果不存在则输出0。
{% endnote %}

示例：
 - 输入：[1,2,3,2,2,2,5,4,2]
 - 输出：2

```JavaScript
function MoreThanHalfNum_Solution(numbers)
{
    const length = numbers.length
    const lengthMap = {}

    if (numbers.length == 0) return 0;
    if (numbers.length == 1) return numbers[0];
    
    for (let item of numbers) {
        if (!lengthMap[item]) {
            lengthMap[item] = 1
            continue
        }

        lengthMap[item] += 1
        if (lengthMap[item] > Math.floor(length / 2)) {
            return item
        }
    }

    return 0
}
```

<br/>


### 连续子数组的最大和

{% note primary %}
**题目描述：**  

输入一个整型数组，数组里有正数也有负数。数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值。要求时间复杂度为 O(n).
{% endnote %}

示例：
 - 输入：[1,-2,3,10,-4,7,2,-5]
 - 输出：18
 - 说明：输入的数组为{1,-2,3,10,—4,7,2,一5}，和最大的子数组为{3,10,一4,7,2}，因此输出为该子数组的和 18。 

```JavaScript
function FindGreatestSumOfSubArray(array)
{
    if (array.length == 0){
        return 0
    }
    
    let sum = array[0] // 保存每组的和
    let maxSum = array[0] // 连续子数组最大和
    for (let i = 1; i < array.length; i++) {
        sum = Math.max(sum + array[i], array[i]);
        maxSum = Math.max(sum, maxSum)
    }
    return maxSum
}
```

<br/>


### 二叉树的深度

{% note primary %}
**题目描述：**  

输入一棵二叉树，求该树的深度。从根结点到叶结点依次经过的结点（含根、叶结点）形成树的一条路径，最长路径的长度为树的深度。
{% endnote %}

示例：
 - 输入：{1,2,3,4,5,#,6,#,#,7}
 - 输出：4
 - 说明：本题目包含复杂数据结构TreeNode，[点此查看相关信息](https://blog.nowcoder.net/n/954373f213e14eeab0a69ed0e9ef1b6e)

```JavaScript
/* function TreeNode(x) {
    this.val = x;
    this.left = null;
    this.right = null;
} */
function TreeDepth(pRoot)
{
    if (pRoot === null) {
        return 0
    }

    const leftDeep = TreeDepth(pRoot.left)
    const rightDeep = TreeDepth(pRoot.right)

    return Math.max(leftDeep, rightDeep) + 1
}
```

<br/>


### 平衡二叉树

{% note primary %}
**题目描述：**  

输入一棵二叉树，判断该二叉树是否是平衡二叉树。
在这里，我们只需要考虑其平衡性，不需要考虑其是不是排序二叉树
平衡二叉树（Balanced Binary Tree），具有以下性质：它是一棵空树或它的左右两个子树的高度差的绝对值不超过1，并且左右两个子树都是一棵平衡二叉树。
{% endnote %}

示例：
 - 输入：{1,2,3,4,5,6,7}
 - 输出：true

```JavaScript
/* function TreeNode(x) {
    this.val = x;
    this.left = null;
    this.right = null;
} */
function IsBalanced_Solution(pRoot)
{
    if (pRoot === null) {
        return true
    }

    const leftDeep = TreeDepth(pRoot.left)
    const rightDeep = TreeDepth(pRoot.right)

    return IsBalanced_Solution(pRoot.left) 
        && IsBalanced_Solution(pRoot.right) 
        && Math.abs(leftDeep - rightDeep) <= 1
}

function TreeDepth(pRoot) {
    if (pRoot === null) {
        return 0
    }

    const leftDeep = TreeDepth(pRoot.left)
    const rightDeep = TreeDepth(pRoot.right)

    return Math.max(leftDeep, rightDeep) + 1
}
```

<br/>


### 不用加减乘除做加法

{% note primary %}
**题目描述：**  

写一个函数，求两个整数之和，要求在函数体内不得使用+、-、*、/四则运算符号。
{% endnote %}

示例：
 - 输入：1,2
 - 输出：3

{% note success %}
解法参考：[《JavaScript之二进制数》](https://www.shengshunyan.xyz/2020/12/31/JavaScript%E4%B9%8B%E4%BA%8C%E8%BF%9B%E5%88%B6%E6%95%B0/)
{% endnote %}

```JavaScript
function Add(num1, num2)
{
    if(num1 === 0) return num2
    if(num2 === 0) return num1
    return Add((num1^num2),(num1&num2) << 1)
}
```

<br/>


### 构建乘积数组

{% note primary %}
**题目描述：**  

给定一个数组A[0,1,...,n-1],请构建一个数组B[0,1,...,n-1],其中B中的元素B[i]=A[0]*A[1]*...*A[i-1]*A[i+1]*...*A[n-1]。不能使用除法。（注意：规定B[0] = A[1] * A[2] * ... * A[n-1]，B[n-1] = A[0] * A[1] * ... * A[n-2];）
对于A长度为1的情况，B无意义，故而无法构建，因此该情况不会存在。
{% endnote %}

示例：
 - 输入：[1,2,3,4,5]
 - 输出：[120,60,40,30,24]

{% note success %}
解法参考：[《剑指OFFER----66、构建乘积数组(js实现)》](https://blog.csdn.net/qq_40816360/article/details/94458810)
{% endnote %}

```JavaScript
function multiply(array)
{
    // https://blog.csdn.net/qq_40816360/article/details/94458810
    let multiplyArr = [1]

    // 左三角
    for (let i = 1; i < array.length; i++) {
        multiplyArr[i] = multiplyArr[i - 1] * array[i - 1]
    }
    
    // 右三角
    let tempNum = 1
    for (let j = multiplyArr.length - 2; j >= 0; j--) {
        tempNum = tempNum * array[j + 1]

        multiplyArr[j] = multiplyArr[j] * tempNum
    }

    return multiplyArr
}
```

<br/>


### 二叉搜索树的第k个结点

{% note primary %}
**题目描述：**  

给定一棵二叉搜索树，请找出其中的第k小的结点。
{% endnote %}

示例：
 - 输入：{5,3,7,2,4,6,8},3
 - 输出：{4}
 - 说明：按结点数值大小顺序第三小结点的值为4，本题目包含复杂数据结构TreeNode，[点此查看相关信息](https://blog.nowcoder.net/n/954373f213e14eeab0a69ed0e9ef1b6e)

{% note success %}
解法参考：[《剑指OFFER----66、构建乘积数组(js实现)》](https://blog.csdn.net/qq_40816360/article/details/94458810)
{% endnote %}

```JavaScript
/* function TreeNode(x) {
    this.val = x;
    this.left = null;
    this.right = null;
} */

// const node2 = new TreeNode(2)
// const node3 = new TreeNode(3)
// const node4 = new TreeNode(4)
// const node5 = new TreeNode(5)
// const node6 = new TreeNode(6)
// const node7 = new TreeNode(7)
// const node8 = new TreeNode(8)

// node5.left = node3
// node5.right = node7
// node3.left = node2
// node3.right = node4
// node7.left = node6
// node7.right = node8

// 使用树的中序遍历
function KthNode(pRoot, k)
{
    const arr = []
    const formatArr = node => {
        if (node === null) {
            return
        }

        formatArr(node.left)
        arr.push(node)
        if (arr.length >= k) {
            return
        }
        formatArr(node.right)
    }

    formatArr(pRoot)

    return arr[k - 1]
}
```

<br/>


## 中等

### 重建二叉树

{% note primary %}
**题目描述：**  

输入某二叉树的前序遍历和中序遍历的结果，请重建出该二叉树。假设输入的前序遍历和中序遍历的结果中都不含重复的数字。例如输入前序遍历序列{1,2,4,7,3,5,6,8}和中序遍历序列{4,7,2,1,5,3,8,6}，则重建二叉树并返回。
{% endnote %}

示例：
 - 输入：[1,2,3,4,5,6,7],[3,2,4,1,6,5,7]
 - 输出：{1,2,5,3,4,6,7}
 - 说明：本题目包含复杂数据结构TreeNode，[点此查看相关信息](https://blog.nowcoder.net/n/954373f213e14eeab0a69ed0e9ef1b6e)


```JavaScript
function TreeNode(x) {
    this.val = x;
    this.left = null;
    this.right = null;
}

function reConstructBinaryTree(pre, vin)
{
    if (pre.length === 0) {
        return null
    }

    if (pre.length === 1) {
        return new TreeNode(pre[0])
    }

    const parentNodeVal = pre.shift()
    const vinParentNodeValIndex = vin.findIndex(item => item === parentNodeVal)

    const leftVin = vin.slice(0, vinParentNodeValIndex)
    const leftPre = pre.slice(0, leftVin.length)
    const rightVin = vin.slice(vinParentNodeValIndex + 1, vin.length)
    const rightPre = pre.slice(leftVin.length, pre.length)

    const parentNode = new TreeNode(parentNodeVal)

    parentNode.left = reConstructBinaryTree(leftPre, leftVin)
    parentNode.right = reConstructBinaryTree(rightPre, rightVin)

    return parentNode
}
```

<br/>


### 跳台阶

{% note primary %}
**题目描述：**  

一只青蛙一次可以跳上1级台阶，也可以跳上2级。求该青蛙跳上一个n级的台阶总共有多少种跳法（先后次序不同算不同的结果）。
{% endnote %}

示例：
 - 输入：1
 - 输出：1
 - 输入：4
 - 输出：5


```JavaScript
function jumpFloor(number) {
    if (number === 1) {
        return 1
    }

    if (number === 2) {
        return 2
    }

    let num1 = 1
    let num2 = 2
    for (let i = 3; i <= number; i++) {
        num2 = num1 + num2
        num1 = num2 - num1
    }

    return num2
}
```

<br/>


### 二进制中1的个数

{% note primary %}
**题目描述：**  

输入一个整数，输出该数32位二进制表示中1的个数。其中负数用补码表示。
{% endnote %}

示例：
 - 输入：10
 - 输出：2


```JavaScript
// 由于负数右移时最高位补1，因此不能采用算术右移，而使用不考虑符号位的逻辑右移。先判断最右边一位是不是1，接着右移一位，再判断，这样每次移动一位直到整数变成0为止
function NumberOf1(n) {
    let result = 0
    while (n != 0) {
        if (n & 1) {
            result++
        }
        n = n >>> 1
    }

    return result
}
```

<br/>


### 数值的整数次方

{% note primary %}
**题目描述：**  

给定一个double类型的浮点数base和int类型的整数exponent。求base的exponent次方。

保证base和exponent不同时为0
{% endnote %}

示例：
 - 输入：2,3
 - 输出：8.00000

{% note success %}
思路：
快速幂算法，举个例子：
3 ^ 999 = 3 * 3 * 3 * … * 3
直接乘要做998次乘法。但事实上可以这样做，先求出2 ^ k次幂：
3 ^ 2 = 3 * 3
3 ^ 4 = (3 ^ 2) * (3 ^ 2)
3 ^ 8 = (3 ^ 4) * (3 ^ 4)
3 ^ 16 = (3 ^ 8) * (3 ^ 8)
3 ^ 32 = (3 ^ 16) * (3 ^ 16)
3 ^ 64 = (3 ^ 32) * (3 ^ 32)
3 ^ 128 = (3 ^ 64) * (3 ^ 64)
3 ^ 256 = (3 ^ 128) * (3 ^ 128)
3 ^ 512 = (3 ^ 256) * (3 ^ 256)
再相乘：
3 ^ 999 = 3 ^ (512 + 256 + 128 + 64 + 32 + 4 + 2 + 1) 
= (3 ^ 512) * (3 ^ 256) * (3 ^ 128) * (3 ^ 64) * (3 ^ 32) * (3 ^ 4) * (3 ^ 2) * 3
这样只要做16次乘法。即使加上一些辅助的存储和运算，也比直接乘高效得多（尤其如果这里底数是成百上千位的大数字的话）。
我们发现，把999转为2进制数：1111100111，其各位就是要乘的数。这提示我们利用求二进制位的算法（其中mod是模运算）：
{% endnote %}



```JavaScript
function Power(base, exponent) {
    if (base === 0) {
        return 0
    }

    if (exponent === 0) {
        return 1
    }

    let positiveExponent = Math.abs(exponent)
    let result = 1
    while (positiveExponent !== 0) {
        if (positiveExponent & 1) {
            result = result * base
        }
        base = base * base
        positiveExponent = positiveExponent >> 1
    }

    return exponent > 0 ? result : 1 / result
}
```

<br/>