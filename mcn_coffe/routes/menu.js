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

router.put('/:menu', function(req, res, next){
    var update = req.body;
    for(var a in update){
        req.menu[a] = update[a];
    }
    req.menu.save(function(err, menu){
        if(err) { return next(err); }
        else
            return res.json(menu);
    });
});

router.post('/:menu', function(req, res, next){
    var option = req.body;
    option.order = req.menu.options.length;
    req.menu.options.push(option);
    req.menu.save(function(err, menu){
        if(err) { return next(err); }
        else
            return res.json(menu);
    });
});

router.param('option', function(req, res, next, order){
    req.option_idx = order;
    return next();
});

router.put('/:menu/:option', function(req, res, next){
    var update = req.body;
    for(var f in update) {
        req.menu.options[req.option_idx][f] = update[f];
    }
    req.menu.save(function(err, menu){
        if(err) { return next(err); }
        else return res.json(menu);
    });
});

router.delete('/:menu/:option', function(req, res, next){
    req.menu.options.splice(req.option_idx, 1);
    for(var i=req.option_idx; i<req.menu.options.length; i++) {
        req.menu.options[i].order--;
    }
    req.menu.save(function(err, menu){
        if(err) { return next(err); }
        else return res.json(menu);
    });
});

router.param('suboption', function(req, res, next, order){
    req.sub_option_idx = order;
    return next();
});

router.post('/:menu/:option', function(req, res, next) {
    var sub_option = req.body;
    sub_option.order = req.menu.options[req.option_idx].options.length;
    req.menu.options[req.option_idx].options.push(sub_option);
    req.menu.save(function(err, menu){
        if(err) {
            return next(err);
        }
        return res.json(menu);
    });
});

router.put('/:menu/:option/:suboption', function(req, res, next){
    var update = req.body;
    for(var f in update) {
        req.menu.options[req.option_idx].options[req.sub_option_idx][f] = update[f];
    }
    req.menu.save(function(err, menu){
        if(err) { return next(err); }
        return res.json(menu);
    });
});

router.delete('/:menu/:option/:suboption', function(req, res, next){
    req.menu.options[req.option_idx].options.splice(req.sub_option_idx, 1);
    for(var i=req.sub_option_idx; i<req.menu.options[req.option_idx].options.length; i++) {
        req.menu.options[req.option_idx].options[i].order--;
    }
    req.menu.save(function(err, menu){
        if(err) {
            return next(err);
        }
        return res.json(menu);
    });
});

module.exports = router;