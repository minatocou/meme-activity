Vue.config.delimiters = ['${', '}'];
__inline('../component/brand-cate.js?__inline');
__inline('../component/brand-home.js?__inline');
__inline('../component/icon.js?__inline');
__inline('../component/special.js?__inline');
__inline('../component/activity.js?__inline');
__inline('../component/separate.js?__inline');
__inline('../component/imagetext.js?__inline');

var vue = new Vue({
    el:'html',
    data:{
        brandData: {},
        callBackId: "",
        cbBrandId: "",
        channelsData: {
            one: {
                name: "",
                url: ""
            },
            two: {
                name: "",
                url: ""
            },
            three: {
                name: "",
                url: ""
            }
        }
    },
    methods:{
        saveData:function(event){
            var $this = this,
                flag = false;
            var brandID,
                brandName,
                channelId;
            var current = $(event.currentTarget);
            var saveBrandData = $("#brandInfo");

            flag = $this.validateBrand($("#brandInfo").serializeObject());
            if ($(current).hasClass("disable"))return;
            $(current).addClass("disable");

            if(saveBrandData.length && flag){
                var param = {},
                    paramData = [],
                    paramArr = [],
                    channelInfo,
                    pageId = $("body").data("page-id"),
                    channelArray = [],
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
                param.id = $this.callBackId;
                param.channels = channelArray;
                $.ajax({
                    type:"post",
                    dataType:"json",
                    url:"/api/internal/sas/brand/save",
                    data: {
                        data: JSON.stringify(param)
                    },
                    success:function(data){
                        console.log(data.msg);
                    },
                    error: function(err){
                        console.log("出现异常");
                    }
                });

                //保存组件
                saveData('0',function (data, formData) {
                    var brandId = $this.callBackId;
                    //var brandId = $("#brandInfo").find("input[name='brandId']").val();
                    if(data.code==1){
                        window.location.href='/app/brand/'+data.data.pageId+"/"+brandId;
                    }else{
                        $(current).removeClass("disable");
                        alert(data.msg);
                    }
                }, $(event.currentTarget));
            }
        },
        validateBrand: function (param) {
            var obj = param ? param:null;
            for(var i in obj){
                if(obj[i] == ""){
                    var target = $("#brandInfo").find("input[name="+i+"]");
                    if(!target.hasClass("err")){
                        target.addClass("err");
                    }
                    alert("品牌页属性有必填项未填写");
                    return false;
                }else{
                    var target = $("#brandInfo").find("input[name="+i+"]");
                    target.removeClass("err");
                    return true;
                }
            }
        },
        publish:function(event){
            var $this = this;
            var current = $(event.currentTarget);
            if ($(current).hasClass("disable"))return;
            $(current).addClass("disable");
            saveData('1',function (data, formData) {
                var brandId = $this.callBackId;
                //var brandId = $("#brandInfo").find("input[name='brandId']").val();
                if(data.code==1){
                    window.location.href='/app/brand/'+data.data.pageId+"/"+brandId;
                }else{
                    $(current).removeClass("disable");
                    alert(data.msg);
                }
            }, $(event.currentTarget));
        },
        getBrandInfo: function () {
            var $this = this,
                pathname = window.location.pathname.slice(-1),
                brandId = pathname?pathname:1;
            $this.channelsData = {
                one: {
                    name: "",
                    url: ""
                },
                two: {
                    name: "",
                    url: ""
                },
                three: {
                    name: "",
                    url: ""
                }
            };
            $.ajax({
                type:"post",
                dataType:"json",
                data: {"id": brandId},
                url:"/api/internal/sas/brand/detail",
                success:function(data){
                    if(data.code == 1){
                        var channels = data.data.channels;
                        $this.brandData = data.data;
                        $this.callBackId = data.data.id;
                        $this.cbBrandId = data.data.brandId;
                        if(channels && channels.length > 0){
                            if(channels[0].name){
                                $this.channelsData.one.name = channels[0].name;
                                if(channels[0].url){
                                    $this.channelsData.one.url = channels[0].url;
                                }
                            }
                            if(channels[1].name){
                                $this.channelsData.two.name = channels[1].name;
                                if(channels[1].url){
                                    $this.channelsData.two.url = channels[1].url;
                                }
                            }
                            if(channels[2].name){
                                $this.channelsData.three.name = channels[2].name;
                                if(channels[2].url){
                                    $this.channelsData.three.url = channels[2].url;
                                }
                            }
                        }
                    }
                },
                error: function(err){
                    console.log("出现异常");
                }
            });
        },
        getBrandId: function (name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return (r[2]);
            return null;
        }
    },
    ready: function () {
        var $this = this;
        sortableInit(this);
        $this.getBrandInfo();
    }
});


