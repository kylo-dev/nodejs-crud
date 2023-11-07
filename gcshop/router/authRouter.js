// 컴퓨터공학과 201935247 김현겸
const express = require('express');
var router = express.Router();

var auth = require('../lib/auth');

router.get('/login', (req, res)=>{
    auth.login(req, res);
});

router.post('/login_process', (req, res)=>{
    auth.login_process(req, res);
});

router.get('/logout_process', (req, res)=>{
    auth.logout_process(req, res);
});

module.exports = router;