var scene = {
	1:'用户',
	2:'内容',
	3:'商品'
};
var statsObj = {
	1:localeI18n.active,
	2:localeI18n.inactive
};
function getCategoryList(option) {
	option = option || {};
	$('.tag-right-content').hide();
	return ajaxReq({
		url: '/sas/tag/categoryList',
		data: option
	})
	.then(function (data) {
		$('.tag-left-list').data('current-option',option);
		data.data.items.scene = scene;
		data.data.items.statsObj = statsObj;
		data.data.items.forEach(function (item) {
			item.stringify = JSON.stringify(item);
		});
		$('.tag-left-list table .data-container').html(parseTmpl({id:'tag-category-tmpl',data:data.data}));
		initPager({option:{page: data.data.page},totalCount: data.data.pageCount,pageElem: $('.tag-left-list .footer-pagenation'),method: getCategoryList});
	});
}
$(function () {
	getCategoryList();
});

$('.tag-left-list').on('click','tr',function(e) {
	if(e.target.nodeName.toLowerCase() == 'button'){
		return;
	}
	//显示分类对应的标签
	var _this = $(this);
	_this.addClass('active')
	.siblings().removeClass('active');
	$('.tag-right-content').show();
	$('.tag-right-content table').attr('data-scene',JSON.stringify(JSON.parse(this.getAttribute('data-stringify')).scene.sort(function (x,y) {
		return x-y;
	}))).attr('data-id',JSON.parse(this.getAttribute('data-stringify')).id).data('target',_this);
	getCategoryTags({category_id: _this.data('stringify').id,page:1});
});
function getCategoryTags(option) {
	ajaxReq({
		url: '/sas/tag/list',
		data: option
	})
	.then(function (data) {
		$('.tag-right-content').data('current-option',option).attr('data-tags-count',parseInt(data.data.pageCount)*10);
		data.data.scene = scene;
		data.data.sceneArr = JSON.parse($('.tag-right-content table').attr('data-scene'));
		var allScene = data.data.sceneArr.reduce(function (obj,id) {
			obj[id] = {scene_id: id, label: '', is_visible: '2'};
			return obj;
		},{});
		data.data.items.length && data.data.items.forEach(function (item) {
			var oldLength = item.list.length;
			item.list.forEach(function (item) {
				allScene[item.scene_id] = item;
			});
			item.list = Object.keys(allScene).reduce(function (arr,id) {
				arr.push(allScene[id]);
				return arr;
			},[]);
			var newLength = item.list.length;
			(newLength - oldLength > 0) && (arguments[2].modified = true);
			item.list.sort(function (cur,next) {
				return cur.scene_id - next.scene_id;
			});
		});
		// data.data.items.scene = scene;
		data.data.items.forEach(function (item) {
			item.stringify = JSON.stringify(item);
		});
		$('.tag-right-content table').html(parseTmpl({id:'tag-list-tmpl',data:data.data}));
		initPager({option:option,totalCount: data.data.pageCount,pageElem: $('.tag-right-content .footer-pagenation'),method: getCategoryTags});
	});
}

//添加标签
$(document).on('click','[data-add-item]',function (e) {
	var sceneArr = JSON.parse($('.tag-right-content table').attr('data-scene'));
	var data = {
	    "sort": parseInt($('.tag-right-content').attr('data-tags-count'))+1,
	    "list": sceneArr.reduce(function (arr,sceneId) {
			arr.push({
		            'scene_id': sceneId,
		            'label': '',
		            'is_visible': ''
		        });
			return arr;
		},[]),
	    'status': 1
	};
	$('.tag-right-content').attr('data-tags-count',data.sort);
	$('.tag-right-content .data-container').append(parseTmpl({ id: 'tag-list-item-tmpl',data: {items: [data]} }));
});


//必须是非负整数
$('.tag-right-content').on('change','[data-number]',function (e) {
	if(!/^([\d]+)$/g.test(this.value-0)){
        alert('只能输入不小于0的整数！');
        this.value = 0;
        var _this = this;
        setTimeout(function () {
	        _this.focus();
        });
        e.stopPropagation();
    }
});


//缓存数据
$('.tag-right-content').on('change','tr',function (e) {
	var _this = $(this);
	var submitObj = {};
	submitObj.list = _this.find('form:not([data-divide])').toArray().reduce(function (arr,form) {
		arr.push($(form).serializeObject());
		return arr;
	},[]);
	$.extend(submitObj,_this.find('[data-serialize]').serializeObject());
	_this.attr('data-stringify',JSON.stringify(submitObj)).addClass('modified');
	$(e.target).hasClass('color-warning') && $(e.target).removeClass('color-warning');
});

