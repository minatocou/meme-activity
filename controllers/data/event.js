/**
 * Created by memebox on 17/3/15.
 */
var express = require('express'),
    config = require('../../utils/env'),
    redshift = require('../../redshift'),
    router = express.Router(),
    request = require('request');


function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}

router.get('/event', function (req, res) {
    res.render('data/event');
});

router.post('/event/search', function (req, res) {
    var category = req.body.category,
        event_name = req.body.event_name,
        group_name = req.body.group_name,
        description = req.body.description,
        limit = req.body.limit;
    var obj = {}

    if (category) {
        obj.category = category
    }
    if (event_name) {
        obj.event_name = event_name
    }
    if (group_name) {
        obj.group_name = group_name
    }
    if (description) {
        obj.description = description
    }
    if(!isEmptyObject(obj)){
        redshift.EventCategory.findAll({
            order : 'event_name',
            limit:limit || 5000,
            where: obj
        }).then(function (results) {
            res.json(results);
        }).catch(function () {
        })
    } else {
        redshift.EventCategory.findAll({
            limit:5000,
            order : 'event_name',
        }).then(function (results) {
            res.json(results);
        }).catch(function () {
        })
    }
});

router.post('/event/addEvent', function (req, res) {
    var category = req.body.category,
        event_name = req.body.event_name,
        group_name = req.body.group_name,
        description = req.body.description;
    if(event_name){
        redshift.EventCategory.findOne({
            where: {
                event_name:event_name
            }
        }).then(function (results) {
            if(!results || results.length<=0){
                redshift.EventCategory.create({
                    category: category,
                    event_name: event_name,
                    group_name: group_name,
                    description: description,
                },{returning:false}).then(function(result) {
                    res.json(result);
                }).catch(function(err,msg) {
                    console.log(err)
                    res.json({code:0,err:err});
                })
            }else{
                res.json({code:0,err:'事件'+event_name+',已存在'});
            }
        }).catch(function (err,msg) {
            console.log(err)
            res.json({code:0,err:err});
        })
    }else{
        res.json({code:0,err:'请输入事件名'});
    }

});
router.post('/event/removeEvent', function (req, res) {
    var category = req.body.category,
        event_name = req.body.event_name,
        group_name = req.body.group_name;
    if(category && event_name && group_name){
        redshift.EventMapping.destroy({
            where:{
                event_name: event_name,
            },
            force:true
        },{returning:false}).then(function(result) {
            redshift.EventCategory.destroy({
                where:{
                    category: category,
                    event_name: event_name,
                    group_name: group_name,
                },
                force:true
            },{returning:false}).then(function(result) {
                res.json(result);
            }).catch(function(err,msg) {
                console.log(err)
                res.json({code:0,err:err});
            })
        }).catch(function(err,msg) {
            console.log(err)
            res.json({code:0,err:err});
        })



    }else{
        res.json({code:0,err:'请输入完整'});
    }

});



router.post('/event/addMapping', function (req, res) {
    var preproty = req.body.preproty,
        event_name = req.body.event_name,
        mapping = req.body.mapping,
        description = req.body.description;
    if(event_name && mapping && preproty){
        redshift.EventMapping.findOne({
            where: {
                event_name:event_name,
                preproty:preproty,
                mapping:mapping
            }
        }).then(function (results) {
            if(!results || results.length<=0){
                redshift.EventMapping.create({
                    preproty: preproty,
                    event_name: event_name,
                    mapping: mapping,
                    description: description,
                },{returning:false}).then(function(result) {
                    res.json(result);
                }).catch(function(err,msg) {
                    console.log(err)
                    res.json({code:0,err:err});
                })
            }else{
                res.json({code:0,err:'事件、属性、扩展字段重复'});
            }
        }).catch(function (err,msg) {
            console.log(err)
            res.json({code:0,err:err});
        })
    }else{
        res.json({code:0,err:'请输入完整'});
    }

});


router.post('/event/removeMapping', function (req, res) {
    var preproty = req.body.preproty,
        event_name = req.body.event_name,
        mapping = req.body.mapping;
    if(event_name && mapping && preproty){
        redshift.EventMapping.destroy({
            where:{
                preproty: preproty,
                event_name: event_name,
                mapping: mapping,
            },
            force:true
        },{returning:false}).then(function(result) {
            res.json(result);
        }).catch(function(err,msg) {
            console.log(err)
            res.json({code:0,err:err});
        })
    }else{
        res.json({code:0,err:'请输入完整'});
    }

});

router.get('/event/mapping', function (req, res) {
    res.render('data/mapping');
});

router.post('/event/mapping', function (req, res) {
    var preproty = req.body.preproty,
        event_name = req.body.event_name,
        description = req.body.description,
        mapping = req.body.mapping,
        limit = req.body.limit;

    var obj = {}

    if (preproty) {
        obj.preproty = preproty
    }
    if (event_name) {
        obj.event_name = event_name
    }
    if (mapping) {
        obj.mapping = mapping
    }
    if (description) {
        obj.description = description
    }
    console.log(obj);
    if(!isEmptyObject(obj)){
        redshift.EventMapping.findAll({
            limit:limit || 5000,
            order : 'event_name',
            where: obj
        }).then(function (results) {
            res.json(results);
        }).catch(function (err) {
            res.json({code:0,err:err});
        })
    } else {
        redshift.EventMapping.findAll({
            limit:5000,
            order : 'event_name',
        }).then(function (results) {
            res.json(results);
        }).catch(function (err) {
            res.json({code:0,err:err});
        })
    }
});
module.exports = router