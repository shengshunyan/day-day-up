---
title: 学习JavaScript数据结构与算法 note
date: 2018-08-14
categories: "学习JavaScript数据结构与算法"
tags: 
     - JavaScript
     - 读书笔记
---
学习JavaScript数据结构与算法的一些读书笔记！


### 第一章 JavaScript简介

### 第二章 数组

### 第三章 栈

<!-- more -->

1. 栈的实现: 先进后出
```JavaScript
// 简易实现
class Stack {
    constructor() {
        this.items = [];
    }
    // 添加元素
    push(element) {
        this.items.push(element);
    }
    // 移除元素
    pop() {
        return this.items.pop();
    }
    // 查看栈顶元素
    peek() {
        return this.items[this.items.length - 1];
    }
    // 查看栈的长度
    size() {
        return this.items.length;
    }
    // 检查栈是否为空
    isEmpty() {
        return this.items.length === 0;
    }
    // 清空栈元素
    clear() {
        this.items = [];
    }
    // 打印
    print() {
        console.log(this.items.toString());
    }
}

// 闭包实现私有属性：解决外部能访问内部items属性的问题
const Stack = (function () {
    const map = new WeakMap();

    class Stack {
        constructor() {
            map.set(this, []);
        }
        // 添加元素
        push(element) {
            const items = map.get(this);
            items.push(element);
        }
        // 移除元素
        pop() {
            const items = map.get(this);
            return items.pop();
        }
        // 查看栈顶元素
        peek() {
            const items = map.get(this);
            return items[items.length - 1];
        }
        // 查看栈的长度
        size() {
            const items = map.get(this);
            return items.length;
        }
        // 检查栈是否为空
        isEmpty() {
            const items = map.get(this);
            return items.length === 0;
        }
        // 清空栈元素
        clear() {
            const items = map.get(this);
            items.splice(0, items.length);
        }
        // 打印
        print() {
            const items = map.get(this);
            console.log(items.toString());
        }
    }
    return Stack;
})();

const stack = new Stack();
console.log(stack.isEmpty());
stack.push(5);
stack.push(8);
console.log(stack.peek());
console.log(stack.size());
console.log(stack.isEmpty());
console.log(stack.pop());
stack.print();
stack.clear();
stack.print();
```
2. 用栈解决问题
```JavaScript
/**
 * @desc 将十进制数字转化为任意进制
 * @param {number} decNumber 需要转换的十进制数字
 * @param {number} base 转换目标进制
 * @return {string} baseString 转换完成的字符串
 */
function baseConverter(decNumber, base) {
    const remStack = new Stack();
    let rem,
        baseString = '',
        digits = '0123456789ABCDEF';

    while (decNumber > 0) {
        rem = Math.floor(decNumber % base);
        remStack.push(rem);
        decNumber = Math.floor(decNumber / base);
    }
    while (!remStack.isEmpty()) {
        baseString += digits[remStack.pop()];
    }

    return baseString;
}
```
   
### 第四章 队列

