/*
 * @Author: Derek Zhou
 * @Date:   2016-11-22 16:06:18
 * @Last Modified by:   Derek Zhou
 * @Last Modified time: 2017-02-16 18:03:11
 */

(function() {
    // var saveCheck = Handlebars.compile($('#save-tpl').html());
    var errorMsg = {};
    var mcount;
    var material;
    var postSettingData = {};
    var urlCheck = new RegExp(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/);
    var saved = true;
    var materialList = Handlebars.compile($('#material-tpl').html());
    /**
     * show error or msg
     */
    function showResult() {
        if (errorMsg.msg == '') {
            var check = confirm('本次发布将在24小时后对所有用户生效，是否确认发布？');
            if (check) {
                return 1;
            } else {
                return 0;
            }
        } else {
            alert('发布失败!原因：' + errorMsg.msg);
            return 0;
        }
    }

    /**
     * set time to material
     */
    function setTime(data) {
        for (var i = 0; i < data.item.length; i++) {
            var days = new Date(data.item[i].update_time * 1000);
            days = days.getFullYear() + '年' + (days.getMonth() + 1) + '月' + days.getDate() + '日';
            for (var j = 0; j < data.item[i].content.news_item.length; j++) {
                data.item[i].content.news_item[j].time = days;
                data.item[i].content.news_item[j].media_id = data.item[i].media_id;
            }
        }
        return data;
    }
    /**
     * menu to json
     */
    function createMenu() {
        var button = [];
        items = 0;
        unchosen = 0;
        var data_first = $('#offac-setting .menu-item');
        data_first.each(function(index) {
            var level1 = {};
            var first_type = $(this).find('.menu-type option:selected').val();
            var first_url = $(this).find('.act').text();
            var first_media_id = $(this).find('.act').attr('data');
            if ($(this).find('input').val()) {
                var first_name = $(this).find('input').val();
            } else {
                if ($(this).attr('class') != 'menu-item grey') {
                    $(this).css('border', '1px solid red');
                    console.log('wrong');
                    unchosen++;
                }
            }
            if ($(this).attr('class') == 'menu-item grey') {
                level1.status = 'off';
            } else {
                level1.status = 'on';
                items++;
            }
            if ($(this).find('.menu-item-lv2').length != 0) {
                level1.name = first_name;
                level1.sub_button = [];
                var data_second = $(this).find('.menu-item-lv2');
                data_second.each(function(index) {
                    var level2 = {};
                    if ($(this).attr('class') == 'menu-item-lv2 grey') {
                        level2.status = 'off';
                    } else {
                        level2.status = 'on';
                    }
                    var second_type = $(this).find('.menu-type option:selected').val();
                    var second_url = $(this).find('.act').text();
                    var second_media_id = $(this).find('.act').attr('data');
                    var second_name = $(this).find('input').val();
                    if (second_type == 2) {
                        level2.type = 'media_id';
                        level2.media_id = second_media_id;
                        level2.media_title = second_url;
                    } else if (second_type == 1) {
                        level2.type = 'view';
                        level2.url = second_url;
                    } else {
                        level2.type = '';
                        level2.url = '';
                        level2.key = '';
                        level2.media_id = '';
                        level2.media_title = '';
                    }
                    if (!second_name || second_type == 0 || $($(this).find('.act.lv2')).text() == '') {
                        console.log('wrong3');
                        $(this).css('border', '1px solid red');
                        unchosen++;
                    }
                    level2.name = second_name;
                    level2.sub_button = [];
                    level1.sub_button.push(level2);
                })
                button.push(level1);
            } else {
                if (first_type == 2) {
                    level1.type = 'media_id';
                    level1.media_id = first_media_id;
                    level1.media_title = first_url;
                } else if (first_type == 1) {
                    level1.type = 'view';
                    level1.url = first_url;
                } else {
                    level1.type = '';
                    level1.url = '';
                    level1.key = '';
                    level1.media_id = '';
                    level1.media_title = '';
                }
                level1.name = first_name;
                level1.sub_button = [];
                button.push(level1);
                if ($(this).attr('class') != 'menu-item grey') {
                    if (first_type == 0 || $($(this).find('.act.lv1')).text() == '') {
                        unchosen++;
                        $(this).css('border', '1px solid red');
                        console.log('wrong2');
                    }
                }
            }
        })
        if (unchosen > 0) {
            errorMsg.msg = '存在菜单内容填写不全哦！';
        } else if (items > 3) {
            errorMsg.msg = '开启的主菜单个数超过3个啦！';
        } else {
            errorMsg.msg = '';
        }
        var settingdata = {};
        settingdata.button = button;
        settingdata = JSON.stringify(settingdata);
        console.log(settingdata,'this');
        //postdata
        var newbutton = button.filter(function(item) {
            return item.status == "on";
        });
        newbutton.forEach(function(item, index) {
            if (item.sub_button) {
                item.sub_button = item.sub_button.filter(function(item2) {
                    return item2.status == 'on';
                })
                item.sub_button.forEach(function(item3) {
                    delete item3.status;
                    delete item3.media_title;
                })
            }
            delete item.status;
            delete item.media_title;
        })
        postSettingData.button = newbutton;
        postSettingData = JSON.stringify(postSettingData);
        console.log(postSettingData,'that');
        return settingdata;
    };

    /**
     * change index
     */
    function addIndex() {
        var menu_list;
        if ($('#offac-setting .menu-item')) {
            menu_list = $('#offac-setting .menu-item');
        }
        menu_list.each(function(index) {
            $(this).find('.type').html(index + 1);
        })
    };
    /**
     * setup sortable
     */
    function setupSort(item) {
        item.sortable({
            handle: ".type",
            onUpdate: function() {
                addIndex();
            }
        })
    }

    /**
     * render menu
     */
    function renderMenu(data) {
        for (var i = 0; i < data.length; i++) {
            $('#offac-setting').append($('.add-menu').html());
            // $('#offac-setting').sortable({ handle: ".type" });
            setupSort($('#offac-setting'));
            if (data[i].status == 'off') {
                $('.menu-item:last').addClass('grey').removeClass('norm');
                $('.menu-item:last .pause.lv1').addClass('open').html('开启');
            }
            addIndex();
            $('.menu-item:last .name.lv1 input').val(data[i].name);
            if (data[i].sub_button.length > 0) {
                $('.menu-item:last .menu-type.lv1').css('display', 'none');
                for (var j = 0; j < data[i].sub_button.length; j++) {
                    $('.cover:last').sortable().append($('.add-menu-lv2').html());
                    $('.menu-item-lv2:last .name.lv2 input').val(data[i].sub_button[j].name);
                    if (data[i].sub_button[j].type == 'view') {
                        $('.menu-item-lv2:last .menu-type.lv2').val(1);
                        $('.menu-item-lv2:last .act.lv2').html(data[i].sub_button[j].url);
                    } else if (data[i].sub_button[j].type == 'media_id') {
                        $('.menu-item-lv2:last .menu-type.lv2').val(2);
                        $('.menu-item-lv2:last .act.lv2').html(data[i].sub_button[j].media_title);
                        $('.menu-item-lv2:last .act.lv2').attr('data',data[i].sub_button[j].media_id);
                    } else {
                        $('.menu-item-lv2:last .menu-type.lv2').val(0);
                    }
                    if (data[i].sub_button[j].status == 'off') {
                        $('.menu-item-lv2:last').addClass('grey');
                        $('.menu-item-lv2:last .fa-pause').removeClass('fa-pause').addClass('fa-play');
                    }
                }
            } else {
                if (data[i].type == 'view') {
                    $('.menu-item:last .menu-type.lv1').val(1);
                    $('.menu-item:last .act.lv1').html(data[i].url);
                } else if (data[i].type == 'media_id') {
                    $('.menu-item:last .menu-type.lv1').val(2);
                    $('.menu-item:last .act.lv1').html(data[i].media_title);
                    $('.menu-item:last .act.lv1').attr('data',data[i].media_id);
                } else {
                    $('.menu-item:last .menu-type.lv1').val(0);
                }
            }

        }
    };

    var lastData;


    //交互
    $(window).bind('beforeunload', function() {
        if (!saved) {
            return '您对菜单进行的修改尚未保存发布，确定要离开此页面吗';
        }
    })
    $('#offac-setting').on('change', function() {
        saved = false;
    })
    $('#add-new').on('click', function() {
        if ($('.menu-item').length >= 5) {
            $('#add-new').css('background-color', '#e0e0e0');
        } else if ($('.menu-item').length == 4) {
            $('#add-new').css('background-color', '#e0e0e0');
            $('#offac-setting').append($('.add-menu').html());
            setupSort($('#offac-setting'));
            addIndex();
        } else {
            $('#offac-setting').append($('.add-menu').html());
            // $('#offac-setting').sortable({ handle: ".type", change: function() { console.log(1) } });
            setupSort($('#offac-setting'));
            addIndex();
        }
    });
    $('#offac-setting').on('click', '.add-new-lv2', function() {
        $(this).closest('div').find('.menu-type.lv1').css('display', 'none');
        $(this).closest('div').find('.act.lv1').html("");
        if ($(this).parent().siblings('div').children('.menu-item-lv2').length >= 5) {
            alert("二级菜单上限为5个");
        } else {
            $(this).parent().siblings('div').append($('.add-menu-lv2').html());
            $(this).parent().siblings('div').sortable();
        }
    });
    $('#offac-setting').on('click', '.del-menu .delete', function() {
        if (confirm("确认删除该菜单吗？")) {
            $(this).closest('div').remove();
            $('#add-new').css('background-color', '#5cb85c');
            addIndex();
        }
    });
    $('#offac-setting').on('click', '.del-menu .delete-lv2', function() {
        if (confirm("确认删除该菜单吗？")) {
            if ($($(this).closest('div').siblings()).length == 0) {
                $(this).parents('.menu-item').find('.menu-type.lv1').css('display', 'inline-block').val(0);
                $(this).parents('.menu-item').find('.act').html("");
            }
            $(this).closest('div').remove();
        }
    });
    $('#offac-setting').on('change', '.menu-type', function() {
        if (this.value == 1) {
            $(this).closest('div').append($('.add-url').html());
            $('#wrapper').css('display', 'block');
            $('#url').css('display', 'block');
        } else if (this.value == 2) {
            // console.log(material);
            $(this).closest('div').append(materialList(material));
            $('#wrapper').css('display', 'block');
            $('#material').css('display', 'block');
        } else {
            $(this).parent().siblings('.act').html('');
        }
    });
    $('#offac-setting').on('click', '#access', function() {
        var inputLink = $(this).siblings('input').val();
        if (urlCheck.test(inputLink)) {
            $('#error').html('');
            $(this).parents('#url').siblings('.act').html(inputLink);
            $('#wrapper').css('display', 'none');
            $(this).parent('#url').remove();
        } else {
            $('#error').html('格式错误！');
        }
    });
    $('#offac-setting').on('click', '.ma-all', function() {
        $(this).addClass('chosen');
        $(this).siblings().removeClass('chosen');
        // $(this).closest('#material').siblings('.act').html($(this).find('.ma-title').html());
    });
    $('#offac-setting').on('click', '#ma-access', function() {
        if($(this).siblings('#materials').find('.ma-all.chosen .ma-title')){
            $(this).closest('#material').siblings('.act').html($(this).siblings('#materials').find('.ma-all.chosen .ma-title').html());
            $(this).closest('#material').siblings('.act').attr('data',$(this).siblings('#materials').find('.ma-all.chosen .ma-title').attr('data'));
            $(this).closest('#material').remove();
            $('#wrapper').css('display', 'none');
        }
        else{
            alert('请选择素材');
        }
    });
    $('#offac-setting').on('click','#ma-cancel',function(){
        $(this).closest('#material').siblings('.req').find('.menu-type').val(0);
        $(this).closest('#material').remove();
        $('#wrapper').css('display', 'none');
    })
    $('#offac-setting').on('click','#close-material',function(){
        $(this).closest('#material').siblings('.req').find('.menu-type').val(0);
        $(this).closest('#material').remove();
        $('#wrapper').css('display', 'none');
    })
    $('#offac-setting').on('click', '#close', function() {
        $('#wrapper').css('display', 'none');
        $(this).parent('#url').siblings('.req').find('.menu-type').val(0);
        // $(this).parent('#url').siblings('.act').html('');
        $(this).parent('#url').remove();
    })
    $('#offac-setting').on('click', '#cancel', function() {
        $('#wrapper').css('display', 'none');
        $(this).parent('#url').siblings('.req').find('.menu-type').val(0);
        // $(this).parent('#url').siblings('.act').html('');
        $(this).parent('#url').remove();
    })
    $('#offac-setting').on('click', '.pause.lv1', function() {
        $(this).toggleClass('open');
        if ($(this).attr('class') != 'pause lv1 open') {
            $(this).html('暂停');
            $(this).closest('div').insertAfter('#offac-setting .menu-item.norm:last');
            $(this).closest('div').addClass('norm');
            $(this).closest('div').removeClass('grey');
            addIndex();
        } else {
            $(this).html('开启');
            $(this).closest('div').addClass('grey');
            $(this).closest('div').removeClass('norm');
            $(this).closest('div').appendTo('#offac-setting');
            addIndex();
        }
    });
    $('#offac-setting').on('click', '.pause-lv2', function() {
        $(this).toggleClass('fa-pause');
        $(this).toggleClass('fa-play');
        $(this).closest('div').toggleClass('grey');
        if ($(this).attr('class') == 'pause-lv2 fa fa-play') {
            $(this).closest('div').appendTo($(this).parents('.cover'));
        } else {
            // $(this).closest('div').appendTo($(this).parents('.cover'));
        }

    });
    $('.shut-down').on('click', function() {
        $(this).toggleClass('reopen');
        if ($(this).attr('class') == 'shut-down reopen') {
            $(this).html("重新开启");
        } else {
            $(this).html("停用");
        }
    });


    //update menu list and save to database
    $('#save-menu').on('click', function() {
        var menudata = createMenu();
        var save = showResult();
        console.log(JSON.stringify(postSettingData), 'post data to wechat');
        if (save == 1) {
            $.ajax({
                url: '/api/wechat/offac/update',
                type: 'post',
                dataType: 'json',
                data: {
                    id: 1,
                    setting: menudata,
                    psetting: postSettingData
                },
                success: function(data) {
                    alert(data.msg);
                    if (data.code == 1) {
                        location.reload();
                        saved = true;
                    }
                }
            })
        }
    })

    //get menu json from database
    $.ajax({
        url: '/api/wechat/offac',
        type: 'get',
        dataType: 'json',
        data: { id: 1 },
        success: function(result) {
            console.log(result, 'my settings');
            lastData = result.data;
            lastData = JSON.parse(lastData);
            renderMenu(lastData.button);
        }
    })

    //get menu list from wechat
    $.ajax({
        url: '/api/wechat/offac/getmenu',
        type: 'get',
        dataType: 'json',
        success: function(result) {
            console.log(result, 'menu list');
        }
    })

    //get material count
    $.ajax({
        url: '/api/wechat/offac/materialCount',
        type: 'get',
        dataType: 'json',
        success: function(res) {
            console.log(res);
            mcount = res.data.news_count;
            console.log(mcount);
            $.ajax({
                url: '/api/wechat/offac/material',
                type: 'get',
                dataType: 'json',
                data: {
                    type: 'news',
                    pageSize: mcount || '20'
                },
                success: function(data) {
                    if (data.data) {
                        material = data.data;
                        material = setTime(material);
                        console.log(material);
                    }
                }
            })
        }
    })




})();
