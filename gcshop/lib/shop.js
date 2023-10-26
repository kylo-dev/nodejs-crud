// 컴퓨터공학과 201935247 김현겸

var db = require('./db');

function authIsOwner(req, res) {
    if(req,session.is_logined){
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
                    
                }
            }
        }
    }
}