/**
 * Created by memebox on 16/11/4.
 */
$('.link').each(function (i, item) {
    $(this).resizable({
        containment: $(this).closest('li')
    }).draggable({
        containment: $(this).closest('li')
    });
})
$('[name=imgFromTime]').datetimepicker()
$('[name=imgToTime]').datetimepicker({
    onShow: function (ct) {
        this.setOptions({
            minDate: $('[name=imgFromTime]').val() ? $('[name=imgFromTime]').val() : false
        })
    }
})

$('#addLink').click(function () {
    var curEL = $(CANVAS_PANEL).find('.cur');
    var link = $('<div class="link"><span class="link-url">' + $('#linkUrl').val() + '</span><i class="close-link-btn">×</i></div>').appendTo(curEL);
    link.resizable({
        containment: curEL
    }).draggable({
        containment: curEL
    });
});
/**
 * 增加弹窗   000
 */
$('#addPop').click(function () {
    var curEL = $(CANVAS_PANEL).find('.cur');
    if ($('#popupImgUrl').val().trim() === "") {
        alert("弹窗图片url不能为空");
    } else if ($('#popupAnchor').val().trim() === "") {
        alert("点击图片跳转页面的url或锚点不能为空");
    } else {
        var ary = ["url","锚点"], link = $('<div class="link link-popup"><p>图片：<span class="pop-img-url">' + $('#popupImgUrl').val() + "</span></p><p>"+"<span class='link-type'>"+ary[$("[name='popType']:checked").data('value')]+"</span>：<span class='link-url'>" + $('#popupAnchor').val() + '</span></p><i class="close-link-btn">×</i></div>').appendTo(curEL);
        // var link = $('<div class="link link-popup"><span class="link-url">' + $('#popupUrl').val() + '</span><i class="close-link-btn">×</i></div>').appendTo(curEL);
        link.resizable({
            containment: curEL
        }).draggable({
            containment: curEL
        });
    }
});

$(".img-wrapper").on('click', 'li img', function () {
    $(this).addClass('chosen');
    var chosenImg = $(this).attr('src');
    var curEL = $(CANVAS_PANEL).find('.cur');
    if (curEL.length > 0) {
        curEL.attr('chosenimg', chosenImg);
        var form = $('form:visible');
        form.find('[form-img]').val(chosenImg);
        var data = form.serializeObject();
        resetForm(data);
    }
})