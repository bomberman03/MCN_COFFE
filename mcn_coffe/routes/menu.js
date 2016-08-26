/**
 * Created by pathFinder on 2016-08-13.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var Cafe = mongoose.model('Cafe');
var Menu = mongoose.model('Menu');

router.get('/', function(req, res, next){
    Menu.find(function(err, menus){
        if(err){ return next(err); }
        res.json(menus);
    });
});

router.get('/:menu', function(req, res) {
    res.json(req.menu);
});

router.param('menu', function(req, res, next, id) {
    var query = Menu.findById(id);
    query.exec(function (err, menu){
        if (err) { return next(err); }
        if (!menu) { return next(new Error('can\'t find Menu')); }
        req.menu = menu;
        return next();
    });
});

module.exports = router;