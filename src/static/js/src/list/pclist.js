/**
 * Created by Jesse on 16/9/14.
 */
$(document).ready(function () {
    var constant = i18n[$(".header-container").data("localize")];
    var searchText = (function () {
        var obj = {
            title:document.getElementById('title'),
            urlKey:document.getElementById('url_key'),
            state:document.getElementById('state'),
            lastOne:document.getElementById('lastOne')
        };
        var lastSearch = localStorage.searchText&&JSON.parse(localStorage.searchText);
        if(lastSearch){
            for(var k in obj){
                obj[k].value = lastSearch[k];
            }
        }
        return obj;
    })();
    $('#search-btn').click(function () {
        var search = {};
        for(var k in searchText){
            search[k] = searchText[k].value ;
        }
        localStorage.searchText = JSON.stringify(search);
    });
    $('.states-btn').click(function () {
        var _this = this;
        var state = _this.getAttribute('data-state'),
            urlkey = _this.getAttribute('data-key');
        var params = {
            id: _this.getAttribute('data-id'),
            state: state,
            urlkey : urlkey
        };
        $.ajax({
            type: 'GET',
            url: '/api/pc/list/changeState',
            data: params,
            success: function () {
                if (_this.getAttribute('data-state') == '0') {
                    _this.innerHTML = '<i class="fa fa-check"></i>'+constant.active;
                    $(_this).parents('tr').find('.states')[0].innerHTML = '<i class="fa fa-lock"></i>'+constant.inactive;
                    _this.setAttribute('data-state', '1');
                } else {
                    _this.innerHTML = '<i class="fa fa-power-off"></i>'+constant.inactive;
                    $(_this).parents('tr').find('.states')[0].innerHTML = '<i class="fa fa-unlock"></i>'+constant.active;
                    _this.setAttribute('data-state', '0');
                }
            }
        });
    });

    (function () {
        var _this;
        $('.delete-btn').click(function () {
            $('.mask').show();
            _this = this;
        });
        $('.close-btn').click(function () {
            $('.mask').hide();
        });
        $('.sure-btn').click(function () {
            var _thisId = _this.getAttribute('data-id');
            $('.mask').hide();
            $.ajax({
                type: 'GET',
                url: '/api/h5/list/remove?id=' + _thisId,
                success: function () {
                    $(_this).parents('tr').remove();
                }
            });
        });
    })();

    function getSearch(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)",'i');
        var result = decodeURIComponent(window.location.search).substr(1).match(reg);
        if(result!=null) return result[2];
        return null;
    }
    var pagesArr = $('#pagesObj').html().split(',');
    (pagesArr[2].trim()!=0)&&$('#pagination-container').pagination({
        dataSource: new Array(parseInt(pagesArr[2].trim())),
        pageSize: pagesArr[1].trim(),
        // totalPage:6,
        showGoInput: true,
        showGoButton: true,
        pageNumber: getSearch('pageIndex')||1,
        afterPageOnClick:function (e,index) {
            location.href='?pageIndex='+index.trim();
        },
        afterPreviousOnClick:function (e,index) {
            location.href='?pageIndex='+index.trim();
        },
        afterNextOnClick:function (e,index) {
            location.href='?pageIndex='+index.trim();
        },
        afterGoButtonOnClick:function (e,index) {
            var i = index.trim();
            (i!='')&&(location.href='?pageIndex='+i);
        },
        callback: function () {

        }
    });
    
});
