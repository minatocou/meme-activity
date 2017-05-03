/*
 * @Author: Derek Zhou
 * @Date:   2016-12-14 11:27:29
 * @Last Modified by:   Derek Zhou
 * @Last Modified time: 2017-02-07 18:44:09
 */
Vue.config.delimiters = ['${', '}']
Vue.config.unsafeDelimiters = ['{!!', '!!}']
var vue = new Vue({
    el: 'html',
    data: {
        matchTab: 1,
        unMatchTab: 1,
        subTab: 1,
        key_match: [],
        key_unmatch: null,
        subscribe: null,
        unmatch_ruleId: null,
        subscribe_ruleId: null,
        materials: null,
        showKey_m: false,
        showText: false,
        showImg: false,
        showVoice: false,
        showVideo: false,
        showNews: false,
        replyT: '',
        UMreply: '',
        Sreply: '',
        newKey: '',
        select: {
            key: null,
            match: null,
            img: null,
            text: null,
            news: null,
            voice: null,
            video: null,
            unmatch: null,
            subscribe: null,
            tab: null
        },
        lastMaterial: {
            type: null,
            pageIndex: 1,
            pageSize: 10,
        },
        count: {}
    },
    methods: {
        setTime: function(time) {
            var days = new Date(time * 1000);
            days = days.getFullYear() + '年' + (days.getMonth() + 1) + '月' + days.getDate() + '日';
            return days;
        },
        getMaterial: function(type, cb) {
            var $this = this;
            $.ajax({
                url: '/api/wechat/offac/material',
                type: 'get',
                dataType: 'json',
                data: {
                    type: type || 'image',
                    pageSize: $this.count[type] || '10',
                    pageIndex: '1'
                },
                success: function(data) {
                    $this.materials = data.data.item;
                    cb && cb(data);
                }
            })
        },
        getReplay: function() {
            var $this = this;
            $.ajax({
                url: '/api/wechat/getReply',
                type: 'get',
                dataType: 'json',
                success: function(data) {
                    if(data.data.key_match){
                        $this.key_match = data.data.key_match;
                        $this.matchTab = data.data.key_match[0].reply_on;
                    }else{
                        $this.key_match=[{
                            keyword: [],
                            reply_content: [],
                            rule_id: new Date().getTime().toString(36),
                            title: "",
                            open: true,
                            reply_type: 1,
                            reply_on: 1
                        }];
                        $this.matchTab = $this.key_match[0].reply_on;
                    }
                    if (data.data.key_unmatch && data.data.key_unmatch.length>0) {
                        $this.key_unmatch = data.data.key_unmatch;
                        $this.unmatch_ruleId = data.data.key_unmatch[0].rule_id;
                        $this.unMatchTab = data.data.key_unmatch[0].reply_on;
                    }else{
                        $this.key_unmatch=[{"rule_id":new Date().getTime().toString(36),"title":"","keyword":null,"reply_content":{},"reply_type":2,"reply_on":1}];
                        $this.unmatch_ruleId=$this.key_unmatch[0].rule_id;
                        $this.unMatchTab=$this.key_unmatch[0].reply_on;
                    }
                    if (data.data.subscribe && data.data.subscribe.length>0) {
                        $this.subscribe = data.data.subscribe;
                        $this.subscribe_ruleId = data.data.subscribe[0].rule_id;
                        $this.subTab = data.data.subscribe[0].reply_on;
                    }else{
                        $this.subscribe=[{"rule_id":new Date().getTime().toString(36),"title":"","keyword":null,"reply_content":{},"reply_type":3,"reply_on":1}];
                        $this.subscribe_ruleId=$this.subscribe[0].rule_id;
                        $this.subTab = $this.subscribe[0].reply_on;
                    }
                }
            })
        },
        //get material count
        getMaterialCount: function() {
            $this = this;
            $.ajax({
                url: '/api/wechat/offac/materialCount',
                type: 'get',
                dataType: 'json',
                success: function(data) {
                    $this.count = {
                        image: data.data.image_count,
                        news: data.data.news_count,
                        voice: data.data.voice_count,
                        video: data.data.video_count
                    }
                }
            })
        },
        //过滤类型
        filterRC: function(type, r) {
            var newArray = r.filter(function(item) {
                return item.type == type;
            })
            return newArray.length;
        },
        changeTag: function(t) {
            t.match_tag = (t.match_tag == 1 ? 0 : 1);
        },
        changeMatch: function(m) {
            var open = m.open ? false : true;
            Vue.set(m, 'open', open);
        },
        filterRT: function(match) {
            var $this = this;
            if(match.reply_type == 1){
                $this.select.match = match;
            }
            else if(match.reply_type == 2){
                $this.select.unmatch = match;
            }
            else{
                $this.select.subscribe = match;
            }
        },
        saveTabNum: function(tab) {
            var $this = this;
            $this.select.tab = tab;
        },
        editReply: function(data) {
            var $this = this;
            if($this.select.tab == 3){
                $this.select.subscribe.reply_content = data;
            }
            else if($this.select.tab == 2){
                $this.select.unmatch.reply_content = data;
            }
            else{
                $this.select.match.reply_content.push(data);
            }
        },
        shutdown: function() {
            var $this = this;
            if(confirm('关闭自动回复之后，将立即对所有用户生效。确认关闭？')){
                if($this.select.tab == 3){
                    var data = { 'subscribe': JSON.stringify($this.subscribe[0]),'reply_on': 0 };
                    $.ajax({
                        url: '/api/wechat/reply/save',
                        type: 'post',
                        dataType: 'json',
                        data: data,
                        success: function(res){
                            $this.subTab = 0;
                            alert('停用成功');
                        }
                    })
                }
                else if($this.select.tab == 2){
                    var data = { 'key_unmatch': JSON.stringify($this.key_unmatch[0]),'reply_on': 0 };
                    $.ajax({
                        url: '/api/wechat/reply/save',
                        type: 'post',
                        dataType: 'json',
                        data: data,
                        success: function(res){
                            $this.unMatchTab = 0;
                            alert('停用成功');
                        }
                    })
                }
                else{
                    var data = { 'key_match': JSON.stringify($this.key_match),'reply_on': 0 };
                    $.ajax({
                        url: '/api/wechat/reply/save',
                        type: 'post',
                        dataType: 'json',
                        data: data,
                        success: function(res){
                            $this.matchTab = 0;
                            alert('停用成功');
                        }
                    })
                }

            }
        },
        reopen: function() {
            var $this = this;
            if($this.select.tab == 3){
                var data = { 'subscribe': JSON.stringify($this.subscribe[0]),'reply_on': 1 };
                $.ajax({
                    url: '/api/wechat/reply/save',
                    type: 'post',
                    dataType: 'json',
                    data: data,
                    success: function(res){
                        $this.subTab = 1;
                        alert('开启成功');
                    }
                })
            }
            else if($this.select.tab == 2){
                var data = { 'key_unmatch': JSON.stringify($this.key_unmatch[0]),'reply_on': 1 };
                $.ajax({
                    url: '/api/wechat/reply/save',
                    type: 'post',
                    dataType: 'json',
                    data: data,
                    success: function(res){
                        $this.unMatchTab = 1;
                        alert('开启成功');
                    }
                })
            }
            else{
                var data = { 'key_match': JSON.stringify($this.key_match),'reply_on': 1 };
                $.ajax({
                    url: '/api/wechat/reply/save',
                    type: 'post',
                    dataType: 'json',
                    data: data,
                    success: function(res){
                        $this.matchTab = 1;
                        alert('开启成功');
                    }
                })
            }
        },

        //添加规则
        addM: function() {
            var temp = {
                keyword: [],
                reply_content: [],
                rule_id: new Date().getTime().toString(36),
                title: "",
                open: true
            }
            var $this = this;
            if($this.key_match.length < 10){
                $this.key_match.push(temp);
            }
            else{
                alert('最多只能设置10条规则');
            }
        },
        addKey: function(match) {
            var $this = this;
            $this.showKey_m = true;
            $this.newKey = '';
            $this.select.key = null;
            $this.select.match = match;
        },
        saveKey: function() {
            var $this = this;
            if ($this.select.key) {
                Vue.set($this.select.key, 'key', $this.newKey)
            } else {
                if($this.select.match.keyword.length < 10){
                    $this.select.match.keyword.push({
                        key: $this.newKey,
                        match_tag: 0
                    })
                }
                else{
                    alert('最多设置10个关键词');
                }
            }
            $this.showKey_m = false;
        },
        //
        editKey: function(key) {
            var $this = this;
            $this.showKey_m = true;
            $this.newKey = key.key;
            $this.select.key = key;
        },
        saveMatch: function(match) {
            var $this = this;
            match.open = false;
            if (match.keyword.length!=0 && match.title && match.reply_content.length!=0) {
                $.ajax({
                    url: '/api/wechat/reply/save',
                    type: 'post',
                    dataType: 'json',
                    data: { 'key_match': JSON.stringify($this.key_match),'reply_on': $this.matchTab },
                    success: function(data) {
                        alert(data.msg);
                    }
                })
            }
            else{
                alert('请确认填写无误后再保存');
                match.open = true;
            }

        },
        saveUnmatch: function(item) {
            // console.log(data,'asdasdas');
            var $this = this;
            $.ajax({
                url: '/api/wechat/reply/save',
                type: 'post',
                dataType: 'json',
                data: { 'key_unmatch': JSON.stringify(item),'reply_on': $this.unMatchTab },
                success: function(data) {
                    alert(data.msg);
                }
            })
        },
        saveSubscribe: function(item) {
            var $this = this;
            $.ajax({
                url: '/api/wechat/reply/save',
                type: 'post',
                dataType: 'json',
                data: { 'subscribe': JSON.stringify(item),'reply_on': $this.subTab },
                success: function(data) {
                    alert(data.msg);
                }
            })
        },
        checkReplyNum: function(match) {
            if(!match.reply_content.length || match.reply_content.length < 5){
                return true;
            }
            else{
                return false;
            }
        },
        //弹窗选择素材
        replyText: function(match, text) {
            var $this = this;
            if($this.checkReplyNum(match) || text){
                $this.select.match = match;
                $this.select.text = text;
                $this.replyT = text ? text.content : '';
                $this.showText = true;
            }
            else{
                alert('最多添加5条回复内容');
            }
        },
        replyImg: function(match) {
            var $this = this;
            if($this.checkReplyNum(match)){
                $this.filterRT(match);
                $this.getMaterial('image', function(data) {
                    $this.showImg = true;
                })
            }
            else{
                alert('最多添加5条回复内容');
            }
        },
        replyVoice: function(match) {
            var $this = this;
            if($this.checkReplyNum(match)){
                $this.filterRT(match);
                $this.getMaterial('voice', function(data) {
                    $this.showVoice = true;
                })
            }
            else{
                alert('最多添加5条回复内容');
            }

        },
        replyVideo: function(match) {
            var $this = this;
            if($this.checkReplyNum(match)){
                $this.filterRT(match);
                $this.getMaterial('video', function(data) {
                    $this.showVideo = true;
                })
            }
            else{
                alert('最多添加5条回复内容');
            }
        },
        replyNews: function(match) {
            var $this = this;
            if($this.checkReplyNum(match)){
                $this.filterRT(match);
                $this.getMaterial('news', function(data) {
                    $this.showNews = true;
                })
            }
            else{
                alert('最多添加5条回复内容');
            }
        },
        removeByIndex: function(i, array) {
            array.splice(i, 1);
        },
        removeRule: function(i,array,match) {
            array.splice(i, 1);
            $.ajax({
                url: '/api/wechat/reply/del',
                type: 'post',
                dataType: 'json',
                data: { 'key_match': JSON.stringify(match) },
                success: function(data) {
                    alert(data.msg);
                }
            })
        },

        //选择素材
        selectImg: function(media) {
            this.select.img = {
                type: 'image',
                content: media.media_id,
                name: media.name,
                url: media.url
            };
        },
        selectAudio: function(media) {
            this.select.voice = {
                type: 'voice',
                content: media.media_id,
                name: media.name,
                update_time: media.update_time
            }
        },
        selectVideo: function(media) {
            this.select.video = {
                type: 'video',
                content: media.media_id,
                name: media.name,
                update_time: media.update_time
            }
        },
        selectNews: function(media) {
            this.select.news = {
                type: 'news',
                content: {
                    Title: media.content.news_item[0].title,
                    Description: media.content.news_item[0].digest,
                    PicUrl: media.content.news_item[0].thumb_url,
                    Url: media.content.news_item[0].url
                },
                media_id: media.media_id,
                update_time: media.update_time,
            }
        },

        //修改配置
        checkImg: function() {
            var $this = this;
            $this.editReply($this.select.img);
            $this.showImg = false;
        },
        checkVoice: function() {
            var $this = this;
            $this.editReply($this.select.voice);
            $this.showVoice = false;
        },
        checkVideo: function() {
            var $this = this;
            $this.editReply($this.select.video);
            $this.showVideo = false;
        },
        checkNews: function() {
            var $this = this;
            $this.editReply($this.select.news);
            $this.showNews = false;
        },
        saveText: function() {
            var $this = this;
            if ($this.select.text) {
                $this.select.text.content = $this.replyT;
            } else {
                $this.select.match.reply_content.push({
                    type: 'text',
                    content: $this.replyT
                });
            }

            $this.showText = false;
        },
        //消息回复和被添加自动回复
        saveUText: function(item) {
            var $this = this;
            $this.select.unmatch = item;
            $this.select.unmatch.reply_content = {
                type: 'text',
                content: $this.UMreply
            };
            $this.saveUnmatch(item);
        },
        saveSText: function(item) {
            var $this = this;
            $this.select.subscribe = item;
            $this.select.subscribe.reply_content = {
                type: 'text',
                content: $this.Sreply
            };
            $this.saveSubscribe(item);
        }
    },
    created: function() {
        var $this = this;
        $this.getReplay();
        $this.getMaterialCount();
    }
})
