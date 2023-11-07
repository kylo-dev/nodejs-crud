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
    view : (req, res) =>{
        if(!checkSessionClass(req, res)){
            return;
        }
        var param = req.params.vu;

        db.query('select count(*) as merCount from merchandise', (err, result)=>{
            db.query('select * from merchandise', (err, results)=>{

                haveMerchandise = result[0].merCount !== 0;

                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    logined: 'YES',
                    body: 'merchandise.ejs',
                    haveMerchandise: haveMerchandise,
                    list: results,
                    check: param
                };
                req.app.render('home', context, (err, html)=>{
                    res.end(html);
                });
            });
        });
    },

    create : (req, res) => {
        if(!checkSessionClass(req, res)){
            return;
        }
        db.query('select * from code_tbl', (err, results)=>{
            if(err){ throw err; }

            var context = {
                menu: 'menuForManager.ejs',
                who: req.session.name,
                logined: 'YES',
                body: 'merchandiseCU.ejs',
                list: results,
                check: 'c'
            };
    
            req.app.render('home', context, (err, html)=>{
                res.end(html);
            });
        });
    },

    create_process : (req, res) =>{
        var imgFile = '/images/' + req.file.filename;
        var post = req.body;

        category = sanitizeHtml(post.category);
        Pname = sanitizeHtml(post.name);
        price = sanitizeHtml(post.price);
        stock = sanitizeHtml(post.stock);
        brand = sanitizeHtml(post.brand);
        supplier = sanitizeHtml(post.supplier);
        saleYn = sanitizeHtml(post.sale_yn);
        salePrice = sanitizeHtml(post.sale_price);

        db.query(`insert into merchandise(category, name, price, stock, brand, supplier, image, sale_yn, sale_price) values(?,?,?,?,?,?,?,?,?)`,
            [category, Pname, price, stock, brand, supplier, imgFile, saleYn, salePrice], (err, result)=>{
                if(err){ throw err; }
                res.writeHead(302, {Location: `/merchandise/view/v`});
                res.end();
            });
    },

    update : (req, res) => {
        if(!checkSessionClass(req, res)){
            return;
        }
        var id = req.params.merId;
        db.query(`select * from merchandise where mer_id=?`, [id],(err2, result)=>{
            db.query('select * from code_tbl', (err, results)=>{
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'merchandiseCU.ejs',
                    logined: 'YES',
                    list: result,
                    code: results,
                    check: 'u'
                };
                req.app.render('home', context, (error, html)=>{
                    res.end(html);
                });
            });
        });
    },

    update_process : (req, res) => {
        var imgFile = '/images/' + req.file.filename;
        var post = req.body;

        category = sanitizeHtml(post.category);
        Pname = sanitizeHtml(post.name);
        price = sanitizeHtml(post.price);
        stock = sanitizeHtml(post.stock);
        brand = sanitizeHtml(post.brand);
        supplier = sanitizeHtml(post.supplier);
        saleYn = sanitizeHtml(post.sale_yn);
        salePrice = sanitizeHtml(post.sale_price);
        db.query(`update merchandise set category=?, name=?, price=?, stock=?, brand=?, supplier=?,image=?,sale_yn=?,sale_price=? where mer_id=?`,
            [category, Pname, price, stock, brand, supplier, imgFile, saleYn, salePrice, post.mer_id], (err, result)=>{
                res.writeHead(302, {Location: `/merchandise/view/v`});
                res.end();
            });
    },

    delete_process : (req, res) => {
        // 관리자(00)을 제외하고는 삭제할 수 없음
        if(!checkSessionClass(req, res)){
            return;
        }
        id = req.params.merId;
        db.query(`delete from merchandise where mer_id=?`,[id], (error, result)=>{
            res.writeHead(302, {Location: '/'});
            res.end();
        });
    }
}