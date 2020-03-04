var types = ['红桃', '黑桃', '方块', '梅花'], // 花色
    points = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]// 点数
var zb = {}
// 洗牌器
function give() {
    // var cards = [{ color: 'red', num: 15 }, { color: 'black', num: 14 }]; // 所有扑克牌
    var cards = [15, 14];
    for (var i in types) {
        for (var x in points) {
            /* cards.push({
                color: types[i],
                num: points[x]
            }) */
            cards.push(points[x]);
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
    return [cards.splice(0, 17), cards.splice(0, 17), cards.splice(0, 17), cards.splice(0, 3)];

}
/**
 * 
 * @param {*} io socket.io
 * @param {*} list 
 * {
 *      num:          total people
 *      id: room      id
 *      people:       玩家id
 *      Rejections:   拒绝次数
 *      luckNumber:   幸运数字
 *      luckCard:     地主牌
 *}
 */
function init(io, list) {

    var player = list['people'];// 玩家id
    var cards = [];// 卡牌库
    var classId = list.id;// 房间号

    give().forEach(function (item) { // 准备卡牌库
        cards.push(JSON.stringify(item.sort(function (a, b) { return b - a })))
    })

    player.forEach(function (item, i) {// 发牌
        io.to(item).emit('ready', cards[i]);
        zb[item] = format(JSON.parse(cards[i]));
    })

    io.to(player[list.luckNumber]).emit('luck', 'congartulation');// 随机选择地主(0~2)

    return JSON.parse(cards[3]);
}
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
                break;
            case 14:
                tempList.push('小王');
                break;
            case 13:
                tempList.push('K');
                break;
            case 12:
                tempList.push('Q');
                break;
            case 11:
                tempList.push('J');
                break;
            case 2:
                tempList.splice(first2num, 0, '2');
                first2num++;
                break;
            case 1:
                tempList.splice(first2num, 0, 'A');
                first2num++;
                break;
            default:
                tempList.push(first[x] + '');
                break;
        }
    }
    return tempList;
}

exports.init = init;
exports.zb = zb;