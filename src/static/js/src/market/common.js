/**
 * Created by Jesse on 16/11/25.
 */
/**
 * 基本配置
 */
var CONFIG = {
    dev: {
        // domain:'http://54.222.177.217:2016'
        domain: $('.header-container').data('coupon')
    }
};
//ajax过渡
$(document).ajaxStart(function () {
    $('.ajax-loading-backdrop').show();
}).ajaxStop(function () {
    $('.ajax-loading-backdrop').hide();
});
$.ajaxSetup({cache: false});
/**
 * 运营工具选择时间
 */

function toLastSecondOfDate(date) {
    var d = new Date();
    var originDate = +d;
    d.setDate(d.getDate() + 1);
    d.setSeconds(d.getSeconds() - 1);
    var modifyDate = +d;
    var minus = modifyDate - originDate;
    var dateStr = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    return new Date(+new Date(dateStr) + minus);
}

var dateTimePickerInit = function () {

    laydate({
        elem: '#from_date',
        format: 'YYYY-MM-DD hh:mm:ss', // 分隔符可以任意定义，该例子表示只显示年月
        istime: true,
        istoday: true,
        choose: function (datas) {
            console.log(datas);
        }
    });
    var flag = !!$('#to_date').val();
    laydate({
        elem: '#to_date',
        format: flag ? 'YYYY-MM-DD hh:mm:ss' : 'YYYY-MM-DD 23:59:59', // 分隔符可以任意定义，该例子表示只显示年月
        istime: true,
        istoday: true,
        choose: function () {
            console.log(arguments)
            // console.log(dates);
            flag ? undefined : (this.format = 'YYYY-MM-DD hh:mm:ss');
        }
    });
};
var dateFormat = function (date, format) {

    date = new Date(date);

    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "D": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([y|YMd|DhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        }
        else if (t.toLowerCase() === 'y') {
            return (date.getFullYear() + '').substring(4 - all.length);
        }
        return all;
    });
    return format;
};
function checkTime() {
    var from_date = $('#from_date').val().trim();
    var to_date = $('#to_date').val().trim();
    console.log(moment(from_date).isBefore(to_date));
    if (from_date == '' || to_date == '') {
        return true;
    } else if (from_date == to_date) {
        return true;
    } else if (moment(to_date).isBefore(from_date)) {
        alert('开始时间要小于或等于结束时间');
        return false;
    } else {
        return true;
    }
}
/**
 * 收起展开
 */
$('#spreadSwitch').on('click', 'span', function () {
    $('#explainText').toggle(300, function () {
        $('#spreadSwitch').toggleClass('up');
    });
});
$('#logBtn').on('click', 'span', function () {
    $('#logTable').toggle(300, function () {
        $('#logBtn').toggleClass('up');
    });
});
/**
 * 检查必填项
 */
function checkNonEmpty() {
    var result = true;
    $('.non-empty input').each(function () {
        if (this.value.trim() == '' && $(this).parents('.non-empty').css('display') != 'none') {
            alert(($(this).siblings('label').html() || $(this).parent().siblings('label').html() ) + '不能为空');
            result = false;
            return false;
        }
    });
    if (result && $('textarea').val() == '') {
        if (document.getElementById('sku_list'))
            alert('请输入SKU');
        else
            alert('请输入Category');
        return false;
    }
    return result;
}

function searchContent() {
    var obj = {
        id: $('#activityId').val().trim(),
        name: $('#activityName').val().trim(),
        timeWay: $("input[name='selectTime']:checked").val(),
        time: [
            $('#startTime').val(),
            $('#endTime').val()
        ],
        type: $('#activityType').val(),
        state: $('#activityState').val()
    }
    return obj;
}
/**
 * 获取query
 */
function getSearch(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", 'i');
    var result = decodeURIComponent(window.location.search).substr(1).match(reg);
    if (result != null) return result[2];
    return null;
}

