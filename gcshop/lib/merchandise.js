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
        var param = req.params.vu;

        db.query('select count(*) as merCount from merchandise', (err, result)=>{
            db.query('select * from merchandise', (err, results)=>{
                // 로그인 여부 확인
                var isOwner = authIsOwner(req, res);

                // merchandise 테이블에 데이터가 있는지
                if (result[0].merCount == 0){
                    haveMerchandise = false;
                } else{
                    haveMerchandise = true;
                }

                if(isOwner){
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: 'YES',
                        haveMerchandise: haveMerchandise,
                        list: results,
                        check: param
                    };
                } else {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: 손님,
                        body: 'merchandise.ejs',
                        logined: 'No',
                        haveMerchandise: haveMerchandise,
                        list: results,
                        check: param
                    };
                }
                
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                });
            });
        });
    },

    create : (req, res) => {
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                body: 'merchandiseCU.ejs',
                logined: 'YES',
                check: 'c'
            };
        } else{
            var context = {
                menu: 'menuForCustomer.ejs',
                who: '손님',
                body: 'items.ejs',
                logined: 'YES',
            };
        }
        req.app.render('home', context, (err, html)=>{
            res.end(html);
        });
    },

    create_process : (req, res) =>{

    },

    update : (req, res) => {
        var id = req.params.merId;

        db.query('select count(*) as merCount from merchandise', (err, result)=>{
            db.query(`select * from merchandise where mer_id=?`, [id],(err2, results)=>{
                // 로그인 여부 확인
                var isOwner = authIsOwner(req, res);

                // merchandise 테이블에 데이터가 있는지
                if (result[0].merCount == 0){
                    haveMerchandise = false;
                } else{
                    haveMerchandise = true;
                }

                if(isOwner){
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'merchandiseCU.ejs',
                        logined: 'YES',
                        haveMerchandise: haveMerchandise,
                        list: results,
                        check: 'u'
                    };
                } else {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: 손님,
                        body: 'items.ejs',
                        logined: 'No',
                    };
                }
                req.app.render('home', context, (error, html)=>{
                    res.end(html);
                });
            });
        });
        
        // db.query(`select * from merchandise where mer_id = ?`, [id], (error, result)=>{
        //     var context = {
        //         menu: 'menuForManager.ejs',
        //         who: req.session.name,
        //         body: 'merchandiseCU.ejs',
        //         logined: 'YES',
        //         list: result,
        //         check: 'u'
        //     };
        //     req.app.render('home', context, (err, html)=>{
        //         res.end(html);
        //     });
        // });
    },

    update_process : (req, res) => {

    },

    delete_process : (req, res) => {

    }
}