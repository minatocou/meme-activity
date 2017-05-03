/**
 * Created by Jesse on 16/11/28.
 */
/**
 * 分页
 */
var num = 10;
var pagesObj =function (total) {
    return {
        pages:Math.ceil(total / num),
        pageSize:num,
        total:total
    }
};
module.exports = {
    num:num,
    pagesObj:pagesObj
};