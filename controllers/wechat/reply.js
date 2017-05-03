/*
* @Author: Derek Zhou
* @Date:   2016-12-14 10:55:46
* @Last Modified by:   Derek Zhou
* @Last Modified time: 2016-12-22 17:50:26
*/

var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request');
var models = require('../../models');
var hbs = require('hbs');


router.get('/wechat/reply', function(req, res) {
    res.render('wechat/reply');
})


module.exports = router
