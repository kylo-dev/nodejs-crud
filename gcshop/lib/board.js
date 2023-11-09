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

    },
    typeupdate_process: (req, res)=>{

    },
    typedelete_process : (req, res)=>{

    }

}