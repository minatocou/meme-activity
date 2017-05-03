/**
 * Created by carina on 17/3/27.
 */
$.ajaxSetup({cache: false});
//ajax过渡
$(document).ajaxStart(function () {
      $('.ajax-loading-backdrop').show();
    }).ajaxStop(function () {
      $('.ajax-loading-backdrop').hide();
    });
var appKey = $('body').data("rongyun-appkey");
// 初始化
// RongIMClient.init(appkey, [dataAccessProvider],[options]);
// appkey:官网注册的appkey。
// dataAccessProvider:自定义本地存储方案的实例，不传默认为内存存储，自定义需要实现WebSQLDataProvider所有的方法，此参数必须是传入实例后的对象。
RongIMLib.RongIMClient.init(appKey);


// 设置连接监听状态 （ status 标识当前连接状态 ）
// 连接状态监听器
RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
        switch (status) {
            case RongIMLib.ConnectionStatus.CONNECTED:
                console.log('链接成功');
                break;
            case RongIMLib.ConnectionStatus.CONNECTING:
                console.log('正在链接');
                break;
            case RongIMLib.ConnectionStatus.DISCONNECTED:
                console.log('断开连接');
                break;
            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                console.log('其他设备登录');
                break;
            case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                console.log('域名不正确');
                break;
            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                console.log('网络不可用');
                break;
        }
    }});

function showMsg(obj) {
    var container = $('.message-list-container');
    var children = container.children();
    if(children.length >= 500){
        $(children[0]).remove();
    }
    container.append(template('message-item-tmpl',obj));
    setTimeout(function () {
        container[0].scrollTop = container[0].scrollHeight;
    });
}

function getUserName(tel,obj) {
    tel && typeof Number(tel) === 'number' && (tel = tel.toString().replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"));
    tel && (obj.user = obj.user + '('+ tel +')');
}

var msgMap = {
    // 'MBox:InOutChatRoomMsg': function (content) {
    //     var map = {0: '加入了房间',1: '退出了房间'};
    //     var obj = {
    //         msg: map[content.type],
    //         user: content.name?content.name:content.userNames?content.userNames[0]:content.userIds[0]
    //     };
    //     showMsg(obj);
    // },
    // 'MBox:LikeMsg': function (content) {
    //     var obj = {
    //         msg: '点了个赞！',
    //         user: content.name
    //     };
    //     // getUserName(content.extra,obj);
    //     showMsg(obj);
    // },
    'MBox:TotalInoutMsg': function (content) {
        var map = {0: '加入了房间',1: '退出了房间'};
        ((content.userNames && content.userNames.length > 1) || (content.userIds && content.userIds.length > 1)) ? (map[content.type] = '等一群蜜米们' + map[content.type]):'';
        var obj = {
            msg: map[content.type],
            user: content.name?content.name:content.userNames?content.userNames[0]:content.userIds[0]
        };
        // getUserName(content.extra,obj);
        showMsg(obj);
    },
    'MBox:SyncChatRoomInfo': function (content) {
        $.each(content,function (key,value) {
            $('[data-bind="'+ key +'"]').text(value);
        });
    }
}

// 消息监听器
RongIMClient.setOnReceiveMessageListener({
    // 接收到的消息
    onReceived: function (message) {
        // 判断消息类型
        switch(message.messageType){
            case RongIMClient.MessageType.TextMessage:
                console.log(message,'');
                // message.content.content => 消息内容
                var obj = {
                    msg: message.content.content.replace(//g,'\\表情'),
                    user: message.content.user && (message.content.user.name || message.content.user.id) || '游客',
                    admin: message.content.user && message.content.user.id && message.content.user.id === $('.live-room-name').text().trim() + '_admin'
                };
                getUserName(message.content.extra,obj);
                showMsg(obj);
                break;
            case RongIMClient.MessageType.VoiceMessage:
                // 对声音进行预加载
                // message.content.content 格式为 AMR 格式的 base64 码
                break;
            case RongIMClient.MessageType.ImageMessage:
                // message.content.content => 图片缩略图 base64。
                // message.content.imageUri => 原图 URL。
                console.log(message);
                break;
            case RongIMClient.MessageType.DiscussionNotificationMessage:
                // message.content.extension => 讨论组中的人员。
                break;
            case RongIMClient.MessageType.LocationMessage:
                // message.content.latiude => 纬度。
                // message.content.longitude => 经度。
                // message.content.content => 位置图片 base64。
                break;
            case RongIMClient.MessageType.RichContentMessage:
                // message.content.content => 文本消息内容。
                // message.content.imageUri => 图片 base64。
                // message.content.url => 原图 URL。
                console.log(message);
                break;
            case RongIMClient.MessageType.InformationNotificationMessage:
                // do something...
                break;
            case RongIMClient.MessageType.ContactNotificationMessage:
                // do something...
                break;
            case RongIMClient.MessageType.ProfileNotificationMessage:
                // do something...
                break;
            case RongIMClient.MessageType.CommandNotificationMessage:
                // do something...
                break;
            case RongIMClient.MessageType.CommandMessage:
                // do something...
                break;
            case RongIMClient.MessageType.UnknownMessage:
                'MBox:SyncChatRoomInfo' != message.objectName&& console.log(message);
                msgMap[message.objectName] && msgMap[message.objectName](message.content.message.content);
                break;
            default:
            // do something...
        }
    }
});
$('.sendBtn').click(function () {
    if($('.adminInput').val().length>100){
        alert("管理员发言文字长度不能超过100!");
        return;
    }
    $('.admin-form').submit();
});
//发送消息
$('.admin-form').submit(function (e) {
    e.preventDefault();
    if(!$('.adminInput').val().trim()){
        alert('请输入文本哦！');
        $('.adminInput').val('');
        return ;
    }
    // 定义消息类型,文字消息使用 RongIMLib.TextMessage
    var msg = new RongIMLib.TextMessage({content: $('.adminInput').val(),user: {name: '直播管理员', id: $('.live-room-name').text().trim() + '_admin'},extra:"附加信息"});
    //或者使用RongIMLib.TextMessage.obtain 方法.具体使用请参见文档
    //var msg = RongIMLib.TextMessage.obtain("hello");
    var conversationtype = RongIMLib.ConversationType.CHATROOM; // 私聊
    var targetId = chatRoomId; // 目标 Id
    RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
            // 发送消息成功
            onSuccess: function (message) {
                //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                console.log("Send successfully");
                $('.adminInput').val('');
                var obj = {
                    msg: message.content.content,
                    user: message.content.user && message.content.user.name || message.content.user.id,
                    admin: message.content.user.id === $('.live-room-name').text().trim() + '_admin'
                }
                showMsg(obj);
            },
            onError: function (errorCode,message) {
                var info = '';
                switch (errorCode) {
                    case RongIMLib.ErrorCode.TIMEOUT:
                        info = '超时';
                        break;
                    case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                        info = '未知错误';
                        break;
                    case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                        info = '在黑名单中，无法向对方发送消息';
                        break;
                    case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                        info = '不在讨论组中';
                        break;
                    case RongIMLib.ErrorCode.NOT_IN_GROUP:
                        info = '不在群组中';
                        break;
                    case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                        info = '不在聊天室中';
                        break;
                    default :
                        info = '其他未知错误';//x;
                        break;
                }
                console.log('发送失败:' + info);
            }
        }
    );
});

