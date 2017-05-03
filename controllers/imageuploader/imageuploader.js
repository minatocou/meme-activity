/**
 * Created by curtis on 16/8/12.
 */
"use strict"
var express = require('express');
var router = express.Router();
var fs = require('fs');
var AWS = require('aws-sdk');
var async = require('async');
var multiparty = require('multiparty');
var uuid = require('node-uuid');
var sharp = require('sharp');
var config = require('../../utils/env');
AWS.config.update(config.upload.IMGCONFIG);
var s3Client = new AWS.S3();
//http://memebox-avatar-dev.s3-website.cn-north-1.amazonaws.com.cn/
var IMAGE_BUCKET = config.upload.BUCKET,
    IMAGE_DIR = config.upload.DIR,
    CALLURL = config.upload.CALLURL,
    PRIMARY=config.upload.PRIMARY;


var getKey = function (fileName,ext,bucker) {
    var now = new Date();
    var nowArray = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/');
    var uid = uuid.v4();
    var dir = bucker + '/' + nowArray + '/' + uid;
    dir += ext?  "."+ext : getFix(fileName);
    return dir;
}
var getFix= function (fileName) {
    var fix = fileName.match(/\.\b\w+$\b/);
    fix = fix && fix.length > 0 ? fix[0] : '';
    return fix;
}
var sendS3= function (bucker,buffer,key,type,callback) {
    s3Client.putObject({
        Bucket: IMAGE_BUCKET[bucker],
        Key: key,
        ACL: 'public-read',
        Body: buffer,
        ContentLength: buffer.length,
        ContentType:type,
        //Expires:now
    }, function (err, data) {
        if (err) {
            console.log(err);
            callback(2001,err);
        } else {
            callback(1,CALLURL[bucker] + key);
            //count++;
        }
    });
}

var sharpImg= function (res,file,type,max,size,bucker,callback) {
    if(/(?:gif)/.test(type)){
        var key = getKey(file.originalFilename,type.replace("image/",""),IMAGE_DIR[bucker]);
        // var now=new Date();
        // now.setMonth(now.getMonth()+1);
        fs.readFile(file.path,function (error,buffer){
            sendS3(bucker,buffer,key,type,callback)
        }) ;
    }else{
        var sp=sharp(file.path).sequentialRead().withoutAdaptiveFiltering();
        if(size!=PRIMARY){
            sp.resize(size).withoutEnlargement();
        }
        if(/(?:png)/.test(type)){
            sp.toFormat(sharp.format.png)
        }else{
            sp.toFormat(sharp.format.jpeg)
        }
        sp.toBuffer(function (err, buffer, info) {
            var key = getKey(file.originalFilename,info.format,IMAGE_DIR[bucker]);
            // var now=new Date();
            // now.setMonth(now.getMonth()+1);
            sendS3(bucker,buffer,key,type,callback)
        })
    }
}


var uploadImg = function (req, res, options) {
    options = options || {};
    var max = options.max || 1024;
    var size=options.size;
    var bucker=options.bucker;
    //autoFields: true,
    var rs = {code: 9001, msg: "未知错误,请重试"};
    var form = new multiparty.Form({autoFiles: true});
    form.parse(req, function (err, fields, files) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        let callbacks=[];
        let data={};
        try{
            for(let f=0;f<files.file.length;f++){
                if(fields.size[f]/1024 > max){
                    callbacks.push(function (callback){
                        callback(3001,"请上传"+max/1024+"M以下图片")
                    })
                }else{
                    for(let i=0;i<size.length;i++){
                        callbacks.push(function (callback){
                            sharpImg(res,files.file[f],fields.type[f],max,size[i],bucker,function (err,d) {
                                if(err==1) {
                                    err=f;
                                    data[size[i]]= d;
                                    d="上传成功";
                                }
                                callback(err,d)
                            });
                        })
                    }
                }
            }
            async.auto(callbacks,function (item,callback) {
                rs.code=item || 1;
                rs.msg=callback;
                rs.data=data;
                res.json(rs);
            })
        }catch (e){
            console.log('Error parsing form: ' + e);
            rs.msg=e;
            rs.code=8001;
            res.json(rs);
        }

    });
    // form.on('close', function (err) {
    // });
    form.on('error', function (err) {
        console.log('Error parsing form: ' + err.stack);
        rs.msg=err;
        res.json(rs);
    });
}

router.post('/head', function (req, res) {
    uploadImg(req, res, {max:1024,size:[PRIMARY,120],bucker:"img-avatar"})
})
router.post('/primary', function (req, res) {
    uploadImg(req, res, {max:1024,size:[PRIMARY],bucker:"img-avatar"})
});
router.post('/h5', function (req, res) {
    uploadImg(req, res, {max:1024,size:[PRIMARY,640],bucker:"img-avatar"})
});
router.post('/app', function (req, res) {
    uploadImg(req, res, {max:10240,size:[PRIMARY,750],bucker:"img-avatar"})
});
router.post('/video', function (req, res) {
    uploadImg(req, res, {max:10240,size:[PRIMARY,750],bucker:"img-avatar"})
});
router.post('/live', function (req, res) {
    uploadImg(req, res, {max:10240,size:[PRIMARY,750],bucker:"img-avatar"})
});
router.post('/full', function (req, res) {
    uploadImg(req, res, {max:5120,size:[PRIMARY,750],bucker:"img-avatar"})
});


module.exports = router;