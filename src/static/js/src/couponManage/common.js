var localeI18n = i18n[$('.header-container').data('localize')];
var APIHOST = $('.header-container').data('coupon');//'http://qa4coupon.cn.memebox.com';
$.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        var $radio = $('input[type=radio],input[type=checkbox]',this);
        $.each($radio,function(){
            if(!o.hasOwnProperty(this.name)){
                o[this.name] = '';
            }
        });
        return o;
};


jQuery.validator.addMethod("stringCheck", function(value, element) {       
    return this.optional(element) || /^([\w|-]+)$/g.test(value);       
}, localeI18n['stringCheck']); 
jQuery.validator.addMethod("numberCheck", function(value, element) {       
    return this.optional(element) || /^([\d]+)$/g.test(value);       
}, localeI18n['numberCheck']);

//ajax过渡
$(document).ajaxStart(function () {
	  $('.ajax-loading-backdrop').show();
	}).ajaxStop(function () {
	  $('.ajax-loading-backdrop').hide();
	});

function throttle(method, delay, duration) {
    var timer = null,
        begin = new Date();
    return function() {
        var context = this,
            args = arguments,
            current = new Date();
        clearTimeout(timer);
        if (current - begin >= duration) {
            method.apply(context, args);
            begin = current;
        } else {
            timer = setTimeout(function() {
                method.apply(context, args);
            }, delay);
        }
    }
}

//replaceObjectKeys方法用于替换后台返回数据的key，方便前端统一处理相似的数据
function concatFunc(arr,obj){
	if((typeof obj).toLowerCase() !== 'object'){
		return ;
	}
	var keys = '';
	if(Array.isArray(obj)){
		obj.forEach(function (item) {
			concatFunc(arr,item);
		});
	} else {
		arr.push(obj);
		keys = Object.keys(obj);
		keys.forEach(function (key) {
			concatFunc(arr,obj[key]);
		});
	}
}
function getMapObj(object) {
	var keys = Object.keys(object);
	var mapObj = {};
	keys.forEach(function (targetKey) {
		[].concat(object[targetKey]).forEach(function (originalKey) {
			if(typeof mapObj[originalKey] !== 'undefined'){
				throw new Error('The rulesObject has some values repeated,such as "'+ originalKey +'"');
			}
			mapObj[originalKey] = targetKey;
		});
	});
	return mapObj;
}
function replaceObjectKeys(originalObject,rulesObject) {
	if(!rulesObject || !Object.keys(rulesObject).length || typeof originalObject === 'string' || originalObject === null){ 
		return ;
 	}

	var mapObj = getMapObj(rulesObject);
 	var concatArray = [];
	concatFunc(concatArray,originalObject);
	concatArray.forEach(function (object) {
		var keys = Object.keys(object);
		keys.forEach(function (key) {
			if(typeof mapObj[key] !== 'undefined') {
				object[mapObj[key]] = object[key];
				delete object[key];
			}
		});
	});
}

template.config('openTag', '${');
template.config('closeTag', '}');

$('[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	var _this = $(this);
	var target = $(_this.attr('data-target'));
	//提交搜索表单
	target.find('form.search-form[data-api]').submit();
});

$(function () {
	//点击之后会提交搜索表单，进而显示页面数据
	$('.tab-list-item.active').click();
});

//模态框中的添加或保存按钮
$('body').on('click','.modal .modal-submit-btn',function(e) {
	$(this).closest('.modal').find('.modal-body').find('form:visible').submit();
}).on('click','[data-print-url]',function (e) {
	setTimeout((function () {
		open(APIHOST + this.getAttribute('data-print-url'),'_blank');
	}).bind(this));
});


