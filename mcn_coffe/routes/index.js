var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');

var User = mongoose.model('User');

var code = require('../config/code');

var naver = require('./naver');
router.use('/naver', naver);
var cafe = require('./cafe');
router.use('/cafes', cafe);
var menu = require('./menu');
router.use('/menus', menu);
var order = require('./order');
router.use('/orders', order);

var multer  = require('multer');
var storage = require('../config/upload');
var path = require('path');
var crypto = require('crypto');

var fileNameStrategy = function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err);
        cb(null, raw.toString('hex') + path.extname(file.originalname));
    })
};

var userStorage = multer.diskStorage({ destination: function(req, res, cb) { cb(null, storage.userImage); }, filename: fileNameStrategy });
var cafeStorage = multer.diskStorage({ destination: function(req, res, cb) { cb(null, storage.cafeImage); }, filename: fileNameStrategy });
var menuStorage = multer.diskStorage({ destination: function(req, res, cb) { cb(null, storage.menuImage); }, filename: fileNameStrategy });

var userImage = multer({ storage: userStorage });
var cafeImage = multer({ storage: cafeStorage });
var menuImage = multer({ storage: menuStorage });

router.post('/upload/user/image', userImage.single('file'), function(req, res){
    return res.json({
        filename: req.file.filename,
        message: 'success'
    });
});

router.post('/upload/cafe/image', cafeImage.single('file'), function (req, res) {
    return res.json({
        filename: req.file.filename,
        message: 'success'
    });
});

router.post('/upload/menu/image', menuImage.single('file'), function(req, res){
    return res.json({
        filename: req.file.filename,
        message: 'success'
    });
});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'MCN_COFFEE' });
});

router.get('/dashboard', function(req, res){
    res.render('dashboard', { title: 'MCN_COFFEE' });
});

router.post('/register', function(req, res){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({
            message: '모든 입력을 해주세요'
        });
    }
    var user = new User();
    user.username = req.body.username;
    user.setPassword(req.body.password);
    user.save(function (err){
        if(err) {
            if(err.code == 11000)
                return res.status(400).json({
                    message: '중복된 아이디입니다.'
                });
            else
                return res.status(400).json({
                    message: '처리 중 문제가 발생했습니다.'
                });
        }
        return res.json({
            token: user.generateJWT()
        });
    });
});

router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }
    passport.authenticate('local', function(err, user, info){
        if(err)
            return next(err);
        if(user)
            return res.json({
                token: user.generateJWT()
            });
        else
            return res.status(401).json(info);
    })(req, res, next);
});

module.exports = router;
