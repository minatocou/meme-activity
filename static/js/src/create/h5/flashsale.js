var flashsaleTpl=$("#flashsaleTemplate").html(),flashsaleTrTpl=$("#flashsaleTrTemplate").html();$(".addflash").click(function(){$(".flashsale-attr .flashsale-table-content").append(flashsaleTpl);var a=$(".flashsale-attr .flashsale-table-content .table").last(),e=a.prev().find("[data-flashdatepicker]").val(),t=a.find("[data-flashdatepicker]").datetimepicker({format:"Y/m/d",onShow:function(){this.setOptions({minDate:e?e:!1})},timepicker:!1});t.off("mousewheel.xdsoft"),a.find("[data-flashtimepicker]").datetimepicker({datepicker:!1,lang:"ch",format:"H:i"}),a.find(".flash-tab").html("tab"+$(".flashsale-attr .flashsale-table-content .table").length)}),$(".flashsale-attr").on("click","i.fa-plus",function(){$(this).parents("tr").before(flashsaleTrTpl);var a=$(this).parents("tr").prev().find("[data-flashtimepicker]");a.datetimepicker({datepicker:!1,lang:"ch",format:"H:i"})}),$("#fromdatetimepicker").datetimepicker({onShow:function(){this.setOptions({maxDate:$("#todatetimepicker").val()?$("#todatetimepicker").val():!1})}}),$("#todatetimepicker").datetimepicker({onShow:function(){this.setOptions({minDate:$("#fromdatetimepicker").val()?$("#fromdatetimepicker").val():!1})}}),$(".flashsale-attr").on("click",".fa-close",function(){$(this).hasClass("remove-table")?$(this).parents(".table").remove():$(this).parents(".cattime").remove(),flashsaleEvent()});