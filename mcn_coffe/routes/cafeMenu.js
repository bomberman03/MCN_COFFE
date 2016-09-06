/**
 * Created by pathFinder on 2016-08-13.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var Menu = mongoose.model('Menu');

router.param('menu', function(req, res, next, id) {
    var query = Menu.findById(id);
    query.exec(function (err, menu){
        if (err) { return next(err); }
        if (!menu) { return next(new Error('can\'t find Menu')); }
        req.menu = menu;
        return next();
    });
});

/* menu related API */
router.get('/', function(req, res, next){
    Menu.find({_id: {$in: req.cafe.menus }}, function(err, menus){
        if(err) { return next(err); }
        res.json(menus);
    });
});

router.post('/', function(req, res, next){
    req.body.cafe = req.cafe;
    var menu = new Menu(req.body);
    menu.save(function(err, menu){
        if(err){ return next(err); }
        req.cafe.menus.push(menu);
        req.cafe.save(function(err, cafe){
            if(err){ return next(err); }
            return res.json(menu);
        });
    });
});

router.delete('/:menu', function(req, res, next){
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

module.exports = router;