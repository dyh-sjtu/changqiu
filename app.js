const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const multipart = require('connect-multiparty');
const config = require("./configs/config");

mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl, {useMongoClient: true});

let port = process.env.PORT || config.port;
let app = express();

app.set('views', 'views/pages');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extend: true
}));
app.use(multipart());
app.use(express.static(path.join(__dirname, 'public')));  // 静态文件，如css,js,image等都放在此处

let moment = require('moment');
moment.locale('zh-cn');
app.locals.moment = moment;

app.use(session({
	secret: "changqiu",
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 5
	}, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
	store: new MongoStore({
		url: config.dbUrl,
		collection: 'sessions'
	}),
	resave: false,
	saveUninitialized: true
}));

app.use((req, res, next) => {
	let _user = req.session.user;
	if(_user){
		res.locals.user = _user;
	}
	next();
});


// 用于开发环境的调试堆栈信息
if ('development' === app.get('env')) {
	app.set('showStackError', true);
	app.use(logger(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug', true);
}

// 官网首页
let index = require('./routes/index/index');

// 后台首页
let admin = require('./routes/index/admin');


// 用户相关页
let user = require('./routes/user/user');
let userList = require('./routes/user/userList');

// 轮播图
let slider = require('./routes/common/slider');

// 友情链接
let friendLink  = require('./routes/common/friendLink');

// 关于畅球
let company = require('./routes/common/company');

// 工程案例
let project = require('./routes/common/project');

// 产品介绍
let product = require('./routes/product/product');
let productCategory = require('./routes/product/productCategory');

// 新闻相关页
let news = require('./routes/news/news');

// 访问统计
let viewAnalysis = require('./routes/viewAnalysis/viewAnalysis');

// 状态跳转页
let status = require('./routes/status/status');

// 404页面
let notfound = require('./routes/404/404');

// 路由的切换页面
app.use("/", index);
app.use('/', admin);

// 用户相关路由
// 用户登录注册
app.use('/', user);
// 用户列表
app.use('/', userList);

// 轮播图
app.use('/', slider);

// 产品介绍
app.use('/', product);
app.use('/', productCategory);

// 友情链接
app.use('/', friendLink);

// 畅球介绍
app.use('/', company);

// 项目案例相关
app.use('/', project);

// 新闻页
app.use('/', news);

// 访问统计
app.use('/', viewAnalysis);

// 状态提示路由
app.use('/', status);

// 404页面
app.use('/', notfound);

// 监听开发环境的端口或者设定的端口号
app.listen(port, () => {
	console.log('server running on port: ' + port);
});
