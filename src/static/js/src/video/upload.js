/**
 * Created by carina on 17/3/9.
 */


$(function () {
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        container: 'uploadFile',
        drop_element: 'container',
        max_file_size: '2048mb',
        flash_swf_url: 'loader/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        //uptoken: $('#uptoken').val(),
        uptoken_func: function(file){    // 在需要获取uptoken时，该方法会被调用
            var uptoken;
            var category = $('.videoForm select[name=category] option:selected').html();
            $.ajax({
                url: "/api/qiniu/uptoken?file_name=" + file.name+"&category="+category,
                type: "get",
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data.code == 1) {
                        uptoken=data.uptoken;
                    }
                }
            });
           return uptoken;
        },
        get_new_uptoken:true,
        domain: $('#domain').val(),
        auto_start: false,
        unique_names: false,
        save_key: false,
        init: {
            'FilesAdded': function (up, files) {
                var file = files[0];
                if($('.videoForm select[name=category]').val() == '请选择'){
                    alert('为了方便视频在七牛云存储的管理,请先选择视频分类!');
                    return;
                }else{
                    up.start();
                }

                plupload.each(files, function (file) {
                    //var progress = new FileProgress(file, 'uploadProgress');
                    var progress = new FileProgress(file);
                    progress.setStatus("等待...");
                });
            },
            'BeforeUpload': function (up, file) {
                //var progress = new FileProgress(file, 'uploadProgress');
                var progress = new FileProgress(file);
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    progress.setChunkProgess(chunk_size);
                }
            },
            'UploadProgress': function (up, file) {
                //var progress = new FileProgress(file, 'uploadProgress');
                //var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                //progress.setProgress(file.percent + "%", file.speed, chunk_size);
                if (file.percent == 100) {
                    $('#uploadProgress .pro').html('视频上传成功').show().siblings().hide();
                } else {
                    $('#uploadProgress .pro').show().siblings().hide();
                    $('#uploadProgress .pro span').html(file.percent +'%');
                }
            },
            'Key': function (up, file) {
                var category = $('.videoForm select[name=category] option:selected').html();
                //var key = $("#qiniuFileHeader").val() + codefans_net_CC2PY(category+''+file.name);
                var file_name = file.name;
                var fileProcess = file_name.substring(0,file_name.lastIndexOf('.'));
                var fileSuffix = file_name.substring(file_name.lastIndexOf('.'));
                var fileSub = fileProcess.replace(/\s/g,'');
                var file = clearString(fileSub);
                var date = getYearMonthDay();

                var key = $("#qiniuFileHeader").val() + '_'+date+'_' +category + '_' + file+fileSuffix;
                return key;
            },
            'UploadComplete': function () {
                $('#success').show();
            },
            'FileUploaded': function (up, file, info) {
                /*var progress = new FileProgress(file, 'uploadProgress');
                 progress.setComplete(up, info);*/

                var domain = up.getOption('domain');
                var res = JSON.parse(info);

                $('#uploadProgress .waiting').html("视频等待压缩").show().siblings().hide();
                var timer = setInterval(function () {
                    $.ajax({
                        url: "/api/qiniu/prefop?id=" + res.persistentId,
                        type: "get",
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        success: function (data) {
                            if (data.code == 0) {
                                $('#uploadProgress .success').html("视频压缩成功").show().siblings().hide();
                                var videoUrl;
                                var videoImg;
                                if (data.items.length > 0) {
                                    for (var i = 0; i < data.items.length; i++) {
                                        if (data.items[i].cmd.indexOf('jpg')>0) {
                                            videoImg = 'http://' + domain + '/' + encodeURIComponent(data.items[i].key)+'?imageView2/0/w/750/h/1600';
                                        } else if (data.items[i].cmd.indexOf('mp4')>0) {
                                            videoUrl = 'http://' + domain + '/' + encodeURIComponent(data.items[i].key);
                                        }
                                    }
                                }
                                $(".videoForm").find("input[name=video_url]").val(videoUrl);
                                $('.videoForm').find('input[name=video_img]').val(videoImg);
                                $('.videoImg').attr('src', videoImg);


                                $('.videoForm').find('input[name=img_url]').val(videoImg);
                                $('.videoForm .imgBox').addClass('showImg');
                                $('.imgUrl').attr('src', videoImg);

                                clearInterval(timer);
                            } else if (data.code == 1) {
                                $('#uploadProgress .waiting').html("视频等待压缩").show().siblings().hide();
                            } else if (data.code == 2) {
                                $('#uploadProgress .waiting').html("视频正在压缩").show().siblings().hide();
                            } else if (data.code == 3 || data.code == 4) {
                                $('#uploadProgress .fail').html("视频压缩失败,请重新上传").siblings().hide();
                                clearInterval(timer);
                            }

                        }
                    })
                }, 2000);

            },
            'Error': function (up, err, errTip) {
                //var progress = new FileProgress(err.file);
                //progress.setError();
                //progress.setStatus(errTip);
                alert(errTip);
            }
        }
    });

    uploader.bind('FileUploaded', function () {
        console.log('hello man,a file is uploaded');
    });

    $('#container').on(
        'dragenter',
        function (e) {
            e.preventDefault();
            $('#container').addClass('draging');
            e.stopPropagation();
        }
    ).on('drop', function (e) {
        e.preventDefault();
        $('#container').removeClass('draging');
        e.stopPropagation();
    }).on('dragleave', function (e) {
        e.preventDefault();
        $('#container').removeClass('draging');
        e.stopPropagation();
    }).on('dragover', function (e) {
        e.preventDefault();
        $('#container').addClass('draging');
        e.stopPropagation();
    });


    $('body').on('click', 'table button.btn', function () {
        $(this).parents('tr').next().toggle();
    });

    var clearString= function (s){
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]")
        var rs = "";
        for (var i = 0; i < s.length; i++) {
            rs = rs+s.substr(i, 1).replace(pattern, '');
        }
        return rs;
    };

    var getYearMonthDay = function(){
        var time = new Date();
        var year  =time.getFullYear();
        var month = (time.getMonth()+1)<10 ? "0" +(time.getMonth()+1):(time.getMonth()+1);
        var day = time.getDate()<10 ? "0" +time.getDate():time.getDate();

        return year+month+day;
    };
    
});