1. 队列的实现：先进先出
```JavaScript
// 队列：先进先出
class Queue {
    constructor() {
        this.items = [];
    }
    // 添加元素
    enqueue(element) {
        this.items.push(element);
    }
    // 移除元素
    dequeue() {
        return this.items.shift();
    }
    // 查看队列头元素
    front() {
        return this.items[this.items.length - 1];
    }
    // 查看队列的长度
    size() {
        return this.items.length;
    }
    // 检查队列是否为空
    isEmpty() {
        return this.items.length === 0;
    }
    // 打印
    print() {
        console.log(this.items.toString());
    }
}

const queue = new Queue();
queue.enqueue('John');
queue.enqueue('Jack');
queue.enqueue('Camila');
queue.print();
console.log(queue.isEmpty());
console.log(queue.size());
console.log(queue.dequeue());
queue.print();
```
2. 队列修改版本
```JavaScript
// 1. 优先队列：先进先出，考虑元素优先级，数字越小，优先级越高
class Queue {
    constructor() {
        this.items = [];
    }
    // 添加元素
    enqueue(element, priority) {
        const queueElement = { element, priority },
            items = this.items;
        const index = items.findIndex(element => queueElement.priority < element.priority);
        if (index > -1) {
            items.splice(index, 0, queueElement);
        } else {
            this.items.push(queueElement);
        }
    }
    // 打印
    print() {
        this.items.forEach(value => {
            console.log(`${value.element} - ${value.priority}`);
        })
    }
    // 其他方法一样
}
const queue = new Queue();
queue.enqueue('John', 2);
queue.enqueue('Jack', 1);
queue.enqueue('Camila', 1);
queue.print();

// 2. 循环队列：击鼓传花
function hotPotato(nameList, num) {
    const queue = new Queue();
    let eliminated;
    nameList.forEach(element => {
        queue.enqueue(element);
    })
    while (queue.size() > 1) {
        for (let i = 0; i < num; i++) {
            queue.enqueue(queue.dequeue());
        }
        eliminated = queue.dequeue();
        console.log(eliminated + '在击鼓传花的游戏中被淘汰');
    }
    return queue.dequeue();
}

const names = ['Jone', 'Jack', 'Camila', 'Ingrid', 'Carl'],
    winner = hotPotato(names, 7);
console.log('The winner is: ' + winner);
```

### 第五章 链表

1. 链表的实现：动态数据结构；数组优点在元素访问，链表优点在动态大小；
```JavaScript
function LinkedList() {
    let length = 0,
        head = null;
    const Node = function(element) {
        this.element = element;
        this.next = null;
    };

    // 向列表尾部添加一个新的项
    this.append = function(element) {
        const node = new Node(element);
        let current;
        if (head === null) {
            head = node;
        } else {
            current = head;
            while (current.next) {
                current = current.next;
            }
            current.next = node;
        }
        length++;
    };
    // 从链表中删除元素
    this.removeAt = function(position) {
        if (position > -1 && position < length) {
            let current = head,
                previous,
                index = 0;
            if (position === 0) {
                head = current.next;
            } else {
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                previous.next = current.next;
            }
            length--;
            return current.element;
        } else {
            return null;
        }
    };
    // 在任意位置插入元素
    this.insert = function(position, element) {
        if (position >= 0 && position <= length) {
            const node = new Node(element);
            let current = head,
                previous,
                index = 0;
            if (position === 0) {
                node.next = current;
                head = node;
            } else {
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;
            }
            length++;
            return true;
        } else {
            return false;
        }
    };
    // 字符输出
    this.toString = function() {
        let current = head,
            string = '';
        while (current) {
            string += current.element + (current.next ? ' -> ' : '');
            current = current.next;
        }
        return string;
    };
    // 返回元素索引
    this.indexOf = function(element) {
        let current = head,
            index = 0;
        while (current) {
            if (element === current.element) {
                return index;
            }
            index++;
            current = current.next;
        }
        return -1;
    };
    this.isEmpty = function() {
        return length === 0;
    };
    this.size = function() {
        return length;
    }
    this.getHead = function() {
        return head;
    }
};
```
2. 双向链表：记录前一个元素和后一个元素
```JavaScript
function LinkedList() {
    let length = 0,
        head = null,
        tail = null;
    const Node = function(element) {
        this.element = element;
        this.next = null;
        this.prev = null;
    };

    // 其他方法实现类似
};
```
3. 循环链表(单/双)：最后一个元素指针指向第一个元素；

### 第六章 集合

