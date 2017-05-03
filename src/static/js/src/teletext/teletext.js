/**
 * Created by yate on 2017/3/13.
 */
(function () {
    template.config('openTag', '${');
    template.config('closeTag', '}');

    var currentPageIndex = getHostUrl("pageIndex") || 1,
        currentPageSize = 10;
    //搜索图文列表
    $("#search-btn").click(function (e) {
        var param = $(".form-telelist").serializeObject();
        if(!param.status){
            param.status = null;
        }
        $.ajax({
            url: '/api/internal/sas/ImageText/list',
            type: 'get',
            dataType:"json",
            data: {
                pageIndex: currentPageIndex,
                pageSize: currentPageSize,
                filter: JSON.stringify(param)
            },
            success: function(data, sta){
                if(data.code == 1 && data.data.length){
                    var count = data.count ? data.count:"";
                    $("#tele-alertCnt").show();
                    $("#tele-alertInfo").hide();
                    var sourceData = data.data;
                    var tpl = template('telelist-tpl', data);
                    $("#teletext-list").html(tpl);

                    //分页
                    $('#pagination').pagination({
                        dataSource: new Array(data.count),
                        pageSize: currentPageSize,
                        // totalPage:2,
                        showGoInput: true,
                        showGoButton: true,
                        pageNumber: getHostUrl("pageIndex") || 1,
                        afterPageOnClick:function (e,index) {
                            location.href='?pageIndex='+index.trim();
                        },
                        afterPreviousOnClick:function (e,index) {
                            location.href='?pageIndex='+index.trim();
                        },
                        afterNextOnClick:function (e,index) {
                            location.href='?pageIndex='+index.trim();
                        },
                        afterGoButtonOnClick:function (e,index) {
                            var i = index.trim();
                            (i!='')&&(location.href='?pageIndex='+i);
                        },
                        callback: function () {

                        }
                    })
                }else{
                    $("#tele-alertCnt").hide();
                    $("#tele-alertInfo").show();
                }
            },
            error: function(err){
                console.log("出现异常");
            }
        });
        return false;
    });

    //获取图文列表
    $.ajax({
        url: '/api/internal/sas/ImageText/list',
        type: 'get',
        dataType:"json",
        data: {
            pageIndex: currentPageIndex,
            pageSize: currentPageSize
        },
        success: function(data, sta){
            if(data.code == 1 && data.data.length){
                $("#tele-alertCnt").show();
                $("#tele-alertInfo").hide();
                var sourceData = data.data;
                var tpl = template('telelist-tpl', data);
                $("#teletext-list").html(tpl);

                //分页
                $('#pagination').pagination({
                    dataSource: new Array(data.count),
                    pageSize: currentPageSize,
                    // totalPage:2,
                    showGoInput: true,
                    showGoButton: true,
                    pageNumber: getHostUrl("pageIndex") || 1,
                    afterPageOnClick:function (e,index) {
                        location.href='?pageIndex='+index.trim();
                    },
                    afterPreviousOnClick:function (e,index) {
                        location.href='?pageIndex='+index.trim();
                    },
                    afterNextOnClick:function (e,index) {
                        location.href='?pageIndex='+index.trim();
                    },
                    afterGoButtonOnClick:function (e,index) {
                        var i = index.trim();
                        (i!='')&&(location.href='?pageIndex='+i);
                    },
                    callback: function () {

                    }
                })
            }else{
                $("#tele-alertCnt").hide();
                $("#tele-alertInfo").show();
            }
        },
        error: function(err){
            console.log("出现异常");
        }
    });

    //设置图文开启关闭状态
    $("#teletext-list").on("click", ".states-btn", function () {
        var self = $(this),
            teleId = self.closest("tr").data("ori"),
            sta = self.find(".fa").data("value");
        var shortUrl,
            preview = $("body").data("preview"),
            previewUrl = preview.split("activity/")[0];
        if(previewUrl.indexOf("qaapp.cn.m") > 0 || previewUrl.indexOf("preprod.cn.m") > 0){
            previewUrl = previewUrl.replace(/qaapp.cn.m/i, "qaappm.cn");
            previewUrl = previewUrl.replace(/preprod.cn.m/i, "preprodm.cn");
        }
        shortUrl = previewUrl + 'm/special/teletext/index.html?id='+teleId;
        if(sta == "off"){
            $.ajax({
                url: '/api/internal/sas/ImageText/setClose',
                type: 'post',
                dataType:"json",
                data: {"id": teleId, "short_url": shortUrl},
                success: function(data, sta){
                    if(data.code == 1){
                        self.closest("tr").find(".sta").html('<i class="fa fa-lock"></i>关闭');
                        self.html('<i class="fa fa-check" data-value="on"></i>开启');
                    }
                },
                error: function(err){
                    console.log("出现异常");
                }
            })
        }
        if(sta == "on"){
            $.ajax({
                url: '/api/internal/sas/ImageText/setOpen',
                type: 'post',
                dataType:"json",
                data: {"id": teleId, "short_url": shortUrl},
                success: function(data, sta){
                    if(data.code == 1){
                        self.closest("tr").find(".sta").html('<i class="fa fa-unlock"></i>开启');
                        self.html('<i class="fa fa-power-off" data-value="off"></i>关闭');
                    }
                },
                error: function(err){
                    console.log("出现异常");
                }
            })
        }
    });

    //删除图文
    $("#teletext-list").on("click", ".delete-btn", function () {
        if(confirm("确定要删除这篇图文吗？")){
            var self = $(this),
                teleId = self.closest("tr").data("ori");
            $.ajax({
                url: '/api/internal/sas/ImageText/del',
                type: 'post',
                dataType:"json",
                data: {"id": teleId},
                success: function(data, sta){
                    if(data.code == 1){
                        location.reload();
                    }
                },
                error: function(err){
                    console.log("出现异常");
                }
            })
        }else{
            return false;
        }
    });

    //预览弹窗
    $("#teletext-list").on("click", ".preview-btn", function () {
        var url,
            self = $(this),
            teleId = self.closest("tr").data("ori"),
            magento = $(".header-container").data("magento"),
            preview = $("body").data("preview");
        var previewUrl = preview.split("activity/")[0];
        if(previewUrl.indexOf("qaapp.cn.m") > 0 || previewUrl.indexOf("preprod.cn.m") > 0){
            previewUrl = previewUrl.replace(/qaapp.cn.m/i, "qaappm.cn");
            previewUrl = previewUrl.replace(/preprod.cn.m/i, "preprodm.cn");
        }
        url = previewUrl + 'm/special/teletext/index.html?id='+teleId;
        $(".teletextId > span").html(teleId);
        $('#qrCode').qrcode({width: 64,height: 64,text: url});
        $(".qr .p-link p").html(url);
        $(".preview-wrapper .preview").html('<iframe src="'+url+"?preview=1"+'" frameborder="0"></iframe>')
        $(".preview-wrapper").show();
    });
    //关闭预览
    $(".preview-wrapper .close").on("click",function(){
        $(".preview-wrapper .preview").html("");
        $('#qrCode').html("");
        $(".qr .link p").html("");
        $(".preview-wrapper").hide();
    });

    function getHostUrl (name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return (r[2]);
        return null;
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
        return o;
    };

})();