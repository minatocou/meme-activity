$(document).ready(function(){function t(t){var e=new RegExp("(^|&)"+t+"=([^&]*)(&|$)","i"),a=decodeURIComponent(window.location.search).substr(1).match(e);return null!=a?a[2]:null}var e=i18n[$(".header-container").data("localize")],a=function(){var t={title:document.getElementById("title"),urlKey:document.getElementById("url_key"),state:document.getElementById("state"),lastOne:document.getElementById("lastOne")},e=localStorage.searchText&&JSON.parse(localStorage.searchText);if(e)for(var a in t)t[a].value=e[a];return t}();$("#search-btn").click(function(){var t={};for(var e in a)t[e]=a[e].value;localStorage.searchText=JSON.stringify(t)}),$(".states-btn").click(function(){var t=this,a=t.getAttribute("data-state"),i=t.getAttribute("data-key"),n={id:t.getAttribute("data-id"),state:a,urlkey:i};$.ajax({type:"GET",url:"/api/h5/list/changeState",data:n,success:function(){"0"==t.getAttribute("data-state")?(t.innerHTML='<i class="fa fa-check"></i>'+e.active,$(t).parents("tr").find(".states")[0].innerHTML='<i class="fa fa-lock"></i>'+e.inactive,t.setAttribute("data-state","1")):(t.innerHTML='<i class="fa fa-power-off"></i>'+e.inactive,$(t).parents("tr").find(".states")[0].innerHTML='<i class="fa fa-unlock"></i>'+e.active,t.setAttribute("data-state","0"))}})}),function(){var t;$(".delete-btn").click(function(){$(".mask").show(),t=this}),$(".close-btn").click(function(){$(".mask").hide()}),$(".sure-btn").click(function(){var e=t.getAttribute("data-id");$(".mask").hide(),$.ajax({type:"GET",url:"/api/h5/list/remove?id="+e,success:function(){$(t).parents("tr").remove()}})})}(),$(".preview-btn").on("click",function(){var t;t=$("body").data("preview")+this.getAttribute("data-url"),$("#qrCode").qrcode({width:64,height:64,text:t}),$(".qr .link p").html(t),$(".preview-wrapper .preview").html('<iframe src="'+t+'?preview=1" frameborder="0"></iframe>'),$(".preview-wrapper").show()}),$(".preview-wrapper .close").on("click",function(){$(".preview-wrapper .preview").html(""),$("#qrCode").html(""),$(".qr .link p").html(""),$(".preview-wrapper").hide()});var i=$("#pagesObj").html().split(",");0!=i[2].trim()&&$("#pagination-container").pagination({dataSource:new Array(parseInt(i[2].trim())),pageSize:i[1].trim(),showGoInput:!0,showGoButton:!0,pageNumber:t("pageIndex")||1,afterPageOnClick:function(t,e){location.href="?pageIndex="+e.trim()},afterPreviousOnClick:function(t,e){location.href="?pageIndex="+e.trim()},afterNextOnClick:function(t,e){location.href="?pageIndex="+e.trim()},afterGoButtonOnClick:function(t,e){var a=e.trim();""!=a&&(location.href="?pageIndex="+a)},callback:function(){}})});