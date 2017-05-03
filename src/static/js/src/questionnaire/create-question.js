$(document).on('click','label[for]',function (e) {
	var _this = $(this);
	var input = _this.find('input').length?_this.find('input').focus()[0] : _this.focus()[0];
	setTimeout(function () {
		input.checked = true;
		$(input).is('[value="link"]') && $('[data-hide]').hide() || $('[data-hide]').show();
	});
});

$(document).on('keyup','[data-publish]',function (e) {
	$('[data-bind="'+ this.name +'"]').text(this.value);
});

window.onbeforeunload = function (e) {
	if(location.pathname !== '/questionnaire/cn/create-question'){
		return;
	}
	if(!window.hasSave){
		return '您创建的问卷尚未保存提交，现在离开页面将不记录任何信息，您确定要离开吗？';
	}
};

var questionContainer = $('.question-setting-container');
var changeRelatedProperty = $('.changeRelatedProperty');
$(document).on('change','[data-tmpl-id]',function (e) {
	var _this = $(this);
	var tmpl = parseTmpl({id: this.getAttribute('data-tmpl-id'),data:{}});
	if(_this.val() == '3'){
		$('.changeRelatedProperty').hide();
	} else {
		$('.changeRelatedProperty').show();
	}
	$('.question-setting-container').html(tmpl);
});
$(function () {
	$('[data-tmpl-id]').eq(0).click();
});

//获取属性列表
var dataCache = '';
function getRelatedData(callback) {
	return ajaxReq({
	    url: '/sas/attribute/list'
	})
	.then(function (data) {
		dataCache = data.data;
	    return data;
	});
}
function getRelatedDataAndShowList(callback,data) {
	callback = callback || function(){};
	data = data || {};
	getRelatedData()
	.then(function (json) {
		relatedProperty(json,data.attribute_id);
		return json;
	})
	.then(function(){
		callback(data);
	});
}
//勾选关联属性
$(document).on('change','.related-or-not',function (e) {
	var _this = $(this);
	setTimeout(function () {
		if(_this[0].checked){
			getRelatedDataAndShowList();
		} else {
			$('[name="relatedProperty"]').hide();
			$('[data-tmpl-id]').prop('disabled',false).filter(':checked').change();
		}
	});
});
//改变所选属性名
$(document).on('change','[name="relatedProperty"]',function (e) {
	var _this = $(this);
	$('[data-tmpl-id]').prop('disabled',true);
	setTimeout(function () {
		$('[data-tmpl-id][value="'+ _this[0].value +'"]').prop('disabled',false).click();
	});
	var option = '';
	setTimeout(function () {
		option = _this[0].selectedOptions[0];
		$('[data-bind="relatedProperty"]').text(option.innerHTML);
		var obj = dataCache.reduce(function (obj,item) {
			item.attribute_id.toString() === obj.attribute_id && (obj.item = item);
			return obj;
		},{attribute_id: option.getAttribute('data-id')});
		createItem(obj.item);
		setTimeout(function () {
			$('[data-create]').hide();
		});
	});
});
function createItem(obj,method) {
	$('.question-option-list')[method || 'html'](parseTmpl({id: 'option-item-tmpl',data: obj || {}}));
}
function relatedProperty(data,id) {
	var html = '';
	for (var i = 0; i < data.data.length; i++) {
		html += '<option data-id="'+ data.data[i].attribute_id +'" value="'+ data.data[i].type +'">'+ data.data[i].title +'</option>'
	}
	var select = $('[name="relatedProperty"]');
	select.show().html(html);
	select.find('[data-id="'+ id +'"]').length && select.find('[data-id="'+ id +'"]').prop('selected',true).end().change() || select.change();
	return data.data;
}
//新增或减少项目
var createMap = {
	plus: function (e) {
		createItem({},'append');
		setTimeout(function () {
			$('.question-option-list > li').eq(-1).remove();
		});
	},
	minus: function (e) {
		if($('.question-option-list > li').length === 2){
			alert('最少两个选项，不能再删了！');
			return;
		}
		$(this).closest('li').remove();
	}
};
$(document).on('click','[data-create]',function (e) {
	!$('.related-or-not')[0].checked && createMap[this.getAttribute('data-create')].call(this,e);
});

