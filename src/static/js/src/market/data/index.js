/**
 * Created by Jesse on 17/2/8.
 */
(function () {
    var dateTimePickerInit = function (e) {
        laydate({
            elem: '#'+e+'_from_date',
            format: 'YYYY-MM-DD hh:mm:ss', // 分隔符可以任意定义，该例子表示只显示年月
            istime: true,
            istoday: true,
            choose: function (datas) {
                console.log(datas);
            }
        });
        var flag = !!$('#'+e+'_from_date').val();
        laydate({
            elem: '＃'+e+'_to_date',
            format: flag?'YYYY-MM-DD hh:mm:ss':'YYYY-MM-DD 23:59:59', // 分隔符可以任意定义，该例子表示只显示年月
            istime: true,
            istoday: true,
            choose: function () {
                console.log(arguments)
                flag?undefined:(this.format = 'YYYY-MM-DD hh:mm:ss');
            }
        });
    };
    dateTimePickerInit('rule');
    dateTimePickerInit('preference');
    dateTimePickerInit('promotion');
    var getNextElement = (function () {
        if('nextElementSibling' in HTMLHtmlElement.prototype){
            return function (curElement) {
                return curElement.nextElementSibling;
            }
        }else{
            return function (curElementSibling) {
                var e = curElementSibling.nextSibling;
                while(e&&e.nodeType!==1)
                    e = e.nextSibling;
                return e;
            }
        }
    })();
    function checkTime(name) {
        var from_date = $('#'+name+'_from_date').val().trim();
        var to_date = $('#'+name+'_to_date').val().trim();
        var obj = {
            start:from_date,
            end:to_date
        };
        console.log(moment(from_date).isBefore(to_date));
        if (from_date == '' || to_date == '') {
            obj.result = true;
        } else if (from_date == to_date) {
            obj.result = true;
        } else if (moment(to_date).isBefore(from_date)) {
            obj.result = false;
        } else {
            obj.result = true;
        }
        return obj;
    }
    $('.search').click(function () {
        var name = this.getAttribute('name');
        var searchId = document.getElementById(name+'_id');
        var parentDiv = this.parentElement,
            text = parentDiv.getElementsByTagName('p')[0];
        if(searchId.value.trim()===''){
            if(!text){
                var p = document.createElement('p');
                var textBox = {
                    rule:'优惠券ID',
                    preference:'直减ID',
                    promotion:'仓减ID',
                    order:'订单号'
                };
                p.style.color = 'red';
                p.style.marginBottom = 0;
                p.innerHTML = textBox[name]+'不能为空';
                parentDiv.appendChild(p);
            }
            return;
        }
        var obj = {};
        obj[name+'Id'] = searchId.value.trim();
        if(name!=='order'){
            var time = checkTime(name);
            if(time.result){
                obj.start = time.start;
                obj.end = time.end;
                time = null;
            }else{
                var p = document.createElement('p');
                p.style.color = 'red';
                p.style.marginBottom = 0;
                p.innerHTML = '结束时间要大于开始时间';
                parentDiv.appendChild(p);
                return;
            }
        }
        if(text){
            parentDiv.removeChild(text);
        }
        $.ajax({
            url:'/api/internal/sas/coupon/'+name,
            dataType:'json',
            data:obj,
            success:function (data) {
                var oTable = getNextElement(parentDiv),
                    tHead = oTable.tHead,
                    oThs = tHead.rows[0].cells,
                    tBody = oTable.tBodies[0];
                tBody.innerHTML = null;
                var oTr = document.createElement('tr');
                var ary = null,data = data.data;
                if(name!=='order'){
                     ary = [
                        name+'Id',
                        'commitCount',
                        'useCount'
                    ];
                }else{
                    ary = [
                        'orderId',
                        'preferenceIds',
                        'promotionId',
                        'couponId',
                        'couponCode'
                    ];
                    data = data[0];
                }
                if(name==="rule"){
                    ary.splice(1,0,"bindCount");
                }
                if(data){
                    for(var i = 0,len = oThs.length;i<len;i++){
                        var oTd = document.createElement('td');
                        oTd.innerHTML = data[ary[i]];
                        oTr.appendChild(oTd);
                    }
                }else{
                    oTr.innerHTML = '没有该订单号';
                }
                tBody.appendChild(oTr);
            },
            error:function(e){
                console.log(e);
        }
        });

    });
})();