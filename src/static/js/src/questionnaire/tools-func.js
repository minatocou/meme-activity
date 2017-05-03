function ArrRemoveItem(arr,item,key) {
    if(key){
        var itemIndex = '';
        var flag = arr.some(function (elem,i) {
            itemIndex = i;
            return elem[key] === item[key];
        });
        if(flag){
            arr.splice(itemIndex, 1);
        }
        return;
    }

    var index = arr.indexOf(item);
    if (index > -1) {
        arr.splice(index, 1);
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

//简单提示框
var fadeTime = 2700;
var tipsShow = (function (argument) {
	var tips = $('<div class="tipsShow"></div>');
	return function (text,modalDialog,dur){
		if(text.toString().trim() === '') {
			return;
		}
		tips.text(text).show().appendTo(modalDialog || document.querySelector('.data-container-wrap')).delay(dur || fadeTime).fadeOut( '300' ,function () {
			tips.remove();
		});
	}
}());

//初始化分页
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

function initDatePicker(elem) {
    var obj = {
        format: "yyyy-mm-dd hh:ii:ss",
        language: "zh-CN",
        autoclose: true
    };
    $.fn.datetimepicker &&  elem.datetimepicker(obj).on('changeDate', function(ev){
        var fromDate = $(ev.target).parent().find('[data-start]'),
            toDate = fromDate.siblings('[data-end]'),
            fromTime = +new Date(fromDate.val()),
            toTime = +new Date(toDate.val());
            if (toTime < fromTime) {
                setTimeout(function(){
                    toDate[0].value = fromDate.val();
                });
            }
            $(ev.target).is('[data-end]') && setTimeout(function(){
                var time = new Date(toDate.val());
                if(time.getMinutes() > 50){
                    time.setSeconds(59);
                    time.setMinutes(59);
                } else {
                    time.setSeconds('00');
                }
                (+time) > fromTime && toDate.val(dateFormat(time,"yyyy-MM-dd hh:mm:ss"));
            });
    });
}
