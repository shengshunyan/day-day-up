---
title: JavaScript之斐波那契序列
date: 2018-10-14
categories: "算法"
tags: 
     - JavaScript
     - 博客
---

1. 问题：N级台阶（比如100级），每次可走1步或者2步，求总共有多少种走法？

2. 解法：问题本质上是斐波那契数列，假设只有一个台阶，那么只有一种跳法，那就是一次跳一级，f(1)=1；如果有两个台阶，那么有两种跳法，第一种跳法是一次跳一级，第二种跳法是一次跳两级,f(2)=2。如果有大于2级的n级台阶，那么假如第一次跳一级台阶，剩下还有n-1级台阶，有f(n-1)种跳法，假如第一次条2级台阶，剩下n-2级台阶，有f(n-2)种跳法。这就表示f(n)=f(n-1)+f(n-2)。<!-- more -->
3. 实现：
```JavaScript
// 1. 递归(普通版)
function Fibonacci1(n) {
    if (n <= 2) return 1;
    return Fibonacci1(n - 1) + Fibonacci1(n - 2);
}

// 2. 递归(尾调用优化)
function Fibonacci2(n, ac1 = 1, ac2 = 1) {
    if (n <= 2) { return ac2 };
    return Fibonacci2(n - 1, ac2, ac1 + ac2);
}

// 3.循环版
function Fibonacci3(n){
    if (n===1 || n===2) {
        return 1;
    }
    let ac1 = 1, ac2 = 1;
    for (let i = 2; i < n; i++){
        [ac1, ac2] = [ac2, ac1 + ac2];
    }
    return ac2;
}

// 4. 生成器版
function Fibonacci4(n) {
    function* fibonacci() {
        let [prev, curr] = [1, 1];
             while (true) {
               [prev, curr] = [curr, prev + curr];
               yield curr;
         }
    }

    if (n === 1 || n === 2) return 1;
    let ac = 0;
    const fibo = fibonacci();
    for (let i = 2; i < n; i++) {
        ac = fibo.next().value;
    }
    return ac;
}
```