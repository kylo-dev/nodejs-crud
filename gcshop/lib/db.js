// 컴퓨터공학과 201935247 김현겸
var mysql = require('mysql');
var db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'webdb2023',
    multipleStatements: true
});
db.connect();

module.exports = db;