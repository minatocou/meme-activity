!function(){function t(){var t=["activity_url","description","from_date","name","status","to_date","sku_list"],a={};t.map(function(t){a[t]=$("#"+t).val()}),a.user_name=$(".user-name").data("name"),$.ajax({url:CONFIG.dev.domain+"/supersale/update",data:a,dataType:"json",method:"POST",success:function(t){alert(t.msg),1==t.code&&location.reload()},error:function(t){console.log(t)}})}var a=new MarketDetail("/supersale/view"),e=getSearch("id");e&&HistoryLog.init(e,"supersale"),a.getDetail(),$("#marketSaveBtn").click(function(){return""==$("#name").val().trim()?(alert("名称不能为空"),!1):$("#name").val().length>50?(alert("名称不能大于50个字"),!1):""==$("#from_date").val()||""==$("#to_date").val()?(alert("请输入有效期"),!1):checkTime()?""!=$("#activity_url").val().trim()&&null==$("#activity_url").val().trim().match(/^http|^https:\/\//)?(alert("请输入正确的url"),!1):""==$("#sku_list").val().trim()?(alert("sku不能为空"),!1):void t():!1})}();