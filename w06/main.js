const express = require('express');
const app = express();

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');

var topic = require('./lib/topic');
var author = require('./lib/author');

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


app.listen(3000, ()=>console.log('Example app listening on port 3000'));