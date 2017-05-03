var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    models = require('../../models');
var hbs = require('hbs');


router.get('/picture/getimg', function (req, res) {
	var userid = req.session.user.userId;
	models.Picture.findAll({
		where: {
			user_id: userid 
		}
	}).then(function(result){
		res.json(result);
	}).catch(function(err){
		console.log(err);
	})

});

router.post('/picture/del', function (req, res) {

    var id = req.body.id;
    console.log(id);
    models.Picture.destroy({
        where :{
            id : id
        }
    }).then(function (result) {
        res.json({msg:'删除成功'})
    }).catch(function (err) {
        console.log(err)
        res.json({msg:'删除失败'})
    })
})

router.post('/picture/save', function (req, res) {
    var userid = req.session.user.userId;
    var imgsrc = req.body.imgsrc;
    if(imgsrc){
        models.Picture.create({
            url: imgsrc,
            user_id: userid
        }).then(function(data){
            console.log(data)
            res.json( {id : data.dataValues.id , msg : '保存成功'})
        }).catch(function(err){
            console.log(err);
            res.json('保存失败')
        })
    }

})

module.exports = router;