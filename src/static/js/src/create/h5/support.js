/**
 * Created by Jesse on 16/12/15.
 */
$('#supportFrom').datetimepicker({
    onShow:function( ct ){
        this.setOptions({
            maxDate:$('#supportTo').val()?$('#supportTo').val():false
        })
    }
})
$('#supportTo').datetimepicker({
    onShow:function( ct ){
        this.setOptions({
            minDate:$('#supportFrom').val()?$('#supportFrom').val():false
        })
    }
})