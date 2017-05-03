/**
 * Created by carina on 17/4/18.
 */
template.config('openTag', '${');
template.config('closeTag', '}');
$.ajaxSetup({cache: false});
$(document).ready(function () {
    var pageSize = 10;
    var initPage = '1';

    $("form.search").on("blur","input",function(){
        $(this).val($.trim($(this).val()));
    });

    $(".appList").on("click",".searchBtn",function(){
        updateList(initPage);
    });

    updateList(initPage);

    $(".search input[name=starttime]").datetimepicker({
        format:'Y/m/d H:i'
    });
    $(".search input[name=endtime]").datetimepicker({
        format:'Y/m/d H:i'
    });

    function initPagination(pageSize,pageCurrent,pageTotal){
        (pageTotal != 0) && $('#pagination-container').pagination({
            dataSource: new Array(parseInt(pageTotal)),
            pageSize: pageSize,
            //totalPage:6,
            showGoInput: true,
            showGoButton: true,
            pageNumber: pageCurrent || 1,
            afterPageOnClick: function (e, index) {
                updateList(index.trim());
            },
            afterPreviousOnClick: function (e, index) {
                updateList(index.trim());
            },
            afterNextOnClick: function (e, index) {
                updateList(index.trim());
            },
            afterGoButtonOnClick: function (e, index) {
                var i = index.trim();
                (i != '') && (updateList(i));
            },
            callback: function () {

            }
        });
    }


    function updateList(page){
        var param = {
            filter:{
                sku:$('form.search').find('input[name=sku]').val(),
                starttime:$('form.search').find('input[name=starttime]').val(),
                endtime:$('form.search').find('input[name=endtime]').val(),
            },
            sort:$('form.search').find('select[name=sort]').val(),
            page:page,
            pageSize:pageSize
        };

        var sendParam = JSON.stringify(param);
        $.ajax({
            type:'post',
            url:"/api/internal/sas/subscription/view",
            data:sendParam,
            //data:param,
            dataType:'json',
            success:function(data){
                if(data.code==1){
                    var list = data.data;
                    var pageCount = data.pageCount;
                    var pageCurrent = data.page;
                    var html = template('subscription-list-tmpl',{subscriptionData:list});
                    $('.subscription').html(html);

                    if(data.page == '1'){
                        initPagination(pageSize,pageCurrent,pageCount*pageSize);
                    }
                }
            },
            error: function(err){
                console.log("出现异常");
            }
        })
    }

});