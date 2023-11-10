// 컴퓨터공학과 201935247 김현겸

var db = require('./db');
const merchandise = require('./merchandise');

function authIsOwner(req, res) {
    if(req.session.is_logined){
        return true;
    }
    return false;
}

module.exports = {
    home : (req, res)=>{
        var categoryId = req.params.category;

        db.query('select * from boardtype', (error, boardtypes)=>{
            db.query('select count(*) as merCount from merchandise', (err, result)=>{
                db.query('select * from merchandise', (err2, results)=>{
                    var haveMerchandise = result[0].merCount !== 0;
                    var context;
                    if (categoryId === 'all'){
                        if(authIsOwner(req, res)){
                            if(req.session.class === '00'){
                                context = {
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
                            else if(req.session.class === '01' || req.session.class === '02'){
                                context = {
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
                            context = {
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
                    } 
                    else{
                        db.query(`select * from merchandise where category=?`,[categoryId], (error, merchandiseCategory)=>{
                            var haveCategory = merchandiseCategory.length > 0;
                            if(authIsOwner(req, res)){
                                if(req.session.class === '00'){
                                    context = {
                                        menu: 'menuForManager.ejs',
                                        who: req.session.name,
                                        logined: 'YES',
                                        boardtypes: boardtypes,
                                        body: 'merchandise.ejs',
                                        haveMerchandise: haveCategory,
                                        list: merchandiseCategory,
                                        check: 'v'
                                    };
                                }
                                else if(req.session.class === '01' || req.session.class === '02'){
                                    context = {
                                        menu: 'menuForCustomer.ejs',
                                        who: req.session.name,
                                        logined: 'YES',
                                        boardtypes: boardtypes,
                                        body: 'merchandise.ejs',
                                        haveMerchandise: haveCategory,
                                        list: merchandiseCategory,
                                        check: 'v'
                                    };
                                }
                            }
                            else{
                                context = {
                                    menu: 'menuForCustomer.ejs',
                                    who: '손님',
                                    logined: 'NO',
                                    boardtypes: boardtypes,
                                    body: 'merchandise.ejs',
                                    haveMerchandise: haveCategory,
                                    list: merchandiseCategory,
                                    check: 'v'
                                };
                            }
                            req.app.render('home', context, (err, html)=>{
                                res.end(html);
                            });
                        });
                    }
                });
             });
        });
    },
}