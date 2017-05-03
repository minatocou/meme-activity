/**
 * Created by memebox on 16/9/26.
 */
$(function(){
    var actiontpl = Handlebars.compile($("#action-template").html()),
        emptytpl = $("#empty-template").html();

    $.ajax({
        type:"post",
        dataType:"json",
        url:"/api/action/get",
        beforeSend: function(){

        },
        success:function(data){
            if (parseInt(data.code)) {
                if (data.data.length != 0) {
                    $('#pagination-container').pagination({
                        dataSource: data.data,
                        callback: function (data, pagination) {
                            var html = actiontpl(data);
                            $("#action-body").html(html);
                        }
                    })


                } else {
                    $("#action-body").html("暂时没有数据");
                }
            }
            
        },
        error: function(err){
            console.log("出现异常");
        }
    });
    
    $("#action-body").on("click" , ".btn-success" , function(){
        if(!$.trim($(".action-name").val())||!$.trim($(".name-view").val())){
            alert("权限描述和权限名称不能为空");
            return false;
        }

        $.ajax({
            type:"post",
            dataType:"json",
            url:"/api/action/create",
            data :{
                action : $(".action-name").val(),
                name : $(".name-view").val()
            },
            success:function(data){
                if(parseInt(data.code)){
                    window.location.reload();
                }
            },
            error: function(err){
                console.log("出现异常");
            }
        });
    })
    $("#action-body").on("click" , ".delete-btn" , function(){
        var id = $(this).data("actionid")
        var roles = $(this).closest("tr").data("roles")
        if(confirm("是否删除该权限")){
            if(roles){
                alert("该权限已被调用，不可删除");
            }else{
                $.ajax({
                    type:"post",
                    dataType:"json",
                    url:"/api/action/del",
                    data :{
                        id : id
                    },
                    success:function(data){
                        if(parseInt(data.code)){
                            window.location.reload();
                        }
                    },
                    error: function(err){
                        console.log("出现异常");
                    }
                });

            }
        }

    })
    $(".newAction").click(function(){
        $("#action-body").append(emptytpl);
        
    })
})