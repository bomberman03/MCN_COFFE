var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Cafe = mongoose.model('Cafe');
var Option = mongoose.model('Option');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MCN_COFFEE' });
});

router.get('/cafes', function(req, res, next){
    Cafe.find(function(err, cafes){
        if(err){ return next(err); }
        res.json(cafes);
    });
});

router.post('/cafes', function(req, res, next) {
    var cafe = new Cafe(req.body);
    cafe.save(function(err, cafe){
        if(err){ return next(err); }
        res.json(cafe);
    });
});

router.param('cafe', function(req, res, next, id) {
    var query = Cafe.findById(id);
    query.exec(function (err, cafe){
        if (err) { return next(err); }
        if (!cafe) { return next(new Error('can\'t find cafe')); }
        req.cafe = cafe;
        return next();
    });
});

router.get('/cafes/:cafe', function(req, res) {
    res.json(req.cafe);
});

router.get('/options', function(req, res, next){
    Option.find(function(err, options){
        if(err){ return next(err); }
        res.json(options);
    });
});

router.post('/options', function(req, res, next){
    var option = new Option(req.body);
    option.save(function(err, option){
        if(err){ return next(err); }
        res.json(option);
    });
});

router.get('/menus', function(req, res, next){
    Menu.find(function(err, menus){
        if(err){ return next(err); }
        res.json(menus);
    });
});

router.post('/menus', function(req, res, next){
    var menu = new Menu(req.body);
    menu.save(function(err, menu){
        if(err){ return next(err); }
    });
});

router.param('menu', function(req, res, next, id) {
    var query = Menu.findById(id);
    query.exec(function (err, menu){
        if (err) { return next(err); }
        if (!menu) { return next(new Error('can\'t find cafe')); }
        req.menu = menu;
        return next();
    });
});

router.get('/cafes/:menu', function(req, res) {
    res.json(req.menu);
});

module.exports = router;
