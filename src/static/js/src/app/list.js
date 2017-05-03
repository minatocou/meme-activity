$(".searchContainer button.addPage").on("click",function(){
    $('#addPageModal').modal();
    $("#addPageModal").find("#add-page-form")[0].reset();
});
$("#addPageModal .add").on("click",function(){
    var title = $("#add-page-form select.title").val();
    var type = $("#add-page-form select.title").find("option:selected").data("type");
    var param = {
        title:title,
        type:type
    };

    $.ajax({
        type:"post",
        dataType:"json",
        url:"/api/internal/sas/page/add",
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