function checkLaspeDiscount(){var t,e=!0;return $("#discount .group").each(function(){var i=$(this).find("input");if(""!=i[0].value.trim()&&""!=i[1].value.trim()){if(t)return e=!1,!1;if($("#type").val()>4){var a=$(this).find(".change-sale input[type='radio']:checked").next().val().trim(),n=$(this).find(".qty").val().trim();if(8==$("#type").val()||9==$("#type").val());else if(""==a||""==n)return e=!1,!1}}else{if(""!=i[0].value.trim()||""!=i[1].value.trim())return e=!1,!1;if(t=!0,$("#type").val()>4){var a=$(this).find(".change-sale input[type='radio']:checked").next().val().trim(),n=$(this).find(".qty").val().trim();if(""!=a||""!=n)return e=!1,!1}}}),e?!0:(alert("设置优惠填写有误"),!1)}!function(){function t(){for(var t=["id","name","description","status","from_date","to_date","activity_url","weight","customer_group","type","warehouse"],e={},i=0;i<t.length;i++)e[t[i]]=$("#"+t[i]).val();e.category=JSON.stringify($("#category").val().split(/,|，/)),e.discount=function(){var t=[];return $("#discount .group").each(function(e){var i=$(this).find("input");if(""==i[0].value.trim()&&""==i[1].value.trim())return!1;if(t[e]=[i[0].value,i[1].value],$("#type").val()>4){var a;a=$("#type").val()<8?i[i.length-1].value.trim():i[1].value.trim(),t[e].push({type:$("#discount input[name='g"+e+"']:checked").val().trim(),list:function(){for(var t=$("#discount input[name='g"+e+"']:checked").next().val().trim().split(","),i=0,a=t.length;a>i;i++)t[i]=t[i].trim(),t[i]||t.splice(i,1),a=t.length;return t}(),qty:a||0})}}),t.sort(function(t,e){return t[0]-e[0]}),JSON.stringify(t)}(),e.compatible_coupon=function(){return 0!=$("#compatible_coupon input:checked").length?"1":"0"}(),getSearch("id")&&(e.id=getSearch("id")),e.user_name=$(".user-name").data("name"),console.log(e),$.ajax({url:CONFIG.dev.domain+"/preference/update",data:e,dataType:"json",type:"POST",success:function(t){alert(t.msg),"1"==t.code&&history.back()},error:function(t){console.log(t)}})}var e=new MarketDetail("/preference/view"),i=getSearch("id");i&&HistoryLog.init(i,"preference"),e.getDetail(),$("#marketSaveBtn").click(function(){return""==$("#name").val().trim()?(alert("名称不能为空"),!1):$("#name").val().length>50?(alert("名称不能大于50个字"),!1):""==$("#from_date").val()||""==$("#to_date").val()?(alert("请输入有效期"),!1):checkTime()?null==$("#activity_url").val().trim().match(/^http|^https:\/\//)?(alert("请输入正确的url"),!1):""==$("#weight").val().trim()?(alert("权重不能为空"),!1):$("#weight").val().trim()!=parseInt($("#weight").val().trim())||$("#weight").val().trim()<0?(alert("请输入大于0且是整数的权重"),!1):""==$("#discount .non-empty input")[0].value||""==$("#discount .non-empty input")[1].value?(alert("优惠设置不能为空"),!1):$("#discount .non-empty input")[0].value<0||$("#discount .non-empty input")[1].value<0?(alert("设置优惠填写有误"),!1):checkLaspeDiscount()?""==$("#category").val().trim()?(alert("category不能为空"),!1):void t():!1:!1}),$("#goBack").click(function(){location.href="/market/lapse"}),$("#detail").on("change",".changeType input[type='radio']",function(){$(this).parent().parent().find("input[type='text']").attr("readonly",!0),$(this).next().attr("readonly",!1)}),$("#detail").on("blur",".hall-gift .changeType input[type='text']",function(){getQty.call(this)})}();