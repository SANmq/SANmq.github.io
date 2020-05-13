Jigsaw.prototype = {

    init: function () {
        this.initData();
        this.render();
        this.random();
        this.handle();
    },

    initData: function () {
        this.ul = this.el.getElementsByTagName("ul")[0];
        this.ulwidth = parseInt(window.getComputedStyle(this.ul, null).width);
        this.liwidth = (this.ulwidth) / this.boder;
        this.itemObj();
    },

    handle: function () {
        this.handleclick()
    },

    handleclick() {
        self = this;
        for (let i = 0; i < this.boder ** 2 - 1; i++) {
            this.li[i].onclick = (function (j) {
                return function () {
                    // 空白元素当前位置的周围元素
                    let near = self.item[self.block.now].near;
                    for (let k = 0; k < near.length; k++) {
                        // 如果li[i]这个元素当前的位置 是空白元素的周边元素，那么就触发效果
                        if (self.item[j].now === near[k]) {
                            let temp = self.block.now;
                            self.block.now = self.item[j].now;
                            self.item[j].now = temp;
                            self.li[j].style.left = self.item[self.item[j].now].left + 'px';
                            self.li[j].style.top = self.item[self.item[j].now].top + 'px';
                            self.li[self.block.no].style.left = self.item[self.block.now].left + 'px';
                            self.li[self.block.no].style.top = self.item[self.block.now].top + 'px';
                            if (self.win()) {
                                setTimeout('alert("you are win")', 100);
                                self.li[self.boder ** 2 - 1].style.backgroundImage = null
                                self.ul.innerHTML = ''
                                self.ul.style.backgroundImage = null
                            }
                            break;
                        }
                    }
                }

            }(i))
        }
    },

    // 判断游戏是否胜利
    win() {
        for (let i = 0; i < this.item.length; i++) {
            if (this.item[i].no !== this.item[i].now) {
                return false;
            }
        }
        return true;
    },

    itemObj() {
        this.item = []
        for (let i = 0; i < this.boder ** 2; i++) {
            let step = 1 / (this.boder - 1) * 100
            let x = step * parseInt(i % this.boder);
            let y = step * parseInt(i / this.boder);
            let left = parseInt(i % this.boder) * this.liwidth;
            let top = parseInt(i / this.boder) * this.liwidth;
            let near = [i - 1, i + 1, i + this.boder, i - this.boder]
            this.item.push({
                no: i,
                now: i,
                x: x,
                y: y,
                left: left,
                top: top,
                near: near
            })
        }
        // 一直记录最后一个空白格子的对象
        this.block = this.item[this.boder ** 2 - 1]
    },

    render: function () {
        let temp = ""
        for (let i = 0; i < this.boder ** 2; i++) {
            if (i == this.boder ** 2 - 1) {
                temp += `<li class="item${i}" style="width:${this.liwidth}px;height:${this.liwidth}px;background-size: ${this.boder}00% ${this.boder}00%;background-position:${this.item[i].x}% ${this.item[i].y}%;left:${this.item[i].left}px;top:${this.item[i].top}px;background-image:none;"></li>`
            } else {
                temp += `<li class="item${i}" style="width:${this.liwidth}px;height:${this.liwidth}px;background-size: ${this.boder}00% ${this.boder}00%;background-position:${this.item[i].x}% ${this.item[i].y}%;left:${this.item[i].left}px;top:${this.item[i].top}px"></li>`
            }
        }
        this.ul.style.height = this.ulwidth + 'px';
        this.ul.innerHTML = temp;
        this.li = this.ul.childNodes;
    },
    // 随机打乱拼图
    random: function () {
        let index = []
        for (let i = 0; i < this.boder ** 2; i++) {
            index.push(i);
        }
        index.sort(function (a, b) {
            return Math.random() - 0.5
        })
        for (let i = 0; i < this.boder ** 2; i++) {
            this.li[i].style.left = this.item[index[i]].left + 'px';
            this.li[i].style.top = this.item[index[i]].top + 'px';
            this.item[i].now = index[i];
        }
    }
}

//  九宫格拼图
function Jigsaw(el, img, boder) {
    // 游戏区域
    this.el = el
    // 记录所用图片
    this.img = img;
    // 记录格子数量
    this.boder = boder;
    this.init();
}

var el = document.getElementById('pintu');
var game = new Jigsaw(el, "img/1.jpg", 3);
var start = el.getElementsByClassName('btn')[0];
start.onclick = function () {
    new Jigsaw(el, "img/1.jpg", 3);
}