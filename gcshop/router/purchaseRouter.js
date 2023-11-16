// 컴퓨터공학과 201935247 김현겸
const express = require('express');
var router = express.Router();

var purchase = require('../lib/purchase');

router.get('/detail/:merId', (req, res)=>{
    purchase.detail(req, res);
});

router.get('/', (req, res)=>{
    purchase.view(req, res);
});

module.exports = router;