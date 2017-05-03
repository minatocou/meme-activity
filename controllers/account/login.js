/**
 * Created by memebox on 16/6/12.
 */
var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    models = require('../../models'),
    mysql = require('mysql'),
    request = require('request'),
    md5 = require("../../utils/md5");


router.route('/login')
    .get(function (req, res) {
        if(req.session.user){
            res.redirect('/');
        }
        else{
            res.render('account/login');
        }
    })
    .post(function (req, res) {
        var username = req.body.username;
        var pass = req.body.password;
        req.session.localize = req.body.option || 'zh_cn';
        

        models.User.findOne({
            where : {
                username : username
            }
        }).then(function(results){
            if(!results){
                //res.locals.errorMsg = "用户名不存在";
                //res.render('account/login');
                req.session.errorMsg='用户名不存在';
                res.redirect('/login');
            }
            else if(results.dataValues.password == md5(pass+results.dataValues.salt)){
                req.session.user = {
                    username :username,
                    userId : results.dataValues.id,
                    realname : results.dataValues.realname
                }

                res.redirect('/');
            }
            else{
                //res.locals.errorMsg = '用户名或密码错误';
                //res.render('account/login');
                req.session.errorMsg = '用户名或密码错误';
                res.redirect('/login');
            }
        })


    })



router.get('/logout', function (req, res) {
    req.session.user = null;
    req.session.roleAction = null;
    res.redirect('/login');
});

module.exports = router