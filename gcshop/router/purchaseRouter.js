// 컴퓨터공학과 201935247 김현겸
const express = require('express');
var router = express.Router();

var purchase = require('../lib/purchase');

router.get('/', (req, res)=>{
    purchase.view(req, res);
});

router.get('/detail/:merId', (req, res)=>{
    purchase.detail(req, res);
});

router.post('/detail/:merId', (req, res)=>{
    purchase.payment(req, res);
});

module.exports = router;