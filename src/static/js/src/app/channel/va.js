/**
 * Created by carina on 17/2/16.
 */
var CANVAS_PANEL = '#canvas', TEMPLATE_PANEL = '#template', IMG_PANEL = '.img-list';
var attrClass = '.attr-form';
var attrComm = '.comm-attr';
var SETTING = 'data-setting';
var BRANDSET = 'brand-setting';
var chosenImg;
// var FIELD = {已经换为自动匹配
//     banner: '.banner-attr'
//
// }
var constant = i18n[$("body").data("localize")];

var initArrays = function (itemObj,num) {
    var array =[];
    var item = JSON.stringify(itemObj);
    for(var i=0;i<num;i++){
        var itemI = item;
        var position = i+1;
        var itemN = JSON.parse(itemI);
        itemN['position']= position;
        array.push(itemN);
    }
    return array;
}

//icon初始化
var iconItem ={
    position:'',
    icon_img:"",
    url_type:"",
    url_text:"",
    icon_title:"",
    item_action_url:"",
    item_action_url_type:""
};
var initIconArray=initArrays(iconItem,5);


//特色栏目初始化
var specialItem ={
    position:'',
    special_img:"",
    url_type:"",
    url_text:"",
    item_action_url:"",
    item_action_url_type:""
};
var initSpecialArray = initArrays(specialItem,4);
//品牌分类
var brandCateItem = {
    position:'',
    cate_name: "",
    cate_img:"",
    category_id:""
};
var initBrandCateArray = initArrays(brandCateItem, 4);

//初始化图文组件
var imageTextItem = {
    end_time: "",
    start_time:"",
    title:"",
    status: 1,
    data: {
        position: "",
        ids: ""
    }
};


//视频组件

var videoItem = {
    status:'1',
    start_time:'',
    end_time:'',
    video_id:'',
    video_title:'',
    video_url:'',
    video_img:'',
    id:uuid()
};

//直播组件

var liveItem = {
    start_time:'',
    end_time:'',
    room_id:'',
    live_img:'',
    is_pass:'0',
    id:uuid()
};


//新人价初始化
var newcomerItem ={
    position:'',
    newcomer_img:"",
    url_type:"",
    url_text:"",
    item_action_url:"",
    item_action_url_type:""
};
var initNewcomerArray = initArrays(newcomerItem,4);

var DEFAULT_SETTING = {
    banner:{},
    icon:{bg_img: "",data:initIconArray},
    bulletin:{bg_img: "",data:[]},
    special:{data:initSpecialArray},
    discount:{data:[]},
    activity:{data:[]},
    groupon:{data:[{sku:''}]},
    favor:{data:[{show_num:''}]},
    favorcom:{data:[{start_time:'',end_time:''}]},
    separate:{data:[{space_type:'block',space_height:'',space_color:''}]},
    video:{bg_img:"",title:"",data:[videoItem]},
    // live:{bg_img:"",title:"",data:[liveItem]},
    live:{bg_img:"",data:[liveItem]},
    brandcate: {data:initBrandCateArray},
    imagetext: imageTextItem,
    newcomer:{data:initNewcomerArray},
};

var vueRefs={
    banner:'bannerform',
    icon:'iconform',
    bulletin:'bulletinform',
    special:'specialform',
    discount:'discountform',
    activity:'activityform',
    groupon:'grouponform',
    favor:'favorform',
    favorcom:'favorcomform',
    separate:'separateform',
    video:'videoform',
    live:'liveform',
    brandcate: "brandcateform",
    imagetext: "imagetextform",
    newcomer:'newcomerform',
}
