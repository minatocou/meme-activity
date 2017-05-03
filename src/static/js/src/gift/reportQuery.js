/**
 * Created by memebox on 16/12/13.
 */

(function($){


	$('.tab-list-item').click(function(e){
		document.querySelector('[data-origin-url]').setAttribute('data-origin-url',this.getAttribute('data-print'));
	});
	$('[data-print-url]').click(function(e){
		var qs = '?' + $.param($.extend($('body').find('form.search-form[data-api]:visible').serializeObject(),{operator: $('.record-user-name').text()}));
		this.setAttribute('data-print-url', this.getAttribute('data-origin-url') + qs);
	});

	$('.input-daterange input').datetimepicker({
	    format: "yyyy-mm-dd hh:ii:ss",
	    language: "zh-CN",
	    autoclose: true
	}).on('changeDate', function(ev){
		var fromDate = $(ev.target).parent().find('[name="fromDate"]'),
	    	toDate = fromDate.siblings('[name="toDate"]'),
	    	fromTime = +new Date(fromDate.val()),
	    	toTime = +new Date(toDate.val());
	    	if (toTime < fromTime) {
	    		setTimeout(function(){
		    		toDate[0].value = fromDate.val();
	    		});
	    	}
	});

}(jQuery));


function showPage(option,pageNum){
	var submitParam = pageNum ? $.extend(option.form.data().submitParam,pageNum) : option.form.data().submitParam;
		option = pageNum ? $.extend(option,pageNum) : option;
	ajaxReq({
		url: option.form[0].getAttribute('data-api'),
		data: submitParam
	})
	.then(function(data){
		if(typeof data === 'undefined'){
			return;
		}
	data = data.data;
	replaceObjectKeys(data,{
		list: ['giftStockInfo','productStockInfo','inStockInfo','outStockInfo'],
		name: ['boxName','productName'],
		sku: ['boxSku','productSku']
	});
		// var data = {
		// 	totalNum : 22,
		// 	list : [
		// 		{
		// 			sku: 1121,
		// 			name: 2312312,
		// 			total: 544,
		// 			detail: [{
		// 				qty: 111,
		// 				barCode: 222,
		// 			},{
		// 				qty: 111,
		// 				barCode: 222,
		// 			},{
		// 				qty: 111,
		// 				barCode: 222,
		// 			}]
		// 		},
		// 		{
		// 			sku: 11221,
		// 			name: 2312312,
		// 			total: 544,
		// 			detail: [{
		// 				qty: 111,
		// 				barCode: 222,
		// 			},{
		// 				qty: 111,
		// 				barCode: 222,
		// 			}]
		// 		}
		// 	]
		// };
		// var data = {
		// 	totalNum : 22,
		// 	list : [
		// 		{
		// 			sku: 1121,
		// 			name: 2312312,
		// 			detail: [{
		// 				qty: 'qty',
		// 				barCode: 222,
		// 				name: 'name',
		// 				sku: 'waressku'
		// 			},{
		// 				qty: 'qty',
		// 				barCode: 222,name: 'name',
		// 				sku: 'waressku'
		// 			},{
		// 				qty: 'qty',
		// 				barCode: 222,name: 'name',
		// 				sku: 'waressku'
		// 			}]
		// 		},
		// 		{
		// 			sku: 11221,
		// 			name: 2312312,
		// 			detail: [{
		// 				qty: 'qty',
		// 				barCode: 222,name: 'name',
		// 				sku: 'waressku'
		// 			},{
		// 				qty: 'qty',
		// 				barCode: 222,name: 'name',
		// 				sku: 'waressku'
		// 			}]
		// 		}
		// 	]
		// };
		if (data===null) {
			data = '';
		}
		data && initPager($.extend(option,{totalCount: data.totalNum,pageSize: submitParam.pageSize}));

		var dataList =  {list: (data.list ? [].concat(data.list) : [])};
		dataList.list.forEach(function(item){
			item.dataStringify = JSON.stringify(item);
		});
		option.dataContainer.html(parseTmpl({data: dataList,id: option.id }));

	});
}


