/**
 * Created by carina on 17/3/9.
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


router.get('/video/list', function (req, res) {
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
        title:req.query.title||'',
        status:req.query.status||'',
        operator:req.query.operator||'',
        video_id:req.query.video_id||'',
        page:req.query.page||''
    };

    request( { url : domain+'/sas/video/list'+queryKey , headers : {signature:makeSign(searchInput)}}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                data = JSON.parse(body);
                console.log(data);
                data['pageSize']=10;
                res.render('video/list',{searchData:searchInput,listData:data});

            } catch (e) {
                console.log(e); //error in the above string(in this case,yes)!
            }
        }
    });
});

module.exports = router;