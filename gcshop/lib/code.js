// 컴퓨터공학과 201935247 김현겸

var db = require('./db');

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
    view : (req, res)=>{
        if(!checkSessionClass(req, res)){
            return;
        }
        var param = req.params.vu;

        db.query('select count(*) as codeCount from code_tbl', (err, result)=>{
            db.query('select * from code_tbl', (err, results)=>{

                // merchandise 테이블에 데이터가 있는지
                if (result[0].codeCount == 0){
                    haveCode = false;
                }
                haveCode = true;

                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'code.ejs',
                    logined: 'YES',
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
            body: 'codeCU.ejs',
            logined: 'YES',
            check: 'c'
        };

        req.app.render('home', context, (err, html)=>{
            res.end(html);
        });
    },

    create_process : (req, res)=> {

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
                body: 'codeCU.ejs',
                logined: 'YES',
                list: result,
                check: 'u'
            };
    
            req.app.render('home', context, (err, html)=>{
                res.end(html);
            });
        })
    },

    update_process : (req, res)=>{

    },

    delete_process : (req, res)=> {

    }
}