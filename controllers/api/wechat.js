/*
 * @Author: Derek Zhou
 * @Date:   2016-11-22 18:06:03
 * @Last Modified by:   Derek Zhou
 * @Last Modified time: 2017-02-08 23:02:38
 */

var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    models = require('../../models'),
    uuid = require('node-uuid'),
    redis = require('../../redis/redis-client'),
    config = require('../../utils/env');

//test api to get wechat settings
router.get('/wechat/test', function(req, res) {
    var url = req.query.url;
    var type = req.query.type;
    request.post(config.magento.domain + '/h5/mp/index', {
        form: {
            url: url,
            sign: 'df063bf27ebcde703a0a6c27bddd63ae',
            body: JSON.stringify({
            }),
            type: type
        }
    }, function(error, httpResponse, body) {
        if (body) {
            // redis.set('wechat_material', body, function(err2, reply) {
            //     if (err2) {
            //         console.log(err2);
            //     } else {
            //         console.log(reply);
            //     }
            // })
            res.json({
                code: 1,
                msg: '获取成功',
                data: JSON.parse(body)
            })
        } else {
            res.json({
                code: 0,
                msg: '获取失败',
                err: error
            })
        }
    })
})
// turing test
router.get('/wechat/turing', function(req, res) {
    request.post('http://www.tuling123.com/openapi/api', {
        form: {
            key: '63b4e9ec46de4d82b9b8f74c2252256a',
            info: '你好',
            userid: '12312'
        }
    }, function(error, httpResponse, body) {
        if (body) {
            console.log(body);
            res.json({
                code: 1,
                msg: '获取成功',
                data: JSON.parse(body)
            })
        } else {
            res.json({
                code: 0,
                msg: '获取失败',
                err: error
            })
        }
    })
})
//获取素材总数
var materialNum = {};
router.get('/wechat/offac/materialCount', function(req, res) {
    request.post(config.magento.domain + '/h5/mp/index', {
        form: {
            url: 'https://api.weixin.qq.com/cgi-bin/material/get_materialcount',
            sign: 'df063bf27ebcde703a0a6c27bddd63ae',
            body: JSON.stringify({
            }),
            type: 'get'
        }
    }, function(error, httpResponse, body) {
        if (body) {
            try{
                materialNum = JSON.parse(body);
                body = JSON.parse(body);
            }catch(e){
                console.error(e);
            }
            res.json({
                code: 1,
                msg: '获取成功',
                data: body
            })
        } else {
            res.json({
                code: 0,
                msg: '获取失败',
                err: error
            })
        }
    });
})

//获取素材列表
router.get('/wechat/offac/material', function(req, res) {
    var types = req.query.type;
    var pageSize = req.query.pageSize || 10;
    var pageIndex = req.query.pageIndex || 1;
    console.log(pageSize,pageIndex);
    var type_key = types + '_count';
    var count = materialNum[type_key];

    console.log(materialNum,types,materialNum[types]);
    request.post(config.magento.domain + '/h5/mp/index', {
        form: {
            url: 'https://api.weixin.qq.com/cgi-bin/material/batchget_material',
            sign: 'df063bf27ebcde703a0a6c27bddd63ae',
            body: JSON.stringify({
                "type": types,
                "offset": (pageIndex-1)*pageSize,
                "count": pageSize
            }),
            type: 'post'
        }
    }, function(error, httpResponse, body) {
        if (body) {
            try {
                body = JSON.parse(body);
            }catch (e){
                console.error(e.message);
            }
            res.json({
                code: 1,
                msg: '获取成功',
                data: body
            })
        } else {
            res.json({
                code: 0,
                msg: '获取失败',
                err: error
            })
        }
    });
})

// 自定义菜单查询
router.get('/wechat/offac/getmenu', function(req, res) {
    request.post(config.magento.domain + '/h5/mp/index', {
        form: {
            url: 'https://api.weixin.qq.com/cgi-bin/menu/get',
            sign: 'df063bf27ebcde703a0a6c27bddd63ae',
            type: 'get'
        }
    }, function(error, httpResponse, body) {
        if (error) {
            console.log(error);
        } else {
            res.json({
                code: 1,
                msg: '获取成功',
                data: body
            })
        }
    })
})

//自定义菜单创建，保存数据库
router.post('/wechat/offac/update', function(req, res) {
    var id = req.body.id;
    var setting = req.body.setting;
    var psetting = req.body.psetting;
    console.log(psetting, 'my setting');
    request.post(config.magento.domain + '/h5/mp/index', {
        form: {
            url: 'https://api.weixin.qq.com/cgi-bin/menu/create',
            sign: 'df063bf27ebcde703a0a6c27bddd63ae',
            // body: JSON.stringify({"media_id":"jtlr8w8z7sU26T3p-tv65Ha2UISZKenqWPanBbXDXOU"})
            body: psetting,
            type: 'post'
        }
    }, function(error, httpResponse, body) {
        if (error) {
            console.log(error);
            res.json({
                code: 0,
                msg: error
            })
        } else {
            console.log(body, 'return from wechat');
            models.wechatMenu.upsert({
                setting: setting,
                id: id
            }).then(function(result) {
                res.json({
                    code: 1,
                    msg: '发布成功'
                });
            }).catch(function(err) {
                console.log('error', err);
            })
        }
    });
});

