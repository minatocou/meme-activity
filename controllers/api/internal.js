/**
 * Created by memebox on 17/2/22.
 */
var express = require('express'),
    app = require('../../app'),
    router = express.Router(),
    request = require('request'),
    md5 = require('md5'),
    url = require('url'),
    config = require('../../utils/env'),
    host = config.magento.domain,
    // port = '8080',
    makeSign = require('../../utils/sign');
    
/**
 * 验签：ajax与后台通信的安全验证
 * @param params  key
 * params:ajax参数 类型：对象
 * key:验证key
 * @returns {string}
 */


function getOption(req,host,port) {
    var urlkey = '/' + req.params[0];
    var method = req.method.toLowerCase();
    var reqMap = {
        get: req.query,
        post: req.body
    };
    var data = JSON.parse(JSON.stringify(reqMap[method]));
    var headers = {
        signature: makeSign(data)
    };
    // var hostObj = url.parse(host);
    // hostObj.port = port;
    // host = url.format(hostObj);
    var map = {
        get: {
            url: url.resolve(host, urlkey) + (url.parse(req.url).search || ''),
            headers: headers,
        },
        post: {
            url: url.resolve(host, urlkey),// + (url.parse(req.url).search || ''),
            headers: headers,
            form: reqMap[method]
        },
    };
    return map[method];
}

router.use('/internal/*', function (req, res) {
    request[req.method.toLowerCase()](getOption(req,host), function (error, response, body) {
        res.send(body);
    }).on('error', function(err) {
        console.log(err)
    });
});


module.exports = router;