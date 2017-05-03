/*
* @Author: Derek Zhou
* @Date:   2017-02-13 13:11:47
* @Last Modified by:   Derek Zhou
* @Last Modified time: 2017-02-13 18:59:43
*/
var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request');
var models = require('../../models');


router.get('/app/download', function(req, res) {
    res.render('app/download');
});
module.exports = router;
