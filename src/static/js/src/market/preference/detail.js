/**
 * Created by Jesse on 16/11/25.
 */
(function () {
    var marketDetail = new MarketDetail('/supersale/view');
    var id = getSearch('id');
    id&&HistoryLog.init(id,'supersale');
    marketDetail.getDetail();
    function save() {
        var arr = [
            'activity_url',
            'description',
            'from_date',
            'name',
            'status',
            'to_date',
            'sku_list'
        ];
        var obj = {};
        arr.map(function (item) {
            obj[item]=$('#'+item).val()
        });
        obj.user_name = $('.user-name').data('name');
        $.ajax({
            url:CONFIG.dev.domain+'/supersale/update',
            data:obj,
            dataType:'json',
            method:'POST',
            success:function (data) {
                alert(data.msg);
                if(data.code==1){
                    location.reload();
                }
            },
            error:function (err) {
                console.log(err);
            }
        })
    }
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
        if($('#activity_url').val().trim()!=''&&$('#activity_url').val().trim().match(/^http|^https:\/\//)==null){
            alert('请输入正确的url');
            return false;
        }
        if($('#sku_list').val().trim()==''){
            alert('sku不能为空');
            return false;
        }
        save();

    });
})();
