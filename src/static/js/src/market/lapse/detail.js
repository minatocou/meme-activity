/**
 * Created by Jesse on 16/11/24.
 * 直减
 */
function checkLaspeDiscount() {
    var result = true,flag;
    $("#discount .group").each(function (index,ele) {
        var oInput = $(this).find("input");
        if(oInput[0].value.trim()!=''&&oInput[1].value.trim()!=''){
            if(flag){
                result = false;
                return false;
            }
            /**
             * 加价购
             */
            if($("#type").val()>4){
                var list = $(this).find(".change-sale input[type='radio']:checked").next().val().trim(),
                    qty = $(this).find(".qty").val().trim();
                if($("#type").val() == 8 || $("#type").val() == 9){
                }
                else{
                    if(list==""||qty==""){
                        result = false;
                        return false;
                    }
                }
            }
        }else if(oInput[0].value.trim()==''&&oInput[1].value.trim()==''){
            flag = true;
            /**
             * 加价购
             */
            if($("#type").val()>4){
                var list = $(this).find(".change-sale input[type='radio']:checked").next().val().trim(),
                    qty = $(this).find(".qty").val().trim();
                if(list!=""||qty!=""){
                    result = false;
                    return false;
                }
            }
        }else {
            result = false;
            return false;
        }
    });

    if(result){
        return true;
    }else{
        alert('设置优惠填写有误');
        return false;
    }

}
(function () {
    var marketDetail = new MarketDetail('/preference/view');
    var id = getSearch('id');
    id && HistoryLog.init(id, 'preference');
    marketDetail.getDetail();
    $('#marketSaveBtn').click(function () {
        if ($('#name').val().trim() == '') {
            alert('名称不能为空');
            return false;
        }
        if ($('#name').val().length > 50) {
            alert('名称不能大于50个字');
            return false;
        }
        if ($('#from_date').val() == '' || $('#to_date').val() == '') {
            alert('请输入有效期');
            return false;
        } else {
            if (!checkTime()) {
                return false;
            }
        }
        if ($('#activity_url').val().trim().match(/^http|^https:\/\//) == null) {
            alert('请输入正确的url');
            return false;
        }
        if ($('#weight').val().trim() == '') {
            alert('权重不能为空');
            return false;
        } else {
            if ($('#weight').val().trim() != parseInt($('#weight').val().trim()) || $('#weight').val().trim() < 0) {
                alert('请输入大于0且是整数的权重');
                return false;
            }
        }
        if ($('#discount .non-empty input')[0].value == '' || $('#discount .non-empty input')[1].value == '') {
            alert('优惠设置不能为空');
            return false;
        } else {
            if ($('#discount .non-empty input')[0].value < 0 || $('#discount .non-empty input')[1].value < 0) {
                alert('设置优惠填写有误');
                return false;
            } else if (!checkLaspeDiscount()) {
                return false;
            }
        }
        if ($('#category').val().trim() == '') {
            alert('category不能为空');
            return false;
        }
        save();
    });
    $('#goBack').click(function () {
        location.href = '/market/lapse';
    });
    function save() {
        var arr = [
            'id',
            'name',
            'description',
            'status',
            'from_date',
            'to_date',
            'activity_url',
            'weight',
            'customer_group',
            'type',
            'warehouse'
        ];
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            obj[arr[i]] = $('#' + arr[i]).val();
        }
        obj.category = JSON.stringify($('#category').val().split(/,|，/));
        obj.discount = (function () {
            var arr = [];
            var i = 0;
            $("#discount .group").each(function (index,ele) {
                var oInput = $(this).find("input");
                if(oInput[0].value.trim()==''&&oInput[1].value.trim()==''){
                  return false;
                }
                arr[index] = [oInput[0].value, oInput[1].value];
                if ($("#type").val() > 4) {
                    var qty ;
                    if( $("#type").val() < 8 ){
                        qty = oInput[oInput.length-1].value.trim();
                    }else{
                        qty = oInput[1].value.trim();
                    }
                    arr[index].push({
                        type: $("#discount input[name='g" + index + "']:checked").val().trim(),
                        list: (function () {
                            var arr = $("#discount input[name='g" + index + "']:checked").next().val().trim().split(",") ;
                            for(var i = 0,l = arr.length;i<l;i++){
                                arr[i] = arr[i].trim();
                                if(!arr[i]){
                                    arr.splice(i,1);
                                }
                                l = arr.length;
                            }
                            return arr;
                        })(),
                        // list: $("#discount input[name='g" + index + "']:checked").next().val().trim().split(","),
                        qty:qty || 0
                    });
                }
            });
            arr.sort(function(a,b){
              return a[0]-b[0];
            });
            return JSON.stringify(arr);
        })();
        obj.compatible_coupon = (function () {
            if ($('#compatible_coupon input:checked').length != 0)
                return '1';
            else
                return '0';
        })();
        getSearch('id') && (obj.id = getSearch('id'));
        obj.user_name = $('.user-name').data('name');
        console.log(obj);
        $.ajax({
            url: CONFIG.dev.domain + '/preference/update',
            data: obj,
            dataType: 'json',
            type: 'POST',
            success: function (data) {
                alert(data.msg);
                if (data.code == '1') {
                    // location.href='/market/lapse';
                    history.back();
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    }

    $("#detail").on("change", ".changeType input[type='radio']", function () {
        $(this).parent().parent().find("input[type='text']").attr("readonly", true);
        $(this).next().attr("readonly", false);
    });

    $("#detail").on("blur",".hall-gift .changeType input[type='text']",function(){
        getQty.call(this);
    });
})();
