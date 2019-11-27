---
title: JavaScript设计模式与开发实践
date: 2019-03-15
tags:
     - JavaScript
     - 读书笔记
---
学习JavaScript设计模式与开发实践的一些读书笔记！


### 第一章 面向对象的JavaScript
1. 动态类型语言和静态类型语言
    1. 静态类型：在编译时已经确定变量的类型；
    2. 动态类型：变量类型要到程序运行的时候，待变量赋予某个值之后，才会具有某种类型；
2. 鸭子类型：如果它走起来像鸭子，叫起来也像鸭子，那么它就是鸭子；
3. 多态：同一操作作用于不同的对象上面，可以产生不同的解释和不同的执行结果；
4. 封装：通过函数作用域实现封装特性；
5. 继承：
    1. 基于原型的对象委托的形式实现JavaScript对象系统；
    2. Object.create()就是原型模式的天然实现；
    3. ES6的Class只是语法糖；

<!-- more -->

### 第二章 this、call和apply
1. this：详细可见《你不知道的JavaScript-上》
2. call和apply：
    1. call时包装在apply上面的一颗语法糖，bind也可以用apply实现；
    2. 当使用call/apply时，传入的第一个参数为null，函数体内的this会指向默认的宿主对象(浏览器中是window)；严格模式下，函数体内的this还是为null；

### 第三章 闭包和高阶函数
1. 闭包：封装变量，延续局部变量的寿命；
2. 高阶函数：
    1. what: 函数作为参数；函数作为返回值；
    2. 函数作为参数：回调函数；
    3. 函数作为返回值(运算可以延续)：单例模式；
    4. 高阶函数实现AOP：面向切面编程，将和核心业务模块无关的功能抽离出来(日志模块、安全控制模块、异常处理)；
    ```JavaScript
    Function.prototype.before = function(fn) {
        const _self = this;
        return function() {
            fn.apply(this, arguments);
            _self.apply(this, arguments);
        }
    }

    let func = function() {
        console.log(2);
    }

    func = func.before(() => {
        console.log(1);
    });

    func(); // 1 2
    ```
    5. 高阶函数的其他应用：
        1. currying
        2. 函数节流
        ```javascript
        const throttle = function(fn, interval = 500) {
            let isFirstTime = true;
            let timer;

            return function(...params) {
                const _this = this;

                // 第一次立即执行
                if (isFirstTime) {
                    fn.apply(_this, params);
                    isFirstTime = false;
                    return;
                }

                if (timer) {
                    return;
                }

                timer = setTimeout(function() {
                    clearTimeout(timer);
                    timer = null;
                    fn.apply(_this, params);
                }, interval);
            }
        }

        window.onresize = throttle(function() {
            console.log(1);
        })
        ```
        3. 分时函数
        4. 惰性加载函数：(即不提前执行，也不每次重复执行)

### 第四章 单例模式

1. 单例模式：在合适的时候才创建对象，并且只创建唯一的一个；创建对象和管理单例的指责被分布在两个不同的方法中，这样才具有单例的威力；
2. 示例：一个只创建一次的登录弹窗
```JavaScript
// 管理单例
var getSingle = function(fn) {
    var result;
    return function() {
        return result || (result = fn.apply(this, arguments));
    };
};

// 创建对象
var createLoginLayer = function() {
    var div = document.createElement('div');
    div.innerHTML = '我是登录浮窗';
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
};

var createSingleLoginLayer = getSingle(createLoginLayer);
document.getElementById('loginBtn').onclick = function() {
    var loginLayer = createSingleLoginLayer();
    loginLayer.style.display = 'block';
};
```

### 第五章 策略模式

1. 策略模式：将算法封装在独立的strategy中，易于拓展；
2. 示例：计算年终奖
```JavaScript
var strategy = {
    's': function(salary) {
        return salary * 4;
    },
    'a': function(salary) {
        return salary * 3;
    },
    'b': function(salary) {
        return salary * 2;
    }
};
var calculateBonus = function(func, salary) {
    return func(salary);
};

calculateBonus(strategy.s, 1000);
```

