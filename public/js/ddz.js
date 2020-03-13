// 隐藏滚动条
document.documentElement.style.overflow = 'hidden';
function my$(str) {
    if (str.indexOf("#") == "0") {
        return document.getElementById(str.slice(1));
    } else if (str.indexOf(".") == "0") {
        return document.getElementsByClassName(str.slice(1));
    } else {
        return document.getElementsByTagName(str);
    }
}

var myName = my$('#name').innerText


function playerFn(obj, place) {

    this.name = obj.name;
    this.id = obj.id;
    this.lastCards = 17;
    this.place = place;

    this.place.children[0].innerText = this.name;
    this.place.children[1].innerText = this.lastCards;

    this.outCard = function (data) {
        if (data.name == this.name) {
            this.lastCards -= data.outC.length;
            this.place.children[1].innerText = this.lastCards;
        }
    }

    this.endCard = function (data) {
        if (JSON.parse(data).id == this.id) {
            this.place.children[0].innerText = `${this.name},玩家是大地主`
            this.lastCards = 20; // 地主有20张牌
            this.place.children[1].innerText = this.lastCards;
        }
    }
}

/**
 * discription 从父元素中删除自己   2020/2/21 15:07 解决地主牌排序问题
 * @param {Elements} ele 需要清除的元素类名
 */
function myRemoveChild(eles, parentEle) {
    var list = my$(parentEle).getElementsByClassName(eles);
    Array.prototype.slice.call(list).forEach(function (item) {
        // 伪数组元素遍历问题！！！
        item.parentNode.removeChild(item);
    })
}
// 目标元素添加卡牌
function sortCards(cardList, ele) {
    var ele = my$(ele);// 目标元素
    var myCardList = [];
    var card;

    // 向手里添加卡牌
    for (var i = 0; i < cardList.length; i++) {

        card = document.createElement('div');
        card.innerText = cardList[i];// 闭包问题？？
        card.className = 'card';

        card.style.left = (i + 7) * 3 + '%';

        ele.appendChild(card);// 卡片添加到元素中。
        // myCard.push(card)

        // 卡片添加到数组中。
        // myCardList.push(card);

        // 添加点击事件。
        card.addEventListener('click', function () {
            /* var nameList = this.className.split(' ');
            if (nameList.length != 1) {
                this.className = 'card';
                // this.style.left = (myCardList.indexOf(this) + 5) * 4 + '%';
            } else {
                this.className += ' sele';
            } */
            this.classList.toggle('sele')
        });
    }
}
/**
 * discription: 排序机器,把牌变成文字，比如大小王，A,K,Q,J,
 * @param {Array} first 
 * @returns {Array} 
 */
function format(first) {
    var first2num = 0;
    var tempList = [];
    first.forEach(function (item) {
        // if (item.num == 15 || item.num == 14) {
        if (item == 15 || item == 14) {
            first2num++;
        }
    })

    for (var x = 0; x < first.length; x++) {
        // switch (first[x].num) {
        switch (first[x]) {
            case 15:
                tempList.push('大王');
                // first.splice(x, 1, '大王');
                break;
            case 14:
                tempList.push('小王');
                // first.splice(x, 1, '小王');
                break;
            case 13:
                tempList.push('K');
                // first.splice(x, 1, 'K');
                break;
            case 12:
                tempList.push('Q');
                // first.splice(x, 1, 'Q');
                break;
            case 11:
                tempList.push('J');
                // first.splice(x, 1, 'J');
                break;
            case 2:
                tempList.splice(first2num, 0, '2');
                // first.splice(first2num, 0, '2');
                // first.splice(x + 1, 1);// 从后面删掉原来的自己
                first2num++;
                break;
            case 1:
                tempList.splice(first2num, 0, 'A');
                // first.splice(first2num, 0, 'A');
                // first.splice(x + 1, 1);
                first2num++;
                break;
            default:
                tempList.push(first[x] + '');
                // tempList.push(first[x].num + '');
                // first.splice(x, 1, first[x].num + '');
                break;
        }
    }
    return tempList;
}
// 准备事件
my$('.ready')[0].onclick = function () {
    if (game.flag) {
        my$('.mes')[0].style.display = 'block';
        game.socket.emit('ready', { roomId: '1212', flag: game.flag, name: myName });
        game.flag = false;
    } else {
        my$('.mes')[0].style.display = 'none';
        game.socket.emit('ready', { roomId: '1212', flag: game.flag, name: myName });
        game.flag = true;
    }
}
// 同意成为地主事件
my$('.mes')[0].addEventListener('click', agree)
function agree() {
    game.socket.emit('luck', true, function (data) {
        // 插入地主牌
        my$('.myLastCards')[0].innerText = 20;
        game.myCard = game.myCard.concat(JSON.parse(data)).sort(function (a, b) { return b - a });
        myRemoveChild('card', '#me');// 删除手里的牌，加上地主牌从新排序
        sortCards(format(game.myCard), '#me');

        my$('.grad')[0].style.display = 'none'; // 
        my$('.out')[0].style.display = 'block'; // 出牌按钮显示
    });
}

