/**
 * Created by Jesse on 17/1/14.
 */
var express = require('express'),
    app = require('../../app'),
    xlsx = require("node-xlsx"),
    router = express.Router(),
    multiparty = require('multiparty');
router.post('/coupon/userid', function (req, res) {
    var form = new multiparty.Form();
    form.encoding = 'utf-8';
    try {
        form.parse(req, function (err, fields, files) {
            var path = files.file[0].path;
            var list = xlsx.parse(path);
            var data = list[0].data;
            var str = "";
            if(data.length>=10000&&req.query.flag==="sms"){
                res.json({
                    code: 0,
                    data: str,
                    msg: '用户ID最多一次传入10000个'
                });
            }else {
                data.forEach(function (ele, index) {
                    if (!!ele[0]) {
                        str += index == data.length - 1 ? ele[0] : (ele[0] + ",");
                    }
                });
                res.json({
                    code: 1,
                    data: str,
                    msg: 'ok'
                });
            }

        });
    } catch (e) {
        res.json({
            code: 0,
            msg: e
        });
    }
});
module.exports = router;