### 第六章 代理模式

1. 代理模式：当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，客户实际上访问的是替身对象。替身对象对请求做出一些处理之后，再把请求转交给本体对象。
2. 虚拟代理实现图片预加载
```JavaScript
// 代理和本体的接口要一致
var myImage = (function() {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);

    return {
        setSrc: function(src) {
            imgNode.src = src;
        }
    }
})();

var proxyImage = (function() {
    var img = new Image;
    var catchSrc;

    img.onload = function() {
        myImage.setSrc(catchSrc);
    }

    return {
        setSrc: function(src) {
            catchSrc = src;
            myImage.setSrc('./loading.png');
            img.src = src;
        }
    }
})();

proxyImage.setSrc('http://www.hello.com/hello.png');
```
3. 虚拟代理合并HTTP缓存
    1. 利用闭包缓存需要发送的请求；
    2. 利用定时器，一段短时间后一起发送一次请求；
4. 缓存代理
```JavaScript
// 计算乘积
var mult = function() {
    var a = 1;
    for (var i = 0, j = arguments.length; i < j; i++) {
        a = a * arguments[i];
    }

    return a;
};

// 创建缓存代理的工厂
var createProxyFactory = function(fn) {
    var cache = {};

    return function() {
        var args = Array.prototype.join.call(arguments, ',');
        if (args in cache) {
            return cache[args];
        }
        return cache[args] = fn.apply(this, arguments);
    }
};

var proxyMult = createProxyFactory(mult);
proxyMult(1, 2, 3, 4);
proxyMult(1, 2, 3, 4); // 输出缓存结果
```

### 第七章 迭代器模式

1. 迭代器模式：一种相对简单的模式，很多语言内置了迭代器；
2. 内部迭代器
```JavaScript
var each = function(arr , callback) {
    for (var i = 0, j = arr.length; i < j; i++) {
        // callback 返回 false，则终止迭代
        if (callback(i, arr[i]) === false) {
            break;
        }
    }
}

each([1, 2, 3, 4], function(index, value) {
    if (value > 3) {
        return false;
    }
    console.log(value);
});
```
3. 外部迭代器
```JavaScript
var Iterator = function(arr) {
    var current = 0;
    var next = function() {
        current += 1;
    };
    var isDone = function() {
        return current >= arr.length;
    };
    var getCurrentItem = function() {
        return arr[current];
    };

    return {
        next: next,
        isDone: isDone,
        getValue: getCurrentItem,
        length: arr.length,
    };
};

var iterator = Iterator([1, 2, 3, 4]);
while(!iterator.isDone()) {
    console.log(iterator.getValue());
    iterator.next();
}
```

### 第八章 发布-订阅模式

1. 发布-订阅模式：又称观察者模式，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知；时间上的解耦，对象之间的解耦；
2. 全局订阅对象
```JavaScript
var Event = (function() {
    var clientList = {},
        listen,
        trigger,
        remove;

    listen = function(key, fn) {
        if (!clientList[key]) {
            clientList[key] = [];
        }
        clientList[key].push(fn);
    };

    trigger = function() {
        var key = Array.prototype.shift.call(arguments),
            fns = clientList[key];

            if (!fns || fns.length === 0) {
                return false;
            }

            for (var i = 0, fn; fn = fns[i++];) {
                fn.apply(this. arguments);
            }
    };

    remove = function(key, fn) {
        var fns = clientList[key];

        if (!fns) {
            return false;
        }

        if (!fn) {
            fns && (fns.length = 0);
        } else {
            for (var j = fns.length - 1; j >= 0; j--) {
                var _fn = fns[j];

                if (_fn === fn) {
                    fns.splice(j, 1);
                }
            }
        }
    };

    return {
        listen: listen,
        trigger: trigger,
        remove: remove
    };
})();

Event.listen('squareMeter88', function(price) {
    console.log('价格=' + price);
});

Event.trigger('squareMeter88', 20000);
```
3. 发布/订阅模式可以解耦模块之间的联系
```JavaScript
// 业务需求：登录完成后，刷新几个模块的信息

// 常规写法：登录模块内耦合了其他模块的逻辑
login.succ(function(data) {
    header.setAvatar(data.avatar);
    nav.setAvatar(data.avatar);
});

// 发布/订阅模式解耦
$.ajax('http://xxx.com?login', function(data) {
    login.trigger('loginSucc', data);
});

var header = (function() {
    login.listen('loginSucc', function(data) {
        header.setAvatar(data.avatar);
    });

    return {
        setAvatar: function(data) {
            console.log('设置header头像');
        }
    }
})();

var nav = (function() {
    login.listen('loginSucc', function(data) {
        nav.setAvatar(data.avatar);
    });

    return {
        setAvatar: function(data) {
            console.log('设置nav头像');
        }
    }
})();
```

