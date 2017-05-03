/**
 * Created by carina on 17/2/16.
 */
var bgUploader = WebUploader.create({
    auto: true,
    server: '/imageuploader/live',
    pick: '#upload-bg',
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    }
});
bgUploader.option('compress', {
    width: 750,
    height: 1600,
    quality: 100,
    allowMagnify: false,
    crop: false,
    preserveHeaders: true,
    noCompressIfLarger: false,
});

bgUploader.on('uploadStart' , function(file,percentage){
    $("#upload-bg i").addClass('fa-spinner');
});
bgUploader.on('uploadSuccess', function (file, percentage) {
    var data = JSON.parse(percentage._raw);
    var filename = file.name.replace('.jpg', '');
    $("#upload-bg i").removeClass('fa-spinner');
    if( data.code !=1 ){
        alert(data.msg[0]);
        return;
    }
    if (data.data) {
        bgimgs = data.data['750'];
        $.ajax({
            url: '/api/picture/save',
            type: 'post',
            dataType: 'json',
            data: {imgsrc: bgimgs},
            success : function(data){
                //console.log(imgs)
                $(".liveForm").find(".bgBox input[name=bgUrl]").val(bgimgs);
                $(".liveForm").find(".bgBox .imgBox").addClass('showImg');
                $(".liveForm").find(".bgBox .imgBox .imgUrl").attr('src',bgimgs);
            },
            error :  function(data){
                console.log(data)
            }
        })
    }
});





var avatarUploader = WebUploader.create({
    auto: true,
    server: '/imageuploader/live',
    pick: '#upload-avatar',
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    }
});
avatarUploader.option('compress', {
    width: 750,
    height: 1600,
    quality: 100,
    allowMagnify: false,
    crop: false,
    preserveHeaders: true,
    noCompressIfLarger: false,
});

var avatarimgs;
avatarUploader.on('uploadStart' , function(file,percentage){
    $("#upload-avatar i").addClass('fa-spinner');
})
avatarUploader.on('uploadSuccess', function (file, percentage) {
    var data = JSON.parse(percentage._raw);
    var filename = file.name.replace('.jpg', '');
    $("#upload-avatar i").removeClass('fa-spinner');
    if( data.code !=1 ){
        alert(data.msg[0]);
        return;
    }
    if (data.data) {
        avatarimgs = data.data['750'];
        $.ajax({
            url: '/api/picture/save',
            type: 'post',
            dataType: 'json',
            data: {imgsrc: avatarimgs},
            success : function(data){
                $(".liveForm").find(".avatarBox input[name=avatar]").val(avatarimgs);
                $(".liveForm").find(".avatarBox .imgBox").addClass('showImg');
                $(".liveForm").find(".avatarBox .imgBox .imgUrl").attr('src',avatarimgs);
            },
            error :  function(data){
                console.log(data)
            }
        })
    }
});






var shareUploader = WebUploader.create({
    auto: true,
    server: '/imageuploader/live',
    pick: '#upload-share',
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    }
});
shareUploader.option('compress', {
    width: 750,
    height: 1600,
    quality: 100,
    allowMagnify: false,
    crop: false,
    preserveHeaders: true,
    noCompressIfLarger: false,
});

var shareimgs;
shareUploader.on('uploadStart' , function(file,percentage){
    $("#upload-share i").addClass('fa-spinner');
})
shareUploader.on('uploadSuccess', function (file, percentage) {
    var data = JSON.parse(percentage._raw);
    var filename = file.name.replace('.jpg', '');
    $("#upload-share i").removeClass('fa-spinner');
    if( data.code !=1 ){
        alert(data.msg[0]);
        return;
    }
    if (data.data) {
        shareimgs = data.data['750'];
        $.ajax({
            url: '/api/picture/save',
            type: 'post',
            dataType: 'json',
            data: {imgsrc: shareimgs},
            success : function(data){
                $(".liveForm").find(".shareBox input[name=shareImg]").val(shareimgs);
                $(".liveForm").find(".shareBox .imgBox").addClass('showImg');
                $(".liveForm").find(".shareBox .imgBox .imgUrl").attr('src',shareimgs);
            },
            error :  function(data){
                console.log(data)
            }
        })
    }
});
