function deleImg(e){$.ajax({url:"/api/picture/del",type:"post",dataType:"json",data:{id:e},success:function(){}})}var uploader=WebUploader.create({auto:!0,server:"/imageuploader/app",pick:"#upload-img",accept:{title:"Images",extensions:"gif,jpg,jpeg,bmp,png",mimeTypes:"image/*"}});uploader.option("compress",{width:750,height:1600,quality:100,allowMagnify:!1,crop:!1,preserveHeaders:!0,noCompressIfLarger:!1});var f={},currentImg,imgs;uploader.on("uploadStart",function(){$("#upload-img i").addClass("fa-spinner")}),uploader.on("uploadSuccess",function(e,a){{var t=JSON.parse(a._raw);e.name.replace(".jpg","")}return $("#upload-img i").removeClass("fa-spinner"),1!=t.code?void alert(t.msg[0]):void(t.data&&(imgs=t.data[750],$(".teletext-imgBox").html('<img class="currenImg" src='+imgs+' alt="">'),$.ajax({url:"/api/picture/save",type:"post",dataType:"json",data:{imgsrc:imgs},success:function(e){$("#upload-img").hasClass("update")&&currentImg?deleImg(currentImg):($(".teletext-row .upload-txt").html("上传图片"),$("#upload-img").removeClass("disable"),$("#upload-img").addClass("update")),currentImg=e.id,$(".teletext-row .upload-txt").html("更新图片"),$(".teletext-row .tips").html("图片上传成功")},error:function(){$("#errModal").modal("show")}})))});