// 컴퓨터공학과 201935247 김현겸

var db = require('./db');

function authIsOwner(req, res) {
    if(req.session.is_logined){
        return true;
    }
    return false;
}

module.exports = {
    home : (req, res)=>{
        db.query('select * from boardtype', (error, boardtypes)=>{
            db.query('select count(*) as merCount from merchandise', (err, result)=>{
                db.query('select * from merchandise', (err2, results)=>{
                    var isOwner = authIsOwner(req, res);
                    haveMerchandise = result[0].merCount !== 0;
    
                    if(isOwner){
                        if(req.session.class === '00'){
                            var context = {
                                menu: 'menuForManager.ejs',
                                who: req.session.name,
                                logined: 'YES',
                                boardtypes: boardtypes,
                                body: 'merchandise.ejs',
                                haveMerchandise: haveMerchandise,
                                list: results,
                                check: 'v'
                            };
                        }
                        else if(req.session.class === '01'){
                            var context = {
                                menu: 'menuForCustomer.ejs',
                                who: req.session.name,
                                logined: 'YES',
                                boardtypes: boardtypes,
                                body: 'merchandise.ejs',
                                haveMerchandise: haveMerchandise,
                                list: results,
                                check: 'v'
                            };
                        }
                        else if(req.session.class === '02'){
                            var context = {
                                menu: 'menuForCustomer.ejs',
                                who: req.session.name,
                                logined: 'YES',
                                boardtypes: boardtypes,
                                body: 'merchandise.ejs',
                                haveMerchandise: haveMerchandise,
                                list: results,
                                check: 'v'
                            };
                        }
                    }
                    else{
                        var context = {
                            menu: 'menuForCustomer.ejs',
                            who: '손님',
                            logined: 'NO',
                            boardtypes: boardtypes,
                            body: 'merchandise.ejs',
                            haveMerchandise: haveMerchandise,
                            list: results,
                            check: 'v'
                        };
                    }
                    req.app.render('home', context, (err, html)=>{
                        res.end(html);
                    });
                });
             });
        });
    },
}