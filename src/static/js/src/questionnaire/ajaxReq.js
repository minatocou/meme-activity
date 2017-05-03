var localeI18n = i18n[$('.header-container').data('localize')];
var APIHOST = '';//$(".header-container").data("questionnaire");
$.ajaxSetup({cache: false});
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

//ajax过渡
$(document).ajaxStart(function () {
	  $('.ajax-loading-backdrop').show();
	}).ajaxStop(function () {
	  $('.ajax-loading-backdrop').hide();
	});

jQuery.validator&&jQuery.validator.addMethod("stringCheck", function(value, element) {       
    return this.optional(element) || /^([\w|-]+)$/g.test(value);       
}, localeI18n['stringCheck']); 
jQuery.validator&&jQuery.validator.addMethod("numberCheck", function(value, element) {       
    return this.optional(element) || /^([\d]+)$/g.test(value);       
}, localeI18n['numberCheck']);
jQuery.validator&&jQuery.validator.addMethod("zh_en_number", function(value, element) {       
    return this.optional(element) || /^[\u4e00-\u9fa5a-zA-Z0-9]+$/g.test(value);       
}, '只能是中文英文和数字');

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
	option.url = APIHOST + '/api/internal' + option.url;//encodeURIComponent(option.url);
	option.data.last_operator = $('.user-name').data('name');
	// option.headers = {
	// 	signature: makeSign(option.data,KEY)
	// };
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