/**
 * Created by carina on 17/3/16.
 */
var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    models = require('../../models'),
    hbs = require('hbs'),
    config = require('../../utils/env'),
    helper = require('../../helper/helper')(hbs),
    qiniu = require("qiniu");


qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;

var clearString= function (s){
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs+s.substr(i, 1).replace(pattern, '');
    }
    return rs;
};

var getYearMonthDay = function(){
    var time = new Date();
    var year  =time.getFullYear();
    var month = (time.getMonth()+1)<10 ? "0" +(time.getMonth()+1):(time.getMonth()+1);
    var day = time.getDate()<10 ? "0" +time.getDate():time.getDate();

    return year+month+day;
};

router.get('/qiniu/uptoken', function (req, res) {
    var category = req.query.category;
    
    var file_name = req.query.file_name;
    var fileProcess = file_name.substring(0,file_name.lastIndexOf('.'))
    var fileSub = fileProcess.replace(/\s/g,'');
    var file = clearString(fileSub);
    var date = getYearMonthDay();

    var imgkey = config.qiniu.qiniuFileHeader + '_'+date+'_' +category + '_'+file+'_firstFrame_' +'.jpg';
    var videokey = config.qiniu.qiniuFileHeader +'_'+date+'_' +category + '_'+file+'_compress_'+'.mp4';

    var imgName =  qiniu.util.urlsafeBase64Encode(config.qiniu.Bucket_Name+":"+imgkey);
    var videoName = qiniu.util.urlsafeBase64Encode(config.qiniu.Bucket_Name+":"+videokey);

    var uptoken = new qiniu.rs.PutPolicy2({
        'scope':config.qiniu.Bucket_Name,
        //'persistentOps':"vframe/jpg/offset/0|saveas/"+imgName+";avthumb/mp4/acodec/libfaac/vcodec/libx264/vb/1.25m/ab/256k/autoscale/1/s/1280x720|saveas/"+videoName,
        'persistentOps':"vframe/jpg/offset/0|saveas/"+imgName+";avthumb/mp4/ab/160k/ar/44100/acodec/libfaac/r/30/vb/2400k/vcodec/libx264/s/1280x720/autoscale/1/stripmeta/0|saveas/"+videoName,
        //'persistentOps':"vframe/jpg/offset/0|saveas/"+imgName+";avthumb/m3u8/segtime/10/ab/128k/ar/44100/acodec/libfaac/r/30/vb/1000k/vcodec/libx264/stripmeta/0|saveas/"+videoName,
        'persistentPipeline':config.qiniu.persistentPipeline,
    });

    var token = uptoken.token();

    var data = {
        code:'1',
        msg:'token获取成功',
        uptoken:token
    };

    res.json(data);

});


router.use('/qiniu/prefop', function (req, res) {
    var persistentId = req.query.id;

    request({url: 'http://api.qiniu.com/status/get/prefop?id='+persistentId}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                res.send(body);
            } catch (e) {
                console.log(e); //error in the above string(in this case,yes)!
            }
        }
    });
});

module.exports = router;
