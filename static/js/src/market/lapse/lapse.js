!function(){var t=new MarketList("/preference/list");t.getList(),$("#search").click(function(){var e={};checkTime()&&($("#id").val().trim()&&(e.id=$("#id").val().trim()),$("#name").val().trim()&&(e.name=$("#name").val().trim()),"0"==$("input[name=selectTime]:checked").val()?($("#from_date").val().trim()&&(e.from_date_start=$("#from_date").val().trim()),$("#from_date").val().trim()&&(e.from_date_end=$("#to_date").val().trim())):($("#from_date").val().trim()&&(e.to_date_start=$("#from_date").val().trim()),$("#from_date").val().trim()&&(e.to_date_end=$("#to_date").val().trim())),""!=$("#type").val()&&(e.type=$("#type").val()),""!=$("#status").val()&&(e.status=$("#status").val()),t.getList(e))}),MarketDelete("/preference/delete"),dateTimePickerInit(!0),changeStatus("/preference/update")}();