### 第九章 命令模式

1. 命令模式：有时候需要向某些对象发送请求，但是并不知道请求的接受者是谁，也不知道被请求的操作是什么。此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接受者能够消除彼此之间的耦合关系；命令模式在JavaScript语言中是一种隐形的模式；

### 第十章 组合模式

1. 组合模式：将对象组合成树形结构，以表示部分-整体的层次结构；通过对象的多态性表现，使得用户对单个对象和组合对象的使用具有一致性；
2. 组合模式的例子：扫描文件夹
```JavaScript
// folder
var Folder = function(name) {
    this.name = name;
    this.files = [];
};
Folder.prototype.add = function(file) {
    this.files.push(file);
};
Folder.prototype.scan = function() {
    console.log('开始扫描文件夹：' + this.name);
    for (var i = 0, file, files = this.files; file = files[i++];) {
        file.scan();
    }
};

// file
var File = function(name) {
    this.name = name;
};
File.prototype.add = function() {
    throw new Error('文件下面不能再添加文件');
};
File.prototype.scan = function() {
    console.log('开始扫描文件：' + this.name);
};

var folder = new Folder('学习资料');
var folder1 = new Folder('javascript');
var folder2 = new Folder('学习jQuery资料');

var file1 = new File('javascript设计模式');
var file2 = new File('精通jQuery');
var file3 = new File('重构与模式');

folder.add(folder1);
folder.add(folder2);
folder.add(file3);

folder1.add(file1);
folder2.add(file2);

folder.scan();
```

### 第十一章 模版方法模式

1. 模版方法模式：只需要继承就可以实现；由两部分结构组成：抽象父类和具体实现的子类；子类的方法种类和执行顺序都是不变的，所以我们把这部分逻辑封装到子类中，通过增加新的子类，我们便能给系统增加新的功能，并不需要改动抽象父类和其他子类，这也是符合开放-封闭原则；但在JavaScript中，我们很多时候都不需要依样画瓢地去实现一个模版方法模式，高阶函数是更好的选择。

### 第十二章 享元模式

1. 享元模式：是一种用于性能优化的模式，如果系统中因为创建了大量类似的对象而导致内存占用过高，享元模式就会非常有效；
2. 可解决JavaScript上传很多文件时，创建很多上传对象的问题；
3. 对象池
```JavaScript
var toolTipFactory = (function() {
    var toolTipPool = [];

    return {
        create: function() {
            if (toolTipPool.length === 0) {
                var div = document.createElement('div');
                document.body.appendChild(div);
                return div;
            } else {
                return toolTipPool.shift();
            }
        },
        recover: function(tooltipDom) {
            return toolTipPool.push(tooltipDom);
        }
    };
})();

// 创建2个tip
var arr = [];
for (var i = 0, str; str = ['A', 'B'][i++];) {
    var toolTip = toolTipFactory.create();
    toolTip.innerHTML = str;
    arr.push(toolTip);
};

// 回收tip
for(var i = 0, toolTip; toolTip = arr[i++];) {
    toolTipFactory.recover(toolTip);
};

// 再创建6个tip
for(var i = 0, str; str = ['A', 'B', 'C', 'D', 'E', 'F'][i++];) {
    var toolTip = toolTipFactory.create();
    toolTip.innerHTML = str;
    arr.push(toolTip);
};
```

