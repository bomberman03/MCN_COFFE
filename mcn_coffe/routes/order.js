/**
 * Created by pathFinder on 2016-08-13.
 */
var express = require('express');
var router = express.Router();
var io = require('./socket');

var mongoose = require('mongoose');

var Order = mongoose.model('Order');

router.param('order', function(req, res, next, id){
    var query = Order.findById(id);
    query.exec(function (err, order){
        if (err) { return next(err); }
        if (!order) { return next(new Error('can\'t find order')); }
        req.order = order;
        return next();
    });
});

/* Order related API */
router.get('/', function(req, res, next){
    Order.find(function(err, orders){
        if(err) { return next(err); }
        res.json(orders);
    });
});

router.post('/status', function(req, res, next){
    Order.find({ _id: { $in: req.body.orders }}, function(err, orders){
        if(err) { return next(err); }
        res.json({
            orders: orders
        });
    });
});

router.post('/users', function(req, res, next){
    Order.find({ "user._id" : req.body.user }, function(err, orders){
        if(err) { return next(err); }
        res.json({
            orders: orders
        });
    });
});

router.get('/:order', function(req, res){
    res.json(req.order);
});

router.post('/', function(req, res, next){
    var order = new Order(req.body);
    order.save(function(err, order){
        if(err){ return next(err); }
        res.json(order);
    });
});

router.delete('/:order', function(req, res, next){
    var cafe = req.order.cafe;
    var order_id = req.order._id;
    Order.remove({_id: req.order._id}, function(err){
        if(err) { return next(err); }
        io.emit(cafe, {
            method:'delete',
            name:'order',
            id: order_id
        });
        return res.status(200).json({
            message: '삭제가 정상적으로 처리되었습니다.',
            id: order_id
        });
    });
});

router.put('/:order/complete', function(req, res, next){
    req.order.complete(function(err, order){
        if(err) { next(err); }
        io.emit(order.cafe._id, {
            method: 'put',
            name: 'order',
            id: order._id,
            data: order
        });
        res.json(order);
    });
});

router.put('/:order/receive', function(req, res, next){
    req.order.receive(function(err, order){
        if(err) { next(err); }
        io.emit(order.cafe._id, {
            method: 'put',
            name: 'order',
            id: order._id,
            data: order
        });
        res.json(order);
    });
});

router.put('/:order/cancel', function(req, res, next){
    req.order.cancel(function(err, order){
        if(err) { next(err); }
        io.emit(order.cafe._id, {
            method: 'put',
            name: 'order',
            id: order._id,
            data: order
        });
        res.json(order);
    });
});

module.exports = router;