/**
 * Created by Jesse on 17/3/12.
 */
/**
 * Created by Jesse on 16/11/25.
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
    this.url = url;
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
                return;
            }
            var list = data.data.list;
            if (list && list.length != 0) {
                _this.element.html(_this.tpl(list));
                _this.renderPages(parseInt(data.data.total), 10, params.page);
            } else {
                _this.element.html('<tr colspan="4"><td colspan="4">没有内容</td></tr>');
                _this.renderPages(1, 1, 1);
            }
            $("#activeFlash").val(data.data.active_id);
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
var list = new MarketList("/api/internal/sas/seckill/list");
list.getList();
$("#search").click(function () {
    var obj = {
            page: 1,
            size: 10
        },
        id = $("#id").val().trim(),
        name = $("#name").val().trim();
    id != "" && (obj.id = id);
    name != "" && (obj.name = name);
    list.getList(obj);
});
$(".save").click(function () {
    if ($("#activeFlash").val().trim() == "") {
        alert("生效秒杀组不能为空");
        return false;
    }
    $.ajax({
        url: "/api/internal/sas/seckill/config",
        dataType: "json",
        data: {
            id: $("#activeFlash").val()
        },
        success: function (data) {
            alert(data.msg);
            if (data.code == 1) {
                location.reload();
            } else {
                return false;
            }
        },
        error: function (e) {
            console.log(e);
        }
    })
});