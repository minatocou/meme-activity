/**
 * Created by memebox on 16/11/4.
 */

var flashsaleTpl = $("#flashsaleTemplate").html(),
    flashsaleTrTpl = $("#flashsaleTrTemplate").html();

$('.addflash').click(function(){
    $('.flashsale-attr .flashsale-table-content').append(flashsaleTpl);
    var $table = $('.flashsale-attr .flashsale-table-content .table').last()
    var prevPickerValue = $table.prev().find('[data-flashdatepicker]').val()
    var datepicker = $table.find('[data-flashdatepicker]').datetimepicker({
        format:'Y/m/d',
        onShow:function( ct ){
            this.setOptions({
                minDate:prevPickerValue?prevPickerValue:false
            })
        },
        timepicker:false
    })
    datepicker.off('mousewheel.xdsoft');
    $table.find('[data-flashtimepicker]').datetimepicker({datepicker:false,lang:'ch',format:'H:i'})
    $table.find('.flash-tab').html('tab' + $('.flashsale-attr .flashsale-table-content .table').length)
})

$('.flashsale-attr').on('click' , 'i.fa-plus' , function(){
    $(this).parents("tr").before(flashsaleTrTpl);
    var $td = $(this).parents("tr").prev().find( '[data-flashtimepicker]');
    $td.datetimepicker({datepicker:false,lang:'ch',format:'H:i'});

})
$('#fromdatetimepicker').datetimepicker({
    onShow:function( ct ){
        this.setOptions({
            maxDate:$('#todatetimepicker').val()?$('#todatetimepicker').val():false
        })
    }
})
$('#todatetimepicker').datetimepicker({
    onShow:function( ct ){
        this.setOptions({
            minDate:$('#fromdatetimepicker').val()?$('#fromdatetimepicker').val():false
        })
    }
})


$(".flashsale-attr").on('click' , ".fa-close" , function(){
    if( $(this).hasClass("remove-table") ){
        $(this).parents(".table").remove()
    }else{
        $(this).parents(".cattime").remove()
    }
    flashsaleEvent()
})