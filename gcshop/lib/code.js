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

        db.query('select count(*) as codeCount from code_tbl', (err, result)=>{
            db.query('select * from code_tbl', (err, results)=>{

                // code_tbl 테이블에 데이터가 있는지
                if (result[0].codeCount == 0){
                    haveCode = false;
                }
                haveCode = true;

                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    logined: 'YES',
                    body: 'code.ejs',
                    haveCode: haveCode,
                    list: results,
                    check: param
                };
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                });
            });
        });
    },

    create : (req, res)=>{
        if(!checkSessionClass(req, res)){
            return;
        }
        var context = {
            menu: 'menuForManager.ejs',
            who: req.session.name,
            logined: 'YES',
            body: 'codeCU.ejs',
            check: 'c'
        };

        req.app.render('home', context, (err, html)=>{
            res.end(html);
        });
    },

    create_process : (req, res)=> {
        var post = req.body;
        mainId = sanitizeHtml(post.main_id);
        mainName = sanitizeHtml(post.main_name);
        subId = sanitizeHtml(post.sub_id);
        subName = sanitizeHtml(post.sub_name);
        start = sanitizeHtml(post.start);
        end = sanitizeHtml(post.end);

        db.query(`insert into code_tbl values(?,?,?,?,?,?)`,
            [mainId,subId,mainName, subName,start,end], (err, result)=>{
                if(err){
                    throw err;
                }
                res.writeHead(302, {Location: `/code/view/v`});
                res.end();
            });
    },

    update : (req, res)=>{
        if(!checkSessionClass(req, res)){
            return;
        }
        var mainId = req.params.main;
        var subId = req.params.sub;

        db.query(`select * from code_tbl where main_id=? and sub_id=?`,[mainId, subId],(error, result)=>{
            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                logined: 'YES',
                body: 'codeCU.ejs',
                list: result,
                check: 'u'
            };
    
            req.app.render('home', context, (err, html)=>{
                res.end(html);
            });
        });
    },

    update_process : (req, res)=>{
        var post = req.body;
        mainName = sanitizeHtml(post.main_name);
        subName = sanitizeHtml(post.sub_name);
        start = sanitizeHtml(post.start);
        end = sanitizeHtml(post.end);
        db.query(`update code_tbl set main_name=?, sub_name=?, start=?, end=? where main_id=? and sub_id=?`,
            [mainName,subName, start, end, post.main_id, post.sub_id], (err, result)=>{
                res.writeHead(302, {Location: `/code/view/v`});
                res.end();
            });
    },

    delete_process : (req, res)=> {
        if(!checkSessionClass(req, res)){
            return;
        }
        var mainId = req.params.main;
        var subId = req.params.sub;
        db.query(`delete from code_tbl where main_id=? and sub_id=?`,[mainId,subId], (err, result)=>{
            res.writeHead(302, {Location: '/code/view/u'});
            res.end();
        });
    }
}