// 拒绝成为地主事件
my$('.grad')[0].addEventListener('click', function () {
    game.socket.emit('luck', false, function (data) {

        my$('.mes')[0].removeEventListener('click', agree);
        my$('.mes')[0].innerText = '准备';
        my$('.mes')[0].style.background = 'white';
        my$('.grad')[0].style.display = 'none';
    });
})
// 出牌事件
my$('.out')[0].onclick = function () {
    var l = [...my$('.sele')];// 添加的是卡片
    var str = [];
    // 循环向数组添加出手卡牌
    l.forEach(function (item) {
        switch (item.innerText) {
            case '大王':
                str.push(15);
                break;
            case '小王':
                str.push(14);
                break;
            case 'K':
                str.push(13);
                break;
            case 'Q':
                str.push(12);
                break;
            case 'J':
                str.push(11);
                break;
            case 'A':
                str.push(1);
                break;
            default:
                str.push(parseInt(item.innerText));
                break;
        }
    });
    game.socket.emit('outCard', JSON.stringify({ str: str, flag: true }), function (flag) {
        if (flag) {
            l.forEach(function (item) {
                item.parentNode.removeChild(item);
                game.eleCard.splice(game.eleCard.indexOf(item), 1)
            })

            game.eleCard.forEach(function (item, i) {
                item.style.left = (i + 7) * 3 + '%';
            })
            // 剩余卡牌
            my$('.myLastCards')[0].innerText = parseInt(my$('.myLastCards')[0].innerText) - l.length;

            return
        }
        // 出牌不成功
        l.forEach(function (item) {
            item.className = 'card';
        })

    })
    my$('.out')[0].style.display = 'none';
    my$('.pass')[0].style.display = 'none';
}
// 要不起事件
my$('.pass')[0].onclick = function () {
    game.socket.emit('outCard', JSON.stringify({ flag: false }));
    my$('.out')[0].style.display = 'none';
    my$('.pass')[0].style.display = 'none';
}



class Game {
    constructor() {
        this.myCard = []
        this.eleCard = []; // 元素数组
        this.outPlayerArray = [];// 其他玩家列表
        this.other = 0;
        this.flag = true;// 是否准备
    }
    reset(){
        this.myCard = []
        this.eleCard = []
        this.outPlayerArray = []
        this.other = 0
        this.flag = true
    }
}
Game.prototype.socket = null;

var game = new Game(); // 每局游戏参数setting

function initF() {
    // 47.97.157.6:80
    // var socket = io.connect('127.0.0.1:1235');
    /* var myCard = []; // 手上所有卡牌
    eleCard = []; // 元素数组
    var other = 0; */

    game.socket = io.connect('127.0.0.1:1235');

    // 玩家进入房间
    game.socket.on('addOne', function (otherPlayerObj) {
        game.outPlayerArray.push(new playerFn(JSON.parse(otherPlayerObj), my$('.playerPlace')[game.other]))
        // my$('.playerPlace')[other].children[1].innerText = otherPlayerName;
        my$('.playerLogo')[game.other++].style.display = 'block';
    })

    // 准备完毕，卡牌排序
    game.socket.on('ready', function (data) {
        game.myCard = JSON.parse(data);
        sortCards(format(game.myCard), '#me');
        my$('.ready')[0].style.display = 'none';
    });

    // 被选为幸运儿
    game.socket.on('luck', function (data) {
        console.log(`${data} U`);
        my$('.mes')[0].style.cssText = 'display:block;background:red;';// 抢
        my$('.mes')[0].innerText = '抢地主';
        my$('.grad')[0].style.display = 'block';// 不抢
    });

    // 地主牌加手里
    /* socket.on('luck2', function (data) {
        my$('.myLastCards')[0].innerText = 20;
        game.myCard = game.myCard.concat(JSON.parse(data)).sort(function (a, b) { return b - a });
        
        myRemoveChild('card', '#me');// 删除手里的牌，加上地主牌从新排序

        sortCards(format(game.myCard), '#me');
    });
 */
    // 展示地主卡牌，进入游戏正是阶段
    game.socket.on('endCard', function (data) {
        game.eleCard = [...my$('.card')];
        var luckCards = format(JSON.parse(data).luckCard);
        my$("#topCard").innerText = luckCards[0] + '--' + luckCards[1] + '--' + luckCards[2];

        [...my$('#table').getElementsByTagName('span')].forEach(function (item) {
            item.style.cssText = 'display:none;background:white;';// 牌桌上所有准备标签清空
        })
        my$('.ready')[0].style.display = 'none';// ready标签隐藏

        // 地主现身
        game.outPlayerArray.forEach(function (item) {
            item.endCard(data);
        })
    })
    // 轮到出牌
    game.socket.on('isMe', function (data) {
        if (data) {
            my$('.out')[0].style.display = 'block';
            my$('.pass')[0].style.display = 'block';
            return;
        }
        my$('.out')[0].style.display = 'block';
    })

    // 别人出的牌
    game.socket.on('outCard', function (data) {
        data = JSON.parse(data)
        console.log('收到玩家出牌');
        try {
            myRemoveChild('card', '#table');
        } catch (error) { }
        sortCards(format(data.outC), '#table')
        game.outPlayerArray.forEach(function (item) {
            item.outCard(data);
        })
    });
    // 玩家离开，或者游戏重新开始
    game.socket.on('end', function (data) {
        game.socket.emit('qingLing')
        my$('.myLastCards')[0].innerText = 17

        console.log('恭喜玩家%s赢得游戏，或者离开', data);

        myRemoveChild('card', '#me');
        myRemoveChild('card', '#table');
        my$('#topCard').innerText = '';

        [...my$('#table').getElementsByTagName('span')].forEach(function (item) {
            item.style.display = 'none';
        })

        my$('.ready')[0].style.display = 'block';
        my$('.out')[0].style.display = 'none';
        my$('.pass')[0].style.display = 'none';

        game.reset();

        [...my$('.playerPlace')].forEach(function (item) {
            [...item.children].forEach(function (innerI) {
                innerI.innerText = '';
            })
        })

    })

}

initF();