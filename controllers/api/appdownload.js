/*
* @Author: Derek Zhou
* @Date:   2017-02-13 13:27:08
* @Last Modified by:   Derek Zhou
* @Last Modified time: 2017-02-20 11:22:23
*/

var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    models = require('../../models'),
    redis = require('../../redis/redis-client');

router.post('/appdownload/save',function(req,res){
	console.log(JSON.parse(req.body.channel));
	var channel = JSON.parse(req.body.channel);
	models.appdownload.upsert({
		id: channel.id,
		urlKey: channel.urlKey,
		ios: channel.ios,
		android: channel.android,
		wechat: channel.wechat
	}).then(function(result){
		res.json({
			code: 1,
			msg: '保存成功',
		})
	}).catch(function(error){
		console.log('错误', error);
        res.json({
            code: 0,
            msg: '出错啦',
            data: error
        });
	})
})
router.post('/appdownload/del',function(req,res){
	console.log(JSON.parse(req.body.channel));
	var channel = JSON.parse(req.body.channel);
	models.appdownload.destroy({
		where:{
			urlKey: channel.urlKey
		}
	}).then(function(result){
		res.json({
			code: 1,
			msg: '删除成功',
		})
	}).catch(function(error){
		console.log('错误', error);
        res.json({
            code: 0,
            msg: '出错啦',
            data: error
        });
	})
})
router.get('/appdownload/list',function(req,res){
	models.appdownload.findAll({
	}).then(function(result){
		channelList = [];
		// var downloadList =;
		// console.log(result,'haha',result.dataValues);
		for(var i = 0; i < result.length; i ++){
			var channel = result[i].dataValues;
			channelList.push(channel);
		}
		console.log(channelList,'here');
		res.json({
            code: 1,
            msg: '获取成功',
            data: channelList
        });
	}).catch(function(error) {
        console.log('错误', error);
        res.json({
            code: 0,
            msg: '出错啦',
            data: error
        });
    })
})

module.exports = router;
