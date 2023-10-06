const { connect } = require('http2');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb2023'
});

connection.connect();

connection.query('SELECT * from topic', (error, results, fields)=>{
    if(error) {
        console.log(error);
    }
    console.log(results[2].title);
    // console.log(fields);
});

connection.end();