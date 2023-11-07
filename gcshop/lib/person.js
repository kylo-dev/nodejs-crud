// 컴퓨터공학과 201935247 김현겸

var db = require('./db');
var sanitizeHtml = require('sanitize-html');

function checkSessionClass(req, res, validClass = '00') {
    if (req.session.class !== validClass) {
        const script = `
        <script type='text/javascript'>
            alert("You do not have access.");
            setTimeout(() => {
                location.href='http://localhost:3000/';
            }, 1000);
        </script>`;
        res.end(script);
        return false;
    }
    return true;
}

module.exports = {
    view : (req, res)=>{
        if(!checkSessionClass(req, res)){
            return;
        }
        var param = req.params.vu;
        db.query('select count(*) as personCount from person', (err, result)=>{
            db.query('select * from person', (err, results)=>{

                // person 테이블에 데이터가 있는지
                if (result[0].personCount == 0){
                    havePerson = false;
                }
                havePerson = true;

                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    logined: 'YES',
                    body: 'person.ejs',
                    havePerson: havePerson,
                    list: results,
                    check: param
                };
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                });
            });
        });
    },

    create : (req,res)=>{
        if(req.session.class !== '00'){
            var context = {
                menu : 'menuForCustomer.ejs',
                who : '손님',
                logined : 'NO',
                body : 'personCU.ejs',
                check: 'c'
            };
        }
        var context = {
            menu : 'menuForManager.ejs',
            who : req.session.name,
            logined : 'YES',
            body : 'personCU.ejs',
            check: 'c'
        };
        req.app.render('home', context, (err, html)=>{
            res.end(html);
        });
    },
    create_process : (req, res)=>{
        var post = req.body;
        db.query('select count(*) as valid from person where loginid=?',[post.loginid],(err,result)=>{
            if (result[0].valid !== 0){
                res.end(`<script type='text/javascript'>
                alert("There are duplicate members. Please sign up again");
                setTimeout(() => {
                    location.href='http://localhost:3000/person/create';}, 1000);
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
        var Uclass = '02';
        var point = 0;

        db.query(`insert into person values(?,?,?,?,?,?,?,?)`,
            [loginId,pwd,Uname,address,tel,birth,Uclass,point], (err2, result2)=>{
                res.send("<script>alert('회원 가입이 완료되었습니다.'); window.location.href='/';</script>");
            });
    },
    update : (req, res)=>{
        if(!checkSessionClass(req, res)){
            return;
        }
        var loginid = req.params.userId;

        db.query(`select * from person where loginid=?`,[loginid],(error, result)=>{
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                logined: 'YES',
                body: 'personCU.ejs',
                list: result,
                check: 'u'
            };
    
            req.app.render('home', context, (err, html)=>{
                res.end(html);
            });
        });
    },

    update_process : (req, res) =>{
        var post = req.body;
        loginid = sanitizeHtml(post.loginid);
        pwd = sanitizeHtml(post.password);
        Uname = sanitizeHtml(post.name);
        tel = sanitizeHtml(post.tel);
        birth = sanitizeHtml(post.birth);
        address = sanitizeHtml(post.address);
        Uclass = sanitizeHtml(post.Uclass);
        point = sanitizeHtml(post.point);

        db.query(`update person set password=?,name=?,tel=?,birth=?,address=?,class=?,point=? where loginid=?`,
            [pwd,Uname,tel,birth,address,Uclass,point,loginid], (err2, result)=>{
                res.send("<script>alert('회원 수정이 완료되었습니다.'); window.location.href='/person/view/u';</script>");
            });
    },
    delete_process : (req, res)=>{
        if(!checkSessionClass(req, res)){
            return;
        }
        var loginid = req.params.userId;
        db.query(`delete from person where loginid=?`,[loginid], (err, result)=>{
            res.writeHead(302, {Location: '/person/view/u'});
            res.end();
        });
    }
}