var http = require('http');
var fs = require('fs');
var urlm = require('url');

var app = http.createServer(function(req, res){
    var _url = req.url;
    var queryData = urlm.parse(_url, true).query;
    var path = urlm.parse(_url, true).path;
    var pathname = urlm.parse(_url, true).pathname;

    // console.log('요청받은 url :' + _url);
    // console.log(__dirname);
    console.log(queryData);
    console.log(queryData.id);
    console.log(queryData.pw);
    console.log(path);
    console.log(pathname);

    if(pathname == '/') {
        _url = '/index.html';
    }
    if(pathname == '/1') {
        _url = '/1.html';
    }
    if(pathname == '/2') {
        _url = '/2.html';
    }
    if(pathname == '/3') {
        _url = '/3.html';
    }
    if(pathname == '/favicon.ico') {
        return res.writeHead(404);
    }
    
    res.writeHead(200);
    res.end(queryData.id + ' ' + queryData.pw);
    // res.end(fs.readFileSync(__dirname + _url));
});

app.listen(3000);