/**
 * Created by pathFinder on 2016-08-17.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var Option = mongoose.model('Option');

router.param('option', function(req, res, next, id) {
    var query = Option.findById(id);
    query.exec(function (err, option){
        if (err) { return next(err); }
        if (!menu) { return next(new Error('can\'t find Menu')); }
        req.option = option;
        return next();
    });
});

/* menu related API */
router.get('/', function(req, res, next){
    Option.find({ cafe: req.cafe }, function(err, options){
        if(err) { return next(err); }
        var cnt = options.length;
        for(var idx in options) {
            console.log("before");
            console.log(options[idx]);
            console.log("before");
            options[idx].populate('options', function(err, option) {
                console.log("after");
                console.log(option);
                console.log("after");
                cnt--;
                if(cnt==0) {
                    console.log(options);
                    res.json(options);
                }
            });
        }
    });
});

router.post('/', function(req, res, next){
    var option = new Option(req.body);
    option.cafe = req.cafe;
    option.save(function(err, option){
        if(err){ return next(err); }
        res.json(option);
    });
});

module.exports = router;