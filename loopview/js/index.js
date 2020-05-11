LoopView.prototype = {

    init: function () {
        // 定义初始的展示位置大小,没有填充默认大小
        this.initData();
        this.render();
        this.handle();
        this.timer2 = setInterval(self.rightButton.onclick, self.speed);
    },

    initData: function () {
        //  初始化图片位置，
        this.index = 1;
        this.timer1 = null;
        this.timer2 = null;
        //  计算有边界
        this.rightborder = -this.width * (this.length + 1)
        // 初始化每次移动步长
        this.step = 0;
        // 初始化下次的位置
        this.nextDis = -this.width * this.index;
        // 初始化当前的位置
        this.nowDis = -this.width * this.index;
        // 初始化展布宽高
        this.exhibition.style.width = -this.rightborder + this.width + "px";
        this.exhibition.style.height = this.height + "px";
        // 初始化展布位置
        this.exhibition.style.left = this.nowDis + "px";
        // 设置防抖
        this.flag = true;

    },

    handle() {
        this.handleclick();
        this.handlemouse();
    },

    handleclick() {
        self = this;
        this.leftButton.onclick = function () {
            if (!self.flag) {
                return
            } else {
                self.move(self.width);
            }
        }
        this.rightButton.onclick = function () {
            if (!self.flag) {
                return
            } else {
                self.move(-self.width);
            }
        }

        for (let i = 0; i < this.length; i++) {
            this.button[i].onclick = (function (j) {
                return function () {
                    if (self.flag) {
                        self.index = j + 1;
                        self.nextDis = -self.width * self.index;
                        self.move(self.nextDis - self.nowDis);
                    }
                }
            }(i))
        }

    },

    handlemouse() {
        self = this;
        this.exhibition.onmouseenter = function () {
            clearInterval(self.timer2);
        }
        this.exhibition.onmouseout = function () {
            self.timer2 = setInterval(self.rightButton.onclick, self.speed)
        }
    },


    circle() {
        for (let i = 0; i < this.length; i++) {
            if (this.index == i + 1) {
                this.button[i].className = "select"
            } else {
                this.button[i].className = null;
            }
        }
    },

    move(dis) {
        this.nextDis = this.nowDis + dis;
        this.step = parseInt(dis / 40) + 1;
        self = this;
        this.flag = false;
        let nextindex = -self.nextDis / self.width
        if (nextindex < 1) {
            this.index = this.length;
        } else if (nextindex > this.length) {
            this.index = 1;
        } else {
            this.index = nextindex;
        }
        this.circle();
        this.timer1 = setInterval(function () {
            if (Math.abs(self.nextDis - self.nowDis) > Math.abs(self.nextDis - self.nowDis - self.step)) {
                self.nowDis = self.nowDis + self.step;
                self.exhibition.style.left = self.nowDis + 'px';
            } else {
                // 移动完成后取消定时器
                clearInterval(self.timer1);
                self.nowDis = self.nextDis;
                // 超边界取消定时器并重置
                if (self.nextDis == self.rightborder) {
                    self.nowDis = -self.width;
                }
                if (self.nextDis == 0) {
                    self.nowDis = -self.length * self.width;
                }
                self.exhibition.style.left = self.nowDis + 'px';
                self.flag = true;
            }
        }, 10)
    },

    // 初始化渲染页面方法
    render: function () {
        // 产生临时插入值
        let contant1 = ""
        let contant2 = ""
        for (let i = 0; i <= this.length + 1; i++) {
            if (i == 0) {
                contant1 += `<a href="" class="img"><img src=${this.data[this.data.length - 1]} alt=""></a>\n`

            } else if (i == this.length + 1) {
                contant1 += `<a href="" class="img"><img src=${this.data[0]} alt=""></a>\n`

            } else {
                contant1 += `<a href="" class="img"><img src=${this.data[i - 1]} alt=""></a>\n`
                contant2 += `<li><a href="javascript:void(0)"></a></li>`
            }
        }
        this.exhibition.innerHTML = contant1;
        this.controlBar.innerHTML = contant2;
        // 更新小圆点的位置
        this.button = this.controlBar.childNodes;
        this.button[this.index - 1].className = 'select';
    },
}



function LoopView(ele, width, height, speed, data, leftButton, rightButton, controlBar) {
    this.ele = ele || document.getElementById("loopview");
    this.exhibition = this.ele.getElementsByClassName("img-player")[0];
    this.controlBar = controlBar || this.ele.getElementsByClassName('select-nav')[0];
    this.leftButton = leftButton || this.ele.getElementsByClassName('select-left')[0];
    this.rightButton = rightButton || this.ele.getElementsByClassName('select-right')[0];
    this.width = width || 520;
    this.height = height || 280;
    this.speed = speed || 2000;
    this.data = data || ["img/img1.webp", "img/img2.jpg", "img/img3.jpg", "img/img4.jpg", "img/img5.webp"];
    this.length = this.data.length
    this.init();
}

var l = new LoopView();