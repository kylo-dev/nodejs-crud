const db = require('./db');

module.exports = {
    home :(req, res) =>{
        db.query('select * from topic', (error, results)=>{

            var lists = '<ol type="1">';
            var i = 0;
            while(i < results.length) {
                lists = lists + `<li><a href="#">${results[i].title}</a></li>`;
                i += 1;
            }
            lists = lists + '</ol>';
        
            var context = {list:lists,
                        title:'Welcome'};
            console.log(context);
            res.render('home3', context, (err, html)=>{
                res.end(html)
            });
        });
        db.end();
    }
}