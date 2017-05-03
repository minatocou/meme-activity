/*
 * @Author: Derek Zhou
 * @Date:   2016-11-22 15:29:24
 * @Last Modified by:   Derek Zhou
 * @Last Modified time: 2016-11-30 17:55:15
 */

var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request');
var models = require('../../models');
var hbs = require('hbs');


router.get('/wechat/offac', function(req, res) {
    res.render('wechat/offac');
})
hbs.registerHelper('material-helper', function(options) {
    return options.fn();
})
module.exports = router
