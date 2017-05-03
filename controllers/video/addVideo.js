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

router.get('/video/add', function (req, res) {
    res.render('video/addvideo', {
        domain: config.qiniu.Domain,
        qiniuFileHeader:config.qiniu.qiniuFileHeader
    });
});

router.get('/video/add/:id', function (req, res) {
    var videoid = req.params.id;
    var domain = config.magento.domain;
    var signData={
        video_id:videoid
    };

    request({url: domain+'/sas/video/edit?video_id='+videoid, headers : {signature:makeSign(signData)}}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                var data = JSON.parse(body);
                var videoData = data.data;
                res.render('video/addvideo', {
                    domain: config.qiniu.Domain,
                    videoData:videoData,
                    qiniuFileHeader:config.qiniu.qiniuFileHeader
                });

            } catch (e) {
                console.log(e); //error in the above string(in this case,yes)!
            }
        }
    });



});

module.exports = router;