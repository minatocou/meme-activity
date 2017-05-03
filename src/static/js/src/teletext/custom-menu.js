/**
 * Created by yate on 2017/3/8.
 */
(function () {

    // 获取 wangEditor 构造函数和 jquery
    var E = window.wangEditor;
    var $ = window.jQuery;

    // 用 createMenu 方法创建菜单
    E.createMenu(function (check) {
        var menuId = 'intoDiv';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 创建 menu 对象
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: "插入商品",

            // 正常状态和选中装下的dom对象，样式需要自定义
            $domNormal: $('<a href="#" tabindex="-1"><i class="wangeditor-menu-img-newspaper"></i></a>'),
            $domSelected: $('<a href="#" tabindex="-1" class="selected"><i class="wangeditor-menu-img-newspaper"></i></a>')
        });

        // 创建 dropPanel
        var $content = $('<div></div>');
        var $div1 = $('<div style="margin:15px 10px 5px 10px;" class="clearfix"></div>');
        var $div2 = $div1.clone();
        var $div3 = $div1.clone().css('margin', '0 10px');
        var $skuInput = $('<input type="text" class="block" placeholder="填写商品SKU">');
        var $tips = $('<div style="height: 14px; color: red; font-size: 12px; margin-top: 5px;"></div>');
        var $imgLabel = $('<label><img style="width: 100%;" src="/img/static/img/img-placehold.jpg"></label>');
        var $btnSubmit = $('<button class="right">' + lang.submit + '</button>');
        var $btnCancel = $('<button class="right gray">' + lang.cancel + '</button>');

        $div1.append($skuInput).append($tips);
        $div2.append($imgLabel);
        $div3.append($btnSubmit).append($btnCancel);
        $content.append($div1).append($div2).append($div3);

        menu.dropPanel = new E.DropPanel(editor, menu, {
            $content: $content,
            width: 300
        });

        // 定义click事件
        menu.clickEvent = function (e) {
            var menu = this;
            var dropPanel = menu.dropPanel;

            // -------------隐藏----------------
            if (dropPanel.isShowing) {
                dropPanel.hide();
                return;
            }

            // -------------显示----------------

            // 重置 input
            $skuInput.val("");
            $tips.html("");

            // 获取 text
            var text = '';
            text && $skuInput.val(text);

            // 显示（要设置好了所有input的值和属性之后再显示）
            dropPanel.show();
        };

        // 『取消』 按钮
        $btnCancel.click(function (e) {
            e.preventDefault();
            menu.dropPanel.hide();
        });

        // 『确定』按钮
        $btnSubmit.click(function (e) {
            e.preventDefault();
            var linkHtml;

            // 获取数据
            var url = $.trim($skuInput.val());
            if (url) {
                //获取商品信息
                $.ajax({
                    url: '/api/internal/sas/ImageText/getProductInfo',
                    type: 'post',
                    dataType:"json",
                    data: {"sku": url},
                    success: function(data, sta){
                        if(data.code == 1){
                            var source = data.data;
                            linkHtml = '<div class="teletext-prd" data-val="'+url+'"> ' +
                                '<div class="tele-cover"></div>' +
                                '<div class="teletext-cnt">' +
                                '<div class="teletext-place"> ' +
                                '<div class="img"></div> ' +
                                '<div class="foot"></div> ' +
                                '</div> ' +
                                '<div class="title">sku: '+url+'</div> ' +
                                '<i class="del-prd"></i> ' +
                                '</div>'+
                                '</div>';
                            $tips.html("");
                            editor.command(e, 'insertHtml', linkHtml);
                            menu.dropPanel.hide();

                            //显示skus
                            var skuHtml = '<span class="skus-item">'+url+'<i class="del-prd"></i></span>';
                            $("#tele-skus").append(skuHtml);
                        }else{
                            $tips.html("未找到相关SKU商品内容。");
                            console.log("出现异常");
                        }
                    },
                    error: function(err){
                        console.error("出现异常");
                    }
                })
            }else{
                return false;
            }
            if (E.userAgent.indexOf('Firefox') > 0) {
                linkHtml += '<span>&nbsp;</span>';
            }
        });

        // 增加到editor对象中
        editor.menus[menuId] = menu;
    });

})();