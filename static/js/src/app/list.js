$(".searchContainer button.addPage").on("click",function(){$("#addPageModal").modal(),$("#addPageModal").find("#add-page-form")[0].reset()}),$("#addPageModal .add").on("click",function(){var a=$("#add-page-form select.title").val(),e=$("#add-page-form select.title").find("option:selected").data("type"),d={title:a,type:e};$.ajax({type:"post",dataType:"json",url:"/api/internal/sas/page/add",data:d,success:function(a){1==a.code?(alert(a.msg),window.location.reload()):alert(a.msg)},error:function(){console.log("出现异常")}})});