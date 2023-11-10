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
            db.query('select * from boardtype where type_id=?',[typeId], (error, boardtype)=>{
                db.query('select count(*) as boardCnt from board where type_id=?',[typeId], (err2, result)=>{
                    /* 페이지 기능 구현 */
                    var numPerPage = boardtype[0].numPerPage;
                    var offs = (page-1)*numPerPage;
                    var totalPages = Math.ceil(result[0].boardCnt/numPerPage);

                    db.query(`select name, board_id, title, date from board as b
                    join person as p on b.loginid=p.loginid where type_id=?
                    order by date desc, board_id desc LIMIT ? OFFSET ?`, [typeId, numPerPage, offs], (err3, results)=>{
                        var haveBoard = result[0].boardCnt !== 0;
    
                        if (authIsOwner(req, res)) {
                            var context = {
                                menu: req.session.class === '00' ? 'menuForManager.ejs' : 'menuForCustomer.ejs',
                                who: req.session.name,
                                logined: 'YES',
                                boardtypes: boardtypes,
                                body: 'board.ejs',
                                haveBoard: haveBoard,
                                boardtype: boardtype,
                                author: req.session.class,
                                list: results,
                                pageNum: page,
                                totalPages: totalPages
                            };
                        } else {
                            var context = {
                                menu: 'menuForCustomer.ejs',
                                who: '손님',
                                logined: 'NO',
                                boardtypes: boardtypes,
                                body: 'board.ejs',
                                haveBoard: haveBoard,
                                boardtype: boardtype,
                                list: results,
                                pageNum: page,
                                totalPages: totalPages
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
            db.query(`select board_id, type_id, title, b.loginid, date, content, name
            from board as b join person as p on b.loginid = p.loginid
            where board_id=?`,[boardId], (err2, result)=>{

                if (authIsOwner(req, res)) {
                    var context = {
                        menu: req.session.class === '00' ? 'menuForManager.ejs' : 'menuForCustomer.ejs',
                        who: req.session.name,
                        logined: 'YES',
                        boardtypes: boardtypes,
                        body: 'boardCRU.ejs',
                        author: req.session,
                        list: result,
                        check: 'r', // detail 읽기 전용
                        pageNum: page
                    };
                } else {
                    var context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        logined: 'NO',
                        boardtypes: boardtypes,
                        body: 'boardCRU.ejs',
                        author: req.session,
                        list: result,
                        check: 'r',
                        pageNum: page
                    };
                }
            req.app.render('home', context, (error, html)=>{
                res.end(html);
            });
            });
        });
    },
    
    create : (req, res)=>{
        var typeId = req.params.typeId;

        db.query('select * from boardtype', (err, boardtypes)=>{
            db.query('select type_id, title from boardtype where type_id=?',[typeId], (err2, boardtype)=>{
                var context = {
                    menu: req.session.class === '00' ? 'menuForManager.ejs' : 'menuForCustomer.ejs',
                    who: req.session.name,
                    logined: req.session.is_logined ? 'YES' : 'NO',
                    boardtypes: boardtypes,
                    body: 'boardCRU.ejs',
                    check: 'c', 
                    boardtype: boardtype,
                    author: req.session
                };

                req.app.render('home', context, (error, html)=>{
                    res.end(html);
                });
            });
        });
    },
    create_process : (req, res)=>{
        var post = req.body;

        title = sanitizeHtml(post.title);
        content = sanitizeHtml(post.content);
        pwd = sanitizeHtml(post.password);

        db.query(`insert into board(type_id, loginid,password,title,date,content) values(?,?,?,?,now(),?)`
            ,[post.type_id, post.loginid, pwd, title, content], (err, result)=>{
                if(err){
                    throw err;
                }
                res.writeHead(302, {Location: `/board/view/${post.type_id}/1`});
                res.end();
            })
    },

    update : (req, res)=>{
        var boardId = req.params.boardId;
        var typeId = req.params.typeId;
        var page= req.params.pNum;
        
        var sql1 = `select title from boardtype where type_id=${typeId};`
        var sql2 = `select board_id, title, name, content, b.password from board as b 
                    join person as p on b.loginid = p.loginid where board_id=${boardId};`

        db.query('select * from boardtype', (err, boardtypes)=>{
            db.query(sql1 + sql2, (error, multiresult)=>{
                
                var context = {
                    menu: req.session.class === '00' ? 'menuForManager.ejs' : 'menuForCustomer.ejs',
                    who: req.session.name,
                    logined: req.session.is_logined ? 'YES' : 'NO',
                    boardtypes: boardtypes,
                    body: 'boardCRU.ejs',
                    author: req.session,
                    typeTitle: multiresult[0],
                    list: multiresult[1],
                    check: 'u',
                    pageNum: page
                };

                req.app.render('home', context, (err2, html)=>{
                    res.end(html);
                });
            });
        });
    },
    update_process : (req, res)=>{
        var post = req.body;
        boardId = sanitizeHtml(post.boardId);
        pageNum = sanitizeHtml(post.pageNum);
        title = sanitizeHtml(post.title);
        content = sanitizeHtml(post.content);

        db.query(`update board set title=?, content=? where board_id=?`,
                [title, content, boardId],(err, result)=>{
                    res.writeHead(302, {Location: `/board/detail/${boardId}/${pageNum}`});
                    res.end();
                });
    },

    delete_process : (req, res)=>{
        var boardId = req.params.boardId;
        var typeId = req.params.typeId;
        var pageNum = req.params.pNum;

        db.query(`delete from board where board_id=?`,[boardId], (err, result)=>{
            res.writeHead(302, {Location: `/board/view/${typeId}/${pageNum}`});
            res.end();
        });
    }

}