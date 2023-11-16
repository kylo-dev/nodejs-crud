// 컴퓨터공학과 201935247 김현겸

var db = require('./db');
var sanitizeHtml = require('sanitize-html');

function authIsOwner(req, res) {
    return req.session.is_logined || false;
}
function checkSessionClass(req, res, validClass = undefined) {
    if (req.session.class === validClass) {
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
    
    view:(req, res)=>{
        var loginId = req.session.loginid;

        db.query('select * from boardtype', (err, boardtypes)=>{
            db.query(`select * from purchase where loginid=${loginId}`, (err, results)=>{
                
            })
        })
    },

    detail : (req, res)=>{
        if(!checkSessionClass(req, res)){
            return;
        }
        var merId = req.params.merId;

        db.query('select * from boardtype', (err, boardtypes)=>{
            db.query(`select * from merchandise where mer_id = ${merId}`, (err2, result)=>{
                var context = {
                    menu: req.session.class === '00' ? 'menuForManager.ejs' : 'menuForCustomer.ejs',
                    who: req.session.name,
                    logined: 'YES',
                    boardtypes: boardtypes,
                    body: 'purchaseCRU.ejs',
                    list: result,
                };
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                });
            })
        })
    },
}