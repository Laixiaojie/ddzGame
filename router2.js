var queryString = require('querystring');
var fs = require('fs');

async function readF(path) {
    return await new Promise(function (resolve, reject) {
        fs.readFile(path, function (err, data) {
            resolve(JSON.parse(data));
        })
    })
}

function router(request, res) {
    var temp = '';
    request.on('data', function (data) {
        temp += data;
    });

    request.on('end', function () {

        /* JSON.stringify(object); 将 JavaScript 对象转换为字符串。用于向服务器发送json随想
        JSON.parse(object) 将 字符串 转换为JavaScript对象 */

        temp = queryString.parse(temp, null, null, { decodeURIComponent: 'gbk' });

        var userName = temp.userName;
        var paw = temp.paw;

        readF('./usersTable/users.json')
            .then((obj) => {
                if (obj[userName] != null) {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
                    res.end(obj[userName])
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
                    res.end('sorry');
                }
            })


        // res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        // res.end(JSON.stringify(temp));
    });

}

exports.router = router;