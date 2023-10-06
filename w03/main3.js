const express = require('express');
const app = express();

app.set('views',__dirname+'/views');
app.set('view engine','ejs');

var db = require('./lib/db');
var topic = require('./lib/topic');

app.get('/',(req,res)=>{
    topic.home(req,res);
});

app.get('/favicon.ico',(req, res)=>res.writeHead(404)); 
app.listen(3000, () => console.log('Example app listening on port 3000'));