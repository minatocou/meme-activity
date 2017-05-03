/**
 * Created by memebox on 16/11/4.
 */



$('#countdownFrom').datetimepicker({
    onShow:function( ct ){
        this.setOptions({
            maxDate:$('#countdownTo').val()?$('#countdownTo').val():false
        })
    }
})
$('#countdownTo').datetimepicker({
    onShow:function( ct ){
        this.setOptions({
            minDate:$('#countdownFrom').val()?$('#countdownFrom').val():false
        })
    }
})