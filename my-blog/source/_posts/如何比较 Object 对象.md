---
title: 如何比较 Object 对象
date: 2020-08-03
keywords: JavaScript, Object, 比较
cover: https://i.loli.net/2020/06/29/f1yJm3lD7aKsSnx.jpg
tags:
     - JavaScript
---


{% note info no-icon %}
摘录自知乎黄子毅用户的回答：https://zhuanlan.zhihu.com/p/157126137
{% endnote %}

## 引言

Object 的比较是非常重要的基础知识，四种常见对比方法：引用对比、手动对比、浅对比、深对比

<br/>


## 对比方法

### 引用对比

下面三种对比方式用于 Object，皆在引用相同是才返回 true：
  - ===
  - ==
  - Object.is()

```JavaScript
const hero1 = {
  name: "Batman",
};
const hero2 = {
  name: "Batman",
};

hero1 === hero1; // => true
hero1 === hero2; // => false

hero1 == hero1; // => true
hero1 == hero2; // => false

Object.is(hero1, hero1); // => true
Object.is(hero1, hero2); // => false
```

<br/>


### 手动对比

写一个自定义函数，按照对象内容做自定义对比也是一种方案：

```JavaScript
function isHeroEqual(object1, object2) {
  return object1.name === object2.name;
}

const hero1 = {
  name: "Batman",
};
const hero2 = {
  name: "Batman",
};
const hero3 = {
  name: "Joker",
};

isHeroEqual(hero1, hero2); // => true
isHeroEqual(hero1, hero3); // => false
```

如果要对比的对象 key 不多，或者在特殊业务场景需要时，这种手动对比方法其实还是蛮实用的。

但这种方案不够自动化，所以才有了浅对比。

<br/>


### 浅对比

浅对比函数写法有很多，不过其效果都是标准的，下面给出了一种写法：

```JavaScript
function shallowEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}
```

可以看到，浅对比就是将对象每个属性进行引用对比，算是一种性能上的平衡，尤其在 redux 下有特殊的意义。

```JavaScript
const hero1 = {
  name: "Batman",
  realName: "Bruce Wayne",
};
const hero2 = {
  name: "Batman",
  realName: "Bruce Wayne",
};
const hero3 = {
  name: "Joker",
};

shallowEqual(hero1, hero2); // => true
shallowEqual(hero1, hero3); // => false
```

如果对象层级再多一层，浅对比就无效了，此时需要使用深对比。

<br/>


### 深对比

深对比就是递归对比对象所有简单对象值，遇到复杂对象就逐个 key 进行对比，以此类推。

下面是一种实现方式：

```JavaScript
function deepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
}

function isObject(object) {
  return object != null && typeof object === "object";
}
```

可以看到，只要遇到 Object 类型的 key，就会递归调用一次 deepEqual 进行比较，否则对于简单类型直接使用 !== 引用对比。

值得注意的是，数组类型也满足 typeof object === "object" 的条件，且 Object.keys 可以作用于数组，且 object[key] 也可作用于数组，因此数组和对象都可以采用相同方式处理。

有了深对比，再也不用担心复杂对象的比较了：

```JavaScript
const hero1 = {
  name: "Batman",
  address: {
    city: "Gotham",
  },
};
const hero2 = {
  name: "Batman",
  address: {
    city: "Gotham",
  },
};

deepEqual(hero1, hero2); // => true
```

但深对比会造成性能损耗，不要小看递归的作用，在对象树复杂时，深对比甚至会导致严重的性能问题。

<br/>


## 经验总结

### 常见的引用对比

引用对比是最常用的，一般在做 props 比较时，只允许使用引用对比：

```JavaScript
this.props.style !== nextProps.style;
```

如果看到有深对比的地方，一般就要有所警觉，这里是真的需要深对比吗？是不是其他地方写法有问题导致的。

比如在某处看到这样的代码：

```JavaScript
deepEqual(this.props.style, nextProps.style);
```

可能是父组件一处随意拼写导致的：

```JavaScript
const Parent = () => {
  return <Child style={{ color: "red" }} />;
};
```

一个只解决局部问题的同学可能会采用 deepEqual，OK 这样也能解决问题，但一个有全局感的同学会这样解决问题：

```JavaScript
this.props.style === nextProps.style;

const Parent = () => {
  const style = useMemo(() => ({ color: "red" }), []);
  return <Child style={style} />;
};
```

从性能上来看，Parent 定义的 style 只会执行一次且下次渲染几乎没有对比损耗（依赖为空数组），子组件引用对比性能最佳，这样的组合一定优于 deepEqual 的例子。


### 常见的浅对比

浅对比也在判断组件是否重渲染时很常用：

```JavaScript
shouldComponentUpdate(nextProps) {
  return !shallowEqual(this.props, nextProps)
}
```

原因是 this.props 这个对象引用的变化在逻辑上是无需关心的，因为应用只会使用到 this.props[key] 这一层级，再考虑到 React 组件生态下，Immutable 的上下文保证了任何对象子属性变化一定导致对象整体引用变化，可以放心的进行浅对比。

最少见的就是手动对比和深对比，如果你看到一段代码中使用了深对比，大概率这段代码可以被优化为浅对比。
