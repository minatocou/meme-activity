/**
 * Created by carina on 17/3/27.
 */
var express = require('express'),
    app = require('../../../app'),
    router = express.Router(),
    request = require('request'),
    models = require('../../../models'),
    hbs = require('hbs'),
    config = require('../../../utils/env'),
    helper = require('../../../helper/helper')(hbs),
    makeSign = require('../../../utils/sign');


router.get('/tools/convert/productid', function (req, res) {
    res.render('tools/convert/productid',{});
});

module.exports = router;