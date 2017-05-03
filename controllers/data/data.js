/**
 * Created by memebox on 17/3/15.
 */
var express = require('express'),
    config = require('../../utils/env'),
    redshift = require('../../redshift'),
    router = express.Router(),
    request = require('request');


function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}

router.get('/data', function (req, res) {
    res.render('data/data');
});

router.post('/data/search', function (req, res) {
    var browser = req.body.browser,
        channel = req.body.channel,
        deviceId = req.body.deviceId,
        category = req.body.category,
        eventName = req.body.eventName,
        from_date = req.body.from_date,
        is_wx = req.body.is_wx,
        model = req.body.model,
        network = req.body.network,
        platform = req.body.platform,
        reffererUrl = req.body.reffererUrl,
        to_date = req.body.to_date,
        url = req.body.url,
        userId = req.body.userId,
        limit = req.body.limit,
        version = req.body.version;
    var obj = {}
    if (channel) {
        obj.channel = {
            like: channel
        }
    }
    if (category) {
        obj.category = category
    }
    if (deviceId) {
        obj.deviceid = deviceId;
    }
    if (eventName) {
        obj.eventName = eventName;
    }
    if (model) {
        obj.model = model;
    }
    if (network) {
        obj.network = network;
    }
    if (platform) {
        obj.platform = platform;
    }
    if (userId) {
        obj.userId = parseInt(userId);
    }
    if (version) {
        obj.clientversion = version;
    }
    if (from_date && to_date) {
        obj.created_time = {
            $between: [from_date, to_date]
        }
    }

    if(!isEmptyObject(obj)){

        redshift.report.findAll({
            limit:limit || 50,
            where: obj
        }).then(function (result) {
            res.json(result)
        })
    } else {
        redshift.report.findAll({

            limit:50,

            order: '"created_time" DESC'
        }).then(function (results) {

            res.json(results);
        }).catch(function () {
        })
    }

});

router.get('/data/index', function (req, res) {
    redshift.report.findAll({

        limit:50,

        order: '"created_time" DESC'
    }).then(function (results) {

        res.json(results);
    }).catch(function () {
    })

});
module.exports = router