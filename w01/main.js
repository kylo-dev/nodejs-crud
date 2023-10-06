var http = require('http');

var app = http.createServer(function(req, res){

    res.writeHead(200);
    res.end("Hello. My response, Node.js!!");
});

app.listen(3000);