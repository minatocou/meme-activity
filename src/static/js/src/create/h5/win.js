/**
 * Created by memebox on 16/11/4.
 */


var winTpl = $("#winTemplate").html(),
    $addwin;
$(".winfrom").datetimepicker()
$(".winto").datetimepicker({
    onShow : function(time , ct){
        var fromVal = $(ct).parents("tr").prev().find('.winfrom').val()
        this.setOptions({
            minDate:fromVal?fromVal:false
        })
    }
})


$(".addWin").on("click" , function(){
    $addwin = $(this);
    $("#winModal").modal()
})

$('#winModal').on('show.bs.modal', function (e) {
    var jsonStr = $addwin.attr("data-csv");
    var data = jsonStr ? JSON.parse(jsonStr) :{};

    var html = template('winTemplate' , {items : data} )
    $('#winModal .modal-body').html(html);
})

$('.save-win').on('click', function (e) {
    var arr =[];
    $(".win-model-table .targetTr").each(function(index , ele){
        var obj={};
        obj.name = $.trim($(ele).find(".win-name").val());
        obj.mobile = $.trim($(ele).find(".win-mobile").val());
        obj.gift = $.trim($(ele).find(".win-gift").val());
        arr.push(obj)
    })
    $addwin.attr("data-csv" ,JSON.stringify(arr) );
    if(arr.length){
        $addwin.parent().prev().html(constant.saved)
    }

    winEvent();
    $("#winModal").modal("hide")
})
$("body").on("click" , ".win-model-table .fa-plus" , function(){
    var html = '<tr class="targetTr">'+
               ' <td><input type="text" class="win-name"></td>'+
               ' <td><input type="text" class="win-mobile"></td>'+
               ' <td><input type="text" class="win-gift"></td>'+
               ' <td><i class="fa fa-close"></i></td>'+
               ' </tr>';
    $(".add-modal").before(html)
})

$("body").on("click" , ".win-model-table .fa-close" , function(){
    $(this).parents("tr").remove()
})