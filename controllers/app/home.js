/**
 * Created by carina on 17/2/7.
 */
var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    models = require('../../models'),
    hbs = require('hbs'),
    config = require('../../utils/env'),
    helper = require('../../helper/helper')(hbs),
    makeSign = require('../../utils/sign');


var sortBy = function (filed, rev, primer) {
    rev = (rev) ? -1 : 1;
    return function (a, b) {
        a = a[filed];
        b = b[filed];
        if (typeof (primer) != 'undefined') {
            a = primer(a);
            b = primer(b);
        }
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 1;
    }
};

/*var obj=[            //使用        false ,升序,   parseInt 转为整型
 {b: '3', c: 'c'},
 {b: '1', c: 'a'},
 {b: '2', c: 'b'}
 ];
 obj.sort(sortBy('b',false,parseInt));
 console.log(obj);*/

router.get('/app/home/:id', function (req, res) {
    var pageId = req.params.id;
    var domain = config.magento.domain;
    var signData = {
        pageId: pageId
    };
    var data;
    request({
        url: domain + '/sas/pagewidget/edit?pageId=' + pageId,
        headers: {signature: makeSign(signData)}
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                data = JSON.parse(body);
                var field = data['data']['field'];
                var bannerNum = 0;

                if (field.length > 0) {
                    for (var i = 0; i < field.length; i++) {
                        if (field[i]['type'] == 'banner' || field[i]['type'] == 'activity') {
                            var dataItems = field[i]['data'];
                            dataItems.sort(sortBy('position', false, parseInt));
                            field[i]['data'] = dataItems;
                        }

                        if (field[i]['type'] == 'banner') {
                            bannerNum++;
                        }

                        if (field[i]['has_change'] == '1') {
                            field[i]['has_change'] = '0';
                        }
                    }
                }

                if ((field && field.length == 0) || bannerNum == 0) {
                    var bannerInitData = {
                        type: "banner",
                        id: "8554a389-a639-2cff-5d6b-3db96cc4be55",
                        position: 1,
                        bg_img: "",
                        has_change: '1',
                        data: []
                    };
                    field.push(bannerInitData);
                }

                data['data']['field'] = field;
                data['data']['pageId'] = pageId;
 
                res.render('app/home', {setting: data['data']});

            } catch (e) {
                console.log(e); //error in the above string(in this case,yes)!
            }
        }
    });

});

module.exports = router;