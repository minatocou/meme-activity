/**
 * Created by yate on 2017/3/3.
 */
var CANVAS_PANEL = '#canvas',
    TEMPLATE_PANEL = '#template',
    IMG_PANEL = '.img-list';
var attrClass = '.attr-form';
var attrComm = '.comm-attr';
var BRANDSET = 'brand-setting';

//品牌分类
var brandCateItem = {
    position:'',
    cate_name: "",
    cate_img:"",
    category_id:""
};
var constant = i18n[$("body").data("localize")];
var initBrandCateArray = initArrays(brandCateItem, 4);

var DEFAULT_SETTING = {
    brandcate: {data:initBrandCateArray}
};

var vueRefs={
    brandcate: "brandcateform"
}

function initArrays(itemObj,num) {
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



