// 컴퓨터공학과 201935247 김현겸
const express = require('express');
var router = express.Router();

var shop = require('../lib/shop');

router.get('/shop/:category', (req, res)=>{
    shop.home(req, res);
});

module.exports = router;