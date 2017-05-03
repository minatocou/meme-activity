/**
 * Created by yate on 2017/3/14.
 */
(function () {
    var editor = new wangEditor("editor");
    //关闭控制台打印信息
    editor.config.printLog = false;
    //自定义菜单栏
    editor.config.menus = [
        'source',
        '|',     // '|' 是菜单组的分割线
        'fontsize',
        'bold',
        'underline',
        'italic',
        'forecolor',
        'bgcolor',
        '|',
        'eraser',
        'alignleft',
        'aligncenter',
        'alignright',
        '|',
        'link',
        'unlink',
        'img',
        'undo',
        '|',
        'intoDiv'
    ];
    // 配置 onchange 事件
    editor.onchange = function () {
        console.log("change");
        console.log($(".teletext-prd").length);
    };

    // 配置自定义上传的开关
    editor.config.customUpload = true;
    editor.config.customUploadInit = uploadInit;
    // ------- 配置上传的初始化事件 -------
    function uploadInit () {
        // this 即 editor 对象
        var editor = this;
        // 编辑器中，触发选择图片的按钮的id
        var btnId = editor.customUploadBtnId;
        // 编辑器中，触发选择图片的按钮的父元素的id
        var containerId = editor.customUploadContainerId;

        var parentItem = $('#'+btnId).closest(".wangEditor-drop-panel");
        //实例化一个上传对象
        var customUploader = WebUploader.create({
            auto: true,
            server: '/imageuploader/full',
            pick: '#'+btnId,
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/!*'
            }
        });

        customUploader.option('compress', {
            width: 750,
            height: 16000,
            quality: 100,
            compress: null,
            allowMagnify: true,
            crop: false,
            chunked: true,
            preserveHeaders: true,
            noCompressIfLarger: false,
        });

        var currentImg;
        var imgs;
        customUploader.on('beforeFileQueued' , function(file,percentage){
            $('#'+btnId).addClass("active");
            parentItem.find(".tab-container").append('<span class="uploadTip">正在上传</span>');
            parentItem.show();
        });
        customUploader.on('uploadSuccess', function (file, percentage) {
            var data = JSON.parse(percentage._raw);
            var filename = file.name.replace('.jpg', '');
            if( data.code !=1 ){
                alert(data.msg[0])
                return;
            }
            if (data.data) {
                imgs = data.data['750'];
                // 插入到编辑器中
                editor.command(null, 'insertHtml', '<img src="' + imgs + '" style="max-width:100%;"/>');
                $.ajax({
                    url: '/api/picture/save',
                    type: 'post',
                    dataType: 'json',
                    data: {imgsrc: imgs},
                    success: function(data, sta){
                        parentItem.find(".tab-container .uploadTip").remove();
                        parentItem.find(".tab-container").append('<span class="uploadedTip">图片上传成功</span>');
                        setTimeout(function () {
                            parentItem.find(".tab-container .uploadedTip").remove();
                            parentItem.hide();
                        }, 1000);

                        if($('#'+btnId).hasClass("active")){
                            $('#'+btnId).removeClass("active");
                        }
                        currentImg = data.id;
                    }
                })
            }
        });
    }

    //新建编辑器实例
    editor.create();

    function deleUploadImg(id) {
        $.ajax({
            url: '/api/picture/del',
            type: 'post',
            dataType: 'json',
            data: {id: id},
            success: function (data) {

            }
        })
    }

    //获取图文信息
    var teleTextId = getTeleId("id");
    if(teleTextId){
        //可预览
        var shortUrl,
            preview = $("body").data("preview"),
            previewUrl = preview.split("activity/")[0];
        if(previewUrl.indexOf("qaapp.cn.m") > 0 || previewUrl.indexOf("preprod.cn.m") > 0){
            previewUrl = previewUrl.replace(/qaapp.cn.m/i, "qaappm.cn");
            previewUrl = previewUrl.replace(/preprod.cn.m/i, "preprodm.cn");
        }
        shortUrl = previewUrl + 'm/special/teletext/index.html?id='+teleTextId;
        $(".teletext-head .preview-btn").attr("disabled", false);
        $(".teletext-head .publish-btn").attr("disabled", false);
        $(".preview-wrapper .qr").find(".p-link > p").html(shortUrl);
        $(".preview-wrapper .qr").find(".teletextId > span").html(teleTextId);

        //图文内容
        $.ajax({
            url: '/api/internal/sas/ImageText/detail',
            type: 'post',
            dataType:"json",
            data: {"id": teleTextId},
            success: function(data, sta){
                if(data.code == 1){
                    var self = $("#teletext-content");
                    var sourceData = data.data;
                    for(var n in sourceData){
                        if(n == "cover"){
                            self.find(".teletext-imgBox").html('<img class="currenImg" src="'+sourceData[n]+'" alt="">');
                        }else if(n == "title"){
                            self.find("input[name='title']").val(sourceData[n]);
                        }else if(n == "author"){
                            self.find("input[name='author']").val(sourceData[n]);
                        }else if(n == "skus"){
                            if(sourceData[n]){
                                var intoHtml = getBackList("sku", sourceData[n]);
                                $("#tele-skus").html(intoHtml);
                            }
                        }else if(n == "content"){
                            editor.$txt.html(sourceData["content"]);
                        }else if(n == "status"){
                            if(sourceData["status"] == 1){
                                $(".publish-btn").attr("data-val", 1);
                                $(".publish-btn > span").html("下线");
                            }else{
                                $(".publish-btn").attr("data-val", 0);
                                $(".publish-btn > span").html("发布");
                            }
                        }else{}
                    }
                }
            },
            error: function(err){
                console.log("出现异常");
            }
        });

    }else{
        //不可以预览
        $(".teletext-head .preview-btn").attr("disabled", true);
        $(".teletext-head .publish-btn").attr("disabled", true);
    }

    //获取图文标签列表
    getLabelInfo(teleTextId);

    //预览弹窗
    $(".teletext-head").on("click", ".preview-btn", function () {
        var url,
            teleId = getTeleId("id"),
            magento = $(".header-container").data("magento"),
            preview = $("body").data("preview");
        var previewUrl = preview.split("activity/")[0];
        if(previewUrl.indexOf("qaapp.cn.m") > 0 || previewUrl.indexOf("preprod.cn.m") > 0){
            previewUrl = previewUrl.replace(/qaapp.cn.m/i, "qaappm.cn");
            previewUrl = previewUrl.replace(/preprod.cn.m/i, "preprodm.cn");
        }
        //url =$("body").data("preview") +this.getAttribute('data-url') ;
        if(teleId){
            url = previewUrl + 'm/special/teletext/index.html?id='+teleId;
            $('#qrCode').qrcode({width: 64,height: 64,text: url});
            $(".qr .link p").html(url);
            $(".preview-wrapper .preview").html('<iframe src="'+url+"?preview=1"+'" frameborder="0"></iframe>')
            $(".preview-wrapper").show();
        }
    });

    //发布下线
    $(".teletext-head").on("click", ".publish-btn", function () {
        var self = $(this),
            sta = $(".publish-btn").attr("data-val");
        var shortUrl,
            preview = $("body").data("preview"),
            previewUrl = preview.split("activity/")[0];
        if(previewUrl.indexOf("qaapp.cn.m") > 0 || previewUrl.indexOf("preprod.cn.m") > 0){
            previewUrl = previewUrl.replace(/qaapp.cn.m/i, "qaappm.cn");
            previewUrl = previewUrl.replace(/preprod.cn.m/i, "preprodm.cn");
        }
        console.log(previewUrl);
        shortUrl = previewUrl + 'm/special/teletext/index.html?id='+teleTextId;
        if(sta == 1){
            $.ajax({
                url: '/api/internal/sas/ImageText/setClose',
                type: 'post',
                dataType:"json",
                data: {"id": teleTextId, "short_url": shortUrl},
                success: function(data, sta){
                    if(data.code == 1){
                        $(".publish-btn").attr("data-val", 0);
                        $(".publish-btn > span").html("发布");
                    }
                },
                error: function(err){
                    console.log("出现异常");
                }
            })
        }
        if(sta == 0){
            $.ajax({
                url: '/api/internal/sas/ImageText/setOpen',
                type: 'post',
                dataType:"json",
                data: {"id": teleTextId, "short_url": shortUrl},
                success: function(data, sta){
                    if(data.code == 1){
                        $(".publish-btn").attr("data-val", 1);
                        $(".publish-btn > span").html("下线");
                    }
                },
                error: function(err){
                    console.log("出现异常");
                }
            })
        }
    });

    //关闭预览
    $(".preview-wrapper .close").on("click",function(){
        $(".preview-wrapper .preview").html("");
        $('#qrCode').html("");
        $(".qr .link p").html("");
        $(".preview-wrapper").hide();
    });

    //保存图文
    $("#teletext-save").click(function () {
        var self = $("#teletext-content"),
            flag = true,
            teleId = getTeleId("id");
        var teletext = {
            cover: "",
            title: "",
            author: "",
            intro: "",
            content: ""
        };
        teletext.cover = self.find(".currenImg").attr("src");
        teletext.title = self.find("[name='title']").val();
        teletext.author = self.find("[name='author']").val();
        teletext.intro = editor.$txt.text() ? editor.$txt.text().substr(0, 50):"";
        teletext.content = editor.$txt.text() ? editor.$txt.html():"";
        if(teleId){
            teletext.id = teleId;
        }
        flag = validateObj(teletext);
        if(flag){
            var labellist = self.find(".label-list ul").children(),
                list,
                tagsId = [],
                tagsName = [],
                skuslist = $("#tele-skus").children(),
                skus = [],
                shortUrl;
            var preview = $("body").data("preview");
            var previewUrl = preview.split("activity/")[0];
            if(previewUrl.indexOf("qaapp.cn.m") > 0 || previewUrl.indexOf("preprod.cn.m") > 0){
                previewUrl = previewUrl.replace(/qaapp.cn.m/i, "qaappm.cn");
                previewUrl = previewUrl.replace(/preprod.cn.m/i, "preprodm.cn");
            }
            if(labellist.length){
                var source = labellist.filter("li");
                $.each(source, function (n, item) {
                    tagsId.push($(item).data("val"));
                    tagsName.push($(item).data("txt"));
                });
                teletext.tags_id = tagsId.join();
                teletext.tags_name = tagsName.join();
                //$(".teletext-table").find('.t-tags').removeClass("err");
            }else{
                //$(".teletext-table").find('.t-tags').addClass("err");
                //return false;
                teletext.tags_id = "";
                teletext.tags_name = "";
            }
            if(skuslist.length){
                var source = skuslist.filter(".skus-item");
                $.each(source, function (n, item) {
                    skus.push($(item).text());
                });
                teletext.skus = skus.join();
            }else{
                teletext.skus = "";
            }
            teletext.jump_id = new Date().getTime().toString(36);
            shortUrl = previewUrl + 'm/special/teletext/index.html?id='+teleId;
            teletext.short_url = shortUrl;
            teletext.admin = $(".user-name").data("name");
        }else{
            alert("有必填项未填写");
            return false;
        }
        //保存图文信息
        $.ajax({
            url: '/api/internal/sas/ImageText/save',
            type: 'post',
            dataType:"json",
            data: {"data": JSON.stringify(teletext)},
            beforeSend: function () {
                $("#teletext-save").attr("disabled", true);
                $("#teletext-save > span").text("正在保存");
            },
            success: function(data, sta){
                if(data.code == 1){
                    alert("保存成功");
                    location.href = "/teletext/list";
                }
            },
            error: function(err){
                console.error("出现异常");
            },
            complete: function (res, sta) {
                $("#teletext-save > span").text("保存");
                $("#teletext-save").attr("disabled", false);
            }
        })

    });

    //上传图片
    $("#upload-img").click(function () {
        var self = $("#upload-img");
        if(self.hasClass("disable")){
            return false;
        }else{
            self.addClass("disable");
            $(".teletext-row .upload-txt").html("正在上传");
        }
    });

    //获取标签一级分类，二级分类和当前选中标签
    function getLabelInfo(id) {
        var imageTextId = id ? id:"";
        $.when(
            //获取标签主分类内容
            $.ajax({
                url: '/api/internal/sas/tag/getComponentCategory',
                type: 'post',
                dataType:"json",
                data: {
                    "scene": 2,
                    "type": 2,
                    "id": imageTextId
                },
                success: function(data, sta){
                    console.log(data.msg);
                },
                error: function(err){
                    console.error("出现异常");
                }
            })).done(function (data) {
            if(data.code == 1){
                var mainCates = data.data,
                    flag = false,
                    intoHtml = "",
                    temp = "";
                for(var l=0; l<mainCates.length; l++){
                    if(mainCates[l].selected == 1){
                        intoHtml += '<li class="current" data-val='+mainCates[l].category_id+'>'+mainCates[l].name+'</li>';
                        flag = true;
                    }else{
                        intoHtml += '<li data-val='+mainCates[l].category_id+'>'+mainCates[l].name+'</li>';
                    }
                }
                if(flag){
                    $(".label-tags").html(intoHtml);
                }else{
                    $(intoHtml).each(function (n, item) {
                        if(n == 0){
                            $(item).addClass("current");
                            temp += item.outerHTML;
                        }else{
                            temp += item.outerHTML;
                        }
                    });
                    $(".label-tags").html(temp);
                }
            }else{
                console.log("出现异常");
            }
        }).then(function (data) {
            //获取标签二级分类内容
            if(data.data.length){
                var cateId = data.data[0].category_id;
                getSecondCate(cateId);
            }
        });

        //获取当前选中标签分类内容
        $.ajax({
            url: '/api/internal/sas/tag/getObjTag',
            type: 'post',
            dataType:"json",
            data: {
                "scene": 2,
                "type": 2,
                "id": imageTextId
            },
            success: function(data, sta){
                if(data.code == 1){
                    var currentCate = data.data,
                        intoHtml = "";
                    if(currentCate.length){
                        for(var l=0; l<currentCate.length; l++){
                            intoHtml += '<li data-val='+currentCate[l].tag_id+' data-txt='+currentCate[l].label+'>'+currentCate[l].label+'</li>';
                        }
                        $(".label-list ul").html(intoHtml);
                    }
                }else{
                    console.log("出现异常");
                }
            },
            error: function(err){
                console.error("出现异常");
            }
        });
    }

    //点击一级标签菜单
    $(".label-tags").on("click", "li", function () {
        var self = $(this),
            mainId = self.data("val");
        $(this).addClass("current").siblings("li").removeClass("current");
        getSecondCate(mainId);
    });
    //点击二级标签菜单
    $(".label-table").on("click", "li", function () {
        var self = $(this),
            val = self.data("val"),
            txt = self.text();
        if(self.hasClass("current")){
            $(".label-list ul li").filter("[data-val="+val+"]").remove();
            self.removeClass("current");
        }else{
            self.addClass("current");
            $(".label-list ul").append('<li data-val='+val+' data-txt='+txt+'>'+txt+'</li>');
        }
    });

    //获取二级菜单
    function getSecondCate(cateId){
        var teleID = teleTextId?teleTextId:"";
        $.ajax({
            url: '/api/internal/sas/tag/getComponentTag',
            type: 'post',
            dataType:"json",
            data: {
                "category_id": cateId,
                "scene": 2,
                "type": 2,
                "id": teleID
            },
            success: function(data, sta){
                if(data.code == 1){
                    var sedCate = data.data,
                        intoHtml = "";
                    for(var l=0; l<sedCate.length; l++){
                        if(sedCate[l].selected == 1){
                            if(sedCate[l].is_visible == 1){
                                intoHtml += '<li class="current" data-val='+sedCate[l].tag_id+'>'+sedCate[l].label+'</li>';
                            }else{
                                intoHtml += '<li class="current" data-val='+sedCate[l].tag_id+'>'+sedCate[l].label+'<i class="fa fa-low-vision"></i></li>';
                            }
                        }else{
                            if(sedCate[l].is_visible == 1){
                                intoHtml += '<li data-val='+sedCate[l].tag_id+'>'+sedCate[l].label+'</li>';
                            }else{
                                intoHtml += '<li data-val='+sedCate[l].tag_id+'>'+sedCate[l].label+'<i class="fa fa-low-vision"></i></li>';
                            }
                        }
                    }
                    $(".label-table").html(intoHtml);

                }else{
                    console.log("出现异常");
                }
            },
            error: function(err){
                console.error("出现异常");
            }
        });
    }

    function validateObj (obj) {
        for(var n in obj){
            if(obj[n] == undefined || obj[n] == ""){
                $(".teletext-table").find('.t-'+n+'').addClass("err");
                return false;
            }else{

                $(".teletext-table").find('.t-'+n+'').removeClass("err");
            }
        }
        return true;
    }

    function getTeleId (name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return (r[2]);
        return null;
    }
    function getBackList(sta, obj){
        var list = $.trim(obj).split(","),
            intoHtml;
        if(sta == "sku"){
            intoHtml = "";
            for(var i=0; i<list.length; i++){
                intoHtml += '<span class="skus-item">'+list[i]+'<i class="del-prd"></i></span>';
            }
        }
        return intoHtml;
    }

    //删除指定sku商品
    $(".teletext-content").on("click", ".del-prd", function () {
        var self = $(this),
            theSku = self.closest(".teletext-prd").data("val"),
            parentItem = self.parents(".teletext-prd"),
            theprdGroup = $("#tele-skus").children(".skus-item");
        parentItem.remove();
        $(theprdGroup).each(function (n, item) {
            var val = $(item).text();
            if(val == theSku){
                $(item).remove();
            }
        })
    });
    $("#tele-skus").on("click", ".del-prd", function () {
        var self = $(this),
            theSku = self.closest(".skus-item").text(),
            parentItem = self.parents(".skus-item"),
            theprdGroup = $(".teletext-content").find(".teletext-prd");
        parentItem.remove();
        $(theprdGroup).each(function (n, item) {
            var val = $(item).data("val");
            if(val == theSku){
                $(item).remove();
            }
        })
    });
})();