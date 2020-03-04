/* var sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            // 返回 ‘ok’
            resolve('ok');
        }, time);
    })
};
 */
/* var start = async function () {
    let result = await sleep(1000);
    console.log(result); // 收到 ‘ok’
}; */

/* var start = async function () {
    for (var i = 1; i <= 10; i++) {
        console.log(`当前是第${i}次等待..`);
        await sleep(1000);
    }
}; */
// start()
/* var fs = require('fs');

function runAsync(fn) {
    return new Promise(fn);
}

async function readF(path) {
    return await runAsync(function (resolve, reject) {
        fs.readFile(path, function (err, data) {
            resolve(data.toString());
        })
    })
}

readF('./usersTable/users.json')
    .then(function (obj) {
        console.log(obj);
    }) */
/* new Promise(function (resolve, reject) {
    var json = readF('./usersTable/users.json');
    resolve(json);
})
    .then(function (json) {
        console.log(json);
    })
 */

/* async function main() {
    //如果是普通数据，那么会被包装为一个立即resolve的Promise对象
    // return 123;
    return new Promise((resolve, reject) => {
        resolve(123)
    })
} */
// const data = main();
// console.log(data);

/* data.then(num => {
    console.log(num)
    //上面三个return    返回123
}) */

/* async function main2 () {
    const data = await main()
    console.log(data)
}
main2() */
function Dog() {
    this.name = '旺财';
    this.sayHi = function (age) {
        console.log(`my name is ${this.name}, this year ${age} old`);
    }
}
var dog = new Dog()
dog.sayHi(17)
