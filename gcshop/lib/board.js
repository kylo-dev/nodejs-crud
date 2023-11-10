// 컴퓨터공학과 201935247 김현겸

var db = require('./db');
var sanitizeHtml = require('sanitize-html');

function authIsOwner(req, res) {
    if(req.session.is_logined){
        return true;
    }
    return false;
}

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
    typeview : (req, res)=>{
        if(!checkSessionClass(req, res)){
            return;
        }
        db.query('select * from boardtype', (err, boardtypes)=>{
            db.query('select count(*) as typeCount from boardtype', (err2, result)=>{
                db.query('select * from boardtype', (err3, results)=>{
                   
                    haveType = result[0].typeCount != 0;
                    
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        logined: 'YES',
                        boardtypes: boardtypes,
                        body: 'boardtype.ejs',
                        haveType: haveType,
                        list: results,
                    }
                    req.app.render('home', context, (error, html)=>{
                        res.end(html);
                    });
                });
            });
        });
    },
    typecreate : (req, res)=>{
        if(!checkSessionClass(req, res)){
            return;
        }
        db.query('select * from boardtype', (err, boardtypes)=>{
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                logined: 'YES',
                boardtypes: boardtypes,
                body: 'boardtypeCU.ejs',
                check: 'c'
            };
    
            req.app.render('home', context, (err, html)=>{
                res.end(html);
            });
        });
    },
    typecreate_process : (req, res)=>{
        var post = req.body;
        title = sanitizeHtml(post.title);
        description = sanitizeHtml(post.description);
        numPerPage = sanitizeHtml(post.numPerPage);
        writeYN = sanitizeHtml(post.write_YN);
        reYN = sanitizeHtml(post.re_YN);

        db.query(`insert into boardtype(title,description, write_YN, re_YN, numPerPage) values(?,?,?,?,?)`,
            [title, description, writeYN, reYN, numPerPage], (err, result)=>{
                if(err){
                    throw err;
                }
                res.writeHead(302, {Location: `/board/type/view`});
                res.end();
            });
    },
    typeupdate : (req, res)=>{
        if(!checkSessionClass(req, res)){
            return;
        }
        var typeId = req.params.typeId;
        db.query('select * from boardtype', (err, boardtypes)=>{
            db.query(`select * from boardtype where type_id=?`,[typeId],(error, result)=>{
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    logined: 'YES',
                    boardtypes: boardtypes,
                    body: 'boardtypeCU.ejs',
                    list: result,
                    check: 'u'
                };
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                });
            });
        });
    },
    typeupdate_process: (req, res)=>{
        var post = req.body;
        typeId = sanitizeHtml(post.type_id);
        title = sanitizeHtml(post.title);
        description = sanitizeHtml(post.description);
        numPerPage = sanitizeHtml(post.numPerPage);
        writeYN = sanitizeHtml(post.write_YN);
        reYN = sanitizeHtml(post.re_YN);

        db.query(`update boardtype set title=?,description=?,write_YN=?,re_YN=?,numPerPage=? where type_id=?`,
            [title, description, writeYN, reYN, numPerPage, typeId], (err, result)=>{
                if(err){
                    throw err;
                }
                res.writeHead(302, {Location: `/board/type/view`});
                res.end();
            });
    },
    typedelete_process : (req, res)=>{
        if(!checkSessionClass(req, res)){
            return;
        }
        var typeId = req.params.typeId;
        db.query(`delete from boardtype where type_id=?`,[typeId], (err, result)=>{
            res.writeHead(302, {Location: '/board/type/view'});
            res.end();
        });
    },

    // board controller
    view : (req, res)=>{
        var typeId = req.params.typeId;
        var page = req.params.pNum;

        db.query('select * from boardtype', (err, boardtypes)=>{
            db.query('select title, write_YN from boardtype where type_id=?',[typeId], (error, boardtype)=>{
                db.query('select count(*) as boardCnt from board', (err2, result)=>{
                    db.query('select * from board where type_id=?', [typeId], (err3, results)=>{
                        haveBoard = result[0].boardCnt !== 0;
                        var isOwner = authIsOwner(req, res);
    
                        if(isOwner){
                            if(req.session.class === '00'){
                                var context = {
                                    menu: 'menuForManager.ejs',
                                    who: req.session.name,
                                    logined: 'YES',
                                    boardtypes: boardtypes,
                                    body: 'board.ejs',
                                    haveBoard: haveBoard,
                                    boardtype: boardtype,
                                    author: req.session.class,
                                    list: results,
                                    pageNum : page
                                };
                            }
                            else{
                                var context = {
                                    menu: 'menuForCustomer.ejs',
                                    who: req.session.name,
                                    logined: 'YES',
                                    boardtypes: boardtypes,
                                    body: 'board.ejs',
                                    haveBoard: haveBoard,
                                    boardtype: boardtype,
                                    author: req.session.class,
                                    list: results,
                                    pageNum : page
                                };
                            }
                        }
                        else{
                            var context = {
                                menu: 'menuForCustomer.ejs',
                                who: '손님',
                                logined: 'NO',
                                boardtypes: boardtypes,
                                body: 'board.ejs',
                                haveBoard: haveBoard,
                                boardtype: boardtype,
                                list: results,
                                pageNum: page
                            };
                        }
                        req.app.render('home', context, (err4, html)=>{
                            res.end(html);
                        });
                    });
                });
            });
        });
    },
    detail : (req, res)=>{
        var boardId = req.params.boardId;
        var page = req.params.pNum;

        db.query('select * from boardtype',(err, boardtypes)=>{
            db.query(`select title, b.loginid, date, content, name 
            from board as b join person as p on b.loginid = p.loginid
            where board_id=?`,[boardId], (err2, result)=>{

                if(authIsOwner(req, res)){
                    if(req.session.class === '00'){
                        var context = {
                            menu: 'menuForManager.ejs',
                            who: req.session.name,
                            logined: 'YES',
                            boardtypes: boardtypes,
                            body: 'boardCRU.ejs',
                            author: req.session,
                            list: result,
                            check: 'r', // detail 읽기 전용
                        };
                    }
                    else{
                        var context = {
                            menu: 'menuForCustomer.ejs',
                            who: req.session.name,
                            logined: 'YES',
                            boardtypes: boardtypes,
                            body: 'boardCRU.ejs',
                            author: req.session,
                            list: result,
                            check: 'r',
                        };
                    }
                }
                else{
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        logined: 'NO',
                        boardtypes: boardtypes,
                        body: 'boardCRU.ejs',
                        author: req.session,
                        list: result,
                        check: 'r'
                    };
                }
                req.app.render('home', context, (error, html)=>{
                    res.end(html);
                });
            });
        });
    },
    
    create : (req, res)=>{

    },
    create_process : (req, res)=>{

    },
    update : (req, res)=>{

    },
    update_process : (req, res)=>{

    },
    delete_process : (req, res)=>{

    }

}