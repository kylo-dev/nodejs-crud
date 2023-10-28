// 컴퓨터공학과 201935247 김현겸

var db = require('./db');

function authIsOwner(req, res) {
    if(req.session.is_logined){
        return true;
    }
    return false;
}

module.exports = {
    home : (req, res)=>{
        var isOwner = authIsOwner(req, res);
        if(isOwner){
            if(req.session.class === '00'){
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'items.ejs'
                };
            }
            else if(req.session.class === '01'){
                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: req.session.name,
                    body: 'items.ejs'
                };
            }
            else if(req.session.class === '02'){
                var context = {
                    menu: 'menuForCustomer.ejs',
                    who: req.session.name,
                    body: 'items.ejs',
                    logined: 'YES'
                };
            }
        }
        else{
            var context = {
                menu: 'menuForCustomer.ejs',
                who: '손님',
                body: 'items.ejs',
                logined: 'NO'
            };
        }
        req.app.render('home', context, (err, html)=>{
            res.end(html);
        });
    },
}