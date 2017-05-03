/**
 * Created by carina on 17/2/8.
 */
var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    models = require('../../models'),
    hbs = require('hbs'),
    config = require('../../utils/env'),
    helper = require('../../helper/helper')(hbs),
    makeSign = require('../../utils/sign');

router.get('/app/cn/list', function (req, res) {
    var domain = config.magento.domain;
    var data,
        homeData = [];
    //var url = domain+'/sas/page/list';
    request( { url : domain+'/sas/page/list' , headers : {signature:makeSign()}}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                data = JSON.parse(body).data;
                for(var i=0; i<data.length; i++){
                    if(data[i]["type"] != "226" && data[i]["type"] != "224" && data[i]["type"] != "228" && data[i]["type"] != "227"){
                        homeData.push(data[i]);
                    }
                }
                res.render('app/list',{listData:homeData});

            } catch (e) {
                console.log(e); //error in the above string(in this case,yes)!
            }
        }
    });


});

module.exports = router;