1. 集合实现：无序且唯一的项组成(类似ES6的Set);
```JavaScript
function Set() {
    let items = {}; // 利用对象的key唯一的特性

    this.has = function(value) {
        return items.hasOwnProperty(value);
    };
    this.add = function(value) {
        if (!this.has(value)) {
            items[value] = value;
            return true;
        }
        return false;
    };
    this.remove = function(value) {
        if (this.has(value)) {
            delete items[value];
            return true;
        }
        return false;
    };
    this.clear = function() {
        items = {};
    };
    this.size = function() {
        return Object.keys(items).length;
    };
    // 返回所有元素的数组
    this.values = function() {
        return Object.keys(items);
    };
    
    /* 集合操作 */
    // 并集
    this.union = function(otherSet) {
        const unionSet = new Set(),
            values = this.values(),
            otherValues = otherSet.values();

        values.forEach(value => unionSet.add(value));
        otherValues.forEach(value => unionSet.add(value));

        return unionSet;
    };
    // 交集
    this.insertsection = function(otherSet) {
        const insertsectionSet = new Set(),
            values = this.values();

        values.forEach(value => {
            if (otherSet.has(value)) {
                insertsectionSet.add(value);
            }
        });

        return insertsectionSet;
    };
    // 差集 this有，otherSet没有的元素
    this.difference = function(otherSet) {
        const differenceSet = new Set(),
            values = this.values();

        values.forEach(value => {
            if (!otherSet.has(value)) {
                differenceSet.add(value);
            }
        });

        return differenceSet;
    };
    // 子集 判断this是否为otherSet的子集
    this.subset = function(otherSet) {
        if (this.size() > otherSet.size()) return false;
        const values = this.values(),
            ifSubSet = values.every(value => otherSet.has(value))
        return ifSubSet;
    };
};
```

### 第七章 字典和散列表

1. 字典实现：和原生对象差不多
```JavaScript
function Dictionary() {
    let items = {};

    this.has = function(key) {
        return items.hasOwnProperty(key);
    };
    this.set = function(key, value) {
        items[key] = value;
    };
    this.delete = function(key) {
        if (this.has(key)) {
            delete items[key];
            return true;
        }
        return false;
    };
    this.get = function(key) {
        return this.has(key) ? items[key] : undefined;
    };
    this.clear = function() {
        items = {};
    };
    this.size = function() {
        return Object.keys(items).length;
    };
    this.keys = function() {
        return Object.keys(items);
    };
    this.values = function() {
        return Object.values(items);
    };
    this.getItems = function() {
        return items;
    };
}
```
2. 散列表实现：将key转化为数字，然后将value存储到数组中，数组取值更快速；
```JavaScript
function HashTable() {
    let table = [];
    const loseloseHashCode = function(key) {
        let hash = 0;
        key.split('').forEach((elem, index) => hash += key.charCodeAt(index));
        return hash % 37;
    };
    this.put = function(key, value) {
        const position = loseloseHashCode(key);
        table[position] = value;
    };
    this.get = function(key) {
        return table[loseloseHashCode(key)];
    };
    this.remove = function(key) {
        table[loseloseHashCode(key)] = undefined;
    };
}
```
3. 处理散列表中的冲突：有些key的计算出的hash值会相同，存储时就会覆盖；
    1. 分离链接：为散列表的每个位置初建一个链表并将元素存储在里面；
    2. 现线探查：当向表中某个位置加入一个新元素的时候，如果索引为index的位置已经被占据了，就尝试index+1的位置；如果也被占据了，就尝试index+2的位置，以此类推；
4. 创建更好的散列函数；
```JavaScript
const djb2HashCode = function(key) {
    let hash = 5381;
    key.split('').forEach((elem, index) => hash = hash * 33 + key.charCodeAt(index));
    return hash % 1013;
}
```

### 第八章 树

