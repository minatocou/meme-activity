/**
 * Created by memebox on 16/11/4.
 */
$('.addVideo-cont').each(function (i, item) {
    $(this).resizable({
        containment: $(this).closest('li')
    }).draggable({
        containment: $(this).closest('li')
    });
})

$('#addVideo').click(function () {
    var curEL = $(CANVAS_PANEL).find('.cur');
    if(curEL.find('.addVideo-cont').length){
        alert(constant.video_one);
        return false;
    }
    if( !$.trim($('#videoUrl').val()) || !$.trim($('#videoBackground').val())){
        alert(constant.video_bk);
        return false;
    }
    var link = $('<div class="addVideo-cont"><span class="video-url">' + $('#videoUrl').val() + '</span><i class="close-video-btn">×</i></div>').appendTo(curEL);
    link.resizable({
        containment: curEL
    }).draggable({
        containment: curEL
    });
});