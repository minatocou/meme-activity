/**
 * Created by page.xia on 16/9/18.
 */

(function() {
    template.config('openTag','${')
    template.config('closeTag','}')
    var CANVAS_PANEL = '#canvas',TEMPLATE_PANEL = '#template',IMG_PANEL = '.img-list';
    var attrClass = '.attr-form';
    var attrComm='.comm-attr';
    var SETTING='data-setting';
    var chosenImg;
    var FIELD = {
        l1: '.t1-attr',
        img: '.img-attr',
        video: '.video-attr'
    }
    var constant = i18n[$("body").data("localize")];
    var httpJson = function (url,data,sccuess) {
        $.ajax({
            url:url,
            data:data,
            dataType:'json',
            xhrFields: {withCredentials: true},
            type:'GET',
            success: sccuess,
            error: function () {
                alert('time out')
            }
        })
    }
    var DEFAULT_SETTING={'l1':{column:3}}
    var getUuid= function () {
        return new Date().getTime().toString(36);
    }
    var t1Event= function (data) {
    

    }
    var videoEvent = function (data) {
        var curEL = $(CANVAS_PANEL).find('.cur');
        curEL.css('background', data.videoBackground);
        curEL.find('img').attr('src', data.imgSrc);
    }
    var imgEvent= function (data) {
        var curEL=$(CANVAS_PANEL).find('.cur');
        curEL.find('a').attr('href',data.imgUrl);
        curEL.find('img').attr('src',data.imgSrc);
        // var html=template('imgTemplate',data);
        // curEL.html(html);
    }
    var resetForm = function (data) {
        var curEL=$(CANVAS_PANEL).find('.cur');
        var defaultSet=JSON.parse(curEL.attr(SETTING));
        data=_.extend(defaultSet,data);
        curEL.attr(SETTING,JSON.stringify(data));
        var event={
            'l1':t1Event,
            'img':imgEvent ,
            'video': videoEvent
        };
        event[data.type](data);
    }
    var createForm = function () {
        var subData={};
        var comm=$(attrComm).serializeObject();

        subData.root=comm;
        var f=$('[data-setting]');
        var fData=[];
        f.each(function (i,item) {
            var fitem=$(this);
            var fw=fitem.width(),fh=fitem.height();
            var links=fitem.find('.link');
            var $video = fitem.find('.addVideo-cont');
            var setting=JSON.parse(fitem.attr('data-setting'));
            setting['position']=i;
            if(links.length>0){
                var linkData=[];
                links.each(function (l,linkItem) {
                    var liData={
                        css:{
                            left:(parseInt($(this).css('left'))/fw*100).toFixed(2)+'%',
                            top:(parseInt($(this).css('top'))/fh*100).toFixed(2)+'%',
                            width:($(this).width()/fw*100).toFixed(2)+'%',
                            height:($(this).height()/fh*100).toFixed(2)+'%',
                            position: 'absolute',
                            zIndex: '100'
                        },
                        url:$(this).find('.link-url').text()
                    }
                    linkData.push(liData);
                })
                setting.links=linkData;
            }
            else {
                delete setting.links
            }
            if( fitem.hasClass("tVideo") ){
                if( $video.length > 0 ){
                    var videoData = {
                        left: (parseInt($video.css('left')) / fw * 100) + '%',
                        top: (parseInt($video.css('top')) / fh * 100) + '%',
                        width: ($video.width() / fw * 100) + '%',
                        height: ($video.height() / fh * 100) + '%',
                        position: 'absolute',
                        zIndex: '100'
                    }
                    setting.videocss = videoData

                }else{
                    delete setting.videocss
                    delete setting.videoUrl
                }
                setting.videoBackground = setting.videoBackground || "/img/video.png"
            }
            fData.push(setting);
        })

        subData.field=fData;
        return subData;
    }

    var saveData= function (callback , ele) {
        var formData = createForm();
        if ($.trim(formData.root.title) != '') {
            $.post('/api/pc/save',{
                cid:formData.root.cid,
                d: formData.root.d,
                title:formData.root.title,
                key:formData.root.urlkey,
                setting:JSON.stringify(formData),
                state : $("body").data("state")
            },function (data) {
                callback && callback(data,formData);
            })
        }
        else {
            ele.removeClass("disable")
            alert(constant.activity_none);
        }

    }
    $('#save-btn').on('click',function () {
        if( $(this).hasClass("disable") )return;
        $(this).addClass("disable");
        saveData(function (data) {
            alert(constant.save_success)
            window.location.reload()
        } , $(this))
    })
    $(TEMPLATE_PANEL).sortable({
        group: {
            name: 'template',
            pull: 'clone'
        },  // or { name: "...", pull: [true, false, clone], put: [true, false, array] }
        sort: true,  // sorting inside list
        fallbackOnBody:true
    })

    $(IMG_PANEL).sortable({
        group: {
            name: 'img',
            pull: 'clone'
        },  // or { name: "...", pull: [true, false, clone], put: [true, false, array] }
        fallbackOnBody:true
    })
    $(CANVAS_PANEL).sortable({
        group: {
            name: "canvas",
            put: ['template','img'],
            draggable:'[data-field]'
        },  // or { name: "...", pull: [true, false, clone], put: [true, false, array] }
        sort: true,  // sorting inside list,
        onUpdate: function (/**Event*/evt) {
            //         var itemEl = evt.item;  // dragged HTMLElement
            //         // + indexes from onEnd
            //         console.log('update', itemEl)
            console.log(123)
        },
        onAdd: function (evt) {
            //         var itemEl = evt.item;  // dragged HTMLElement
            //         evt.from;  // previous list
            //         // + indexes from onEnd
            var itemEL=$(evt.item);
            var type=$(evt.item).attr('data-field');
            var setting={
                id:getUuid(),
                type:itemEL.attr('data-field')
            }
            console.log(type);
            //特殊设置项
            if(itemEL.attr('chosenimg')){
                setting.imgSrc=itemEL.attr('chosenimg');
            }
            if(DEFAULT_SETTING[type]){
                setting=_.extend(setting,DEFAULT_SETTING[type]);
            }
            $(evt.item).attr('id',setting.id).attr(SETTING,JSON.stringify(setting))
        }
    })
    $('.link').each(function (i,item) {
        $(this).resizable({
            containment: $(this).closest('li')
        }).draggable({
            containment: $(this).closest('li')
        });
    })

    $('#addLink').click(function () {
        var curEL=$(CANVAS_PANEL).find('.cur');
        var link=$('<div class="link"><span class="link-url">'+$('#linkUrl').val()+'</span><i class="close-link-btn">×</i></div>').appendTo(curEL);
        link.resizable({
            containment: curEL
        }).draggable({
            containment: curEL
        });
    })
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    $(CANVAS_PANEL).on('click','.close-btn',function(e){
        e.stopPropagation();
        e.preventDefault();
        $(attrClass).hide();
        $(this).closest('li').remove();
    })
    $(CANVAS_PANEL).on('click','.close-link-btn',function(e){
        e.stopPropagation();
        e.preventDefault();
        $(this).closest('.link').remove();
    })
    $(CANVAS_PANEL).on('click', '.close-video-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).closest('.addVideo-cont').remove();
    })

    //设置项
    $(CANVAS_PANEL).on('click','[data-field]',function (e) {
        e.stopPropagation();
        e.preventDefault();
        var $this=$(this);
        $this.addClass('cur').siblings('.cur').removeClass('cur');
        var f=$this.attr('data-field');
        var setForm=FIELD[f];
        $(setForm).show().siblings(attrClass).hide();

        var s=JSON.parse($this.attr(SETTING));
        $(setForm).find("input").val("");
        console.log($(setForm).find("input[name$='imgSrc']").length)
        $(setForm).find("input[name$='imgSrc']").each(function(){
            $(this).val($this.attr('chosenimg'));
        })
        for(var k in s){
            if(s[k]){
                $(setForm).find('[name='+k+']').val(s[k]);
            }
        }
    })
    $(attrClass).on('change','input,select',function(){
        var data=$(this).closest('form').serializeObject();
        resetForm(data);
    })


    $("#preview-btn").on("click", function () {
        saveData(function (data,formData) {
            var urlkey = formData.root.urlkey;
            var preview_url = $("body").data("preview")+urlkey+"?preview=1";
            window.open(preview_url)
        },$(this))
    });

    $(".img-wrapper").on('click','li img',function(){
        $(this).addClass('chosen');
        var chosenImg = $(this).attr('src');
        var curEL=$(CANVAS_PANEL).find('.cur');
        if(curEL.length>0){
            curEL.attr('chosenimg',chosenImg);
            var form=$('form:visible');
            form.find('[form-img]').val(chosenImg);
            var data=form.serializeObject();
            resetForm(data);
        }
    })
    

    var uploader = WebUploader.create({
        auto: true,
        server: '/imageuploader/primary',
        pick: '#upload-img',
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },
        formData:{
            size:[120,240]
        },
    });
    uploader.option( 'compress', {
        quality: 100,
        allowMagnify: false,
        crop: false,
        preserveHeaders: true,
        noCompressIfLarger: false,
    });

    var f={};
    var imgs;
    uploader.on('uploadStart' , function(file,percentage){
        $("#upload-img i").addClass('fa-spinner');
    })
    uploader.on( 'uploadSuccess', function( file, percentage ) {
        var data=JSON.parse(percentage._raw);
        var filename=file.name.replace('.jpg','');
        $("#upload-img i").removeClass('fa-spinner');
        if( data.code !=1 ){
            alert(data.msg[0])
            return;
        }
        if(data.data){
            imgs = data.data['img'];
            $('.img-list').prepend('<li chosenimg="'+imgs+'" class="tImg template" data-field="img"><a style="pointer-events: none;"><img src='+imgs+' alt=""> </a><i class="close-btn">×</i></li>')

            $.ajax({
                url: '/api/picture/save',
                type: 'post',
                dataType: 'json',
                data: {imgsrc: imgs},
                success : function(data){
                    console.log(data)
                },
                error :  function(data){
                    console.log(data)
                }
            })
        }
    });

    //get img list 
    jQuery(document).ready(function($) {
        $.ajax({
            url: '/api/picture/getimg',
            type: 'get',
            dataType: 'json',
            success: function(data){
                for(var i=0;i<data.length;i++){
                    $('.img-list').prepend('<li chosenimg="'+data[i].url+'" class="tImg template" data-field="img"><a style="pointer-events: none;"><img src='+data[i].url+' alt=""> </a><i data-id="'+data[i].id+'" class="close-btn">×</i></li>');
                }

            }
        })

    });
    $('.addVideo-cont').each(function (i, item) {
        $(this).resizable({
            containment: $(this).closest('li')
        }).draggable({
            containment: $(this).closest('li')
        });
    })
    $('#addVideo').click(function () {

        var curEL = $(CANVAS_PANEL).find('.cur');
        if(curEL.find('.addVideo-cont').length){
            alert(constant.video_one);
            return false;
        }
        if( !$.trim($('#videoUrl').val()) || !$.trim($('#videoBackground').val())){
            alert(constant.video_bk);
            return false;
        }
        var link = $('<div class="addVideo-cont"><span class="video-url">' + $('#videoUrl').val() + '</span><i class="close-video-btn">×</i></div>').appendTo(curEL);
        link.resizable({
            containment: curEL
        }).draggable({
            containment: curEL
        });
    });
    //del img
    $('.img-list').on('click','.close-btn', function () {
        var id = $(this).attr('data-id');
        $.ajax({
            url: '/api/picture/del',
            type: 'post',
            dataType: 'json',
            data: { id: id },
        })
        $($(this).parent()).css('display', 'none');
    })
    $(".ba").click(function(){
        var _this = this;
        if($(_this).hasClass('toggle')){
            $(".img-wrapper").animate({left:"-75px"},function(){
                $(_this).removeClass('toggle')
            });
        }else{
            $(".img-wrapper").animate({left:"169px"},function(){
                $(_this).addClass('toggle')
            });
        }

    } )
})()
