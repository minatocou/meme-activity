/**
 * Created by memebox on 16/6/4.
 */
var express = require('express')
    , router = express.Router(),
       hbs = require('hbs');

router.use('/',
    require('../controllers/tab/admin'),
    require('../controllers/create/h5'),
    require('../controllers/create/pc'),
    require('../controllers/activity/girlsday'),
    require('../controllers/account/login'),
    require('../controllers/list/plist'),
    require('../controllers/list/mlist'),
    require('../controllers/list/krlist'),
    require('../controllers/market/market'),
    require('../controllers/wechat/offac'),
    require('../controllers/wechat/reply'),
    require('../controllers/sql'),
    require('../controllers/gift/giftBaseData'),
    require('../controllers/gift/warehousework'),
    require('../controllers/gift/query'),
    require('../controllers/couponManage/addCoupon'),
    require('../controllers/app/list'),
    require('../controllers/app/home'),
    require('../controllers/app/brand'),
    require('../controllers/app/addPage'),
    require('../controllers/app/download'),
    require('../controllers/questionnaire/questionnaire'),
    require('../controllers/brand/brand'),
    require('../controllers/video/addVideo'),
    require('../controllers/video/list'),
    require('../controllers/teletext/teletext'),
    require('../controllers/data/data'),
    require('../controllers/data/event'),
    require('../controllers/data/eventSearch'),
    require('../controllers/log/logCtr'),
    require('../controllers/live/list'),
    require('../controllers/live/addLive'),
    require('../controllers/live/liveManage'),
    require('../controllers/tools/convert/product'),
    require('../controllers/subscription/list')
);

router.use('/api',
    require('../controllers/api/h5'),
    require('../controllers/api/pc'),
    require('../controllers/api/account'),
    require('../controllers/api/author'),
    require('../controllers/api/action'),
    require('../controllers/api/role'),
    require('../controllers/api/picture'),
    require('../controllers/api/wechat'),
    // require('../controllers/api/market'),
    require('../controllers/api/addNewCoupon'),
    require('../controllers/api/appdownload'),
    require('../controllers/api/internal'),
    require('../controllers/api/activitygirlsday'),
    require('../controllers/api/qiniu')

);

router.use('/imageuploader',
    require('../controllers/imageuploader/imageuploader'));

/*router.use('/qiniu',
    require('../controllers/qiniu/videouploader'));*/

hbs.registerHelper('compare', function(left, operator, right, options) {
    if (arguments.length < 3) {
        throw new Error('Handlerbars Helper "compare" needs 2 parameters');
    }
    var operators = {
        '==':     function(l, r) {return l == r; },
        '===':    function(l, r) {return l === r; },
        '!=':     function(l, r) {return l != r; },
        '!==':    function(l, r) {return l !== r; },
        '<':      function(l, r) {return l < r; },
        '>':      function(l, r) {return l > r; },
        '<=':     function(l, r) {return l <= r; },
        '>=':     function(l, r) {return l >= r; },
        'typeof': function(l, r) {return typeof l == r; }
    };

    if (!operators[operator]) {
        throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
    }

    var result = operators[operator](left, right);

    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

module.exports = router;
