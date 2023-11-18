// 컴퓨터공학과 201935247 김현겸
const express = require('express');
var router = express.Router();

var purchase = require('../lib/purchase');

// 구매 내역 페이지로 이동동
router.get('/', (req, res)=>{
    purchase.view(req, res);
});

// 상품 결제 OR 장바구니 버튼 페이지로 이동
router.get('/detail/:merId', (req, res)=>{
    purchase.detail(req, res);
});

// 구매 내역 테이블에 상품 추가하기
router.post('/payment', (req, res)=>{
    purchase.payment(req, res);
});

// 구매 내역에서 취소 여부 변환하기
router.get('/cancel/:purchaseId', (req, res)=>{
    purchase.cancel(req, res);
});

// 카트 목록 페이지로 이동
router.get('/cart', (req, res)=>{
    purchase.cartView(req, res);
});

// 상품 카트에 추가하기
router.post('/cart', (req, res)=>{
    purchase.cartAdd(req, res);
});

// 카트 내역에서 선택한 상품 결제 처리
router.post('/cart/payment', (req, res)=>{
    purchase.cartPay(req, res);
});

//== 관리자 ==//
// 관리자 구매 내역 생성 페이지로 이동
router.get('/manage/create', (req, res)=>{
    purchase.manageCreate(req, res);
});

// 관리자 동적으로 상품 선택 - 데이터 받기
router.get('/manage/merchandise/:merId', (req, res)=>{
    purchase.manageMerchandise(req, res);
});

router.get('/manage/view/:vu/:pNum', (req, res)=>{
    purchase.manageView(req, res);
});

router.get('/manage/update/:purchaseId', (req, res)=>{
    purchase.manageUpdate(req, res);
});

router.post('/manage/update_process', (req, res)=>{
    purchase.manageUpdate_process(req, res);
});

router.get('/manage/delete/:purchaseId', (req, res)=>{
    purchase.manageDelete(req, res);
});

//== Manage Cart ==//
router.get('/cart/manage/create', (req, res)=>{
    purchase.manageCartCreate(req, res);
});



module.exports = router;