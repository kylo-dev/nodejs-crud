// 컴퓨터공학과 201935247 김현겸
const express = require('express');
var router = express.Router()

var person = require('../lib/person');

router.get('/view/:vu',(req, res)=>{
    person.view(req, res);
}); 

router.get('/create',(req,res)=>{
    person.create(req,res);
});

router.post('/create_process',(req,res)=>{
    person.create_process(req,res);
});

router.get('/update/:userId',(req,res)=>{
    person.update(req,res);
});

router.post('/update_process',(req,res)=>{

    person.update_process(req,res,file);
});

router.get('/delete/:userId',(req,res)=>{
    person.delete_process(req,res);
});

module.exports = router;