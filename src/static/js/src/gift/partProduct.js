/**
 * Created by memebox on 16/12/13.
 */

(function($){



	$('[name="searchType"]').change(function(){
		if(this.checked) {
			$(this.getAttribute('data-bind'))[0].name = this.getAttribute('data-name');
		}
	});

	var modalHideTime = 2700;

	var modalInfo = {
		'add-part-modal' : {
			action: '/master/addproduct',
			title: localeI18n.addNewPart,
			btnName: localeI18n.add,
			otherInfo: 'addContinuity',
			hiddenFunc: function (e) {
				showPage($('form.search-form[data-api]:visible').data().pageParam);
			},
			showFunc: function(e){
				$(this).find('.download-tmpl').attr('href',APIHOST + '').end().find('form').validate({
					submitHandler: function(form) {
						var _this = $(form);
						ajaxReq({
							url: form.getAttribute('action'),
							type: 'POST',
							data: _this.serializeObject()
						})
						.then(function(data){
							if(typeof data === 'undefined'){
								return ;
							}
							var modal = _this.closest('.modal');
							tipsShow(localeI18n.addSuccess,modal.find('.modal-dialog'));
							_this.trigger('reset');
							if(!modal.find('.add-continuity')[0].checked){
								setTimeout(function(){
									modal.modal('hide');
								},modalHideTime);
							}
						});
					}
				});
			}
		},
		'add-box-modal' : {
			action: '/master/addgift',
			title: localeI18n.addBox,
			btnName: localeI18n.add,
			hiddenFunc: function (e) {
				showPage($('form.search-form[data-api]:visible').data().pageParam);
			},
			showFunc: function(e){
				$(this).find('[data-create-item]').val(2).change()
				.end().find('[name="prodType"]').eq(1).click();
				var mapObj = {
					sku: 'sku',
					barcode: 'barcode'
				}
				$(this).find('form').validate({
					submitHandler: function(form) {
						var _this = $(form);
						//每个组装项都不能为空
						if(_this.find('textarea:first-child').toArray().some(function(elem){
							return elem.value.replace(/(\r\n)|(\n)/mg,'').trim() === '';
						})){
							tipsShow(localeI18n.cantAllowEmptyLine,_this.closest('.modal-dialog'));
							return ;
						}
						//拿到提交的数据submitObj
						var key = _this.find('[name="prodType"]:checked').val().toLowerCase();
						var objGroup = {};
						_this.find('.item-input-container').each(function(index,item) {
							var itemObj = [];
							objGroup[index+1] = itemObj;
							$(this).find('textarea').val().replace(/(\r\n)|(\n)/mg,'<br>').split('<br>').forEach(function(elem) {
								if(elem.trim() === ''){
									return;
								}
								var obj = {};
								obj[mapObj[key]] = elem;
								itemObj.push(obj);
							});
						});
						var submitObj = _this.find('.form-group input').serializeObject();
						submitObj.prodType = submitObj.prodType[0].toUpperCase();
						submitObj.prodItemDetail = JSON.stringify(objGroup);
						ajaxReq({
							url: form.getAttribute('action'),
							type: 'POST',
							data: submitObj
						})
						.then(function(data){
							if(typeof data === 'undefined'){
								return ;
							}
							var modal = _this.closest('.modal');
							tipsShow(localeI18n.addSuccess,modal.find('.modal-dialog'));
							_this.trigger('reset');
							setTimeout(function(){
								modal.modal('hide');
							},modalHideTime);
						});
					}
				});
			}
		},
		'import-file-modal' : {
			action: '/master/importproduct',
			title: localeI18n.importPart,
			btnName: localeI18n.import,
			otherInfo: 'downloadTmpl',
			hiddenFunc: function (e) {
				showPage($('form.search-form[data-api]:visible').data().pageParam);
			},
			showFunc: function(e){
				$(this).find('form').validate({
					submitHandler: function(form) {
						var _this = $(form);
						var formData = new FormData(form);
						ajaxReq({
							url: form.getAttribute('action'),
							type: 'POST',
							data: formData,
							processData: false,
						    contentType: false
						})
						.then(function(data){
							if(typeof data === 'undefined'){
								return ;
							}
							var modal = _this.closest('.modal');
							tipsShow(data.msg,modal.find('.modal-dialog'));
							_this.trigger('reset');
							setTimeout(function(){
								modal.modal('hide');
							},modalHideTime);
						});
					}
				});
			}
		},
		'edit-part-modal' : {
			action: '/master/updateproduct',
			equalsTo: 'add-part-modal',
			title: localeI18n.editPart,
			btnName: localeI18n.save,
			showFunc: function(e){
				//获取输入框，并回显
				var inputs = $(this).find('form').find('[data-unique]').prop('readonly',true).end().find(':input[name]');
				fillInputData(inputs,JSON.parse($(e.currentTarget).data('target').getAttribute('data-value')));

				$(this).find('form').validate({
					submitHandler: function(form) {
						var _this = $(form);
						ajaxReq({
							url: form.getAttribute('action'),
							type: 'POST',
							data: _this.serializeObject()
						})
						.then(function(data){
							if(typeof data === 'undefined'){
								return ;
							}
							var modal = _this.closest('.modal');
							tipsShow(localeI18n.addSuccess,modal.find('.modal-dialog'));
							_this.trigger('reset');
							setTimeout(function(){
								modal.modal('hide');
								showPage($('form.search-form[data-api]:visible').data().pageParam);
							},modalHideTime);
						});
					}
				});
			}
		}
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
			if(modalInfo[modalId].otherInfo == 'downloadTmpl'){
				modalTmplObj.data[modalInfo[modalId].otherInfo] = APIHOST + '/master/exportTemplate';
			} else {
				modalTmplObj.data[modalInfo[modalId].otherInfo] = true;
			}
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
			{ show: modalInfo[modalId].showFunc, hidden: modalInfo[modalId].hiddenFunc }
		);
	});


	$('body').on('click','[data-delete-sku][data-url]',function(e) {
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

		initPager($.extend(option,{totalCount: data.totalCount,pageSize: submitParam.pageSize}));

		var dataList = {list: [].concat(data.productInfo || data.boxInfo)};
		dataList.list.forEach(function(item){
			item.dataStringify = JSON.stringify(item);
		});
		option.dataContainer.html(parseTmpl({data: dataList,id: option.id }));
	});
	
}

