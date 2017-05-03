/**
 * Created by carina on 17/3/27.
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


router.get('/live/list', function (req, res) {
    var domain = config.magento.domain;
    var data;
    var reqUrl = req.url;
    var key = reqUrl.split('?')[1];
    var queryKey;
    if(key){
        queryKey = '?'+key;
    }else{
        queryKey = '';
    }

    var searchInput ={
        page:req.query.page||''
    };

    request( { url : domain+'/sas/live/list'+queryKey , headers : {signature:makeSign(searchInput)}}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                data = JSON.parse(body);
                console.log(data);
                data['pageSize']=10;
                res.render('live/list',{listData:data});

            } catch (e) {
                console.log(e); //error in the above string(in this case,yes)!
            }
        }
    });

});

module.exports = router;