### 第十三章 指责链模式

1. 指责链模式：使多个对象都有机会处理请求，从而避免请求的发送者和接受者之间的耦合关系，将这些对象连城一条链，并沿着这条链传递该请求，直到有一个对象处理它为止；
2. 代码逻辑优化
```JavaScript
// 旧代码
if (...) {
    if (...) {

    }
    else {

    }
}
else {
    ...
}

// 新代码，逻辑解耦
var order500 = function(orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
        console.log('500元定金预购，得到100优惠券');
    }
    else {
        return 'nextSuccessor';
    }
};
var order200 = function(orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
        console.log('200元定金预购，得到50优惠券');
    }
    else {
        return 'nextSuccessor';
    }
};
var orderNormal = function(orderType, pay, stock) {
    if (stock > 0) {
        console.log('普通购买，无优惠券');
    }
    else {
        console.log('手机库存不足');
    }
};

Function.prototype.after = function(fn) {
    var self = this;
    return function() {
        var ret = self.apply(this, arguments);
        if (ret === 'nextSuccessor') {
            return fn.apply(this, arguments);
        }

        return ret;
    }
};

var order = order500
    .after(order200)
    .after(orderNormal);

order(1, true, 500); // 输出：500元定金预购，得到100优惠券
```

### 第十四章 中介者模式

1. 中介者模式：最小知识原则(迪米特法则)，是指一个对象应该尽可能少地了解另外的对象，只关注自身功能的实现，对象之间几乎不知道彼此地存在，他们是通过中介者对象来互相影响对方；
2. 中介者模式的例子——泡泡堂游戏
```JavaScript
/**
 * 玩家
 */
function Player(name, teamColor) {
    this.name = name;
    this.teamColor = teamColor;
    this.state = 'alive';
};
Player.prototype.win = function() {
    console.log(this.name + ' won');
};
Player.prototype.lose = function() {
    console.log(this.name + ' lose');
};
// 玩家死亡
Player.prototype.die = function() {
    this.state = 'dead';
    playerDirector.ReceiveMessage('playerDead', this);
};
// 移除玩家
Player.prototype.remove = function() {
    playerDirector.ReceiveMessage('removePlayer', this);
};

var playerFactory = function(name, teamColor) {
    var newPlayer = new Player(name, teamColor);
    playerDirector.ReceiveMessage('addPlayer', newPlayer);

    return newPlayer;
};

/**
 * 中介者
 */
var playerDirector = (function() {
    var players = {}, // 保存所有玩家
        operations = {};

    operations.addPlayer = function(player) {
        var teamColor = player.teamColor;
        players[teamColor] = players[teamColor] || [];
        players[teamColor].push(player);
    };
    operations.removePlayer = function(player) {
        var teamColor = player.teamColor,
            teamPlayers = players[teamColor] || [];
        for(var i = teamPlayers.length - 1; i>= 0; i--) {
            if (teamPlayers[i] === player) {
                teamPlayers.splice(i, 1);
            }
        }
    };
    operations.playerDead = function(player) {
        var teamColor = player.teamColor,
            teamPlayers = players[teamColor],
            all_dead = true;

        for(var i = 0, player; player = teamPlayers[i++];) {
            player.lose(); // 本队所有玩家lose
        }
        for (var color in players) {
            if (color !== teamColor) {
                for(var i = 0, player; player = teamPlayers[i++];) {
                    player.win(); // 其他队伍所有玩家lose
                }
            }
        }
    };

    var ReceiveMessage = function() {
        var message = Array.prototype.shift.call(arguments);
        operations[message].apply(this, arguments);
    };

    return {
        ReceiveMessage: ReceiveMessage
    }
})();

// 使用
var player1 = playerFactory('player1', 'red'),
    player2 = playerFactory('player2', 'red'),
    player3 = playerFactory('player3', 'red'),
    player4 = playerFactory('player4', 'red');

var player5 = playerFactory('player5', 'blue'),
    player6 = playerFactory('player6', 'blue'),
    player7 = playerFactory('player7', 'blue'),
    player8 = playerFactory('player8', 'blue');


player1.die();
player2.die();
player3.die();
player4.die();
```

