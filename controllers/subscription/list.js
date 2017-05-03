/**
 * Created by carina on 17/4/18.
 */

/**
 * Created by carina on 17/3/9.
 */

var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    models = require('../../models'),
    hbs = require('hbs'),
    config = require('../../utils/env'),
    helper = require('../../helper/helper')(hbs),
    makeSign = require('../../utils/sign');


router.get('/subscription/list', function (req, res) {
    res.render('subscription/list');
});

module.exports = router;