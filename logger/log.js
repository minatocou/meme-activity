/**
 * Created by memebox on 17/4/5.
 */
var config = require('../utils/env'),
    env    = process.env.NODE_ENV || "development",
    util = require('util'),
    winston = require('winston'),
    moment = require('moment'),
    container = new winston.Container(),
    logger;



container.add('dev', {
    transports: [
        new (winston.transports.File)({
            json : true,
            colorize: true,
            filename: config.logDir + 'memebox.log',
            timestamp: function () {
                    return moment().format()
                }
            })
    ],
});

container.add('qa', {
    transports: [
        new (winston.transports.Console)({
            json : true,
            timestamp: function () {
                return moment().format()
            }
        })
    ]
});


container.add('production', {
    transports: [
        new (winston.transports.File)({
            json : true,
            filename: config.logDir + 'memebox.log',
            timestamp: function () {
                return moment().format()
            }
        })
    ]
});

if (env == 'development') {
    logger = container.get('dev');
} else if (env == 'preprod' || env == 'production') {
    logger = container.get('production');
} else {
    logger = container.get('qa');
}
logger.on("error" , function(err){
    console.log(err)
})
module.exports = logger;
