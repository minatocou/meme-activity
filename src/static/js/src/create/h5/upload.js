/**
 * Created by memebox on 16/11/4.
 */
var uploader = WebUploader.create({
    // auto: true,
    server: '/imageuploader/h5',
    pick: '#upload-img',
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    },
    formData: {
        size: [120, 240]
    }
});

// uploader.option('compress', {
//     width: 750,
//     height: 1600,
//     quality: 100,
//     allowMagnify: false,
//     crop: false,
//     preserveHeaders: true,
//     noCompressIfLarger: false,
// });

var f = {};
var imgs;


uploader.onFileQueued = function( file ) {
    var fr = new FileReader,
        f = file.source.source;
    fr.onload = function () { // file is loaded
        var img = new Image;
        img.onload = function () {
            if (img.width > 750) {
                alert("请上传宽度小于750px的图片");
                uploader.reset();
            } else {
                uploader.upload();
            }
        };
        img.src = fr.result; // is the data URL because called with readAsDataURL
    };

    fr.readAsDataURL(f);

};

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
        imgs = data.data['640'];
        
        $.ajax({
            url: '/api/picture/save',
            type: 'post',
            dataType: 'json',
            data: {imgsrc: imgs},
            success : function(data){
                $('.img-list').prepend('<li chosenimg="' + imgs + '" class="tImg template" data-field="img">'+"<input type='text' value="+imgs+">"+'<a style="pointer-events: none;"><img src=' + imgs + ' alt=""> </a><i class="close-btn" data-id="'+data.id+'">×</i></li>')
                console.log(data)
            },
            error :  function(data){
                console.log(data)
            }
        })
    }
});

$(function(){
    $.ajax({
        url: '/api/picture/getimg',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                $('.img-list').prepend('<li chosenimg="' + data[i].url + '" class="tImg template" data-field="img">'+"<input type='text' value="+data[i].url+">"+'<a style="pointer-events: none;"><img src=' + data[i].url + ' alt=""> </a><i data-id="' + data[i].id + '" class="close-btn">×</i></li>');
            }

        }
    })
})

//del img
$('.img-list').on('click', '.close-btn', function () {
    var id = $(this).attr('data-id');
    $.ajax({
        url: '/api/picture/del',
        type: 'post',
        dataType: 'json',
        data: {id: id},
    })
    $($(this).parent()).css('display', 'none');
})
