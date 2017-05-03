/**
 * Created by Leo.Wang on 16/12/12.
 */

var express = require('express'),
    router = express.Router();
var promise = require("bluebird");
var models = require('../../models');
var hbs = require('hbs');
var qs = require('querystring'),
    
    helper = require('../../helper/helper')(hbs);
var pageIndex;
var num = require('./common').num;
var pagesObj = require('./common').pagesObj;


router.get('/gift/cn/base' , function(req, res){
	res.render('gift/giftBaseData.html',{
            list:[],
            k:new Date().getTime().toString(36),
            activeTag: 1
        } );
    var user_id = req.session.user.userId;

});

module.exports = router;