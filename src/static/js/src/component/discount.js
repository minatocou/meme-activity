/**
 * Created by carina on 17/2/16.
 */
var discountComponent = Vue.extend({
    props:['setting'],
    data: function(){
        return {
            extendClass:{'discount':true}
        }
    },
    template: __inline('../template/_discount-mini.html?__inline'),
    methods:{
    },
    created: function () {
        
    }
});
Vue.component('discount', discountComponent);

var discountFormComponent = Vue.extend({
    data: function(){
        return {
            setting:{},//必要
            show:false,//必要
            urlType:{
                url:{value:"URL",palceholderVal:"URL"},
                channel:{value:"频道ID",palceholderVal:"示例:1234"},
                detail:{value:"SKU",palceholderVal:"示例:CBD492"},
                brand:{value:"品牌ID",palceholderVal:"示例：123"},
                category:{value:"前台分类",palceholderVal:"示例:面膜"},
                function:{value:"功效",palceholderVal:"示例:补水保湿"},
                search:{value:"搜索",palceholderVal:"搜索关键词"},
            },
            i18n: window.i18n[document.body.getAttribute('data-localize')],
        }
    },
    methods: {
        addDiscount: function (event) {
            var $this=this;
            var parent = $(event.currentTarget).closest(attrClass);
            var uid = uuid();
            $this.setting.data.push({
                status:'1',
                discount_time:"",
                category_id:"",
                url_type:"",
                url_text:"",
                item_action_url:"",
                item_action_url_type:'',
                id:uid
            });
            binChange();//必要
            var timer = setTimeout(function(){
                $this.resetSetting(parent);
                clearTimeout(timer);
            },30);
        },
        initDate: function (event) {
            $(event.target).datetimepicker({
                format:'Y/m/d',
                timepicker:false
            });
        },
        slideItem:function(event){
            var $this = this;
            var currentDom = event.currentTarget;
            $(currentDom).find('.fa').toggleClass('fa-caret-right');
            $(currentDom).siblings('.itemBody').slideToggle();
        },
        status:function(obj){
            var state = $('body').data("state");
            var serverTime = $('body').data("server-time");
            var status = obj['status'];

            var discountTime = obj['discount_time'].replace(/-/g,'/');
            var discountTimeTamp= new Date(discountTime).getTime()/1000;
            if(state==1){
                if(status==1){
                    if(serverTime<discountTime){
                        return '未开始';
                    }else if(serverTime=discountTime){
                        return '已上线';
                    }else {
                        return '已过期'
                    }
                }else{
                    return '已关闭';
                }
            }else{
                if(status==0){
                    return "已关闭";
                }else {
                    return '--'
                }
            }

        },
        changeUrlType:function (event) {
            var selectDom = event.currentTarget;
            var placeholder = $(selectDom).find("option:selected").data("placeholder");
            $(selectDom).siblings(".inputWord").attr("placeholder",placeholder);
            var type = $(selectDom).find("option:selected").data("link_type");
            $(selectDom).siblings(".inputWord").val('');
            var input = $(selectDom).siblings(".inputWord").val();
            var link = convertToAPPLink(type,input);
            $(selectDom).siblings("[name=item_action_url]").val(link);
            $(selectDom).siblings("[name=item_action_url_type]").val(type);
        },
        changeUrlInput:function (event) {
            var inputDom = event.currentTarget;
            var type = $(inputDom).siblings("select.appLink").find("option:selected").data("link_type");
            var input = $(inputDom).val();
            var link = convertToAPPLink(type,input);

            $(inputDom).siblings("[name=item_action_url]").val(link);
            $(inputDom).siblings("[name=item_action_url_type]").val(type);
        },
        shutDiscount:function(event){
            var $this = this;
            var parent = $(event.currentTarget).closest(attrClass);
            var thisId = $(event.currentTarget).closest('.singleItem').find('.uid').val();
            var settingData = $this.setting.data;
            for(var i=0;i<settingData.length;i++){
                if(thisId==settingData[i]['id']){
                    settingData[i]['status']=0;
                }
            }
            $this.setting.data = settingData;
            var timer= setTimeout(function () {
                $this.resetSetting(parent);
                var state = $('body').data("state");
                saveData(state,function (data, formData) {
                    if(data.code==1){
                        window.location.href='/app/home/'+data.data.pageId;
                    }else{
                        alert(data.msg);
                    }
                }, $(event.currentTarget));
                clearTimeout(timer);
            },30);
        },
        openDiscount:function(event){
            var $this = this;
            var parent = $(event.currentTarget).closest(attrClass);
            var thisId = $(event.currentTarget).closest('.singleItem').find('.uid').val();
            var settingData = $this.setting.data;
            for(var i=0;i<settingData.length;i++){
                if(thisId==settingData[i]['id']){
                    settingData[i]['status']=1;
                }
            }
            $this.setting.data = settingData;

            var timer= setTimeout(function () {
                $this.resetSetting(parent);
                var state = $('body').data("state");
                saveData(state,function (data, formData) {
                    if(data.code==1){
                        window.location.href='/app/home/'+data.data.pageId;
                    }else{
                        alert(data.msg);
                    }
                }, $(event.currentTarget));
                clearTimeout(timer);
            },30);
        },
        deleteDiscount:function(event){
            var $this = this;
            var parent = $(event.currentTarget).closest(attrClass);
            var thisId = $(event.currentTarget).closest('.singleItem').find('.uid').val();
            var settingData = $this.setting.data;
            var newArray = [];
            for(var i=0;i<settingData.length;i++){
                if(thisId!=settingData[i]['id']){
                    newArray.push(settingData[i]);
                }
            }
            $this.setting.data = newArray;
            var timer= setTimeout(function () {
                $this.resetSetting(parent);
                var state = $('body').data("state");
                saveData(state,function (data, formData) {
                    if(data.code==1){
                        window.location.href='/app/home/'+data.data.pageId;
                    }else{
                        alert(data.msg);
                    }
                }, $(event.currentTarget));
                clearTimeout(timer);
            },30);

        },
        resetSetting:function(parent){
            var commonConf = $(parent).find("form.commonConf").eq(0).serializeObject();
            var singleConf = $(parent).find(".singleConf form.singleItem");
            var singleLength = $(singleConf).length;
            var singles=[];
            if(singleLength>0){
                for(var i=0;i<singleLength;i++){
                    singles.push($(singleConf[i]).serializeObject());
                }
            }
            var data = _.extend(commonConf, {data:singles});
            resetForm(data);
        },
        subForm:function () {
            var $this=this;
        },
    },
    template: __inline('../template/_discount-form.html?__inline'),
    created: function () {
        console.log()

    },
});
Vue.component('discount-form', discountFormComponent);