var fs = require("fs");

function runAsync(fn) {
	var promise = new Promise(fn);
	return promise;
}

function writeResponse(res, pathname) {
	// 创建promise对象，get请求成功输出congratulation，否则输出错误路路径。
	runAsync(function (resolve, reject) {
		// console.log("请求路径是--->" + pathname);
		// 无法使用try-catch语句捕抓  (lazyFs) 
		var myRed = fs.createReadStream(pathname);

		myRed.pipe(res, function () {
			// res.end();
		});
		res.addListener('finish', function () {
			resolve('  success response: ' + pathname + '');
		})
		// 添加流读取错误处理。					
		myRed.addListener('error', function (e) {
			reject(pathname);
		})
	})
		.then(function (lg) {
			console.log(lg);
		}, function () {
			console.log('sorry get page is undefined ---> ', pathname);
			res.writeHead(404, { 'Content-Type': 'text/html' });
			res.write('sorry ,404');
			res.end();
		})
}

// 路由函数。
function router(request, res) {

	// var myURL = new URL('http://' + request.headers.host + request.url);

	// switch (myURL.pathname) {
	switch (request.url) {
		case '/':
			// 默认请求页面为../index.html。
			writeResponse(res, '../ddz.html');
			break;
		case './usersTable/users.jsom':
			res.writeHead(200, { 'Content-Type': 'text/html' })
			res.end('小样');
		default:
			// 其他页面
			// writeResponse(res, '..' + myURL.pathname);
			writeResponse(res, '..' + request.url);
			break;
	}


}

exports.router = router;