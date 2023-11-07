// 컴퓨터공학과 201935247 김현겸

var db = require('./db');
var sanitizeHtml = require('sanitize-html');

module.exports = {
    login : (req, res)=>{
        var context = {
            menu : 'menuForCustomer.ejs',
            who : '손님',
            logined : 'NO',
            body : 'login.ejs',
        };
        req.app.render('home', context, (err, html)=>{
            res.end(html);
        });
    },
    login_process : (req, res)=>{
        var post = req.body;

        db.query('select count(*) as num from person where loginid = ? and password = ?', [post.id, post.pwd], (error, results)=>{
            if(error){return error; }
            
            if(results[0].num === 1){
                db.query('select name, class from person where loginid = ? and password = ?', [post.id, post.pwd], (error, result)=>{
                    req.session.is_logined = true;
                    req.session.name = result[0].name;
                    req.session.class = result[0].class;
                    res.redirect('/');
                })
            }
            else {
                req.session.is_logined =false;
                req.session.name = '손님';
                req.session.class = '99';
                res.send("<script>alert('회원 정보가 존재하지 않습니다.'); window.location.href = '/auth/login';</script>");
                // res.redirect('/');
            }
        });
    },
    logout_process : (req, res)=>{
        req.session.destroy((err)=>{
            res.redirect('/');
        });
    },
    join : (req, res)=>{
        var context = {
            menu : 'menuForCustomer.ejs',
            who : '손님',
            logined : 'NO',
            body : 'join.ejs'
        };
        req.app.render('home', context, (err, html)=>{
            res.end(html);
        });
    },
    join_process : (req, res)=>{
        var post = req.body;
        db.query('select count(*) as valid from person where loginid=?',[post.loginid],(err,result)=>{
            if (result[0].valid !== 0){
                res.end(`<script type='text/javascript'>
                alert("There are duplicate members. Please sign up again");
                setTimeout(() => {
                    location.href='http://localhost:3000/auth/join';}, 1000);
                </script>`);
                return;
            }
        });
        loginId = sanitizeHtml(post.loginid);
        pwd = sanitizeHtml(post.password);
        Uname = sanitizeHtml(post.name);
        tel = sanitizeHtml(post.tel);
        birth = sanitizeHtml(post.birth);
        address = sanitizeHtml(post.address);
        var Uclass = '00';
        var point = 0;

        db.query(`insert into person values(?,?,?,?,?,?,?,?)`,
            [loginId,pwd,Uname,address,tel,birth,Uclass,point], (err2, result2)=>{
                res.send("<script>alert('회원 가입이 완료되었습니다.'); window.location.href='/';</script>");
            })
    }
}