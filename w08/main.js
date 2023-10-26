// 컴퓨터공학과 201935247 김현겸
const express = require('express');
const app = express();
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');

// router 불러오기
var db = require('./lib/db');
var rootRouter = require('./router/rootRouter');
var authorRouter = require('./router/authorRouter');

// session 모듈
var session = require('express-session');
var MySqlStore = require('express-mysql-session')(session);
var options = {
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'webdb2023'
};
var sessionStore = new MySqlStore(options);
app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true,
    store : sessionStore
}));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use('/', rootRouter);
app.use('/author', authorRouter);

app.listen(3000, ()=>console.log('Example app listening on port 3000'));