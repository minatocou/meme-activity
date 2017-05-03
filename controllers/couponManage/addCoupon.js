/**
 * Created by Leo.Wang on 17/1/5.
 */

var express = require('express'),
    router = express.Router();
var hbs = require('hbs');
var qs = require('querystring'),
    
    helper = require('../../helper/helper')(hbs);

router.get('/coupon/cn/manage' , function(req, res){
	res.render('couponManage/couponManage.html',{
            k:new Date().getTime().toString(36),
            activeTag: 1
        } );

});

router.get('/coupon/cn/addNewCoupon' , function(req, res){
    res.render('couponManage/addNewCoupon.html',{
            k:new Date().getTime().toString(36),
            activeTag: 1
        } );

});
router.get('/coupon/cn/user' , function(req, res){
    res.render('couponManage/userCouponScan.html',{
        k:new Date().getTime().toString(36),
        activeTag: 1
    } );
});
router.get('/coupon/cn/sms',function (req,res) {
    res.render('couponManage/smsList.html');
});
router.get('/coupon/cn/newsms',function (req,res) {
    res.render('couponManage/newSms.html')
})
module.exports = router;