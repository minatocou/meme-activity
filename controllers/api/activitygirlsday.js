
var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    models = require('../../models'),
    redis = require('../../redis/redis-client');

router.post('/activitygirlsday/save',function(req,res){
	console.log(JSON.parse(req.body.product));
	var product = JSON.parse(req.body.product);
	models.girlsday.upsert({
		id: product.id,
		sku: product.sku,
		productId: product.productId,
		link: product.link,
		name: product.name,
		desc: product.desc
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
router.post('/activitygirlsday/del',function(req,res){
	console.log(JSON.parse(req.body.product));
	var product = JSON.parse(req.body.product);
	models.girlsday.destroy({
		where:{
			productId: product.productId
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
router.get('/activitygirlsday/list',function(req,res){
	models.girlsday.findAll({
	}).then(function(result){
		productList = [];
		// var downloadList =;
		// console.log(result,'haha',result.dataValues);
		for(var i = 0; i < result.length; i ++){
			var product = result[i].dataValues;
			productList.push(product);
		}
		console.log(productList,'here');
		res.json({
            code: 1,
            msg: '获取成功',
            data:productList 
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
