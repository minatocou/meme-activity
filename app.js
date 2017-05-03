var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var routes = require('./routes/router');
var hbs = require('hbs');
var config = require('./utils/env');
var models = require('./models');
var winston = require('winston');
var expressWinston = require('./logger');
var loggerInstance = require('./logger/log')
var app = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', hbs.__express);
app.set('view engine', 'html');
hbs.registerPartials(__dirname + '/views/common');

// uncomment after placing your favicon in /static
app.use(favicon(path.join(__dirname, 'static/img/static/img/common', 'favicon_cn.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false,limit : "3000kb"}));
app.use(cookieParser());


app.use(session({
    store: new RedisStore({
        host : config.redis.host,
        port: config.redis.port,
        db: config.redis.db
    }),
    secret: 'membox_mars_rock',
    resave: false,
    saveUninitialized: true
}))

app.use(express.static(path.join(__dirname, 'static')));

app.use(function(req,res ,next){
    if(req.session){
        req.session.localize = req.session.localize ?req.session.localize :"zh_cn";
        res.locals.i18n = require("./i18n/"+req.session.localize );
    }else{
        res.locals.i18n = require("./i18n/zh_cn") ;
    }
    
    next()
})
app.use(function (req, res, next) {
    var err,
        url = req.originalUrl;
    res.locals.errorMsg = '';
    if (err) {
        res.locals.errorMsg =  err ;
    }

    if (url != "/login" && url!="/api/account/check" && !req.session.user) {
        return res.redirect("/login");
    }
    res.locals.config=config;
    if( req.session ){
         err = req.session.errorMsg ;
         var user = req.session.user;

        res.locals.user = user
        if( req.session.user){
            var user_id = req.session.user.userId
            if( !req.session.roleAction ){
                models.User.findAll({
                    attributes: ['id', "username" , "realname"],
                    include: {
                        model: models.Role,
                        attributes: ["id", "rolename" ]
                    },
                    where : {
                        id : user_id
                    }
                }).then(function(results){
                    if( results ){
                        var role = results[0].Roles;
                        req.session.roleAction ={
                            role : role
                        }
                        return role
                    }

                }).then(function(result){
                    if(result && result.length){
                        models.Role.findAll({
                            attributes: ['id', "rolename"],
                            include: {
                                model: models.Action,
                                attributes: ["id", "name" , "action"]
                            },
                            where : {
                                id : result[0].id
                            }
                        }).then(function (result) {
                            req.session.roleAction["action"] = result[0].Actions;
                            res.locals.roleAction = req.session.roleAction
                            next();
                        })
                    }else{
                        next()
                    }

                })


            }else{
                res.locals.roleAction = req.session.roleAction;
                next();
            }
            delete req.session.errorMsg;
        }else{
            next();
        }

    }else{
        console.log("no session")
    }




});

app.use(expressWinston.logger({
    winstonInstance : loggerInstance,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: true,
    ignoreRoute: function (req, res) { return false; },
    dynamicMeta : function(req){
        var forwardedIpsStr = req.header('x-forwarded-for');
        var IP = '';

        if (forwardedIpsStr) {
            IP = forwardedIps = forwardedIpsStr.split(',')[0];
        }
        var user = req.session ? (req.session.user|| {}) : {};
        user.ip = IP ||req.connection.remoteAddress
        return user;
    }
}));

app.use(routes);

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        })
    ]
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        var status = err.status || 500;
        res.status(status);
        if( status == 404 ){
            res.render('error/404', {
                message: err.message,
                error: err
            });
        }else if( status == 500 ){
            res.render('error/500', {
                message: err.message,
                error: err
            });
        }else{
            res.render('error/other', {
                message: err.message,
                error: err
            });
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error/prodError', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
