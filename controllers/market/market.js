/**
 * Created by memebox on 16/11/23.
 */
var express = require('express'),
    app = require('../../app'),

    router = express.Router();


router.get('/market/lapse', function (req, res) {
    res.render('market/lapse/lapse');
});
router.get('/market/lapse/detail', function (req, res) {
    res.render('market/lapse/detail');
});
router.get('/market/coupon', function (req, res) {
    res.render('market/coupon/coupon');
});
router.get('/market/coupon/detail', function (req, res) {
    res.render('market/coupon/detail');
});
router.get('/market/code', function (req, res) {
    res.render('market/code/code');
});
router.get('/market/code/detail', function (req, res) {
    res.render('market/code/detail');
});

router.get('/market/warehouse', function (req, res) {
    res.render('market/warehouse/warehouse');
});
router.get('/market/warehouse/detail', function (req, res) {
    res.render('market/warehouse/detail');
});
router.get('/market/preference', function (req, res) {
    res.render('market/preference/preference');
});
router.get('/market/preference/detail', function (req, res) {
    res.render('market/preference/detail');
});
router.get('/market/data', function (req, res) {
    res.render('market/data');
});
router.get("/market/flash/list",function (req,res) {
    res.render("market/flashsale/list");
});
router.get("/market/flash",function (req,res) {
    res.render("market/flashsale/index");
});
module.exports = router;