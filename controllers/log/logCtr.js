/**
 * Created by memebox on 17/4/6.
 */
/**
 * Created by memebox on 17/3/15.
 */
var express = require('express'),
    config = require('../../utils/env'),
    router = express.Router(),
    loggerInstance = require('../../logger/log'),
    moment  = require('moment'),
    request = require('request');




router.get('/log', function (req, res) {
    res.render('log/log');
});

router.post('/log/index', function (req, res) {

    var options = {
        from: "",
        until: "",
        limit: 1000,
        start: 0,
        order: 'desc',
        fields: ['timestamp','username' , 'message' , 'realname' , 'ip' ,'req']
    };

    //
    // Find items logged between today and yesterday.
    //
    loggerInstance.query(options || {}, function (err, results) {
        if (err) {
            res.status(400).json(err);
        } else {
            res.json(results);
        }
    });
});

router.post('/log/search', function (req, res) {
    var from_date = req.body.from_date,
        to_date = req.body.to_date,
        limit = req.body.limit;


    var options = {
        from: from_date ? moment(from_date).valueOf() : "",
        until: to_date ?moment(to_date).valueOf() : "",
        limit: limit || 100,
        start: 0,
        order: 'desc',
        fields: ['timestamp','username' , 'message' , 'realname' , 'ip' ,'req']
    };

    //
    // Find items logged between today and yesterday.
    //
    loggerInstance.query(options || {}, function (err, results) {
        if (err) {
            res.status(400).json(err);
        } else {
            res.json(results);
        }
    });
});
module.exports = router