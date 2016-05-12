var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Cafe = mongoose.model('Cafe');
var Option = mongoose.model('Option');
var Menu = mongoose.model('Menu');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MCN_COFFEE' });
});

/* cafe related API */

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

/* menu related API */

router.get('/menus', function(req, res, next){
    Menu.find(function(err, menus){
        if(err){ return next(err); }
        res.json(menus);
    });
});

router.post('/cafes/:cafe/menus', function(req, res, next){
    var menu = new Menu(req.body);
    menu.save(function(err, menu){
        if(err){ return next(err); }
        res.json(menu);
        req.cafe.menus.push(menu);
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

router.get('/menus/:menu', function(req, res) {
    res.json(req.menu);
});

/* option related API */

router.get('/options', function(req, res, next){
    Option.find(function(err, options){
        if(err){ return next(err); }
        res.json(options);
    });
});

router.post('/menus/:menu/options', function(req, res, next){
    var option = new Option(req.body);
    option.save(function(err, option){
        if(err){ return next(err); }
        res.json(option);
    });
});

router.param('option', function(req, res, next, id) {
    var query = Option.findById(id);
    query.exec(function (err, option){
        if (err) { return next(err); }
        if (!option) { return next(new Error('can\'t find option')); }
        req.option = option;
        return next();
    });
});

router.get('/options/:option', function(req, res) {
    res.json(req.option);
});

router.post('/options/:option/options', function(req, res, next){
    var option = new Option(req.body);
    option.save(function(err, option){
        if(err){ return next(err); }
        res.json(option);
    });
});

module.exports = router;
