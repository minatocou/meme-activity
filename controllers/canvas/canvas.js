/**
 * Created by page.xia on 16/9/18.
 */
var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request');

router.get('/canvas/:id', function (req, res) {
    // var urlKey=req.params.id;
    // console.log(urlKey);
    // models.Canvas.findOne({
    //     where: {id: cid}
    // }).then(function (results) {
    //     res.render('canvas/canvas',{cid:req.params.id,data:results});
    // })
    // models.Canvas.findOne({
    //     where: {id: cid}
    // }).then(function (results) {
    //     res.render('canvas/canvas',{cid:req.params.id,data:results});
    // })

});


module.exports = router;