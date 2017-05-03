/**
 * Created by memebox on 17/2/23.
 */
var md5 = require('md5'),
    config = require('../utils/env'),
    key = config.signature;
    
module.exports= function (params) {
    if(!params){
        return md5("secret" + "=" + key);
    }
    var ary = Object.keys(params),
        str = "";
    ary.sort(function (a, b) {
        return a.localeCompare(b);
    });
    for (var i = 0; i < ary.length; i++) {
        if( params[ary[i]] != undefined && params[ary[i]] !="" && params[ary[i]] != null ){
            str += ary[i] + "=" + params[ary[i]] + "&";
        }

    }
    str += "secret" + "=" + key;
    return md5(str);
}