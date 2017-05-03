/**
 * Created by memebox on 16/9/13.
 */
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var config = require('../utils/env');
var sequelize = new Sequelize(config.redshift.database, config.redshift.username, config.redshift.password, config.redshift);
var db        = {};

Sequelize.HSTORE.types.postgres.oids.push('dummy');
sequelize
    .authenticate()
    .then(function(err) {
        console.log('redshift connection has been established successfully.');
    }, function (err) {
        console.log('Unable to connect to the redshift database:', err);
    });

fs.readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
        var model = sequelize.import(path.join(__dirname, file));
        model && (db[model.name] = model);
    });

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;

module.exports = db;