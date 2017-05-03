/**
 * Created by memebox on 16/9/26.
 */

var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    models = require('../../models'),
    constant = require('../../constant/code');

router.post("/role/getall", function (req, res) {

    models.Role.findAll({
        order : 'rolename'
    }).then(function (result) {
        constant.getAllRole.data =result
        res.json(constant.getAllRole);
    }).catch(function (err) {
        res.json(constant.error);
        console.log(err.message);
    })
});

router.post("/role/get", function (req, res) {

    models.Role.findAll({
        attributes: ['id', "rolename"],
        include: {
            model: models.Action,
            attributes: ["id", "name" , "action"]
        },
        order : 'Role.updated_at desc'
    }).then(function (result) {

        constant.getRole.data =result;
        res.json(constant.getRole);
    }).catch(function (err) {
        res.json(constant.error);
        console.log(err.message);
    })
});

router.post("/role/create", function (req, res) {
    var ids = req.body.ids,
        roleView = req.body.roleView,
        actions = [],
        idsArr = ids.split(",");
    for(var i=0;i<idsArr.length ;i++){
        actions.push({id : idsArr[i]})
    }
    return models.sequelize.transaction(function(t){
        return Promise.all([
            models.Role.create({
                rolename : roleView
            },{transaction : t}),
            models.Action.findAll({
                where :{
                    $or :actions
                }
            })
        ]).then(function(results){
            var role = results[0],
                actionItems = results[1];
            return role.setActions(actionItems ,{transaction : t})

        })
    }).then(function(results){
        res.json(constant.createRoleAction)
    }).catch(function(err){
        console.log(err.message)
    })



});

router.post("/role/update", function (req, res) {
    var roleId = req.body.roleId,
        ids = req.body.ids,
        actions = [],
        idsArr = ids.split(",");
    for(var i=0;i<idsArr.length ;i++){
        actions.push({id : idsArr[i]})
    }
    Promise.all([
        models.Role.findOne({
            where :{
                id : roleId
            }
        }),
        models.Action.findAll({
            where :{
                $or :actions
            }
        })
    ])
   .then(function(results){
       var role = results[0],
           actionItems = results[1];
       role.setActions(actionItems)
       res.json(constant.updateRoleAction)
    })

});

router.post("/role/del", function (req, res) {
    var id = req.body.id
    models.Role.destroy({
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