var cardManege = require('./cardManege');// 发牌，房间管理
var logic = require('./logic');// 卡牌大小逻辑
var io;
var connections = {
    people: 0,
};
var cardView = {

}
function removeRoom(classId) {
    // 房间玩家人数减1
    connections[classId] = {
        num: 0, // 总人数
        id: classId, // 房间id
        people: [],// 玩家id(单独房间号)
        Rejections: 0,// 拒绝次数
        luckNumber: Math.floor(Math.random() * 3),// 幸运儿
        luckCard: null// 地主牌
    };
    logic.forma();
}
function next(classId, flag) {
    // 下一位玩家出牌
    if (connections[classId].luckNumber == 2) {
        connections[classId].luckNumber = 0;
        io.to(connections[classId].people[0]).emit('isMe', flag);
        return;
    }
    connections[classId].luckNumber++;
    io.to(connections[classId].people[connections[classId].luckNumber]).emit('isMe', flag);
}
function init(http) {
    io = require('socket.io')(http);


    io.on('connection', function (socket) {
        var classId;// 房间号
        var name;
        var laveCards = 17;
        var outC;
        connections.people++;

        socket.on('ready', function (data) {
            classId = data['roomId'];
            name = data['name'];
            // null、undefined、NaN、+0、-0、""，这六种转换成布尔类型是false，其余都是true
            if (!connections[classId]) {// 如果房间不存在
                connections[classId] = {
                    num: 0, // 总人数
                    id: classId, // 房间id
                    people: [],// 玩家id(单独房间号)
                    Rejections: 0,// 拒绝次数
                    luckNumber: Math.floor(Math.random() * 3),// 幸运儿
                    luckCard: null// 地主牌
                };
            }
            if (data.flag) {// 如果准备事件为true
                if (connections[classId].people.length <= 3) {// 如果玩家人数不足3人
                    connections[classId].num++;// 房间玩家数
                    connections[classId].people.push(socket.id);// 保留玩家id
                    socket.join(classId); // join(房间名)加入房间
                    socket.broadcast.emit('addOne', JSON.stringify({ name: name, id: socket.id }));// 通知其他玩家
                    console.log('%d 个用户已连接 %s 号赌场', connections[classId].num, connections[classId].id);
                }

                if (connections[classId].people.length == 3) {
                    var luckCard = cardManege.init(io, connections[classId]);
                    console.log('luckCard', typeof luckCard, luckCard);
                    connections[classId].luckCard = luckCard;
                    var zb = cardManege.zb
                    for (var z in zb) { zb[z] = zb[z].toString() }
                    console.log(zb);
                }
                return
            } else {
                socket.leave(classId);
                connections[classId].num--;
                connections[classId].people.splice(connections[classId].people.indexOf(socket.id), 1)
                console.log(`${name},取消准备`);
            }
        })

        socket.on('luck', function (data) {
            if (data) {// 如果玩家同意当选

                if (socket.id == connections[classId].people[connections[classId].luckNumber]) {// 验证玩家是否为真
                    console.log(`\n+ + ${name}玩家,同意当选地主 + +\n`);
                    connections[classId].Rejections = 0;
                    laveCards += 3;
                    socket.emit('luck2', JSON.stringify(connections[classId].luckCard));// 发出添加地主拍指令
                    io.to(classId).emit('endCard', JSON.stringify({ luckCard: connections[classId].luckCard, id: socket.id }));// endCard--向所有玩家展示地主牌
                    return;
                }
                // 冒牌处理方法未写
                console.log('这是冒牌地主');

            } else { // 如果玩家不同意当选地主
                connections[classId].Rejections++; // 拒绝当选地主次数加1

                if (connections[classId].Rejections == 3) { // 如果全部玩家拒绝当选地主
                    connections[classId].Rejections = 0;// 计数归零
                    connections[classId].luckNumber = Math.floor(Math.random() * 3);// 从新选择地主数字
                    io.to(classId).emit('end', '所有人不想当地主');
                    return;
                }
                if (connections[classId].luckNumber == 2) {
                    connections[classId].luckNumber = 0;
                    io.to(connections[classId].people[0]).emit('luck', 'congartulation');
                    return;
                }
                connections[classId].luckNumber++;
                io.to(connections[classId].people[connections[classId].luckNumber]).emit('luck', 'congartulation');
            }
        })

        socket.on('outCard', function (data, fn) {// 用户出的牌
            if (socket.id == connections[classId].people[connections[classId].luckNumber]) {// 如果无作弊

                outC = JSON.parse(data)
                // 如果玩家要牌
                if (outC.flag) {
                    var iSpass = logic.init(outC.str)
                    if (iSpass) {// 如果算法通过
                        fn(iSpass);
                        laveCards -= outC.str.length;// 计算玩家剩余卡牌数
                        connections[classId].Rejections = 0// 拒绝计数清零
                        io.to(classId).emit("outCard", JSON.stringify({ outC: outC.str, name: name }));

                        if (laveCards > 0) {
                            next(classId, iSpass);
                        } else if (laveCards <= 0) {
                            // 玩家赢得游戏
                            connections[classId].Rejections = 0;// 拒绝计数清零
                            logic.forma();
                            connections[classId].luckNumber = Math.floor(Math.random() * 3);// 从新选择地主数字
                            removeRoom(classId);
                            io.to(classId).emit('end', socket.id)
                        }
                        return;
                    }
                    fn(iSpass)// 不通过返回false
                    socket.emit('isMe', true);
                    return;
                }
                // 玩家要不起
                connections[classId].Rejections++;
                if (connections[classId].Rejections == 2) {
                    console.log('轮到自己了');
                    connections[classId].Rejections = 0;
                    logic.forma();
                    next(classId, false);// 轮回到自己
                    return;
                }
                next(classId, true);
                return;
            }
            console.log('作弊，非顺序出牌!');
        })

        socket.on('qingLing', function () {
            laveCards = 17;
            socket.leave(classId);
            // removeRoom(classId);
            console.log(`${name}，卡牌书已重置\n`);
        })

        socket.on('disconnect', function () {
            // 服务器人数减一
            connections.people--;
            try {
                // 房间中删除自己
                removeRoom(classId);
                console.log(`玩家${name},离开赌城`);
                socket.broadcast.emit('end', socket.id);// 通知其他玩家自己离开
                console.log('%s用户已断开', socket.id);
            } catch (error) { }
        })
    })
}

exports.init = init;