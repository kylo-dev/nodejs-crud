// 컴퓨터공학과 201935247 김현겸

var db = require("./db");
var sanitizeHtml = require("sanitize-html");
const dateModule = require('./template');

function authIsOwner(req, res) {
  return req.session.is_logined || false;
}
function checkClass(req, res, validClass = undefined) {
  if (req.session.class === validClass) {
    const script = `
        <script type='text/javascript'>
            alert("You do not have access.");
            setTimeout(() => {
                location.href='http://localhost:3000/shop/all';
            }, 1000);
        </script>`;
    res.end(script);
    return false;
  }
  return true;
}

function checkSessionClass(req, res, validClass = '00') {
    if (req.session.class !== validClass) {
        const script = `
        <script type='text/javascript'>
            alert("You do not have access.");
            setTimeout(() => {
                location.href='http://localhost:3000/shop/all';
            }, 1000);
        </script>`;
        res.end(script);
        return false;
    }
    return true;
}

module.exports = {
  view: (req, res) => {
    var loginId = req.session.userPk;
    db.query("select * from boardtype", (err, boardtypes) => {
      db.query( `select m.image, m.name, p.* from purchase as p 
                    join merchandise as m on p.mer_id=m.mer_id where loginid=?`,[loginId], (err2, results) => {
          var havePurchase = results.length !== 0;
          
          var context = {
            menu:
              req.session.class === "00"
                ? "menuForManager.ejs"
                : "menuForCustomer.ejs",
            who: req.session.name,
            logined: "YES",
            boardtypes: boardtypes,
            body: "purchase.ejs",
            list: results,
            havePurchase: havePurchase,
            loginid: loginId
          };
          req.app.render("home", context, (err, html) => {
            res.end(html);
          });
        }
      );
    });
  },

  detail: (req, res) => {
    if (!checkClass(req, res)) {
      return;
    }
    var merId = req.params.merId;

    db.query("select * from boardtype", (err, boardtypes) => {
      db.query(`select * from merchandise where mer_id = ${merId}`,(err2, result) => {
          var context = {
            menu:
              req.session.class === "00"
                ? "menuForManager.ejs"
                : "menuForCustomer.ejs",
            who: req.session.name,
            logined: "YES",
            boardtypes: boardtypes,
            body: "purchaseCreate.ejs",
            list: result,
          };
          req.app.render("home", context, (err, html) => {
            res.end(html);
          });
        }
      );
    });
  },

  payment: (req, res)=>{
    var post = req.body;
    if (post.price === ''){
      res.end(`<script type='text/javascript'>
                alert("there is not selected items");
                setTimeout(() => {
                    location.href='http://localhost:3000/purchase/manage/create';
                }, 1000); </script>`);
        return;
    }

    var loginid = req.session.userPk;
    const currentDate = dateModule.dateOfEightDigit();
    var point = post.price * 0.005;
    var total = post.price * post.qty;

    db.query('insert into purchase(loginid,mer_id,date,price,point,qty,total,payYN,cancel,refund) values(?,?,?,?,?,?,?,?,?,?)',
          [loginid, post.merId, currentDate, post.price, point, post.qty, total, 'N','N','N'], (err, result)=>{
            if(err){
              throw err;
            }
            res.writeHead(302, {Location: '/purchase'});
            res.end();
          });
  },

  cancel : (req, res)=>{
    var purchaseId = req.params.purchaseId;

    db.query('update purchase set cancel=? where purchase_id=?', ['Y', purchaseId], (err, result)=>{
          if (req.session.class === '00') {
            res.redirect('/purchase/manage/view/u/1');
        } else {
            res.redirect('/purchase');
        }
      });
  },

  cartView: (req, res)=>{
    var loginId = req.session.userPk;

    db.query("select * from boardtype", (err, boardtypes) => {
      db.query(`select m.mer_id, m.image, m.name, m.price, m.stock, c.date, c.qty from cart c 
              join merchandise m on c.mer_id = m.mer_id where loginid=?`,[loginId], (err2, results) => {
          var haveCart = results.length !== 0;
          
          var context = {
            menu:
              req.session.class === "00"
                ? "menuForManager.ejs"
                : "menuForCustomer.ejs",
            who: req.session.name || '손님',
            logined: req.session.class ? "YES" : "NO",
            boardtypes: boardtypes,
            body: "cart.ejs",
            list: results,
            haveCart: haveCart,
          };
          req.app.render("home", context, (err, html) => {
            res.end(html);
          });
        }
      );
    });
  },
  
  cartAdd: (req, res)=>{
    var post = req.body;

    var loginId = req.session.userPk;
    var merId = post.merId;
    const currentDate = dateModule.dateOfEightDigit();

    db.query('select * from cart where mer_id=? and loginid =?',[merId, loginId], (error, cart)=>{
      if(cart.length !== 0){

        res.end(`<script type='text/javascript'>
                alert("You already add the merchandise");
                setTimeout(() => {
                    location.href='http://localhost:3000/purchase/cart';
                }, 1000); </script>`);
        return;
      }
      db.query('insert into cart(loginid, mer_id, date) values(?,?,?)',[loginId,merId,currentDate], (err, result)=>{
          res.writeHead(302, {Location: '/purchase/cart'});
          res.end();
        });
    });
  },

  cartPay : (req, res)=>{
    const selectedItems = JSON.parse(req.body.selectedItems);

    if(selectedItems.length === 0){
      res.end(`<script type='text/javascript'>
                alert("No product has been selected.");
                setTimeout(() => {
                    location.href='http://localhost:3000/purchase/cart';
                }, 1000); </script>`);
        return;
    }

    var loginid = req.session.userPk;
    const currentDate = dateModule.dateOfEightDigit();

    for(var i = 0; i < selectedItems.length; i++){
      var merId = parseInt(selectedItems[i].mer_id, 10);
      var price = parseInt(selectedItems[i].price, 10);
      var qty = parseInt(selectedItems[i].qty, 10);
      var point = price * 0.005;
      var total = price * qty;

      db.query('insert into purchase(loginid,mer_id,date,price,point,qty,total,payYN,cancel,refund) values(?,?,?,?,?,?,?,?,?,?)',
          [loginid, merId, currentDate, price, point, qty, total, 'N','N','N'], (err, result)=>{
            if(err){
              throw err;
            }
            db.query('delete from cart where mer_id=?', [merId], (err2, result)=>{
              if(err2){
                throw err2;
              }
            })
          });
    }
    res.writeHead(302, {Location: '/purchase'});
    res.end();
  },

  // Manager 관련 컨트롤러
  manageCreate : (req, res)=>{
    if (!checkSessionClass(req, res)) {
      return;
    }

    db.query('select * from boardtype', (err, boardtypes)=>{
      db.query('select * from merchandise', (err2, results)=>{
        var haveMerchandise = results.length !== 0;

        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          logined: "YES",
          boardtypes: boardtypes,
          body: "purchaseForManagerC.ejs",
          list: results,
          haveMerchandise: haveMerchandise,
        };
        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      });
    });
  },

  manageMerchandise : (req, res)=>{
    var merId = req.params.merId;

    db.query(`select * from merchandise where mer_id = ${merId}`, (err, result)=>{
      res.json(result);
    });
  },

  manageView: (req, res)=>{
    if (!checkSessionClass(req, res)) {
      return;
    }
    var vu = req.params.vu;
    var page = req.params.pNum;

    db.query("select * from boardtype", (err, boardtypes) => {
      db.query('select count(*) as purCnt from purchase', (err2, purall)=>{

        /* 페이징 기능 */
        var numPerPage = 4;
        var offs = (page - 1) * numPerPage;
        var totalPages = Math.ceil(purall[0].purCnt / numPerPage);
        var havePurchase = purall[0].purCnt !== 0;

        db.query(
          `select m.image, m.name, p.purchase_id, p.loginid, p.price, p.qty, p.total, p.date, p.cancel from purchase as p 
                      join merchandise as m on p.mer_id=m.mer_id
                      order by date LIMIT ? OFFSET ?`, [numPerPage, offs],(err3, results) => {
            
            var context = {
              menu:
                req.session.class === "00"
                  ? "menuForManager.ejs"
                  : "menuForCustomer.ejs",
              who: req.session.name,
              logined: "YES",
              boardtypes: boardtypes,
              body: "purchaseManagerView.ejs",
              list: results,
              havePurchase: havePurchase,
              vu: vu,
              pageNum: page,
              totalPages: totalPages
            };
            req.app.render("home", context, (err, html) => {
              res.end(html);
            });
          }
        );
      });
    });
  },

  manageUpdate : (req, res)=>{
    var purId = req.params.purchaseId;

    db.query('select * from boardtype', (err, boardtypes)=>{
      db.query(`select m.name, m.price, m.image, m.stock, p.* from purchase as p 
            join merchandise as m on p.mer_id = m.mer_id
            where purchase_id = ${purId}`, (err2, result)=>{

        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          logined: "YES",
          boardtypes: boardtypes,
          body: "purchaseForManagerU.ejs",
          list: result,
        };
        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      });
    });
  },
  manageUpdate_process : (req, res)=>{
    var post = req.body;

    var purId = post.purchaseId;
    var qty = sanitizeHtml(post.qty);
    var total = post.price * qty;
    var payYN = post.payYN === 'Y' ? 'Y' : 'N';
    var cancel = post.cancel === 'Y' ? 'Y' : 'N';
    var refund = post.refund === 'Y' ? 'Y' : 'N';

    db.query(`update purchase set qty=?, total=?,payYN=?, cancel=?, refund=? where purchase_id=?`,
          [qty, total, payYN, cancel, refund, purId], (err, result)=>{
            if(err){
              throw err;
            }
            res.writeHead(302, {Location: `/purchase/manage/view/u/1`});
            res.end();
          });
  },

  manageDelete : (req, res)=>{
    if(!checkSessionClass(req, res)){
      return;
    } 
    var purchaseId = req.params.purchaseId;
    db.query(`delete from purchase where purchase_id = ${purchaseId}`, (err, result)=>{
      res.redirect("/purchase/manage/view/u/1");
    });
  },

  // Manange Cart 관련
  manageCartCreate : (req, res)=>{
    if (!checkSessionClass(req, res)) {
      return;
    }

    db.query('select * from boardtype', (err, boardtypes)=>{
      db.query('select * from merchandise', (err2, results)=>{
        var haveMerchandise = results.length !== 0;

        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          logined: "YES",
          boardtypes: boardtypes,
          body: "purchaseForManagerC.ejs",
          list: results,
          haveMerchandise: haveMerchandise,
        };
        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      });
    });
  },

  manageCartUpdate : (req, res)=>{
    if (!checkSessionClass(req, res)) {
      return;
    }
    var page = req.params.pNum;

    db.query("select * from boardtype", (err, boardtypes) => {
      db.query('select count(*) as cartCnt from cart', (err2, cartall)=>{

        /* 페이징 기능 */
        var numPerPage = 4;
        var offs = (page - 1) * numPerPage;
        var totalPages = Math.ceil(cartall[0].cartCnt / numPerPage);
        var haveCart = cartall[0].cartCnt !== 0;

        db.query(
          `select m.image, m.name, m.price, c.* from cart as c 
                      join merchandise as m on c.mer_id=m.mer_id
                      order by date LIMIT ? OFFSET ?`, [numPerPage, offs],(err3, results) => {
            
            var context = {
              menu:
                req.session.class === "00"
                  ? "menuForManager.ejs"
                  : "menuForCustomer.ejs",
              who: req.session.name,
              logined: "YES",
              boardtypes: boardtypes,
              body: "cartManagerView.ejs",
              list: results,
              haveCart: haveCart,
              pageNum: page,
              totalPages: totalPages
            };
            req.app.render("home", context, (err, html) => {
              res.end(html);
            });
          }
        );
      });
    });
  },

  cartUpdate :(req, res)=>{
    var cartId = req.params.cartId;

    db.query('select * from boardtype', (err, boardtypes)=>{
      db.query(`select m.name, m.price, m.image, m.stock, c.* from cart as c 
            join merchandise as m on c.mer_id = m.mer_id
            where cart_id = ${cartId}`, (err2, result)=>{

        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          logined: "YES",
          boardtypes: boardtypes,
          body: "cartManagerU.ejs",
          list: result,
        };
        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      });
    });
  },

  cartUpdate_process : (req, res)=>{
    var post = req.body;

    var cartId = post.cartId;
    var qty = sanitizeHtml(post.qty);


    db.query(`update cart set qty=? where cart_id=?`,
          [qty, cartId], (err, result)=>{
            if(err){
              throw err;
            }
            res.writeHead(302, {Location: `/purchase/cart/manage/view/1`});
            res.end();
          });
  },

  cartDelete : (req, res)=>{
    if(!checkClass(req, res)){
      return;
    } 
    var cartId = req.params.cartId;
    db.query(`delete from cart where cart_id = ${cartId}`, (err, result)=>{
      res.redirect("/purchase/cart/manage/view/1");
    });
  }
};
