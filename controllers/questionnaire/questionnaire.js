/**
 * Created by Leo.Wang on 17/2/13.
 */

var express = require('express'),
    router = express.Router();
var hbs = require('hbs');
var qs = require('querystring'),
    config = require('../../utils/env'),
    helper = require('../../helper/helper')(hbs);

router.get('/questionnaire/cn/user-property-list', function(req, res){
    res.render('questionnaire/user-property-list.html',{
        list:[],
        k:new Date().getTime().toString(36),
    });
});
router.get('/questionnaire/cn/question-manage', function(req, res){
    res.render('questionnaire/question-manage.html',{
        list:[],
        k:new Date().getTime().toString(36),
    });
});
router.get('/questionnaire/cn/create-question', function(req, res){
    res.render('questionnaire/create-question.html',{
        list:[],
        k:new Date().getTime().toString(36),
    });
});
router.get('/questionnaire/cn/query-question-data', function(req, res){
    res.render('questionnaire/query-question-data.html',{
        list:[],
        k:new Date().getTime().toString(36),
    });
});
router.get('/questionnaire/cn/tag-category-list', function(req, res){
    res.render('questionnaire/tag-category-list.html',{
        list:[],
        k:new Date().getTime().toString(36),
    });
});

module.exports = router;