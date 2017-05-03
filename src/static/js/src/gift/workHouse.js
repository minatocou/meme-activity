/**
 * Created by memebox on 16/12/13.
 */

(function($){

	var dateFormat =function (date, format) {

	    date = new Date(date);

	    var map = {
	        "M": date.getMonth() + 1, //月份 
	        "d": date.getDate(), //日 
	        "h": date.getHours(), //小时 
	        "m": date.getMinutes(), //分 
	        "s": date.getSeconds(), //秒 
	        "q": Math.floor((date.getMonth() + 3) / 3), //季度 
	        "S": date.getMilliseconds() //毫秒 
	    };
	    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
	        var v = map[t];
	        if(v !== undefined){
	            if(all.length > 1){
	                v = '0' + v;
	                v = v.substr(v.length-2);
	            }
	            return v;
	        }
	        else if(t === 'y'){
	            return (date.getFullYear() + '').substring(4 - all.length);
	        }
	        return all;
	    });
	    return format;
	};


	//每个模态框的文本，和内嵌模版以及一些事件
	var modalInfo = {
		'add-assemble-task' : {
			action: '/task/add',
			title: localeI18n.createAssembleTask,
			btnName: localeI18n.save,
			hiddenFunc: function (e) {
				showPage($('form.search-form[data-api]:visible').data().pageParam);
			},
			showFunc: function(e){
				var _this = $(this);
				ajaxReq({
					url: '/task/boxlist',
				})
				.then(function(data){
					if(typeof data === 'undefined'){
						return;
					}
					var dataArr = data.data;
					var opts = '';
					for (var i = 0; i < dataArr.length; i++) {
						opts += '<option value="'+ dataArr[i].sku +'">' + dataArr[i].name +'</option>';
					}
					var select = _this.find('form select[name="boxSku"]').html(opts).change();
					setTimeout(function() {
						select.selectpicker();
					},300);
				});
				var mapObj = {
					sku: 1,
					barcode: 2
				}
				$(this).find('form').validate({
					submitHandler: function(form) {
						var _this = $(form);
						//验证数量
						var tagArr = [];
						_this.find('.item-cell-container').each(function(i,item){
							if(!validateCount.call($(item))){
								return true;
							}
							tagArr.push(true);
						});
						if(tagArr.length < _this.find('.item-cell-container').length){
							return;
						}
						
						//拿到提交的数据submitObj
						var arr = [];
						var key = _this.find('[name="showType"]:checked').val().toLowerCase();
						_this.find('.item-cell-container').each(function(index,item){//组装项
							var array = [];
							arr.push(array);
							$(item).children().not(':last').each(function(i,elem) {//输入框
								var obj = {};
								if(Number($(elem).find('[data-calc]').val()) === 0){
									return;
								}
								obj[key] = $(elem).find('[data-sku]').val();
								obj.qty = $(elem).find('[data-calc]').val();
								array.push(obj);
							});
						});
						var submitObj = _this.find('.form-group :input').serializeObject();
						var contentObj = {};
						arr.forEach(function (item,index) {
							contentObj[index+1] = item;
						});
						submitObj.content = JSON.stringify(contentObj);
						submitObj.prodType = key[0].toUpperCase();
						ajaxReq({
							url: form.getAttribute('action'),
							type: 'POST',
							data: submitObj
						})
						.then(function(data){
							if(typeof data === 'undefined'){
								return;
							}
							var modal = _this.closest('.modal');
							tipsShow(localeI18n.addSuccess,modal.find('.modal-dialog'));
							_this.trigger('reset');
							setTimeout(function(){
								modal.modal('hide');
							},2700);
						});
					}
				});
			}
		},


	};
	$('body').on('click','[data-toggle="modal"][data-modal]',function(e){
		var modalId = this.getAttribute('data-modal');
		var modalTmplObj = {
			id : 'modal-template', 
			data: { 
				subModal: '${include "' + (modalInfo[modalId].equalsTo ? modalInfo[modalId].equalsTo : modalId) + '"}', 
				modalTitle: modalInfo[modalId].title,
				btnName: modalInfo[modalId].btnName
			}
		};
		if(modalInfo[modalId].otherInfo){
			modalTmplObj.data[modalInfo[modalId].otherInfo] = true;
		}
		var tmpl = parseTmpl(modalTmplObj);
		initModal(
			$(parseTmpl(
				{
					tmpl: tmpl, 
					data: { 
						action: modalInfo[modalId].action 
					}
				})
			).data({ target : this }),
			{ show: modalInfo[modalId].showFunc,hidden: modalInfo[modalId].hiddenFunc }
		);
	});



	$('body').on('click','[data-delete-sku][data-url]',function(e) {
		//删除之后刷新页面
		var _this = $(this);
		if(confirm(localeI18n.confirmOperation)){
			ajaxReq({
				url: this.getAttribute('data-url'),
				type: 'POST',
				data: {sku : this.getAttribute('data-delete-sku')}
			})
			.then(function(data) {
				if(typeof data === 'undefined'){
					return;
				}
				tipsShow(data.msg,$('body'));
				showPage($('form.search-form[data-api]:visible').data().pageParam);
			});
		}
	}).on('change','select[name="boxSku"]',function(e) {
		//新增组装任务时改变所选礼盒
		var _this = this;
		initBoxAssemble.call(_this,'showItemDetail2',{sku: _this.value});
	}).on('click','[data-taskId][data-key]',function(e) {
		var _this = this;
		var data = {};
		data[this.getAttribute('data-key')] = this.getAttribute('data-taskId');
		if(confirm(localeI18n.confirmOperation)){
			ajaxReq({
				url: this.getAttribute('data-url'),
				data: data,
				type: 'POST'
			})
			.then(function (data) {
				if(typeof data === 'undefined'){
					return;
				}
				showPage($('form.search-form[data-api]:visible').data().pageParam);
			});
		}
	}).on('submit','.scan-submit-form',function(e) {
		//扫描入库或出库
		var _this = $(this);
		ajaxReq({
			url: this.getAttribute('data-api'),
			type: 'POST',
			data: $(this).serializeObject()
		})
		.then(function (data) {
			if(typeof data === 'undefined'){
				return;
			}
			var time = dateFormat(new Date(),'yyyy年 MM月 dd日 hh:mm:ss');
			var dataList = [{scanUser: $('.record-user-name').text(),count:  Math.abs($('[name="qty"]:visible').val().trim() || 1),boxCode:$('[name="barCode"]:visible').val().trim(),scanDate: time}];
			_this.closest('.tab-pane').find('.data-container').prepend(parseTmpl({data: {list: dataList},id: 'storage-list-tmpl' }));
			_this[0].qty.value = _this[0].qty.min;
			_this.find('[name="barCode"]').focus().select();
		});
		return false;
	}).on('change','input.item-input-fix[data-calc]',function(e) {
		var _this = $(this);
		if(!/^(0|[1-9][0-9]*)$/g.test(this.value)){
			this.value = 0;
			_this.change();
			return; 
		}
		var parent = _this.closest('.item-input-container');
		var elems = $.makeArray( parent.find('[data-calc]') );
		var total = elems.map(function(item){ 
				return Number(item.value); 
			}).reduce(function(x,y){
				return x + y;
			});
		parent.find(this.getAttribute('data-calc')).val(total);
		if(Number($('[data-bind=".totalCount"]').val()) === total){
			_this.closest('.item-cell-container').css('border','');
		}
	});

}(jQuery));

