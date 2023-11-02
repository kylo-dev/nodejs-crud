// 컴퓨터공학과 201935247 김현겸

var db = require('./db');

function authIsOwner(req, res) {
    if(req.session.is_logined){
        return true;
    }
    return false;
}

module.exports = {
    view : (req, res) =>{
        if(req.session.class !== '00'){
            res.end(`<script type='text/javascript' charset="utf-8">
            alert("You do not have access.");
            setTimeout("location.href='http://localhost:3000/'", 1000);
            </script>`);
            return;
        }
        var param = req.params.vu;

        db.query('select count(*) as merCount from merchandise', (err, result)=>{
            db.query('select * from merchandise', (err, results)=>{
                // 로그인 여부 확인
                // var isOwner = authIsOwner(req, res);

                // merchandise 테이블에 데이터가 있는지
                if (result[0].merCount == 0){
                    haveMerchandise = false;
                }
                haveMerchandise = true;
            
                // if(isOwner){
                //     var context = {
                //         menu: 'menuForManager.ejs',
                //         who: req.session.name,
                //         body: 'merchandise.ejs',
                //         logined: 'YES',
                //         haveMerchandise: haveMerchandise,
                //         list: results,
                //         check: param
                //     };
                // } else {
                //     res.redirect('/');
                //     return;
                // }
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'merchandise.ejs',
                    logined: 'YES',
                    haveMerchandise: haveMerchandise,
                    list: results,
                    check: param
                };
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                });
            });
        });
    },

    create : (req, res) => {
        if(req.session.class !== '00'){
            res.end(`<script type='text/javascript' charset="utf-8">
            alert("You do not have access.");
            setTimeout("location.href='http://localhost:3000/'", 1000);
            </script>`);
            return;
        }
        var context = {
            menu: 'menuForManager.ejs',
            who: req.session.name,
            body: 'merchandiseCU.ejs',
            logined: 'YES',
            check: 'c'
        };

        req.app.render('home', context, (err, html)=>{
            res.end(html);
        });
    },

    create_process : (req, res) =>{

    },

    update : (req, res) => {
        if(req.session.class !== '00'){
            res.end(`<script type='text/javascript' charset="utf-8">
            alert("You do not have access.");
            setTimeout("location.href='http://localhost:3000/'", 1000);
            </script>`);
            return;
        }

        var id = req.params.merId;
        db.query(`select * from merchandise where mer_id=?`, [id],(err2, result)=>{
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'merchandiseCU.ejs',
                logined: 'YES',
                list: result,
                check: 'u'
            };
            req.app.render('home', context, (error, html)=>{
                res.end(html);
            });
        });
    },

    update_process : (req, res) => {

    },

    delete_process : (req, res) => {
        // 관리자(00)을 제외하고는 삭제할 수 없음
        if(req.session.class !== '00'){
            res.end(`<script type='text/javascript' charset="utf-8">
            alert("You do not have permission to delete.");
            setTimeout("location.href='http://localhost:3000/'", 1000);
            </script>`);
            return;
        }
        id = req.params.merId;
        db.query(`delete from merchandise where mer_id=?`,[id], (error, result)=>{
            res.writeHead(302, {Location: '/'});
            res.end();
        });
    }
}