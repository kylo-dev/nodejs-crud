// 컴퓨터공학과 201935247 김현겸

var db = require("./db");
var sanitizeHtml = require("sanitize-html");
const dateModule = require('./template');

function authIsOwner(req, res) {
  return req.session.is_logined || false;
}
function checkSessionClass(req, res, validClass = undefined) {
  if (req.session.class === validClass) {
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
  view: (req, res) => {
    var loginId = req.session.userPk;
    db.query("select * from boardtype", (err, boardtypes) => {
      db.query(
        `select m.image, m.name, p.purchase_id, p.price, p.qty, p.total, p.date, p.cancel from purchase as p 
                    join merchandise as m on p.mer_id=m.mer_id where loginid=?`,
        [loginId],
        (err2, results) => {
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
          };
          req.app.render("home", context, (err, html) => {
            res.end(html);
          });
        }
      );
    });
  },

  detail: (req, res) => {
    if (!checkSessionClass(req, res)) {
      return;
    }
    var merId = req.params.merId;

    db.query("select * from boardtype", (err, boardtypes) => {
      db.query(
        `select * from merchandise where mer_id = ${merId}`,
        (err2, result) => {
          var context = {
            menu:
              req.session.class === "00"
                ? "menuForManager.ejs"
                : "menuForCustomer.ejs",
            who: req.session.name,
            logined: "YES",
            boardtypes: boardtypes,
            body: "purchaseCRU.ejs",
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

    db.query('update purchase set cancel=? where purchase_id=?', 
        ['Y', purchaseId], (err, result)=>{
          res.writeHead(302, {Location: '/purchase'});
          res.end();
        })
  },
  cartView: (req, res)=>{
    var loginId = req.session.userPk;

    db.query("select * from boardtype", (err, boardtypes) => {
      db.query(`select m.mer_id, m.image, m.name, m.price, m.stock, c.date from cart c 
              join merchandise m on c.mer_id = m.mer_id where loginid=?`,[loginId], (err2, results) => {
          var haveCart = results.length !== 0;
          
          var context = {
            menu:
              req.session.class === "00"
                ? "menuForManager.ejs"
                : "menuForCustomer.ejs",
            who: req.session.name,
            logined: "YES",
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

    db.query('select * from cart where mer_id=?',[merId], (error, cart)=>{
      if(cart.length !== 0){

        res.end(`<script type='text/javascript'>
                alert("You already add the merchandise");
                setTimeout(() => {
                    location.href='http://localhost:3000/purchase/cart';
                }, 1000); </script>`);
        return;
      }
      db.query('insert into cart(loginid, mer_id, date) values(?,?,?)',
        [loginId,merId,currentDate], (err, result)=>{
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
    console.log(selectedItems);

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
    db.query('select * from boardtype', (err, boardtypes)=>{
      db.query('select * from merchandise', (err2, results)=>{
        var haveMerchandise = results.length !== 0;

        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          logined: "YES",
          boardtypes: boardtypes,
          body: "purchaseForManager.ejs",
          list: results,
          haveMerchandise: haveMerchandise
        };
        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      });
    });
  },

  managerMerchandise : (req, res)=>{
    var merId = req.params.merId;

    db.query(`select * from merchandise where mer_id = ${merId}`, (err, result)=>{
      res.json(result);
    });
  }
};
