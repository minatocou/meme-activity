/**
 * Created by memebox on 17/4/6.
 */
/**
 * Created by memebox on 17/3/15.
 */
$(function(){
    template.config('openTag', '${');
    template.config('closeTag', '}');
    template.helper('stringify' , function(data){
        return JSON.stringify(data);
    })
    $("#dataTbody").html("<tr><td colspan='14' style='text-align: center'>正在加载数据......</td></tr>")
    $(".fullfill").click(function(){
        $(".sidebar-container , .header-container").toggleClass("hide")
        $(".data-container").toggleClass("full")
    })
    $("#isReq").prop("checked" , false);
    $("#isReq").click(function(){
        $(".log-hide").toggleClass('hide')
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
            url:"/log/search",
            type: 'post',
            dataType: 'json',
            data : $("form").serialize(),
            success : function(data){
                $("#search").removeClass("disabled");
                if( data && data.file && data.file.length ){
                    $('#pagination-container').pagination({
                        dataSource: data.file,
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
    $.ajax({
        url:"/log/index",
        type: 'post',
        dataType: 'json',
        data : $("form").serialize(),
        success : function(data){
            $("#search").removeClass("disabled");
            if( data && data.file && data.file.length ){
                $('#pagination-container').pagination({
                    dataSource: data.file,
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