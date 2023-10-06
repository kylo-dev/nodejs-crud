// 컴퓨터공학과 201935247 김현겸

const db = require('./db');
var qs = require('querystring');

module.exports = {
    home : (req, res)=> {
        db.query('select * from customer', (error, results)=>{
            var c = '<a href="/create">create</a>';
            var b = '<h2>Welcome WEBDB</h2><p>Node.js Customer Page</p>';

            var context = {
                list: results,
                control: c,
                body: b};
            req.app.render('home', context, (err, html)=> {
                res.end(html)
            });
        });
    },

    page :(req, res)=>{
        var id = req.params.pageId;
        db.query('select * from customer', (error, results)=>{
            if(error){
                throw error;
            }
            db.query(`select * from customer where id = ${id}`, (error2, result)=>{
                if(error2){
                    throw error2;
                }
                var c = `<a href="/create">create</a>&nbsp;&nbsp<a href="/update/${result[0].id}">update</a>&nbsp;&nbsp
                <a href="/delete/${result[0].id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){return false}'>delete</a>`;
                var b = `<ul>
                    <li>이름 : ${result[0].name}</li>
                    <li>주소 : ${result[0].address}</li>
                    <li>생년월일 : ${result[0].birth}</li>
                    <li>전화번호 : ${result[0].tel}</li>
                </ul>`;

                var context = {list:results,
                                control:c,
                                body:b};
                req.app.render('home', context, (err, html)=>{
                    res.end(html)
                });
            });
        });
    },
    create : (req, res)=>{
        db.query('select * from customer', (error, results)=>{
            if(error){
                throw error;
            }
            var context = {list: results,
                            control: `<a href="/create">create</a>`,
                            body: `<form action="/create_process" method="post">
                                <p><input type="text" name="name" placeholder="name"></p>
                                <p><input type="text" name="address" placeholder="address"></p>
                                <p><input type="date" name="birth"></p>
                                <p><input type="text" name="tel" placeholder="tel"></p>
                                <p><input type="submit"></p>
                            </form>`};
            req.app.render('home', context, (err, html)=>{
                res.end(html)
            });
        });
    },
    create_process : (req, res)=>{
        var body = '';
        req.on('data', (data)=>{
            body = body + data;
        });
        req.on('end', ()=>{
            var post = qs.parse(body);
            db.query(`insert into customer(name, address, birth, tel) values(?, ?, ?, ?)`,
                [post.name, post.address, post.birth, post.tel], (error, result)=>{
                    if(error){
                        throw error;
                    }
                    res.writeHead(302, {Location: `/page/${result.insertId}`});
                    res.end();
                });
        });
    },
    update : (req, res)=>{
        var _url = req.url;
        id = req.params.pageId;

        db.query('select * from customer', (error, results)=>{
            if(error){
                throw error;
            }
            db.query(`select * from customer where id = ${id}`, (error2, result)=>{
                if(error2){
                    throw error2;
                }
                var context = {list:results,
                    control:`<a href="/create">create</a> <a href="/update/${result[0].id}">update</a>`,
                    body: `<form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${result[0].id}">
                    <p><input type="text" name="name" value="${result[0].name}" placeholder="name"></p>
                    <p><input type="text" name="address" value="${result[0].address}" placeholder="address"></p>
                    <p><input type="date" name="birth" value="${result[0].birth}"></p>
                    <p><input type="text" name="tel" value="${result[0].tel}" placeholder="tel"></p>
                    <p><input type="submit"></p></form>`};
                
                req.app.render('home', context, (err, html)=>{
                    res.end(html)
                });
            });
        });
    },
    update_process : (req, res)=>{
        var body = '';
        req.on('data', (data)=>{
            body = body + data;
        });
        req.on('end', ()=>{
            var post = qs.parse(body);
            db.query(`update customer set name = ?, address = ?, birth = ?, tel = ? where id = ?`,
                [post.name, post.address, post.birth, post.tel, post.id], (error, result)=>{
                    if(error){
                        throw error;
                    }
                    res.writeHead(302, {Location: `/page/${post.id}`});
                    res.end();
                });
        });
    },
    delete_process : (req, res)=>{
        id = req.params.pageId;
        db.query(`delete from customer where id =?`, [id], (error, result)=>{
            if(error){
                throw error;
            }
            res.writeHead(302, {Location: `/`});
            res.end();
        });
    }



}