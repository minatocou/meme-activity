/**
 * Created by yate on 2017/3/3.
 */
/**
 * 保存品牌首页基本信息
 */
function saveBrandData() {
    var param = {},
        channelInfo,
        pageId = $("body").data("page-id"),
        channelArray = [],
        paramArr = [],
        obj1,
        obj2,
        obj3;
    param = $("#brandInfo").serializeObject();
    channelInfo = $("#channelInfo").serializeObject();
    param.admin = $(".header").data("name");
    obj1 = {name: channelInfo.brandNav1, url: channelInfo.brandNav1_link};
    obj2 = {name: channelInfo.brandNav2, url: channelInfo.brandNav2_link};
    obj3 = {name: channelInfo.brandNav3, url: channelInfo.brandNav3_link};
    channelArray.push(obj1, obj2, obj3);
    param.channels = channelArray;
    //paramArr.push(param);
    console.log(param);
    $.ajax({
        type:"post",
        dataType:"json",
        url:"/api/internal/sas/brand/save",
        data: {
            data: JSON.stringify(param)
            //pageId: pageId
        },
        success:function(data){
            callback && callback(data, formData);
            console.log(formData);
        },
        error: function(err){
            console.log("出现异常");
        }
    });
}
