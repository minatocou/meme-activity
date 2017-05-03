/**
 * Created by memebox on 16/9/18.
 */
var config = require('../utils/env');
module.exports = function (sequelize, DataTypes) {
    var eventMapping =  sequelize.define("EventMapping", {
            event_name: {type:DataTypes.STRING, field: 'event_name', allowNull: true, comment: '属性'},
            preproty: {type: DataTypes.STRING, field: 'preproty', allowNull: true, comment: '属性名'},
            description: {type: DataTypes.STRING, field: 'description', allowNull: true, comment: '描述'},
            mapping: {type: DataTypes.STRING, field: 'mapping', allowNull: true, comment: '关联扩展字段'}
        },
        {
            paranoid: true,
            timestamps: false,
            underscored: true,
            freezeTableName: true,
            tableName: config.redshift.mappingTableName || 'event_mapping',
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
    eventMapping.removeAttribute('id');
    return eventMapping;
};