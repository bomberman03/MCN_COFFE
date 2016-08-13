/**
 * Created by pathFinder on 2016-08-13.
 */
var express = require('express');
var router = express.Router();
var https = require('https');

var auth = {
    id: 'b4Ipp9TAh1DjURhv8KkP',
    secret: 't3Y4dGzHqj'
};

// naver api request delegate
router.post('/getCoordinate', function(req, res){
    var options = {
        hostname: req.body.hostname,
        path: req.body.path,
        method: 'GET',
        headers: {
            'X-Naver-Client-Id': auth.id,
            'X-Naver-Client-Secret': auth.secret
        }
    };
    req = https.request(options, function(response){
        response.on('data', function(d) {
            var ret = d.toString('utf-8');
            return res.json(ret);
        });
    });
    req.end();
});

router.post('/getAddress', function(req, res){
    var options = {
        hostname: req.body.hostname,
        path: req.body.path,
        method: 'GET',
        headers: {
            'X-Naver-Client-Id': auth.id,
            'X-Naver-Client-Secret': auth.secret
        }
    };
    console.log(options);
    req = https.request(options, function(response){
        response.on('data', function(d) {
            var ret = d.toString('utf-8');
            return res.json(ret);
        });
    });
    req.end();
});

module.exports = router;