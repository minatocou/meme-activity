/**
 * Created by memebox on 16/9/22.
 */
var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    constantCode = require('../../constant/code'),
    models = require('../../models');

router.post('/account/check', function (req, res) {
    var username = req.body.username
    
    models.User.findOne({
        where:{
            username : username
        }
    }).then(function(result){
        if(result){
            res.json({
                code : constantCode.checkUser.code,
                msg : constantCode.checkUser.msg,
                data : result.dataValues
            })
        }else{
            res.json({
                
            })
        }

    }).catch(function(err){
        console.log(err);
    });
    
});


module.exports = router;