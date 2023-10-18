const express = require('express');
const app = express();
var cookie = require('cookie');
const qs = require("querystring")
var url = require('url');
var path = require('path');

app.get('/', (req, res)=>{
    res.writeHead(200, {
        'Set-Cookie': ['yummy_cookie=choco', 'tasty_cookie=strawberry', `Permanent=cookies;Max-Age=${60*60*24*30}`]
    });
    console.log(req.headers.cookie);
    if(req.headers.cookie !== undefined){
        var cookies = cookie.parse(req.headers.cookie);
    }
    console.log(cookies.yummy_cookie);
    console.log(cookies.Permanent);
    res.end('Cookie!!');
});

// app.get('/', (req, res)=>{
//     var urlStr = 'http://localhost:3000/?id=/home/user/dir/file.txt';
//     var urlObj = url.parse(urlStr, true);
//     console.log(urlObj);
    
//     // var _url = req.url;
//     // var queryData = url.parse(_url, true).query;
//     // console.log(path.parse(queryData.id));
// });
app.listen(3000, () => console.log('Cookie Test'));