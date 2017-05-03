/**
 * Created by yate on 2017/3/18.
 */
var teleComponent = Vue.extend({
    props: ['setting'],
    data: function(){
        return {
            extendClass:{'imagetext': true}
        }
    },
    template: __inline('../template/_imagetext-min.html?__inline'),
    methods:{
    },
    created: function (){

    }
});
Vue.component('imagetext', teleComponent);

var teleFormComponent = Vue.extend({
    data: function(){
        return {
            setting:{
                status: 0
            },//必要
            show:false,//必要
            i18n: window.i18n[document.body.getAttribute('data-localize')]
        }
    },
    methods: {
        slideItem:function(event){
            var $this = this;
            var currentDom = event.currentTarget;
            $(currentDom).find('.fa').toggleClass('fa-caret-right');
            $(currentDom).siblings('.itemBody').slideToggle();
        },
        initDate: function (event,ctime,type) {
            var options={};
            if(ctime && type=='start'){
                options['maxDate']=ctime;
            }
            if(ctime && type=='end'){
                options['minDate']=ctime;
            }
            $(event.target).datetimepicker({
                onShow:function( ct ){
                    this.setOptions(options)
                }
            });
        },
        shutImagetext:function(event){
            var $this = this;
            $this.setting.status = 0;
            resetForm({"status": 0});
            var timer= setTimeout(function () {
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
        openImagetext:function(event){
            var $this = this;
            $this.setting.status = 1;
            resetForm({"status": 1});
            var timer= setTimeout(function () {
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
        }
    },
    template:  __inline('../template/_imagetext-form.html?__inline'),
    created: function () {
        console.log(this.setting)
    }
});

Vue.component('imagetext-form', teleFormComponent);