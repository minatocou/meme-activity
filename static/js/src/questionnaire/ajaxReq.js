function ajaxReq(a){var e=function(){};return a.resetCallback&&"function"==typeof a.resetCallback&&(e=a.resetCallback),delete a.resetCallback,a=$.extend({dataType:"JSON",data:{}},a),a.url=APIHOST+"/api/internal"+a.url,a.data.last_operator=$(".user-name").data("name"),$.ajax(a).then(function(a){if("1"===String(a.code)){try{a.data=JSON.parse(a.data)}catch(t){a.data=a.data}return a}return alert(a.msg),e(),$.Deferred()}).fail(function(a){console.log(a),alert(localeI18n.errorTips)})}var localeI18n=i18n[$(".header-container").data("localize")],APIHOST="";$.ajaxSetup({cache:!1}),$.fn.serializeObject=function(){var a={},e=this.serializeArray();$.each(e,function(){void 0!==a[this.name]?(a[this.name].push||(a[this.name]=[a[this.name]]),a[this.name].push(this.value||"")):a[this.name]=this.value||""});var t=$("input[type=radio],input[type=checkbox]",this);return $.each(t,function(){a.hasOwnProperty(this.name)||(a[this.name]="")}),a},$(document).ajaxStart(function(){$(".ajax-loading-backdrop").show()}).ajaxStop(function(){$(".ajax-loading-backdrop").hide()}),jQuery.validator&&jQuery.validator.addMethod("stringCheck",function(a,e){return this.optional(e)||/^([\w|-]+)$/g.test(a)},localeI18n.stringCheck),jQuery.validator&&jQuery.validator.addMethod("numberCheck",function(a,e){return this.optional(e)||/^([\d]+)$/g.test(a)},localeI18n.numberCheck),jQuery.validator&&jQuery.validator.addMethod("zh_en_number",function(a,e){return this.optional(e)||/^[\u4e00-\u9fa5a-zA-Z0-9]+$/g.test(a)},"只能是中文英文和数字");