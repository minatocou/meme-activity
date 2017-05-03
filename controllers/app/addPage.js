/**
 * Created by carina on 17/2/8.
 */
var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    models = require('../../models'),
    hbs = require('hbs'),
    
    helper = require('../../helper/helper')(hbs);


router.get('/app/cn/addPage', function (req, res) {
    res.render('app/addPage');

});

module.exports = router;