$('body').on('submit','form.search-form[data-api]',function(e){
	var tmplId = this.getAttribute('data-tmpl'),//每个表格的数据模版
		showFunc = this.getAttribute('data-func'),
		_this = $(this);
	_this.data({
		pageParam: {
			page: _this.closest('.tab-pane').find('#pagination-container'),
			dataContainer: _this.closest('.tab-pane').find('.table-responsive > table .data-container'),
			id: tmplId,
			// showFunc: showFunc,
			form: _this
		},
		//用于缓存当前的查询参数，方便分页查询
		submitParam: _this.serializeObject()
	});
	showPage(_this.data().pageParam);

	return false;
});
function ajaxReq(option){
	var callback = function(){};
	if(option.resetCallback && typeof option.resetCallback === 'function'){
		callback = option.resetCallback ;
	}
	delete option.resetCallback;
	option = $.extend({
		dataType: 'JSON',
		data: {}
	},option);
	option.url = APIHOST + option.url;
	option.data.last_operator = $('.user-name').data('name');
	return $.ajax(option)
			.then(function(data){
				if(String(data.code) === '1'){
					try {
						data.data = JSON.parse(data.data);
					} catch (e){
						data.data = data.data;
					}
					return data;
				} else {
					alert(data.msg);
					callback();
					return $.Deferred();
				}
			})
			.fail(function(err){
				console.log(err);
				alert(localeI18n.errorTips);
			});
}
function parseTmpl(option){
	if(option.id){
		return template(option.id, option.data || []);
	} else if(option.tmpl){
		return template.compile(option.tmpl)(option.data || {});
	}
}
function initPager(option){
	var form = option.form;
	option.page.pagination({
        dataSource: new Array(Number(option.totalCount)),
        pageSize: option.pageSize || 10,
        // totalPage:2,
        showGoInput: true,
        showGoButton: true,
        pageNumber: option.pageNum||1,
        afterPageOnClick:function (e,index) {
          	showPage(form.data().pageParam,{pageNum: index});
        },
        afterPreviousOnClick:function (e,index) {
          	showPage(form.data().pageParam,{pageNum: index});
        },
        afterNextOnClick:function (e,index) {
          	showPage(form.data().pageParam,{pageNum: index});
        },
        afterGoButtonOnClick:function (e,index) {
            if(Number($('.paginationjs-page').last().text()) >= Number(index)){
          		showPage(form.data().pageParam,{pageNum: index});
            }
        },
        callback: function (arr,param) {
        	
        }
    });
}

var fillInputData = (function(){
	var mapObj = {
		text : function(item,value){
			item.value = value;
		},
		number : function(item,value){
			mapObj.text(item,value);
		},
		common : function(item,value){
			this.text(item,value);
		},
		checkbox : function(item,value){
			var values = '';
			if(!fillArr(item,value)){
				try {
					values = JSON.parse(value);
				} catch(e){
					values = value.split(',');
				}
				fillArr(item,values);
			}
		},
		radio : function(item,value){
			item.value == value && (item.checked = true);
		},
		select : function(item,value){
			$(item).find('option[value="'+ value +'"]').prop('selected',true);
		}
	};
	function fillArr(item,values){
		return $.isArray(values) && $.each(values,function(index,val){
			if(item.value == val){
				item.checked = true;
				return false;
			}
		});
	}
	function eachElem(selector,data){
		this.filter(selector).each(function(index,item){
			if(typeof data[item.name] !== 'undefined'){
				(mapObj[item.type] ? mapObj[item.type] : mapObj.common)(item,data[item.name]);
			}
		});
	}
	return function (inputs,data){
		inputs = $($.makeArray(inputs));
		var typeArr = ['[type="text"]','[type="number"]','[type="checkbox"]','[type="radio"]','select'];
		$.each(typeArr,function(index,selector){
			eachElem.call(inputs,selector,data);
		})
	};
}());

//简单提示框
var tipsShow = (function (argument) {
	var tips = $('<div class="tipsShow"></div>');
	return function (text,modalDialog,dur){
		if(text.toString().trim() === '') {
			return;
		}
		tips.text(text).show().appendTo(modalDialog).delay(dur || 600).fadeOut( '300' ,function () {
			tips.remove();
		});
	}
}());


function initModal(modal,option){
	option = $.extend({
	  show: function(){},
	  hidden: function(){}
	},option);
	modal.appendTo('body').on({
	    'show.bs.modal':function(e){
	      	option.show.call(this,e);
	    },
	    'hidden.bs.modal': function(e){
	      	option.hidden.call(this,e);

	      	modal.remove();
	    }
  	}).modal('show');
}