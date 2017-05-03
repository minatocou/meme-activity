/**
 * Created by page.xia on 16/6/23.
 */
var validators={
    required:{
        check:function (val) {
            return val.trim();
        }
    },
    //注册手机号码长度及正则表达式验证
    phone:{
        message:"请输入11位正确的手机号码",
            check:function (val) {
            return /^(13[0-9]|17[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(val);
        }
    },

}