1. 二叉搜索树(BST)：左侧节点存储比父节点小的值，右侧节点存储比父节点大的值(实现高效的查找、插入和删除)；
```JavaScript
function BinarySearchTree() {
    const Node = function(key) {
        this.key = key;
        this.left = null;
        this.right = null;
    };
    let root = null; // 根元素

    // 向树中插入一个元素
    const insertNode = function(node, newNode) {
        if (newNode.key < node.key) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                insertNode(node.right, newNode);
            }
        }
    };
    this.insert = function(key) {
        const newNode = new Node(key);
        if (root === null) {
            root = newNode;
        } else {
            insertNode(root, newNode);
        }
    };
}
```
2. 树的遍历
```JavaScript
// 中序遍历: 左 -> 父 -> 右
const inOrderTraverseNode = function(node, callback) {
    if (node !== null) {
        inOrderTraverseNode(node.left, callback);
        callback(node.key);
        inOrderTraverseNode(node.right, callback);
    }
};
this.inOrderTraverse = function(callback) {
    inOrderTraverseNode(root, callback);
};

// 先序遍历: 父 -> 左 -> 右
const preOrderTraverseNode = function(node, callback) {
    if (node !== null) {
        callback(node.key);
        preOrderTraverseNode(node.left, callback);
        preOrderTraverseNode(node.right, callback);
    }
};
this.preOrderTraverse = function(callback) {
    preOrderTraverseNode(root, callback);
};

// 后序遍历: 左 -> 右 -> 父
const postOrderTraverseNode = function(node, callback) {
    if (node !== null) {
        postOrderTraverseNode(node.left, callback);
        postOrderTraverseNode(node.right, callback);
        callback(node.key);
    }
};
this.postOrderTraverse = function(callback) {
    postOrderTraverseNode(root, callback);
};
```
3. 搜索树中的值
```JavaScript
// 搜索最小值
const minNode = function(node) {
    if (node) {
        while (node && node.left !== null) {
            node = node.left;
        }
        return node.key;
    }
    return null;
};
this.min = function() {
    return minNode(root);
};

// 搜索最大值
const maxNode = function(node) {
    if (node) {
        while (node && node.right !== null) {
            node = node.right;
        }
        return node.key;
    }
    return null;
};
this.max = function() {
    return maxNode(root);
};

// 搜索特定值: 若有值则返回true, 否则返回false
const searchNode = function(node, key) {
    if (node === null) {
        return false;
    }
    if (key < node.key) {
        return searchNode(node.left, key);
    } else if (key > node.key) {
        return searchNode(node.right, key);
    } else {
        return true;
    }
};
this.search = function(key) {
    return searchNode(root, key);
};
```
4. 移除节点(最复杂)
```JavaScript
// 移除一个节点
const findMinNode = function(node) {
    while (node && node.left !== null) {
        ndoe = node.left;
    }
    return node;
};
const removeNode = function(node, key) {
    if (node === null) {
        return null;
    }
    if (key < node.key) {
        node.left = removeNode(node.left, key);
        return node;
    } else if (key > node.key) {
        node.right = removeNode(node.right, key);
        return node;
    } else {
        /* 移除节点 */
        // 1. 叶节点(没有子节点的节点)
        if (node.left === null && node.right === null) {
            node = null;
            return node;
        }
        // 2. 只有一个子节点的节点
        if (node.left === null) {
            node = node.right;
            return node;
        } else if (node.right === null) {
            node = node.left;
            return node;
        }
        // 3. 有两个子节点的节点
        const aux = findMinNode(node.right);
        node.key = aux.key;
        node.right = removeNode(node.right, aux.key);
        return node;
    }
}
```
5. 自平衡树(很复杂，看书的图理接P137)：解决树的一边很深导致操作节点性能下降的问题；(PS: 红黑树的性能表现更佳)
```JavaScript
/* 向树中插入一个元素 */
// 计算节点高度
const heightNode = function(node) {
    if (node === null) {
        return -1;
    } else {
        return Math.max(heightNode(node.left), heightNode(node.right)) + 1;
    }
};
const rotationRR = function(node) {
    const tmp = node.right;
    node.right = tmp.left;
    tmp.left = node;
    return tmp;
};
const rotationLL = function(node) {
    const tmp = node.left;
    node.left = tmp.right;
    tmp.right = node;
    return tmp;
};
const rotationLR = function(node) {
    node.left = rotationRR(node.left);
    return rotationLL(node);
};
const rotationRL = function(node) {
    node.left = rotationLL(node.left);
    return rotationRR(node);
};
const insertNode = function(node, newNode) {
    if (node === null) {
        node = new Node(newNode);
    } else if (newNode < node.key) {
        // 1. 先插入节点
        node.left = insertNode(node.left, newNode);
        // 2. 再判断是否需要平衡
        if (node.left !== null) {
            if (heightNode(node.left) - heightNode(node.right) > 1) {
                // 旋转
                if (newNode < node.left.key) {
                    node = rotationLL(node);
                } else {
                    node = rotationLR(node);
                }
            }
        }
    } else if (newNode > node.key) {
        // 1. 先插入节点
        node.right = insertNode(node.right, newNode);
        // 2. 再判断是否需要平衡
        if (node.right !== null) {
            if (heightNode(node.right) - heightNode(node.left) > 1) {
                // 旋转
                if (newNode < node.left.key) {
                    node = rotationRR(node);
                } else {
                    node = rotationRL(node);
                }
            }
        }
    }
     return node;
};
this.insert = function(key) {
    const newNode = new Node(key);
    if (root === null) {
        root = newNode;
    } else {
        insertNode(root, newNode);
    }
};
```

