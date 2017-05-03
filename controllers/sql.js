/*
* @Author: Derek Zhou
* @Date:   2016-12-14 14:18:11
* @Last Modified by:   Derek Zhou
* @Last Modified time: 2016-12-14 15:56:05
*/

var express = require('express'),
    app = require('../app'),
    router = express.Router(),
    request = require('request');
var models = require('../models');

router.get('/sql/:table', function(req, res) {
	var tables = req.params.table;
	models[tables].sync().then(function () {
        res.send(tables + " create success")
    });
});

module.exports = router
