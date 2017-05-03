/**
 * Created by memebox on 16/9/6.
 */
var config = require('../utils/env');
module.exports = function (sequelize, DataTypes) {
    var eventCategory = sequelize.define('EventCategory', {
            group_name: {type: DataTypes.STRING, allowNull: false, comment: '模块名'},
            event_name: {type: DataTypes.STRING, allowNull: true, comment: '事件名'},
            category: {type: DataTypes.STRING, allowNull: false, comment: '事件类型'},
            description: {type: DataTypes.STRING, allowNull: false, comment: '描述'},
        },
        {
            paranoid: true,
            timestamps: false,
            underscored: true,
            freezeTableName: true,
            tableName: config.redshift.eventTableName || 'event_category',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    eventCategory.removeAttribute('id');
    return eventCategory;
}