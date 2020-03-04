var types = ['红桃', '黑桃', '方块', '梅花'], // 花色
    points = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],// 点数
    peopleNum = 0,
    peopleList = [];

// 洗牌器
function give() {
    var cards = [{ color: 'red', num: 15 }, { color: 'black', num: 14 }]; // 所有扑克牌
    for (var i in types) {
        for (var x in points) {
            cards.push({
                color: types[i],
                num: points[x]
            })
        }
    }
    for (var i = 0, x = cards.length; i < x; i++) {
        // 生成一个随机的数组下标(0~53)
        var index = Math.floor(Math.random() * x);
        // 将当前遍历到的元素与随机下标处的元素交换位置
        var temp = cards[index];
        cards[index] = cards[i];
        cards[i] = temp;
    }
    /* return {
        firstPlay: cards.splice(0, 17),
        secondPlay: cards.splice(0, 17),
        thirdPlay: cards.splice(0, 17),
        endCard: cards.splice(0, 3)
    } */
    return [cards.splice(0, 17), cards.splice(0, 17), cards.splice(0, 17), cards.splice(0, 3)];

}

function myParse(myUrl, res) {
    // 处理带参数的url
    
}

exports.myParse = myParse;