function formatList(data){

	var list = data;
	var dataArr = {};
	Object.keys(list).forEach(function(key,i) {
		var k = list[key].giftBarCode || list[key].itemId;
		delete list[key].giftBarCode;
		delete list[key].itemId;
		var arr = [];
		var array = dataArr[ k ] = Array.isArray(dataArr[ k ])?dataArr[ k ] : arr;
		$.each(list[key],function(i,obj){
			array.push(obj);
		});
	});
	return dataArr ;
}


$('#query-component-modal').on('show.bs.modal',function(e) {
	//模态框出现时点击框内标签按钮，发送请求拿到数据同时设置框内导出按钮的url
	var elem = $(this).data({sku: e.relatedTarget.getAttribute('data-sku')}).find('[data-toggle="tab"]').eq(0).click()
	.end().end().find('[data-req][data-url]');
	elem[0].setAttribute('href',APIHOST + elem[0].getAttribute('data-req') + e.relatedTarget.getAttribute('data-sku'));

}).on('hidden.bs.modal',function(e){
	//每次模态框出现都默认选择第二个
	$(this).find('[name="showType"]').eq(1).click();
});
$('body').on('change','[name="showType"]',function(e){
	//修改显示类型时，切换需要显示的值
	var _this = this;
	$(e.delegateTarget).find('.item-input').each(function(index,item){
		item.value = $(item).data()[_this.value];
	});
}).on('change','[data-create-item]',function(e){
	if(Number(this.value) < Number(this.getAttribute('min')) || this.value.indexOf('.') !== -1){
		//tipsShow(localeI18n.itemCountCantBeSoLess,$(this).closest('.modal-dialog'));
		return;
	}
	//修改组装项数
	var list = [],target = $(this).closest('form').find('.data-container');
	var leng = target.children().length;
	var len = Number(this.value) - leng;
	if( len > 0){
		for (var i = 0; i < Number(this.value); i++) {
			if(i<leng) {
				list[i] = false;
			} else {
				list[i] = true;
			}
		}
		target.append(parseTmpl({id: 'create-item-input', data: {list: list}}));
	} else if(len < 0) {
		for (var i = 0; i < Math.abs(len); i++) {
			target.children().eq(-1).remove();
		}
	}
}).on('change','[name="prodType"]',function(e){
	//修改提交字段时，改变组装项输入框的值
	var key = this.value.toLowerCase();
	$('#modal-frame [data-sku][data-barcode]').each(function(index,item){
		// if(key === 'barcode'){
		// 	this.type = 'number';
		// } else {
		// 	this.type = 'text';
		// }
		this.value = this.getAttribute('data-'+ key);
	});
}).on('change','#modal-frame [data-sku][data-barcode]',function(e){
	var _this = $(this);
	var mapObj = {
		sku: {
			key:'stringCheck',
			regx: function () {
				return /^([\w|-]+)$/g;
			}
		},
		barcode: {
			key: 'numberCheck',
			regx: function () {
				return /^([0-9]+)$/g;
			}
		}
	};
	var key = _this.closest('.modal-content').find('[name="prodType"]:checked').val().toLowerCase();
	var checkObj = mapObj[key];
	var checkTips = localeI18n[checkObj.key];
	//验证组装项输入是否合法
	var values = this.value.replace(/(\r\n)|(\n)/mg,'<br>').split('<br>').reduce(function (arr,item) {
		if(item.trim() !== ''){
			arr.push(item.trim());
		}
		return arr;
	},[]);
	if(
		values.some(function (item) {
			if(!checkObj.regx().test(item)){
				tipsShow(checkTips,_this.closest('.modal-dialog'));
				return true;
			}
		})
	) {
		return;
	}

	//var inputContainer = _this.closest('.item-input-container').find('[data-sku][data-barcode]').toArray();
	var tagObj = values.reduce(function (obj,elem) {
		//检验当前组装项的输入重复
		if(!obj[elem]){
			obj[elem] = 1;
		} else {
			obj.hasRepeat = true;
		}
		return obj ;
	},{});
	if(tagObj.hasRepeat){
		tipsShow(localeI18n.hasRepeat,_this.closest('.modal-dialog'));
		this.value = '';
		this.focus();
		return;
	}

	// if(!checkObj.regx().test(this.value)){
	// 	//提示用户输入项不合法
	// 	tipsShow(checkTips,_this.closest('.modal-dialog'));
	// 	return;
	// }
	// var flag = _this.closest('form').find('[name="prodType"]:checked');
	// var key = flag.val().toLowerCase();
	this.setAttribute('data-'+ key, this.value);

	//validateInput.call(this,e,flag[0],key);
	
});

