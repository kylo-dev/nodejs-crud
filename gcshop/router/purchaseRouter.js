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

router.post('/payment', (req, res)=>{
    purchase.payment(req, res);
});

router.get('/cancel/:purchaseId', (req, res)=>{
    purchase.cancel(req, res);
});

router.get('/cart', (req, res)=>{
    purchase.cartView(req, res);
});

router.post('/cart', (req, res)=>{
    purchase.cartAdd(req, res);
});

router.post('/cart/payment', (req, res)=>{
    purchase.cartPay(req, res);
});

module.exports = router;