//从数据库获取自定义菜单设置
router.get('/wechat/offac', function(req, res) {
    var id = req.query.id;
    models.wechatMenu.findOne({
        where: {
            id: 1
        }
    }).then(function(result) {
        var settings = result.dataValues.setting;
        res.json({
            code: 1,
            msg: '获取成功',
            data: settings
        });
    }).catch(function(error) {
        console.log('错误', error);
    })
})


//获取自动回复规则
router.get('/wechat/getReply', function(req, res) {
    models.wechatMsg.findAll({}).then(function(result) {
        rule = {};
        rule.key_match = [];
        rule.key_unmatch = [];
        rule.subscribe = [];
        for (var i = 0; i < result.length; i++) {
            werule = result[i].dataValues;
            werule.keyword = JSON.parse(werule.keyword);
            werule.reply_content = JSON.parse(werule.reply_content);
            switch (werule.reply_type) {
                case 1:
                    rule.key_match.push(werule);
                    break;
                case 2:
                    rule.key_unmatch.push(werule);
                    break;
                case 3:
                    rule.subscribe.push(werule);
                    break;
                default:
                    break;
            }
        }
        res.json({
            code: 1,
            msg: '获取成功',
            data: rule
        });
    }).catch(function(err) {
        console.log(err);
        res.json({
            code: 0,
            msg: err,
        })
    })
})

//防盗链解决
router.get('/wechat/getImg', function(req,res){
    var url = req.query.url;
    // var options = {
    //     url: url,
    //     headers: {
    //         'host': 'mmbiz.qlogo.cn',
    //     }
    // };
    console.log(url,'url')
    if(url && url!='undefined'){
        console.log(1);
        request.get(url).pipe(res);
    }else{
        console.log(2);
        res.json({
            msg:'url为空',
            code:0
        })
    }

})
router.post('/wechat/reply/del',function(req,res){
    rule = JSON.parse(req.body.key_match);
    var delId = rule.id;
    console.log(delId,rule,'hello');
    models.wechatMsg.destroy({
        where:{
            id:delId
        }
    }).then(function(result) {
        console.log(result);
    }).catch(function(err) {
        console.log(err, 'err');
    })
    res.json({
        msg: '删除成功',
        code: 1
    })
})
//保存自动回复规则
router.post('/wechat/reply/save', function(req, res) {
    rule = req.body;
    console.log(rule,'rule');
    var reply_on = rule.reply_on;
    //关键字
    // console.log(rule.key_match,'rule.key_match')
    if (rule.key_match) {
        try {
            rule.key_match=JSON.parse(rule.key_match);
        }catch(e){
            console.error('parse json error');
        }
        var keywords = rule.key_match;
        for (var i = 0; i < keywords.length; i++) {
            var rule_id = keywords[i].rule_id;
            var title = keywords[i].title;
            var keyword = JSON.stringify(keywords[i].keyword);
            var reply_rule = keywords[i].reply_rule;
            var reply = JSON.stringify(keywords[i].reply_content);
            models.wechatMsg.upsert({
                rule_id: rule_id,
                title: title,
                keyword: keyword,
                reply_content: reply,
                reply_type: 1,
                reply_on: reply_on
            }).then(function(result) {
                console.log(result);
            }).catch(function(err) {
                console.log(err, 'err');
            })
        }
    }
    //自动回复
    if (rule.key_unmatch) {
        var unmatch = JSON.parse(rule.key_unmatch);
        models.wechatMsg.upsert({
            rule_id: unmatch.rule_id,
            title: '消息回复',
            reply_content: JSON.stringify(unmatch.reply_content),
            reply_type: 2,
            reply_on: reply_on
        }).then(function(result) {
            console.log(result);
        }).catch(function(err) {
            console.log(err, 'err');
        })
    }
    //被添加自动回复
    if (rule.subscribe) {
        var subscribe = JSON.parse(rule.subscribe);
        models.wechatMsg.upsert({
            rule_id: subscribe.rule_id,
            title: '被添加回复',
            reply_content: JSON.stringify(subscribe.reply_content),
            reply_type: 3,
            reply_on: reply_on
        }).then(function(result) {
            console.log(result);
        }).catch(function(err) {
            console.log(err, 'err');
        })
    }
    res.json({
        msg: '保存成功',
        code: 1
    })
})

module.exports = router;
