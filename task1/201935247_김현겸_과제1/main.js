// 컴퓨터공학과 201935247 김현겸 
const express = require('express');
const app = express();

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');

var db = require('./lib/db');
var author = require('./lib/author');

app.get('/', (req, res)=>{
    res.render('home', (err, html)=>{
        res.end(html)
    })
});

app.get('/author', (req,res)=> {
    author.author(req, res);
})

app.get('/favicon.ico',(req, res)=>res.writeHead(404)); 
app.listen(3000, () => console.log('Example app listening on port 3000'));