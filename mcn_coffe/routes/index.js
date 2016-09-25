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
    var user = new User(req.body);
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

router.get('/users', function(req, res, next){
    User.find({}, function(err, users){
        if(err) { return next(err); }
        return res.json(users);
    });
});

router.param('user', function(req, res, next, id) {
    var query = User.findById(id);
    query.exec(function (err, user){
        if (err) { return next(err); }
        if (!user) { return next(new Error('can\'t find user')); }
        req.user = user;
        return next();
    });
});

router.get('/users/:user', function(req, res, next){
    if(!req.user) return res.status(404);
    return res.json(req.user);
});

router.put('/users/:user', function(req, res, next){
    var data = req.body;
    var query = {$set: data};
    for(var k in data)
        req.user[k] = data[k];
    User.update({_id: req.user._id}, query, function(err, users){
        if(err) { return next(err); }
        return res.json({
            token: req.user.generateJWT()
        });
    });
});

router.delete('/users/:user', function(req, res, next){
    var confirm  = req.body.confirm;
    if(!req.user.validPassword(confirm))
        return res.status(400).json({
            message: '확인 메시지 없음'
        });
    var user_id = req.user._id;
    User.remove({_id: user_id}, function(err){
        if(err) { return next(err); }
        return res.status(200).json({
            message: '삭제가 정상적으로 처리되었습니다.',
            id: user_id
        });
    });
});

module.exports = router;