//添加题目
$(document).on('click','[data-role="addNewQuestion"]',function (e) {
	setTimeout(function(){
		if($('[data-role="saveEditQuestion"]:visible').length) {
			alert('请先将正在编辑的题目保存一下！');
			return;
		}
		var data = validateAndGetQuestionData.call(this);
		data && createQuestionPreviewItem(data);
	});
});
function validateAndGetQuestionData() {
	var flag = $('.question-setting-container input').toArray().some(function (elem,i) {
		elem.focus();
		return elem.value.trim() === '';
	});
	if(flag){
		alert('请把题目相关信息填写完整！');
		return;
	}

	var data = {
		type: $('[name="type"]:checked').val(),
		title: $('[name="questionTitle"]').val(),
		is_required: $('[name="is_required"]:checked').val() || 0,
		attribute_id: $('[name="relatedProperty"]:visible')[0]?$('[name="relatedProperty"]:visible')[0].selectedOptions[0].getAttribute('data-id'):'',
	};
	var options = [];
	$('[name="optionTag"]').each(function (i,elem) {
		var obj = {tag_id: elem.getAttribute('data-tag-id') || '', value: elem.value};
		elem.getAttribute('data-option-id') && (obj.option_id = elem.getAttribute('data-option-id'));
		options.push(obj);
	});
	data.options = options;
	return data;
}
function createQuestionPreviewItem(data,callback){
	var arr = [].concat(data);
	arr.forEach(function (item) {
		item.dataStringify = JSON.stringify(item);
	});
	!callback && $('.question-preview-list').append(parseTmpl({id:'question-preview-tmpl',data:{data:arr}})) || callback(arr);

	//重置问题配置
	$('.related-or-not').prop('checked',false).change();
	setTimeout(function () {
		$('[data-tmpl-id]').eq(0).click().change();
	});
}


//删除问题
$(document).on('click','[data-role="remove-question"]',function (e) {
	$(this).closest('li').remove();
});

function validateUrl(flag) {
	var httpReg = /^((http|https):\/\/)?(\w(\:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(\:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/i;
	var linkElem = $('#outside-chain [name="url"]:visible');
	if(linkElem.length ){
		if(!httpReg.test(linkElem.val())){
			alert('请输入正确的外部链接');
			linkElem.focus();
			return;
		} else {
			if(flag){
				return { url: linkElem.val() };
			}
			saveQuestionnaire({
				url: linkElem.val()
			});
			return;
		}
	}
	return true;
}

function getQuestionnaireDataAndValidate() {
	var titleElem = $('[data-bind="questionSummaryTitle"]');
	var despElem = $('[data-bind="questionSummaryIntro"]');
	if(!titleElem.text().trim() || !despElem.text().trim()){
		alert('请填写正确的问卷基本信息！');
		$('[data-publish]').toArray().some(function (elem) {
			if($(elem).val().trim() === ''){
				elem.focus();
				return true;
			}
		});
		return;
	}
	var data = {
		title: titleElem.text().trim(),
		description: despElem.text().trim(),
		questions: $('.question-preview-list >li').toArray().reduce(function (arr,elem) {
						arr.push(JSON.parse(elem.getAttribute('data-stringify')));
						return arr;
					},[])
	};
	if(data.questions.length === 0) {
		alert('请至少添加一道题！');
		return;
	}
	return data;
}
//保存问卷
$(document).on('click','[data-save-question]',function (e) {
	//url验证不通过则返回
	if(!validateUrl()) {
		return;
	}
	var data = getQuestionnaireDataAndValidate.call(this);
	if(!data) {
		return;
	}

	saveQuestionnaire(data);
});
function saveQuestionnaire(obj) {
	var list = readQuestionnaireCache();
	list.unshift(obj);
	localStorage.cacheQuestion = JSON.stringify(list);
	window.hasSave = true;
	alert('暂存成功，该问卷需要到问卷管理页面下进行相应设置！');
	location.href = '/questionnaire/cn/question-manage';
}

function readQuestionnaireCache() {
	try {
		var cacheQuestion = JSON.parse(localStorage.cacheQuestion)
	}catch(e) {
		return [];
	}
	return [].concat(cacheQuestion);
}



// //编辑单个问题
// $('body').on('click','[data-edit-question-item]',function (e) {
//     var _this = $(this);
//     var flagElem = $('[data-role="saveEditQuestion"]');
//     flagElem.data('li',_this.closest('li'));
//     flagElem.show();
//     var questionData = JSON.parse(_this.closest('li').attr('data-stringify'));
//     $('[name="is_required"]').prop('checked',false).filter('[value="'+ questionData.is_required +'"]').prop('checked',true);
//     if(questionData.attribute_id && questionData.attribute_id != '0') {
//         $('.related-or-not')[0].checked = true;
//         getRelatedDataAndShowList(fillInputs,questionData);
//     } else {
//         flagElem.length && $('[data-tmpl-id]').prop('disabled',true);
//         setTimeout(function () {
//             $('[data-tmpl-id][value="'+ questionData.type +'"]').prop('disabled',false).click();
//             $('[name="questionTitle"]').val(questionData.title);
//         });
//         if(questionData.type == '3'){

//         } else {
//             createItem({tags: questionData.options});
//         }
//     }
// });
