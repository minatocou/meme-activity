/**
 * Created by carina on 17/3/27.
 */
/**
 * Created by carina on 17/3/9.
 */
$.ajaxSetup({cache: false});
//ajax过渡
$(document).ajaxStart(function () {
      $('.ajax-loading-backdrop').show();
    }).ajaxStop(function () {
      $('.ajax-loading-backdrop').hide();
    });
$(document).ready(function () {
    var initDate=function () {
        $('input[name=preStart]').datetimepicker({
            format:'Y/m/d H:i'
        });
    };

    initDate();

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };


    $(".liveForm").on("click",".close-btn",function(){
        $(this).parents(".uploadImgBox").find('.imgBox').removeClass('showImg');
        $(this).parents(".uploadImgBox").find('.imgInput').val('');
        $(this).parents(".uploadImgBox").find('.imgUrl').attr('src','');
    });

    $(".liveCon").on("click",".saveLive",function(){
        if(!$(this).hasClass('disable')){
            $(this).addClass("disable");
            var param = $(".liveForm").serializeObject();
            if(validate(param)){
                $.ajax({
                    type:"post",
                    dataType:"json",
                    url:"/api/internal/sas/live/save",
                    data:param,
                    success:function(data){
                        if(data.code==1){
                            alert(data.msg);
                            window.location.href='/live/edit/'+data.data.liveRoomId;
                        }else if(data.code==0){
                            alert(data.msg);
                        }
                        $(".saveLive").removeClass("disable");
                    },
                    error: function(err){
                        console.log("出现异常");
                    }
                });

            };
        }

    });

    function validate(data){
        if(!$.trim(data.bgUrl)){
            alert('请上传直播间背景图片!');
            $(".saveLive").removeClass("disable");
            return;
        }
        if(!$.trim(data.title)){
            alert('请填写直播间名称!');
            $(".saveLive").removeClass("disable");
            return;
        }
        if(!$.trim(data.pwd)){
            alert('请填写直播间密码!');
            $(".saveLive").removeClass("disable");
            return;
        }
        if(!$.trim(data.info)){
            alert('请填写直播间简介!');
            $(".saveLive").removeClass("disable");
            return;
        }
        if(!$.trim(data.avatar)){
            alert('请上传主播头像!');
            $(".saveLive").removeClass("disable");
            return;
        }
        if(!$.trim(data.name)){
            alert('请填写主播名称!');
            $(".saveLive").removeClass("disable");
            return;
        }
        if(!$.trim(data.preStart)){
            alert('请选择预计开始时间!');
            $(".saveLive").removeClass("disable");
            return;
        }
        if(!$.trim(data.shareImg)){
            alert('请上传分享图片!');
            $(".saveLive").removeClass("disable");
            return;
        }
        if(!$.trim(data.shareTitle)){
            alert('请填写分享名称!');
            $(".saveLive").removeClass("disable");
            return;
        }
        if(!$.trim(data.shareDesc)){
            alert('请填写分享描述!');
            $(".saveLive").removeClass("disable");
            return;
        }

        //字数限制
        if(data.title.length>20){
            alert('直播间名称长度不超过20!');
            $(".saveLive").removeClass("disable");
            return;
        }
        if(data.info.length>50){
            alert('直播间简介长度不超过50!');
            $(".saveLive").removeClass("disable");
            return;
        }
        if(data.name.length>15){
            alert('请填写主播名称长度不超过15!');
            $(".saveLive").removeClass("disable");
            return;
        }
        if(data.shareTitle.length>20){
            alert('分享名称长度不超过20!');
            $(".saveLive").removeClass("disable");
            return;
        }
        if(data.shareDesc.length>30){
            alert('分享描述长度不超过30!');
            $(".saveLive").removeClass("disable");
            return;
        }

        return true;
    }

});