/**
 * Created by Jesse on 16/12/27.
 */
var config = require('../utils/env');
module.exports = function (sequelize, DataTypes) {
    var report =  sequelize.define("report", {
            eventname: {type: DataTypes.STRING(200), field: 'eventname', allowNull: true},
            category: {type: DataTypes.STRING(200),field: 'category', allowNull: true},
            property: {type: DataTypes.STRING(200), field: 'property', allowNull: true},
            created_time:{type: DataTypes.STRING(200), field: 'created_time'},
            userid:{type:DataTypes.STRING(100), field: 'userid',allowNull: true},
            usertoken:{type:DataTypes.STRING(1000), field: 'usertoken',allowNull: true},
            deviceid:{type:DataTypes.STRING(200), field: 'deviceid',allowNull: true},
            platform:{type:DataTypes.STRING(200), field: 'platform',allowNull: true},
            channel:{type:DataTypes.STRING(200), field: 'channel',allowNull: true},
            model:{type:DataTypes.STRING(200), field: 'model',allowNull: true},
            clientversion:{type:DataTypes.STRING(200), field: 'clientversion',allowNull: true},
            network:{type:DataTypes.STRING(200), field: 'network',allowNull: true},
            history:{type:DataTypes.STRING(200), field: 'history',allowNull: true},
            browser:{type:DataTypes.STRING(200), field: 'browser',allowNull: true},
            url:{type:DataTypes.STRING(200), field: 'url',allowNull: true},
            reffererurl:{type:DataTypes.STRING(200), field: 'reffererurl',allowNull: true},
            useragent:{type:DataTypes.STRING(200), field: 'useragent',allowNull: true}

        },
        {
            paranoid: true,
            timestamps: false,
            underscored: true,
            freezeTableName: true,
            tableName: config.redshift.tableName,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    report.removeAttribute('id');
    return report;
};