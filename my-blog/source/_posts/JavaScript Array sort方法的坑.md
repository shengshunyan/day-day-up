---
title: JavaScript Array sort方法的坑
date: 2020-05-28
keywords: React, props, state
cover: https://s1.ax1x.com/2020/05/28/teCck9.jpg
tags:
     - JavaScript
---


{% note info no-icon %}
MDN文档sort方法：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
{% endnote %}

## 问题来源

前段时间在做一个需求的时候，需要将一个列表按照数据项的相似度从高到低排序，本来是一个很简单的需求，怪异的事情发生了，排序没有按照预期输出。

把数据单独拿出来，就是这样的一个逻辑

```JavaScript
const arr = [
    { num: 10 },
    { num: 2 },
    { num: 3 },
    { num: undefined },
    { num: 100 },
    { num: undefined },
    { num: 6 },
    { num: 9 },
]

arr.sort((a, b) => {
    return a.num - b.num;
})

console.log(arr)
```

![teF9Wn.gif](https://s1.ax1x.com/2020/05/28/teF9Wn.gif)

你是否曾经遇到过呢，知道问题所在吗？
可以先思考一会儿，我们先来看看sort方法有哪些坑！！

<br/>


## 默认的排序

如果sort方法没有传入参数，那它就会使用自己的默认排序方法

```JavaScript
['Google', 'baiDu', 'Facebook'].sort(); // ['Facebook', 'Google", 'baiDu']

// 无法理解的结果:
[10, 20, 1, 2].sort(); // [1, 10, 2, 20]
```

{% note info no-icon %}
If compareFunction is not supplied, all non-undefined array elements are sorted by converting them to strings and comparing strings in UTF-16 code units order. 
{% endnote %}

根据文档，当没有给sort传入排序函数时，所有未定义的数组元素都会被转化成字符串，并通过比较 UTF-16 的值来进行排序。
那上面的排序结果就说的通了。

<br/>


## 错误得使用回调函数

下面是一段很常见的代码

```JavaScript
[10, 2, 3, 100, 6, 9].sort((a, b) => {
    return a < b;
});
// 无法理解的结果
[10, 2, 3, 100, 6, 9]
```

上面的代码按理解应该没问题，可是为什么排序没有正确输出呢？还是看一下官方文档

{% note info no-icon %}
If compareFunction is supplied, all non-undefined array elements are sorted according to the return value of the compare function (all undefined elements are sorted to the end of the array, with no call to compareFunction). If a and b are two elements being compared, then:

- If compareFunction(a, b) returns less than 0, sort a to an index lower than b (i.e. a comes first).

- If compareFunction(a, b) returns 0, leave a and b unchanged with respect to each other, but sorted with respect to all different elements. Note: the ECMAscript standard does not guarantee this behavior, thus, not all browsers (e.g. Mozilla versions dating back to at least 2003) respect this.

- If compareFunction(a, b) returns greater than 0, sort b to an index lower than a (i.e. b comes first).
- compareFunction(a, b) must always return the same value when given a specific pair of elements a and b as its two arguments. If inconsistent results are returned, then the sort order is undefined.
{% endnote %}

大意就是
 - 如果比较函数返回值小于0，则将a排在b前面；
 - 如果比较函数返回值大于0，则将b排在a前面；
 - 如果比较函数返回值等于0，则a和b不调换位置；
 - 比较函数的返回值需要是稳定的

看到这之后，就很容易看出了之前代码的问题。大小判断返回值是布偶值，转化为数字是0，1，所以排序会出现错误。
稍微改一下之前的代码，排序就正常了。

```JavaScript
[10, 2, 3, 100, 6, 9].sort((a, b) => {
    return a - b;
});
// 结果
[2, 3, 6, 9, 10, 100]
```

<br/>


## 当比较项里面有空值

会到一开始的问题，比较的项里面有空值，a - b返回的就是NaN，排序就会出问题。
稍微改一下之前的代码，排序就正常了。

```JavaScript
const arr = [
    { num: 10 },
    { num: 2 },
    { num: 3 },
    { num: undefined },
    { num: 100 },
    { num: undefined },
    { num: 6 },
    { num: 9 },
]

arr.sort((a, b) => {
    if (Number.isNaN(a.num - b.num)) {
        return -1
    }
    return a.num - b.num;
})

console.log(arr)

// 结果
[
  { num: undefined },
  { num: undefined },
  { num: 2 },
  { num: 3 },
  { num: 6 },
  { num: 9 },
  { num: 10 },
  { num: 100 }
]
```