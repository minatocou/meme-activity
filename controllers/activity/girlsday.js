var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request');
var models = require('../../models');


router.get('/activity/girlsday', function(req, res) {
    res.render('activity/girlsday');
});
module.exports = router;
