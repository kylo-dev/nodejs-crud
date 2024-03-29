// 컴퓨터공학과 201935247 김현겸

var db = require('./db');
var sanitizeHtml = require('sanitize-html');

function checkSessionClass(req, res, validClass = '01') {
    if (req.session.class !== validClass) {
        const script = `
        <script type='text/javascript'>
            alert("You do not have access.");
            setTimeout(() => {
                location.href='http://localhost:3000/shop/all';
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
        db.query('select * from boardtype', (error, boardtypes)=>{
            db.query('select count(*) as personCount from person', (err, result)=>{
                db.query('select * from person', (err, results)=>{
    
                    havePerson = result[0].personCount !== 0;
    
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        logined: 'YES',
                        boardtypes: boardtypes,
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
        });
    },

    create : (req,res)=>{
        db.query('select * from boardtype', (err, boardtypes)=>{
            if(req.session.class !== '01'){
                var context = {
                    menu: req.session.class === '00' ? 'menuForMIS.ejs' :'menuForCustomer.ejs',
                    who : req.session.class === '00' ? req.session.name : '손님',
                    logined : req.session.class === '00' ? 'YES' : 'NO',
                    boardtypes: boardtypes,
                    body : 'personCU.ejs',
                    check: 'c'
                };
            } else{
                var context = {
                    menu : 'menuForManager.ejs',
                    who : req.session.name,
                    logined : 'YES',
                    boardtypes: boardtypes,
                    body : 'personCU.ejs',
                    check: 'c'
                };
            }
            req.app.render('home', context, (err, html)=>{
                res.end(html);
            });
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
            } else{
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
                        res.send("<script>alert('회원 가입이 완료되었습니다.'); window.location.href='/shop/all';</script>");
                    });
            }
        });
    },
    update : (req, res)=>{
        if(!checkSessionClass(req, res)){
            return;
        }
        var loginid = req.params.userId;
        db.query('select * from boardtype', (err,boardtypes)=>{
            db.query(`select * from person where loginid=?`,[loginid],(error, result)=>{
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    logined: 'YES',
                    boardtypes: boardtypes,
                    body: 'personCU.ejs',
                    list: result,
                    check: 'u'
                };
        
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                });
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