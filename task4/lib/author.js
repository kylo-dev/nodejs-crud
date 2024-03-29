// 컴퓨터공학과 201935247 김현겸 
const db = require('./db');
var qs = require('querystring');
var sanitizedHtml = require('sanitize-html');
var cookie = require('cookie');

// 인증된 사용자인지 확인
function authIsOwner(req, res) {
    var isOwner = false;
    var cookies = {};
    if(req.headers.cookie){
        cookies = cookie.parse(req.headers.cookie);
    }
    if(cookies.email === 'rlagusrua258@gachon.ac.kr' && cookies.password === '123456'){
        isOwner = true;
    }
    return isOwner;
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
    home: (req, res)=>{
        db.query('select * from topic', (error, topics)=> {
            if(error){ throw error; }
            var login = authStatusUI(req, res);

            db.query('SELECT * FROM author', (err, authors)=>{
                if(err){ throw err; }
                var i = 0;
                var tag = '<table border="1" style="border-collapse: collapse;">';
                while(i<authors.length){
                    tag = tag + `<tr><td>${authors[i].name}</td><td>${authors[i].profile}</td>
                                <td><a href="/author/update/${authors[i].id}">update</a></td>
                                <td><a href="/author/delete/${authors[i].id}">delete</a></td></tr>`;
                    i++;
                }
                tag = tag + '</table>';

                var b = `<form action="/author/create_process" method="post">
                            <p><input type="text" name="name" placeholder="name"></p>
                            <p><input type="text"  name="profile" placeholder="profile"></p>
                            <p><input type="submit" value="CREATE"></p>
                        </form>`;
                var context = {lg: login,
                                title: 'Author list',
                                list: topics,
                                control: tag,
                                body: b};
                req.app.render('home', context, (err, html)=>{
                    res.end(html)
                });
            });
        });
    },
    create_process : (req, res) => {
        if(authIsOwner(req, res) === false){
            res.end(`<script type='text/javascript'>
            alert("Login required ~~~");
            setTimeout("location.href='http://localhost:3000/author'", 1000);
            </script>`);
            return;
        }
        var body = '';
        req.on('data', (data)=>{
            body = body +data;
        });
        req.on('end', ()=>{
            var post = qs.parse(body);
            sanitizedName = sanitizedHtml(post.name);
            sanitizedProfile = sanitizedHtml(post.profile);
            db.query('INSERT INTO author (name,profile) VALUES(?,?)',
                [sanitizedName, sanitizedProfile], (error, result)=>{
                if(error){
                    throw error;
                }
                res.redirect(`/author`);
                res.end();
            });
        });
    },

    update : (req, res)=>{
        if(authIsOwner(req, res) === false){
            res.end(`<script type='text/javascript'>
            alert("Login required ~~~");
            setTimeout("location.href='http://localhost:3000/author'", 1000);
            </script>`);
        }

        id = req.params.pageId;
        db.query(`SELECT * FROM topic`, (error, topics)=>{
            if(error){ throw error; }
            var login = authStatusUI(req, res);

            db.query(`SELECT * FROM author`, (error2, authors)=>{
                if(error2){ throw error2; }
                var i = 0;
                var tag = '<table border="1" style="border-collapse: collapse;">';
                while(i<authors.length){
                    tag = tag + `<tr><td>${authors[i].name}</td><td>${authors[i].profile}</td>
                                <td><a href="/author/update/${id}">update</a></td><td><a href="/author/delete/${id}">delete</a></td></tr>`;
                    i++;
                }
                tag = tag + '</table>';

                db.query(`SELECT * FROM author WHERE id = ?`, [id], (error3, author)=>{
                    if(error3){ throw error3; }
                    var b = `<form action="/author/update_process" method="post">
                            <p><input type="hidden" name="id" value="${author[0].id}"></p>
                            <p><input type="text" name="name" value="${author[0].name}" placeholder="name"></p>
                            <p><input type="text"  name="profile" value="${author[0].profile}" placeholder="profile"></p>
                            <p><input type="submit" value="UPDATE"></p>
                            </form>`;

                    var context = {lg: login,
                                    title: "Author list",
                                    list: topics,
                                    control: tag,
                                    body: b};
                    req.app.render('home', context, (err, html)=>{
                        res.end(html);
                    });
                });                
            });
        });
    },

    update_process : (req, res) =>{
        var body = '';
        req.on('data', (data)=>{
            body = body +data;
        });
        req.on('end', ()=>{
            var post = qs.parse(body);
            sanitizedName = sanitizedHtml(post.name);
            sanitizedProfile = sanitizedHtml(post.profile);
            db.query('UPDATE author SET name=?, profile=? WHERE id=?',
                [sanitizedName, sanitizedProfile, post.id], (error, result) =>{
                    res.redirect(`/author`);
                    res.end();
            });
        });
    },

    delete_process : (req, res)=>{
        if(authIsOwner(req, res) === false){
            res.end(`<script type='text/javascript'>
            alert("Login required ~~~");
            setTimeout("location.href='http://localhost:3000/author'", 1000);
            </script>`);
        }
        id = req.params.pageId;
        db.query(`SELECT COUNT(*) as topicCount FROM topic WHERE topic.author_id=?`, [id], (error, result)=>{
            if(error){ return error; }

            const topicCount = result[0].topicCount;
            if(topicCount > 0){
                res.send("<script>alert('작성자의 토픽이 존재하여 삭제할 수 없습니다.'); window.location.href = '/author';</script>");
            } else{
                db.query(`DELETE FROM author WHERE id=?`, [id], (error2, result2)=>{
                    if(error2){ throw error2; }
                    res.send("<script>alert('선택한 작성자의 정보가 삭제 되었습니다.'); window.location.href = '/author';</script>");
                });
            }
        });
    },
}