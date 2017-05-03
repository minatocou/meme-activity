/**
 * Created by caifan on 16/9/16.
 */
var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    models = require('../../models'),
    hbs = require('hbs'),
    config = require('../../utils/env'),
    helper = require('../../helper/helper')(hbs);

router.get('/h5/create/:id', function (req, res) {
    var department = req.query.d;
    models.Canvas.findOne({
        where: {urlKey: req.params.id}
    }).then(function (results) {
        var reJson={urlKey:req.params.id ,d : department};
        if(results){
            console.log(results.setting);
            var s=JSON.parse(results.setting);
            reJson.cid=results.id;
            reJson.root=s.root;
            reJson.field=s.field;
            reJson.state = results.dataValues.state;
        }
        reJson.preview = config.preview;
        res.render('create/h5',reJson);
    })

});


module.exports = router