//验证输入的sku或者barcode是否合法
var validateInput = function(e,radio,key){
	var _this = $(this);
	var data = {};
	data[radio.name] = radio.value[0].toUpperCase();
	data.product = this.value;
	ajaxReq({
		url: '/master/prodVerify',
		type: 'post',
		data: data
	})
	.then(function(data){
		if(typeof data === 'undefined'){
			_this.val('').focus();
			return ;
		}
		_this[0].setAttribute('data-'+ key +'', _this[0].value);
	});
};


//新增以及删除当前组装项里的商品
// $('body').on('click','.add-new-line',function(e){
// 	var _this = $(this);
// 	$(this.getAttribute('data-clone')).eq(0).clone().val('').prop('readonly',false)
// 		.attr('data-sku','').attr('data-barcode','')
// 		.appendTo(_this.parent().siblings(this.getAttribute('data-target')));
// });
// $('body').on('click','.remove-one-line',function(e){
// 	var _this = $(this);
// 	var target = _this.parent().siblings(this.getAttribute('data-target')).children();
// 	if (target.length >1){
// 		target.eq(-1).remove();
// 	} else {
// 		tipsShow(localeI18n.lastOnecantRemove,_this.closest('.modal-dialog'));
// 	}
// });

//查看礼盒详情
$('body').on('click','.tab-box-item',function(e){
	var tmpl = this.getAttribute('data-tmpl');
	initBoxAssemble.call(this,tmpl);
});

