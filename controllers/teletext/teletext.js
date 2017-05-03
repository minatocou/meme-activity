/**
 * Created by yate on 2017/3/13.
 */
var express = require('express'),
    config = require('../../utils/env'),
    request = require('request'),
    makeSign = require('../../utils/sign'),
    models = require('../../models'),
    router = express.Router();

router.get('/teletext/list', function (req, res) {
    res.render('teletext/teletextList', {
        preview : config.preview
    });
});

//新建(或编辑)图文页面
router.get('/teletext/panel', function (req, res) {
    var teleId = req.query.id ? req.query.id:"",      /* null-新建图文页面； 1-编辑图文页面 */
        backObj = {
            preview : config.preview
        };
    res.render('teletext/teletextPanel', backObj);

    /*if(teleId){
        var domain = config.magento.domain;
        var options = {
            url: domain+'/sas/ImageText/detail?id='+teleId,
            headers: {
                signature: makeSign()
            }
        };
        //获取图文详情
        request(options, function (error, response, body){
            if (!error && response.statusCode == 200){
                try{
                    var sourceData = JSON.parse(body);
                    if(sourceData.code == 1 && sourceData.data.length){
                        backObj.data = sourceData.data;
                    }else{
                        console.log("出现异常");
                    }
                }catch (e){
                    console.error(e);
                }finally {
                    res.render('teletext/teletextPanel', backObj);
                }
            }else{
                console.error(error);
            }
        });
    }else{
        res.render('teletext/teletextPanel', backObj);
    }*/

});

module.exports = router;