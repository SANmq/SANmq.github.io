Jigsaw.prototype = {

    init: function () {
        this.initData();
        this.render();
        this.itemObj();
    },

    initData: function () {
        this.ul = this.el.getElementsByTagName("ul")[0];
        this.ulwidth = parseInt(window.getComputedStyle(this.ul, null).width);
        this.liwidth = (this.ulwidth) / this.boder;
    },

    itemObj() {
        this.item = []
        for (let i = 0; i < this.boder ** 2; i++) {
            let step = 1 / (this.boder - 1) * 100
            let x = step * parseInt(i % this.boder);
            let y = step * parseInt(i / this.boder);
            let left = parseInt(i % this.boder) * this.liwidth;
            let top = parseInt(i / this.boder) * this.liwidth;
            this.item.push({
                no: null,
                now: i,
                x: x,
                y: y,
                left: left,
                top: top
            })
        }
        console.log(this.item)
    },

    render: function () {
        let temp = ""
        for (let i = 0; i < this.boder ** 2; i++) {
            let step = 1 / (this.boder - 1) * 100
            let x = step * parseInt(i % this.boder);
            let y = step * parseInt(i / this.boder);
            let left = parseInt(i % this.boder) * this.liwidth;
            let top = parseInt(i / this.boder) * this.liwidth;
            if (i == this.boder ** 2 - 1) {
                temp += `<li class="item${i}" style="width:${this.liwidth}px;height:${this.liwidth}px;
                background-image:none;left:${left}px;top:${top}px"></li>`
            } else {
                temp += `<li class="item${i}" style="width:${this.liwidth}px;height:${this.liwidth}px;
                background-size: ${this.boder}00% ${this.boder}00%;background-position:${x}% ${y}%;left:${left}px;top:${top}px"></li>`
            }
        }
        this.ul.style.height = this.ulwidth + 'px';
        this.ul.innerHTML = temp;
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
var game = new Jigsaw(el, "img/1.jpg", 3)