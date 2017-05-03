/**
 * Created by memebox on 17/2/22.
 */


module.exports = (function(){
    var env    = process.env.NODE_ENV || "development";
    var config = require('../conf/config')[env];
    return config;
})()