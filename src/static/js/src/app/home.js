/**
 * Created by carina on 17/2/8.
 */
Vue.config.delimiters = ['${', '}']
__inline('../component/banner.js?__inline');
__inline('../component/icon.js?__inline');
__inline('../component/bulletin.js?__inline');
__inline('../component/special.js?__inline');
__inline('../component/discount.js?__inline');
__inline('../component/activity.js?__inline');
__inline('../component/groupon.js?__inline');
__inline('../component/favor.js?__inline');
__inline('../component/separate.js?__inline');
__inline('../component/video.js?__inline');
__inline('../component/imagetext.js?__inline');
__inline("../component/flashsale.js?__inline");
__inline("../component/favorcom.js?__inline");
__inline("../component/live.js?__inline");
__inline('../component/newcomer.js?__inline');
var vue = new Vue({
    el:'html',
    
    data:{

    },
    methods:{
        saveData:function(event){
            var $this = this;
            var current = $(event.currentTarget);
            if($("#canvas .flashsale").length>1){
                alert("只支持一个秒杀活动");
                return false;
            }
            if ($(current).hasClass("disable"))return;
            $(current).addClass("disable");
            saveData('0',function (data, formData) {
                if(data.code==1){
                    window.location.href='/app/home/'+data.data.pageId;
                }else{
                    $(current).removeClass("disable");
                    alert(data.msg);
                }
            }, $(event.currentTarget));
        },
        publish:function(event){
            var $this = this;
            var current = $(event.currentTarget);
            if ($(current).hasClass("disable"))return;
            $(current).addClass("disable");
            saveData('1',function (data, formData) {
                if(data.code==1){
                    window.location.href='/app/home/'+data.data.pageId;
                }else{
                    $(current).removeClass("disable");
                    alert(data.msg);
                }
            }, $(event.currentTarget));
        },
        preview:function(event){
            var $this = this;
            var current = $(event.currentTarget);
            if ($(current).hasClass("disable"))return;
            $(current).addClass("disable");
            saveData('0',function (data, formData) {
                if(data.code==1){
                    var preview_url = $("body").data("h5")+"?preview";
                    $(".preview").append("<iframe src=" + preview_url + " frameborder='0'></iframe>");
                    $('#qrCode').qrcode({width: 64, height: 64, text: preview_url});
                    $(".qr .p-link p").html(preview_url);
                    $(".preview-wrapper").show();
                    //window.location.href='/app/home/'+data.data.pageId;
                }else{
                    alert(data.msg);
                }
                $(current).removeClass("disable");
            }, $(event.currentTarget));
        },
        closePreview:function (event) {
                $(".preview").html("");
                $('#qrCode').html("");
                $(".qr .p-link p").html("");
                $('.preview-wrapper .preview').html('');
                $(".preview-wrapper").hide();

        }
    },
    ready: function () {
        sortableInit(this);
    }
})


