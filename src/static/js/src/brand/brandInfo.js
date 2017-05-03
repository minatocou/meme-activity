/**
 * Created by yate on 2017/2/28.
 */
(function () {
    template.config('openTag', '${');
    template.config('closeTag', '}');

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

})();

function ajaxReq(option){
    option = $.extend({
        dataType: 'JSON',
        data: {}
    },option);
    return $.ajax(option)
        .then(function(data){
            if(data.code == 1){
                try {
                    data.data = JSON.parse(data.data);
                } catch (e){
                    data.data = data.data;
                }
                return data;
            } else {
                alert(data.msg);
                return null;
            }
        })
        .fail(function(err){
            console.log(err);
            alert(localeI18n.errorTips);
        });
}
function parseTmpl(option){
    if(option.id){
        return template(option.id, option.data || []);
    } else if(option.tmpl){
        return template.compile(option.tmpl)(option.data || {});
    }
}