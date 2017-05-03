/**
 * Created by memebox on 16/11/16.
 */
$('[name=catFrom]').datetimepicker()
$('[name=groupImgFromTime]').datetimepicker()
$('[name=groupImgToTime]').datetimepicker({
    onShow:function( ct ){
        this.setOptions({
            minDate:$('[name=groupImgFromTime]').val()?$('[name=groupImgFromTime]').val():false
        })
    }
})

$('[name=catTo]').datetimepicker({
    onShow:function( ct ){
        this.setOptions({
            minDate:$('[name=catFrom]').val()?$('[name=catFrom]').val():false
        })
    }
})