var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request');

router.get('/admin/panel', function (req, res) {
    res.render('tab/admin/panel');
});
router.get('/admin/role', function (req, res) {
    res.render('tab/admin/role');
});

router.get('/admin/action', function (req, res) {
    res.render('tab/admin/action');
});

module.exports = router