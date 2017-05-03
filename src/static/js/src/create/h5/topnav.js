/**
 * Created by Jesse on 17/2/27.
 */
var topNavTab = $("#topNavTabAdd").html();
$("#addBtn").click(function () {
    if($("#topnav .topnav-body .form-group").length>=20){
        alert("最多添加20个tab");
        return false;
    }
    $("#topnav .topnav-body").append(topNavTab);
    var nav = $("#topnav .topnav-body .form-group").last(),
        length = $("#topnav .topnav-body .form-group").length;
    nav.data("index", length);
    $(nav.find("span")[0]).html("tab" + length);
});
$(".topnav-body").on("click",".fa-close",function () {
    $(this).parents(".form-group").remove();
    topnavEvent();
});