### 第九章 图

1. 图：一组由边连接的节点；
2. 图的表示：邻接矩阵，邻接表(本文采用)，关联矩阵；
3. 图的实现：
```JavaScript
// 用一个数组来存储图中所有顶点的名字
// 用一个字典来存储邻接表(点为key，相邻点的数组为value)
function Graph() {
    const vertices = [];
    const adjList = new Dictionary();

    // 添加顶点
    this.addVertex = function(v) {
        vertices.push(v);
        adjList.set(v, []);
    };
    // 添加边
    this.addEdge = function(v, w) {
        adjList.get(v).push(w);
        adjList.get(w).push(v);
    };
    this.toString = function() {
        let s = '';
        for (let i = 0; i < vertices.length; i++) {
            s += vertices[i] + ' -> ';
            const neighbors = adjList.get(vertices[i]);
            neighbors.forEach(value => s += value + ' ');
            s += '\n';
        }
        return s;
    };
}
```
4. 图的遍历
    1. 广度优先搜索：一层一层往下遍历；
    ```JavaScript
    // 颜色标识：未访问过的点标注为白色，访问过的点标注为灰色，探索完的点标注为黑色；
    // 1. 广度遍历
    const initializeColor = function() {
        const color = [];
        vertices.forEach(value => color[value] = 'white');
        return color;
    };
    this.bfs = function(v, callback) {
        const color = initializeColor();
        const queue = new Queue();
        queue.enqueue(v);

        while (!queue.isEmpty()) {
            const u = queue.dequeue();
            const neighbors = adjList.get(u);
            color[u] = 'grey';
            neighbors.forEach(value => {
                if (color[value] === 'white') {
                    color[value] = 'grey';
                    queue.enqueue(value);
                }
            });
            color[u] = 'black';
            if (callback) {
                callback(u);
            }
        }
    };
    
    // 2. 利用广度优先搜索寻找最短路径(实际问题中会有路径加权，广度优先算法就不一定合适，寻找其他算法)
    // 从v到u的距离d[u]
    // 前溯点pred[u]，用来推导出从v到其他每个顶点u的最短路径
    this.bfs = function(v) {
        const color = initializeColor();
        const queue = new Queue();
        const distance = {}; // 存储点与点之间最短距离
        const path = {}; // 存储点与点之间最短路径
        const pred = [];
        
        queue.enqueue(v);
        vertices.forEach(value => {
            distance[value] = 0;
            pred[value] = null;
        });
        while (!queue.isEmpty()) {
            const u = queue.dequeue();
            const neighbors = adjList.get(u);
            color[u] = 'grey';
            neighbors.forEach(value => {
                if (color[value] === 'white') {
                    color[value] = 'grey';
                    distance[value] = distance[u] + 1;
                    pred[value] = u;
                    queue.enqueue(value);
                }
            });
            color[u] = 'black';
        }
        // 拼接路径
        const fromVertex = v;
        vertices.forEach(value => {
            const toVertex = value;
            const pathStack = new Stack();
            let s = '';

            if (toVertex === fromVertex) return;
            for (let v = toVertex; v !== fromVertex; v = pred[v]) {
                pathStack.push(v);
            }
            s = fromVertex;
            while (!pathStack.isEmpty()) {
                s += ' -> ' + pathStack.pop();
            }
            path[toVertex] = s;
        });

        return { distance, path };
    };
    ```
    2. 深度优先搜索：先深度后广度地访问节点
    ```JavaScript
    // 像函数执行栈，用递归
    this.dfs = function(callback) {
        const color = initializeColor();
        const dfsVisit = function(u) {
            color[u] = 'grey';
            if (callback) callback(u);
            const neighbors = adjList.get(u);
            neighbors.forEach(value => {
                if (color[value] === 'white') dfsVisit(value);
            });
            color[u] = 'black';
        };

        vertices.forEach(value => {
            if (color[value] === 'white') dfsVisit(value);
        })
    };
    ```
    3. 探索深度优先算法，记录发现时间和探索完时间，应用->拓扑排序(具体实现看书本P159)
    4. 最短路径算法
    5. 最小生成树算法

