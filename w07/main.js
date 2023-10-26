// 컴퓨터공학과 201935247 김현겸
const express = require('express');
const app = express();
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');

// 사용자 정의 모듈
var topic = require('./lib/topic');
var author = require('./lib/author');
var db = require('./lib/db');

var session = require('express-session');
var MySqlStore = require('express-mysql-session')(session);
var options = {
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'webdb2023'
};
var sessionStore = new MySqlStore(options);
var bodyParser = require('body-parser');

app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true,
    store : sessionStore
}));
app.use(bodyParser.urlencoded({extended: false}));

// URL 분류기
app.get('/', (req, res)=>{
    topic.home(req, res);
});

app.get('/page/:pageId', (req, res)=>{
    topic.page(req, res);
});

app.get('/create', (req, res)=>{
    topic.create(req, res);
});

app.post('/create_process', (req, res)=>{
    topic.create_process(req, res);
});

app.get('/update/:pageId', (req, res)=>{
    topic.update(req, res);
});

app.post('/update_process', (req, res)=>{
    topic.update_process(req,res);
});

app.get('/delete/:pageId', (req, res)=>{
    topic.delete_process(req, res);
});

//== authort URL 부분 ==//
app.get('/author', (req, res)=>{
    author.home(req,res);
});

app.post('/author/create_process', (req, res)=>{
    author.create_process(req, res);
});

app.get('/author/update/:pageId', (req, res)=>{
    author.update(req, res);
});

app.post('/author/update_process', (req, res)=>{
    author.update_process(req,res);
});

app.get('/author/delete/:pageId', (req, res)=>{
    author.delete_process(req, res);
});

//== 로그인 ==//
app.get('/login', (req, res)=>{
    topic.login(req, res);
});

app.post('/login_process', (req, res)=>{
    topic.login_process(req, res);
});

app.get('/logout_process', (req, res)=>{
    topic.logout_process(req, res);
});


app.listen(3000, ()=>console.log('Example app listening on port 3000'));