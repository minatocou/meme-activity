var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    models = require('../../models'),
    hbs = require('hbs'),
    config = require('../../utils/env'),
    helper = require('../../helper/helper')(hbs),
    makeSign = require('../../utils/sign');

router.get('/brand/brandInfo', function (req, res) {
    var domain = config.magento.domain;
    var data,
        brandData = [];
    request( { url : domain+'/sas/page/list' , headers : {signature:makeSign()}}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                data = JSON.parse(body).data;
                for(var i=0; i<data.length; i++){
                    if(data[i]["type"] == "226" || data[i]["type"] == "224" || data[i]["type"] == "228" || data[i]["type"] == "227"){
                        brandData.push(data[i]);
                    }
                }
                res.render('brand/brandInfo', {brandList: brandData});
            } catch (e) {
                console.log(e); //error in the above string(in this case,yes)!
            }
        }
    })
});

router.get('/app/brand/:id/:brand', function (req, res) {
    var pageId = req.params.id;
    var brandId = req.params.brand;
    var domain = config.magento.domain;
    var signData={
        pageId:pageId
    };
    var data,
        brandData;
    request({url: domain+'/sas/pagewidget/edit?pageId='+pageId, headers : {signature:makeSign(signData)}}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                data = JSON.parse(body);
                if(data.code == 1){
                    var field  = data['data']['field'];
                    if(field || field.length==0){
                        var brandInitData = {
                            type: "brandhome",
                            data: []
                        };

                        field.unshift(brandInitData);
                        data['data']['field']=field;
                        data['data']['pageId']=pageId;
                        data['data']['brandId']=brandId;
                    }
                    res.render('app/brand',{setting:data['data']});
                }else{
                    var field  = [];
                    var brandInitData = {
                        type: "brandhome",
                        data: []
                    };

                    field.push(brandInitData);
                    data['data']['field']=field;
                    data['data']['pageId']=pageId;
                    data['data']['brandId']=brandId;
                    res.render('app/brand',{setting:data['data']});
                }
            } catch (e) {
                console.log(e);
            }
        }
    });

});

module.exports = router;