//获取token
var liveRoomId = $('.liveCon').find("input[name='liveRoomId']").val(); // 聊天室 Id。
var chatRoomId = $('.liveCon').find("input[name='chatroomId']").val(); // 聊天室 Id。
var param = {
    // userId:'',
    // name:'',
    // portraitUri:''
    liveRoomId: chatRoomId
};
$.ajax({
    type:'get',
    data:param,
    url: '/api/internal' +'/sas/live/getChatToken',
    dataType:'json'
})
.then(function (data) {
    if(!data.code==1){
        alert(data.msg);
    }else{
        // 连接融云服务器。
        RongIMClient.connect(data.data.chatToken, {
            onSuccess: function(userId) {
                console.log("Login successfully." + userId);

                var recentCount = 50;// 拉取最近聊天最多 50 条。
                console.log(RongIMClient.getInstance());
                RongIMClient.getInstance().joinChatRoom(chatRoomId, recentCount, {
                    onSuccess: function() {
                        // 加入聊天室成功。
                        console.log("加入聊天室成功")
                    },
                    onError: function(error) {
                        // 加入聊天室失败
                        console.log("加入聊天室失败")
                    }
                });

                //获取信息
                var chatCount = 10; // 获取聊天室人数 （范围 0-20 ）
                var order = RongIMLib.GetChatRoomType.REVERSE;// 排序方式。
                RongIMClient.getInstance().getChatRoomInfo(chatRoomId, chatCount, order, {
                    onSuccess: function(chatRoom) {
                        // chatRoom => 聊天室信息。
                        // chatRoom.userInfos => 返回聊天室成员。
                        // chatRoom.userTotalNums => 当前聊天室总人数。

                        console.log(JSON.stringify(chatRoom));
                        console.log(chatRoom.userInfos);
                        console.log(chatRoom.userTotalNums);
                    },
                    onError: function(error) {
                        // 获取聊天室信息失败。
                    }
                });

                /*var messageCount = 10; // 拉取的条数 count <= 200
                var messageOrder = 1;  // 1正序；0倒序
                RongIMClient.getInstance().getChatRoomHistoryMessages(chatRoomId, messageCount, messageOrder, {
                    onSuccess: function(list, hasMore) {
                        // list => 消息数组
                        // hasMore => 是否有更多的历史消息
                        console.log(JSON.stringify(list));
                        console.log(JSON.stringify(hasMore));
                    },
                    onError: function(error) {

                    }
                });*/

            },
            onTokenIncorrect: function() {
                console.log('token无效');
            },
            onError:function(errorCode){
                var info = '';
                switch (errorCode) {
                    case RongIMLib.ErrorCode.TIMEOUT:
                        info = '超时';
                        break;
                    case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                        info = '未知错误';
                        break;
                    case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                        info = '不可接受的协议版本';
                        break;
                    case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                        info = 'appkey不正确';
                        break;
                    case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                        info = '服务器不可用';
                        break;
                }
                console.log(errorCode);
            }
        });
    }
});

