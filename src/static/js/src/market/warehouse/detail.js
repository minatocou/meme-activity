/**
 * Created by Jesse on 16/11/25.
 */
(function () {
    var marketDetail = new MarketDetail('/promotion/view');
    var id = getSearch('id');
    id&&HistoryLog.init(id,'promotion');
    marketDetail.getDetail();
    $('#marketSaveBtn').click(function () {
        if($('#name').val().trim()==''){
            alert('名称不能为空');
            return false;
        }
        if($('#name').val().length>50){
            alert('名称不能大于50个字');
            return false;
        }
        if($('#from_date').val()==''||$('#to_date').val()==''){
            alert('请输入有效期');
            return false;
        }else{
            if(!checkTime()){
                return false;
            }
        }
        if($('#discount .non-empty input')[0].value==''||$('#discount .non-empty input')[1].value==''){
            alert('优惠设置不能为空');
            return false;
        }else{
            if($('#discount .non-empty input')[0].value<0||$('#discount .non-empty input')[1].value<0){
                alert('设置优惠填写有误');
                return false;
            }else if(!checkDiscount()){
                return false;
            }
        }
        save();
    });
    $('#goBack').click(function () {
        location.href='/market/warehouse';
    });
    function save() {
        var arr = [
            'from_date',
            'to_date',
            'name',
            'description',
            'warehouse',
            'status',
            'customer_group'
        ];
        var obj = {};
        arr.map(function (item) {
            obj[item] = $('#' + item).val();
        });
        obj.discount = (function () {
            var arr = [];
            var i = 0;
            var j = 0;
            while (i < 6) {
                arr[j] = [$('#discount input')[i].value, $('#discount input')[i + 1].value];
                j++;
                i = i + 2;
            }
            return JSON.stringify(arr);
        })();
        function compatible(item) {
            $('#'+item+':checked').length!=0?obj[item]='1':obj[item]='0';
        }
        compatible('compatible_coupon');
        compatible('compatible_preference');
        obj.discount = (function () {
            var arr = [];
            var i = 0;
            var j = 0;
            while(i<6){
                if($('#discount input')[i].value.trim()){
                    arr[j] = [$('#discount input')[i].value,$('#discount input')[i+1].value];
                    j++;
                }
                i=i+2;
            }
            return JSON.stringify(arr);
        })();
        obj.user_name = $('.user-name').data('name');
        getSearch('id')&&(obj.id = getSearch('id'));
        console.log(obj)
        $.ajax({
            url:CONFIG.dev.domain+'/promotion/update',
            data:obj,
            dataType:'json',
            type:'POST',
            success:function (data) {
                alert(data.msg);
                if(data.code=='1'){
                    // location.href='/market/warehouse';
                    history.back();
                }
            },
            error:function (err) {
                console.log(err);
            }
        })
    }
})();
