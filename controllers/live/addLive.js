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

router.get('/live/add', function (req, res) {
    res.render('live/addlive');
});

router.get('/live/edit/:liveRoomId', function (req, res) {
    var liveRoomId = req.params.liveRoomId;
    var domain = config.magento.domain;
    var signData={
        liveRoomId:liveRoomId
    };

    request({url: domain+'/sas/live/detail?liveRoomId='+liveRoomId, headers : {signature:makeSign(signData)}}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                var data = JSON.parse(body);
                var liveData = data.data;
                res.render('live/addlive', {
                    liveData:liveData,
                });

            } catch (e) {
                console.log(e); //error in the above string(in this case,yes)!
            }
        }
    });
    
});

module.exports = router;