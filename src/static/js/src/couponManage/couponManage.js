$(function(){
	var flag = false , total =100,list,html;

	var oTable = document.getElementsByClassName('table')[0];
	var oBody = oTable.tBodies[0];

	function showPage(num,id,activity_name,page){
		var num = num || 1;
		$.ajax({
			type: 'GET',
			url:APIHOST+"/coupon/bindRecord",
			async : false,
			data:{
				page:num,
				size:10,
                activity_name:activity_name,
			},
			dataType : "json",
			success : function(data){
				list = data.data;
				html = template('couponListTpl', data.data);
				$("#couponList-container").html(html);
				total = data.data.total;
				if(page){
                    showPagination();
				}
			}
		})
	}

	showPage();
	function showPagination() {
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
	if( !flag ){
        showPagination();
	}
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
    //进入详情页
    $(document).on('click','.goDetails',function () {
		var details = list.list[$(this).data('index')];
		var arr = ['activity_name','coupon_id_list','desc','customer_id_list','origin_total','success_total'];
		arr.forEach(function (i) {
			document.getElementById(i).innerText = details[i];
        });
    });

	$(document).on('click','#searchBtn',function () {
		var id = $('#searchActivityId').val();
		var activity_name = $('#searchActivityName').val();
        showPage(1,id,activity_name,true);
    });
});
