/**
 * Created by memebox on 16/11/4.
 */
var resetForm = function (data) {
    var curEL = $(CANVAS_PANEL).find('.cur');
    var defaultSet = JSON.parse(curEL.attr(SETTING));
    data = _.extend(defaultSet, data);
    curEL.attr(SETTING, JSON.stringify(data));
    var event = {
        'l1': l1Event,
        'img': imgEvent,
        'purchase': purchaseEvent,
        'countdown': countdownEvent,
        'video': videoEvent,
        'anchor': anchorEvent,
        'flashsale': flashsaleEvent,
        'benefits': benefitsEvent,
        'win': winEvent,
        "presale": presaleEvent,
        "groupon": grouponEvent,
        "comment": commentEvent,
        'support': supportEvent,
        "live": liveEvent,
        "topnav": topnavEvent,
        "seckill":seckillEvent,
        "newcomercoupon":newcomercouponEvent,
    };
    event[data.type] && event[data.type](data);
}


$(TEMPLATE_PANEL).sortable({
    group: {
        name: 'template',
        pull: 'clone'
    },
    sort: true,
    fallbackOnBody: true
})

$(IMG_PANEL).sortable({
    group: {
        name: 'img',
        pull: 'clone'
    },
    fallbackOnBody: true
})

$(CANVAS_PANEL).sortable({
    group: {
        name: "canvas",
        put: ['template', 'img'],
        draggable: '[data-field]'
    },
    sort: true,
    onUpdate: function () {

        console.log(123)
    },
    onAdd: function (evt) {

        var itemEL = $(evt.item);
        var type = $(evt.item).attr('data-field');
        var setting = {
            id: uuid(),
            type: itemEL.attr('data-field')
        }
        console.log(type);
        //特殊设置项
        if (itemEL.attr('chosenimg')) {
            setting.imgSrc = itemEL.attr('chosenimg');
        }
        if (DEFAULT_SETTING[type]) {
            setting = _.extend(setting, DEFAULT_SETTING[type]);
        }
        $(evt.item).attr('id', setting.id).attr(SETTING, JSON.stringify(setting))
    }
})
$(CANVAS_PANEL).on('click', '[data-field]', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var $this = $(this);
    $this.addClass('cur').siblings('.cur').removeClass('cur');
    var f = $this.attr('data-field');
    var setForm = '.'+f+'-attr';
    $(setForm).show().siblings(attrClass).hide();

    var s = JSON.parse($this.attr(SETTING));
    $(setForm).find("input:not([type=checkbox])").val("");
    console.log($(setForm).find("input[name$='imgSrc']").length)
    $(setForm).find("input[name$='imgSrc']").each(function () {
        $(this).val($this.attr('chosenimg'));
    })

    for (var k in s) {
        if (s[k]) {
            if (k == "imgRadios") {
                var radioTarget = $(setForm).find("#imgRadios" + s[k])
                radioTarget.prop("checked", true);
                radioTarget.val(radioTarget.data("value"));
            } else {
                $(setForm).find('[name=' + k + ']').val(s[k]);
            }
            if(k=='isLogin' && s[k]==1){
                $('.loginMsg').show();
                $(setForm).find('[name=' + k + ']').prop('checked',true);
            }
        } else if (k == "imgRadios") {
            $(setForm).find("#imgRadios").prop("checked", true);
        }

    }
    if (s['type'] == "flashsale") {
        var html = template('flashsaleTable', s);
        $(".flashsale-table-content").html(html);
        var $table = $('.flashsale-attr .flashsale-table-content .table');
        $table.each(function (index, ele) {
            var datepicker = $(ele).find('[data-flashdatepicker]').datetimepicker({
                timepicker: false,
                lang: 'ch',
                format: 'Y/m/d'
            });
            //禁止滑动
            datepicker.off('mousewheel.xdsoft');

            $(ele).find('[data-flashtimepicker]').datetimepicker({datepicker: false, lang: 'ch', format: 'H:i'})
            $(ele).find('.flash-tab').html('tab' + (index + 1))
        })
    }
    if (s["type"] === "topnav") {
        var topNavHtml = template("topNavTab", s);
        $(".topnav-body").html(topNavHtml);
    }
    if (s["type"] === "newcomercoupon") {
        var couponHtml = template("newcomercouponTemplate", s);
        $(".newcomercoupon-body").html(couponHtml);
    }
    if (s['type'] == 'win') {
        var winInfo = s.winInfo;
        if (winInfo) {
            for (var i = 0; i < winInfo.length; i++) {
                var targetWin = $(".win-table:eq(" + i + ")")
                targetWin.find(".winfrom").val(winInfo[i].from)
                targetWin.find(".winto").val(winInfo[i].to)
                targetWin.find("[data-csv]").attr("data-csv", JSON.stringify(winInfo[i].csv))
                if (winInfo[i].csv.length) {
                    targetWin.find(".csv-name").html(constant.saved)
                }

            }
        } else {
            $(".csv-name").html("NA")
        }


    }
})

$(attrClass).on('change', 'input,select', function (e) {
    var target = $(e.currentTarget);
    if ($(e.currentTarget).is("[type=radio]")) {
        target.val(target.data('value'))
    }
    var data = target.closest('form').serializeObject();
    resetForm(data);
})
$(CANVAS_PANEL).on('click', '.close-btn', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(attrClass).hide();
    $(this).closest('li').remove();
})
$(CANVAS_PANEL).on('click', '.close-link-btn', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).closest('.link').remove();
})
$(CANVAS_PANEL).on('click', '.close-video-btn', function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).closest('.addVideo-cont').remove();
})