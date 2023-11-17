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
        `select m.image, m.name, p.price, p.qty, p.total, p.date, p.cancel from purchase as p 
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
            console.log(result);
            res.writeHead(302, {Location: '/purchase'});
            res.end();
          });
  },
};
