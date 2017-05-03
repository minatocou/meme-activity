!(function(){
    var userCpl = Handlebars.compile($("#user-tpl").html()),
        roletpl = Handlebars.compile($("#role-tpl").html());
    
    Handlebars.registerHelper('compare', function(left, operator, right, options) {
        if (arguments.length < 3) {
            throw new Error('Handlerbars Helper "compare" needs 2 parameters');
        }
        var operators = {
            '==':     function(l, r) {return l == r; },
            '===':    function(l, r) {return l === r; },
            '!=':     function(l, r) {return l != r; },
            '!==':    function(l, r) {return l !== r; },
            '<':      function(l, r) {return l < r; },
            '>':      function(l, r) {return l > r; },
            '<=':     function(l, r) {return l <= r; },
            '>=':     function(l, r) {return l >= r; },
            'typeof': function(l, r) {return typeof l == r; }
        };

        if (!operators[operator]) {
            throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
        }

        var result = operators[operator](left, right);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    
    $.ajax({
        type:"post",
        dataType:"json",
        url:"/api/author/getAll",
        beforeSend: function(){
            $(".user-list .loading").show();
            $(".user-list > table").hide();
        },
        success:function(data){

            if (parseInt(data.code)) {
                if (data.data.length != 0) {
                    $('#pagination-container').pagination({
                        dataSource: data.data,
                        callback: function (data, pagination) {
                            var html = userCpl(data);
                            $("#user-content").html(html);
                        }
                    })


                } else {
                    $("#user-content").html("暂时没有数据");
                }
            }
        },
        error: function(err){
            console.log("出现异常");
        },
        complete: function(){
            $(".user-list .loading").hide();
            $(".user-list > table").show();
        }
    });

    Handlebars.registerHelper("ischecked", function (val, options) {
        if (val =="0") {
            return "";
        } else if(val == "1"){
            return "checked";
        }
    });
    
    $(".newUser button").on("click",function(){
        $('#addModal').modal();
        $("#addModal").find("#add-user-form")[0].reset();
        $.ajax({
            type:"post",
            dataType:"json",
            url:"/api/role/getall",

            success:function(data){
                if(parseInt(data.code)){
                    $("#addModal .chk-group").html(roletpl(data))
                    $("#add-user-form").find(".valid-msg").html("");
                    $("#add-user-form").find("input").removeClass("valid");

                }

            },
            error: function(err){
                console.log("出现异常");
            }
        });

    });
    $("#addModal .add").on("click",function(){
        if($(this).hasClass("disable")){
            return;
        }

        var name = $("#add-user-form").find("input[name='realname']"),
            login = $("#add-user-form").find("input[name='username']"),
            pwd = $("#add-user-form").find("input[name='password']")

        if($.trim(name.val()) == ""){
            name.addClass("valid");
            name.next(".valid-msg").html("用户名不能为空");
            return false;
        }else{
            name.removeClass("valid");
            name.next(".valid-msg").html("");
        }
        if($.trim(login.val()) ==""){
            login.addClass("valid");
            login.next(".valid-msg").html("登录名不能为空");
            return false;
        }else{
            if(!/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(login.val())){
                login.addClass("valid");
                login.next(".valid-msg").html("登录名必须是邮箱");
                return false;
            }else{
                login.removeClass("valid");
                login.next(".valid-msg").html("");
            }
        }
        if($.trim(pwd.val()) == ""){
            pwd.addClass("valid");
            pwd.next(".valid-msg").html("密码不能为空");
            return false;
        }else{
            if($.trim(pwd.val()).length < 6){
                pwd.addClass("valid");
                pwd.next(".valid-msg").html("密码至少6位");
                return false;
            }else{
                pwd.removeClass("valid");
                pwd.next(".valid-msg").html("");
            }
        }
        $(this).addClass("disable");
        var self = this;
        var flag = false;
        $.ajax({
            type:"post",
            dataType:"json",
            async : false,
            url:"/api/account/check",
            data:{username:$.trim(login.val())},
            success:function(data){
                if(data.data){
                    alert("登录名已存在");
                    flag = true

                }
                $(self).removeClass("disable")
            },
            error: function(err){
                console.log("出现异常");
            }
        });
        if(flag) return false;

        $(this).addClass("disable");
        $.ajax({
            type:"post",
            dataType:"json",
            url:"/api/author/add",
            data:$("#add-user-form").serialize(),
            success:function(data){
                if(parseInt(data.code )){

                    window.location.reload();
                }
                $("#addModal").modal("hide");

            },
            error: function(err){
                console.log("出现异常");
            }
        });

    });


    $("#user-content").on("click", ".edit", function(event){
        var uid = $(event.target).closest("tr").attr("data-userid");
        var roleid = $(event.target).closest("tr").attr("data-roleid");
        $.ajax({
            type:"post",
            data: {"id": uid},
            dataType:"json",
            url:"/api/author/getInfoById",
            success:function (data) {
                console.log(data.data);
                 var template = Handlebars.compile($("#edit-content").html());
                 $("#editModal .modal-body").html(template(data.data));
                $("#editModal .modal-body :radio[value="+roleid+"]").prop("checked" , true);
                 $('#editModal').modal("show");
            }
        });
    });
    $(".new-username").on("blur" ,function(){
        var username = $(this).val()
            self = this;
        if (username){

            var param = {
                username:username
            };
            $.ajax({
                type: "post",
                url: "/api/account/check",
                data: param,
                dataType: "json",
                success: function (data) {
                    if(data.data){
                        $(self).addClass("valid");
                        $(self).next().html("用户名已存在")
                    }else{
                        $(self).removeClass("valid");
                        $(self).next().html("")
                    }
                }
            });
        }
    })
    $("#user-content").on("click", ".delete", function(event){
        if(!confirm("是否删除该权限?")){
            return false;
        }
        var uid = $(event.target).closest("tr").attr("data-userid");
        $.ajax({
            type:"post",
            dataType:"json",
            url:"/api/author/delUserById",
            data: {"id": uid},
            success:function(data){
                if(data.code == 1){
                    window.location.reload();
                }
            },
            error: function(err){
                console.log("出现异常");
            }
        });

        $('#deleteModal').modal('hide');
    });

    $("#search-btn").click(function(){
        var search = $("#search-name").val();
        if(search != ""){
            $.ajax({
                type:"post",
                dataType:"json",
                url:"/api/author/findUserByName",
                data: {"username": search},
                beforeSend: function(){
                    $(".user-list .loading").show();
                    $(".user-list > table").hide();
                },
                success:function(data){
                    if(data.code == 1){
                        if (data.data.length != 0) {
                            $('#pagination-container').pagination({
                                dataSource: data.data,
                                callback: function (data, pagination) {
                                    var html = userCpl(data);
                                    $("#user-content").html(html);
                                }
                            })


                        } else {
                            $("#user-content").html("暂时没有数据");
                        }
                        
                    }
                },
                error: function(err){
                    console.log("出现异常");
                },
                complete: function(){
                    $(".user-list .loading").hide();
                    $(".user-list > table").show();
                }
            });
        }else{
            window.location.reload();
        }
    });


    $('#editModal').on("click", ".btn.updateEdit.edit", function(){
        if( $(this).hasClass("disable") ){
            return;
        }
        var name = $("#edit-user-form").find("input[name='realname']"),
            login = $("#edit-user-form").find("input[name='username']");

        if($.trim(name.val()) == ""){
            name.addClass("valid");
            name.next(".valid-msg").html("用户名不能为空");
            return false;
        }else{
            name.removeClass("valid");
            name.next(".valid-msg").html("");
        }
        if($.trim(login.val()) ==""){
            login.addClass("valid");
            login.next(".valid-msg").html("登录名不能为空");
            return false;
        }else{
            if(!/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(login.val())){
                login.addClass("valid");
                login.next(".valid-msg").html("登录名必须是邮箱");
                return false;
            }else{
                login.removeClass("valid");
                login.next(".valid-msg").html("");
            }
        }
        
        
        var self = this;

        $(this).addClass("disable");

        $.ajax({
            type:"post",
            dataType:"json",
            url:"/api/author/update",
            data:$("#edit-user-form").serialize(),
            success:function(data){
                if(parseInt(data.code)){
                    window.location.reload();
                }
                $("#addModal").modal("hide");
            },
            error: function(err){
                console.log("出现异常");
            }
        });
    });

})();