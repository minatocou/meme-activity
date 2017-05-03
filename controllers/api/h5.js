/**
 * Created by memebox on 16/9/18.
 */
var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    models = require('../../models'),
    uuid = require('node-uuid'),
    redis = require('../../redis/redis-client');

router.post('/h5/save', function (req, res) {
    var uid = req.session.user.userId;
    var uname = req.session.user.username;
    console.log(req.session.user)
    var p_cid = req.body.cid;
    var d = req.body.d ||1;
    var cid = p_cid || uuid.v4();
    var key = req.body.key || new Date().getTime().toString(36);
    var title = req.body.title;
    var state = req.body.state;
    var setting = req.body.setting;
    var stateCode =0;
    if( eval(state) ){
        stateCode = 1
    }

    redis.del('activity:'+key , function(err, result){
        console.log("err is " + err);
        console.log("result is " +result)
        models.Canvas.upsert({
            id: cid,
            urlKey: key,
            department :d ,
            lastOne: uname,
            title: title,
            setting: setting,
            state : stateCode
        }).then(function (result) {
            models.Canvas.findOne({
                where: {id: cid}
            }).then(function (results) {
                var canvas = results;
                if (!p_cid) {
                    canvas.setUserCanvas(uid);
                }
                res.json({msg:'保存成功',code:1});
                
            })
        }).catch(function (err) {
            console.log(err);
            res.json({msg:err,code:0});
        });
    });


});



/*
 列表删除
 */
router.get('/h5/list/remove', function (req, res) {
    var query = req.query,
        uname = req.session.user.username;
    models.Canvas.update({
        lastOne: uname,
        deleted_at : new Date()
    }, {
        where: {
            "id": query.id
        }

    }).then(function () {
        console.log('删除成功');
        res.json({
            code: 1,
            msg: '删除成功'
        });
    }).catch(function (error) {
        console.log('错误', error);
    })


});
/*
 开启关闭
 */
router.get('/h5/list/changeState', function (req, res) {
    var query = req.query;
    redis.del("activity:"+query.urlkey , function(err , result){
        if(!err){
            models.Canvas.update({
                state: query.state
            }, {
                where: {
                    id: query.id
                }
            }).then(function (result) {
                console.log('修改成功');
                res.json({
                    code: 1,
                    msg: '修改成功'
                });
            }).catch(function (error) {
                console.log('错误', error);
            });
        }else{
            console.log(err)
        }

    })

});
module.exports = router;