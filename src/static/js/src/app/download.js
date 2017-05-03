/*
 * @Author: Derek Zhou
 * @Date:   2017-02-13 13:22:48
 * @Last Modified by:   derek
 * @Last Modified time: 2017-02-23 18:19:49
 */

Vue.config.delimiters = ['${', '}']
Vue.config.unsafeDelimiters = ['{!!', '!!}']
var vue = new Vue({
    el: 'html',
    data: {
        list: null,
        clicked: 1,
    },
    methods: {
        getDownloadSetting: function() {
            var $this = this;
            $.ajax({
                url: '/api/appdownload/list',
                type: 'get',
                dataType: 'json',
                success: function(data){
                    console.log(data);
                    $this.list = data.data;
                }
            })
        },
        saveDownloadSetting: function(index) {
            var $this = this;
            $this.clicked = 0;
            var channel = $this.list[index];
            var sameChannel = 0;
            console.log(channel);
            for(var i=0;i<$this.list.length;i++){
                if(i == index){
                    continue;
                }
                if(channel.urlKey == $this.list[i].urlKey){
                    alert('存在重复渠道号，请修正~');
                    sameChannel = 1;
                    break;
                }
            }
            if(!sameChannel){
                if(channel.urlKey.trim()){
                    $.ajax({
                        url: '/api/appdownload/save',
                        type: 'post',
                        dataType: 'json',
                        data: {channel: JSON.stringify(channel)},
                        success: function(data) {
                            console.log(data);
                            alert(data.msg);
                            $this.clicked = 1;
                            location.reload();
                        }
                    })
                }else{
                    alert('请填写渠道号');
                    $this.clicked = 1;
                }
            }
        },
        sth: function() {

        },
        delDownloadSetting: function(index) {
            var $this = this;
            var channel = $this.list[index];
            if(channel && channel.urlKey){
                if(confirm('确认删除该渠道吗？')){
                    $.ajax({
                        url: '/api/appdownload/del',
                        type: 'post',
                        dataType: 'json',
                        data: {channel: JSON.stringify(channel)},
                        success: function(data) {
                            console.log(data);
                            alert(data.msg);
                            location.reload();
                        }
                    })
                }
            }
            else{
                $this.list.pop($this.list[index]);
            }
        },
        addChannel: function() {
            var $this = this;
            var temp = {
                urlKey: "",
                ios: "",
                android: "",
                wechat: "",
                id: ""
            }
            $this.list.push(temp);
        }
    },
    created: function() {
        var $this = this;
        $this.getDownloadSetting();
    }
})
