const express = require('express');
const app = express();
var cookie = require('cookie');

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
app.listen(3000, () => console.log('Cookie Test'));