function appendOption(obj){
	var str = '';
	Object.keys(obj).forEach(function (key) {
		str += '<option value="'+ key +'">'+ obj[key] +'</option>';
	});
	return str ;
}

var statusText = {
	0: localeI18n.newCreated,
	1: localeI18n.BillHasPrinted,
	2: localeI18n.barCodeHasPrinted,
	3: localeI18n.allHavePrinted,
	4: localeI18n.hasCompleted
};
$('select[name="status"]').append(appendOption(statusText));

//页面初始化
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

		initPager($.extend(option,{totalCount: data.totalNum,pageSize: submitParam.pageSize}));

		var dataList = {list: [].concat(data.taskList)};
		dataList.list.status = statusText;
		dataList.list.forEach(function(item){
			item.dataStringify = JSON.stringify(item);
		});
		option.dataContainer.html(parseTmpl({data: dataList,id: option.id }));

	});
	
}


$('#query-component-modal').on('show.bs.modal',function(e) {
	//模态框出现时点击框内标签按钮，发送请求拿到数据同时设置框内导出按钮的url
	var elem = $(this).data({taskId: e.relatedTarget.getAttribute('data-taskId')}).find('[data-toggle="tab"]').eq(0).click()
	.end().end().find('[data-req][data-url]');
	var qs = '?' + $.param({taskId: e.relatedTarget.getAttribute('data-taskId'), operator: $('.record-user-name').text()});
	elem.each(function (i,item) {
		item.setAttribute('href',APIHOST + item.getAttribute('data-req') + qs);
	});
}).on('hidden.bs.modal',function(e){
	//每次模态框出现都默认选中按商品sku显示
	$(this).find('[name="showType"]').eq(1).click();
	showPage($('form.search-form[data-api]:visible').data().pageParam);
});
$('body').on('change','[name="showType"]',function(e){
	//修改显示类型时，切换需要显示的值
	var _this = this;
	$(_this).closest('.modal').find('.item-input').each(function(index,item){
		item.value = $(item).data()[_this.value] || '';
	});
}).on('change','[name="prodType"]',function(e){
	//修改提交字段时，改变组装项输入框的值
	var key = this.value.toLowerCase();
	$('#modal-frame [data-sku][data-barcode]').each(function(index,item){
		if(key === 'barcode'){
			this.type = 'number';
		} else {
			this.type = 'text';
		}
		this.value = this.getAttribute('data-'+ key +'');
	});
});


