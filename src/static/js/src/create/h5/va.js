/**
 * Created by memebox on 16/11/4.
 */
var CANVAS_PANEL = '#canvas', TEMPLATE_PANEL = '#template', IMG_PANEL = '.img-list';
var attrClass = '.attr-form';
var attrComm = '.comm-attr';
var SETTING = 'data-setting';
var chosenImg;
var FIELD = {
    l1: '.l1-attr',
    img: '.img-attr',
    purchase: '.purchase-attr',
    countdown: '.countdown-attr',
    video: '.video-attr',
    anchor: '.anchor-attr',
    flashsale: '.flashsale-attr',
    benefits: '.benefits-attr',
    win: '.win-attr',
    presale: '.presale-attr',
    groupon: '.groupon-attr',
    comment: '.comment-attr',
    support: '.support-attr',
    live:'.live-attr',
    newcomer:'.newcomer-attr',
    topnav:".topnav-attr",
    seckill:".seckill-attr"

}
var constant = i18n[$("body").data("localize")];

var DEFAULT_SETTING = {
    'l1': {column: 2},
    'groupon': {grouponId: 1, grouponNum: 10000},
    'presale': {presaleNum: 0},
    'support':{height:'100'}
};
