$(function(){var o=Handlebars.compile($("#role-template").html()),t=Handlebars.compile($("#action-template").html()),a=Handlebars.compile($("#empty-template").html());$.ajax({type:"post",dataType:"json",url:"/api/role/get",success:function(t){parseInt(t.code)&&(0!=t.data.length?$("#pagination-container").pagination({dataSource:t.data,callback:function(t){var a=o(t);$("#role-body").html(a)}}):$("#role-body").html("暂时没有数据"))},error:function(){console.log("出现异常")}}),$(".newRole").click(function(){$.ajax({type:"post",dataType:"json",url:"/api/action/get",success:function(o){$("#role-body").append(a(o))},error:function(){console.log("出现异常")}})}),$("#role-body").on("click",".delete-btn",function(){var o=$(this).data("roleid"),t=$(this).closest("tr").data("roles");confirm("是否删除该角色?")&&(t?alert("该角色已被调用，不可删除"):$.ajax({type:"post",dataType:"json",url:"/api/role/del",data:{id:o},success:function(o){parseInt(o.code)&&window.location.reload()},error:function(){console.log("出现异常")}}))}),$("#role-body").on("click",".new-del",function(){$(this).parents("tr").remove()}),$("#role-body").on("click",".states-btn.role-save",function(){var o="",t=$(".role-view").val();return $(this).parent().prev().find(":checkbox:checked").each(function(){o+=o?","+$(this).data("actionid"):$(this).data("actionid")}),$.trim(t)&&$.trim(o)?void $.ajax({type:"post",dataType:"json",url:"/api/role/create",data:{ids:o,roleView:t},success:function(o){parseInt(o.code)&&window.location.reload()},error:function(){console.log("出现异常")}}):(alert("角色和权限不能为空"),!1)}),$("#role-body").on("click",".btn-info.update-role",function(){$(".modal-btn-update").data("roleid",$(this).data("roleid"));var o=$(this).parent().prev().find(".action-item"),a=[];o.each(function(o,t){a.push($(t).html())}),$.ajax({type:"post",dataType:"json",url:"/api/action/get",success:function(o){$("#updateModal .modal-body").html(t(o)),$("#updateModal").modal();for(var e=0;e<a.length;e++)$(":checkbox[data-action="+a[e]+"]").prop("checked",!0)},error:function(){console.log("出现异常")}})}),$(".modal-btn-update").on("click",function(){var o=$(".modal-btn-update").data("roleid"),t="";return $(".modal-body :checkbox:checked").each(function(){t+=t?","+$(this).data("action"):$(this).data("action")}),t?void $.ajax({type:"post",dataType:"json",url:"/api/role/update",data:{roleId:o,ids:t},success:function(o){parseInt(o.code)&&window.location.reload()},error:function(){console.log("出现异常")}}):(alert("请选择权限"),!1)})});