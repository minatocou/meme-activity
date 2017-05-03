/**
 * Created by Jesse on 16/12/8.
 */
(function () {
    var marketDetail = new MarketDetail('/code/view');
    var id = getSearch('id');
    id && HistoryLog.init(id, 'code');
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
        if ($('#is_public').val() == '0') {
            if ($('#total').val() == '') {
                alert('请输入总张数');
                return false;
            } else {
                if ($('#total').val() != parseInt($('#total').val())) {
                    alert('总张数输入有误');
                    return false;
                }
            }
            if ($('#privatePrefix').val().trim() == '') {
                alert('请输入前缀');
                return false;
            } else {
                if ($('#privatePrefix').val().trim().length > 10) {
                    alert('前缀只能输入10位字符');
                    return false;
                } else {
                    if ($('#privatePrefix').val().trim().slice(-8).length == 8 && $('#publicPrefix').val().trim().slice(-8) == parseInt($('#privatePrefix').val().trim().slice(-8))) {
                        alert('前缀最后8位不能全是数字');
                        return false;
                    }
                }
            }
        } else {
            if ($('#publicPrefix').val().trim() == '') {
                alert('请输入公码');
                return false;
            } else {
                if ($('#publicPrefix').val().trim().length > 10) {
                    alert('公码只能输入10位字符');
                    return false;
                } else {
                    if ($('#publicPrefix').val().trim().slice(-8).length == 8 && $('#publicPrefix').val().trim().slice(-8) == parseInt($('#publicPrefix').val().trim().slice(-8))) {
                        alert('公码最后8位不能全是数字');
                        return false;
                    }
                }
            }
        }
        if ($('#from_date').val() == '' || $('#to_date').val() == '') {
            alert('请输入有效期');
            return false;
        } else {
            if (!checkTime()) {
                return false;
            }
        }
        if ($('#total_use_limit').val() == '') {
            alert('请输入总可用次数');
            return false;
        } else {
            if ($('#total_use_limit').val() < 0 || $('#total_use_limit').val() != parseInt($('#total_use_limit').val())) {
                alert('总可用次数输入有误');
                return false;
            }
        }
        if ($('#customer_use_limit').val() == '') {
            alert('请输入可用次数');
            return false;
        } else {
            if ($('#customer_use_limit').val() < 0 || $('#customer_use_limit').val() != parseInt($('#customer_use_limit').val())) {
                alert('可用次数输入有误');
                return false;
            }
        }
        if ($('#rule').val() == '' || $('#discount').val() == '') {
            alert('请输入设置优惠');
            return false;
        } else {
            if ($('#rule').val() < 0 || $('#discount').val() < 0) {
                alert('设置优惠输入有误');
                return false;
            }
        }
        if ($('#category').val().trim() === '') {
            alert('请输入category');
            return false;
        }
        save();

    });
    function codeReturn() {
        $('.private-code input[type="text"]').val(null);
        $('.public-code input[type="text"]').val(null);
        $('.public-code').toggle();
        $('.private-code').toggle();
    }

    $('#detail').on('change', '#is_public', function () {
        codeReturn();
        console.log(99)
    });
    $('#goBack').click(function () {
        location.href = '/market/code';
    });
    function save() {
        var arr = [
            'customer_use_limit',
            'description',
            'discount',
            'discount_type',
            'from_date',
            'is_public',
            'name',
            'rule',
            'status',
            'to_date',
            'total',
            'total_use_limit',
            'warehouse'
        ];
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            ($('#' + arr[i]).val() != '') && (obj[arr[i]] = $('#' + arr[i]).val());
        }
        obj.is_public == '1' ? (obj.prefix = $('#publicPrefix').val()) : (obj.prefix = $('#privatePrefix').val());
        obj.platform = 7;
        obj.category = JSON.stringify($('#category').val().split(/,|，/));
        obj.user_name = $('.user-name').data('name');
        getSearch('id') && (obj.id = getSearch('id'));
        // if (confirm('保存后优惠码信息不可更改，是否确认保存？')) {
        //
        //     $.ajax({
        //         url: CONFIG.dev.domain + '/code/update',
        //         data: obj,
        //         dataType: 'json',
        //         type: 'POST',
        //         success: function (data) {
        //             if (data.code == '1' && data.data.id && (marketDetail.is_generated == '0' || !getSearch('id'))) {
        //                 /**
        //                  * 生成code
        //                  */
        //                 $.ajax({
        //                     url: CONFIG.dev.domain + '/code/generate',
        //                     data: {
        //                         id: data.data.id
        //                     },
        //                     dataType: 'json',
        //                     type: 'POST',
        //                     success: function (data) {
        //                         alert(data.msg);
        //                         $('#is_public').attr('disabled', true);
        //                         if (data.code == '1') {
        //                             history.back();
        //                             // location.href='/market/code';
        //                         }
        //                     },
        //                     error: function (err) {
        //                         console.log(err);
        //                     }
        //                 });
        //             } else if (data.code == '1') {
        //                 alert(data.msg);
        //                 history.back();
        //                 // location.href='/market/code';
        //             } else if (data.code == '0') {
        //                 alert(data.msg);
        //             }
        //         },
        //         error: function (err) {
        //             console.log(err);
        //         }
        //     });
        // }
        var dlg = dialog({
            title: '提示',
            content: '保存后优惠码信息不可更改，是否确认保存？',
            okValue: '确定',
            ok: function () {
                $.ajax({
                    url:CONFIG.dev.domain + '/code/update',
                    data:obj,
                    dataType:'json',
                    type:'POST',
                    success:function (data) {
                        if(data.code=='1'&&data.data.id&&(marketDetail.is_generated=='0'||!getSearch('id'))){
                            $.ajax({
                                url:CONFIG.dev.domain+'/code/generate',
                                data:{
                                    id:data.data.id
                                },
                                dataType:'json',
                                type:'POST',
                                success:function (data) {
                                    alert(data.msg);
                                    $('#is_public').attr('disabled',true);
                                    if(data.code=='1'){
                                        history.back();
                                        // location.href='/market/code';
                                    }
                                },
                                error:function (err) {
                                    console.log(err);
                                }
                            });
                        }else if(data.code=='1'){
                            alert(data.msg);
                            history.back();
                            // location.href='/market/code';
                        }else if(data.code =='0'){
                            alert(data.msg);
                        }
                    },
                    error:function (err) {
                        console.log(err);
                    }
                });
            },
            cancelValue: '取消',
            cancel: function () {}
        });
        dlg.show();
    }
})();
