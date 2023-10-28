const express = require('express');
var router = express.Router();

var topic = require('../lib/topic');

//파일 upload
const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb)=>{ 
            cb(null, 'public/images');
        },
        filename: (req, file, cb)=>{
            var newFileName = file.originalname
            cb(null, newFileName);
        },
    }),
});

router.get('/', (req, res)=>{
    topic.home(req, res);
});

router.get('/page/:pageId', (req, res)=>{
    topic.page(req, res);
});

router.get('/create', (req, res)=>{
    topic.create(req, res);
});

router.post('/create_process', (req, res)=>{
    topic.create_process(req, res);
});

router.get('/update/:pageId', (req, res)=>{
    topic.update(req, res);
});

router.post('/update_process', (req, res)=>{
    topic.update_process(req,res);
});

router.get('/delete/:pageId', (req, res)=>{
    topic.delete_process(req, res);
});

//== 로그인 ==//
router.get('/login', (req, res)=>{
    topic.login(req, res);
});

router.post('/login_process', (req, res)=>{
    topic.login_process(req, res);
});

router.get('/logout_process', (req, res)=>{
    topic.logout_process(req, res);
});

//== 파일 업로드 ==//
router.get('/upload', (req, res)=>{
    topic.upload(req, res);
});

// uploadtest.ejs의 input의 name 속성 값 인자로 전달
router.post('/upload_process', upload.single('uploadFile'),(req, res)=>{
    var file = '/images/' + req.file.filename;
    res.send(`
        <h1>Image Upload Successfully</h1>
        <a href="/">Back</a>
        <p><img src="${file}" alt="image 출력"/></p>`);
        console.log(file);
})

module.exports = router;