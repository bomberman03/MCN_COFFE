var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Cafe = mongoose.model('Cafe');

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
    var post = new Cafe(req.body);
    post.save(function(err, post){
        if(err){ return next(err); }
        res.json(post);
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

module.exports = router;
