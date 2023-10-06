const express = require('express');
const app = express();
var urlm = require('url');

app.get('/', (req, res) => {

    var title = 'Welcome';

    var template = `
    <!doctype html>
<html>
<head>
  <title>WEB - ${title}</title>
  <meta charset="utf-8">
</head>
<body>
  <h1><a href="/">WEB</a></h1>
  <ol>
    <li><a href="/HTML">HTML</a></li>
    <li><a href="/CSS">CSS</a></li>
    <li><a href="/JAVASCRIPT">JavaScript</a></li>
  </ol>
  <h2>${title}</h2>
  <p>The World Wide Web (abbreviated WWW or the Web) is an information space where documents and other web resources are identified by Uniform Resource Locators (URLs), interlinked by hypertext links, and can be accessed via the Internet.[1] English scientist Tim Berners-Lee invented the World Wide Web in 1989. He wrote the first web browser computer program in 1990 while employed at CERN in Switzerland.[2][3] The Web browser was released outside of CERN in 1991, first to other research institutions starting in January 1991 and to the general public on the Internet in August 1991.
  </p>
</body>
</html>`;
    
    res.send(template);
});
app.get('/:id', (req, res) => {

    var id = req.params.id;
    var title = id;

    var template = `
    <!doctype html>
<html>
<head>
  <title>WEB - ${title}</title>
  <meta charset="utf-8">
</head>
<body>
  <h1><a href="/">WEB</a></h1>
  <ol>
    <li><a href="/HTML">HTML</a></li>
    <li><a href="/CSS">CSS</a></li>
    <li><a href="/JAVASCRIPT">JavaScript</a></li>
  </ol>
  <h2>${title}</h2>
  <p>The World Wide Web (abbreviated WWW or the Web) is an information space where documents and other web resources are identified by Uniform Resource Locators (URLs), interlinked by hypertext links, and can be accessed via the Internet.[1] English scientist Tim Berners-Lee invented the World Wide Web in 1989. He wrote the first web browser computer program in 1990 while employed at CERN in Switzerland.[2][3] The Web browser was released outside of CERN in 1991, first to other research institutions starting in January 1991 and to the general public on the Internet in August 1991.
  </p>
</body>
</html>`;
    
    res.send(template);
});
app.get('/favicon.ico', (req, res) => res.writeHead(404));
// app.get('/', (req, res) => res.send('hello world'));
// app.get('/author', (req, res) => res.send('/author'))
app.listen(3000, () => console.log('Example app listening on port 3000'));