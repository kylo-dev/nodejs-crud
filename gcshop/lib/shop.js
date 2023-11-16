// 컴퓨터공학과 201935247 김현겸

var db = require('./db');
var sanitizeHtml = require('sanitize-html');

function authIsOwner(req, res) {
    return req.session.is_logined || false;
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
                        if (authIsOwner(req, res)) {
                            // 로그인한 경우
                            context = {
                                menu: req.session.class === '00' ? 'menuForManager.ejs' : 'menuForCustomer.ejs',
                                who: req.session.name,
                                logined: 'YES',
                                boardtypes: boardtypes,
                                body: 'merchandise.ejs',
                                haveMerchandise: haveMerchandise,
                                list: results,
                                check: 'v'
                            };
                        } else {
                            // 비로그인인 경우
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
                            if (authIsOwner(req, res)) {
                                // 로그인한 경우
                                context = {
                                    menu: req.session.class === '00' ? 'menuForManager.ejs' : 'menuForCustomer.ejs',
                                    who: req.session.name,
                                    logined: 'YES',
                                    boardtypes: boardtypes,
                                    body: 'merchandise.ejs',
                                    haveMerchandise: haveCategory,
                                    list: merchandiseCategory,
                                    check: 'v'
                                };
                            } else {
                                // 비로그인인 경우
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
    search: (req, res)=>{
        var post = req.body;

        search = sanitizeHtml(post.search);
        db.query('select * from boardtype', (err, boardtypes)=>{
            db.query(`select * from merchandise
            where name like '%${search}%' or brand like '%${search}%' or supplier like '%${search}%'`, (err, result)=>{
                var context;
                var haveMerchandise = result.length !== 0;
                if (authIsOwner(req, res)) {
                    // 로그인한 경우
                    context = {
                        menu: req.session.class === '00' ? 'menuForManager.ejs' : 'menuForCustomer.ejs',
                        who: req.session.name,
                        logined: 'YES',
                        boardtypes: boardtypes,
                        body: 'merchandise.ejs',
                        haveMerchandise: haveMerchandise,
                        list: result,
                        check: 'v'
                    };
                } else {
                    // 비로그인인 경우
                    context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        logined: 'NO',
                        boardtypes: boardtypes,
                        body: 'merchandise.ejs',
                        haveMerchandise: haveMerchandise,
                        list: result,
                        check: 'v'
                    };
                }
                req.app.render('home', context, (error, html)=>{
                    res.end(html);
                });
            });
        });
    },
}