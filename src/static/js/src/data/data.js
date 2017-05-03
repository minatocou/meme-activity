/**
 * Created by memebox on 17/3/15.
 */
$(function(){
    template.config('openTag', '${');
    template.config('closeTag', '}');
    $("#dataTbody").html("<tr><td colspan='14' style='text-align: center'>请开始搜索</td></tr>")
    $(".fullfill").click(function(){
        $(".sidebar-container , .header-container").toggleClass("hide")
        $(".data-container").toggleClass("full")
    })
    $("#from_date").datetimepicker({
        timepicker:false,
        format:'Y-m-d'
    })

    $("#to_date").datetimepicker({
        timepicker:false,
        format:'Y-m-d',
        onShow : function(time , ct){
            var fromVal = $("#from_date").val()
            this.setOptions({
                minDate:fromVal?fromVal:false
            })
        }
    })
    $("#search").click(function(){
        if($("#search").hasClass("disabled")){
            return false
        }
        $("#search").addClass("disabled");
        $("#dataTbody").html("<tr><td colspan='14' style='text-align: center'>正在加载数据......</td></tr>")
        $.ajax({
            url:"/data/search",
            type: 'post',
            dataType: 'json',
            data : $("form").serialize(),
            success : function(data){
                $("#search").removeClass("disabled");
                if( data.length ){
                    $('#pagination-container').pagination({
                        dataSource: data,
                        pageNumber : 1,
                        pageSize :10,
                        callback : function(sourceData){
                            var html = template('data-template', {list :sourceData});
                            $("#dataTbody").html(html);
                        }
                    })
                }else{
                    $("#dataTbody").html("<tr><td colspan='14' style='text-align: center'>无数据</td></tr>")
                }

            },
            error : function(){
                $("#dataTbody").html("<tr><td colspan='14' style='text-align: center'>加载失败</td></tr>")
            }
        })
    })

})