var router = require("./router").router;// 无参数get请求
var router2 = require("./router2").router;// post请求
var usermanege = require('./usermanege')
var ddzIo = require('./ddzIo')
var express = require('express');
var app = express();
// var http = require("http").createServer(onRequest);
var http = require("http").createServer(app);
var fs = require('fs');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var port = 1235;// 端口号



// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser('admin'));
app.set('view engine', 'ejs');
app.set('sf', { root: __dirname })// sendFile

app.get('/', function (req, res) {





	/* if (!req.cookies) {
		res.cookie('user', 'Jk_lai', { expires: new Date(Date.now() + 100)});

	}
	console.log(req.cookies); */
	/* if(req.signedCookies.rememberme){
		console.log(req.cookies);
	} else{
		res.cookie('rememberme', 1, { expires: new Date(Date.now() + 900000),maxAge: 90000});
	}


	console.log(res.cookie);
 */



	res.sendFile('/views/login.html', app.get('sf'), function (err) {
		if (err) {
			console.log(err);
		}
		console.log(`玩家登录`);
	})
})
app.post('/user', bodyParser.json(), function (req, res) {












	var obj = JSON.parse(fs.readFileSync('./usersTable/users.json', encoding = 'utf-8'));
	var name = req.body.user
	if (obj[name] == req.body.paw.toString()) {

		// res.sendfile('/views/happy.html', app.get('sf'))
		res.render('ddz', { name: name })
		return
	}
	// res.sendfile('/views/login.html', app.get('sf'))
	res.send(`sorry, ${name} 女士`)
	console.log('登录失败');
})

ddzIo.init(http);
http.listen(port, function () {
	console.log(`\nServer running now... Access by localhost:${port}\n`);
});

function onRequest(request, response) {

	if (request.method.toLowerCase() == 'get') {

		var myURL = new URL('http://' + request.headers.host + request.url);

		if (myURL.search != null && myURL.search != '') {

			console.log('GET *|* URL.search -- ', myURL.search);
			usermanege.myParse(myURL, response);// 如果有参数

		} else {
			router(request, response);// 如果没有参数
		}

	} else if (request.method.toLowerCase() == 'post') {
		router2(request, response);
	}

}