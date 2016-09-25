/**
 * Created by pathFinder on 2016-08-13.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var Cafe = mongoose.model('Cafe');
var cafeMenu = require('./cafeMenu');
var cafeOrder = require('./cafeOrder');

router.use('/:cafe/menus', cafeMenu);
router.use('/:cafe/orders', cafeOrder);

router.param('cafe', function(req, res, next, id) {
    var query = Cafe.findById(id);
    query.exec(function (err, cafe){
        if (err) { return next(err); }
        if (!cafe) { return next(new Error('can\'t find cafe')); }
        req.cafe = cafe;
        return next();
    });
});

/* cafe related API */
router.get('/', function(req, res, next){
    var option = {};
    if(req.query.user != undefined)
        option['owner'] = req.query.user;
    if(req.query.latitude != undefined && req.query.longitude != undefined && req.query.dist != undefined)
    {
        var lat = parseFloat(req.query.latitude);
        var lon = parseFloat(req.query.longitude);
        var dist = parseFloat(req.query.dist);
        option['location.latitude'] = {
            $gt: lat - dist,
            $lt: lat + dist
        };
        option['location.longitude']  = {
            $gt: lon - dist,
            $lt: lon + dist
        }
    }
    Cafe.find(option, function(err, cafes){
        if(err){ return next(err); }
        res.json(cafes);
    });
});

router.post('/', function(req, res, next) {
    var cafe = new Cafe(req.body);
    cafe.save(function(err, cafe){
        if(err) {
            return next(err);
        }
        return res.json(cafe);
    });
});

router.get('/:cafe', function(req, res) {
    req.cafe.populate('menus', function(err, cafe) {
        res.json(cafe);
    });
});

router.put('/:cafe', function(req, res){
    var data = req.body;
    var query = {$set: data};
    Cafe.update({_id: req.cafe._id}, query, function(err, cafes){
        if(err) { return next(err); }
        return res.json(cafes);
    });
});

router.delete('/:cafe', function(req, res){
    var confirm  = req.body.confirm;
    var cafe_id = req.cafe._id;
    if(req.cafe.name != confirm)
        return res.status(400).json({
            message: '확인 메시지 없음'
        });
    Cafe.remove({_id: req.cafe._id}, function(err){
        if(err) { return next(err); }
        return res.status(200).json({
            message: '삭제가 정상적으로 처리되었습니다.',
            id: cafe_id
        });
    });
});

module.exports = router;
