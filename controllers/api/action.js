/**
 * Created by memebox on 16/9/26.
 */

var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    models = require('../../models'),
    constant = require('../../constant/code');

router.post("/action/get", function (req, res) {

    models.Action.findAll({
        include : {model: models.Role},
        order : 'Action.updated_at desc'
    }).then(function (result) {
        constant.getAction.data =result;
        res.json(constant.getAction);
    }).catch(function (err) {
        res.json(constant.error);
        console.log(err.message);
    })
});

router.post("/action/create", function (req, res) {
    var action = req.body.action,
        name = req.body.name;
    models.Action.create({
        action : action,
        name : name
    }).then(function (result) {
        res.json({
            code : 1,
            data : result,
            msg : ""
        })
    }).catch(function (err) {
        
    })
});

router.post("/action/del", function (req, res) {
    var id = req.body.id
    models.Action.destroy({
        where :{
            id : id
        }

    }).then(function (result) {
        res.json({
            code : 1,
            data : result,
            msg : ""
        })
    }).catch(function (err) {
        console.log(err)
    })
});


module.exports = router;