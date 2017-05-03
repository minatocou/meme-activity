/**
 * Created by Jesse on 16/11/28.
 */
(function () {
    var marketDetail = new MarketDetail('/coupon/view');
    var id = getSearch('id');
    id && HistoryLog.init(id, 'coupon');
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
        if ($('#is_dynamic').val() == '0') {
            if ($('#from_date').val() == '' || $('#to_date').val() == '') {
                alert('请输入有效期');
                return false;
            } else {
                if (!checkTime()) {
                    return false;
                }
            }
        } else {
            if ($('#expire_days').val().trim() == '') {
                alert('请输入有效期');
                return false;
            } else {
                if ($('#expire_days').val().trim() > 365) {
                    alert('有效期不能大于365天');
                    return false;
                }
                if ($('#expire_days').val().trim() != parseInt($('#expire_days').val().trim()) || $('#expire_days').val().trim() <= 0) {
                    alert('有效期输入有误');
                    return false;
                }
            }
        }
        if ($('#rule').val() == '' || $('#discount').val() == '') {
            alert('优惠设置不能为空');
            return false;
        } else {
            if ($('#rule').val() < 0 || $('#discount').val() < 0) {
                alert('优惠设置填写有误');
                return false;
            }
        }
        if ($('#category').val().trim() == '') {
            alert('category不能为空');
            return false;
        }
        save();

    });
    function codeReturn() {
        $('.change-coupon input[type="text"]').val(null);
        $('.fixed-coupon input[type="text"]').val(null);
    }

    $('#detail').on('change', '#is_dynamic', function () {
        $('.fixed-coupon').toggle();
        $('.change-coupon').toggle();
        codeReturn();
    });
    $('#goBack').click(function () {
        location.href = '/market/coupon';
    });
    function save() {
        var arr = [
            'description',
            'discount',
            'discount_type',
            'expire_days',
            'from_date',
            'is_dynamic',
            'name',
            'rule',
            'status',
            'to_date',
            'warehouse'
        ];
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            $('#' + arr[i]).val().trim() && (obj[arr[i]] = $('#' + arr[i]).val().trim());
        }
        obj.platform = 7;
        obj.category = JSON.stringify($('#category').val().split(/,|，/));
        getSearch('id') && (obj.id = getSearch('id'));
        obj.user_name = $('.user-name').data('name');
        console.log(obj);
        $.ajax({
            url: CONFIG.dev.domain + '/coupon/update',
            data: obj,
            dataType: 'json',
            type: 'POST',
            success: function (data) {
                alert(data.msg);
                if (data.code == '1') {
                    history.back();
                    // location.href='/market/coupon';
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    }
})();
