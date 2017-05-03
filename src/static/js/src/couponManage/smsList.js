/**
 * Created by Jesse on 17/2/13.
 */
$(document).ready(function () {
    var flag = false, total = 10, list, html;

    function showPage(num, id,name, page) {
        var num = num || 1;
        $.ajax({
            type: 'POST',
            url: "/api/internal/sas/sms/list",
            data: {
                page: num,
                size: 10,
                id: id,
                name:name
            },
            dataType: "json",
            success: function (data) {
                if (data.code == 1) {
                    list = data.data.items;
                    html = template('sasListTpl', data.data);
                    $("#sasList-container").html(html);
                    total = data.data.totalRecords;
                    if (page) {
                        showPagination();
                    }
                }
            }
        });
    }

    showPage();
    showPagination();
    function showPagination() {
        $('#pagination-container').pagination({
            dataSource: new Array(Number(total)),
            pageNumber: 1,
            pageSize: 10,
            callback: function () {
                flag : true
            },
            afterPageOnClick: function (e, index) {
                showPage(index);
            },
            afterPreviousOnClick: function (e, index) {
                showPage(index);
            },
            afterNextOnClick: function (e, index) {
                showPage(index);
            }
        })
    }

    if (!flag) {
        showPagination();
    }
    $(document).on('click', '#searchBtn', function () {
        var id = $('#searchActivityId').val();
        var name = $('#searchActivityName').val();
        showPage(1, id, name, true);
    });
    //进入详情页
    $(document).on('click', '.goDetails', function () {
        var details = list[$(this).data('index')];
        var arr = ['id','name','content','count'];
        arr.forEach(function (i) {
            document.getElementById(i).innerText = details[i];
        });
    });
});