/**
 * 列表
 * url
 * tpl->模版
 * element->页面元素
 * page->第几页
 */
function MarketList(url, tpl, element, page) {
    this.url = CONFIG.dev.domain + url;
    this.tpl = tpl || Handlebars.compile($('#listTpl').html());
    this.element = element || $('#list');
    this.page = getSearch('page') || 1;
}
MarketList.prototype.getList = function (obj) {
    var _this = this;
    var params = obj || {
            page: _this.page,
            size: 10
        };
    $.ajax({
        url: _this.url,
        type: 'GET',
        dataType: 'json',
        data: params,
        success: function (data) {
            if (data.code == 0) {
                alert(data.msg);
            }
            var list = data.data.list;
            if (list && list.length != 0) {
                _this.element.html(_this.tpl(list));
                _this.renderPages(parseInt(data.data.total), 10, _this.page);
            } else {
                _this.element.html('<tr colspan="6"><td colspan="6">没有内容</td></tr>');
                _this.renderPages(1, 1, 1);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
};
MarketList.prototype.renderPages = function (total, pageSize, page) {
    $('#pagination-container').pagination({
        dataSource: new Array(total),
        pageSize: pageSize,
        showGoInput: true,
        showGoButton: true,
        pageNumber: page,
        afterPageOnClick: function (e, index) {
            location.href = '?page=' + index.trim();
        },
        afterPreviousOnClick: function (e, index) {
            location.href = '?page=' + index.trim();
        },
        afterNextOnClick: function (e, index) {
            location.href = '?page=' + index.trim();
        },
        afterGoButtonOnClick: function (e, index) {
            var i = index.trim();
            (i != '') && (location.href = '?page=' + i);
        },
        callback: function (data, pagination) {
        }
    });
};
/**
 * 详情
 * url
 * tpl->模版
 * element->页面元素
 */
function MarketDetail(url, tpl, element) {
    this.url = CONFIG.dev.domain + url;
    this.tpl = tpl || Handlebars.compile($('#detailTpl').html());
    this.element = element || $('#detail');
}
MarketDetail.prototype.getDetail = function () {
    var _this = this;
    var detail, detailTpl;
    if (getSearch('id')) {
        $.ajax({
            url: _this.url,
            type: 'GET',
            dataType: 'json',
            data: {
                id: getSearch('id')
            },
            success: function (data) {
                if (data.code == 0) {
                    alert(data.msg);
                }
                detail = data.data;
                // detail.
                _this.is_generated = detail.is_generated;
                detail.discount && (detail.discount = JSON.parse(detail.discount));
                detail.category && (detail.category = JSON.parse(detail.category));
                console.log(detail)
                detailTpl = Handlebars.compile($('#detailTpl').html());
                $('#detail').html(detailTpl(detail));
                dateTimePickerInit(false, true);
                detail.discount_type && discountChange(detail.discount_type);
                detail.type && discountChange(detail.type);
                if (detail.type <= 4) {
                    $("#discount .change-sale").each(function (index, ele) {
                        $($(this).find("input[type='radio']")[0]).attr("checked", "checked");
                        $($(this).find("input[type='radio']")[0]).next("input").attr("readonly", false);
                    });
                } else if (detail.type == 6 || detail.type == 7) {
                    //换购
                    $("#discount .change-sale").each(function (index, ele) {
                        var radioChecked = $(this).find("input[type='radio']:checked");
                        var oInput = $(this).find("input[type='text']")[radioChecked.val() - 1];
                        $(oInput).attr("readonly", false);
                        if (radioChecked.length == 0) {
                            $($(this).find("input[type='radio']")[0]).attr('checked', true);
                            $($(this).find("input[type='text']")[0]).attr('readonly', false);
                        }
                    });
                } else if (detail.type == 8 || detail.type == 9) {
                    //场增
                    $("#discount .change-sale").each(function (index, ele) {
                        var radioChecked = $(this).find("input[type='radio']:checked");
                        var oInput = $(this).find("input[type='text']")[radioChecked.val() - 1];
                        $(oInput).attr("readonly", false);
                        if (radioChecked.length == 0) {
                            $($(this).find("input[type='radio']")[0]).attr('checked', true);
                            $($(this).find("input[type='text']")[0]).attr('readonly', false);
                        }
                    });
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    } else {
        detailTpl = Handlebars.compile($('#detailTpl').html());
        $('#detail').html(detailTpl());
        dateTimePickerInit(false, true);
        $("#discount .change-sale").css({
            display: "none"
        });
        $("#discount .change-sale").each(function (index, ele) {
            $($(this).find("input[type='radio']")[0]).attr("checked", "checked");
            $($(this).find("input[type='radio']")[0]).next("input").attr("readonly", false);
        });

    }
};

/**
 * 操作日志
 * @type {{init: HistoryLog.init}}
 */
var HistoryLog = {
    getList: function (size, page) {
        var _this = this;
        $.ajax({
            url: CONFIG.dev.domain + '/' + _this.type + '/history',
            type: 'GET',
            data: {
                related_id: _this.id,
                size: size,
                page: page
            },
            dataType: 'json',
            success: function (data) {
                if (data.code == 0) {
                    alert(data.msg);
                }
                var detail = data.data;
                var logTpl = Handlebars.compile($('#logTpl').html());
                if (detail.list.length == 0) {
                    $('.log').remove();
                    return;
                }
                $('#logTbody').html(logTpl(detail));
                _this.renderPages(parseInt(detail.total), size, page);
            },
            error: function (e) {
                console.log(e);
            }
        })
    },
    renderPages: function (total, size, page) {
        var _this = this;
        $('#pagination-container').pagination({
            dataSource: new Array(total),
            pageSize: size,
            showGoInput: true,
            showGoButton: true,
            pageNumber: page,
            afterPageOnClick: function (e, index) {
                _this.getList(size, index);
            },
            afterPreviousOnClick: function (e, index) {
                _this.getList(size, index);
            },
            afterNextOnClick: function (e, index) {
                _this.getList(size, index);
            },
            afterGoButtonOnClick: function (e, index) {
                _this.getList(size, index);
            },
            callback: function (data, pagination) {
            }
        })
    },
    init: function (id, type) {
        this.id = id;
        this.type = type;
        this.getList(5, 1);
    }
};

/**
 * 删除
 * 两次确认
 */
function MarketDelete(url) {
    $('#list').on('click', '.btn-danger', function (e) {
        var id = $(this).parents('tr').data('id');
        $('#myModal').data('id', id);
    });
    $('#sureBtn').click(function () {
        $.ajax({
            url: CONFIG.dev.domain + url + '?id=' + $('#myModal').data('id'),
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                alert(data.msg);
                if (data.code == '1') {
                    location.reload();
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    });
}
function getQty() {
    var arr = this.value.split(/,|，/);
    var pro = {}, str = "";
    for (var i = 0, l = arr.length; i < l; i++) {
        var k = arr[i].trim();
        if (pro[k]) {
            pro[k]++;
        } else if (k != '') {
            pro[k] = 1;
        }
    }
    for (var k in pro) {
        str += k + ":" + pro[k] + "件 ";
    }
    $(this).parents('.group').find("p").html(str);
    console.log(str, pro);
}
function discountChange(value) {
    var arr;
    if (document.getElementById('discount')) {
        arr = [
            ['件 - 共', '元', '1）产品price*N≥N元购金额  2）最少件数需≥1'],
            ['件 - 减', '元', '1）最少件数需≥1   2）设置N见立减X元时，产品price*N≥立减金额'],
            ['元 - 减', '元', '条件金额≥减扣金额'],
            ['件 - 打', '折', '1）最少件数需≥1   2)  打折数值格式：8.5折—输入8.5   9折-输入9'],
            ['元 - 打', '折', '打折数值格式：8.5折输入8.5 （英文.）   9折输入9'],
            '',
            ["件-再以", "元／件"],
            ["元-再以", "元／件"],
            ["件，赠", "件赠品，赠品为"],
            ["元，赠", "件赠品，赠品为"]
        ];
        $('#discount .s1') && $('#discount .s1').html(arr[value][0]);
        $('#discount .s2') && $('#discount .s2').html(arr[value][1]);
        $("#discount").removeClass("hall-gift");
        if (value < 5) {
            $('#discount .prompt').css({
                display: "inline"
            });
            $('#discount .prompt').html(arr[value][2]);
            $("#discount .change-sale").css({
                display: "none"
            });
        } else if (value == 6 || value == 7) {
            $('#discount .prompt').css({
                display: "none"
            });
            $("#discount .change-sale").css({
                display: "inline-block"
            });
            $("#discount .ex").css({
                display: "inline"
            })
        } else if (value == 8 || value == 9) {
            $("#discount").addClass("hall-gift");
            $('#discount .prompt').css({
                display: "none"
            });
            $("#discount .ex").css({
                display: "none"
            });
            $("#discount .change-sale").css({
                display: "inline-block"
            });
            for (var i = 0; i < 3; i++) {
                if ($('.hall-gift-sku')[i].value.trim() == '') {
                    break;
                }
                getQty.call($('.hall-gift-sku')[i]);
            }
            $('.sku-list').each(function (index, ele) {
                $(ele).find('input[type="radio"]').attr('checked',true);
                $(ele).find('input[type="text"]').attr('readonly',false);
            });
            $('.category-list').each(function (index, ele) {
                $(ele).find('input[type="text"]').attr('readonly',true);
            });
        }

    }
    if (document.getElementById('discountCoupon')) {
        arr = [
            null,
            ['元 - 减', '元'],
            ['元 - 打', '折']
        ];
        $('#discountCoupon .s1') && $('#discountCoupon .s1').html(arr[value][0]);
        $('#discountCoupon .s2') && $('#discountCoupon .s2').html(arr[value][1]);
    }
}
$('#detail').on('change', '#type', function () {
    var value = $(this).val();
    console.log(value)
    discountChange(value);
});
$('#detail').on('change', '#discount_type', function () {
    var value = $(this).val();
    console.log(value)
    discountChange(value);
});
/**
 * 改变状态
 */
function changeStatus(url) {
    $('#pauseBtn').click(function () {
        var id = $('#myModalPause').data('id');
        $.ajax({
            url: CONFIG.dev.domain + url,
            type: 'POST',
            dataType: 'json',
            data: {
                id: id,
                status: 2
            },
            success: function (data) {
                alert(data.msg);
                location.reload();
            },
            error: function (error) {
                console.log(error);
            }
        })
    })
    $('#list').on('click', '.change-status', function (e) {
        var status = $(this).data('status');
        var id = $(this).data('id');
        if (status == 2) {
            $('#myModalPause').data({id: id});
            return;
        }
        $.ajax({
            url: CONFIG.dev.domain + url,
            type: 'POST',
            dataType: 'json',
            data: {
                id: id,
                status: status
            },
            success: function (data) {
                alert(data.msg);
                location.reload();
            },
            error: function (error) {
                console.log(error);
            }
        })
    });
}

function checkDiscount() {
    var arr = [], arr2 = [], l = $('#discount input').length;
    for (var i = 2; i < l; i++) {
        if ($('#discount input')[i].value.trim() != '') {
            if ($('#discount input')[i].value.trim() < 0) {
                alert('设置优惠填写有误');
                return false;
            }
            arr[i - 2] = 1;
            arr2[i - 2] = 1;
        }
        else
            arr[i - 2] = 0;

    }
    if (arr2.length % 2 == 0 && (arr.toString() == arr.sort(function (a, b) {
            return b - a;
        }).toString()))
        return true;
    else {
        alert('设置优惠填写有误');
        return false;
    }

}
