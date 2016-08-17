/**
 * Created by pathFinder on 2016-08-13.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

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

/* option related API */
router.get('/', function(req, res, next){
    Option.find(function(err, options){
        if(err){ return next(err); }
        return res.json(options);
    });
});

router.get('/:option/options', function(req, res) {
    Option.find({_id : { $in: req.option.options }}, function(err, options){
        res.json(options);
    });
});

router.get('/:option', function(req, res) {
    req.option.populate('options', function(err, option){
        res.json(option);
    });
});

router.post('/:option/options', function(req, res, next){
    var option = new Option(req.body);
    option.save(function(err, option){
        if(err){ return next(err); }
        req.option.options.push(option);
        req.option.save(function(err, _option){
            if(err) { return next(err); }
            res.json(option);
        });
    });
});

module.exports = router;