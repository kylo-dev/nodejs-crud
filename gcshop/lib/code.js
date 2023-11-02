// 컴퓨터공학과 201935247 김현겸

var db = require('./db');

function authIsOwner(req, res) {
    if(req.session.is_logined){
        return true;
    }
    return false;
}

module.exports = {
    view : (req, res)=>{
        if(req.session.class !== '00'){
            res.end(`<script type='text/javascript'>
            alert("You do not have access.");
            setTimeout("location.href='http://localhost:3000/'", 1000);
            </script>`);
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

    },

    create_process : (req, res)=> {

    },

    update : (req, res)=>{

    },

    update_process : (req, res)=>{

    },

    delete_process : (req, res)=> {

    }
}