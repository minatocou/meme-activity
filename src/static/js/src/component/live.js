/**
 * Created by carina on 17/3/29.
 */

var liveComponent = Vue.extend({
    props:['setting'],
    data: function(){
        return {
            extendClass:{'live':true}
        }
    },
    template: __inline('../template/_live-mini.html?__inline'),
    methods:{
    },
    created: function () {
        //console.log(this.setting)
    }
});
Vue.component('live', liveComponent);


var liveFormComponent = Vue.extend({
    data: function(){
        return {
            setting:{},//必要
            show:false,//必要
            i18n: window.i18n[document.body.getAttribute('data-localize')],
        }
    },
    methods: {
        /*addLive: function () {
            var $this=this;
            var parent = $(event.currentTarget).closest(attrClass);
            var uid = uuid();
            $this.setting.data.push({
                status:'1',
                start_time:'',
                end_time:'',
                live_id:'',
                live_title:'',
                live_url:'',
                live_img:'',
                id:uid
            });
            binChange();//必要
            var timer = setTimeout(function(){
                $this.resetSetting(parent);
                clearTimeout(timer);
            },30);
        },*/
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
        slideItem:function(event){
            var $this = this;
            var currentDom = event.currentTarget;
            $(currentDom).find('.fa').toggleClass('fa-caret-right');
            $(currentDom).siblings('.itemBody').slideToggle();
        },
        /*status:function(obj){
            var state = $('body').data("state");
            var serverTime = $('body').data("server-time");
            var status = obj['status'];

            var startTime = obj['start_time'].replace(/-/g,'/');
            var startTimeTamp= new Date(startTime).getTime()/1000;
            var endTime = obj['end_time'].replace(/-/g,'/');
            var endTimeTamp= new Date(endTime).getTime()/1000;
            if(state==1){
                if(status==1){
                    if(serverTime<startTimeTamp){
                        return '未开始';
                    }else if(serverTime<endTimeTamp){
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
        shutLive:function(event){
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
        },*/
        emptyLive:function (event) {
            var $this = this;
            var parentForm = $(event.currentTarget).closest(attrClass);
            var parent = $(event.currentTarget).closest('.singleItem');
            $(parent).find('input[name=is_pass]').val("0");
            var timer = setTimeout(function(){
                $this.resetSetting(parentForm);
                clearTimeout(timer);
            },300);
        },
        readLive:function(event){
            var $this = this;
            var parentForm = $(event.currentTarget).closest(attrClass);
            var parent = $(event.currentTarget).closest('.singleItem');
            var liveRoomId = $(parent).find('input[name=liveRoomId]').val();
            if(liveRoomId){
                var param = {
                    liveRoomId:liveRoomId
                };
                $.ajax({
                    type:"get",
                    dataType:"json",
                    url:"/api/internal/sas/live/detail",
                    data: param,
                    success:function(data){
                        if(data.code==1){
                            $(parent).find('input[name=is_pass]').val('1');
                            alert('校验成功')
                            var timer1 = setTimeout(function(){
                                $this.resetSetting(parentForm);
                                clearTimeout(timer1);
                            },300);
                        }else{
                            alert('校验失败');
                            $(parent).find('input[name=is_pass]').val('0');
                            var timer = setTimeout(function(){
                                $this.resetSetting(parentForm);
                                clearTimeout(timer);
                            },300);
                        }
                    },
                    error: function(err){
                        console.log("出现异常");
                    }
                });
            }else{
                $(parent).find('input[name=is_pass]').val('0');
                var timer = setTimeout(function(){
                    $this.resetSetting(parentForm);
                    clearTimeout(timer);
                },300);
            }
        },
        /*openLive:function(event){
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
        deleteLive:function(event){
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

        },*/
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
    watch: {
        'setting.data[0].start_time': function (newVal,oldVal) {
            this.$nextTick(function () {
                if(newVal && this.setting.data[0].end_time && (+new Date(this.setting.data[0].end_time) < +new Date(newVal))) {
                    alert('开始日期不能晚于结束日期');
                    this.setting.data[0].start_time = '';
                    return;
                } 
            });
        },
        'setting.data[0].end_time': function (newVal,oldVal) {
            this.$nextTick(function () {
                if(newVal && this.setting.data[0].start_time && (+new Date(this.setting.data[0].start_time) > +new Date(newVal))) {
                    alert('开始日期不能晚于结束日期');
                    this.setting.data[0].end_time = '';
                    return;
                } 
            });
        }
    },
    template: __inline('../template/_live-form.html?__inline'),
    created: function () {
        console.log()

    },
});
Vue.component('live-form', liveFormComponent);