/**
 * Created by Jesse on 17/1/16.
 */
$(function(){
    var flag = false , total,list,html,user_id;

    var oTable = document.getElementsByClassName('table')[0];
    var oBody = oTable.tBodies[0];
    document.getElementById('searchBtn').onclick = function () {
        user_id = document.getElementById('user_id').value.trim();
        if(user_id){
            showPage();
            if( !flag ){
                $('#pagination-container').pagination({
                    dataSource: new Array(Number(total)),
                    pageNumber : 1,
                    pageSize :10,
                    callback : function(){
                        flag : true
                    },
                    afterPageOnClick:function (e,index) {
                        showPage(index);
                    },
                    afterPreviousOnClick:function (e,index) {
                        showPage(index);
                    },
                    afterNextOnClick:function (e,index) {
                        showPage(index);
                    }
                })
            }
        }
    };
    function showPage(num){
        var num = num || 1;
        $.ajax({
            type: 'GET',
            url:APIHOST+"/coupon/search",
            async : false,
            data:{
                customer_id:user_id,
                size:10,
                page:num
            },
            dataType : "json",
            success : function(data){
                list = data.data;
                html = template('couponListTpl', data.data);
                $("#couponList-container").html(html);
                total = data.data.total
            }
        })
    }

    // showPage();
    // if( !flag ){
    //     $('#pagination-container').pagination({
    //         dataSource: new Array(Number(total)),
    //         pageNumber : 1,
    //         pageSize :10,
    //         callback : function(){
    //             flag : true
    //         },
    //         afterPageOnClick:function (e,index) {
    //             showPage(index);
    //         },
    //         afterPreviousOnClick:function (e,index) {
    //             showPage(index);
    //         },
    //         afterNextOnClick:function (e,index) {
    //             showPage(index);
    //         }
    //     })
    // }
    /**
     * 排序
     */
    for(var i = 0;i<$('.cursor').length;i++){
        $('.cursor')[i].flag = -1;
    }

    function sort(){
        var _this = this;
        for(var i = 0;i<$('.cursor').length;i++){
            if(this!==$('.cursor')[i]){
                $('.cursor')[i].flag = -1;
            }
        }
        this.flag *= -1;
        list.list.sort(function (a,b) {
            var aInn = a[_this.getAttribute('key')];
            var bInn = b[_this.getAttribute('key')];
            if(isNaN(aInn)||isNaN(bInn)){
                return aInn.localeCompare(bInn)*_this.flag;
            }
            return (parseFloat(aInn)-parseFloat(bInn))*_this.flag;
        });
        html = template('couponListTpl', list);
        $("#couponList-container").html(html);
    }
    $('.cursor').click(function () {
        sort.call(this);
    });
});
