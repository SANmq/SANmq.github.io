mine = {
    init: function (dom, x, y, n) {
        this.initData(dom, x, y, n)
        this.render()
        this.handle()
    },
    initData: function (dom, x, y, n) {
        this.px = 30;
        this.now = null;
        this.dom = dom;
        // 游戏是否刚刚开始
        this.start = false;
        this.x = (function (x) {
            if (x < 10) {
                alert("设定宽度不能小于10")
                return false
            } else {
                return true
            }
        }(x)) ? x : 10
        this.y = (function (y) {
            if (y < 10) {
                alert("设定高度不能小于10")
                return false
            } else {
                return true
            }
        }(y)) ? y : 10;

        this.nblock = this.x * this.y

        this.n = (function (n) {
            if (n < 0 || n > this.nblock) {
                alert("设定雷数不能少于1，不能超过总数-1")
                return false
            } else {
                return true
            }
        }(n)) ? n : 10;

        this.rest = this.n;

    },
    handle: function () {
        this.clearDefaultEvent()
        this.mouseHandle()
    },

    // 需要进行3种事件类型委派，鼠标按下，鼠标按下并移动，鼠标抬起

    win: function () {
        for (let i = 0; i < this.nblock; i++) {
            let item = this.dom.children[i];
            if (item.status == 0 && item.className === "status2") {
                return false
            }
            if (item.status == 0 && item.className === "status0") {
                return false
            }
        }
        return true
    },
    mouseHandle() {
        self = this;
        window.onmousedown = function (e) {
            let sself = self
            if (e.button === 0) {
                // 按下左键触发move效果,记住当前按下键
                if (e.target.parentElement === self.dom && e.target.className === "status0") {
                    self.now = e.target;
                    self.now.className = "status5"
                }
                self.dom.onmousemove = function (e) {
                    if (e.target.parentElement === sself.dom) {
                        if (sself.now !== null) {
                            if (e.target !== sself.now) {
                                e.target.className = e.target.className === "status0" ? "status5" : e.target.className
                                sself.now.className = sself.now.className === "status5" ? "status0" : sself.now.className
                                sself.now = e.target;
                            }
                        } else {
                            sself.now = e.target
                            sself.now.className = sself.now.className === "status0" ? "status5" : sself.now.className
                        }
                    } else {
                        if (sself.now !== null) {
                            sself.now.className = sself.now.className === "status5" ? "status0" : sself.now.className
                        }
                    }
                }
            }
        }


        window.onmouseup = function (e) {
            self.dom.onmousemove = null
            // 这里需要移除移入移出事件
            if (e.target.parentElement === self.dom) {
                if (!self.start) {
                    self.start = true;
                    self.safeArray(e.target)
                }

                // 右击事件
                if (e.button === 2) {
                    if (e.target.className === "status0") {
                        e.target.className = "status2"
                        self.rest -= 1;
                    } else if (e.target.className === "status2") {
                        e.target.className = "status0"
                        self.rest += 1;
                    }
                    view.innerText = self.rest;
                }

                // 左键事件
                if (e.button === 0) {
                    if (e.target.className === "status5") {
                        if (e.target.status == 0) {
                            e.target.className = "status1"
                            let queue = []
                            if (e.target.num === 0) {
                                queue.push(e.target)
                            } else {
                                e.target.innerText = e.target.num
                            }
                            while (queue.length) {
                                // 计算周围雷的数量
                                let item = queue.shift();
                                for (let i = 0; i < item.around.length; i++) {
                                    if (self.dom.children[item.around[i]].className === "status0") {
                                        self.dom.children[item.around[i]].className = "status1";
                                        if (self.dom.children[item.around[i]].num === 0) {
                                            queue.push(self.dom.children[item.around[i]])
                                        } else {
                                            self.dom.children[item.around[i]].innerText = self.dom.children[item.around[i]].num
                                        }
                                    }
                                }
                            }
                            console.log("计算周围雷的数量")

                            if (self.win()) {

                                setTimeout(function () {
                                    alert("恭喜你！")
                                }, 30)
                                self.start = false;
                                window.onmousedown = null;
                                window.onmouseup = null;

                            }
                        } else {
                            // 点到雷了，游戏结束
                            e.target.className = "status4"
                            // 将所有的雷都显示出来。
                            for (let i = 0; i < self.nblock; i++) {
                                if (self.dom.children[i].status == 1 && self.dom.children[i].className === "status0") {
                                    self.dom.children[i].className = "status4"
                                }
                            }
                            setTimeout(function () {
                                alert("点到雷了，游戏结束")
                            }, 30);
                            self.start = false;
                            window.onmousedown = null;
                            window.onmouseup = null;

                        }
                    }

                }
            } else {
                if (self.now) {
                    self.now.className = self.now.className === "status5" ? "status0" : self.now.className
                }
            }
        }
    },



    clearDefaultEvent() {
        window.oncontextmenu = function () {
            return false
        }
    },


    render: function () {
        this.dom.style.width = this.x * this.px + "px";
        let temp = "";
        for (let i = 0; i < this.nblock; i++) {
            temp += `<li class="status0"></li>`
        }
        1
        this.dom.innerHTML = temp;
    },

    // 产生雷阵
    safeArray(safe) {
        safe.status = "0";
        let arr = []
        for (let i = 0; i < this.nblock - 1; i++) {
            arr.push(i < this.n ? 1 : 0)
        }
        arr.sort(function (a, b) {
            return Math.random() - 0.5
        })
        let temp = null;
        for (let i = 0; i < this.nblock; i++) {
            this.dom.children[i].index = i
            temp = [];
            for (let j = i - this.x; j <= i + this.x; j += this.x) {
                for (let k = j - 1; k <= j + 1; k++) {
                    if (k >= 0 && k < this.nblock && k !== i && parseInt(k / this.x) === parseInt(j / this.x)) {
                        temp.push(k)
                    }
                }
            }
            this.dom.children[i].around = temp

            if (this.dom.children[i].status) {
                arr.splice(i, 0, 0)
            } else {
                this.dom.children[i].status = arr[i]
            }
        }
        for (i = 0; i < this.nblock; i++) {
            let item = this.dom.children[i];
            if (item.status == 0) {
                item.num = 0;
                item.around.map(function (a) {
                    if (arr[a] == 1) {
                        item.num += 1;
                    }
                })
            }
        }
    }
}


var game = {
    dom: document.getElementById("mine"),
    x: 10,
    y: 10,
    n: 10
}

var btn = document.getElementsByClassName("start")[0];
var view = document.getElementsByClassName("rest")[0];
var bar = document.getElementsByClassName("bar")[0];
var mygame = document.getElementsByClassName("time")[0];

mygame.onclick = function () {
    game.y = parseInt(prompt("请输入行数")) || game.y
    game.x = parseInt(prompt("请输入列数")) || game.x
    game.n = parseInt(prompt("请输入雷数")) || game.n
    bar.style.width = game.x * 30 + "px"
    mine.init(game.dom, game.x, game.y, game.n)
    view.innerText = game.n
}

btn.onclick = function () {
    if (mine.start) {
        if (confirm("游戏尚未结束，确定要开始新的游戏？")) {
            bar.style.width = game.x * 30 + "px"
            mine.init(game.dom, game.x, game.y, game.n)
            view.innerText = game.n
        }
    } else {
        bar.style.width = game.x * 30 + "px"
        mine.init(game.dom, game.x, game.y, game.n)
        view.innerText = game.n
    }
}

btn.onclick()