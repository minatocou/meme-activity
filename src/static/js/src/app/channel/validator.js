/**
 * Created by memebox on 16/11/4.
 */

var componentName = {
    banner:'banner',
    icon:'首页ICON',
    bulletin:'公告栏',
    special:'特色栏目',
    discount:'今日特价',
    activity:'活动',
    groupon:'拼团',
    favor:'猜你喜欢',
    favorcom:'猜你喜欢2',
    separate:'分割线',
    brandcate: "分类商品",
    video: "视频",
    live: "直播",
    imagetext: "图文组件",
    flashale:"秒杀",
    newcomer: "新人价"
}

var unRequired={                   //非必填项列表
    banner:{common:['bg_img'],items:[]},
    icon:{common:['bg_img'],items:['icon_title']},
    bulletin:{common:['bg_img'],items:['url_type','url_text','item_action_url','item_action_url_type']},
    special:{common:[],items:[]},
    discount:{common:[],items:['url_type','url_text','item_action_url','item_action_url_type']},
    activity:{common:[],items:[]},
    groupon:{common:['url_type','url_text','action_url','action_url_type'],items:[]},
    newcomer:{common:['url_type','url_text','action_url','action_url_type'],items:[]},
    favor:{common:[],items:['show_num']},
    favorcom:{common:[],items:[]},
    separate:{common:['isNew'],items:['space_height','space_color','url_type','url_text','item_action_url','item_action_url_type']},
    brandcate: {common:[],items:["cate_name", "cate_img", "category_id"]},
    video: {common:['bg_img'],items:[]},
    live: {common:['bg_img'],items:[]},
    flashsale: {common:[],items:[]},
    imagetext: {common:[], items:[]}
};

var isInArray =function (key,Array) {
    for(var i=0;i<Array.length;i++){
        if(key==Array[i]){
            return true;
        }
    }
    return false;
}


var lenFor = function(str){
    var byteLen=0,len=str.length;
    if(str){
        for(var i=0; i<len; i++){
            if(str.charCodeAt(i)>255){
                byteLen += 2;
            }
            else{
                byteLen++;
            }
        }
        return byteLen;
    }
    else{
        return 0;
    }
}

function formValidator(formData , target , callback){
    var field = formData['field'];
    var flag = true;
    for(var i=0;i<field.length;i++){
        var dataItem = field[i];
        var type = dataItem['type'];
        var unRequiredJson = unRequired[type];

        var counter = 0;
        for(var key1 in dataItem){
            if(key1!='data'){
                if(!isInArray(key1,unRequiredJson['common'])){
                    if(!$.trim(dataItem[key1])){
                        counter++;
                    }
                    if(type == "imagetext" && gblen($.trim(dataItem["title"])) > 16){
                        flag = false;
                        alert(componentName[type]+"组件下编辑有误");
                        target.removeClass("disable");
                        $("#imagetext").find("input[name='title']").addClass("err");
                        $("#imagetext").find("input[name='title']").after('<span class="tip">标题过长</span>');
                        return false;
                    }else{
                        $("#imagetext").find("input[name='title']").removeClass("err");
                        $("#imagetext").find(".form-group .tip").remove();
                    }
                }
            }else{
                for(var m =0;m<dataItem['data'].length;m++){
                    var dataItemN = dataItem['data'][m];
                    for(var key2 in dataItemN){
                        if(!isInArray(key2,unRequiredJson['items'])){
                            if(!$.trim(dataItemN[key2])){
                                counter++;
                            }
                        }
                    }
                }
            }
        }

        if(counter>0){
            flag = false;
            alert(componentName[type]+"组件下有未填项");
            target.removeClass("disable");
            return false;
        }

        //banner和活动  排序验证
        var positions = [];
        if(type=='banner'||type=='activity'||type=='bulletin'){
            for(var pos =0;pos<dataItem['data'].length;pos++) {
                var posItem =dataItem['data'][pos];
                positions.push(posItem['position'])
            }
        }
        if(isRepeat(positions)){
            flag = false;
            alert(componentName[type]+"组件下排序配置重复");
            target.removeClass("disable");
            return false;
        }


        //icon
        var iconCounter = 0;
        if(type=='icon'){
            for(var icon =0;icon<dataItem['data'].length;icon++) {
                var iconItem =dataItem['data'][icon];
                if(!$.trim(iconItem['icon_title'])){            //icon
                    iconCounter++;
                }

            }
        }
        if(iconCounter!=0&&iconCounter!=5){
            flag = false;
            alert(componentName[type]+"组件下文字标题未填写完");
            target.removeClass("disable");
            return false;
        }

        //今日特价discount
        var discountTimes = [];
        if(type=='discount'){
            for(var discount =0;discount<dataItem['data'].length;discount++) {
                var discountItem =dataItem['data'][discount];
                discountTimes.push(discountItem['discount_time'])
            }
        }
        if(isRepeat(discountTimes)){
            flag = false;
            alert(componentName[type]+"组件下时间配置重复");
            target.removeClass("disable");
            return false;
        }

        //视频组件video
        // if((type=='video'||type=='live')&& lenFor(dataItem['title'])>20){
        if(type=='video'&& lenFor(dataItem['title'])>20){
            alert(componentName[type]+"组件下title字段不能超过20个字节");
            target.removeClass("disable");
            return false;
        }


        var isVideoTimeRepeat;
        if(type=='video'&&dataItem['data'].length>0){
            var begin = [];
            var over = [];
            for(var v =0;v<dataItem['data'].length;v++){
                begin.push(dataItem['data'][v]['start_time']);
                over.push(dataItem['data'][v]['end_time']);
            }
            isVideoTimeRepeat = compareDate(begin,over);
        }

        if(type=='video'&&!isVideoTimeRepeat){
            alert(componentName[type]+"组件下时间重复");
            target.removeClass("disable");
            return false;
        }
        
        //live组件
        if(type=='live'&&dataItem['data'][0]['is_pass']==0){
            alert(componentName[type]+"组件下房间ID未校验或校验未通过");
            target.removeClass("disable");
            return false;
        }


    }

    if( flag ){
        callback && callback()
    }else{
        target.removeClass("disable");
    }
}


function gblen(str) {
    var len = 0;
    for (var i=0; i<str.length; i++) {
        if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {
            len += 2;
        } else {
            len ++;
        }
    }
    return len;
}

function compareDate(begin,over){
    begin = begin.sort();
    over  = over.sort();

    var num = 0;
    for(var i=1;i<begin.length;i++){
        if (begin[i] <= over[i-1]){
            num++;
        }
    }

    if(num>0){
        return false;
    }
    return true;
}