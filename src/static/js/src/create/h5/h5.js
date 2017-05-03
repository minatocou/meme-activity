/**
 * Created by page.xia on 16/9/18.
 */

(function () {
    template.config('openTag', '${')
    template.config('closeTag', '}')
    var createForm = function () {
        var subData = {};
        var comm = $(attrComm).serializeObject();
        subData.root = comm;
        var f = $('[data-setting]');
        var fData = [];
        f.each(function (i, item) {
            var fitem = $(this);
            var fw = fitem.width(), fh = fitem.height();
            var links = fitem.find('.link');
            var $video = fitem.find('.addVideo-cont');
            var setting = JSON.parse(fitem.attr('data-setting'));
            setting['position'] = i;
            if (links.length > 0) {
                var linkData = [],
                    linkPopData = [];
                links.each(function (l, linkItem) {
                    var liData = {
                        css: {
                            left: (parseInt($(this).css('left')) / fw * 100) + '%',
                            top: (parseInt($(this).css('top')) / fh * 100) + '%',
                            width: ($(this).width() / fw * 100) + '%',
                            height: ($(this).height() / fh * 100) + '%',
                            position: 'absolute',
                            zIndex: '100'
                        },
                        url: $.trim($(this).find('.link-url').text())
                    }
                    if($(this).hasClass("link-popup")){
                        liData.img = $(this).find('.pop-img-url').text();
                        liData.url = $.trim($(this).find('.link-url').text());
                        liData.type = $(this).find(".link-type").text();
                        linkPopData.push(liData);
                    }else{
                        linkData.push(liData);
                    }
                });
                setting.links = linkData;
                setting.linksPopup = linkPopData;
            } else {
                delete setting.links;
                delete setting.linksPopup;
            }
            if (fitem.hasClass("tVideo")) {
                if ($video.length > 0) {
                    var videoData = {
                        left: (parseInt($video.css('left')) / fw * 100) + '%',
                        top: (parseInt($video.css('top')) / fh * 100) + '%',
                        width: ($video.width() / fw * 100) + '%',
                        height: ($video.height() / fh * 100) + '%',
                        position: 'absolute',
                        zIndex: '100'
                    }
                    setting.videocss = videoData

                } else {
                    delete setting.videocss
                    delete setting.videoUrl
                }
                setting.videoBackground = setting.videoBackground || "/img/video.png"
            }

            fData.push(setting);
        })

        subData.field = fData;
        return subData;
    }

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        var $radio = $('input[type=radio],input[type=checkbox]',this);
        $.each($radio,function(){
            if(!o.hasOwnProperty(this.name)){
                o[this.name] = '';
            }
        });
        return o;
    };
    
    var saveData = function (callback, ele) {
        var formData = createForm();

        formValidator(formData ,  ele , function(){
            $.post('/api/h5/save', {
                cid: formData.root.cid,
                d: formData.root.d,
                title: formData.root.title,
                key: formData.root.urlkey,
                setting: JSON.stringify(formData),
                state: $("body").data("state")
            }, function (data) {
                callback && callback(data, formData);
            }).error(
                function(data) {
                    alert("error");
                }
            )
        });
    }
    
    $('#save-btn').on('click', function () {
        if ($(this).hasClass("disable"))return;
        $(this).addClass("disable");
        saveData(function (data , formData) {
            var urlkey = formData.root.urlkey;
            var preview_url = $("body").data("preview") + urlkey + "?preview=1";
            $(".preview").append("<iframe src=" + preview_url + " frameborder='0'></iframe>");
            alert(constant.save_success)
            window.location.reload()
        }, $(this))
    })
    
    
    
    

    $("#preview-btn").on("click", function () {
        saveData(function (data, formData) {
            var urlkey = formData.root.urlkey;
            var preview_url = $("body").data("preview") + urlkey + "?preview=1";
            var view_url = $("body").data("preview") + urlkey;
            $(".preview").append("<iframe src=" + preview_url + " frameborder='0'></iframe>");
            $('#qrCode').qrcode({width: 64, height: 64, text: view_url});
            $(".qr .p-link p").html(view_url);
            $(".preview-wrapper").show();
        }, $(this))
    });

    
    $(".preview-wrapper .close").on("click", function () {
        $(".preview").html("");
        $('#qrCode').html("");
        $(".qr .p-link p").html("");
        $('.preview-wrapper .preview').html('');
        $(".preview-wrapper").hide();
    });
    //upload img(upload/save)

})()
