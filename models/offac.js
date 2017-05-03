/*
 * @Author: Derek Zhou
 * @Date:   2016-11-22 17:20:42
 * @Last Modified by:   Derek Zhou
 * @Last Modified time: 2016-12-14 16:33:52
 */

module.exports = function(sequelize, DataTypes) {
    var wechatMenu = sequelize.define("wechatMenu", {
        setting: { type: DataTypes.TEXT, allowNull: false, comment: 'wechatMenu设置项' },
        url: {type: DataTypes.STRING(100), field: 'url', allowNull: true, comment: '接口地址'}
    }, {
        timestamps: true,
        underscored: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'wechatMenu',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
    return wechatMenu;
};
