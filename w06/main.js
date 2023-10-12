const express = require('express');
const app = express();

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');

var db = require('./lib/db');
var topic = require('./lib/topic');
var author = require('./lib/author');

var url = require('url');
var qs = require('querystring');
var path = require('path');

// app.get('/', (req, res)=>{
//     var _url = req.url;
//     var queryData = url.parse(_url, true).query();
//     console.log(path.parse(queryData.id));
//     res.end('path module test');
// });
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

app.listen(3000, ()=>console.log('Example app listening on port 3000'));