### 第十章 排序和搜索算法

1. 排序算法
    1. 数据结构构造
    ```JavaScript
    function ArrayList() {
        let array = [];
    
        this.insert = function(item) {
            array.push(item);
        };
        this.toString = function() {
            return array.join();
        };
    }
    ```
    2. 冒泡排序 O(n*n)
    ```JavaScript
    this.bubbleSort = function() {
        const length = array.length;
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length - 1 - i; j++) {
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                }
            }
        }
    };
    ```
    3. 选择排序 O(n*n)：找到数据结构中的最小值，并将其放在第一位，接著找第二小的值放在第二位，以此类推
    ```JavaScript
    this.selectionSort = function() {
        const length = array.length;
        let indexMin;
        for (let i = 0; i < length - 1; i++) {
            indexMin = i;
            for (let j = i; j < length; j++) {
                if (array[indexMin] > array[j]) {
                    indexMin = j;
                }
            }
            if (i !== indexMin) {
                [array[i], array[indexMin]] = [array[indexMin], array[i]];
            }
        }
    };
    ```
    4. 插入排序：每次排序一个数组项，以此方式构建最后的排序数组
    ```JavaScript
    // 排序小型数组时，性能比选择排序和冒泡排序好
    this.insertionSort = function() {
        const length = array.length;
        let j, temp;
        for (let i = 1; i < length; i++) {
            j = i;
            temp = array[i];
            while (j > 0 && array[j - 1] > temp) {
                array[j] = array[j - 1];
                j--;
            }
            array[j] = temp;
        }
    };
    ```
    5. 归并排序O(nlog_n)：将原数组切分成较小的数组，直到每个小数组只有一个位置，接着将小数组归并成较大的数组，直到最后只有一个排序完毕的大数组
    ```JavaScript
    // Firefox 使用归并排序作为Array.prototype.sort的实现
    const merge = function(left, right) {
        const result = [];
        let il = 0;
        let ir = 0;
        while (il < left.length && ir < right.length) {
            if (left[il] < right[ir]) {
                result.push(left[il++]);
            } else {
                result.push(right[ir++]);
            }
        }
        while (il < left.length) {
            result.push(left[il++]);
        }
        while (ir < right.length) {
            result.push(right[ir++]);
        }
        return result;
    };
    const mergeSortRec = function(array) {
        const length = array.length;
        if (length === 1) {
            return array;
        }
        const mid = Math.floor(length / 2);
        const left = array.slice(0, mid);
        const right = array.slice(mid, length);
        return merge(mergeSortRec(left), mergeSortRec(right));
    };
    this.mergeSort = function() {
        array = mergeSortRec(array);
    };

    // 网络精简版
    function mergeSort(arr) {
        function merge(leftArr, rightArr) {
            const resultArr = [];
            while (leftArr.length && rightArr.length) {
                resultArr.push(leftArr[0] < rightArr[0] ? leftArr.shift() : rightArr.shift());
            }
            return resultArr.concat(leftArr, rightArr);
        }

        if (arr.length < 2) return arr;
        const mid = Math.floor(arr.length / 2);
        return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
    }
    ```
    6. 快速排序：在数组中间选择一个主元，交换两边的元素，让主元左边的元素小于主元，右边的元素大于主元；再对两边重复这个步骤；
    ```JavaScript
    const partition = function(array, left, right) {
        const pivot = array[Math.floor((right + left) / 2)];
        let i = left;
        let j = right;
        while (i <= j) {
            while (array[i] < pivot) {
                i++;
            }
            while (array[j] > pivot) {
                j--;
            }
            if (i <= j) {
                [array[i], array[j]] = [array[j], array[i]];
                i++;
                j--;
            }
        }
        return i;
    };
    const quick = function(array, left, right) {
        let index;
        if (array.length > 1) {
            index = partition(array, left, right);
            if (left < index - 1) {
                quick(array, left, index - 1);
            }
            if (index < right) {
                quick(array, index, right);
            }
        }
    };
    this.quickSort = function() {
        quick(array, 0, array.length - 1);
    };
    // 易理解版(阮一峰)：没有考虑时间空间复杂度，保留核心思想-分治
    const quickBrief = function(array) {
        if (array.length <= 1) return array;
        const pivotIndex = Math.floor(array.length / 2);
        const pivot = array.splice(pivotIndex, 1)[0];
        const left = [];
        const right = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i] < pivot) {
                left.push(array[i]);
            } else {
                right.push(array[i]);
            }
        }
        return quickBrief(left).concat([pivot], quickBrief(right));
    };
    this.quickSortBrief = function() {
        array = quickBrief(array);
    };
    ```
    7. 堆排序：把数组当作二叉树来排序(索引0是树的根节点，除根节点外，任意节点N的父节点是N/2，节点L的左子节点是2*L，节点R的右子节点是2*R+1)
    ```JavaScript
    const heapify = function(array, heapSize, i) {
        const left = i * 2 + 1;
        const right = i * 2 + 2;
        let largest = i;
        if (left < heapSize && array[left] > array[largest]) {
            largest = left;
        }
        if (right < heapSize && array[right] > array[largest]) {
            largest = right;
        }
        if (largest !== i) {
            [array[i], array[largest]] = [array[largest], array[i]];
            heapify(array, heapSize, largest);
        }
    };
    const buildHeap = function(array) {
        const heapSize = array.length;
        for (let i = Math.floor(array.length / 2); i >= 0; i--) {
            heapify(array, heapSize, i);
        }
    };
    this.heapSort = function() {
        let heapSize = array.length;
        buildHeap(array);
        while (heapSize > 1) {
            heapSize--;
            [array[0], array[heapSize]] = [array[heapSize], array[0]];
            heapify(array, heapSize, 0);
        }
    };
    ```
