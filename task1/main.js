// 컴퓨터공학과 201935247 김현겸 
const express = require('express');
const app = express();

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');

var db = require('./lib/db');
var author = require('./lib/author');

app.get('/', (req, res)=>{
    author.home(req, res);
});

// app.get('/author', (req,res)=> {
//     author.author(req, res);
// });

app.get('/page/:pageId', (req, res)=>{
    author.page(req, res);
});

app.get('/create', (req, res)=>{
    author.create(req, res);
});

app.post('/create_process', (req, res)=>{
    author.create_process(req, res);
});

app.get('/update/:pageId', (req, res)=>{
    author.update(req, res);
});

app.post('/update_process', (req, res)=>{
    author.update_process(req,res);
});

app.get('/delete/:pageId', (req, res)=>{
    author.delete_process(req, res);
});

app.listen(3000, () => console.log('Example app listening on port 3000'));