!(function ($) {

    $(".first-level-list li>a").on("click", function () {
        var parent_li = $(this).parent("li");
        if ($(parent_li).hasClass("current")) {
            if ($(parent_li).find(">a .fa-angle-left").length) {
                $(parent_li).find(">div").show();
                $(this).find("span").addClass("fa-angle-down").removeClass("fa-angle-left");
            } else {
                $(parent_li).find(">div").hide();
                $(this).find("span").removeClass("fa-angle-down").addClass("fa-angle-left");
            }
        } else {
            $(parent_li).addClass("current").find(">div").show().end()
                .siblings().removeClass("current").find("div").hide().find(".current").removeClass("current");
            $(this).find("span").addClass("fa-angle-down").removeClass("fa-angle-left").end()
                .parent("li").siblings().find(">a span.fa").removeClass("fa-angle-down").addClass("fa-angle-left");

        }
    });
    $('a[href="' + location.pathname + '"]').closest('.first-level-list>li').find('.toggle-active').click();
})(jQuery);

var KEY = "90upW884ZQn5H0x4qAb2A7DN3AYWW91y";
/**
 * 验签：ajax与后台通信的安全验证
 * @param params  key
 * params:ajax参数 类型：对象
 * key:验证key
 * @returns {string}
 */
function makeSign(params, key) {
    var ary = Object.keys(params),
        str = "";
    ary.sort(function (a, b) {
        return a.localeCompare(b);
    });
    for (var i = 0; i < ary.length; i++) {
        str += ary[i] + "=" + params[ary[i]] + "&";
    }
    str += "secret" + "=" + key;
    return hex_md5(str);
}
