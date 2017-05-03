/**
 * Created by memebox on 16/11/4.
 */
function formValidator(formData , target , callback){
    var flag = true,
        anchorArr = [],
        pickerArr = [];
    if(!$.trim(formData.root.title) ){
        flag = false;
        alert(constant.activity_none);


    }
    if($(".tWin").length > 2){
        flag = false;
        alert(constant.win_list);
    }
    if($(".canvas-wrapper .tSeckill").length>1){
        alert("只能有一个秒杀活动");
        flag = false;
    }
    if( $(".canvas-wrapper .tPresale").length ){
        if($("[name=presaleNum]").val() === "0"){
            flag = false;
            alert(constant.pre_none);
        }
    }

    if( $(".canvas-wrapper .tGroupon").length ){
        if($("[name=grouponNum]").val() === "0"){
            flag = false;
            alert(constant.group_none);
        }
    }
    if($("#canvas .tTopnav.template").length){
        $(".topnav-body input").each(function (index,ele) {
            if(!$(ele).val()){
                alert("顶部导航名称和锚点不能为空");
                flag = false;
                return false;
            }
        });
    }
    if($("#canvas .tNewcomercoupon.template").length){
        $(".newcomercoupon-body input").each(function (index,ele) {
            if(!$(ele).val()){
                alert("优惠券id和背景图不能为空");
                flag = false;
                return false;
            }
        });
    }
    $(".win-table").each(function(index , ele){
        var from = $.trim($(ele).find('.winfrom').val()),
            to = $.trim($(ele).find('.winto').val()),
            name = $.trim($(ele).find('.csv-name').html()),
            csv = $(ele).find('.addWin').attr("data-csv");

        if(!from && !to && name=="NA" && !csv.length){
            return true
        }else if(!from || !to || name=="NA" || !csv.length){
            flag = false;
            alert("tab" +  (index+1) +constant.incomplete)
            return false
        }
    })
    $(".flashsale-table-content input").each(function(index , ele){
        if( !$.trim($(ele).val()) ){
            flag = false;
            alert(constant.flashsale_none)
            return false;
        }
    })
    $(".flashsale-attr input[data-flashdatepicker]").each(function(index , ele){
        pickerArr.push( $(ele).val() )
    })
    if(isRepeat( pickerArr )){
        flag = false;
        alert(constant.fltab_dup)
    }
    $("#canvas .tAnchor").each(function(index ,ele){
        var setting = JSON.parse($(ele).attr("data-setting"));
        if( setting ){
            anchorArr.push(setting.anchorHash)
        }
    })

    if(isRepeat( anchorArr )){
        flag = false;
        alert(constant.anchor_dup)
    }


    if( flag ){
        callback && callback()
    }else{
        target.removeClass("disable")
    }

}