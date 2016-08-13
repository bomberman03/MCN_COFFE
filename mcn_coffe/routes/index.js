var express = require('express');
var router = express.Router();
var passport = require('passport');

var code = require('../config/code');

var naver = require('./naver');
router.use('/naver', naver);
var cafe = require('./cafe');
router.use('/cafes', cafe);
var menu = require('./menu');
router.use('/menus', menu);
var option = require('./option');
router.use('/options', option);
var order = require('./order');
router.use('/orders', order);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'MCN_COFFEE' });
});

router.get('/dashboard', function(req, res, next){
    res.render('dashboard', { title: 'MCN_COFFEE' });
});

router.post('/register', function(req, res, next){
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
