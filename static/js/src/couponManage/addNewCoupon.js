function getSubmitData(){var e=this.customers.split(","),t={};return e.forEach(function(e,i){t[i]=e}),this.customers=JSON.stringify(t),this}$(document).on("submit",".addNewCouponForm",function(){var e=$(this);return confirm(localeI18n.beforeSendCouponTip)&&ajaxReq({url:e.attr("action"),type:"post",data:getSubmitData.call(e.serializeObject())}).then(function(e){alert(e.msg),history.back()}),!1}),$(document).on("click","[data-form-btn]",function(){$(this.getAttribute("data-form-btn")).submit()}),$(".need-validate-form").validate();var importFile={data:{file:null},ele:{importUserIdBtn:document.getElementById("importUserIdBtn"),uploadExcelFile:document.getElementById("uploadExcelFile"),showFileName:document.getElementById("showFileName")},event:{change:function(e,t){var i=t.files[0],n=/\.sheet/;""!==this.ele.uploadExcelFile.value&&(this.ele.showFileName.innerText=this.ele.uploadExcelFile.value,i&&n.test(i.type)?(this.ele.importUserIdBtn.style.display="block",this.data.file=i):(this.ele.importUserIdBtn.style.display="none",alert("请上传excel文件")))},click:function(){var e=this,t=new FormData;t.append("file",e.data.file),$.ajax({url:"/api/coupon/userid",type:"post",data:t,processData:!1,contentType:!1,success:function(e){1===e.code?document.getElementById("userIdBox").value=e.data:alert(e.msg)},error:function(e){alert(e)}})}},init:function(){var e=this;document.getElementById("uploadExcelFile").onchange=function(t){e.event.change.call(e,t,this)},this.ele.importUserIdBtn.onclick=function(t){e.event.click.call(e,t)}}};importFile.init();