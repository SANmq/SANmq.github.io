Mine.prototype = {
    init: function () {
        this.initData();
        this.render();
        this.handle();
        // this.startArray(10);
        // console.log(this.cell);
    },

    initData: function () {
        // 格子数
        this.cellNum = this.width * this.height;
        this.cellLen = 24;
        // 格子对象，存放所有格子的信息
        this.cell = [];
        this.boderLen = this.cellLen * this.width + 'px';
        // 获取游戏格子区域ul元素
        this.ul = ele.getElementsByTagName("ul")[0]
        // 是否第一次点击
        this.clickNum = 1;
        this.time = 0;
        // 剩余雷的数量
        this.restDiv = this.ele.getElementsByClassName("restmine")[0];
        console.log(this.restDiv);
        // 状态样式对照表
        this.styleList = ['on', 'off', '', 'flag'];
        // 游戏状态
        this.gameStyle = true;
        // 旗子数量
        this.flagNum = 0;
        // 点开区域的数量
        this.on = 0;
    },

    render: function () {
        // 构建初始游戏dom结构
        this.ul.innerHTML = "";
        this.ele.style.width = this.boderLen;
        for (let i = 0; i < this.cellNum; i++) {
            let li = document.createElement('li');
            li.className = "on";
            // li.textContent = i + "";
            li.setAttribute("index", i + "");
            this.ul.appendChild(li);
            this.cell[i] = {
                ele: li,
                // 周围所有li元素/格子的索引列表
                around: this.around(i),
                // 对应的格子的状态，0未被点击，1被点开，3被插旗
                state: 0,
            }
        }
    },

    // 计算一个格子周围的其它格子的索引
    around(index) {
        let arr = [];
        let a = parseInt(index / this.width);
        let b = parseInt(index % this.width);
        for (let i = a - 1; i <= a + 1; i++) {
            for (let j = b - 1; j <= b + 1; j++) {
                if (i >= 0 && j >= 0 && i < this.width && j < this.height) {
                    if (i !== a || j !== b) {
                        arr.push(i * this.width + j)
                    }
                }
            }
        }
        return arr;
    },

    // 产生雷阵，保证点击后的第一个不是地雷，保护措施
    startArray(safe) {
        this.arr = []
        for (let i = 0; i < this.cellNum - 1; i++) {
            this.arr[i] = i < this.mine ? -1 : 0;
        }
        // 随机排序以产生随机的雷位
        this.arr.sort(function (a, b) {
            return Math.random() - 0.5;
        })
        this.arr.splice(safe, 0, 0);
        this.cellObj(this.arr);
    },

    // 添加提示信息到cell对象
    cellObj(arr) {
        for (let i = 0; i < this.cellNum; i++) {
            if (arr[i] == 0) {
                let sum = 0;
                for (let j = 0; j < this.cell[i].around.length; j++) {
                    sum += arr[this.cell[i].around[j]];
                }
                this.cell[i].tip = sum * -1;
            } else {
                this.cell[i].tip = -1;
            }
        }
    },


    handle: function () {
        this.handlemouseup();
    },

    handlemouseup() {
        self = this;
        document.onmouseup = function (e) {
            // 如果是在游戏区域内的元素
            if (e.target && e.target.getAttribute("index") && self.gameStyle) {
                let index = parseInt(e.target.getAttribute("index"));
                if (self.clickNum == 1) {
                    self.startArray(e.which == 1 ? index : Math.random * self.cellNum);
                    self.clickNum = 0;
                }
                let cell = self.cell[index];
                // 获取事件对应的格子对象
                switch (e.which) {
                    case 1:
                        // 左键事件
                        if (cell.tip === -1) {
                            // 游戏失败事件
                            cell.ele.className = "boo";
                            cell.ele.innerText = "X"
                            self.gameover();
                        } else {
                            // 产生待执行队列
                            let queue = [index];
                            while (queue.length) {
                                let temp = self.cell[queue.shift()];
                                if (temp.state == 0) {
                                    temp.state = 1;
                                    self.on += 1;
                                    temp.ele.className = self.styleList[temp.state];
                                    temp.ele.innerText = "" + temp.tip;
                                    // 如果其周围雷数为0，将其周围索引加入队列尾部
                                    if (temp.tip == 0) {
                                        queue = queue.concat(temp.around);
                                    }
                                }
                            }
                        }
                        break;
                    case 3:
                        // 右键事件
                        if (cell.state == 0) {
                            cell.state = 3;
                            // 插旗
                            self.flagNum += 1;
                        } else if (cell.state == 3) {
                            cell.state = 0;
                            self.flagNum -= 1;
                        }
                        cell.ele.className = self.styleList[cell.state];
                        console.log(self.restDiv)
                        break;
                }
                // 如果插旗的数量等于雷的数量，则判断是否游戏胜利
                if (self.flagNum == self.mine) {
                    // console.log("10");
                    let temp = 0
                    for (let i = 0; i < self.cellNum; i++) {
                        if (self.cell[i].state == 3 && self.cell[i].tip == -1) {
                            console.log('abc')
                            temp += 1;
                        }
                    }
                    if (temp === self.flagNum) {
                        self.gameWin();
                    }
                }

                if (self.on == (self.cellNum - self.mine)) {
                    self.gameWin();
                }
                self.restDiv.innerText = (self.mine - self.flagNum);
            };

        }
    },
    // 游戏失败事件
    gameover() {
        this.gameStyle = false;
        for (let i = 0; i < this.cellNum; i++) {
            if (this.cell[i].tip == -1 && this.cell[i].state == 0) {
                this.cell[i].ele.className = "boo";
                this.cell[i].ele.innerText = "X"
            }
            console.log("我失败了")
        }
        setTimeout('alert("游戏失败")',10)
        // alert("游戏失败");
    },
    // 游戏成功事件
    gameWin() {
        this.gameStyle = false;
        for (let i = 0; i < this.cellNum; i++) {
            if (this.cell[i].tip != -1) {
                this.cell[i].state = 1;
                this.cell[i].ele.className = this.styleList[this.cell[i].state];
                this.cell[i].ele.innerText = this.cell[i].tip + "";
            } else {
                if(this.cell[i].state!=3){
                    this.cell[i].state = 3;
                    this.cell[i].ele.className = this.styleList[this.cell[i].state];
                    this.flagNum+=1;
                }
            }
        }
        alert("游戏成功");
    }
}

function Mine(ele, width, height, mine) {
    // 根据设定生成对应大小的容器
    this.ele = ele;
    // 最小9X9的游戏区域
    this.width = width >= 9 ? width : 9;
    this.height = height >= 9 ? height : 9;
    // 地雷的数量
    this.mine = mine >= 1 ? mine : 1;
    // 剩余地雷的数量
    this.restMine = this.mine;
    this.init();
}

var ele = document.getElementById('clean-mine');
new Mine(ele, 20, 20, 50);
var gamestart = ele.getElementsByClassName("start")[0];
console.log(gamestart);
gamestart.onclick = function () {
    new Mine(ele, 20, 20, 50);
}