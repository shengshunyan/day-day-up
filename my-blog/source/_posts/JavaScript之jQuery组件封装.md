---
title: JavaScript之组件封装
date: 2018-10-27
categories: "JavaScript"
tags: 
     - JavaScript
     - 博客
---

### jQuery组件封装
1. 思想：
    1. 利用立即执行函数(闭包)封装组件方法，避免污染全局作用域；
    2. 将方法挂到$.fn对象上，即可在jQuery实例对象上调用封装得方法；
<!-- more -->
2. 实现：
```JavaScript
// html
<select name="select" class="select"></select>

// plugin
(function($) {
    /**
     * @desc 一个异步获取下拉框数据的组件
     * @param options { object } 配置参数对象
     * @param options.url { string } 获取数据路径
     * @param options.textField { string } option的显示文本对应返回数据中的字段名
     * @param options.valueField { string } option的value对应返回数据中的字段名
     * @return target { jquery object } 返回jquery对象本身，提供链式调用
     */
    $.fn.initSelect = function(options) {
        const defaultOptions = {
            textField: 'text',
            valueField: 'value',
        }  // 用户可调配置
        const target = this
        let optionCode = ''

        $.extend(options, defaultOptions)
        $.ajax({
            url: options.url,
            method: 'GET',
            success: function(res) {
                const { data } = res
                optionCode = data
                    .map(elem => (`<option value="${elem[options.valueField]}">${elem[options.textField]}</option>`))
                    .join('')
                target.empty().html(optionCode)
            },
        })

        return target
    }
}(jQuery))

// logic
$(document).ready(function() {
    $('.select').initSelect({ url: '/select' })
})
```

### JavaScript原生面向对象封装
1. 思路：
    1. 利用闭包封装，将需要挂载方法的对象当参数传入；
    2. 实现一些兼容；
    3. 利用构造函数和原型的写法(构造函数prototype上的属性(方法)能在实例上访问)；
2. 实现一个拖拽组件：
```JavaScript
(function () {
    // 私有方法，仅仅用来获取transform的兼容写法
    function getTransform() {
        var transform = '',
            divStyle = document.createElement('div').style,
            transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],

            i = 0,
            len = transformArr.length;

        for (; i < len; i++) {
            if (transformArr[i] in divStyle) {
                return transform = transformArr[i];
            }
        }

        return transform;
    }
    // 这是一个私有属性，不需要被实例访问
    var transform = getTransform();

    function Drag(selector) {
        // 放在构造函数中的属性，都是属于每一个实例单独拥有
        this.elem = typeof selector == 'Object' ? selector : document.getElementById(selector);
        this.startX = 0;
        this.startY = 0;
        this.sourceX = 0;
        this.sourceY = 0;

        this.init();
    }

    // 原型
    Drag.prototype = {
        constructor: Drag,

        init: function () {
            // 初始时需要做些什么事情
            this.setDrag();
        },

        // 该方法用来绑定事件
        setDrag: function () {
            var self = this;
            this.elem.addEventListener('mousedown', start, false);
            function start(event) {
                self.startX = event.pageX;
                self.startY = event.pageY;

                var pos = self.getPosition();

                self.sourceX = pos.x;
                self.sourceY = pos.y;

                document.addEventListener('mousemove', move, false);
                document.addEventListener('mouseup', end, false);
            }

            function move(event) {
                var currentX = event.pageX;
                var currentY = event.pageY;

                var distanceX = currentX - self.startX;
                var distanceY = currentY - self.startY;

                self.setPostion({
                    x: (self.sourceX + distanceX).toFixed(),
                    y: (self.sourceY + distanceY).toFixed()
                })
            }

            function end(event) {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', end);
                // do other things
            }
        },

        // 稍作改造，仅用于获取当前元素的属性，类似于getName
        getStyle: function (property) {
            return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(this.elem, false)[property] : this.elem.currentStyle[property];
        },

        // 用来获取当前元素的位置信息，注意与之前的不同之处
        getPosition: function () {
            var pos = { x: 0, y: 0 };
            if (transform) {
                var transformValue = this.getStyle(transform);
                if (transformValue == 'none') {
                    this.elem.style[transform] = 'translate(0, 0)';
                } else {
                    var temp = transformValue.match(/-?\d+/g);
                    pos = {
                        x: parseInt(temp[4].trim()),
                        y: parseInt(temp[5].trim())
                    }
                }
            } else {
                if (this.getStyle('position') == 'static') {
                    this.elem.style.position = 'relative';
                } else {
                    pos = {
                        x: parseInt(this.getStyle('left') ? this.getStyle('left') : 0),
                        y: parseInt(this.getStyle('top') ? this.getStyle('top') : 0)
                    }
                }
            }

            return pos;
        },

        // 用来设置当前元素的位置
        setPostion: function (pos) {
            if (transform) {
                this.elem.style[transform] = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
            } else {
                this.elem.style.left = pos.x + 'px';
                this.elem.style.top = pos.y + 'px';
            }
        },

    }

    // 一种对外暴露的方式
    window.Drag = Drag;
})();

// 使用：声明2个拖拽实例
new Drag('target');
new Drag('target2');
```