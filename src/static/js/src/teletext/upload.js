/**
 * Created by yate on 2017/3/14.
 */
var uploader = WebUploader.create({
    auto: true,
    server: '/imageuploader/app',
    pick: '#upload-img',
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    }
});
uploader.option('compress', {
    width: 750,
    height: 1600,
    quality: 100,
    allowMagnify: false,
    crop: false,
    preserveHeaders: true,
    noCompressIfLarger: false,
});

var f = {};
var currentImg;
var imgs;
uploader.on('uploadStart' , function(file,percentage){
    $("#upload-img i").addClass('fa-spinner');
})
uploader.on('uploadSuccess', function (file, percentage) {
    var data = JSON.parse(percentage._raw);
    var filename = file.name.replace('.jpg', '');
    $("#upload-img i").removeClass('fa-spinner');
    if( data.code !=1 ){
        alert(data.msg[0])
        return;
    }
    if (data.data) {
        imgs = data.data['750'];
        $('.teletext-imgBox').html('<img class="currenImg" src=' + imgs + ' alt="">');
        $.ajax({
            url: '/api/picture/save',
            type: 'post',
            dataType: 'json',
            data: {imgsrc: imgs},
            success: function(data, sta){
                if($("#upload-img").hasClass("update") && currentImg){
                    deleImg(currentImg);
                }else{
                    $(".teletext-row .upload-txt").html("上传图片");
                    $("#upload-img").removeClass("disable");
                    $("#upload-img").addClass("update");
                }
                currentImg = data.id;
                $(".teletext-row .upload-txt").html("更新图片");
                $(".teletext-row .tips").html("图片上传成功");
            },
            error: function(data){
                $('#errModal').modal('show');
            }
        })
    }
});

function deleImg(id) {
    $.ajax({
        url: '/api/picture/del',
        type: 'post',
        dataType: 'json',
        data: {id: id},
        success: function (data) {

        }
    })
}
/*$(function(){
    $.ajax({
        url: '/api/picture/getimg',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            if(data.length){
                for (var i = 0; i < data.length; i++) {
                    $('.teletext-imgBox').html('<li class="tele-item"><img src=' + data[i].url + ' alt=""></li>');
                }
            }

        }
    })
})*/

