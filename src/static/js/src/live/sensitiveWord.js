/**
 * Created by carina on 17/4/1.
 */
template.config('openTag', '${');
template.config('closeTag', '}');
$.ajaxSetup({cache: false});
//ajax过渡
$(document).ajaxStart(function () {
      $('.ajax-loading-backdrop').show();
    }).ajaxStop(function () {
      $('.ajax-loading-backdrop').hide();
    });
$(document).ready(function(){
    $('.addWordBtn').on('click',function(){
        var wordDom = $(this).siblings('input[name="word"]');
        var word = $(wordDom).val();
        $.ajax({
            type:'get',
            url:'/api/internal/sas/live/addWordFilter?word='+word,
            dataType:'json',
            success:function(data){
                if(data.code==1){
                    $(wordDom).val('');
                    updateList();
                }else{
                    alert(data.msg);
                }
            },
            error: function(err){
                console.log("出现异常");
            }
        })

    });

    $('.sensitiveWord').on('click','.deleteWordBtn',function(){
        var word = $(this).parents('tr').find('.wordBox').html();
        $.ajax({
            type:'get',
            url:'/api/internal/sas/live/deleteWordFilter?word='+word,
            dataType:'json',
            success:function(data){
                if(data.code==1){
                    updateList();
                }else{
                    alert(data.msg);
                }
            },
            error: function(err){
                console.log("出现异常");
            }
        })

    });

    updateList();

    function updateList(){
        $.ajax({
            type:'get',
            url:"/api/internal/sas/live/listWordFilter",
            dataType:'json',
            success:function(data){
                if(data.code==1){
                    var list = data.data;
                    var html = template('sensitive-list-tmpl',{sensitiveData:list});
                    $('.sensitiveBody').html(html);
                }
            },
            error: function(err){
                console.log("出现异常");
            }
        })
    }



})