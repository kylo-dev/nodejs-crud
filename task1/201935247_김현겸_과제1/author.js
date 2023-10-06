// 컴퓨터공학과 201935247 김현겸 
const db = require('./db');

module.exports = {
    author :(req, res) => {
        db.query('select * from author', (error, results)=>{
            var lists = '<ol type="1">';
            var i = 0;
            while(i < results.length){
                lists = lists + `<li><a href="#">${results[i].name}</a></li>`;
                i += 1;
            }
            lists = lists + '</ol>';

            var context = {list: lists};
            res.render('home2', context, (err, html)=> {
                res.end(html)
            });
        });
        db.end();
    }
}