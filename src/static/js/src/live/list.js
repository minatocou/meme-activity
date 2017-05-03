/**
 * Created by carina on 17/3/27.
 */
$.ajaxSetup({cache: false});
//ajax过渡
$(document).ajaxStart(function () {
      $('.ajax-loading-backdrop').show();
    }).ajaxStop(function () {
      $('.ajax-loading-backdrop').hide();
    });
$(document).ready(function () {

    $(".liveList").on("click",".closeLive",function(){
        var liveRoomId = $(this).parents("tr").data('liveroomid');
        if(!confirm('确认要关闭吗？')){
            return;
        }
        $.ajax({
            type:"get",
            dataType:"json",
            url:"/api/internal/sas/live/disableRoom?liveRoomId="+liveRoomId,
            success:function(data){
                if(data.code==1){
                    alert(data.msg);
                    window.location.reload();
                }else{
                    alert(data.msg);
                }
            },
            error: function(err){
                console.log("出现异常");
            }
        });
    });
    
    function getSearch(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)",'i');
        var result = decodeURIComponent(window.location.search).substr(1).match(reg);
        if(result!=null) return result[2];
        return null;
    }

    var pagesArr = $('#pagesObj').html().split(',');
    (pagesArr[1].trim() != 0) && $('#pagination-container').pagination({
        dataSource: new Array(parseInt(pagesArr[1].trim())),
        pageSize: pagesArr[0].trim(),
        showGoInput: true,
        showGoButton: true,
        pageNumber: getSearch('page') || 1,
        afterPageOnClick: function (e, index) {
            location.href = '?page=' + index.trim();
        },
        afterPreviousOnClick: function (e, index) {
            location.href = '?page=' + index.trim();
        },
        afterNextOnClick: function (e, index) {
            location.href = '?page=' + index.trim() + '&' +param;
        },
        afterGoButtonOnClick: function (e, index) {
            var i = index.trim();
            (i != '') && (location.href = '?page=' + i );
        },
        callback: function () {

        }
    });
    
});