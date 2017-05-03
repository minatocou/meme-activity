/**
 * Created by memebox on 16/11/4.
 */
var l1Event = function (data) {

}
var purchaseEvent = function (data) {

}

var commentEvent = function (data) {

}
var liveEvent = function (data) {

}
var seckillEvent = function (data) {

}
var topnavEvent = function () {
    var curEL = $(CANVAS_PANEL).find(".cur");
    var dataArr=[];
    $(".topnav-body .form-group").each(function (index,ele) {
        var data = {
            name:$($(ele).find("input")[0]).val(),
            anchor:$($(ele).find("input")[1]).val()
        };
        dataArr.push(data);
    });
    var defaultSet = JSON.parse(curEL.attr(SETTING));
    var tabInfo = _.extend(defaultSet, {tabInfo : dataArr});
    curEL.attr("data-setting" , JSON.stringify(tabInfo));
};
var newcomercouponEvent = function () {
    var curEL = $(CANVAS_PANEL).find(".cur");
    var dataArr=[];
    $(".newcomercoupon-body .form-group").each(function (index,ele) {
        var data = {
            ruleId:$($(ele).find("input[name=ruleId]")).val(),
            ruleImg:$($(ele).find("input[name=ruleImg]")).val()
        };
        dataArr.push(data);
    });
    var defaultSet = JSON.parse(curEL.attr(SETTING));
    var tabInfo = _.extend(defaultSet, {couponInfo : dataArr});
    curEL.attr("data-setting" , JSON.stringify(tabInfo));
};
var winEvent = function () {
    var curEL = $(CANVAS_PANEL).find('.cur');
    var dataArr =[];
    $(".win-table").each(function(index , ele){
        var datacsv = $(ele).find('[data-csv]').attr('data-csv') || "[]"
        var data = {
            from : $(ele).find('.winfrom').val(),
            to : $(ele).find('.winto').val(),
            name : $(ele).find('.csv-name').html(),
            csv :JSON.parse(datacsv)
        }
        if( data.from && data.to &&  data.name!="NA" && data.csv.length){
            dataArr.push(data);
        }

    })
    var defaultSet = JSON.parse(curEL.attr(SETTING));
    var winInfo = _.extend(defaultSet, {winInfo : dataArr})
    curEL.attr("data-setting" , JSON.stringify(winInfo));
}
var countdownEvent = function (data) {

}
var videoEvent = function (data) {
    var curEL = $(CANVAS_PANEL).find('.cur');
    curEL.css('background', data.videoBackground);
    curEL.find('img').attr('src', data.imgSrc);
}
var anchorEvent = function (data) {

}
var flashsaleEvent = function () {
    var curEL = $(CANVAS_PANEL).find('.cur');
    var dataArr =[];

    $(".flashsale-table-content .table").each(function(index , ele){
        var catTimeArr = [];
        $(ele).find('.cattime').each(function(index , tr){
            var data ={
                time : $(tr).find("[data-flashtimepicker]").val(),
                to  : $(tr).next().find("[data-flashtimepicker]").val(),
                category : $(tr).find(".flash-category").val()
            }
            catTimeArr.push(data);
        })
        var data = {
            id : uuid(),
            date : $(ele).find('[data-flashdatepicker]').val(),
            catTime :catTimeArr
        }
        dataArr.push(data)
    })
    var defaultSet = JSON.parse(curEL.attr(SETTING));
    var tabInfo = _.extend(defaultSet, {tabInfo : dataArr})
    curEL.attr("data-setting" , JSON.stringify(tabInfo));
}
var benefitsEvent = function (data) {

}
var presaleEvent = function(){
    
};
var grouponEvent = function(){

};
var supportEvent = function () {

};
var newcomercommentEvent = function () {

}
var imgEvent = function (data) {
    var curEL = $(CANVAS_PANEL).find('.cur');
    curEL.find('a').attr('href', data.imgUrl);
    curEL.find('img').attr('src', data.imgSrc);
    var msgBox=$('.loginMsg');
    if($('[name=isLogin]').is(':checked')){
        msgBox.show();
    }else{
        msgBox.hide();
    }

    // var html=template('imgTemplate',data);
    // curEL.html(html);
}