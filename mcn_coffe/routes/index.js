var express = require('express');
var router = express.Router();
var passport = require('passport');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Cafe = mongoose.model('Cafe');
var Option = mongoose.model('Option');
var Menu = mongoose.model('Menu');
var Order = mongoose.model('Order');

var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);

http.listen(8080, socket_ip);

io.on('connection', function (socket) {
    var id = socket.handshake.query.id;
    socket.on(id, function(data){
        io.emit(id, {
            data: data
        });
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MCN_COFFEE' });
});

router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: '모든 입력을 해주세요'});
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password);

    user.save(function (err){
        if(err){
            if(err.code == 11000) return res.status(400).json({message: '중복된 아이디입니다.'});
            else return res.status(400).json({message: '처리 중 문제가 발생했습니다.'});
        }

        return res.json({token: user.generateJWT()})
    });
});

router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }

        if(user){
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
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
    req.cafe.populate('menus', function(err, cafe){
        res.json(cafe);
    });
});

router.delete('/cafes/:cafe', function(req, res){
    var cafe_id = req.cafe._id;
    Cafe.remove({_id: req.cafe._id}, function(err){
        if(err) { return next(err); }
        return res.status(200).json({
            message: '삭제가 정상적으로 처리되었습니다.',
            id: cafe_id
        });
    });
});

/* menu related API */

router.get('/menus', function(req, res, next){
    Menu.find(function(err, menus){
        if(err){ return next(err); }
        res.json(menus);
    });
});

router.get('/cafes/:cafe/menus', function(req, res, next){
    Menu.find({_id: {$in: req.cafe.menus }}, function(err, menus){
        if(err) { return next(err); }
        res.json(menus);
    });
});

router.post('/cafes/:cafe/menus', function(req, res, next){
    req.body.options = [];
    var menu = new Menu(req.body);
    menu.save(function(err, menu){
        if(err){ return next(err); }
        req.cafe.menus.push(menu);
        req.cafe.save(function(err, cafe){
            if(err){ return next(err); }
            res.json(menu);
        });
    });
});

router.delete('/cafes/:cafe/menus/:menu', function(req, res, next){
    var menu_id = req.menu._id;
    Menu.remove({_id: req.menu._id}, function(err){
        if(err) { next(err); }
        var idx = req.cafe.menus.indexOf(menu_id);
        req.cafe.menus.splice(idx, 1);
        req.cafe.save(function(err, cafe){
            if(err) { return next(err); }
            return res.status(200).json({
                message: '삭제가 정상적으로 처리되었습니다.',
                id: menu_id
            });
        });
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
    req.menu.populate('options', function(err, menu){
        res.json(menu);
    });
});

/* option related API */

router.get('/options', function(req, res, next){
    Option.find(function(err, options){
        if(err){ return next(err); }
        res.json(options);
    });
});

router.post('/menus/:menu/options', function(req, res, next){
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

router.param('option', function(req, res, next, id) {
    var query = Option.findById(id);
    query.exec(function (err, option){
        if (err) { return next(err); }
        if (!option) { return next(new Error('can\'t find option')); }
        req.option = option;
        return next();
    });
});

router.get('/menus/:menu/options', function(req, res) {
    Option.find({_id : { $in: req.menu.options }}, function(err, options){
        res.json(options);
    });
});

router.get('/options/:option/options', function(req, res) {
    Option.find({_id : { $in: req.option.options }}, function(err, options){
        res.json(options);
    });
});

router.get('/options/:option', function(req, res) {
    req.option.populate('options', function(err, option){
        res.json(option);
    });
});

router.post('/options/:option/options', function(req, res, next){
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

/* Order related API */

router.get('/orders', function(req, res, next){
    Order.find(function(err, orders){
        if(err) { return next(err); }
        res.json(orders);
    });
});

router.get('/cafes/:cafe/orders/', function(req, res, next){
    Order.find({cafe: req.cafe._id}, function(err, orders){
        if(err) { return next(err); }
        res.json(orders);
    });
});

router.param('order', function(req, res, next, id){
    var query = Order.findById(id);
    query.exec(function (err, order){
        if (err) { return next(err); }
        if (!order) { return next(new Error('can\'t find order')); }
        req.order = order;
        return next();
    });
});

router.get('/orders/:order', function(req, res, next){
    res.json(req.order);
});

router.post('/orders/', function(req, res, next){
    var order = new Order(req.body);
    order.save(function(err, order){
        if(err){ return next(err); }
        res.json(order);
    });
});

router.post('/cafes/:cafe/orders/', function(req, res, next){
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

router.delete('/orders/:order', function(req, res, next){
    var cafe = req.order.cafe;
    var order_id = req.order._id;
    Order.remove({_id: req.order._id}, function(err){
        if(err) { return next(err); }
        io.emit(cafe, {
            method:'delete',
            name:'order',
            id:order_id
        });
        return res.status(200).json({
            message: '삭제가 정상적으로 처리되었습니다.',
            id: order_id
        });
    });
});

router.put('/orders/:order/complete', function(req, res, next){
    req.order.complete(function(err, order){
        if(err) { next(err); }
        io.emit(order.cafe, {
            method: 'put',
            name: 'order',
            id: order._id,
            data: order
        });
        res.json(order);
    });
});

router.put('/orders/:order/receive', function(req, res, next){
    req.order.receive(function(err, order){
        if(err) { next(err); }
        io.emit(order.cafe, {
            method: 'put',
            name: 'order',
            id: order._id,
            data: order
        });
        res.json(order);
    });
});

router.put('/orders/:order/cancel', function(req, res, next){

});

module.exports = router;
