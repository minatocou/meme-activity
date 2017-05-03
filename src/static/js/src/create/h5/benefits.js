/**
 * Created by memebox on 16/11/4.
 */

$('#benefitsFromDate').datetimepicker({
    onShow:function( ct ){
        this.setOptions({
            maxDate:$('#benefitsToDate').val()?$('#benefitsToDate').val():false
        })
    }
})
$('#benefitsToDate').datetimepicker({
    onShow:function( ct ){
        this.setOptions({
            minDate:$('#benefitsFromDate').val()?$('#benefitsFromDate').val():false
        })
    }
})
