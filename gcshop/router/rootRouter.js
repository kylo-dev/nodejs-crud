// 컴퓨터공학과 201935247 김현겸
const express = require('express');
var router = express.Router();

var shop = require('../lib/shop');

router.get('/shop/:category', (req, res)=>{
    shop.home(req, res);
});

// 상품 검색하기
router.post('/shop/search', (req, res)=>{
    shop.search(req, res);
});

// 상품 세부사항 페이지로 이동
router.get('/shop/detail/:merId', (req, res)=>{
    shop.detail(req, res);
});

router.get('/shop/anal/customer', (req, res)=>{
    shop.customeranal(req, res);
});

router.get('/shop/anal/purchase', (req, res)=>{
    shop.purchaseanal(req, res);
});

module.exports = router;