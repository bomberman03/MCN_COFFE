/**
 * Created by pathFinder on 2016-08-13.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var Menu = mongoose.model('Menu');
var Option = mongoose.model('Option');

router.param('option', function(req, res, next, id) {
    var query = Option.findById(id);
    query.exec(function (err, option){
        if (err) { return next(err); }
        if (!option) { return next(new Error('can\'t find option')); }
        req.option = option;
        return next();
    });
});

/* option related API dependent to menu */
router.get('/options', function(req, res) {
    Option.find({_id : { $in: req.menu.options }}, function(err, options){
        res.json(options);
    });
});

router.post('/options', function(req, res, next){
    req.body.options = [];
    var option = new Option(req.body);
    option.save(function(err, option){
        if(err){ return next(err); }
        req.menu.options.push(option);
        req.menu.save(function(err, menu){
            if(err){ return next(err); }
            res.json(option);
        });
    });
});

module.exports = router;