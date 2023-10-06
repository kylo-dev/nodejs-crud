const express = require('express');
const app = express();

app.set('views',__dirname+'/views');
app.set('view engine','ejs');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb2023'
});
connection.connect();

app.get('/',(req,res)=>{
    connection.query('select * from topic', (error, results)=>{
        var context = {list:results, 
                    title:'Welcome'};
        console.log(context);
        res.render('home2', context, (err, html)=>{
            res.end(html)
        });
    });
    connection.end();
});

app.get('/favicon.ico',(req, res)=>res.writeHead(404)); 
app.listen(3000, () => console.log('Example app listening on port 3000'));