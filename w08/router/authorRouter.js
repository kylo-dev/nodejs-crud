const express = require('express');
var router = express.Router()

var author = require('../lib/author');

router.get('/author', (req, res)=>{
    author.home(req,res);
});

router.post('/author/create_process', (req, res)=>{
    author.create_process(req, res);
});

router.get('/author/update/:pageId', (req, res)=>{
    author.update(req, res);
});

router.post('/author/update_process', (req, res)=>{
    author.update_process(req,res);
});

router.get('/author/delete/:pageId', (req, res)=>{
    author.delete_process(req, res);
});


module.exports = router;