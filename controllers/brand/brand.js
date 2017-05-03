/**
 * Created by yate on 2017/2/28.
 */
var express = require('express'),
    app = require('../../app'),

    router = express.Router();

router.get('/brand/brandInfo', function (req, res) {
    res.render('brand/brandInfo');
});

module.exports = router;