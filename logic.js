// 斗地主卡牌大小logic、
var doudizhu = require('./doudizhu.js')
var nowC = []// 现在的卡牌
var lastCards = null;// 上家的卡牌
var TempCards = [];

function init(cards) {
    console.log('lastCards', lastCards);

    cards.forEach(function (item, index) {
        if (item == 15) {
            nowC[index] = 53;
        } else {
            nowC[index] = (item - 1) * 4;
        }
    });
    console.log(nowC);
    if (doudizhu.beat(lastCards, nowC)) {
        lastCards = [];
        TempCards = [];
        nowC = []
        cards.forEach(function (item, index) {// 这次的卡牌便上次的
            if (item == 15) {
                lastCards[index] = 53;
            } else {
                lastCards[index] = (item - 1) * 4;
            }
        })
        TempCards = lastCards.slice();// 记录上家卡牌
        console.log('TempCards1', TempCards);
        return true;
    }
    // 如果不通过
    nowC = []
    console.log(`卡牌比不过上家,${TempCards}`);
    lastCards = TempCards.slice();
    return false;
}

function forma() {
    lastCards = null;
    TempCards = [];
    nowC = []
    console.log(`上一轮已重置`);
}

exports.init = init;
exports.forma = forma;