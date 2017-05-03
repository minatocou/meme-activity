/**
 * Created by Jesse on 16/9/14.
 */

var express = require('express'),
    router = express.Router();
var promise = require("bluebird");
var models = require('../../models');
var hbs = require('hbs');
var qs = require('querystring'),
    config = require('../../utils/env'),
    helper = require('../../helper/helper')(hbs);
var pageIndex;
var num = require('./common').num;
var pagesObj = require('./common').pagesObj;

router.get('/pc/cn/plist' , function(req, res){
    var user_id = req.session.user.userId;
    pageIndex = req.query.pageIndex || 1;
    var query = req.query;
    var obj = {type : 1 , department : 1};
    if (Object.keys(query).length != 0) {
        var str ;
        for (var k in req.query) {
            if(k!='pageIndex'&&req.query[k].trim()!=''){
                str = req.query[k]==undefined?'':req.query[k];
                obj[k] = {
                    $like:'%'+str+'%'
                }
            }
        }
    }
    delete query.pageIndex;
    models.Canvas.findAndCountAll({
        where:query&&obj,
        limit:num,
        order : 'updated_at DESC',
        offset:(pageIndex - 1) * num
    }).then(function (results) {
        var canvas = results;
        var total = canvas.count;
        res.render('list/pclist.html',{
            list:canvas.rows,
            pages: Math.ceil(total / num),
            k:new Date().getTime().toString(36),
            d:1,
            preview : config.preview,
            pagesObj:pagesObj(total)
        } );
    }).catch(function (error) {
        res.render('list/pclist.html',{
            list:[],
            k:new Date().getTime().toString(36),
            d:1
        } );
        console.log(error);
    });

})




router.get('/h5/cn/plist', function (req, res) {

    var user_id = req.session.user.userId;
    pageIndex = req.query.pageIndex || 1;
    var query = req.query;
    var obj = {type : 0,department : 1};
    if (Object.keys(query).length != 0) {
        var str ;
        for (var k in req.query) {
            if(k!='pageIndex'&&req.query[k].trim()!=''){
                str = req.query[k]==undefined?'':req.query[k];
                obj[k] = {
                    $like:'%'+str+'%'
                }
            }
        }
    }
    delete query.pageIndex;
    models.Canvas.findAndCountAll({
        where:query&&obj,
        limit:num,
        offset:(pageIndex - 1) * num,
        order : 'updated_at DESC'
    }).then(function (results) {
        var canvas = results;
        var total = canvas.count;
        res.render('list/h5list.html',{
            list:canvas.rows,
            pages: Math.ceil(total / num),
            k:new Date().getTime().toString(36),
            d:1,
            preview : config.preview,
            pagesObj:pagesObj(total)
        } );
    }).catch(function (error) {
        res.render('list/h5list.html',{
            list:[],
            k:new Date().getTime().toString(36),
            d:1
        } );
        console.log(error);
    });
    console.log(res.locals.roleAction)

});





module.exports = router;
