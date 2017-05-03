/**
 * Created by carina on 17/2/16.
 */
    var createForm = function () {
        var subData = {};
        var f = $('[data-setting]');
        var fData = [];
        f.each(function (i, item) {
            var fitem = $(this);
            var setting = JSON.parse(fitem.attr('data-setting'));
            /*if(setting.type != "imagetext"){
                setting['position'] = i;
            }*/
            setting['position'] = i;
            fData.push(setting);
        })
        subData.field = fData;
        return subData;
    }
    
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        var $radio = $('input[type=radio],input[type=checkbox]',this);
        $.each($radio,function(){
            if(!o.hasOwnProperty(this.name)){
                o[this.name] = '';
            }
        });
        return o;
    };

    var saveData = function (state,callback, ele) {
        var formData = createForm();
        if(formData.field.length == 0){
            return false;
        }

        formValidator(formData ,ele , function(){
            var domain = $("body").data('magento').replace(/:\d+/,'');
            var pageId = $("body").data('page-id');
            var brandId = $("#brandInfo").find("input[name='brandId']").val();
            //var param = _.extend({status:state,pageId:pageId},{field:fields});
            var fields = JSON.stringify(formData.field);

            var type ;
            if(brandId){
                type = brandId;
            }else{
                type = $("body").data('page-type');
            }

            var param = {
                status:state,
                pageId:pageId,
                field:fields,
                type: type
            };
            $.ajax({
                type:"post",
                dataType:"json",
                url:"/api/internal/sas/pagewidget/save",
                data: param,
                success:function(data){
                    callback && callback(data, formData);
                },
                error: function(err){
                    console.log("出现异常");
                }
            });
        });
        
    }