/**
 * Created by carina on 17/3/17.
 */

var videoComponent = Vue.extend({
    props:['setting'],
    data: function(){
        return {
            extendClass:{'video':true}
        }
    },
    template: __inline('../template/_video-mini.html?__inline'),
    methods:{
    },
    created: function () {
        //console.log(this.setting)
    }
});
Vue.component('video', videoComponent);


var videoFormComponent = Vue.extend({
    data: function(){
        return {
            setting:{},//必要
            show:false,//必要
            i18n: window.i18n[document.body.getAttribute('data-localize')],
        }
    },
    methods: {
        addVideo: function () {
            var $this=this;
            var parent = $(event.currentTarget).closest(attrClass);
            var uid = uuid();
            $this.setting.data.push({
                status:'1',
                start_time:'',
                end_time:'',
                video_id:'',
                video_title:'',
                video_url:'',
                video_img:'',
                id:uid
            });
            binChange();//必要
            var timer = setTimeout(function(){
                $this.resetSetting(parent);
                clearTimeout(timer);
            },30);
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
        shutVideo:function(event){
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
        emptyVideo:function (event) {
            var $this = this;
            var parentForm = $(event.currentTarget).closest(attrClass);
            var parent = $(event.currentTarget).closest('.singleItem');
            $(parent).find('input[name=video_title]').val("");
            $(parent).find('input[name=video_url]').val("");
            $(parent).find('input[name=video_img]').val("");
            $(parent).find('.videoImg').hide().attr('src','');
            var timer = setTimeout(function(){
                $this.resetSetting(parentForm);
                clearTimeout(timer);
            },300);  
        },
        readVideo:function(event){
            var $this = this;
            var parentForm = $(event.currentTarget).closest(attrClass);
            var parent = $(event.currentTarget).closest('.singleItem');
            var videoId = $(parent).find('input[name=video_id]').val();
            if(videoId){
                var param = {
                    video_id:videoId
                };
                $.ajax({
                    type:"get",
                    dataType:"json",
                    url:"/api/internal/sas/video/list",
                    data: param,
                    success:function(data){
                        if(data.code==1){
                            if(data.total!=0&&data.data[0].status==1){
                                var videoInfo = data.data[0];
                                $(parent).find('input[name=video_title]').val(videoInfo.title);
                                $(parent).find('input[name=video_url]').val(videoInfo.video_url);
                                var videoImg;
                                if(videoInfo.img_url){
                                    videoImg = videoInfo.img_url;
                                }else{
                                    videoImg = videoInfo.video_img;
                                }
                                $(parent).find('input[name=video_img]').val(videoImg);
                                $(parent).find('.videoImg').show().attr('src',videoImg);

                                var timer1 = setTimeout(function(){
                                    $this.resetSetting(parentForm);
                                    clearTimeout(timer1);
                                },300);
                            }else if(data.total!=0&&data.data[0].status==0){
                                alert('该视频状态为关闭状态');
                            }else if(data.total==0){
                                alert('无该视频');
                            }
                        }
                    },
                    error: function(err){
                        console.log("出现异常");
                    }
                });
            }else{
                $(parent).find('input[name=video_title]').val("");
                $(parent).find('input[name=video_url]').val("");
                $(parent).find('input[name=video_img]').val("");
                $(parent).find('.videoImg').hide().attr('src','');
                var timer = setTimeout(function(){
                    $this.resetSetting(parentForm);
                    clearTimeout(timer);
                },300);
            }
        },
        openVideo:function(event){
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
        deleteVideo:function(event){
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
    template: __inline('../template/_video-form.html?__inline'),
    created: function () {
        console.log()

    },
});
Vue.component('video-form', videoFormComponent);