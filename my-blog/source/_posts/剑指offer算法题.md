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


### 旋转数组的最小数字

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


### 合并两个排序的链表

{% note primary %}
**题目描述：**  

输入两个单调递增的链表，输出两个链表合成后的链表，当然我们需要合成后的链表满足单调不减规则。
{% endnote %}

示例：
 - 输入：{1,3,5},{2,4,6}
 - 输出：{1,2,3,4,5,6}
 - 说明：本题目包含复杂数据结构ListNode，[点此查看相关信息](https://blog.nowcoder.net/n/954373f213e14eeab0a69ed0e9ef1b6e)

```JavaScript
// function ListNode(x) {
//     this.val = x;
//     this.next = null;
// }

// const node1 = new ListNode(1)
// const node3 = new ListNode(3)
// const node5 = new ListNode(5)
// node1.next = node3
// node3.next = node5

// const node2 = new ListNode(2)
// const node4 = new ListNode(4)
// const node6 = new ListNode(6)
// node2.next = node4
// node4.next = node6

function Merge(pHead1, pHead2) {
    if (!pHead1) {
        return pHead2;
    }
    if (!pHead2) {
        return pHead1;
    }
    let head;
    if (pHead1.val < pHead2.val) {
        head = pHead1;
        head.next = Merge(pHead1.next, pHead2);
    } else {
        head = pHead2;
        head.next = Merge(pHead1, pHead2.next);
    }
    return head;
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
**解题思路：**

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


### 反转链表

{% note primary %}
**题目描述：**  

输入一个链表，反转链表后，输出新链表的表头。
{% endnote %}

示例：
 - 输入：{1,2,3}
 - 输出：{3,2,1}


```JavaScript
// function ListNode(x){
//     this.val = x;
//     this.next = null;
// }

// const node1 = new ListNode(1)
// const node2 = new ListNode(2)
// const node3 = new ListNode(3)

// node1.next = node2
// node2.next = node3

function ReverseList(pHead) {
    const recursionReverse = (nodeOne, nodeTwo) => {
        const nextNode = nodeTwo.next
        nodeTwo.next = nodeOne

        if (nextNode === null) {
            return nodeTwo
        }

        return recursionReverse(nodeTwo, nextNode)
    }

    if (pHead === null) {
        return null
    }

    return recursionReverse(null, pHead)
}
```


### 栈的压入、弹出序列

{% note primary %}
**题目描述：**  

输入两个整数序列，第一个序列表示栈的压入顺序，请判断第二个序列是否可能为该栈的弹出顺序。假设压入栈的所有数字均不相等。例如序列1,2,3,4,5是某栈的压入顺序，序列4,5,3,2,1是该压栈序列对应的一个弹出序列，但4,3,5,1,2就不可能是该压栈序列的弹出序列。（注意：这两个序列的长度是相等的）
{% endnote %}

示例：
 - 输入：[1,2,3,4,5],[4,3,5,1,2]
 - 输出：false


```JavaScript
// for循环压栈，while循环出栈
function IsPopOrder(pushV, popV)
{
    const stack = []
    let popVIndex = 0

    for (let i = 0; i < pushV.length; i++) {
        stack.push(pushV[i])
        
        while (stack.length > 0 && stack[stack.length - 1] === popV[popVIndex]) {
            stack.pop()
            popVIndex++
        }
    }
    return stack.length === 0
}
```

<br/>


### 二叉搜索树与双向链表

{% note primary %}
**题目描述：**  

输入一棵二叉搜索树，将该二叉搜索树转换成一个排序的双向链表。要求不能创建任何新的结点，只能调整树中结点指针的指向。
{% endnote %}

示例：
 - 说明：本题目包含复杂数据结构TreeNode，[点此查看相关信息](https://blog.nowcoder.net/n/954373f213e14eeab0a69ed0e9ef1b6e)

{% note success %}
**解题思路：**基础的递归

1. 构建左子树为双向链表，返回链表中一个节点
2. 移动返回节点到最右端，与当前节点连接
3. 构建右子树为双向链表，返回链表中一个节点
4. 移动返回节点到最左端，与当前节点连接
{% endnote %}

```JavaScript
// function TreeNode(x) {
//     this.val = x;
//     this.left = null;
//     this.right = null;
// }

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

// 获取链表中的某个节点，然后移动到链表的最左端返回
function Convert(pRootOfTree) {
    // 临界判断
    if (pRootOfTree === null) {
        return null
    }

    let resultNode = ConvertNode(pRootOfTree)
    while (resultNode.left) {
        resultNode = resultNode.left
    }

    return resultNode
}

// 构建链表
function ConvertNode(node) {
    if (node === null) {
        return null
    }

    if (node.left) {
        let returnNode = ConvertNode(node.left)
        if (returnNode.right) {
            returnNode = returnNode.right
        }
        returnNode.right = node
        node.left = returnNode
    }
    if (node.right) {
        let returnNode = ConvertNode(node.right)
        if (returnNode.left) {
            returnNode = returnNode.left
        }
        returnNode.left = node
        node.right = returnNode
    }

    return node
}
```

<br/>

### 整数中1出现的次数（从1到n整数中1出现的次数）

{% note primary %}
**题目描述：**  

求出1~13的整数中1出现的次数,并算出100~1300的整数中1出现的次数？为此他特别数了一下1~13中包含1的数字有1、10、11、12、13因此共出现6次,但是对于后面问题他就没辙了。ACMer希望你们帮帮他,并把问题更加普遍化,可以很快的求出任意非负整数区间中1出现的次数（从1 到 n 中1出现的次数）。
{% endnote %}

示例：
 - 输入：13
 - 输出：6

{% note success %}
**解题思路：**

像类似这样的问题，我们可以通过归纳总结来获取相关的东西。

首先可以先分类：

***个位***
我们知道在个位数上，1会每隔10出现一次，例如1、11、21等等，我们发现以10为一个阶梯的话，每一个完整的阶梯里面都有一个1，例如数字22，按照10为间隔来分三个阶梯，在完整阶梯0-9，10-19之中都有一个1，但是19之后有一个不完整的阶梯，我们需要去判断这个阶梯中会不会出现1，易推断知，如果最后这个露出来的部分小于1，则不可能出现1（这个归纳换做其它数字也成立）。

我们可以归纳个位上1出现的个数为：

n/10 * 1+(n%10!=0 ? 1 : 0)

***十位***
现在说十位数，十位数上出现1的情况应该是10-19，依然沿用分析个位数时候的阶梯理论，我们知道10-19这组数，每隔100出现一次，这次我们的阶梯是100，例如数字317，分析有阶梯0-99，100-199，200-299三段完整阶梯，每一段阶梯里面都会出现10次1（从10-19），最后分析露出来的那段不完整的阶梯。我们考虑如果露出来的数大于19，那么直接算10个1就行了，因为10-19肯定会出现；如果小于10，那么肯定不会出现十位数的1；如果在10-19之间的，我们计算结果应该是k - 10 + 1。例如我们分析300-317，17个数字，1出现的个数应该是17-10+1=8个。

那么现在可以归纳：十位上1出现的个数为：

设k = n % 100，即为不完整阶梯段的数字
归纳式为：(n / 100) * 10 + (if(k > 19) 10 else if(k < 10) 0 else k - 10 + 1)

***百位***
现在说百位1，我们知道在百位，100-199都会出现百位1，一共出现100次，阶梯间隔为1000，100-199这组数，每隔1000就会出现一次。这次假设我们的数为2139。跟上述思想一致，先算阶梯数 * 完整阶梯中1在百位出现的个数，即n/1000 * 100得到前两个阶梯中1的个数，那么再算漏出来的部分139，沿用上述思想，不完整阶梯数k199，得到100个百位1，100<=k<=199则得到k - 100 + 1个百位1。

那么继续归纳百位上出现1的个数：

设k = n % 1000
归纳式为：(n / 1000) * 100 + (if(k >199) 100 else if(k < 100) 0 else k - 100 + 1)
后面的依次类推....

再次回顾个位
我们把个位数上算1的个数的式子也纳入归纳式中

k = n % 10
个位数上1的个数为：n / 10 * 1 + (if(k > 1) 1 else if(k < 1) 0 else k - 1 + 1)
完美！归纳式看起来已经很规整了。 来一个更抽象的归纳，设i为计算1所在的位数，i=1表示计算个位数的1的个数，10表示计算十位数的1的个数等等。

k = n % (i * 10)
count(i) = (n / (i * 10)) * i + (if(k > i * 2 - 1) i else if(k < i) 0 else k - i + 1)
好了，这样从10到10的n次方的归纳就完成了。
{% endnote %}

```JavaScript
function NumberOf1Between1AndN_Solution(n)
{
    if (n <= 0) {
        return 0
    }

    let mod
    let res = 0
    for (let i = 1; i <= n; i *= 10) {
        res += Math.floor(n / (i * 10)) * i
        mod = n % (i * 10)
        if (mod > i * 2 - 1) {
            res += i
        } else if (mod >= i && mod <= i * 2 - 1) {
            res += (mod - i + 1)
        }
    }

    return res
}
```

<br/>


### 两个链表的第一个公共结点

{% note primary %}
**题目描述：**  

输入两个链表，找出它们的第一个公共结点。（注意因为传入数据是链表，所以错误测试数据的提示是用其他方式显示的，保证传入数据是正确的）
{% endnote %}

示例：

{% note success %}
**解题思路：**

有公共节点的链表就一定有同样的尾节点

先获得两个链表的长度，然后在较长的链表上先走若干步(两链表长度之差)，接着同时在两个链表上遍历，找到的第一个相同的节点就是他们的第一个公共节点。时间复杂度O(m + n)
{% endnote %}

```JavaScript
// function ListNode(x) {
//     this.val = x;
//     this.next = null;
// }

// const node1 = new ListNode(1)
// const node2 = new ListNode(2)
// const node3 = new ListNode(3)
// const node4 = new ListNode(4)
// const node5 = new ListNode(5)
// const node6 = new ListNode(6)
// const node7 = new ListNode(7)

// node1.next = node2
// node2.next = node3
// node3.next = node4
// node4.next = node7

// node5.next = node6
// node6.next = node4
// node4.next = node7


function FindFirstCommonNode(pHead1, pHead2) {
    if (!pHead1 && !pHead2) {
        return null
    }

    const listOneLength = getListLength(pHead1)
    const listTwoLength = getListLength(pHead2)

    for (let i = 0; i < Math.abs(listOneLength - listTwoLength); i++) {
        if (listOneLength - listTwoLength > 0) {
            pHead1 = pHead1.next
        } else {
            pHead2 = pHead2.next
        }
    }

    while (pHead1 !== pHead2) {
        pHead1 = pHead1.next
        pHead2 = pHead2.next
    }

    return pHead1
}

function getListLength(pHead) {
    let length = 1
    while (pHead.next) {
        length++
        pHead = pHead.next
    }

    return length
}
```

<br/>


### 数字在升序数组中出现的次数

{% note primary %}
**题目描述：**  

统计一个数字在升序数组中出现的次数。
{% endnote %}

示例：
 - 输入：[1,2,3,3,3,3,4,5],3
 - 输出：4

{% note success %}
**解题思路：**

用二分法查找数字出现的头尾索引index，再最后减一下就ok了
{% endnote %}

```JavaScript
function GetNumberOfK(data, k) {
    if (data.length === 0 || data[0] > k || data[data.length - 1] < k) {
        return 0
    }

    const minIndex = getMinIndex(data, k)
    if (minIndex < 0) {
        return 0
    }
    const maxIndex = getMaxIndex(data, k)
    return maxIndex - minIndex + 1
}

function getMinIndex(data, k) {
    let firstIndex = 0
    let lastIndex = data.length - 1
    let index = Math.floor(data.length / 2)

    if (data[0] === k) {
        return 0
    }
    while (true) {
        if (data[index] === k && data[index - 1] < k) {
            return index
        }
        if (data[index] < k) {
            firstIndex = index
        }
        if (data[index] >= k) {
            lastIndex = index
        }
        if (index === Math.floor((firstIndex + lastIndex) / 2)) {
            return -1
        }
        index = Math.floor((firstIndex + lastIndex) / 2)
    }
}

function getMaxIndex(data, k) {
    let firstIndex = 0
    let lastIndex = data.length - 1
    let index = Math.floor(data.length / 2)

    if (data[data.length - 1] === k) {
        return data.length - 1
    }
    while (true) {
        if (data[index] === k && data[index + 1] > k) {
            return index
        }
        if (data[index] > k) {
            lastIndex = index
        }
        if (data[index] <= k) {
            firstIndex = index
        }
        index = Math.floor((firstIndex + lastIndex) / 2)
    }
}
```

<br/>


### 和为S的连续正数序列

{% note primary %}
**题目描述：**  

小明很喜欢数学,有一天他在做数学作业时,要求计算出9~16的和,他马上就写出了正确答案是100。但是他并不满足于此,他在想究竟有多少种连续的正数序列的和为100(至少包括两个数)。没多久,他就得到另一组连续正数和为100的序列:18,19,20,21,22。现在把问题交给你,你能不能也很快的找出所有和为S的连续正数序列? Good Luck!
{% endnote %}

示例：
 - 输入：9
 - 输出：[[2,3,4],[4,5]]

{% note success %}
**解题思路：**

n项连续数字的和的表达式是：x + (x + 1) + (x + 2) + ... + (x + n - 1) = nx + n(n - 1) / 2

根据 nx + n(n - 1) / 2 = sum 求解 x 的表达式：x = (sum - n(n - 1) / 2) / n

n从Math.ceil(sum / 2)往下遍历，如果x是正整数，就是一组合理的解
{% endnote %}

```JavaScript
function FindContinuousSequence(sum) {
    const resultArr = []
    for (let numQuantity = Math.ceil(sum / 2); numQuantity > 1; numQuantity--) {
        const baseNum = (sum - numQuantity * (numQuantity - 1) / 2) / numQuantity
        if (baseNum % 1 !== 0) {
            continue
        }

        if (baseNum <= 0) {
            continue
        }

        const resultItem = []
        for (let i = 0; i < numQuantity; i++) {
            resultItem.push(baseNum + i)
        }
        resultArr.push(resultItem)
    }

    return resultArr
}
```

<br/>


### 和为S的两个数字

{% note primary %}
**题目描述：**  

输入一个递增排序的数组和一个数字S，在数组中查找两个数，使得他们的和正好是S，如果有多对数字的和等于S，输出两个数的乘积最小的。
{% endnote %}

示例：
 - 输入：[1,2,4,7,11,15],15
 - 输出：[4,11]

{% note success %}
**解题思路：**

双指针，从数组头尾开始向里逼近
{% endnote %}

```JavaScript
function FindNumbersWithSum(array, sum) {
    let left = 0
    let right = array.length - 1

    while (left < right) {
        if (array[left] + array[right] < sum) {
            left++
        } else if (array[left] + array[right] > sum) {
            right--
        } else {
            return [array[left], array[right]]
        }
    }

    return []
}
```

<br/>


### 孩子们的游戏(圆圈中最后剩下的数)

{% note primary %}
**题目描述：**  

每年六一儿童节,牛客都会准备一些小礼物去看望孤儿院的小朋友,今年亦是如此。HF作为牛客的资深元老,自然也准备了一些小游戏。其中,有个游戏是这样的:首先,让小朋友们围成一个大圈。然后,他随机指定一个数m,让编号为0的小朋友开始报数。每次喊到m-1的那个小朋友要出列唱首歌,然后可以在礼品箱中任意的挑选礼物,并且不再回到圈中,从他的下一个小朋友开始,继续0...m-1报数....这样下去....直到剩下最后一个小朋友,可以不用表演,并且拿到牛客名贵的“名侦探柯南”典藏版(名额有限哦!!^_^)。请你试着想下,哪个小朋友会得到这份礼品呢？(注：小朋友的编号是从0到n-1)

如果没有小朋友，请返回-1
{% endnote %}

示例：
 - 输入：5,3
 - 输出：3

{% note success %}
**解题思路：**

我们知道第一个人(编号一定是 m%n-1) 出列之后，剩下的 n-1 个人组成了一个新的约瑟夫环（以编号为 k=m%n 的人开始）:

k k+1 k+2 ... n-2, n-1, 0, 1, 2, ... k-2 并且从 k 开始报 0。

现在我们把他们的编号做一下转换***（x' --> x）***：

***k --> 0
k+1 --> 1
k+2 --> 2
...
k-2 --> n-2
k-1 --> n-1***

变换后就完完全全成为了(n-1)个人报数的子问题，假如 x 是最终的胜利者，那么根据上面这个表，由本层（n-1）序号 x 推导到上一层（n）序号 x'的公式是

***x'=(x+k)%n***

所以有递推公式

***f(1)=0
...
f(i)=[f(i-1)+m]%i***

{% endnote %}

```JavaScript
function LastRemaining_Solution(n, m) {
    if (m <= 0) {
        return -1
    }
    let result = 0
    for (let i = 2; i <= n; i++) {
        result = (result + m) % i
    }

    return result
}

```

<br/>


### 表示数值的字符串

{% note primary %}
**题目描述：**  

请实现一个函数用来判断字符串是否表示数值（包括整数和小数）。例如，字符串"+100","5e2","-123","3.1416"和"-1E-16"都表示数值。 但是"12e","1a3.14","1.2.3","+-5"和"12e+4.3"都不是。
{% endnote %}

示例：
 - 输入："123.45e+6"
 - 输出：true
 - 输入："1.2.3"
 - 输出：false

```JavaScript
function isNumeric(s) {
    return /^[\+-]?\d*(\.\d+)?(e[\+-]?\d+)?$/i.test(s)
}
```

<br/>


### 链表中环的入口结点

{% note primary %}
**题目描述：**  

给一个链表，若其中包含环，请找出该链表的环的入口结点，否则，输出null。
{% endnote %}

示例：
 - 说明：本题目包含复杂数据结构ListNode，[点此查看相关信息](https://blog.nowcoder.net/n/954373f213e14eeab0a69ed0e9ef1b6e)

{% note success %}
**解题思路：**

快慢指针相遇

![WechatIMG22.jpeg](https://i.loli.net/2021/02/23/l9fIAbOuY5KsrVd.jpg)
{% endnote %}

```JavaScript
// function ListNode(x) {
//     this.val = x;
//     this.next = null;
// }

// const node1 = new ListNode(1)
// const node2 = new ListNode(2)
// const node3 = new ListNode(3)
// const node4 = new ListNode(4)
// const node5 = new ListNode(5)
// const node6 = new ListNode(6)

// node1.next = node2
// node2.next = node3
// node3.next = node4
// node4.next = node5
// node5.next = node6
// node6.next = node3

function EntryNodeOfLoop(pHead) {
    if (!pHead || !pHead.next || !pHead.next.next) return null

    let slow = pHead.next
    let fast = pHead.next.next
    while (slow !== fast) {
        slow = slow.next
        fast = fast.next.next

        if (!slow || !fast) {
            return null
        }
    }

    slow = pHead
    while (slow !== fast) {
        slow = slow.next
        fast = fast.next 
    }

    return slow
}
```

<br/>


### 二叉树的下一个结点

{% note primary %}
**题目描述：**  

给定一个二叉树和其中的一个结点，请找出中序遍历顺序的下一个结点并且返回。注意，树中的结点不仅包含左右子结点，同时包含指向父结点的指针。
{% endnote %}

示例：
 - 说明：本题目包含复杂数据结构TreeLinkNode，[点此查看相关信息](https://blog.nowcoder.net/n/954373f213e14eeab0a69ed0e9ef1b6e)

```JavaScript
/*function TreeLinkNode(x){
    this.val = x;
    this.left = null;
    this.right = null;
    this.next = null;
}*/

function GetNext(pNode) {
    if (!pNode) {
        return null
    }

    // 判断是否有右子节点
    if (pNode.right) {
        let nextNode = pNode.right
        while (nextNode.left) {
            nextNode = nextNode.left
        }
        return nextNode
    }

    // 向上遍历到为左子节点为止
    while (pNode.next) {
        if (pNode.next.left === pNode) {
            return pNode.next
        }
        pNode = pNode.next
    }

    return null
}
```

<br/>


### 把二叉树打印成多行

{% note primary %}
**题目描述：**  

从上到下按层打印二叉树，同一层结点从左至右输出。每一层输出一行。
{% endnote %}

示例：
 - 输入：{8,6,10,5,7,9,11}
 - 输出：[[8],[6,10],[5,7,9,11]]
 - 说明：本题目包含复杂数据结构TreeNode，[点此查看相关信息](https://blog.nowcoder.net/n/954373f213e14eeab0a69ed0e9ef1b6e)

```JavaScript
// function TreeNode(x) {
//     this.val = x;
//     this.left = null;
//     this.right = null;
// }

// const node5 = new TreeNode(5)
// const node6 = new TreeNode(6)
// const node7 = new TreeNode(7)
// const node8 = new TreeNode(8)
// const node9 = new TreeNode(9)
// const node10 = new TreeNode(10)
// const node11 = new TreeNode(11)

// node8.left = node6
// node8.right = node10
// node6.left = node5
// node6.right = node7
// node10.left = node9
// node10.right = node11

function Print(pRoot) {
    if (!pRoot) {
        return []
    }

    const nodeList = [[pRoot]]
    while (true) {
        const currentItem = nodeList[nodeList.length - 1]
        const nextItem = []
        for (let i = 0; i < currentItem.length; i++) {
            if (currentItem[i].left) {
                nextItem.push(currentItem[i].left)
            }
            if (currentItem[i].right) {
                nextItem.push(currentItem[i].right)
            }
        }
        if (nextItem.length === 0) {
            break
        }
        nodeList.push(nextItem)
    }
    return nodeList.map(item => item.map(childItem => childItem.val))
}
```

<br/>


### 剪绳子

{% note primary %}
**题目描述：**  

给你一根长度为n的绳子，请把绳子剪成整数长的m段（m、n都是整数，n>1并且m>1，m<=n），每段绳子的长度记为k[1],...,k[m]。请问k[1]x...xk[m]可能的最大乘积是多少？例如，当绳子的长度是8时，我们把它剪成长度分别为2、3、3的三段，此时得到的最大乘积是18。
{% endnote %}

示例：
 - 输入：8
 - 输出：18

{% note success %}
**解题思路：**

看到这种求最优解的题型，你就应该思考一下动态规划是否适合。这个绳子我可以一次一次的剪，第一次剪成两段，这就变成两根新绳子，只要我分别知道这两根新绳子最大的乘积，那么我就知道了整条绳子的最大乘积了，这就将一个问题，划分为两个子问题了，且各子问题之间相互独立，满足最优子结构，因此可以使用动态规划

首先确定边界条件和状态转移方程：

当绳子长度为1时，最大乘积为0
当绳子长度为2时，可以剪成1*1，最大乘积为1
当绳子长度为3时，可以剪成（1*2，1*1*1），最大乘积为2
当绳子长度为4时，可以剪成（1*1*1*1, 1*2*1, 2*2, 1*3），最大乘积为4
当绳子长度为5时，可以剪成（1*1*1*1*1， 1*2*2， 3*2, 1*2*1*1, 1*3*1，1*4），最大乘积为6

我们可以看到，当绳子长度n大于等于4时，f(n) = max( f(i) * f(n-i) )，其中1 < i <= [n/2]，因此我们可以用遍历来实现状态转移方程
{% endnote %}

```JavaScript
function cutRope(number) {
    if (number === 1) return 0
    if (number === 2) return 1
    if (number === 3) return 2

    const resultList = [0, 1, 2, 3]
    for (let i = 4; i <= number; i++) {
        resultList[i] = 0;
        for (let j = 1; j <= number / 2; j++) {
            if (resultList[i] < resultList[j] * resultList[i - j]) {
                resultList[i] = resultList[j] * resultList[i - j];
            }
        }
    }
    return resultList[number]
}
```

<br/>


### 链表中倒数第k个结点

{% note primary %}
**题目描述：**  

输入一个链表，输出该链表中倒数第k个结点。
{% endnote %}

示例：
 - 输入：{1,2,3,4,5},1
 - 输出：{5}

```JavaScript
// function ListNode(x) {
//     this.val = x;
//     this.next = null;
// }

// const node1 = new ListNode(1)
// const node2 = new ListNode(2)
// const node3 = new ListNode(3)
// const node4 = new ListNode(4)
// const node5 = new ListNode(5)

// node1.next = node2
// node2.next = node3
// node3.next = node4
// node4.next = node5

function FindKthToTail(pHead, k) {
    if (!pHead) return null

    let slowIndex = pHead
    let quickIndex = pHead

    while (k > 0) {
        if (!quickIndex) {
            return null
        }

        quickIndex = quickIndex.next
        k--
    }

    while (quickIndex) {
        slowIndex = slowIndex.next
        quickIndex = quickIndex.next
    }

    return slowIndex
}
```

<br/>


## 较难

### 二维数组中的查找

{% note primary %}
**题目描述：**  

在一个二维数组中（每个一维数组的长度相同），每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。
{% endnote %}

示例：
 - 输入：7,[[1,2,8,9],[2,4,9,12],[4,7,10,13],[6,8,11,15]]
 - 输出：true

{% note success %}
**解题思路：**

方法一：从左下角开始查找，小了往右，大了往上

方法二：从右上角开始查找，小了往下，大了往左
{% endnote %}

```JavaScript
function cutRope(number) {
    if (array.length <=0) {
        return false
    }

    let i = 0
    let j = array.length - 1

    while (i < array[0].length && j > 0) {
        if (array[j][i] > target) {
            j--
            continue
        } else if (array[j][i] < target) {
            i++
            continue
        } else {
            return true
        }
    }

    return false
}
```

<br/>


### 顺时针打印矩阵

{% note primary %}
**题目描述：**  

输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字，例如，如果输入如下4 X 4矩阵： 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 则依次打印出数字1,2,3,4,8,12,16,15,14,13,9,5,6,7,11,10.
{% endnote %}

示例：
 - 输入：[[1,2],[3,4]]
 - 输出：[1,2,4,3]

{% note success %}
**解题思路：**

左右上下四个指针往内渐逼
{% endnote %}

```JavaScript
function cutRope(number) {
    const arr = []
    let left = 0
    let right = matrix[0].length - 1
    let top = 0
    let bottom = matrix.length - 1

    while (left <= right && top <= bottom) {
        for (let i = left;i <= right; i++) {
            arr.push(matrix[top][i])
        }
        top++
        
        for (let i = top; i <= bottom; i++) {
            arr.push(matrix[i][right])
        }
        right--

        if (left > right || top > bottom) {
            break
        }
    
        for (let i = right; i >= left; i--) {
            arr.push(matrix[bottom][i])
        }
        bottom--
    
        for (let i = bottom; i >= top; i--) {
            arr.push(matrix[i][left])
        }
        left++
    }

    return arr
}
```

<br/>


### 树的子结构

{% note primary %}
**题目描述：**  

输入两棵二叉树A，B，判断B是不是A的子结构。（ps：我们约定空树不是任意一个树的子结构）
{% endnote %}

示例：
 - 输入：{8,8,#,9,#,2,#,5},{8,9,#,2}
 - 输出：true
 - 说明：本题目包含复杂数据结构TreeNode，[点此查看相关信息](https://blog.nowcoder.net/n/954373f213e14eeab0a69ed0e9ef1b6e)

{% note success %}
**解题思路：**

遍历到值相同的节点，再进入判断是否会是子树的逻辑
{% endnote %}

```JavaScript
// function TreeNode(x) {
//     this.val = x;
//     this.left = null;
//     this.right = null;
// }

// const node1 = new TreeNode(8)
// const node2 = new TreeNode(8)
// const node3 = new TreeNode(9)
// const node4 = new TreeNode(2)
// const node5 = new TreeNode(5)
// node1.left = node2
// node2.left = node3
// node3.left = node4
// node4.left = node5

// const node6 = new TreeNode(8)
// const node7 = new TreeNode(9)
// const node8 = new TreeNode(2)
// node6.left = node7
// node7.left = node8

function isSub(node1, node2) {
    if (node2 === null) return true
    if (node1 === null) return false
    if (node1.val === node2.val) {
        return isSub(node1.left, node2.left) && isSub(node1.right, node2.right)
    } else {
        return false
    }
}

function HasSubtree(pRoot1, pRoot2) {
    if (!pRoot1 || !pRoot2) {
        return false
    }

    if (pRoot1.val === pRoot2.val) {
        if (isSub(pRoot1, pRoot2)) {
            return true
        }
    }

    return HasSubtree(pRoot1.left, pRoot2) || HasSubtree(pRoot1.right, pRoot2)
}
```

<br/>


### 二叉搜索树的后序遍历序列

{% note primary %}
**题目描述：**  

输入一个整数数组，判断该数组是不是某二叉搜索树的后序遍历的结果。如果是则返回true,否则返回false。假设输入的数组的任意两个数字都互不相同。
{% endnote %}

示例：
 - 输入：[4,8,6,12,16,14,10]
 - 输出：true

{% note success %}
**解题思路：**

先找到左右子树的分界点，从左至右第一个大于根节点的节点，然后判断最后的点是否都大于根节点；
上一步成立之后，再递归判断各自左右子树是不是搜索二叉树
{% endnote %}

```JavaScript
function curryVerify(sequence) {
    let index = 0
    const leftTree = []
    const rightTree = []
    const rootNode = sequence.pop()

    for (;index < sequence.length; index++) {
        if (sequence[index] > rootNode) {
            break
        }
        leftTree.push(sequence[index])
    }

    for (;index < sequence.length; index++) {
        if (sequence[index] < rootNode) {
            return false
        }
        rightTree.push(sequence[index])
    }

    if (leftTree.length === 0 && rightTree.length === 0) {
        return true  
    }  

    return curryVerify(leftTree) && curryVerify(rightTree)
}

function VerifySquenceOfBST(sequence) {
    if (!sequence.length) return false

    return curryVerify(sequence)
}
```

<br/>


### 二叉树中和为某一值的路径

{% note primary %}
**题目描述：**  

输入一颗二叉树的根节点和一个整数，按字典序打印出二叉树中结点值的和为输入整数的所有路径。路径定义为从树的根结点开始往下一直到叶结点所经过的结点形成一条路径。
{% endnote %}

示例：
 - 输入：{10,5,12,4,7}, 22
 - 输出：[[10,5,7],[10,12]]
 - 输入：{10,5,12,4,7}, 15
 - 输出：[]

{% note success %}
**解题思路：**

用递归计算从叶节点开始的，各种和的路径，最终得到根节点的各种和的路径
{% endnote %}

```JavaScript
function curryCalcCountMap(node) {
    if (!node.left && !node.right) {
        const countMap = {
            [node.val]: [[node.val]]
        }
        return countMap
    }
    
    const countMap = {}
    if (node.left) {
        const leftNodeCountMap = curryCalcCountMap(node.left)
        for (let key of Object.keys(leftNodeCountMap)) {
            countMap[Number(key) + node.val] = leftNodeCountMap[key].map(item => [node.val, ...item])
        }
    }
    if (node.right) {
        const rightNodeCountMap = curryCalcCountMap(node.right)
        for (let key of Object.keys(rightNodeCountMap)) {
            if (countMap[Number(key) + node.val]) {
                countMap[Number(key) + node.val].push(...rightNodeCountMap[key].map(item => [node.val, ...item]))
            } else {
                countMap[Number(key) + node.val] = rightNodeCountMap[key].map(item => [node.val, ...item])
            }
        }
    }

    return countMap
}

function FindPath(root, expectNumber) {
    if (!root) return []

    const countMap = curryCalcCountMap(root)
    return countMap[expectNumber] ? countMap[expectNumber] : []
}
```

<br/>


### 复杂链表的复制

{% note primary %}
**题目描述：**  

输入一个复杂链表（每个节点中有节点值，以及两个指针，一个指向下一个节点，另一个特殊指针random指向一个随机节点），请对此链表进行深拷贝，并返回拷贝后的头结点。（注意，输出结果中请不要返回参数中的节点引用，否则判题程序会直接返回空）
{% endnote %}

示例：
 - 说明：本题目包含复杂数据结构ListNode、RandomListNode，[点此查看相关信息](https://blog.nowcoder.net/n/954373f213e14eeab0a69ed0e9ef1b6e)

{% note success %}
**解题思路：**

在主链路上复制节点的时候，建一个旧节点到新节点的指针，方便之后复制random指针使用
{% endnote %}

```JavaScript
// function RandomListNode(x) {
//     this.label = x;
//     this.next = null;
//     this.random = null;
// }

// const node1 = new RandomListNode(1)
// const node2 = new RandomListNode(2)
// const node3 = new RandomListNode(3)
// const node4 = new RandomListNode(4)
// node1.next = node2
// node2.next = node3
// node3.next = node4
// node1.random = node3
// node2.random = node1
// node3.random = node4
// node4.random = node3

function Clone(pHead) {
    let newPHead = null
    let oldCurrentNode = pHead
    let newCurrentNode = null
    let newPreNode = null

    // 先复制主链路节点，并在原节点上添加新节点的引用
    while (oldCurrentNode) {
        newCurrentNode = new RandomListNode(oldCurrentNode.label)
        if (newPreNode) {
            newPreNode.next = newCurrentNode
        } else {
            newPHead = newCurrentNode
        }
        newPreNode = newCurrentNode
        oldCurrentNode.clone = newCurrentNode

        oldCurrentNode = oldCurrentNode.next
    }

    // 复制节点的随机指针
    oldCurrentNode = pHead
    newCurrentNode = newPHead
    while (oldCurrentNode) {
        if (oldCurrentNode.random) {
            newCurrentNode.random = oldCurrentNode.random.clone
        }

        oldCurrentNode = oldCurrentNode.next
        newCurrentNode = newCurrentNode.next
    }

    // 删除原节点上对新节点的引用
    oldCurrentNode = pHead
    while (oldCurrentNode) {
        if (oldCurrentNode.random && oldCurrentNode.random.clone) {
            delete oldCurrentNode.random.clone
        }

        oldCurrentNode = oldCurrentNode.next
    }

    return newPHead
}
```

<br/>


### 字符串的排列

{% note primary %}
**题目描述：**  

输入一个字符串(可能有字符重复,字符只包括大小写字母),按字典序打印出该字符串中字符的所有排列。例如输入字符串abc,则按字典序打印出由字符a,b,c所能排列出来的所有字符串abc,acb,bac,bca,cab和cba。
{% endnote %}

示例：
 - 输入："ab"
 - 输出：["ab","ba"]

{% note success %}
**解题思路：**

假设输入为a、b、c，那么其实排序的总数：

fun（a，b，c）= a（fun（b，c））+ b（fun（a，c））+ c（fun（b，a））
{% endnote %}

```JavaScript
function Permutation(str) {
    if (!str.length) return []
    if (str.length === 1) return [str]

    // 先对字符串字母排一下序
    const newStr = str.split('').sort().join('')
    const res = []
    for (let i = 0; i < newStr.length; i++) {
        // 字母重复，去重
        if (newStr[i - 1] === newStr[i]) continue

        const left = newStr.slice(0, i)
        const right = newStr.slice(i + 1)
        res.push(...Permutation(left + right).map(item => newStr[i] + item))
    }
    return res
}
```

<br/>


### 把数组排成最小的数

{% note primary %}
**题目描述：**  

输入一个正整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。例如输入数组{3，32，321}，则打印出这三个数字能排成的最小数字为321323。
{% endnote %}

示例：
 - 输入：[3,32,321]
 - 输出："321323"

{% note success %}
**解题思路：**

首先将字符串进行排序，将它们两两拼接起来，比较a+b和b+a哪个大，如果a+b>b+a，那就应该将b放在a的前面，a排在b的后面，依次类推
{% endnote %}

```JavaScript
function PrintMinNumber(numbers) {
    if (numbers.length === 0) return ''
    if (numbers.length === 1) return numbers[0]

    let res = ''
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers.length - 1 - i; j++) {
            if (numbers[j] + '' + numbers[j + 1] < numbers[j + 1] + '' + numbers[j]) {
                [numbers[j], numbers[j + 1]] = [numbers[j + 1], numbers[j]]
            }
        }
        res = res + numbers[numbers.length - 1 - i]
    }

    return res
}
```

<br/>


### 丑数

{% note primary %}
**题目描述：**  

把只包含质因子2、3和5的数称作丑数（Ugly Number）。例如6、8都是丑数，但14不是，因为它包含质因子7。 习惯上我们把1当做是第一个丑数。求按从小到大的顺序的第N个丑数。
{% endnote %}

示例：
 - 输入：7
 - 输出：8

{% note success %}
**解题思路：**

1. 按顺序将丑数保存在数组中，然后求下一个丑数；
3. 按照题目规定，第一个丑数是1，存入数组中；
4. 第二个丑数为1\*2，1\*3，1\*5三个中的最小值；
5. 第三个丑数为2\*2，1\*3，1\*5三个中的最小值，依次类推，求出第N个数组。
{% endnote %}

```JavaScript
function GetUglyNumber_Solution(index) {
    if (index === 0) return 0    

    const uglyNumberList = [1]
    let indexTwo = 0
    let indexThree = 0
    let indexFive= 0
    for (let i = 1; i < index; i++) {
        let min = Math.min(uglyNumberList[indexTwo] * 2, uglyNumberList[indexThree] * 3, uglyNumberList[indexFive] * 5)

        uglyNumberList.push(min)
        if (min === uglyNumberList[indexTwo] * 2) {
            indexTwo++
        } 
        if (min === uglyNumberList[indexThree] * 3) {
            indexThree++
        } 
        if (min === uglyNumberList[indexFive] * 5) {
            indexFive++
        } 
    }

    return uglyNumberList[uglyNumberList.length - 1]
}
```

<br/>

