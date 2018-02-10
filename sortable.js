class Sortable {
    constructor(opt) {
        this.util = new Util();
        this.enterEle = null;
        this.dragEle = null;
        this.startY = 0;
        this.container = this.util._getEle(opt.container);
        this.animateTime = opt.animateTime || 200;
        this.position = [];
        this.init();
    }
    init() {
        this.caculatePosition();
        this.bindEvent();

    }
    bindEvent() {
        var util = this.util,
            container = this.container,
            childs = this.container.children,
            len = childs.length,
            self = this,
            dragIndex = 0,
            enterIndex,
            movePosition = '';

        util._each(childs, function (ele, idx) {

            ele.draggable = true;

            ele.index = idx;
            ele.flag = true;
            // 获得被拖拽的元素            
            util._on(container, 'dragstart', 'li', function (e) {
                util._each(childs, function (ele) {
                    ele.style.transition = '.5s'

                })
                this.style.visibility = 'hidden'
                self.dragEle = this;
                dragIndex = this.index;
            });

            util._on(container, 'drag', 'li', self.util._debounce(function () {


            }, 10));

            util._on(container, 'dragenter', 'li', function () {

                if (this === self.dragEle) return;
                if (this.flag === false) {
                    this.style.transform = `translateY(0)`;
                    this.flag = true;
                    movePosition = movePosition === 'down' ? 'up' : 'down'
                } else {
                    if (dragIndex < enterIndex) {
                        this.style.transform = `translateY(-${self.dragEle.offsetHeight}px)`;
                        this.flag = false;
                        movePosition = 'down'
                    } else {
                        this.style.transform = `translateY(${self.dragEle.offsetHeight}px)`;
                        this.flag = false;
                        movePosition = 'up';
                    }
                }

                self.enterEle = this;
                enterIndex = this.index;

            })

            util._on(container, 'dragend', 'li', function () {
                if (movePosition === 'down') {
                    util._after(self.dragEle, self.enterEle);
                } else {
                    util._before(self.dragEle, self.enterEle);
                }

                // 恢复拖拽前的状态
                self.dragEle.style.visibility = 'visible'
                util._each(childs, function (ele, idx) {
                    ele.style.transition = '';
                    ele.style.transform = 'translateY(0)';
                    ele.index = idx;
                    ele.flag = true;
                })
                self.caculatePosition()
            })
        })
    }

    caculatePosition() {
        var util = this.util,
            self = this;
        self.position = [];
        util._each(this.container.children, function (ele, idx) {
            var eleHeight = ele.offsetHeight,
                eleHeightInBox = ele.getBoundingClientRect().top - self.container.getBoundingClientRect().top;
            eleHeight && self.position.push({
                eleHeight,
                eleHeightInBox
            });
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
        enterEle.parentNode.insertBefore(dragEle, enterEle.nextElementSibling, )
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

        var i = 0,
            len = iterated.length;

        iterated = (iterated instanceof Array) ? iterated : Array.prototype.slice.call(iterated);

        while (i < len) {
            if (fn.call(iterated[i], iterated[i], i, iterated) === false) break;
            i++;
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
        var i;
        for (var i = 0; i < targetSet.length; i++) {
            if (target === targetSet[i]) {
                return true;
            }
        }
        return false;
    }
    _getType(val) {
        return Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
    }
}