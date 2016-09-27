/**
 * Created by blood_000 on 2016-09-28.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var YearStatistic = mongoose.model('YearStatistic');
var MonthStatistic = mongoose.model('MonthStatistic');
var DayStatistic = mongoose.model('DayStatistic');

router.get('/year', function(req, res, next){
    var year = req.query.year;
    YearStatistic.find({
        menu: {$in: req.cafe.menus},
        year: year
    }, function(err, yearStatistics){
        if(err) { return next(err); }
        return res.json(yearStatistics);
    });
});

router.get('/month', function(req, res, next){
    var year = req.query.year;
    var month = req.query.month;
    MonthStatistic.find({
        menu: {$in: req.cafe.menus},
        year: year,
        month: month
    }, function(err, monthStatistics){
        if(err) { return next(err); }
        return res.json(monthStatistics);
    });
});

router.get('/date', function(req, res, next){
    var year = req.query.year;
    var month = req.query.month;
    var date = req.query.date;
    DayStatistic.find({
        menu: {$in: req.cafe.menus},
        year: year,
        month: month,
        date: date
    }, function(err, dayStatistics) {
        if(err) { return next(err); }
        return res.json(dayStatistics);
    });
});

module.exports = router;