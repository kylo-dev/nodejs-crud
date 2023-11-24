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
                db.query('select * from merchandise', (err2, results)=>{
                    var haveMerchandise = results.length !== 0;
                    var context;
                    if (categoryId === 'all'){
                        if (authIsOwner(req, res)) {
                            // 로그인한 경우
                            context = {
                                menu: req.session.class === '00' ? 'menuForMIS.ejs' :
                                    req.session.class === '01' ? 'menuForManager.ejs' :
                                    req.session.class === '02' ? 'menuForCustomer.ejs' : 'menuForCustomer.ejs',
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
                                    menu: req.session.class === '00' ? 'menuForMIS.ejs' :
                                        req.session.class === '01' ? 'menuForManager.ejs' :
                                        req.session.class === '02' ? 'menuForCustomer.ejs' : 'menuForCustomer.ejs',
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
                        menu: req.session.class === '00' ? 'menuForMIS.ejs' :
                            req.session.class === '01' ? 'menuForManager.ejs' :
                            req.session.class === '02' ? 'menuForCustomer.ejs' : 'menuForCustomer.ejs',
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
    detail: (req, res)=>{
        var merId = req.params.merId;
        db.query('select * from boardtype', (err, boardtypes)=>{
            db.query(`select * from merchandise where mer_id = ${merId}`,(err, result)=>{

                var context;
                if (authIsOwner(req, res)) {
                    // 로그인한 경우
                    context = {
                        menu: req.session.class === '00' ? 'menuForMIS.ejs' :
                            req.session.class === '01' ? 'menuForManager.ejs' :
                            req.session.class === '02' ? 'menuForCustomer.ejs' : 'menuForCustomer.ejs',
                        who: req.session.name,
                        logined: 'YES',
                        boardtypes: boardtypes,
                        body: 'shopDetail.ejs',
                        list: result,
                        check: 'y'
                    };
                } else {
                    // 비로그인인 경우
                    context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        logined: 'NO',
                        boardtypes: boardtypes,
                        body: 'shopDetail.ejs',
                        list: result,
                        check: 'n'
                    };
                }
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                });
            });
        });
    },

    customeranal: (req, res)=>{

        if (authIsOwner(req, res)){
            if(req.session.class === '00'){
                var sql1 = `select * from boardtype;`;
                var sql2 = `select address, ROUND(( count(*) / (select count(*) from person )) * 100, 2)as rate
                            from person group by address;`;
                db.query(sql1 + sql2, (error, results)=>{
                    var context = {
                        menu : 'menuForMIS.ejs',
                        who: req.session.name,
                        logined: 'YES',
                        boardtypes: results[0],
                        body : 'customerAnal.ejs',
                        percentage: results[1]
                    };
                    req.app.render('home', context, (err, html)=>{
                        res.end(html);
                    });
                });
            }
        }
        else{
            var sql1 = `select * from boardtype`;
            var sql2 = `select * from merchandise`;
            db.query(sql1 + sql2, (error, results)=>{
                var context = {
                    menu : 'menuForCustomer.ejs',
                    who: '손님',
                    logined: 'NO',
                    boardtypes: results[0],
                    body : 'merchandise.ejs',
                    haveMerchandise: results[1] !== 0,
                    list: results[1],
                    check: 'v'
                }
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                });
            });
        }
    },
    purchaseanal : (req, res)=>{
        if (authIsOwner(req, res)){
            if(req.session.class === '00'){
                var sql1 = `select * from boardtype;`;
                var sql2 = `select m.name, round((count(*) / (select count(*) from purchase)) * 100, 2) as rate from purchase p 
                                join merchandise m on p.mer_id = m.mer_id
                                group by p.mer_id;`;
                db.query(sql1 + sql2, (error, results)=>{
                    var context = {
                        menu : 'menuForMIS.ejs',
                        who: req.session.name,
                        logined: 'YES',
                        boardtypes: results[0],
                        body : 'purchaseAnal.ejs',
                        percentage: results[1]
                    };
                    req.app.render('home', context, (err, html)=>{
                        res.end(html);
                    });
                });
            }
        }
        else{
            var sql1 = `select * from boardtype`;
            var sql2 = `select * from merchandise`;
            db.query(sql1 + sql2, (error, results)=>{
                var context = {
                    menu : 'menuForCustomer.ejs',
                    who: '손님',
                    logined: 'NO',
                    boardtypes: results[0],
                    body : 'merchandise.ejs',
                    haveMerchandise: results[1] !== 0,
                    list: results[1],
                    check: 'v'
                }
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                });
            });
        }
    }
}