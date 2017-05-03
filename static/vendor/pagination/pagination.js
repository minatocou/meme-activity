!function(a,e){function t(a){throw new Error("Pagination: "+a)}function i(a){a.dataSource||t('"dataSource" is required.'),"string"==typeof a.dataSource?"undefined"==typeof a.totalNumber?t('"totalNumber" is required.'):e.isNumeric(a.totalNumber)||t('"totalNumber" is incorrect. (Number)'):c.isObject(a.dataSource)&&("undefined"==typeof a.locator?t('"dataSource" is an Object, please specify "locator".'):"string"==typeof a.locator||e.isFunction(a.locator)||t(""+a.locator+" is incorrect. (String | Function)"))}function o(a){var t=["go","previous","next","disable","enable","refresh","show","hide","destroy"];e.each(t,function(e,t){a.off(l+t)}),a.data("pagination",{}),e(".paginationjs",a).remove()}function n(a,e){return("object"==(e=typeof a)?null==a&&"null"||Object.prototype.toString.call(a).slice(8,-1):e).toLowerCase()}"undefined"==typeof e&&t("Pagination requires jQuery.");var r="pagination",s="addHook",l="__pagination-";e.fn.pagination&&(r="pagination2"),e.fn[r]=function(n){if("undefined"==typeof n)return this;var r=e(this),s={initialize:function(){var a=this;if(r.data("pagination")||r.data("pagination",{}),a.callHook("beforeInit")!==!1){r.data("pagination").initialized&&e(".paginationjs",r).remove(),a.disabled=!!g.disabled;var t=a.model={pageRange:g.pageRange,pageSize:g.pageSize};a.parseDataSource(g.dataSource,function(e){if(a.sync=c.isArray(e),a.sync&&(t.totalNumber=g.totalNumber=e.length),t.totalPage=a.getTotalPage(),!(g.hideWhenLessThanOnePage&&t.totalPage<=1)){var i=a.render(!0);g.className&&i.addClass(g.className),t.el=i,r["bottom"===g.position?"append":"prepend"](i),a.observer(),r.data("pagination").initialized=!0,a.callHook("afterInit",i)}})}},render:function(a){var t=this,i=t.model,o=i.el||e('<div class="paginationjs"></div>'),n=a!==!0;t.callHook("beforeRender",n);var r=i.pageNumber||g.pageNumber,s=g.pageRange,l=i.totalPage,c=r-s,u=r+s;return u>l&&(u=l,c=l-2*s,c=1>c?1:c),1>=c&&(c=1,u=Math.min(2*s+1,l)),o.html(t.createTemplate({currentPage:r,pageRange:s,totalPage:l,rangeStart:c,rangeEnd:u})),t.callHook("afterRender",n),o},createTemplate:function(a){var t,i,o=this,n=a.currentPage,r=a.totalPage,s=a.rangeStart,l=a.rangeEnd,c=g.totalNumber,u=g.showPrevious,p=g.showNext,d=g.showPageNumbers,f=g.showNavigator,m=g.showGoInput,h=g.showGoButton,b=g.pageLink,v=g.prevText,y=g.nextText,N=g.ellipsisText,k=g.goButtonText,P=g.classPrefix,x=g.activeClassName,j=g.disableClassName,w=g.ulClassName,S=e.isFunction(g.formatNavigator)?g.formatNavigator():g.formatNavigator,H=e.isFunction(g.formatGoInput)?g.formatGoInput():g.formatGoInput,C=e.isFunction(g.formatGoButton)?g.formatGoButton():g.formatGoButton,O=e.isFunction(g.autoHidePrevious)?g.autoHidePrevious():g.autoHidePrevious,F=e.isFunction(g.autoHideNext)?g.autoHideNext():g.autoHideNext,T=e.isFunction(g.header)?g.header():g.header,J=e.isFunction(g.footer)?g.footer():g.footer,G="",I='<input type="text" class="J-paginationjs-go-pagenumber">',L='<input type="button" class="J-paginationjs-go-button" value="'+k+'">';if(T&&(t=o.replaceVariables(T,{currentPage:n,totalPage:r,totalNumber:c}),G+=t),u||d||p){if(G+='<div class="paginationjs-pages">',G+=w?'<ul class="'+w+'">':"<ul>",u&&(1===n?O||(G+='<li class="'+P+"-prev "+j+'"><a>'+v+"</a></li>"):G+='<li class="'+P+'-prev J-paginationjs-previous" data-num="'+(n-1)+'" title="Previous page"><a href="'+b+'">'+v+"</a></li>"),d){if(3>=s)for(i=1;s>i;i++)G+=i==n?'<li class="'+P+"-page J-paginationjs-page "+x+'" data-num="'+i+'"><a>'+i+"</a></li>":'<li class="'+P+'-page J-paginationjs-page" data-num="'+i+'"><a href="'+b+'">'+i+"</a></li>";else g.showFirstOnEllipsisShow&&(G+='<li class="'+P+"-page "+P+'-first J-paginationjs-page" data-num="1"><a href="'+b+'">1</a></li>'),G+='<li class="'+P+"-ellipsis "+j+'"><a>'+N+"</a></li>";for(i=s;l>=i;i++)G+=i==n?'<li class="'+P+"-page J-paginationjs-page "+x+'" data-num="'+i+'"><a>'+i+"</a></li>":'<li class="'+P+'-page J-paginationjs-page" data-num="'+i+'"><a href="'+b+'">'+i+"</a></li>";if(l>=r-2)for(i=l+1;r>=i;i++)G+='<li class="'+P+'-page J-paginationjs-page" data-num="'+i+'"><a href="'+b+'">'+i+"</a></li>";else G+='<li class="'+P+"-ellipsis "+j+'"><a>'+N+"</a></li>",g.showLastOnEllipsisShow&&(G+='<li class="'+P+"-page "+P+'-last J-paginationjs-page" data-num="'+r+'"><a href="'+b+'">'+r+"</a></li>")}p&&(n==r?F||(G+='<li class="'+P+"-next "+j+'"><a>'+y+"</a></li>"):G+='<li class="'+P+'-next J-paginationjs-next" data-num="'+(n+1)+'" title="Next page"><a href="'+b+'">'+y+"</a></li>"),G+="</ul></div>"}return f&&S&&(t=o.replaceVariables(S,{currentPage:n,totalPage:r,totalNumber:c}),G+='<div class="'+P+'-nav J-paginationjs-nav">'+t+"</div>"),m&&H&&(t=o.replaceVariables(H,{currentPage:n,totalPage:r,totalNumber:c,input:I}),G+='<div class="'+P+'-go-input">'+t+"</div>"),h&&C&&(t=o.replaceVariables(C,{currentPage:n,totalPage:r,totalNumber:c,button:L}),G+='<div class="'+P+'-go-button">'+t+"</div>"),J&&(t=o.replaceVariables(J,{currentPage:n,totalPage:r,totalNumber:c}),G+=t),G},go:function(a,t){function i(a){if(o.callHook("beforePaging",s)===!1)return!1;if(n.direction="undefined"==typeof n.pageNumber?0:s>n.pageNumber?1:-1,n.pageNumber=s,o.render(),o.disabled&&!o.sync&&o.enable(),r.data("pagination").model=n,e.isFunction(g.formatResult)){var i=e.extend(!0,[],a);c.isArray(a=g.formatResult(i))||(a=i)}r.data("pagination").currentPageData=a,o.doCallback(a,t),o.callHook("afterPaging",s),1==s&&o.callHook("afterIsFirstPage"),s==n.totalPage&&o.callHook("afterIsLastPage")}var o=this,n=o.model;if(!o.disabled){var s=a,l=g.pageSize,u=n.totalPage;if(s=parseInt(s),!(!s||1>s||s>u)){if(o.sync)return void i(o.getDataSegment(s));var p={},d=g.alias||{};p[d.pageSize?d.pageSize:"pageSize"]=l,p[d.pageNumber?d.pageNumber:"pageNumber"]=s;var f={type:"get",cache:!1,data:{},contentType:"application/x-www-form-urlencoded; charset=UTF-8",dataType:"json",async:!0};e.extend(!0,f,g.ajax),e.extend(f.data||{},p),f.url=g.dataSource,f.success=function(a){i(o.filterDataByLocator(a))},f.error=function(a,e,t){g.formatAjaxError&&g.formatAjaxError(a,e,t),o.enable()},o.disable(),e.ajax(f)}}},doCallback:function(a,t){var i=this,o=i.model;e.isFunction(t)?t(a,o):e.isFunction(g.callback)&&g.callback(a,o)},destroy:function(){this.callHook("beforeDestroy")!==!1&&(this.model.el.remove(),r.off(),e("#paginationjs-style").remove(),this.callHook("afterDestroy"))},previous:function(a){this.go(this.model.pageNumber-1,a)},next:function(a){this.go(this.model.pageNumber+1,a)},disable:function(){var a=this,e=a.sync?"sync":"async";a.callHook("beforeDisable",e)!==!1&&(a.disabled=!0,a.model.disabled=!0,a.callHook("afterDisable",e))},enable:function(){var a=this,e=a.sync?"sync":"async";a.callHook("beforeEnable",e)!==!1&&(a.disabled=!1,a.model.disabled=!1,a.callHook("afterEnable",e))},refresh:function(a){this.go(this.model.pageNumber,a)},show:function(){var a=this;a.model.el.is(":visible")||a.model.el.show()},hide:function(){var a=this;a.model.el.is(":visible")&&a.model.el.hide()},replaceVariables:function(a,e){var t;for(var i in e){var o=e[i],n=new RegExp("<%=\\s*"+i+"\\s*%>","img");t=(t||a).replace(n,o)}return t},getDataSegment:function(a){var e=g.pageSize,t=g.dataSource,i=g.totalNumber,o=e*(a-1)+1,n=Math.min(a*e,i);return t.slice(o-1,n)},getTotalPage:function(){return Math.ceil(g.totalNumber/g.pageSize)},getLocator:function(a){var i;return"string"==typeof a?i=a:e.isFunction(a)?i=a():t('"locator" is incorrect. (String | Function)'),i},filterDataByLocator:function(a){var i,o=this.getLocator(g.locator);if(c.isObject(a)){try{e.each(o.split("."),function(e,t){i=(i?i:a)[t]})}catch(n){}i?c.isArray(i)||t("dataSource."+o+" must be an Array."):t("dataSource."+o+" is undefined.")}return i||a},parseDataSource:function(a,i){var o=this,n=arguments;c.isObject(a)?i(g.dataSource=o.filterDataByLocator(a)):c.isArray(a)?i(g.dataSource=a):e.isFunction(a)?g.dataSource(function(a){e.isFunction(a)&&t('Unexpect parameter of the "done" Function.'),n.callee.call(o,a,i)}):"string"==typeof a?(/^https?|file:/.test(a)&&(g.ajaxDataType="jsonp"),i(a)):t('Unexpect data type of the "dataSource".')},callHook:function(t){var i,o=r.data("pagination"),n=Array.prototype.slice.apply(arguments);return n.shift(),g[t]&&e.isFunction(g[t])&&g[t].apply(a,n)===!1&&(i=!1),o.hooks&&o.hooks[t]&&e.each(o.hooks[t],function(e,t){t.apply(a,n)===!1&&(i=!1)}),i!==!1},observer:function(){var a=this,i=a.model.el;r.on(l+"go",function(i,o,n){o=parseInt(e.trim(o)),o&&(e.isNumeric(o)||t('"pageNumber" is incorrect. (Number)'),a.go(o,n))}),i.delegate(".J-paginationjs-page","click",function(t){var i=e(t.currentTarget),o=e.trim(i.attr("data-num"));return!o||i.hasClass(g.disableClassName)||i.hasClass(g.activeClassName)?void 0:a.callHook("beforePageOnClick",t,o)===!1?!1:(a.go(o),a.callHook("afterPageOnClick",t,o),g.pageLink?void 0:!1)}),i.delegate(".J-paginationjs-previous","click",function(t){var i=e(t.currentTarget),o=e.trim(i.attr("data-num"));return o&&!i.hasClass(g.disableClassName)?a.callHook("beforePreviousOnClick",t,o)===!1?!1:(a.go(o),a.callHook("afterPreviousOnClick",t,o),g.pageLink?void 0:!1):void 0}),i.delegate(".J-paginationjs-next","click",function(t){var i=e(t.currentTarget),o=e.trim(i.attr("data-num"));return o&&!i.hasClass(g.disableClassName)?a.callHook("beforeNextOnClick",t,o)===!1?!1:(a.go(o),a.callHook("afterNextOnClick",t,o),g.pageLink?void 0:!1):void 0}),i.delegate(".J-paginationjs-go-button","click",function(){var t=e(".J-paginationjs-go-pagenumber",i).val();return a.callHook("beforeGoButtonOnClick",event,t)===!1?!1:(r.trigger(l+"go",t),void a.callHook("afterGoButtonOnClick",event,t))}),i.delegate(".J-paginationjs-go-pagenumber","keyup",function(t){if(13===t.which){var o=e(t.currentTarget).val();if(a.callHook("beforeGoInputOnEnter",t,o)===!1)return!1;r.trigger(l+"go",o),e(".J-paginationjs-go-pagenumber",i).focus(),a.callHook("afterGoInputOnEnter",t,o)}}),r.on(l+"previous",function(e,t){a.previous(t)}),r.on(l+"next",function(e,t){a.next(t)}),r.on(l+"disable",function(){a.disable()}),r.on(l+"enable",function(){a.enable()}),r.on(l+"refresh",function(e,t){a.refresh(t)}),r.on(l+"show",function(){a.show()}),r.on(l+"hide",function(){a.hide()}),r.on(l+"destroy",function(){a.destroy()}),g.triggerPagingOnInit&&r.trigger(l+"go",Math.min(g.pageNumber,a.model.totalPage))}};if(r.data("pagination")&&r.data("pagination").initialized===!0){if(e.isNumeric(n))return r.trigger.call(this,l+"go",n,arguments[1]),this;if("string"==typeof n){var u=Array.prototype.slice.apply(arguments);switch(u[0]=l+u[0],n){case"previous":case"next":case"go":case"disable":case"enable":case"refresh":case"show":case"hide":case"destroy":r.trigger.apply(this,u);break;case"getSelectedPageNum":return r.data("pagination").model?r.data("pagination").model.pageNumber:r.data("pagination").attributes.pageNumber;case"getTotalPage":return r.data("pagination").model.totalPage;case"getSelectedPageData":return r.data("pagination").currentPageData;case"isDisabled":return r.data("pagination").model.disabled===!0;default:t("Pagination do not provide action: "+n)}return this}o(r)}else c.isObject(n)||t("Illegal options");var g=e.extend({},arguments.callee.defaults,n);return i(g),s.initialize(),this},e.fn[r].defaults={totalNumber:1,pageNumber:1,pageSize:10,pageRange:2,showPrevious:!0,showNext:!0,showPageNumbers:!0,showNavigator:!1,showGoInput:!1,showGoButton:!1,pageLink:"",prevText:"&laquo;",nextText:"&raquo;",ellipsisText:"...",goButtonText:"Go",classPrefix:"paginationjs",activeClassName:"active",disableClassName:"disabled",inlineStyle:!0,formatNavigator:"<%= currentPage %> / <%= totalPage %>",formatGoInput:"<%= input %>",formatGoButton:"<%= button %>",position:"bottom",autoHidePrevious:!1,autoHideNext:!1,triggerPagingOnInit:!0,hideWhenLessThanOnePage:!1,showFirstOnEllipsisShow:!0,showLastOnEllipsisShow:!0,callback:function(){}},e.fn[s]=function(a,i){arguments.length<2&&t("Missing argument."),e.isFunction(i)||t("callback must be a function.");var o=e(this),n=o.data("pagination");n||(o.data("pagination",{}),n=o.data("pagination")),!n.hooks&&(n.hooks={}),n.hooks[a]=n.hooks[a]||[],n.hooks[a].push(i)},e[r]=function(a,i){arguments.length<2&&t("Requires two parameters.");var o;return o="string"!=typeof a&&a instanceof jQuery?a:e(a),o.length?(o.pagination(i),o):void 0};var c={};e.each(["Object","Array"],function(a,e){c["is"+e]=function(a){return n(a)===e.toLowerCase()}}),"function"==typeof define&&define.amd&&define(function(){return e})}(this,window.jQuery);