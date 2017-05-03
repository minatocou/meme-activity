/**
 * Created by carina on 17/3/9.
 */
$(document).ready(function () {

    var videoid = $(".videoForm input[name=video_id]").val();
    if(videoid){
        $.ajax({
            type:"get",
            dataType:"json",
            url:"/api/internal/sas/tag/getObjTag?scene=2&id="+videoid,
            success:function(data){
                if(data.code==1){
                    var selectedTags='';
                    var tags = [];
                    if(data.data.length>0){
                        for(var i=0;i<data.data.length;i++){
                            selectedTags  += '<li data-tagid='+ data.data[i].tag_id+'>'+data.data[i].label+'<i class="close-btn">×</i></li>';
                            tags.push(data.data[i].tag_id);
                        }
                    }
                    $(".label-list .clearfix").append(selectedTags);
                    $('.videoForm').find('input[name=tags]').val(tags.toString());
                }else if(data.code==0){
                    alert(data.msg);
                }
            },
            error: function(err){
                console.log("出现异常");
            }
        });
    }

    $.ajax({
        type:"get",
        dataType:"json",
        url:"/api/internal/sas/tag/getComponentCategory?scene=2&type=1",
        success:function(data){
            if(data.code==1){
                var labelCategory='';
                if(data.data.length>0){
                    for(var i=0;i<data.data.length;i++){
                        labelCategory  += '<li data-categoryid='+ data.data[i].category_id+'>'+data.data[i].name+'</li>';
                    }
                    $(".label-category").append(labelCategory);
                    $(".label-category li:first-child").addClass('current');

                    //第一个分类的列表
                    var firstCateId = data.data[0].category_id;
                    $.ajax({
                        type:"get",
                        dataType:"json",
                        url:"/api/internal/sas/tag/getComponentTag?scene=2&category_id="+firstCateId,
                        success:function(data){
                            if(data.code==1){
                                var labelTags='';
                                if(data.data.length>0){
                                    for(var i=0;i<data.data.length;i++){
                                        labelTags  += '<li data-tagid='+ data.data[i].tag_id+'>'+data.data[i].label+'</li>';
                                    }
                                }
                                $(".label-tags").append(labelTags);
                                initSelectTags();
                            }else if(data.code==0){
                                alert(data.msg);
                            }
                        },
                        error: function(err){
                            console.log("出现异常");
                        }
                    });

                }
            }else if(data.code==0){
                alert(data.msg);
            }
        },
        error: function(err){
            console.log("出现异常");
        }
    });

    $('.label-category').on('click','li',function(){
        if(!$(this).hasClass('current')){
            $(this).addClass('current').siblings().removeClass('current');
            var categoryId = $(this).data('categoryid');
            $.ajax({
                type:"get",
                dataType:"json",
                url:"/api/internal/sas/tag/getComponentTag?scene=2&category_id="+categoryId,
                success:function(data){
                    if(data.code==1){
                        var labelTags='';
                        if(data.data.length>0){
                            for(var i=0;i<data.data.length;i++){
                                labelTags  += '<li data-tagid='+ data.data[i].tag_id+'>'+data.data[i].label+'</li>';
                            }
                        }

                        $(".label-tags").html('');
                        $(".label-tags").append(labelTags);
                        initSelectTags();

                    }else if(data.code==0){
                        alert(data.msg);
                    }
                },
                error: function(err){
                    console.log("出现异常");
                }
            });
        }

    });

    $('.label-tags').on("click",'li',function(){
        var thisTagId = $(this).data('tagid');
        var tagData = '[data-tagid='+thisTagId+']';
        $('.label-list .clearfix').find(tagData).remove();
        if($(this).hasClass('current')){
            $(this).removeClass('current');
        }else{
            $(this).addClass('current');
            var thisTag = $(this).clone();
            $(thisTag).append("<i class='close-btn'>×</i>");
            $('.label-list .clearfix').append(thisTag);
        }
        getVideoTags();
    });


    $(".label-list .clearfix").on("click",'.close-btn',function(){
        $(this).parent('li').remove();
        getVideoTags();
        initSelectTags();
    });

    function initSelectTags(){
        var selectedTags = $('.videoForm').find('input[name=tags]').val();
        if(selectedTags){
            var tagsArr = selectedTags.split(',');
            var currentTags = $('.label-tags li');
            for(var i =0;i<currentTags.length;i++){
                var tagID = $(currentTags[i]).data('tagid');
                for(var j = 0;j<tagsArr.length;j++){
                    if(tagID==tagsArr[j]){
                        $(currentTags[i]).addClass('current');
                    }else{
                        $(currentTags[i]).removeClass('current');
                    }
                }
            }
        }else{
            $('.label-tags li').removeClass('current');
        }
    }

    function getVideoTags (){
        var tags = $('.label-list .clearfix li');
        var tagsArr=[];
        var tagsVal;
        if(tags.length>0){
            for(var i =0;i<tags.length;i++){
                var tag = $(tags[i]).data('tagid');
                tagsArr.push(tag);
            }

            tagsVal = tagsArr.toString();
            $('.videoForm').find('input[name=tags]').val(tagsVal);
        }else{
            $('.videoForm').find('input[name=tags]').val('');
        }
    }

    /** 标签展开收起**/
    $(".label-more").click(function () {
        var self = $(".label-more");
        if(self.hasClass("open")){
            self.html('更多<i class="fa fa-angle-right"></i>');
            self.removeClass("open");
        }else{
            self.html('收起<i class="fa fa-angle-down"></i>');
            self.addClass("open");
        }
    });

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


    $(".videoForm").on("click",".close-btn",function(){
        $('.videoForm').find('.imgBox').removeClass('showImg');
        $('.videoForm').find('input[name=img_url]').val('');
        $('.imgUrl').attr('src','');
    });

    $(".videoCon").on("click",".saveVideo",function(){
        if(!$(this).hasClass('disable')){
            $(this).addClass("disable");
            var param = $(".videoForm").serializeObject();
            if(validate(param)){
                $.ajax({
                    type:"post",
                    dataType:"json",
                    url:"/api/internal/sas/video/save",
                    data:param,
                    success:function(data){
                        if(data.code==1){
                            alert(data.msg);
                            window.location.href='/video/add/'+data.data.video_id;
                        }else if(data.code==0){
                            var errorSku='';
                            if(data.data.length>0){
                                for(var i =0;i<data.data.length;i++){
                                    errorSku += data.data[i]+' ';
                                }
                            }
                            alert(data.msg+":"+errorSku);

                        }
                        $(".saveVideo").removeClass("disable");
                    },
                    error: function(err){
                        console.log("出现异常");
                    }
                });

            };
        }

    });

    function validate(data){
        if($('.videoForm .waiting').is(':visible')){
            alert('视频未压缩完成,请在压缩完成保存!');
            $(".saveVideo").removeClass("disable");
            return;
        }
        if($('.videoForm .pro').is(':visible')){
            alert('视频正在上传,请上传并压缩完成保存!');
            $(".saveVideo").removeClass("disable");
            return;
        }
        if($('.videoForm .fail').is(':visible')){
            alert('视频压缩失败,请重新上传!');
            $(".saveVideo").removeClass("disable");
            return;
        }
        if(!$.trim(data.video_url)){
            alert('请上传视频!');
            $(".saveVideo").removeClass("disable");
            return;
        }
        if(!$.trim(data.title)){
            alert('请填写视频名称!');
            $(".saveVideo").removeClass("disable");
            return;
        }
        if(!$.trim(data.status)){
            alert('请选择视频状态!');
            $(".saveVideo").removeClass("disable");
            return;
        }
        if(data.category == '请选择'){
            alert('请选择视频分类!');
            $(".saveVideo").removeClass("disable");
            return;
        }
        if(!$.trim(data.short_desc)){
            alert('请填写简介!');
            $(".saveVideo").removeClass("disable");
            return;
        }
        if(!$.trim(data.tags)){
            alert('请选择标签!');
            $(".saveVideo").removeClass("disable");
            return;
        }
        return true;
    }

});