//模态框中的添加或保存按钮
$('body').on('click','.modal .modal-submit-btn',function(e) {
    $(this).closest('.modal').find('.modal-body').find('form:visible').submit();
});

//批量保存标签
$(document).on('click','[data-save="tagList"]',function (e) {
	var category_id = $('.tag-right-content table').attr('data-id');
	var checked = true;
	var listArr = $('.tag-right-content .modified').toArray().reduce(function (arr,tr) {
		var item = JSON.parse(tr.getAttribute('data-stringify'));
		item.list.forEach(function (obj) {
			obj.is_visible = obj.is_visible || '2';
			if(!checked){
				return;
			}
			checked = !!obj.label;
		});
		arr.push(item);
		return arr;
	},[]);
	if(!listArr.length){
		alert('无修改项，无需保存！');
		return;
	}
	if(!checked){
		alert('还有必填项没有填写，无法保存！');
		$('.tag-right-content [name="label"]').filter(function () {
			return this.value === '';
		}).addClass('color-warning').eq(0).focus();
		return;
	}
	ajaxReq({
		url: '/sas/tag/save',
		type: 'post',
		data: {data:JSON.stringify(listArr),category_id: category_id}
	})
	.then(function (data) {
		alert(data.msg);
		getCategoryTags($('.tag-right-content').data('current-option'));
	});
});

var modalInfo = {
	'add': {
		title: localeI18n.add,
		btnName: localeI18n.add,
		hiddenFunc: function (e) {
			getCategoryList($('.tag-left-list').data('current-option'));
        },
        showFunc: function(e){
        	var modal = $(this);
        	// $(this).find('form [name="scene"]').eq(0).prop('checked',true);
        	$(this).find('form').validate({
        	    submitHandler: function(form) {
        	        var _this = $(form);
        	        var submitObj = _this.serializeObject();
        	        submitObj.scene = JSON.stringify([].concat(submitObj.scene));
        	        ajaxReq({
        	        	url: '/sas/tag/categorySave',
        	        	type: 'post',
        	        	data: submitObj
        	        })
        	        .then(function () {
	        	        modal.modal('hide');
        	        });
        	    }
        	});
        }
	},
	'edit': {
		title: localeI18n.edit,
		btnName: localeI18n.save,
		hiddenFunc: function (e) {
			getCategoryList($('.tag-left-list').data('current-option'));
        },
        showFunc: function(e){
        	var modal = $(this);
        	var target = modal.data('target');
        	var tr = $(target).closest('tr');
        	var data = tr.data('stringify');
        	var form = $(this).find('form')[0];
        	Object.keys(data).forEach(function (value,key) {
        		if(!Array.isArray(data[value])) {
        			$(form).find('[name="'+ value +'"]').val(data[value]);
        		} else {
        			data[value].forEach(function (item,index) {
	        			$(form).find('[name="'+ value +'"][value="'+ item +'"]').prop('checked',true).parent('label').addClass('disabled');
        			});
        		}
        		
        	});
        	$(this).find('form').validate({
        	    submitHandler: function(form) {
        	        var _this = $(form);
        	        var submitObj = _this.serializeObject();
        	        submitObj.scene = JSON.stringify([].concat(submitObj.scene));
        	        ajaxReq({
        	        	url: '/sas/tag/categorySave',
        	        	type: 'post',
        	        	data: submitObj
        	        })
        	        .then(function () {
	        	        modal.modal('hide');
        	        });
        	    }
        	});
        }
	}
};

function initPager(option){
	option.pageElem.pagination({
        dataSource: new Array(Number(parseInt(option.totalCount) * parseInt(option.option.pageSize || 10))),
        pageSize: option.option.pageSize || 10,
        // totalPage:2,
        showGoInput: true,
        showGoButton: true,
        pageNumber: option.option.page||1,
        afterPageOnClick:function (e,index) {
          	option.method($.extend(option.option,{page: index}));
        },
        afterPreviousOnClick:function (e,index) {
          	option.method($.extend(option.option,{page: index}));
        },
        afterNextOnClick:function (e,index) {
          	option.method($.extend(option.option,{page: index}));
        },
        afterGoButtonOnClick:function (e,index) {
            if(parseInt(option.totalCount) >= Number(index) && index !== '' ){
          		option.method($.extend(option.option,{page: index}));
            }
        },
        callback: function (arr,param) {
        	
        }
    });
}