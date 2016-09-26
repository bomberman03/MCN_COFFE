/**
 * Created by pathFinder on 2016-08-13.
 */
var express = require('express');
var router = express.Router();
var io = require('./socket');

var mongoose = require('mongoose');

var Order = mongoose.model('Order');

/* order related API dependant to cafe */
router.get('/', function(req, res, next){
    Order.find({
        "cafe._id": req.cafe._id,
        status: { $in: [0,1] }
    }, function(err, orders){
        if(err) { return next(err); }
        res.json(orders);
    });
});

router.get('/all', function(req, res, next){
    Order
        .find({
        "cafe._id": req.cafe._id
    })
        .sort({
        "updateAt":-1
    })
        .limit(100)
        .exec(function(err, orders){
            res.json(orders);
        });
});

router.post('/', function(req, res, next){
    req.body.cafe = req.cafe;
    var order = new Order(req.body);
    order.save(function(err, order){
        if(err){ return next(err); }
        io.emit(req.cafe._id, {
            method: 'post',
            name: 'order',
            id: order._id,
            data: order
        });
        res.json(order);
    });
});

module.exports = router;