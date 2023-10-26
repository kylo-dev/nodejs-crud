// 컴퓨터공학과 201935247 김현겸
const db = require('./db');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

// 인증된 사용자인지 확인
function authIsOwner(req, res) {
    if(req.session.is_logined){
        return true;
    } 
    return false;
}

// login <a>태그 표시 상태
function authStatusUI(req, res) {
    var login = '<a href="/login">login</a>';
    if(authIsOwner(req, res)){
        login = '<a href="/logout_process">logout</a>';
    }
    return login;
}

module.exports = {
    home : (req, res) => {
        db.query('SELECT * FROM topic', (error, topics)=>{
            var login = authStatusUI(req, res);
            var c = '<a href="/create">create</a>';
            var b = '<h2>Welcome</h2><p>Node.js Start Page</p>';

            var context = {
                lg: login,
                title: "Topic List",
                list: topics,
                control: c,
                body: b};
            req.app.render('home', context, (err, html)=>{
                res.end(html)
            });
        });
    },

    page : (req, res) => {
        var id = req.params.pageId;
        db.query('SELECT * FROM topic', (error, topics)=>{
            if(error){ throw error; }
            db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id = ${id}`, (error2, topic)=> {
                if(error2){ throw error2; }

                var login = authStatusUI(req, res);
                var c = `<a href="/create">create</a>&nbsp;&nbsp;<a href="/update/${id}">update</a>&nbsp;&nbsp;
                <a href="/delete/${id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){return false}'>delete</a>`;
                var b = `<h2>${topic[0].title}</h2>
                        <p>${topic[0].descrpt}</p>
                        <p>by ${topic[0].name}</p>`;

                var context = {lg: login,
                                title: "Topic List",
                                list:topics,
                                control: c,
                                body: b};
                req.app.render('home', context, (err, html)=>{
                    res.end(html)
                });
            });
        });
    },

    create : (req, res)=>{
        if(authIsOwner(req, res) === false){
            res.end(`<script type='text/javascript'>
            alert("Loin required ~~~");
            setTimeout("location.href='http://localhost:3000/'", 1000);
            </script>`);
        }
        db.query(`SELECT * FROM topic`, (error, topics)=>{
            if(error){
                throw error;
            }
            var login = authStatusUI(req, res);
            db.query(`select * from author`, (err, authors)=>{
                var i = 0;
                var tag = '';
                while(i<authors.length){
                    tag += `<option value="${authors[i].id}">${authors[i].name}</option>`;
                    i++;
                };
                var context = {lg: login,
                    title: "Topic List",
                    list:topics,
                    control: `<a href="/create">create</a>`,
                    body: `<form action="/create_process" method="post">
                            <p><input type="text" name="title" placeholder="title"></p>
                            <p><textarea name="description" placeholder="description"></textarea></p>
                            <p><select name="author">
                                ${tag}
                            </select></p>
                            <p><input type="submit"></p></form>`};
                req.app.render('home', context, (err,html) => {
                    res.end(html);
                });
            });
        });
    },

    create_process : (req, res) => {
        var post = req.body;
        sanitizedTitle = sanitizeHtml(post.title); // sanitizedHtml 적용하여 저장하기 (script 코드 입력 해결)
        sanitizedDescription = sanitizeHtml(post.description);
        sanitizedAuthor = sanitizeHtml(post.author);

        db.query(`INSERT INTO topic(title, descrpt, created, author_id) VALUES(?,?, NOW(), ?)`,
        [sanitizedTitle, sanitizedDescription, sanitizedAuthor], (error, result)=>{
            if(error){
                throw error;
            }
            res.writeHead(302, {Location: `/page/${result.insertId}`});
            res.end();
        });
    },

    update : (req, res)=>{
        if(authIsOwner(req, res) === false){
            res.end(`<script type='text/javascript'>
            alert("Loin required ~~~");
            setTimeout("location.href='http://localhost:3000/'", 1000);
            </script>`);
        }
        id = req.params.pageId;
        db.query(`SELECT * FROM topic`, (error, topics)=>{
            if(error){
                throw error;
            }
            var login = authStatusUI(req, res);
            db.query(`SELECT * FROM topic WHERE id=?`, [id], (error2, topic)=>{
                if(error2){
                    throw error2;
                }
                db.query(`select * from author`, (err, authors)=>{
                    if(err){ throw err; }
                    var i = 0;
                    var tag = '';
                    while(i<authors.length){
                        var selected = '';
                        if(authors[i].id === (topic[0].author_id)){
                            selected = 'selected';
                        }
                        tag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`;
                        i++;
                    }
                    var context = {lg: login,
                        title: "Topic List",
                        list: topics,
                        control:`<a href="/create">create</a> <a href="/update/${topic[0].id}">update</a>`,
                        body: `<form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${topic[0].id}">
                        <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                        <p><textarea name="description" placeholder="description">${topic[0].descrpt}</textarea></p>
                        <p><select name="author">
                            ${tag}
                        </select></p>
                        <p><input type="submit"></p></form>`
                    };
                    req.app.render('home', context, (err, html)=>{
                        res.end(html);
                    });
                });
            });
        });
    },

    update_process : (req, res) =>{
        var post = req.body;
        sanitizedTitle = sanitizeHtml(post.title); // 업데이트 쿼리에도 sanitizeHtml 적용하여 저장하기
        sanitizedDescription = sanitizeHtml(post.description);
        sanitizedAuthor = sanitizeHtml(post.author);
        db.query('UPDATE topic SET title=?, descrpt=?, author_id=? WHERE id=?',
            [sanitizedTitle, sanitizedDescription, sanitizedAuthor,post.id], (error, result) =>{
                res.writeHead(302, {Location: `/page/${post.id}`});
                res.end();
            });
    },

    delete_process : (req, res)=>{
        if(authIsOwner(req, res) === false){
            res.end(`<script type='text/javascript'>
            alert("Loin required ~~~");
            setTimeout("location.href='http://localhost:3000/'", 1000);
            </script>`);
            return;
        }
        id = req.params.pageId;
        db.query('DELETE FROM topic WHERE id=?', [id], (error, result)=>{
            if(error){
                throw error;
            }
            res.writeHead(302, {Location: `/`});
            res.end();
        });
    },

    login : (req, res)=>{
        db.query('SELECT * FROM topic', (error, topics)=>{
            var login = authStatusUI(req, res);
            var c = '<a href="/create">create</a>';
            var b = `<form action="/login_process" method="post">
                        <p><input type="text" name="email" placeholder="email"></p>
                        <p><input type="password" name="password" placeholder="password"></p>
                        <p><input type="submit"></p>
                    </form>`;
            var context = { lg: login,
                            title: "Topic List",
                            list: topics,
                            control: c,
                            body: b};
            req.app.render('home', context, (err, html)=>{
                res.end(html)
            });
        });
    },
    login_process: (req, res)=>{
        var post = req.body;
        if(post.email === 'rlagusrua258@gachon.ac.kr' && post.password === '123456'){
            req.session.is_logined = true;
            res.redirect('/');
        }
        else{
            res.end('who?');
        }
    },
    logout_process : (req, res)=>{
        // session 지우기
        req.session.destroy((err)=>{
            res.redirect('/');
        })
    }
}