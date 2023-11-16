// 컴퓨터공학과 201935247 김현겸

var db = require('./db');
var sanitizeHtml = require('sanitize-html');

function authIsOwner(req, res) {
    return req.session.is_logined || false;
}

module.exports = {
    
}