2. 搜索算法
    1. 顺序搜索(低效)；
    2. 二分搜索：先排序，再搜索；
    ```JavaScript
    // 二分查找
    this.binarySearch = function(item) {
        this.quickSort();

        let low = 0;
        let high = array.length -1;
        let mid, element;
        while (low <= high) {
            mid = Math.floor((low + high) / 2);
            element = array[mid];
            if (element < item) {
                low = mid + 1;
            } else if (element > item) {
                high = mid - 1;
            } else {
                return mid;
            }
        }
        return -1;
    };
    ```
    
### 第十一章 算法模式

1. 递归
    1. JavaScript调用栈大小限制：chrome 20955次；Firefox 343429次；
    2. 可用ES6了尾调用优化避开调用栈的限制；
    3. 递归调用并不比普通循环快，只是更容易理接；
2. 动态规划：将复杂问题分解成更小的子问题来解决的优化技术；
3. 贪心算法：一种近似解决问题的技术，期盼通过局部最优选择，从而到达全局最优选择；
4. 函数式编程
    1. 概念：
        1. 主要目标是对数据的描述和转换；
        2. 命令式编程重点再步骤和顺序；函数式编程重点在数据集合和函数(操作)；
    ```JavaScript
    // 命令式编程
    const printArray = function(array) {
        array.forEach(value => {
            console.log(value);
        });
    };
    printArray([1, 2, 3, 4, 5])
    
    // 函数式编程
    const _forEach = function(array, action) {
        array.forEach(value => {
            action(value);
        });
    };
    const logItem = function(item) {
        console.log(item);
    };
    _forEach([1, 2, 3, 4, 5], logItem);
    ```
    2. JavaScript函数式工具箱：map(映射), filter(过滤), reduce(集合合并成一个值)
    
### 第十二章 算法复杂度

1. 启发式算法：局部搜索、遗传算法、启发式导航、机器学习等；可能得到的未必是最优解，但是足够解决问题；