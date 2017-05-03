/**
 * Created by yate on 16/9/19.
 */
var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    models = require('../../models'),
    md5 = require('../../utils/md5');

router.post("/author/add", function (req, res) {
    var realname = req.body.realname,
        username = req.body.username,
        roleId = req.body.roleRadio,
        pwd = req.body.password;
    var author = new AuthObj(),
        salt = new Date().getTime().toString(36);
    return models.sequelize.transaction(function(t){
        return Promise.all([
            models.User.create({
                "username": username,
                "realname": realname,
                "password": md5(pwd + salt),
                "salt": salt
            },{transaction : t}),
            models.Role.findOne({
                where :{
                    id : roleId
                }
            },{transaction : t})
        ]).then(function(results){
            var user = results[0],
                role = results[1];
            return user.addRole(role , {transaction : t});
        })
    }).then(function(){

        author.msg = "添加成功";
        res.json(author);
    }).catch(function(err){
        author.code = 0;
        author.msg = "添加失败";
        res.json(author);
        console.log(err.message);
    })

});

router.post("/author/delUserById", function (req, res) {
    var uid = req.body.id,
        author = new AuthObj();
    models.User.destroy({
        where: {"id": uid}
    }).then(function (result) {
        author.msg = "添加成功";
    }).catch(function (err) {
        author.code = 0;
        author.msg = "添加失败";
        console.log(err.message);
    }).finally(function () {
        res.json(author);
    });
});

router.post("/author/getAll", function (req, res) {
    var author = new AuthObj();
    models.User.findAll({
        attributes: ['id', "username", "realname","updated_at"],
        include: {
            model: models.Role,
            attributes: ["id", "rolename"]
        },
        order :"User.updated_at DESC"
    }).then(function (result) {

        author.msg = "查询成功";
        author.data = result;
        res.json(author)
    }).catch(function (err) {
        author.code = 0;
        author.msg = "查询失败";
        console.log(err.message);
    })
});

router.post("/author/getInfoById", function (req, res) {
    var uid = req.body.id,
        author = new AuthObj();

    Promise.all([
        models.User.findOne({
            where: {
                id: uid
            }
        }),
        models.Role.findAll()
    ]).then(function (result) {
        author.msg = "查询成功";
        var data  = {
            userInfo : result[0],
            roles :result[1]
        }
        author.data = data;
        res.json(author)
    }).catch(function (err) {
        author.code = 0;
        author.msg = "查询失败";
        console.log(err);
    })
});


router.post("/author/update", function (req, res) {
    var author = new AuthObj();
    return models.sequelize.transaction(function(t){
        var uid = req.body.userid,
            realname = req.body.realname,
            username = req.body.username,
            roleId = req.body.roleRadio;

        
        return models.User.update({
            "username": username,
            "realname": realname
        }, {
            where: {
                "id": uid
            },
            transaction : t
            
        }).then(function (result) {
            return Promise.all([
                models.User.findOne({
                    where :{
                        id : uid
                    }
                }),
                models.Role.findOne({
                    where :{
                        id : roleId
                    }
                }, {transaction: t}),
            ]).then(function(result){
                var user = result[0];
                var role = result[1];
                return user.setRoles(role, {transaction: t});

            })



        }).catch(function (err) {
            author.code = 0;
            author.msg = "查询失败";
            console.log(err.message);
        })
    }).then(function(result){
        author.msg = "success";
        res.json(author);
    }).catch(function(err){
        console.log(err)
    })

});

router.post("/author/findUserByName", function (req, res) {
    var uname = req.body.username,
        author = new AuthObj();
    models.User.findAll({
        attributes: ["id", "username", "realname"],
        include: {
            model: models.Role,
            attributes: ["id", "rolename"]
        },
        where: {
            '$or': [
                {
                    username: {
                        $like: '%' + uname + '%'
                    }
                },
                {
                    realname: {
                        $like: '%' + uname + '%'
                    }
                }
            ]

        }
    }).then(function (result) {
        var str = JSON.stringify(result);
        console.log(str);
        author.msg = "查询成功";
        author.data = JSON.parse(str);
    }).catch(function (err) {
        author.code = 0;
        author.msg = "查询失败";
        console.log(err.message);
    }).finally(function () {
        res.json(author);
    });
});

module.exports = router;

function openOrClose(param) {
    if (param == "on") {
        return 1;
    } else {
        return 0;
    }
}

function AuthObj() {
    this.code = 1;
    this.msg = "";
    this.data = null;
}