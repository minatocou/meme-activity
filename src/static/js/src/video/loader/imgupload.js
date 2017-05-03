/**
 * Created by carina on 17/2/16.
 */
var imgUploader = WebUploader.create({
    auto: true,
    server: '/imageuploader/video',
    pick: '#upload-img',
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    }
});
imgUploader.option('compress', {
    width: 750,
    height: 1600,
    quality: 100,
    allowMagnify: false,
    crop: false,
    preserveHeaders: true,
    noCompressIfLarger: false,
});

var f = {};
var imgs;
imgUploader.on('uploadStart' , function(file,percentage){
    $("#upload-img i").addClass('fa-spinner');
})
imgUploader.on('uploadSuccess', function (file, percentage) {
    var data = JSON.parse(percentage._raw);
    var filename = file.name.replace('.jpg', '');
    $("#upload-img i").removeClass('fa-spinner');
    if( data.code !=1 ){
        alert(data.msg[0]);
        return;
    }
    if (data.data) {
        imgs = data.data['750'];
        $.ajax({
            url: '/api/picture/save',
            type: 'post',
            dataType: 'json',
            data: {imgsrc: imgs},
            success : function(data){
                //console.log(imgs)
                
                $('.videoForm').find('.imgBox').addClass('showImg');
                $('.videoForm').find('input[name=img_url]').val(imgs);
                $('.imgUrl').attr('src',imgs);
            },
            error :  function(data){
                console.log(data)
            }
        })
    }
});
