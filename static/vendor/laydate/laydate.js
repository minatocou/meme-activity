!function(e){var t={path:"",defSkin:"default",format:"YYYY-MM-DD",min:"1900-01-01 00:00:00",max:"2099-12-31 23:59:59",isv:!1},a={},n=document,s="createElement",i="getElementById",o="getElementsByTagName",l=["laydate_box","laydate_void","laydate_click","LayDateSkin","skins/","/laydate.css"];e.laydate=function(t){t=t||{};try{l.event=e.event?e.event:laydate.caller.arguments[0]}catch(n){}return a.run(t),laydate},laydate.v="1.1",a.getPath=function(){var e=document.scripts,a=e[e.length-1].src;return t.path?t.path:a.substring(0,a.lastIndexOf("/")+1)}(),a.use=function(e,t){var i=n[s]("link");i.type="text/css",i.rel="stylesheet",i.href=a.getPath+e+l[5],t&&(i.id=t),n[o]("head")[0].appendChild(i),i=null},a.trim=function(e){return e=e||"",e.replace(/^\s|\s$/g,"").replace(/\s+/g," ")},a.digit=function(e){return 10>e?"0"+(0|e):e},a.stopmp=function(t){return t=t||e.event,t.stopPropagation?t.stopPropagation():t.cancelBubble=!0,this},a.each=function(e,t){for(var a=0,n=e.length;n>a&&t(a,e[a])!==!1;a++);},a.hasClass=function(e,t){return e=e||{},new RegExp("\\b"+t+"\\b").test(e.className)},a.addClass=function(e,t){return e=e||{},a.hasClass(e,t)||(e.className+=" "+t),e.className=a.trim(e.className),this},a.removeClass=function(e,t){if(e=e||{},a.hasClass(e,t)){var n=new RegExp("\\b"+t+"\\b");e.className=e.className.replace(n,"")}return this},a.removeCssAttr=function(e,t){var a=e.style;a.removeProperty?a.removeProperty(t):a.removeAttribute(t)},a.shde=function(e,t){e.style.display=t?"none":"block"},a.query=function(e){var t,s,l,d,r;return e=a.trim(e).split(" "),s=n[i](e[0].substr(1)),s?e[1]?/^\./.test(e[1])?(d=e[1].substr(1),r=new RegExp("\\b"+d+"\\b"),t=[],l=n.getElementsByClassName?s.getElementsByClassName(d):s[o]("*"),a.each(l,function(e,a){r.test(a.className)&&t.push(a)}),t[0]?t:""):(t=s[o](e[1]),t[0]?s[o](e[1]):""):s:void 0},a.on=function(t,n,s){return t.attachEvent?t.attachEvent("on"+n,function(){s.call(t,e.even)}):t.addEventListener(n,s,!1),a},a.stopMosup=function(e,t){"mouseup"!==e&&a.on(t,"mouseup",function(e){a.stopmp(e)})},a.run=function(e){var t,n,s,i=a.query,o=l.event;try{s=o.target||o.srcElement||{}}catch(d){s={}}if(t=e.elem?i(e.elem):s,o&&s.tagName){if(!t||t===a.elem)return;a.stopMosup(o.type,t),a.stopmp(o),a.view(t,e),a.reshow()}else n=e.event||"click",a.each((0|t.length)>0?t:[t],function(t,s){a.stopMosup(n,s),a.on(s,n,function(t){a.stopmp(t),s!==a.elem&&(a.view(s,e),a.reshow())})})},a.scroll=function(e){return e=e?"scrollLeft":"scrollTop",n.body[e]|n.documentElement[e]},a.winarea=function(e){return document.documentElement[e?"clientWidth":"clientHeight"]},a.isleap=function(e){return 0===e%4&&0!==e%100||0===e%400},a.checkVoid=function(e,t,n){var s=[];return e=0|e,t=0|t,n=0|n,e<a.mins[0]?s=["y"]:e>a.maxs[0]?s=["y",1]:e>=a.mins[0]&&e<=a.maxs[0]&&(e==a.mins[0]&&(t<a.mins[1]?s=["m"]:t==a.mins[1]&&n<a.mins[2]&&(s=["d"])),e==a.maxs[0]&&(t>a.maxs[1]?s=["m",1]:t==a.maxs[1]&&n>a.maxs[2]&&(s=["d",1]))),s},a.timeVoid=function(e,t){if(a.ymd[1]+1==a.mins[1]&&a.ymd[2]==a.mins[2]){if(0===t&&e<a.mins[3])return 1;if(1===t&&e<a.mins[4])return 1;if(2===t&&e<a.mins[5])return 1}else if(a.ymd[1]+1==a.maxs[1]&&a.ymd[2]==a.maxs[2]){if(0===t&&e>a.maxs[3])return 1;if(1===t&&e>a.maxs[4])return 1;if(2===t&&e>a.maxs[5])return 1}return e>(t?59:23)?1:void 0},a.check=function(){var e=a.options.format.replace(/YYYY|MM|DD|hh|mm|ss/g,"\\d+\\").replace(/\\$/g,""),t=new RegExp(e),n=a.elem[l.elemv],s=n.match(/\d+/g)||[],i=a.checkVoid(s[0],s[1],s[2]);if(""!==n.replace(/\s/g,"")){if(!t.test(n))return a.elem[l.elemv]="",a.msg("日期不符合格式，请重新选择。"),1;if(i[0])return a.elem[l.elemv]="",a.msg("日期不在有效期内，请重新选择。"),1;i.value=a.elem[l.elemv].match(t).join(),s=i.value.match(/\d+/g),s[1]<1?(s[1]=1,i.auto=1):s[1]>12?(s[1]=12,i.auto=1):s[1].length<2&&(i.auto=1),s[2]<1?(s[2]=1,i.auto=1):s[2]>a.months[(0|s[1])-1]?(s[2]=31,i.auto=1):s[2].length<2&&(i.auto=1),s.length>3&&(a.timeVoid(s[3],0)&&(i.auto=1),a.timeVoid(s[4],1)&&(i.auto=1),a.timeVoid(s[5],2)&&(i.auto=1)),i.auto?a.creation([s[0],0|s[1],0|s[2]],1):i.value!==a.elem[l.elemv]&&(a.elem[l.elemv]=i.value)}},a.months=[31,null,31,30,31,30,31,31,30,31,30,31],a.viewDate=function(e,t,n){var s=(a.query,{}),i=new Date;e<(0|a.mins[0])&&(e=0|a.mins[0]),e>(0|a.maxs[0])&&(e=0|a.maxs[0]),i.setFullYear(e,t,n),s.ymd=[i.getFullYear(),i.getMonth(),i.getDate()],a.months[1]=a.isleap(s.ymd[0])?29:28,i.setFullYear(s.ymd[0],s.ymd[1],1),s.FDay=i.getDay(),s.PDay=a.months[0===t?11:t-1]-s.FDay+1,s.NDay=1,a.each(l.tds,function(e,t){var n,i=s.ymd[0],o=s.ymd[1]+1;t.className="",e<s.FDay?(t.innerHTML=n=e+s.PDay,a.addClass(t,"laydate_nothis"),1===o&&(i-=1),o=1===o?12:o-1):e>=s.FDay&&e<s.FDay+a.months[s.ymd[1]]?(t.innerHTML=n=e-s.FDay+1,e-s.FDay+1===s.ymd[2]&&(a.addClass(t,l[2]),s.thisDay=t)):(t.innerHTML=n=s.NDay++,a.addClass(t,"laydate_nothis"),12===o&&(i+=1),o=12===o?1:o+1),a.checkVoid(i,o,n)[0]&&a.addClass(t,l[1]),a.options.festival&&a.festival(t,o+"."+n),t.setAttribute("y",i),t.setAttribute("m",o),t.setAttribute("d",n),i=o=n=null}),a.valid=!a.hasClass(s.thisDay,l[1]),a.ymd=s.ymd,l.year.value=a.ymd[0]+"年",l.month.value=a.digit(a.ymd[1]+1)+"月",a.each(l.mms,function(e,t){var n=a.checkVoid(a.ymd[0],(0|t.getAttribute("m"))+1);"y"===n[0]||"m"===n[0]?a.addClass(t,l[1]):a.removeClass(t,l[1]),a.removeClass(t,l[2]),n=null}),a.addClass(l.mms[a.ymd[1]],l[2]),s.times=[0|a.inymd[3]||0,0|a.inymd[4]||0,0|a.inymd[5]||0],a.each(new Array(3),function(e){a.hmsin[e].value=a.digit(a.timeVoid(s.times[e],e)?0|a.mins[e+3]:0|s.times[e])}),a[a.valid?"removeClass":"addClass"](l.ok,l[1])},a.festival=function(e,t){var a;switch(t){case"1.1":a="元旦";break;case"3.8":a="妇女";break;case"4.5":a="清明";break;case"5.1":a="劳动";break;case"6.1":a="儿童";break;case"9.10":a="教师";break;case"10.1":a="国庆"}a&&(e.innerHTML=a),a=null},a.viewYears=function(e){var t=a.query,n="";a.each(new Array(14),function(t){n+=7===t?"<li "+(parseInt(l.year.value)===e?'class="'+l[2]+'"':"")+' y="'+e+'">'+e+"年</li>":'<li y="'+(e-7+t)+'">'+(e-7+t)+"年</li>"}),t("#laydate_ys").innerHTML=n,a.each(t("#laydate_ys li"),function(e,t){"y"===a.checkVoid(t.getAttribute("y"))[0]?a.addClass(t,l[1]):a.on(t,"click",function(e){a.stopmp(e).reshow(),a.viewDate(0|this.getAttribute("y"),a.ymd[1],a.ymd[2])})})},a.initDate=function(){var e=(a.query,new Date),t=a.elem[l.elemv].match(/\d+/g)||[];t.length<3&&(t=a.options.start.match(/\d+/g)||[],t.length<3&&(t=[e.getFullYear(),e.getMonth()+1,e.getDate()])),a.inymd=t,a.viewDate(t[0],t[1]-1,t[2])},a.iswrite=function(){var e=a.query,t={time:e("#laydate_hms")};a.shde(t.time,!a.options.istime),a.shde(l.oclear,!("isclear"in a.options?a.options.isclear:1)),a.shde(l.otoday,!("istoday"in a.options?a.options.istoday:1)),a.shde(l.ok,!("issure"in a.options?a.options.issure:1))},a.orien=function(e,t){var n,s=a.elem.getBoundingClientRect();e.style.left=s.left+(t?0:a.scroll(1))+"px",n=s.bottom+e.offsetHeight/1.5<=a.winarea()?s.bottom-1:s.top>e.offsetHeight/1.5?s.top-e.offsetHeight+1:a.winarea()-e.offsetHeight,e.style.top=n+(t?0:a.scroll())+"px"},a.follow=function(e){a.options.fixed?(e.style.position="fixed",a.orien(e,1)):(e.style.position="absolute",a.orien(e))},a.viewtb=function(){var e,t=[],i=["日","一","二","三","四","五","六"],l={},d=n[s]("table"),r=n[s]("thead");return r.appendChild(n[s]("tr")),l.creath=function(e){var t=n[s]("th");t.innerHTML=i[e],r[o]("tr")[0].appendChild(t),t=null},a.each(new Array(6),function(n){t.push([]),e=d.insertRow(0),a.each(new Array(7),function(a){t[n][a]=0,0===n&&l.creath(a),e.insertCell(a)})}),d.insertBefore(r,d.children[0]),d.id=d.className="laydate_table",e=t=null,d.outerHTML.toLowerCase()}(),a.view=function(e,i){var o,d=a.query,r={};i=i||e,a.elem=e,a.options=i,a.options.format||(a.options.format=t.format),a.options.start=a.options.start||"",a.mm=r.mm=[a.options.min||t.min,a.options.max||t.max],a.mins=r.mm[0].match(/\d+/g),a.maxs=r.mm[1].match(/\d+/g),l.elemv=/textarea|input/.test(a.elem.tagName.toLocaleLowerCase())?"value":"innerHTML",a.box?a.shde(a.box):(o=n[s]("div"),o.id=l[0],o.className=l[0],o.style.cssText="position: absolute;",o.setAttribute("name","laydate-v"+laydate.v),o.innerHTML=r.html='<div class="laydate_top"><div class="laydate_ym laydate_y" id="laydate_YY"><a class="laydate_choose laydate_chprev laydate_tab"><cite></cite></a><input id="laydate_y" readonly><label></label><a class="laydate_choose laydate_chnext laydate_tab"><cite></cite></a><div class="laydate_yms"><a class="laydate_tab laydate_chtop"><cite></cite></a><ul id="laydate_ys"></ul><a class="laydate_tab laydate_chdown"><cite></cite></a></div></div><div class="laydate_ym laydate_m" id="laydate_MM"><a class="laydate_choose laydate_chprev laydate_tab"><cite></cite></a><input id="laydate_m" readonly><label></label><a class="laydate_choose laydate_chnext laydate_tab"><cite></cite></a><div class="laydate_yms" id="laydate_ms">'+function(){var e="";return a.each(new Array(12),function(t){e+='<span m="'+t+'">'+a.digit(t+1)+"月</span>"}),e}()+"</div></div></div>"+a.viewtb+'<div class="laydate_bottom"><ul id="laydate_hms"><li class="laydate_sj">时间</li><li><input readonly>:</li><li><input readonly>:</li><li><input readonly></li></ul><div class="laydate_time" id="laydate_time"></div><div class="laydate_btn"><a id="laydate_clear">清空</a><a id="laydate_today">今天</a><a id="laydate_ok">确认</a></div>'+(t.isv?'<a href="http://sentsin.com/layui/laydate/" class="laydate_v" target="_blank">laydate-v'+laydate.v+"</a>":"")+"</div>",n.body.appendChild(o),a.box=d("#"+l[0]),a.events(),o=null),a.follow(a.box),i.zIndex?a.box.style.zIndex=i.zIndex:a.removeCssAttr(a.box,"z-index"),a.stopMosup("click",a.box),a.initDate(),a.iswrite(),a.check()},a.reshow=function(){return a.each(a.query("#"+l[0]+" .laydate_show"),function(e,t){a.removeClass(t,"laydate_show")}),this},a.close=function(){a.reshow(),a.shde(a.query("#"+l[0]),1),a.elem=null},a.parse=function(e,n,s){return e=e.concat(n),s=s||(a.options?a.options.format:t.format),s.replace(/YYYY|MM|DD|hh|mm|ss/g,function(){return e.index=0|++e.index,a.digit(e[e.index])})},a.creation=function(e,t){var n=(a.query,a.hmsin),s=a.parse(e,[n[0].value,n[1].value,n[2].value]);a.elem[l.elemv]=s,t||(a.close(),"function"==typeof a.options.choose&&a.options.choose(s))},a.events=function(){var t=a.query,s={box:"#"+l[0]};a.addClass(n.body,"laydate_body"),l.tds=t("#laydate_table td"),l.mms=t("#laydate_ms span"),l.year=t("#laydate_y"),l.month=t("#laydate_m"),a.each(t(s.box+" .laydate_ym"),function(e,t){a.on(t,"click",function(t){a.stopmp(t).reshow(),a.addClass(this[o]("div")[0],"laydate_show"),e||(s.YY=parseInt(l.year.value),a.viewYears(s.YY))})}),a.on(t(s.box),"click",function(){a.reshow()}),s.tabYear=function(e){0===e?a.ymd[0]--:1===e?a.ymd[0]++:2===e?s.YY-=14:s.YY+=14,2>e?(a.viewDate(a.ymd[0],a.ymd[1],a.ymd[2]),a.reshow()):a.viewYears(s.YY)},a.each(t("#laydate_YY .laydate_tab"),function(e,t){a.on(t,"click",function(t){a.stopmp(t),s.tabYear(e)})}),s.tabMonth=function(e){e?(a.ymd[1]++,12===a.ymd[1]&&(a.ymd[0]++,a.ymd[1]=0)):(a.ymd[1]--,-1===a.ymd[1]&&(a.ymd[0]--,a.ymd[1]=11)),a.viewDate(a.ymd[0],a.ymd[1],a.ymd[2])},a.each(t("#laydate_MM .laydate_tab"),function(e,t){a.on(t,"click",function(t){a.stopmp(t).reshow(),s.tabMonth(e)})}),a.each(t("#laydate_ms span"),function(e,t){a.on(t,"click",function(e){a.stopmp(e).reshow(),a.hasClass(this,l[1])||a.viewDate(a.ymd[0],0|this.getAttribute("m"),a.ymd[2])})}),a.each(t("#laydate_table td"),function(e,t){a.on(t,"click",function(e){a.hasClass(this,l[1])||(a.stopmp(e),a.creation([0|this.getAttribute("y"),0|this.getAttribute("m"),0|this.getAttribute("d")]))})}),l.oclear=t("#laydate_clear"),a.on(l.oclear,"click",function(){a.elem[l.elemv]="",a.close()}),l.otoday=t("#laydate_today"),a.on(l.otoday,"click",function(){a.elem[l.elemv]=laydate.now(0,a.options.format),a.creation([a.ymd[0],a.ymd[1]+1,a.ymd[2]]),a.close()}),l.ok=t("#laydate_ok"),a.on(l.ok,"click",function(){a.valid&&a.creation([a.ymd[0],a.ymd[1]+1,a.ymd[2]])}),s.times=t("#laydate_time"),a.hmsin=s.hmsin=t("#laydate_hms input"),s.hmss=["小时","分钟","秒数"],s.hmsarr=[],a.msg=function(e,n){var i='<div class="laydte_hsmtex">'+(n||"提示")+"<span>×</span></div>";"string"==typeof e?(i+="<p>"+e+"</p>",a.shde(t("#"+l[0])),a.removeClass(s.times,"laydate_time1").addClass(s.times,"laydate_msg")):(s.hmsarr[e]?i=s.hmsarr[e]:(i+='<div id="laydate_hmsno" class="laydate_hmsno">',a.each(new Array(0===e?24:60),function(e){i+="<span>"+e+"</span>"}),i+="</div>",s.hmsarr[e]=i),a.removeClass(s.times,"laydate_msg"),a[0===e?"removeClass":"addClass"](s.times,"laydate_time1")),a.addClass(s.times,"laydate_show"),s.times.innerHTML=i},s.hmson=function(e,n){var s=t("#laydate_hmsno span"),i=a.valid?null:1;a.each(s,function(t,s){i?a.addClass(s,l[1]):a.timeVoid(t,n)?a.addClass(s,l[1]):a.on(s,"click",function(){a.hasClass(this,l[1])||(e.value=a.digit(0|this.innerHTML))})}),a.addClass(s[0|e.value],"laydate_click")},a.each(s.hmsin,function(e,t){a.on(t,"click",function(t){a.stopmp(t).reshow(),a.msg(e,s.hmss[e]),s.hmson(this,e)})}),a.on(n,"mouseup",function(){var e=t("#"+l[0]);e&&"none"!==e.style.display&&(a.check()||a.close())}).on(n,"keydown",function(t){t=t||e.event;var n=t.keyCode;13===n&&a.creation([a.ymd[0],a.ymd[1]+1,a.ymd[2]])})},a.init=void 0,laydate.reset=function(){a.box&&a.elem&&a.follow(a.box)},laydate.now=function(e,t){var n=new Date(0|e?function(e){return 864e5>e?+new Date+864e5*e:e}(parseInt(e)):+new Date);return a.parse([n.getFullYear(),n.getMonth()+1,n.getDate()],[n.getHours(),n.getMinutes(),n.getSeconds()],t)},laydate.skin=function(){}}(window);