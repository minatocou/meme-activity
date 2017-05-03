/**
 * Created by yate on 2017/3/18.
 */
Vue.config.delimiters = ['${', '}'];
__inline('../component/imagetext.js?__inline');
__inline('../component/banner.js?__inline');
__inline('../component/icon.js?__inline');
__inline('../component/bulletin.js?__inline');
__inline('../component/special.js?__inline');
__inline('../component/discount.js?__inline');
__inline('../component/activity.js?__inline');
__inline('../component/groupon.js?__inline');
__inline('../component/favor.js?__inline');
__inline('../component/separate.js?__inline');
__inline('../component/brand-cate.js?__inline');
__inline('../component/brand-home.js?__inline');

var vue = new Vue({
    el:'html',
    data:{

    },
    methods:{
        saveData:function(event){
            var $this = this;
            var current = $(event.currentTarget);
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
        }
    },
    ready: function () {
        var $this = this;
        sortableInit(this);
    }
});