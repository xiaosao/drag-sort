class Sortable{
    constructor(opt){
        this.enterEle = null;
        this.moveEle = null;
        this.startY = 0;
        this.container = opt.container;
        this.animateTime = opt.animateTime;
        this.init()
    }
    init(){
        
    }
}

class Util{
    // 用于向上拖动时在enterEle之前插入moveEle
    before(moveEle, enterEle) {
        enterEle.parentNode.insertBefore(moveEle, enterEle)
    }
    // 用于向下拖动时在enterEle之后插入moveEle
    after(moveEle, enterEle) {
        enterEle.parentNode.insertBefore(moveEle, enterEle.nextElementSibling)
    }
    // 节流   防止ondrag触发过于频繁
    throttle(fn, ms) {
        var now = Date.now()
        return function (e) {
            if (Date.now() - now > ms) {
                fn.call(this, e);
                now = Date.now()
            }
        }
    }
}