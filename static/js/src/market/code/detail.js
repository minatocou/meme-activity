!function(){function e(){$('.private-code input[type="text"]').val(null),$('.public-code input[type="text"]').val(null),$(".public-code").toggle(),$(".private-code").toggle()}function t(){for(var e=["customer_use_limit","description","discount","discount_type","from_date","is_public","name","rule","status","to_date","total","total_use_limit","warehouse"],t={},i=0;i<e.length;i++)""!=$("#"+e[i]).val()&&(t[e[i]]=$("#"+e[i]).val());t.prefix="1"==t.is_public?$("#publicPrefix").val():$("#privatePrefix").val(),t.platform=7,t.category=JSON.stringify($("#category").val().split(/,|，/)),t.user_name=$(".user-name").data("name"),getSearch("id")&&(t.id=getSearch("id"));var l=dialog({title:"提示",content:"保存后优惠码信息不可更改，是否确认保存？",okValue:"确定",ok:function(){$.ajax({url:CONFIG.dev.domain+"/code/update",data:t,dataType:"json",type:"POST",success:function(e){"1"!=e.code||!e.data.id||"0"!=a.is_generated&&getSearch("id")?"1"==e.code?(alert(e.msg),history.back()):"0"==e.code&&alert(e.msg):$.ajax({url:CONFIG.dev.domain+"/code/generate",data:{id:e.data.id},dataType:"json",type:"POST",success:function(e){alert(e.msg),$("#is_public").attr("disabled",!0),"1"==e.code&&history.back()},error:function(e){console.log(e)}})},error:function(e){console.log(e)}})},cancelValue:"取消",cancel:function(){}});l.show()}var a=new MarketDetail("/code/view"),i=getSearch("id");i&&HistoryLog.init(i,"code"),a.getDetail(),$("#marketSaveBtn").click(function(){if(""==$("#name").val().trim())return alert("名称不能为空"),!1;if($("#name").val().length>50)return alert("名称不能大于50个字"),!1;if("0"==$("#is_public").val()){if(""==$("#total").val())return alert("请输入总张数"),!1;if($("#total").val()!=parseInt($("#total").val()))return alert("总张数输入有误"),!1;if(""==$("#privatePrefix").val().trim())return alert("请输入前缀"),!1;if($("#privatePrefix").val().trim().length>10)return alert("前缀只能输入10位字符"),!1;if(8==$("#privatePrefix").val().trim().slice(-8).length&&$("#publicPrefix").val().trim().slice(-8)==parseInt($("#privatePrefix").val().trim().slice(-8)))return alert("前缀最后8位不能全是数字"),!1}else{if(""==$("#publicPrefix").val().trim())return alert("请输入公码"),!1;if($("#publicPrefix").val().trim().length>10)return alert("公码只能输入10位字符"),!1;if(8==$("#publicPrefix").val().trim().slice(-8).length&&$("#publicPrefix").val().trim().slice(-8)==parseInt($("#publicPrefix").val().trim().slice(-8)))return alert("公码最后8位不能全是数字"),!1}return""==$("#from_date").val()||""==$("#to_date").val()?(alert("请输入有效期"),!1):checkTime()?""==$("#total_use_limit").val()?(alert("请输入总可用次数"),!1):$("#total_use_limit").val()<0||$("#total_use_limit").val()!=parseInt($("#total_use_limit").val())?(alert("总可用次数输入有误"),!1):""==$("#customer_use_limit").val()?(alert("请输入可用次数"),!1):$("#customer_use_limit").val()<0||$("#customer_use_limit").val()!=parseInt($("#customer_use_limit").val())?(alert("可用次数输入有误"),!1):""==$("#rule").val()||""==$("#discount").val()?(alert("请输入设置优惠"),!1):$("#rule").val()<0||$("#discount").val()<0?(alert("设置优惠输入有误"),!1):""===$("#category").val().trim()?(alert("请输入category"),!1):void t():!1}),$("#detail").on("change","#is_public",function(){e(),console.log(99)}),$("#goBack").click(function(){location.href="/market/code"})}();