!(function($){

    var Regex = /^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/;   //验证邮箱正则

    $("#login-form").on("submit",function () {
        var username = $("input[name='username']").val();
        var password = $("input[name='password']").val();

        if(!username||!password){
            $(".error").html(" 用户名密码不能为空");
            return false;
        }

        if(!Regex.test(username)){
            $(".error").addClass("validate").html("请输入正确的邮箱地址");
            return false;
        }

        return true;
    });

    $("input[name='username']").on("blur",function () {
        var username = $("input[name='username']").val();
        if (username){
            if(!Regex.test(username)){
                $(".error").addClass("validate").html("请输入正确的邮箱地址");
                return false;
            }else{
                if($(".error").hasClass("validate")){
                    $(".error").removeClass("validate").html("");
                }
            }

            var param = {
                username:username
            };
            $.ajax({
                type: "post",
                url: "/api/account/check",
                data: param,
                dataType: "json",
                success: function (data) {
                    if(!data.data){
                        $(".error").addClass("validate").html("用户名不存在");
                    }
                }
            });
        }

    });

    $("#login-form input").focus(function(){
        if(!$(".error").hasClass("validate")){
            $(".error").html("");
        }
    });
    $(".username").blur(function(){
        $.ajax({
            url : "/api/account/check",
            type : "post",
            dataType: "json",
            data : {
                username : $(".username").val()
            },
            success : function(){
                console.log()
            }
        })
    })

})(jQuery);