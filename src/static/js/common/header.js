!(function($){

    $(".private-container").on("click",">ul>li",function(event){
        if($(this).hasClass("current")){
            $(this).removeClass("current").find(".list").hide();
        }else{
            $(this).addClass("current").siblings().removeClass("current");
            $(this).find(".list").show().end()
                .siblings().find(".list").hide();
        }
        event.stopPropagation();
    });

    $("body").on("click",function(){
        $(".private-container>ul>li.current").removeClass("current").end().find(".list").hide();
    });

})(jQuery);