### 第十五章 装饰者模式

1. 装饰者模式：在程序运行期间给对象动态添加指责；
2. 在不改动某个函数源代码的情况下，给函数添加一些额外的功能；
```JavaScript
var a = function() {
    console.log(1);
};

var _a = a;
a = function() {
    _a();
    console.log(2);
};

a();
```
3. 用AOP(面向切面编程)装饰函数
```JavaScript
// 1. 数据统计上报: 分离业务代码和数据统计代码
Function.prototype.after = function(fn) {
    var _self = this;
    return function() {
        var ret = _self.apply(this, arguments);
        fn.apply(this, arguments);
        return ret;
    };
};

var showLogin = function() {
    console.log('打开登录浮层');
};
var log = function() {
    console.log('数据上报');
    (new Image).src = 'http://xxx.com/report?tag=xxx';
};

document.getElementById('button').onclick = showLogin.after(log);

// 2. before 表单数据验证插件(即插即用)
```

### 第十六章 状态模式

1. 状态模式：状态模式的关键是把事物的每种状态都封装成单独的类，跟此种状态有关的行为都被封装在这个类内部；
2. 电灯开关状态的示例
```JavaScript
// off state
var OffLightState = function(light) {
    this.light = light;
};
OffLightState.prototype.buttonPressed = function() {
    console.log('on');
    this.light.currState = this.light.onLightState;
};

// on state
var OnLightState = function(light) {
    this.light = light;
};
OnLightState.prototype.buttonPressed = function() {
    console.log('off');
    this.light.currState = this.light.offLightState;
};

var Light = function() {
    this.offLightState = new OffLightState(this);
    this.onLightState = new OnLightState(this);
    this.currState = this.offLightState;

    this.button = document.createElement('button');
    var self = this;
    this.button.onclick = function() {
        self.currState.buttonPressed();
    }
};

var light = new Light();
```
3. JavaScript状态机(可用于不同权限对象，控制页面访问权限)
```JavaScript
// 一个格斗游戏中有攻击、防御、跳跃、跌倒等状态，不同的状态所能进行的操作也是不同的
var FSM = {
    walk: {
        attack: function() {
            console.log('attack');
        },
        defense: function() {
            console.log('defense');
        },
        jump: function() {
            console.log('jump');
        }
    },
    attack: {
        walk: function() {
            console.log('can not walk when attacking');
        },
        defense: function() {
            console.log('can not defense when attacking');
        },
        jump: function() {
            console.log('can not jump when attacking');
        }
    },
}
```

### 第十七章 适配器模式

1. 适配器模式：主要用来解决两个已有接口之间不匹配的问题，它不考虑这些接口是怎么实现的，不会改变原有对象的接口；


---

## 设计原则与编程技巧

### 第一章 单一职责原则(SRP)

1. SRP原则降低了单个类或者对象的复杂度，按照职责把对象分解成更小的粒度，这有助于代码的复用，有利于进行单元测试；
2. 如果随着需求的变化，两个职责总是同时变化，那就不必分离他们，在方便性和稳定性之间要有一些取舍；
3. SRP会增加编写代码的复杂度，增大了这些对象之间相互联系的难度；

### 第二章 最少知识原则
1. 一个软件实体应当尽可能少地与其他实体发生相互作用：中介者模式、封装；

### 第三章 开放-封闭原则

1. 当需要改变一个程序的功能时或者给这个程序增加新的功能的时候，可以使用增加代码的方式，但是允许改动程序的源代码；
2. 挑选出最容易发生变化的地方，然后构造抽象来封闭这些变化；

### 第四章 接口和面向接口编程

1. 面向接口编程(typescript)：利用抽象类或者接口规范其子类的实现；

### 第五章 代码重构
1. 嵌套条件判断(if, else)用return提前退出，减少代码层级；
2. 函数参数过多的时候，用传递对象替换；
3. 减少嵌套的三目运算；
4. 合理使用链式调用(jQuery)，因为调试比较困难；