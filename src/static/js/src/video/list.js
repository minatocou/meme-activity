/**
 * Created by carina on 17/3/9.
 */
$(document).ready(function () {

    $("form.search").on("blur","input",function(){
        $(this).val($.trim($(this).val()));
    });

    $(".appList").on("click",".searchBtn",function(){
        var param = $(this).parent(".search").serialize();
        location.href = '?'+param;
    });

    $(".appList").on("click",".statusBtn",function(){
        var status;
        if($(this).hasClass('open')){
            status = 0;
        }else{
            status = 1;
        }
        var videoId = $(this).parents("tr").data('videoid');
        var param = {
            video_id:videoId,
            status:status,
        }
        $.ajax({
            type:"post",
            dataType:"json",
            url:"/api/internal/sas/video/status",
            data:param,
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


    $(".appList").on("click",".delete",function(){
        if(confirm('确定删除该视频?')){
            var videoId = $(this).parents("tr").data('videoid');
            var param = {
                video_id:videoId,
            };
            $.ajax({
                type:"post",
                dataType:"json",
                url:"/api/internal/sas/video/delete",
                data:param,
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
        }

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
        // totalPage:6,
        showGoInput: true,
        showGoButton: true,
        pageNumber: getSearch('page') || 1,
        afterPageOnClick: function (e, index) {
            if(isSearch()){
                var param = $("form.search").serialize();
                location.href = '?page=' + index.trim() + '&' +param;
            }else{
                location.href = '?page=' + index.trim();
            }

        },
        afterPreviousOnClick: function (e, index) {
            if(isSearch()) {
                var param = $("form.search").serialize();
                location.href = '?page=' + index.trim() + '&' + param;
            }else{
                location.href = '?page=' + index.trim();
            }
        },
        afterNextOnClick: function (e, index) {
            if(isSearch()) {
                var param = $("form.search").serialize();
                location.href = '?page=' + index.trim() + '&' +param;
            }else{
                location.href = '?page=' + index.trim() + '&' +param;
            }
        },
        afterGoButtonOnClick: function (e, index) {
            if(isSearch()) {
                var param = $("form.search").serialize();
                var i = index.trim();
                (i != '') && (location.href = '?page=' + i + '&' + param);
            }else{
                var i = index.trim();
                (i != '') && (location.href = '?page=' + i );
            }
        },
        callback: function () {

        }
    });

    var isSearch = function(){
        var href = window.location.href;
        var page = getSearch('page');
        var splitStr;
        if(page){
            splitStr = "list?page="+page;
        }else{
            splitStr='list';
        }
        var hrefAry = href.split(splitStr);

        if(hrefAry[1]!=''){
            return true;
        }else{
            return false;
        }
    }

});