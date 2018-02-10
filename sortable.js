class Sortable {
    constructor(opt) {
        this.util = new Util();
        this.enterEle = null;
        this.dragEle = null;
        this.startY = 0;
        this.container = this.util._getEle(opt.container);
        this.childs = this.container.children;
        this.animateTime = opt.animateTime;
        this.position = [];
        this.init();
    }
    init() {
        this.caculatePosition()
        this.bindEvent();

    }
    bindEvent() {
        var util = this.util,
            container = this.container,
            childs = this.childs,
            self = this;
        util._each(childs, function (ele, idx) {
            /**
             * 获取被拖动的元素
             * 判断被拖动的元素当前在哪个兄弟元素target上
             * 判断被拖动元素之前位于target的上方还是下方
             * 假设被拖动元素之前位于target的上方，那么移动的方向为往上依次移动
             * target移动的距离为被拖动元素的高度可以刚好放置被拖动元素，后面的元素依次移动前一个元素的距离
             */
            util._on(container, 'dragstart', 'li', function (e) {
                self.dragEle = this;
            });



        })
    }

    caculatePosition() {
        var util = this.util,
            self = this;
        util._each(this.childs, function (ele, idx) {
            self.position.push(ele.offsetHeight);
            console.log(self.position);

        })
    }
}

class Util {
    // 用于向上拖动时在enterEle之前插入dragEle
    _before(dragEle, enterEle) {
        enterEle.parentNode.insertBefore(dragEle, enterEle)
    }
    // 用于向下拖动时在enterEle之后插入dragEle
    _after(dragEle, enterEle) {
        enterEle.parentNode.insertBefore(dragEle, enterEle.nextElementSibling)
    }
    // 节流   防止ondrag触发过于频繁
    _throttle(fn, ms, context) {
        var now = Date.now(),
            _this;
        return function () {
            _this = context ? context : this;
            if (Date.now() - now > ms) {
                fn.apply(_this, arguments);
                now = Date.now()
            }
        }
    }
    _debounce(fn, ms, context) {
        var args, _this;
        return function () {
            _this = context ? context : this;
            if (args === void 0) {
                args = arguments;
                setTimeout(function () {
                    if (args.length === 1) {
                        fn.call(_this, args[0])
                    } else {
                        fn.apply(_this, args)
                    }
                    args = void 0;
                }, ms)
            }
        }
    }
    // iterate obj or array
    _each(iterated, fn) {

        var i = iterated.length;
        if (iterated instanceof Array) {
            while (i--) {
                if (!fn.call(iterated[i], iterated[i], i, iterated)) break;
            }
        } else {
            for (i in iterated) {
                // 遍历domlist对象
                if (this._getType(iterated[i] !== 'object')) break;
                fn.call(iterated[i], iterated[i], i)
            }
        }
    }
    _getEle(ele, selector) {
        if (selector) {
            ele = typeof ele === 'string' ? document.querySelector(ele) : ele;
            return ele.querySelectorAll(selector)
        } else {
            return typeof ele === 'string' ? document.querySelector(ele) : ele;
        }
    }
    // bind event,support delegate
    _on(ele, type, child, fn) {
        var args = arguments,
            self = this,
            targetSet = null;
        ele.addEventListener(type, function (e) {
            if (args.length === 3) {
                fn.apply(ele, arguments)
            } else {
                targetSet = self._getEle(ele, child);
                if (self._has(targetSet, e.target)) {
                    fn.apply(e.target, arguments)
                }
            }
        }, true)
    }
    _has(targetSet, target) {
        var key;
        for (key in targetSet) {
            if (target === targetSet) {
                return true;
            }
        }
        return false;
    }
    _getType(val) {
        return Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
    }
}