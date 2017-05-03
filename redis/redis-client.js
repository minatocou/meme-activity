/**
 * Created by page.xia on 16/9/14.
 */
var config = require('../utils/env'),
    Redis = require('ioredis'),
    client = new Redis({
        port: config.viewredis.port,          
        host: config.viewredis.host,
        db: config.viewredis.db
    })

module.exports = client;