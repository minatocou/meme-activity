/**
 * Created by memebox on 16/9/26.
 */
$(function(){
    var roletpl = Handlebars.compile($("#role-template").html()),
        actiontpl = Handlebars.compile($("#action-template").html()),
        emptytpl =  Handlebars.compile($("#empty-template").html());

    $.ajax({
        type:"post",
        dataType:"json",
        url:"/api/role/get",

        success:function(data){
            if (parseInt(data.code)) {
                if (data.data.length != 0) {
                    $('#pagination-container').pagination({
                        dataSource: data.data,
                        callback: function (data, pagination) {
                            var html = roletpl(data);
                            $("#role-body").html(html);
                        }
                    })


                } else {
                    $("#role-body").html("暂时没有数据");
                }
            }
        },
        error: function(err){
            console.log("出现异常");
        }
    });

    $(".newRole").click(function(){
        $.ajax({
            type:"post",
            dataType:"json",
            url:"/api/action/get",
            success:function(data){
                $("#role-body").append(emptytpl(data));
            },
            error: function(err){
                console.log("出现异常");
            }
        });
        
        

    })
    $("#role-body").on("click" , ".delete-btn" , function(){
        var id = $(this).data("roleid");
        var roles = $(this).closest("tr").data("roles")
        if(confirm("是否删除该角色?")){
            if(roles){
                alert("该角色已被调用，不可删除");
            }else{
                $.ajax({
                    type:"post",
                    dataType:"json",
                    url:"/api/role/del",
                    data :{
                        id : id
                    },
                    success:function(data){
                        if(parseInt(data.code)){
                            window.location.reload()
                        }
                    },
                    error: function(err){
                        console.log("出现异常");
                    }
                });
            }
            
            
            /*$.ajax({
                type:"post",
                dataType:"json",
                url:"/api/role/ddddddddddddddd",                     /////////////////////////////////删除角色判断是否被调用
                data :{
                    id : id
                },
                success:function(data){
                    if(parseInt(data.code)){                              /////////////////////////////////
                        alert("该角色已被调用，不可删除");     
                    }else{
                        $.ajax({
                            type:"post",
                            dataType:"json",
                            url:"/api/role/del",
                            data :{
                                id : id
                            },
                            success:function(data){
                                if(parseInt(data.code)){
                                    window.location.reload()
                                }
                            },
                            error: function(err){
                                console.log("出现异常");
                            }
                        });
                    }
                },
                error: function(err){
                    console.log("出现异常");
                }
            });*/
        }
    })
    $("#role-body").on("click" , ".new-del" , function(){
        $(this).parents("tr").remove()
    })
    $("#role-body").on("click" , ".states-btn.role-save" , function(){
        var actionId = "" ,roleView = $(".role-view").val();
        $(this).parent().prev().find(":checkbox:checked").each(function(){
            if( actionId ){
                actionId += "," + $(this).data("actionid")
            }else{
                actionId += $(this).data("actionid")
            }
        })
        if(!$.trim(roleView)||!$.trim(actionId)){
            alert("角色和权限不能为空");
            return false;
        }

        $.ajax({
            type:"post",
            dataType:"json",
            url:"/api/role/create",
            data :{
                ids : actionId,
                roleView : roleView
            },
            success:function(data){
                if(parseInt(data.code)){
                    window.location.reload()
                }
            },
            error: function(err){
                console.log("出现异常");
            }
        });
    })

    $("#role-body").on("click" , ".btn-info.update-role" , function(){
        $(".modal-btn-update").data("roleid" , $(this).data("roleid"));
        var $actionItem = $(this).parent().prev().find(".action-item");
        var item=[];
        $actionItem.each(function(index,el){
            item.push($(el).html())
        })
        $.ajax({
            type:"post",
            dataType:"json",
            url:"/api/action/get",
            success:function(data){
                $("#updateModal .modal-body").html(actiontpl(data));
                $("#updateModal").modal();
                for(var i = 0 ; i < item.length ; i++){
                    $(":checkbox[data-action="+ item[i] +"]").prop("checked" , true);
                }
            },
            error: function(err){
                console.log("出现异常");
            }
        });

    })
    $(".modal-btn-update").on("click" , function(){
        var roleId = $(".modal-btn-update").data("roleid"), roleAction="";
        $(".modal-body :checkbox:checked").each(function(){
            if( roleAction ){
                roleAction += "," + $(this).data("action")
            }else{
                roleAction += $(this).data("action")
            }
        })
        if(!roleAction){
            alert("请选择权限");
            return false;
        }
        $.ajax({
            type:"post",
            dataType:"json",
            url:"/api/role/update",
            data :{
                roleId :roleId,
                ids : roleAction
            },
            success:function(data){
                if(parseInt(data.code)){
                    window.location.reload()
                }
            },
            error: function(err){
                console.log("出现异常");
            }
        });
    })
})