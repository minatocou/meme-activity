/**
 * Created by page.xia on 17/4/18.
 */
var v={
    getNative: function (obj) {
        return 'app_json=' + encodeURIComponent(JSON.stringify(obj))
    },
    getAppView: function (url, type) {
        var $this = this;
        var param = {
            domain: 'h5page',
            action: 'to_h5page',
            data: {url: url}
        };
        if(type==1){
            param = {
                domain: "product",
                action: "detail",
                data: {
                    productId: url
                }
            }
            return 'http://m.cn.memebox.com/m/productDetails/productDetails.html?p='+url+'&'+$this.getNative(param);
        }else{
            var b=/\?/.test(url)?'&':'?';
            return url+b+$this.getNative(param);
        }


    },
}
$(function(){
    $('#convertId').click(function () {
        var id=$('#productId').val();
        var type=$('#type').val();
        $('#out').html(v.getAppView(id,type))
    })
})