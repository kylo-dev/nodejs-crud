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

}