//新增以及删除当前组装项里的商品
$('body').on('click','.add-new-line',function(e){
	var _this = $(this);
	$(this.getAttribute('data-clone')).eq(0).clone().val('').prop('readonly',false)
		.attr('data-sku','').attr('data-barcode','')
		.appendTo(_this.parent().siblings(this.getAttribute('data-target')));
}).on('click','.remove-one-line',function(e){
	var _this = $(this);
	var target = _this.parent().siblings(this.getAttribute('data-target')).children();
	if (target.length >1){
		target.eq(-1).remove();
	} else {
		tipsShow(localeI18n.lastOnecantRemove,_this.closest('.modal-dialog'));
	}
});

//验证输入的数量是否合法
function validateCount(){
	var _this = this;
	var elems = $.makeArray( _this.find('.totalCount.item-input-fix') );
	var totalElem = $('[data-bind=".totalCount"]');
	var flag = elems.some(function(el,i){
		return Number(el.value) !== Number(totalElem.val());
	});
	if( flag ) {
		tipsShow(localeI18n.boxCountIsNotAllow,_this.closest('.modal-dialog'));
		_this.css('border','1px solid red');
		return false;
	}
	_this.css('border','');
	return true;
}

//某个组装项只有一个组品，数量自动设为等于礼盒数量，不要再让用户输入。
$('body').on('change','[data-bind=".totalCount"]',function(e){
	var _this = this;
	var target = $(_this).closest('.modal').find('.item-input-container').map(function () {
		if($(this).find('[data-calc]').length === 1){
			return $(this).find('[data-calc]')[0];
		}
	});
	target.each(function () {
		$(this).val(_this.value).change();
	});
});

//查看组装明细
$('body').on('click','.tab-box-item',function(e){
	var tmpl = this.getAttribute('data-tmpl');
	//initBoxAssemble.call(this,tmpl,{});
	ajaxReq({
		url: this.getAttribute('data-api'),
		data: {taskId: $(this).closest('.modal').data('taskId')}
	})
	.then(function(data){
		if(typeof data === 'undefined'){
			return;
		}
		var dataArr = formatList(data.data,tmpl);
	// 	var dataArr =[
	// 			[{sku : 111,barCode : 222,qty:2323},{sku : 111,barCode : 222,qty:2323}],
	// 			[{sku : 111,barCode : 222,qty:2323}],
	// 			[{sku : 111,barCode : 222,qty:2323}],
	// 			[{sku : 111,barCode : 222,qty:2323}],
	// 			[{sku : 111,barCode : 222,qty:2323}]
	// 		];
	// var dataArr = [
	// 		{
	// 			//sku: 1121,
	// 			barCode: 2312312,
	// 			qty: 544,
	// 			detail: [{
	// 				sku: 111,
	// 				barCode: 222,
	// 				name: 333
	// 			},{
	// 				sku: 111,
	// 				barCode: 222,
	// 				name: 333
	// 			},{
	// 				sku: 111,
	// 				barCode: 222,
	// 				name: 333
	// 			}]
	// 		},
	// 		{
	// 			//sku: 11221,
	// 			barCode: 2312312,
	// 			qty: 544,
	// 			detail: [{
	// 				sku: 111,
	// 				barCode: 222,
	// 				name: 333
	// 			}]
	// 		}

	// ];
		var tmplData = {};
		tmplData[tmpl] = dataArr;

		setTimeout(function(){
			$('#query-component-modal').find('.tab-pane.active .data-container').html(parseTmpl({id:'item-detail-tmpl',data:tmplData}));
			if(tmpl === 'showBill'){
				delete data.data[0];
				$('#query-component-modal').find('[data-bind]').each(function (i,item) {
					item.innerHTML = data.data[item.getAttribute('data-bind')] || localeI18n.none;
				});
			}
		});
	});
});

