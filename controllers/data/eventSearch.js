/*
* @Author: Derek
* @Date:   2017-04-11 22:55:11
* @Last Modified by:   Derek
* @Last Modified time: 2017-04-17 16:24:23
*/

var express = require('express'),
    config = require('../../utils/env'),
    redshift = require('../../redshift'),
    router = express.Router(),
    redis = require('../../redis/redis-client'),
    request = require('request');

var eventALL = config.redshift.eventAllTableName || 'preprod_event_report_all';
var mapping = config.redshift.mappingTableName || 'preprod_event_mapping';

router.get('/eventSearch', function (req, res) {
    res.render('data/eventSearch');
});

router.post('/eventSearch/getClient', function(req, res) {
    // var event_name = 'search_to_brand_ck';
    redis.get('client_version', function (err, result){
        if(err){
            res.json({
                code: 0,
                msg: '获取失败',
                err: err
            })
        }
        else{
            if(!result){
                redshift.sequelize.query("select distinct(client_version) from " + eventALL + " order by client_version desc").then(function(data){
                    redis.set('client_version', JSON.stringify(data[0]), function(err2, reply){
                        if (err2) {
                            console.log(err2);
                        } else {
                            console.log(reply);
                        }
                    })
                    res.json({
                        code: 1,
                        msg: '获取成功',
                        data: data[0]
                    })
                })
            }
            else{
                res.json({
                    code: 1,
                    msg: '获取成功',
                    data: JSON.parse(result)
                })
            }
        }
    })
});

router.post('/eventSearch/getProperty', function(req, res) {
    var event_name = req.body.event_name;
    // var event_name = 'search_to_brand_ck';
    redis.get(event_name, function (err, result){
        if(err){
            res.json({
                code: 0,
                msg: '获取失败',
                err: err
            })
        }
        else{
            if(!result){
                redshift.sequelize.query("select description,mapping from " + mapping + " where event_name = '" + event_name + "'").then(function(data){
                    redis.set(event_name, JSON.stringify(data[0]), function(err2, reply){
                        if (err2) {
                            console.log(err2);
                        } else {
                            console.log(reply);
                        }
                    })
                    res.json({
                        code: 1,
                        msg: '获取成功',
                        data: data[0]
                    })
                })
            }
            else{
                res.json({
                    code: 1,
                    msg: '获取成功',
                    data: JSON.parse(result)
                })
            }
        }
    })
});



router.post('/eventSearch/associate', function (req, res){
    var snap = req.body.snap;
    var key = 'associate_snap_' + snap;
    // snap = 'brand';
    redis.get(key, function (err, result){
        if(err){
            res.json({
                code: 0,
                msg: '获取失败',
                err: err
            })
        }
        else{
            if(!result){
                redshift.sequelize.query("select distinct(event_name) from " + mapping + "  where event_name like '%" + snap + "%';").then(function(data){
                    redis.set(key, JSON.stringify(data[0]), function(err2, reply){
                        if (err2) {
                            console.log(err2);
                        } else {
                            console.log(reply);
                        }
                    })
                    res.json({
                        code: 1,
                        msg: '获取成功',
                        data: data[0]
                    })
                })
            }
            else{
                console.log(result);
                 res.json({
                    code: 1,
                    msg: '获取成功',
                    data: JSON.parse(result)
                })
            }
        }
    })
})

router.post('/eventSearch/ssr', function (req, res) {
    var dateFrom = req.body.dateFrom,
        dateTo = req.body.dateTo,
        client_version = req.body.client_version,
        channel = req.body.channel,
        platform = req.body.platform,
        event_name = req.body.event_name,
        property = req.body.property;

    var main = "select count(*),date(system_time) from " + eventALL + " where date(created_time) >= '" + dateFrom + "' and date(created_time) <= '" + dateTo + "' ";

    var cli = '', cha = '', plt = '', eve = '', pro = [];
    if(client_version.length > 0){
        cli = " and client_version in ('" + client_version + "') ";
    }
    if(channel){
        cha = " and channel like '%" + channel + "%' ";
    }
    if(platform){
        plt = " and platform in ('" + platform + "') ";
    }
    if(event_name){
        eve = " and event_name = '" + event_name + "' ";
    }
    property = JSON.parse(property);
    if(property.length > 0){
        property.forEach(function(proitem,index){
            if(proitem.opt == 'eq'){
                pro[index] = " and " + proitem.preproty + " ='" + proitem.val + "' ";
            }
            else if(proitem.opt == 'like'){
                pro[index] = " and " + proitem.preproty + " like'%" + proitem.val + "%' ";
            }
            else if(proitem.opt == 'noteq'){
                pro[index] = " and " + proitem.preproty + " !='" + proitem.val + "' ";
            }
        })
        pro = pro.join('');
    }
    else{
        pro = pro.toString();
    }
    main = main + cli + cha + plt + eve + pro + ' group by date(system_time) order by date(system_time) desc;';
    redshift.sequelize.query(main).then(function(data){
        res.json({
            code: 1,
            msg: '获取成功',
            sql: main,
            data: data[0],
        })
    })
})

module.exports = router
